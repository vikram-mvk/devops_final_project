import React from "react";
import Sidebar from "./Sidebar";
import Widgets from "./Widgets";
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import {Button} from '@material-ui/core';

export default function Profile(props){


    const store = useSelector(state => state); //hook provided by redux

    const dispatch = useDispatch();
  
    const [img,setimg]= React.useState(undefined)

    const headers = {  headers: { Authorization: 'Bearer ' + store.user_details.jwt }  }

    const pic = ()=> {
           let formData = new FormData();    //formdata object
          formData.append('img',img)
          formData.append('tweet_id',store.user_details.username)
          headers.content_type='multipart/form-data'
        Axios.post('http://localhost:5001/upload',formData,headers).then( res =>{ alert("Upload successful!");         window.location.reload();
    }).catch(err=> console.log(err))
    }
    
    return (
        <React.Fragment>
          <Sidebar />
          {store.user_details.username=='guest'?
            <span style={{marginTop:'50%', borderRadius:'10%'}} className='bg-light container text-center display-4'>Guest Account</span>
:
          <div className="app">
            <span style={{marginTop:'5%', borderRadius:'10%'}} className='bg-light container text-center display-4'> Profile
            <br/>
            <p className='text-left m-4 lead '>Your Username: {store.user_details.username}</p>
            
            <p className='text-left m-4 lead '>Your Profile picture: </p>
            
           <span className='h6'> <img width='400px' height='400px' src={'https://vikram-twitter-clone.s3.amazonaws.com/'+store.user_details.username} class="img-fluid" alt="No picture uploaded" />
</span>
            <br/>
            <Button className='tweetBox__imageInput'  component="label"> {img?img.name:'Upload/Replace your profile picture'}
            <input type="file" accept="image/*"  hidden onChange={ e=> {setimg(e.target.files[0] )}} multiple = "false" />
        </Button>
        <br/>
        <button className='btn btn-primary btn-md' onClick = {pic} disabled={!img}> Upload </button>
        </span>
          <Widgets />
          </div>
}
        </React.Fragment>
      );


}