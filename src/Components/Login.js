import React,{useRef,useState,useEffect,useContext} from "react";
import {mainImage} from '../images/login.jpg';
import "../Styles/login.css";
import {Link} from 'react-router-dom';
import {LOGIN_URL} from "../Endpoints/API_ENDPOINTS";
import axios from "axios";
import {useHistory} from "react-router-dom";
import {AppContext} from "../Context/AppContext";

const Login  = () =>{

const ContextApp = useContext(AppContext);

 const history = useHistory();
 const [validEmail,setValidEmail] = useState(false);
 const [email,changeEmail] = useState("");
 const passRef = useRef(null);
 const [pass,setPass] = useState("");
 const [passEmpty,setPassEmpty] = useState(true);
 const [validForm,setValidForm] = useState(false);
 const [wrongCredentials,setWrongCredentials] = useState(false);

 const validateEmail = (email)=>{
   var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   if (re.test(email)) {
   	return true;
   }
   else {
   	return false;
   }
}

const setCookie = (token,refreshToken)=>{
    const d = new Date();
    d.setTime(d.getTime()+1*60*60*1000);
    let expires = "expires="+d.toUTCString();
    document.cookie = `token=${token}; expires=${expires}`;
    document.cookie = `refreshToken=${refreshToken}; expires=${expires}`;

}

 const handleLogin = (evt)=>{
    evt.preventDefault();
    axios.post(LOGIN_URL,{
      email:email,
      password:pass
    }).then(resp=>{

      if(resp.status == 200)
      {
          setCookie(resp.data.token,resp.data.refreshToken);
          ContextApp.updateUser(resp.data.user);
          ContextApp.updateToken(resp.data.token);
          ContextApp.updateRefreshToken(resp.data.refreshToken);
          ContextApp.setLoggedIn(true);
          ContextApp.fetchUserPosts();
          ContextApp.fetchFeedPosts();
          history.push("/user/feed");

      }
    }).catch(err=>{

      if(err.response)
      {
        if(err.response.status == 404 || err.response.status == 401 || err.response.status == 403)
        {
          setWrongCredentials(true);
        }
        return;
      }
      alert("Error with the server!");
    })
 }

 const handleEmail = (inputVal)=>{
   const txt = inputVal.target.value;
   if(validateEmail(txt))
   {
     setValidEmail(true);
   } else{
     setValidEmail(false);
   }
   setWrongCredentials(false);
   changeEmail(txt);
 }

 const handlePass = (passVal)=>{
   const txt = passVal.target.value;
   if(txt.length>0)
   {
     setPassEmpty(false);
   } else {
     setPassEmpty(true);
   }
  setWrongCredentials(false);
   setPass(txt);
 }

 useEffect(()=>{
   if(!passEmpty && validEmail)
   {
     setValidForm(true);
   } else {
     setValidForm(false);
   }

 },[passEmpty,validEmail])

 useEffect(()=>{

 },[])

  return(
	<div className="limiter">
		<div className="container-login100" >
			<div className="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54">

				<form className="login100-form validate-form" method="post" >
					<span className="login100-form-title p-b-49">
						Login
					</span>
          { wrongCredentials && <p className="wrong-credentials-header">WRONG CREDENTIALS!</p>}
					<div className="wrap-input100 validate-input m-b-23" data-validate = "Username is reauired">
						<span className="label-input100">Email</span>
						<input className="input100" onChange={handleEmail} value={email} type="text" name="username" placeholder="Type your email"/>
						<span className="focus-input100" data-symbol="&#xf206;"></span>
					</div>
          {!validEmail && <p className="wrong-credentials" style={{marginBottom:"20px"}}>Email not valid!</p>}
					<div className="wrap-input100 validate-input" data-validate="Password is required">
						<span className="label-input100">Password</span>
						<input className="input100" type="password" value={pass} onChange={handlePass} name="pass" placeholder="Type your password"/>
						<span className="focus-input100" data-symbol="&#xf190;"></span>
					</div>
          {passEmpty && <p className="wrong-credentials" style={{paddingTop:"20px"}}>Password can't be empty!</p>}
					<div className="container-login100-form-btn login-btn-margin">
						<div className="wrap-login100-form-btn">
							<div className="login100-form-bgbtn"></div>
							<button disabled={!validForm} className={validForm? "login100-form-btn":"login100-form-btn disabled-btn"} onClick={handleLogin}>
								Login
							</button>
						</div>
					</div>


					<div className="flex-col-c p-t-155">
						<span className="txt1 p-b-17">
							Or Sign Up Using
						</span>
						<a href="#" className="txt2">
							<Link to='/signup' className=''>Sign Up</Link>
						</a>
					</div>
				</form>
			</div>
		</div>
	</div>
  )
}

export default Login;
