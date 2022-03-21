import React from "react";
import "../Styles/About.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faHome} from '@fortawesome/free-solid-svg-icons';
import {Link} from "react-router-dom";
import People  from "../images/people-socializing.jpg";
import Group from "../images/people-group.jpg";

const About = ()=>{

  return(
    <div className="about-container">
     <Link to='/' className="about-back-home-btn">
     <FontAwesomeIcon icon={faHome} className="about-home-icon"/>
      Home
     </Link>
     <h1 className="about-title">Do you want to try a new social media app?</h1>
     <p className="about-desc">Peach Pen offers you a fresh experience regarding using social media</p>
     <p className="about-desc">The reduced set of functionalities helps you enjoy the essence of social media</p>
     <div className="about-photo-container">
        <img src={People} className="about-photo" />
     </div>
     <h1 className="about-title">Socializing has never been easier</h1>
     <p className="about-desc">Nowadays with the click of a button we can connect with our friends and family</p>
     <div className="about-photo-container">
        <img src={Group} className="about-photo" />
     </div>
       <h1 className="about-title">More Info</h1>
       <p className="about-desc small-font">This app was written by Stanculescu Daniel. If you have more questions or you want to contact him you can do so at danystanculescu@gmail.com</p>
    </div>
  )
}

export default About;
