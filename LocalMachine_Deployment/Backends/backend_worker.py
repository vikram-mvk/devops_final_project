from rejson import Client, Path
from datetime import timedelta
from timeloop import Timeloop
from pymongo import MongoClient

# start timeloop
tl = Timeloop()

#Connect to queue backend
rj_queue_backend = Client(host='localhost', port=1113, decode_responses=True)

#connect to db
client = MongoClient('localhost', 27017)
db = client.mydb

# every 5 seconds, add to database , as it has eventual consistency according to business needs
@tl.job(interval=timedelta(seconds=5))
def send_to_db():
    print("Listening for tasks in the backend queue ..")
    try:
        tweets=rj_queue_backend.jsonget('tweets', Path.rootPath())
        if len(tweets)>0:
            rj_queue_backend.jsonset('tweets', Path.rootPath(),[])
            #putting the tweets_cache to database
            db['tweets'].insert_many(tweets)
            print("Found a List of tweets.. Sending it to database..")
    except:
        print('no items to send to db..')




if __name__ == "__main__":  tl.start(block=True)