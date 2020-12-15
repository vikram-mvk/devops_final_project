import React from "react";
import "./Widgets.css";
import {
  TwitterTimelineEmbed,
  TwitterShareButton,
  TwitterTweetEmbed,
} from "react-twitter-embed";
import SearchIcon from "@material-ui/icons/Search";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useSelector, useDispatch } from 'react-redux'
import {setTweets, deleteTweet} from './Redux/ActionCreators'
import Axios from 'axios'

function Widgets() {
  const store = useSelector(state => state); //hook provided by redux
  const dispatch = useDispatch(state => state)
  const headers = {  headers: { Authorization: 'Bearer ' + store.user_details.jwt }  }

  const onSearch = (text)=>{
  let filter={name:'search',data:text}
   Axios.post('http://localhost:5000/get_tweets_by_filter',filter,headers).then(res => {
      console.log(res)
      dispatch(setTweets(res.data))

   }).catch(err => {
      console.log(err)
   })
  }

  return (
    <div className="widgets">
      <div className="widgets__input">
        
        <SearchIcon className="widgets__searchIcon" />
        <input placeholder="Search Twitter" onChange={e=> onSearch(e.target.value)} type="text" />
      </div>

      <div className="widgets__widgetContainer">
        <h2>What's happening</h2>

        <a>Trending No:1 </a><a>#DevOpsCodeReview</a>
        <TwitterTweetEmbed tweetId={"1337905744516173829"} />




        <TwitterShareButton
          url={"https://facebook.com/vikram.kannan.33"}
          options={{ text: "#Trending: DevOps Code review", via: "vikram_mvk" }}
        />
      </div>
    </div>
  );
}

export default Widgets;
