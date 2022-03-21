import React,{useState,useEffect} from "react";
import {mainImage} from '../images/login.jpg';
import "../Styles/login.css";
import {Link} from 'react-router-dom';
import "../Styles/SignUp.css";
import axios from "axios";
import { useHistory } from "react-router-dom";
import {faCheck} from '@fortawesome/free-solid-svg-icons';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {SIGNUP_URL} from "../Endpoints/API_ENDPOINTS";

let firstPasField ='';
let repeatPassField = '';
let emVl = false;

let oldUsername = null;
let oldEmail = null;


const SignUp  = () =>{

let history = useHistory();
const validateEmail = (email)=>{
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(email)) {
  	return true;
  }
  else {
  	return false;
  }
}

/* Form validation states */
let [emailVal,setEmailVal] = useState("");
let [validEmail,setValidEmail] = useState(false);
let [validForm,setValidForm] = useState(false);
let [password,setPassword] = useState("");
let [passwordMatch,setPasswordMatch] = useState(false);
let [usernameExist,setUserNameExist] = useState(false);
let [emailExists,setEmailExists] = useState(false);
let [username,setUsername] = useState("");
let [repeatPass,setRepeatPass] = useState("");


/*password stregth states*/
let [has8Digits,setHas8Digits] = useState(false);
let [upperCaseLetter,setUpperCaseLetter] = useState(false);
let [lowerCaseLetter,setLowerCaseLetter] = useState(false);
let [hasOneDigit,setHasOneDigit] = useState(false);
let [hasSpecialChars,setHasSpecialChars] = useState(false);

useEffect(()=>{
   
  if(passwordMatch && validEmail && username!='' && emailVal!='' && password!='' && !emailExists && !usernameExist && has8Digits && upperCaseLetter && lowerCaseLetter && hasOneDigit && hasSpecialChars)
  {
    setValidForm(true);
  } else {
    setValidForm(false);
  }
},[username,emailVal,password,repeatPass,passwordMatch,validEmail,emailExists,usernameExist,has8Digits,upperCaseLetter,lowerCaseLetter,hasOneDigit,hasSpecialChars]);


const handleUserName = (txt)=>{
  const val = txt.target.value;
  if(oldUsername !=null)
  {
    if(val!=oldUsername)
    {
      setUserNameExist(false);
    }
  }

  setUsername(val);
}

useEffect(()=>{


   const characterLength = new RegExp("(?=.{8,})");
   const upperCaseLetterReg = new  RegExp("(?=.*[A-Z])");
   const lowerCaseLetterReg = new RegExp("(?=.*[a-z])");
   const hasOneDigitReg = new RegExp("(?=.*[0-9])");
   const hasOneSpecial = new RegExp("(?=.*[0-9])");

   ///test for character length
   if(characterLength.test(password))
   {
     setHas8Digits(true);
   } else{
     setHas8Digits(false);
   }

   if(upperCaseLetterReg.test(password))
   {
     setUpperCaseLetter(true);
   } else{
     setUpperCaseLetter(false);
   }

   if(lowerCaseLetterReg.test(password))
   {
     setLowerCaseLetter(true);
   } else{
     setLowerCaseLetter(false);
   }

   if(hasOneDigitReg.test(password))
   {
     setHasOneDigit(true);
   } else{
     setHasOneDigit(false);
   }

   if(hasOneSpecial.test(password))
   {
     setHasSpecialChars(true);
   } else{
     setHasSpecialChars(false);
   }

},[password]);


const handleEmail = (txt) =>{
  const value = txt.target.value;

  if(validateEmail(value))
  {
    setValidEmail(true);
    if(oldEmail!=null)
    {
      if(value!=oldEmail)
      {
        setEmailExists(false);
      }
    }

  } else {
    setValidEmail(false);
  }
  setEmailVal(value);
}

const handlePassword = (txt)=>{
  const val = txt.target.value;
  if(val == repeatPass)
  {
    setPasswordMatch(true)
  } else {
    setPasswordMatch(false);
  }
  setPassword(val);
}

const handleRepeatPassword = (txt)=>{
  const val = txt.target.value;
  if(val == password)
  {

    setPasswordMatch(true)
  } else {
    setPasswordMatch(false);
  }

  setRepeatPass(val);
}


const handleReq = async (e)=>{
  oldUsername = null;
  oldEmail = null;
  const reqBody = {
    email:emailVal,
    password:password,
    username:username,
  };

  e.preventDefault();
  const res = await axios({
    method:'post',
    url:SIGNUP_URL,
    data:reqBody
  }).then(resp=>{

      if(resp.status == 200)
      {
        history.push("/register-success");
      }
  }).catch(err=>{
    if(!err.response)
    {
      alert("Erro with backend server!");
    } else{
      if(err.response.data == "Username and email already exists!")
      {
            oldUsername = username;
            oldEmail = emailVal;
            setUserNameExist(true);
            setEmailExists(true);
      }
      else if(err.response.data == "Username already exists!")
      {
            oldUsername = username;
            setUserNameExist(true);
      }
      else if(err.response.data == "Email already exists!")
      {
          oldEmail = emailVal;
          setEmailExists(true);
      }
    }

  });
}

