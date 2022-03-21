import React from "react";
import {mainImage} from '../images/login.jpg';
import "../Styles/login.css";
import {Link} from 'react-router-dom';
import {faUserLock} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Success = ()=>{

  return(
    <div className="limiter">
      <div className="container-login100" >
        <div className="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54">
          <p className="succesful-login-text">Successful register!</p>
          <Link className="back-login-btn" to='/login'>Back to login <FontAwesomeIcon icon={faUserLock}/> </Link>
        </div>
      </div>
    </div>
  )
}
export default Success;
