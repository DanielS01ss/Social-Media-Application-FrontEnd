import React ,{useState,useContext,useEffect} from "react";
import "../Styles/Profile.css";
import bkgImg from "../images/user-bkg.jpg";
import userProfilePhoto from "../images/person.jpg";
import Person from "../images/person.jpg";
import TextField from '@material-ui/core/TextField';
import {faPhotoVideo} from '@fortawesome/free-solid-svg-icons';
import {faTags} from '@fortawesome/free-solid-svg-icons';
import {faLocationArrow} from '@fortawesome/free-solid-svg-icons';
import {faUserPlus} from '@fortawesome/free-solid-svg-icons';
import {faCommentAlt} from '@fortawesome/free-solid-svg-icons';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Post from "../images/dummy-post.jpg";
import {faThumbsUp} from '@fortawesome/free-solid-svg-icons';
import {faComment} from '@fortawesome/free-solid-svg-icons';
import {faHome} from '@fortawesome/free-solid-svg-icons';
import {faCity} from '@fortawesome/free-solid-svg-icons';
import {faHeart} from '@fortawesome/free-solid-svg-icons';
import {faGraduationCap} from '@fortawesome/free-solid-svg-icons';
import {faUserCheck} from '@fortawesome/free-solid-svg-icons';
import {Link} from "react-router-dom";
import {AppContext} from "../Context/AppContext";
import Loading from '../Components/Loading.js';
import {getStoredTokens} from "../utility-functions/utility-functions.js";
import jwt_decode from "jwt-decode";
import {FETCH_USER_URL,LIKE_POST,FOLLOW_USER,UNFOLLOW_USER,CREATE_CONVERSATION,SEARCH_USER} from "../Endpoints/API_ENDPOINTS";
import axios from "axios";
import {useHistory} from "react-router-dom";
import {clearCookies} from "../utility-functions/utility-functions";
import NotFound from "./PageNotFound";
import LoadingDataGif from "../images/loader.gif";

const _ = require("lodash");

