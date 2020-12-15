import { persistReducer } from "redux-persist"
import storage from 'redux-persist/lib/storage' //to tell redux to use localstorage as default storage 
import { combineReducers } from "redux"
import uuid from 'react-uuid'


let store={
    user_details:undefined,
    tweets:[]
   
}



//reducer modifies the state. It must be a pure sync funtion. so we need to use action creator with thunk middleware for api calls

const reducer = (state=store,action) =>{


switch(action.type){
    
        
    case "SET_LOADING_TRUE": 
        return {
            ...state,
            loading:true
        }
    
    case "SET_LOADING_FALSE":  
        return {
        ...state,
        loading:false,
        }

    case "SET_USER_DETAILS":
        return{
            ...state,
           user_details:action.user_details
        }
    case "CLEAR_STATE": //Remove user details from State
        return store

    case "SET_TWEETS":
        
        return {
            ...state,
        tweets:action.tweets
        }

    case "NEW_TWEET":
        return {
            ...state,
        tweets:[action.tweet,...state.tweets]
        }

    case "LOAD_MORE_TWEETS":
       
        return {
            ...state,
        tweets:state.tweets.concat(action.tweets)
        
        }

    case "DELETE_TWEET":

    return{
        ...state,
        tweets:[...state.tweets.slice(0,action.index),...state.tweets.slice(action.index+1)]
        }
    
    case "ADD_COMMENT":
        
        for(let i=0;i<state.tweets.length;i++){

            if(state.tweets[i].id==action.data.tweet_id){
                state.tweets[i].comments.push(action.data)
            }
        }
    
        return {
            ...state,
        tweets:state.tweets
        
        }
    
    case "ADD_LIKE":
    
        for(let i=0;i<state.tweets.length;i++){

            if(state.tweets[i].id==action.data.tweet_id){
                state.tweets[i].likes.push(action.data.username)
            }
        }
    
        return {
            ...state,
        tweets:state.tweets
        
        }
    
    case "REMOVE_LIKE":

        
        return {
            ...state,
            tweets:[...state.tweets.slice(0,action.index), state.tweets[action.index].likes.filter(x => x != action.username)[0]  ,...state.tweets.slice(action.index+1)]
        }
    
    case "ADD_RETWEET":

        for(let i=0;i<state.tweets.length;i++){

            if(state.tweets[i].id==action.data.tweet_id){
                state.tweets[i].retweets.push(action.data)
            }
        }
    
        return {
            ...state,
        tweets:state.tweets
        
        }
    
    case "REMOVE_COMMENT":

    for(let i=0;i<state.tweets.length;i++){

        if(state.tweets[i].id==action.data.tweet_id){
            state.tweets[i].comments.filter(item => item.username !== action.data.username)
        }
    }

    return {
        ...state,
    tweets:state.tweets      
    }

    default:
        return state
}
}



export default reducer;