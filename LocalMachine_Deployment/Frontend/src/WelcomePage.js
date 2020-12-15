import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import Feed from "./Feed";
import Widgets from "./Widgets";
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useSelector, useDispatch } from 'react-redux'
import Axios from "axios";
import {setTweets} from './Redux/ActionCreators'
import MetaTags from 'react-meta-tags';


export default function WelcomePage() {

  const store = useSelector(state => state)
  const dispatch = useDispatch()
  const headers = {  headers: { Authorization: 'Bearer ' + store.user_details.jwt }  }
  
  
  return (
    <React.Fragment>
         <MetaTags>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />

          </MetaTags>
      <Sidebar />
      <div className="app">

      <Feed />
      <Widgets />
      </div>
    </React.Fragment>
  );
}