const Profile = ({location}) =>{
  const useStyles = makeStyles((theme) => ({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
  }));
  const [commentsContent,setCommentsContent] = useState({});
  const [toggleComments, setToggleComments] = useState(false);
  const [liked,setLiked] = useState(false);
  const [loadingData,setLoadingData] = useState(true);
  const classes = useStyles();
  const [value, setValue] = React.useState('Controlled');
  const history = useHistory();
  const ContextAppData = useContext(AppContext);
  const user = ContextAppData.user;
  const [isLoading,setIsLoading] = useState(true);
  const [displayUserInteract,setDisplayUserInteract] = useState(false);
  const [userNotFound,setUserNotFound] = useState(false);
  const [fetchedUser,setFetchedUser] = useState({});
  const [fetchedUserPosts,setFetchedUserPosts] = useState({});
  const [mainProfile,setMainProfile] = useState(false);
  const [postLiked,setPostLiked] = useState({});
  const [isUserFollowed,setIsUserFollowed] = useState(false);
  const [commentDisplay,setCommentDisplay] = useState({});

  const handleToggleComm = (psId)=>{
      const data = {}
      data[psId] = !commentDisplay[psId];
      setCommentDisplay({...commentDisplay,...data});
  }

const handleLike = (postId)=>{

    const data = {};
    data[postId] = !postLiked[postId];

    setPostLiked({...postLiked,...data});
    const {token} = getStoredTokens();
    const stateValue = !postLiked[postId];
    ((likeVal)=>{
      axios({
        method:'put',
        url:LIKE_POST(postId),
        headers:{
          'Authorization':`Bearer ${token}`
        }
      }).then(resp=>{
          if(resp.status == 200){
             if(likeVal)
             {
               const newPosts = fetchedUserPosts.data.map((post)=>{
                 if(post._id == postId)
                 {
                   post.likes.push({
                     userId:ContextAppData.user._id
                   })
                 }
                 return post;
               });

               setFetchedUserPosts({...fetchedUserPosts,data:newPosts});
             } else {
               const newPosts = fetchedUserPosts.data.map((post)=>{
                 if(post._id == postId)
                 {
                   post.likes = post.likes.filter(ps=>ps.userId!=ContextAppData.user._id);
                 }

                 return post;
               });

               setFetchedUserPosts({...fetchedUserPosts,data:newPosts});

             }
          }
      }).catch(err=>{
        console.log(err);
      })
    })(stateValue);


}

const fetchPosts = (id)=>{
    const {token} = getStoredTokens();
 if(token)
 {
   axios({
       url:'http://localhost:8000/api/posts/userposts',
       method:'get',
       headers:{
         'Accept': 'application/json',
         'Content-Type': 'application/json',
         'Authorization':`Bearer ${token}`,
         'UserId':id
       }
   }).then(resp=>{

     setFetchedUserPosts(resp);
     const data = {};
     const commentData = {};
     const commentsText = {};
     for(const post of resp.data)
     {
        const likedPost = !(post.likes.find((ps)=>ps.userId == ContextAppData.user._id) == undefined);
        const psId = post._id;
        data[psId] = likedPost;
        commentData[psId] = false;
        commentsText[psId] = '';
     }
      setPostLiked({...postLiked,...data});
      setCommentDisplay({...commentDisplay,...commentData});
      setCommentsContent({...commentsContent,...commentsText});

   }).catch(err=>{
     setFetchedUserPosts({
       status:500,
       data:[]
     })
   })
 } else{

   ContextAppData.setLoggedIn(false);
   ContextAppData.setIsLoading(true);
 }
}


const fetchUser = (id,token)=>{
    axios({
      method:'GET',
      url:FETCH_USER_URL(id),
      headers:{
        'Authorization':`Bearer ${token}`
      }
    }).then((resp)=>{
      if(resp.status == 200)
      {
        const isFollowed = resp.data.followers.find(us=>us.username == ContextAppData.user.username)!=undefined;
        setIsUserFollowed(isFollowed);
        setFetchedUser(resp.data);
        fetchPosts(id);
      } else {
        const obj = {
          fetched : false
        }
        setFetchedUser(obj);
      }
    }).catch(err=>{
      console.log(err);
    })
  }

const handleFollowUser = ()=>{
    setIsUserFollowed(true);
    const {token} = getStoredTokens();
    axios({
      url:FOLLOW_USER(fetchedUser._id),
      method:'put',
      headers:{
        'Authorization':`Bearer ${token}`
      }
    }).then(resp=>{

    }).catch(err=>{
      console.log(err);
    })
}

const handleUnfollowUser = ()=>{
   setIsUserFollowed(false);
   const {token} = getStoredTokens();
   axios({
     url:UNFOLLOW_USER(fetchedUser._id),
     method:'put',
     headers:{
       'Authorization':`Bearer ${token}`
     }
   }).then(resp=>{

   }).catch(err=>{
     console.log(err);
   })
}

const handleChangeCommInpVal = (evt,postId)=>{
  const commentTextData = {};
  commentTextData[postId] = evt.target.value;
  setCommentsContent({...commentsContent,...commentTextData});

}

const createConversation = ()=>{

  history.push()
  const {token} = getStoredTokens();


  const foundPers = ContextAppData.user.conversationsParteners.find(usr=> usr.id == fetchedUser._id);
  if(!foundPers || ContextAppData.user.conversationsParteners.length == 0)
  {

    axios({
      method:'post',
      url:CREATE_CONVERSATION,
      headers:{
        'Authorization':`Bearer ${token}`
      },
      data:{
        userId:fetchedUser._id
      }
    }).then(resp=>{

      history.push('/user/messages');
      window.location.reload();

    }).catch(err=>{
        history.push('/user/messages');
        alert("Error while creating conversation");
      console.log(err);
    })

  }
  else{
     history.push('/user/messages');
  }



  fetch('http://localhost:8000/api/message/create_conversation',{
    method:'post',
    headers:{
      'Authorization':`Bearer ${token}`
    },
    body:JSON.stringify({
      userId:'6163fbc60a32462f4c5ed9ce'
    })
  }).then(resp=>{
  }).catch(err=>{
    console.log(err);
  })

}

const handleStartConv = (personId)=>{


}

useEffect(()=>{

  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const {token} = getStoredTokens();
  if(token && id)
  {
    if(id == ContextAppData.user._id)
    {
      setFetchedUser(ContextAppData.user);
      fetchPosts(ContextAppData.user._id);
      setDisplayUserInteract(false);
    }
    else
    {
      setDisplayUserInteract(true);
      fetchUser(id,token);
    }
  } else {
    if(!token)
    {
      ContextAppData.setLoggedIn(false);
      ContextAppData.setIsLoading(true);
      clearCookies()
    }
  }
},[location]);




if(!_.isEmpty(fetchedUser))
  {
      if(fetchedUser.fetched)
        return (
          <div style={{paddingTop:"60px"}}>
            <NotFound/>
          </div>
        )
      else
        return(
          <div>
            <div className="main-content-profile" >
              <div className="profile-data-container" >
                <img className="profile-background-image"  src={`data:image/jpeg;base64,${fetchedUser.coverPicture}`} alt="bkg image"/>
                <img className="person-avatar-profile" src={`data:image/jpeg;base64,${fetchedUser.profilePicture}`} />
                <p className="username">{fetchedUser.username}</p>
                <p className="user-desc">{fetchedUser.description}</p>
            {
              displayUserInteract &&

                <div className="user-contact">
                  <p className="user-contact-action" >

              {isUserFollowed? <div className="hover-mouse" onClick={handleUnfollowUser}>
                  <FontAwesomeIcon icon = {faUserCheck} style={{"color":"#6600ff"}} className = "user-action-icon"/>
                  <span className="user-action-icon-label">Unfollow</span>
                </div>
                  :
                <div onClick={handleFollowUser} className="hover-mouse">
                  <FontAwesomeIcon icon = {faUserPlus} className = "user-action-icon"/>
                  <span className="user-action-icon-label">Follow</span>
                </div>
                }
                  </p>
                  <p className="user-contact-action"  onClick={handleStartConv(fetchedUser._id)}>
                  <FontAwesomeIcon icon = {faCommentAlt} className = "user-action-icon"/>
                  <span className="user-action-icon-label" onClick={()=>{createConversation()}} className="link-decoration">&nbsp; Messages</span>
                  </p>
                </div>
            }

             </div>
             <div className="user-heading-container">
                 <div className="profile-info no-form">
                   <p className="profile-info-title">User Description</p>
                   <p className="profile-info-item"> <FontAwesomeIcon icon={faHome} className="profile-description-icon"/>From:</p><span>{fetchedUser.from}</span>
                   <p className="profile-info-item"><FontAwesomeIcon icon={faCity} className="profile-description-icon"/>Lives in:</p><span>{fetchedUser.livesIn}</span>
                   <p className="profile-info-item"><FontAwesomeIcon icon={faHeart} className="profile-description-icon"/>Relationship Status:</p>
                   {
                     (() => {
                       switch (fetchedUser.relationship) {
                         case 0:
                           return (<span></span>);
                           break;
                         case 1:
                           return (<span>Married</span>);
                           break;
                         case 2:
                           return (<span>Single</span>);
                           break;
                         case 3:
                           return (<span>In a relationship</span>);
                           break;
                         default:

                       }
                     })()

                   }
                   <p className="profile-info-item"><FontAwesomeIcon icon={faGraduationCap} className="profile-description-icon"/>Studied at:</p><span>{fetchedUser.education}</span>
                 </div>
             </div>
             {/*Posts*/}
             {fetchedUserPosts.data ?
             fetchedUserPosts.data.map((post)=>{
               return(
                 <div className="user-posts-container ">
                       <div className={displayUserInteract? "profile-post-container ":" profile-post-container  "}>
                         <div className="header">
                             <img src={`data:image/jpeg;base64,${post.postHolder.profilePicture}`} className="person-avatar-online"/>
                             <p className="post-username">{post.postHolder.name}</p>
                            </div>
                            <div className="post-body">
                              <p className="description">
                                {post.desc}
                              </p>
                            <div>
                            {post.img &&  <img src={`data:image/jpeg;base64,${post.img}`} alt="post-image" className="post-image"/>}
                            </div>
                             <div className="post-feedback-section">
                                <div><FontAwesomeIcon icon={faThumbsUp} style={{cursor:'pointer'}} onClick={()=>{handleLike(post._id)}} className={postLiked[post._id]?"icon-container like post-elem-clicked":"icon-container"}/><span style={{marginLeft:'20px'}}>{post.likes.length}</span></div>
                                <FontAwesomeIcon icon={faComment} style={{cursor:'pointer'}} onClick={()=>{handleToggleComm(post._id)}} className={commentDisplay[post._id]?"icon-container like post-elem-clicked":"icon-container"}/>
                             </div>
                            </div>

                            <div className={commentDisplay[post._id]? "post-comment-section" : "post-comment-section not-display"}>
                               <TextField
                               id="outlined-multiline-static"
                               label="Add comment"
                               multiline
                               style={{width:"80%"}}
                               rows={2}
                               defaultValue=""
                               value = {commentsContent[post._id]}
                               onChange = {(evt)=>{handleChangeCommInpVal(evt,post._id)}}
                                />

                              <Button variant="contained" onClick={(evt)=>{const passData = commentsContent[post._id]; ContextAppData.handlePostComment(evt,post._id,setFetchedUserPosts,fetchedUserPosts,passData,setCommentsContent,commentsContent)}} className="btn btn-post" color="primary">
                                  Post
                                </Button>
                                <div className="previous-comments">
                                  {post.comments.map((postComm)=>{
                                    return(
                                      <div className="card-reply">
                                            <div className="card-reply-header">
                                              <img src={`data:image/jpeg;base64,${postComm.userPhoto}`} alt="person" className="person-avatar question-card-reply-person-image"/>
                                              <p className="card-reply-username">{postComm.username} said:</p>
                                            </div>
                                            <p className="card-reply-text-post">{postComm.comment}</p>
                                        </div>
                                    )
                                  })}

                                </div>
                            </div>
                         </div>
                       </div>
                   )
                })
                     :
                     <div className='loading-data-container'>
                         <img src={LoadingDataGif} className='loading-data-gif'/>
                         <p className='loading-text'>Loading posts...</p>
                     </div>
                 }
             {/*Posts*/}
             </div>
          </div>
         )
  } else {
    return(
      <div style={{paddingTop:"90px"}}>
        <Loading/>
      </div>
    )
  }

}

export default Profile;
