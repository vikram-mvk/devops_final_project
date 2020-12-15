from better_profanity import profanity
from rejson import Client, Path
from timeloop import Timeloop
from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson.json_util import dumps, loads
from flask_cors import CORS, cross_origin
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime
from flask_api import status

import os
# start timeloop
tl = Timeloop()

# connect to queue
rj_queue = Client(host='localhost', port=1111, decode_responses=True)

#Connect to cache
rj_cache = Client(host='localhost', port=1112, decode_responses=True)
cache_limit = 5

#connect to db
client = MongoClient('localhost', 27017)
db = client.mydb


#flask settings
app = Flask(__name__) # initialize the flask app
cors = CORS(app) 
app.config['CORS_HEADERS'] = 'Content-Type'
app.config["JWT_SECRET_KEY"] = "vikramflaskjwttoken"
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False
JWTManager(app)


# checking if array of json present in queue? if no then will set to []
arr=rj_queue.jsonget('tweets', Path.rootPath())
if arr is not None:
  print ("array is already present in queue with length: {}".format(len(arr)))
  print(arr)
else:
  print("initializing an empty array in rj_queue")
  rj_queue.jsonset('tweets', Path.rootPath(), [])


#have the list if most reccent tweets in queue with key 'tweet_ids'
arr_tweet_ids=rj_queue.jsonget('tweet_ids', Path.rootPath())
if arr_tweet_ids is not None:
  print ("Array of tweets is already present in the cache with length: {}".format(len(arr_tweet_ids)))
else:
  print("initializing an empty array tweet_ids in the rj_queue")
  rj_queue.jsonset('tweet_ids', Path.rootPath(), [])


def remove_mongo_id(data): #list of dicts
    for item in data:
        del item['_id']
    return data

def update_cache(tweet_id=None):
    cache = rj_queue.jsonget('tweet_ids',Path.rootPath()) #know what tweets are cached from tweet_ids in the q
    if tweet_id:
        isPresentinCache = rj_cache.jsonget(tweet_id, Path.rootPath())
        if isPresentinCache: #if present, update.. else leave it
            tweet= remove_mongo_id(list(db['tweets'].find({'id': tweet_id})))
            if len(tweet)>0:
                rj_cache.jsonset(tweet_id, Path.rootPath(),tweet[0])
            else: #delete
                print('Deleting...')
                rj_cache.jsondel(tweet_id,Path.rootPath())
                all_tweets=rj_queue.jsonget('tweet_ids',Path.rootPath())
                rj_queue.jsonarrpop('tweet_ids',Path.rootPath(),all_tweets.index(tweet_id))
    else:
        for item in cache: #to update many tweets
            db_item=remove_mongo_id(list(db['tweets'].find({'id':item})))
            if len(db_item)>0:
                rj_cache.jsonset(item,Path.rootPath(),db_item[0])
            else:
                print('deleting..')
                rj_cache.jsondel(tweet_id,Path.rootPath())

    print('cache updated')


def delete_from_cache(tweet_id=None):
    pass



@app.route('/login',methods=['POST'])
def login():
    try:
        username = request.get_json()["username"]
        password = request.get_json()["password"]
        if (username and password):
            myquery = {"username": username, "password": password}
            user = db['users'].find_one(myquery)
            if user:
                return dumps({'username': username, 'jwt': create_access_token(identity=username)}),status.HTTP_200_OK
            else:
                return "Error: Invalid credentials..Did you register?",status.HTTP_401_UNAUTHORIZED
        else:
            return "Error: Invalid inputs. Username and Password is required",status.HTTP_400_BAD_REQUEST
    except Exception as e:
        print(e)
        return "Error", status.HTTP_500_INTERNAL_SERVER_ERROR


@app.route('/register',methods=['POST'])
def register():
    try:
        username = request.get_json()['username']
        password = request.get_json()['password']
        if not username or not password:
            return "Error: Invalid inputs. Username and Password is required",status.HTTP_400_BAD_REQUEST
        myquery = {"username": username}
        user = db['users'].find_one(myquery)
        print(user)
        if user:
            return "Error: sorry, the username is already taken.",status.HTTP_400_BAD_REQUEST
        else:
            db['users'].insert_one({'username':username,'password':password,'date_joined':datetime.now()})
            return dumps({'username':username,'jwt':create_access_token(identity=username)}),status.HTTP_200_OK
    except Exception as e:
        print(e)
        return "Error", status.HTTP_500_INTERNAL_SERVER_ERROR


@app.route('/new_tweet',methods=['POST'])
@jwt_required
def send_tweet_to_queue():
    try:
        print("Sending tweet to queue...")
        tweet=request.get_json()
        print(tweet)
        tweet["content"]=profanity.censor(tweet["content"])
        print(tweet)
        rj_queue.jsonarrinsert('tweets', Path.rootPath(), 0,tweet)
        return dumps(tweet),status.HTTP_200_OK
    except Exception as e:
        print(e)
        return "Error", status.HTTP_500_INTERNAL_SERVER_ERROR


#get tweets from the cache
@app.route('/get_tweets')
def get_all_tweets():
    try:
        data=[]
        for tweet_ids in rj_queue.jsonget('tweet_ids',Path.rootPath()):
                data.append(rj_cache.jsonget(tweet_ids,Path.rootPath()))
        print(data)
        return dumps(data),status.HTTP_200_OK
    except Exception as e:
        print(e)
        return "Error", status.HTTP_500_INTERNAL_SERVER_ERROR


