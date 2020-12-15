import React from 'react';
import Sidebar from './Sidebar';
import { useSelector, useDispatch } from 'react-redux'
import {setUserDetails} from './Redux/ActionCreators'
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './HomePage.css';
import Axios from "axios";
import { Avatar, Button } from "@material-ui/core";
import MetaTags from 'react-meta-tags';


export default function HomePage() 
{

    const mycss = {  
      backgroundImage:'url("https://virtualwindow.com/wp-content/uploads/2013/08/Twitter-Background.jpg")',        
      height: '100vh'
    }
    
    const [img,setimg]= React.useState(undefined)

    const [login,setLogin] = React.useState({'username':'','password':''});
    const [note,setnote]= React.useState(undefined)
    const dispatch = useDispatch();


    const onLogin = (e) =>{ 
        Axios.post('http://localhost:5000/login',login)
        .then(res => 
          {

            dispatch(setUserDetails(res.data))

            
        })
        
        .catch(err => {
          if(err && err.response){
          setnote(err.response.data)
          }
          else{
            setnote('Error: Cannot communicate to the backend')

          }
        })

      
    }

    
    const onSignup = (e) =>{ 

        Axios.post('http://localhost:5000/register',login).then(res => 
        {
        setnote('Succesfully registered.. Try logging in now')
        console.log(res.data)
       
      if(img){

        let formData = new FormData();    //formdata object
        formData.append('img',img)
        formData.append('tweet_id',login.username)
        Axios.post('http://localhost:5001/uploadS3',formData,{content_type:'multipart/form-data'}).then( res => console.log(res)).catch(err=> console.log(err))
        
      }
           
      }
        ).catch(err => 
          {
          console.log(err)
          if(err && err.response){
          setnote(err.response.data)
        }
        else{
          setnote('Error: Cannot communicate to the backend')
        }
        })

    }
    
    const onGuest = (e) =>{ 
        dispatch(setUserDetails({username:'guest'}))
    }
    
    const invalidUsername = () => {
      let usernameRegex = /^[a-zA-Z0-9]+$/; //only letters and numbers
      if(login.username.length>0){
              return !(login.username.match(usernameRegex))
      }
        return true;
    }

  const invalidPassword = () => {
    let passwordRegex = /^(?=.*[\w])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,15}$/;

    if(login.password.length>0){
                return !(login.password.match(passwordRegex))
        }
          return true;
      }


    return(
  <div style={mycss}>
          <MetaTags>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />

          </MetaTags>

<div class="wrapper">
  <div id="formContent">
    <div class="fadeIn first">
    </div>
      <input type="text" id="login" class="fadeIn second ip-maintext" name="login" onChange= { e => setLogin({...login,'username':e.target.value}) } placeholder="Username (Alphanumeric characters only)" /> {invalidUsername()? <span>&#10060;</span>:<span>&#9989;</span>}
      <input type="password" id="password" class="fadeIn third ip-maintext" name="login" onChange= { e => setLogin({...login,'password':e.target.value}) } placeholder="Password (8-15 characters with atleast 1 symbol)" /> {invalidPassword()? <span>&#10060;</span>:<span>&#9989;</span>}
      <br/>

    <small className={note && note[0]=='E' ? 'text-danger':'text-success'}>{note}</small>
      
      <div className='login-signup'>

      <input type="submit" onClick={ e=> onLogin(e)} class={'fadeIn fourth ip-button '+((invalidUsername() || invalidPassword()) && ' text-secondary')}  value="Log In" disabled={invalidUsername() || invalidPassword()} />
      <input type="submit" onClick={ e=> onSignup(e) } class={"fadeIn fourth ip-button "+((invalidUsername() || invalidPassword()) && ' text-secondary')} value="Signup" disabled={invalidUsername() || invalidPassword()} />
   
      </div>
      
      <Button disabled={invalidUsername() || invalidPassword()} class={'fadeIn fourth ip-button '+((invalidUsername() || invalidPassword()) && ' text-secondary')} style={{marginTop:'-40px'}}  component="label"> {img?'selected image: '+img.name:'Choose your avatar'}
        <input type="file" accept="image/*" hidden onChange={ e=> {setimg(e.target.files[0] )}} multiple = "false" />
        </Button>
        <br/>
      <input type="submit" onClick={ e=> onGuest(e) } class="fadeIn fourth ip-button" value="Continue as Guest" />
      
 
  </div>
</div>
    </div>
        
        );

}