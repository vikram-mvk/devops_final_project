import Axios from 'axios'


export const startLoading = ()=> {
    return {
        type:"SET_LOADING_TRUE"
    }
}
export const stopLoading = () => {
    return {
        type:"SET_LOADING_FALSE"
    }
}

export const setUserDetails = (user_details) => {

    return {
        type:"SET_USER_DETAILS",
        user_details
    }
}

export const setTweets = (tweets) => {

    return {
        type:"SET_TWEETS",
        tweets:tweets
    }
}

export const newTweet = (tweet) => {
    return {
        type:"NEW_TWEET",
        tweet:tweet
    }

}

export const moreTweets = (tweets) => {
    return {
        type:"LOAD_MORE_TWEETS",
        tweets:tweets
    }

}

export const addComment = (data) => {
    return {
        type:"ADD_COMMENT",
        data:data
    }

}
export const addLike = (data) => {
    return {
        type:"ADD_LIKE",
        data:data

}
}

export const addRetweet = (data) => {
    return {
        type:"ADD_RETWEET",
        data:data
    }

}


export const removeLike = (data) => {
    return {
        type:"REMOVE_LIKE",
        index:data.index,
        username:data.username
    }

}

export const removeComment = (data) => {
    return {
        type:"REMOVE_COMMENT",
        data:data
    }

}

export const deleteTweet = (index) => {
    return {
        type:"DELETE_TWEET",
        index:index
    }

}


export const Logout = () => {
    return {
        type:"CLEAR_STATE"
    }
}