#get tweets from the cache
@app.route('/purge_cache')
@jwt_required
def purge_cache():
    rj_queue.jsonset('tweet_ids',Path.rootPath(),[]) #reset the most recent list of tweets
    for key in rj_cache.keys():
        rj_cache.jsondel(key,Path.rootPath())

    print("Cache cleared")
    return 'Cache cleared..',status.HTTP_200_OK


#get remaining tweets from the database
@app.route('/load_more_tweets')
def get_more_tweets():
    try:
            oldest_tweet_id = rj_queue.jsonget('tweet_ids', Path.rootPath())[-1] #get the oldest tweet id from the q
            print(oldest_tweet_id)
            #using the oldest id, get the entire tweet from cache and use its timestamp to find newer tweets from db

            oldest_tweet_time=rj_cache.jsonget(oldest_tweet_id,Path.rootPath())['timestamp']
            db_tweets = db['tweets'].find({"timestamp":{"$lt":oldest_tweet_time}})
            if db_tweets:
                db_tweets = remove_mongo_id(list(db_tweets))
                print(db_tweets)
                db_tweets.sort(key = lambda x:x['timestamp'],reverse=True)
                return dumps(db_tweets),status.HTTP_200_OK

            return 'no more tweets..',status.HTTP_401_UNAUTHORIZED
    except Exception as e:
        print(e)
        return "Error", status.HTTP_500_INTERNAL_SERVER_ERROR


@app.route('/like_a_tweet',methods=['POST'])
@jwt_required
def like():
    try:
        username = request.get_json()["username"]
        tweet_id = request.get_json()["tweet_id"]
        db['tweets'].update_one({'id': tweet_id}, {'$push': {'likes': username}})
        update_cache(tweet_id)
        return dumps(request.get_json())
    except Exception as e:
        print(e)
        return "Error", status.HTTP_500_INTERNAL_SERVER_ERROR


@app.route('/unlike_a_tweet',methods=['POST'])
@jwt_required
def unlike():
    try:
        username = request.get_json()["username"]
        tweet_id = request.get_json()["tweet_id"]
        db['tweets'].update_one({'id': tweet_id}, {'$pull': {'likes': username}})
        update_cache(tweet_id)
        return dumps(request.get_json()),status.HTTP_200_OK
    except Exception as e:
        print(e)
        return "Error", status.HTTP_500_INTERNAL_SERVER_ERROR


# {
#     id:'',
#     username:'',
#     content:'',
#     image:'',
#     likes:[],
#     comments:[],
#     retweet:[],
#     timestamp:'',
# }


@app.route('/get_tweets_by_filter',methods=['POST'])
@jwt_required
def filter_tweet():
    name=request.get_json()['name']
    data=request.get_json()['data']
    if name=='search':
        filtered_tweets= remove_mongo_id(list(db['tweets'].find({'$or': [{'username':{'$regex' : '.*'+data+'.*'}}, {'content':{'$regex' : '.*'+data+'.*'}}]})))
        return dumps(filtered_tweets),status.HTTP_200_OK

    if name=='last_week':
#        db['tweets'].find({'$or': [{expires: {$gte: new
 #       Date()}}, {expires: null}]})

        pass
    if name=='last_month':

        pass
    if name=='last_two_weeks':

        pass

    return status.HTTP_200_OK



@app.route('/retweet',methods=['POST'])
def retweet():
    username = request.get_json()["username"]
    tweet_id = request.get_json()["tweet_id"]
    retweet = request.get_json()["retweet"]
    retweet_time= request.get_json()["retweet_time"]
    retweetjson={
        "username" : username,
        "retweet"  : retweet,
        "tweet_id":tweet_id,
        "retweet_time":retweet_time
    }

    db['tweets'].update({'id': tweet_id}, {'$push': {'retweet': retweetjson}})

    update_cache(tweet_id)

    return dumps(request.get_json())

@app.route('/tweets/<user_id>')
@jwt_required
def tweet_by_user(user_id):
    try:
        user_tweets = remove_mongo_id(list(db['tweets'].find({"username":user_id})))
        return dumps(user_tweets),status.HTTP_200_OK
    except Exception as e:
        print(e)
        return dumps([]),status.HTTP_200_OK

@app.route('/add_comment',methods=['POST'])
@jwt_required
def comment():
    username = request.get_json()["username"]
    tweet_id = request.get_json()["tweet_id"]
    comment = request.get_json()["comment"]
    comment_time = request.get_json()["comment_time"]
    comment= profanity.censor(comment)

    commentjson = {
        "username": username,
        "comment": comment,
        "comment_time":comment_time
    }

    db['tweets'].update_one({'id': tweet_id}, {'$push': {'comments': commentjson}})

    update_cache(tweet_id)

    return dumps(request.get_json())

@app.route('/delete_tweet',methods=['POST'])
@jwt_required
def delete_tweet():
    id=request.get_json()['id']
    db['tweets'].delete_one({'id':id})
    print(list(db['tweets'].find({'id':id})))
    update_cache(id)
    return 'Deletion success!',status.HTTP_200_OK

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, )