return (
 <div className="limiter">
   <div className="container-login100" >
     <div className="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54">
       <form className="login100-form validate-form" method="POST" onSubmit ={handleReq}>
         <span className="login100-form-title p-b-49">
           Sign Up
         </span>

         <div className="wrap-input100 validate-input m-b-23" data-validate = "Username is required">
           <span className="label-input100">Username</span>
           <input className="input100" type="text" value={username} onChange={handleUserName} name="username" placeholder="Type your username"/>
           <span className="focus-input100" data-symbol="&#xf206;"></span>
         </div>
         <p className={usernameExist?"wrong-credentials":"wrong-credentials not-display"}>Username taken!</p>
       <div className="wrap-input100 validate-input m-b-23" style={{"marginTop":'30px'}} data-validate = "Username is reauired">
           <span className="label-input100">Email</span>
           <input className="input100" type="text" onChange={handleEmail} name="username" value={emailVal} placeholder="Type your email"/>
           <span className="focus-input100" data-symbol="&#xf15a;"></span>
         </div>

         <p className={validEmail?"wrong-credentials not-display":"wrong-credentials"}>Email not valid!!!</p>
         <br/><span className={emailExists?"wrong-credentials":"not-display"}>There is already an account registerd with this email!</span>
         <div className="wrap-input100 validate-input" data-validate="Password is required">
           <span className="label-input100">Password</span>
           <input className="input100" type="password" value={password} onChange={handlePassword} name="pass" placeholder="Type your password"/>
           <span className="focus-input100" data-symbol="&#xf190;"></span>
         </div>


          <div className="password-requirements-container">
            <p className={has8Digits?"meets-prop prop-container":"does-not-meet-prop prop-container"}> { !has8Digits ? <FontAwesomeIcon icon={faTimes} className="prop-icon-container"/> : <FontAwesomeIcon icon={faCheck} className="prop-icon-container"/>}The password is at least 8 characters long</p>
            <p className={upperCaseLetter?"meets-prop prop-container":"does-not-meet-prop prop-container"}> { !upperCaseLetter ? <FontAwesomeIcon icon={faTimes} className="prop-icon-container"/> : <FontAwesomeIcon icon={faCheck} className="prop-icon-container"/>}The password has at least one uppercase letter</p>
            <p className={lowerCaseLetter?"meets-prop prop-container":"does-not-meet-prop prop-container"}> { !lowerCaseLetter ? <FontAwesomeIcon icon={faTimes} className="prop-icon-container"/> : <FontAwesomeIcon icon={faCheck} className="prop-icon-container"/>}The password has at least one lowercase letter</p>
            <p className={hasOneDigit?"meets-prop prop-container":"does-not-meet-prop prop-container"}> { !hasOneDigit ? <FontAwesomeIcon icon={faTimes} className="prop-icon-container"/> : <FontAwesomeIcon icon={faCheck} className="prop-icon-container"/>}The password has at least one digit</p>
            <p className={hasSpecialChars?"meets-prop prop-container":"does-not-meet-prop prop-container"}> { !hasSpecialChars ? <FontAwesomeIcon icon={faTimes} className="prop-icon-container"/> : <FontAwesomeIcon icon={faCheck} className="prop-icon-container"/>} The password has at least one special character</p>
          </div>

         <div className="wrap-input100 validate-input" style={{'marginTop':'30px'}} data-validate="Password is required">
           <span className="label-input100">Repeat Password</span>
           <input className="input100" type="password" name="pass" value={repeatPass} onChange={handleRepeatPassword} placeholder="Type your password"/>
           <span className="focus-input100" data-symbol="&#xf190;"></span>
         </div>
          <p style={{marginTop:"-8px !important"}}className={passwordMatch?"wrong-credentials not-display":"wrong-credentials"}>Passwords don't match</p>
         <div className="container-login100-form-btn" style={{"marginTop":'50px'}}>
           <div className="wrap-login100-form-btn">
             <div className="login100-form-bgbtn"></div>
             <button type="submit" disabled={!validForm} className={validForm ? "login100-form-btn":"login100-form-btn disabled-btn"}>
               SignUp
             </button>
           </div>
         </div>
         <div className='existent-account'>
          <p>Already have an account?</p>
          <Link to='/login' className='backToLogin'><i className="zmdi zmdi-arrow-left"></i>Back to login</Link>
         </div>
       </form>
     </div>
   </div>
 </div>
  )
}

export default SignUp;
