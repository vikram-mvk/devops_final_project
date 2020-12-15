from rejson import Client, Path
from datetime import timedelta
from timeloop import Timeloop

# start timeloop
tl = Timeloop()
# connect to queue
rj_queue = Client(host='localhost', port=1111, decode_responses=True)
#Connect to cache
rj_cache = Client(host='localhost', port=1112, decode_responses=True)
#Connect to queue backend
rj_queue_mongodb = Client(host='localhost', port=1113, decode_responses=True)


# checking if array of json(tweets) present in queue backend? if yes then wont set or else will set to []
arr_queue_mongodb=rj_queue_mongodb.jsonget('tweets', Path.rootPath())
if arr_queue_mongodb is not None: print ("Array of tweets is already present in queue_backend with length: {}".format(len(arr_queue_mongodb)))
else:
  print("initializing an empty array tweets in the rj_queue_backend")
  rj_queue_mongodb.jsonset('tweets', Path.rootPath(), [])

cache_limit = 5

#polls the data from queue, modifies the data by applying business logic, sends it to cache and the backend queue
@tl.job(interval=timedelta(seconds=2))
def send_to_cache_and_backend_queue():

    current_cache_size= len(rj_cache.keys())
    current_q_size= len(rj_queue.jsonget('tweets',Path.rootPath()))

    print('current cache size is '+str(current_cache_size))
    print('current q size is '+str(current_q_size))

    if current_q_size>0:
        tweet=rj_queue.jsonarrpop('tweets', Path.rootPath())
        print(tweet)
        rj_queue.jsonarrinsert('tweet_ids',Path.rootPath(),0,tweet['id'])

        if current_cache_size >= cache_limit:
            popped = rj_queue.jsonarrpop('tweet_ids', Path.rootPath()) #get the cached tweet ids from the q
            rj_cache.jsondel(popped,Path.rootPath()) #use that id to remove from the q

        print("Adding to cache")
        rj_cache.jsonset(tweet['id'], Path.rootPath(), tweet)

        print('Add to mongo db Q')
        rj_queue_mongodb.jsonarrinsert('tweets', Path.rootPath(), 0, tweet)



if __name__ == "__main__":
    tl.start(block=True)