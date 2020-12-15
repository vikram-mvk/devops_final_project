import React from "react";
import "./Sidebar.css";
import TwitterIcon from "@material-ui/icons/Twitter";
import SidebarOption from "./SidebarOption";
import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from "@material-ui/icons/Search";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import ListAltIcon from "@material-ui/icons/ListAlt";
import PermIdentityIcon from "@material-ui/icons/PermIdentity";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { Button } from "@material-ui/core";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import {Link} from 'react-router-dom'

function Sidebar() {
  
  return (
    <div className='mysidebar'>
         
    
      <TwitterIcon className="sidebar__twitterIcon" />
      <Link to='/' style={{ textDecoration: 'none' }}>   <SidebarOption active Icon={HomeIcon} text="Home" /> </Link>
      <Link to='/profile' style={{ textDecoration: 'none', color:'black'}} >     <SidebarOption Icon={PermIdentityIcon} text="Profile" /></Link> 

      <Link to='/commingsoon' style={{ textDecoration: 'none', color:'black'}} > <SidebarOption Icon={SearchIcon} text="Explore" /></Link>
      <Link to='/commingsoon' style={{ textDecoration: 'none', color:'black'}} >   <SidebarOption Icon={NotificationsNoneIcon} text="Notifications" /></Link>
      <Link to='/commingsoon' style={{ textDecoration: 'none', color:'black'}} >  <SidebarOption Icon={MailOutlineIcon} text="Messages" /></Link>
      <Link to='/commingsoon' style={{ textDecoration: 'none', color:'black'}} >   <SidebarOption Icon={BookmarkBorderIcon} text="Bookmarks" /></Link>
      <SidebarOption Icon={ListAltIcon} text="Lists" />
      <SidebarOption Icon={MoreHorizIcon} text="More" />

    
    
    </div>
  );
}

export default Sidebar;
