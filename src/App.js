import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route,Switch,withRouter} from 'react-router-dom';
import Login from './Components/Login.js';
import Loading from './Components/Loading.js';
import Home from './Components/Home.js';
import Navbar from './Components/Navbar.js';
import SignUp from './Components/SignUp.js';
import MainPage from './Components/MainPage.js';
import FeedNavbar from './Components/FeedNavbar.js';
import Test from "./Components/Test.js";
import PageNotFound from './Components/PageNotFound.js';
import Profile from "./Components/Profile.js";
import About from "./Components/About.js";
import Messages from "./Components/Messages.js";
import Questions from "./Components/Questions.js";
import Settings from "./Components/Settings.js";
import Success from "./Components/Success.js";
import Search from "./Components/Search.js";
import {AppContext} from "./Context/AppContext";
import React , {useContext,useEffect, useState} from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import {CHECK_TOKEN_URL,GET_USER_URL,REFRESH_TOKEN_URL,ADD_COMMENT,FEED_POSTS,SEARCH_USER,SOCKET_URL,GET_POSTS} from "./Endpoints/API_ENDPOINTS";
import { useHistory } from "react-router-dom";
import {useSetLoggedInTrue} from "./utility-functions/useSetLogin";
import jwt_decode from "jwt-decode";
import {clearCookies,isTokenExpired,getStoredTokens,setCookie,shuffle} from "./utility-functions/utility-functions.js";
import {io} from 'socket.io-client';

const _ = require("lodash");

const UserRoutePages = ()=>{
  return(
   <Switch>
     <Route exact path="/user/messages" component={Messages}/>
     <Route exact path='/user/feed' component={MainPage}/>
     <Route exact path="/user/questions" component={Questions}/>
     <Route exact path="/user/settings" component={Settings}/>
     <Route path="/user/profile" component={Profile}/>
     <Route exact path="*" component={PageNotFound}/>
   </Switch>
  )
}

const SearchRoute = (params)=>{

  return(
    <>
      <FeedNavbar/>
      <Search data={params.location}/>
    </>
  )
}


const AuthenticatedRoute = (props)=>{

  if(props.loggedIn)
  {
    return(
      <>
       <FeedNavbar key="data"/>
       <UserRoutePages/>
       </>)
  } else {

    return(
      <Redirect to='/login'/>
    )
  }
}


