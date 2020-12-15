import React from 'react';
import { useSelector } from 'react-redux';
import {BrowserRouter as Router,Route,Redirect,Switch} from 'react-router-dom'
import HomePage from './HomePage';
import WelcomePage from './WelcomePage';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import {Link} from 'react-router-dom'
import CommingSoon from './CommingSoon'
import Profile from './Profile'

function App() {

  const store = useSelector(state => state)

  return (


    <div>
  {store.user_details==undefined?  

  <React.Fragment>
    <HomePage />
  </React.Fragment>

:
  
  <Router>
    <Switch>
            <Route exact path="/" component ={WelcomePage} />            
            <Route exact path='/commingsoon' component={CommingSoon} />
            <Route exact path='/profile' component={Profile} />
            
     </Switch>
  </Router>      
}
          
        </div>
  );
}

export default App;
