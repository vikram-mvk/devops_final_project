import React from "react";
import Sidebar from "./Sidebar";
import Widgets from "./Widgets";
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min';

export default function CommingSoon(props){


    return (
        <React.Fragment>
          <Sidebar />
          <div className="app">
            <span style={{marginTop:'20%'}} className='container-fluid text-center display-4'> Comming Soon</span>
          <Widgets />
          </div>
        </React.Fragment>
      );


}