const App = ()=>{

const [loggedIn, setLoggedIn] = useState(false);
let [user,setUser] = useState({});
const [isLoading, setIsLoading] = useState(true);
const [userPosts,setUserPosts] = useState([]);
const [isLoadingPosts,setIsLoadingPosts] = useState(false);
const [feedPosts,setFeedPosts] = useState([]);
const [globalSocket,setGlobalSocket] = useState(null);

const  setCookie = (cName, cValue, expDays)=> {
        let date = new Date();
        date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
}

const fetchFeedPosts = ()=>{

  const {token} = getStoredTokens();

  axios({
    url:FEED_POSTS,
    method:'get',
    headers:{
      'Authorization':`Bearer ${token}`
    }
  }).then(resp=>{
    if(resp.status == 200)
    {
      const data_arr = shuffle(resp.data[0]);
      setFeedPosts(data_arr);
    }

  }).catch(err=>{
    console.log(err);
  })
}


const updateUserProperty = (userObj)=>{
  setUser(userObj);
}

const refreshTokenFunc = ()=>{
  setIsLoading(true);
  let {refreshToken} = getStoredTokens();
  if(refreshToken != '')
  {
     axios.post(REFRESH_TOKEN_URL,{
        token:refreshToken
        }
   ).then(resp=>{
       if(resp.status == 200)
       {
         const d = new Date();
         d.setTime(d.getTime()+1*60*60*60*1000);
         let expires = "expires="+d.toUTCString();
         const newToken = resp.data.token;
         setLoggedIn(true);
         setCookie('token',newToken,1);
         getUserAndSet(newToken);
       } else{
         clearCookies();
         setLoggedIn(false);
         setIsLoading(false);
       }
     }).catch(err=>{
       console.log(err);
      clearCookies();
      setLoggedIn(false);
      setTimeout(()=>{
        setIsLoading(false);
      },500);
     })
  } else {
    clearCookies();
    setLoggedIn(false);
    setTimeout(()=>{
      setIsLoading(false);
    },500);
  }
}

const fetchUserPosts = ()=>{
    const {token} = getStoredTokens();
    if(token!='')
    {
      if(!isTokenExpired(token))
      {
        axios({
          url:GET_POSTS,
          method:'post',
          headers:{
            'Authorization':`Bearer ${token}`
          }
        }).then(resp=>{

          setUserPosts(resp);
          setIsLoading(false);
          setIsLoadingPosts(false);
        }).catch(err=>{
          setIsLoading(false);
          setLoggedIn(false);
          setIsLoadingPosts(false);
        })

      }
    }

    setIsLoading(false);
    setIsLoadingPosts(false);
}

const getUserAndSet = (myToken)=>{
  const data = {
    token : myToken
  }

axios({
  url:GET_USER_URL,
  method:'post',
  headers:{
    'Content-Type': 'application/json',
    'Authorization':'Bearer '+myToken
  },
  data:data
}).then(resp=>{
  if(resp.status == 200)
  {
    setUser(resp.data.user);
    setLoggedIn(true);

    // /aici vom trage si postarile
    fetchFeedPosts();
    setIsLoadingPosts(true);
    fetchUserPosts();
  }
}).catch(err=>{
  console.log(err);
  setTimeout(()=>{
    setLoggedIn(true);
    setIsLoading(false);
  },1000);
})

}

const reloadDataAfterRefresh = ()=>{

    let {token,refreshToken} = getStoredTokens();
    token = token.trim();
    refreshToken = refreshToken.trim();
   if(token != '' && refreshToken != '')
   {

     fetch(CHECK_TOKEN_URL,{
         method:"POST",
         headers: {"Content-type": "application/json;charset=UTF-8"},
         body:JSON.stringify({
          token:token
         })
     }).then(resp=>{

       if(resp.status == 200)
       {
         getUserAndSet(token);

       } else {
         if(isTokenExpired(token))
         {
           refreshTokenFunc();
           return;
         }
         clearCookies();
         setTimeout(()=>{
           setLoggedIn(false);
           setIsLoading(false);
         },500);
       }

      }).catch(err=>{
        if(isTokenExpired(token))
        {
          refreshTokenFunc();
          return;
        }
         console.log(err);
         clearCookies();
         setLoggedIn(false);
         setTimeout(()=>{
           setIsLoading(false);
         },500);
      });
   } else {
     clearCookies();
     setLoggedIn(false);
     setTimeout(()=>{
       setIsLoading(false);
     },500);
   }
}


const updateUser = (user)=>{
    setUser(user);
}

const updateToken = (tk)=>{
    data.token = tk;
}

const updateRefreshToken = (tk)=>{
    data.refreshToken = tk;
}

const handlePostComment = (evt,postId,update,oldPosts,commentsData,resetData,beforeData) =>{

     const {token} = getStoredTokens();
     const newData = {};
     newData[postId] = '';
     resetData({...beforeData,...newData});
    if(token)
    {
      axios({
        url:ADD_COMMENT(postId),
        method:'put',
        headers:{
          'Authorization':`Bearer ${token}`
        },
        data:{
          comment:commentsData
        }
      }).then(resp=>{
          if(resp.status == 200)
          {
                 const newPost = oldPosts.data.map((post)=>{
                    if(post._id == postId)
                    {
                      post.comments.unshift({
                        userId:user._id,
                        comment:commentsData,
                        userPhoto:user.profilePicture,
                        username:user.username,
                      })

                    }
                  return post;
                 });
                 update({...oldPosts,data:newPost});
          }
          else{
            alert("Error while uploading post!")
          }
      }).catch(err=>{
        console.log(err);
        alert("Error while uploading post!")
      })

    } else if (isTokenExpired(token)){
      refreshTokenFunc();
    }
  }

  const data = {
    user:user,
    setUser:setUser,
    token:'',
    refreshToken:'',
    setLoggedIn:setLoggedIn,
    setIsLoading:setIsLoading,
    isLoading:isLoading,
    reload:reloadDataAfterRefresh,
    updateUser:updateUser,
    updateToken:updateToken,
    updateRefreshToken:updateRefreshToken,
    getUserAndSet:getUserAndSet,
    refreshToken:refreshTokenFunc,
    updateUserProperty:updateUserProperty,
    userPosts:userPosts,
    setUserPosts:setUserPosts,
    isLoadingPosts:isLoadingPosts,
    fetchUserPosts:fetchUserPosts,
    handlePostComment:handlePostComment,
    feedPosts:feedPosts,
    fetchFeedPosts:fetchFeedPosts,
    setGlobalSocket:setGlobalSocket,
    globalSocket:globalSocket
  }

useEffect(()=>{

    reloadDataAfterRefresh();
  },[]);


 if(isLoading)
 {
   return(
     <Loading/>
   )
 } else {
   return (
     <div>
     <Router>
     <AppContext.Provider value={data}>
         <Switch>
         <Route exact path='/' component={Home}>
           <Navbar/>
           <Home/>
         </Route>
     <Route path="/user" key="data">
         <AuthenticatedRoute loggedIn={loggedIn} />
     </Route>
       <Route exact path = "/register-success" component={Success}/>
       <Route exact path='/login' component={Login} >
       </Route>
       <Route path='/signup' component={SignUp}>
       </Route>
       <Route path='/about' component={About}>
       </Route>
       <Route path='/search' component={SearchRoute}/>
       <Route component={PageNotFound}/>
       </Switch>
       </AppContext.Provider>
       </Router>
     </div>
   )
 }

}

export default App;
