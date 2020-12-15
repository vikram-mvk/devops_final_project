import "./Post.css";
import { Avatar, Button } from "@material-ui/core";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import RepeatIcon from "@material-ui/icons/Repeat";
import FavoriteIcon from '@material-ui/icons/Favorite';
import PublishIcon from "@material-ui/icons/Publish";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React from 'react';
import {addLike,removeLike} from './Redux/ActionCreators'
import { useSelector, useDispatch } from 'react-redux';
import Axios from "axios";
import LikesModal from "./LikesModal";



export default function Post(props){
 
  
  const store = useSelector(state => state); //hook provided by redux
  const dispatch = useDispatch();
  const headers = {  headers: { Authorization: 'Bearer ' + store.user_details.jwt }  }
  
  const [likes,setLikes]=React.useState(props.likes)
  const [showlike,setshowlike] =React.useState(false)

  const onLike = async () => {
    

    if(!likes.includes(store.user_details.username)){
        console.log('adding like')
          Axios.post('http://localhost:5000/like_a_tweet',{username:store.user_details.username,tweet_id:props.id},headers)
          .then( res => {
              console.log(res.data)
              setLikes([...likes,store.user_details.username])
            })
          .catch( err => {   console.log(err)})

    }
    else
    {
      console.log('removing like')

          Axios.post('http://localhost:5000/unlike_a_tweet',{username:store.user_details.username,tweet_id:props.id},headers)
          .then( res => {

            setLikes(likes.filter( x => x!=store.user_details.username))
            //dispatch(removeLike({username:store.user_details.username,index:i}))
          })
          .catch( err => { console.log(err)})

    }

    }
  
  

  console.log(props.comments)
  return (

      <div className="post lead">
        <div className="post__avatar">
          <Avatar src={'https://vikram-twitter-clone.s3.amazonaws.com/'+props.avatar} />
        </div>
        <div className="post__body">
          <div className="post__header">
            <div className="post__headerText">
              <h3>
                <span>
                         {'Username: '+props.username} 
                         <p className="text-muted float-right">
                         {'Posted on: '+props.date_posted}
                      
                </p>
                </span>
                </h3>
                </div>
               
          
            <div className="post__headerDescription">
              <p>{props.content}</p>
      {props.image.length>0 && 

      <img src={'https://vikram-twitter-clone.s3.amazonaws.com/'+props.image} class="img-fluid" alt="" />

      }

            </div>
          </div>
          <div className="post__footer">
          <Button> <button  class="btn" type="button" data-toggle="collapse" data-target={'#'+props.id} aria-expanded="false" aria-controls={props.id} >
            <ChatBubbleOutlineIcon fontSize="small" />
            </button>
            </Button>
       


          <Button onClick = {onLike}> <FavoriteIcon style={{fill: likes.includes(store.user_details.username) ? 'red':'lightgray'} } fontSize="small" /></Button>

          </div>
          <span className='float-right h6 btn btn-light' onClick={ e=> {setshowlike(!showlike)}}><b>{likes.length}</b> Likes </span>
          <LikesModal show={showlike} setshow={setshowlike} likes={likes} />
          <br/>
          <br/>

          <div class="collapse" id={props.id}>
            {props.comments && props.comments.length> 0 ? props.comments.map( x =>  {
                            return(
                              <div class='comments'>
                                            <div>
                                              <span className='text-primary h6'>
                                              User :<span className="font-italic"> {'@'+x.username}</span>
                                                      <p className="float-right "> 
                                                      Posted on: <span className='font-italic'> {x.comment_time}</span>
                                              </p>
                                              </span>
                                              </div>
                                              <div>
                                                <br/>
                                        <h6>Comment: </h6> 
                                        <p className='lead'>{x.comment}</p>
                                              
                                            
                                              <hr />
                                              </div>
                            </div>
                            )  
          }
            )
            
            :
          <p>No comments yet.</p>
          
          }


        
          </div>
        </div>
      </div>
    );
        }