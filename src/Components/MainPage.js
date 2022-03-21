import React ,{useEffect,useState,useContext,useRef} from "react";
import "../Styles/mainPage.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCommentDots}  from '@fortawesome/free-solid-svg-icons';
import {faVideo} from '@fortawesome/free-solid-svg-icons';
import {faUserFriends} from '@fortawesome/free-solid-svg-icons';
import {faBookmark} from '@fortawesome/free-solid-svg-icons';
import {faQuestionCircle} from '@fortawesome/free-solid-svg-icons';
import {faBuilding} from '@fortawesome/free-solid-svg-icons';
import {faCalendar} from '@fortawesome/free-solid-svg-icons';
import {faGraduationCap} from '@fortawesome/free-solid-svg-icons';
import {faPhotoVideo} from '@fortawesome/free-solid-svg-icons';
import {faTags} from '@fortawesome/free-solid-svg-icons';
import {faLocationArrow} from '@fortawesome/free-solid-svg-icons';
import {faThumbsUp} from '@fortawesome/free-solid-svg-icons';
import {faComment} from '@fortawesome/free-solid-svg-icons';
import { Input } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Person from "../images/person.jpg";
import Button from '@material-ui/core/Button';
import Birthday from '../images/gift-box.png';
import Add from '../images/snicker.jpg';
import Post from "../images/dummy-post.jpg";
import { Link } from "react-router-dom";
import {AppContext} from "../Context/AppContext";
import Loading from '../Components/Loading.js';
import {getStoredTokens} from "../utility-functions/utility-functions";
import axios from "axios";
import Loader from "../images/loader.gif";
import {POST,LIKE_POST,ADD_COMMENT,CREATE_CONVERSATION,GET_POSTS} from "../Endpoints/API_ENDPOINTS";

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

const MainPage =()=>{


const ContextApp = useContext(AppContext);
const classes = useStyles();
const [commentsContent,setCommentsContent] = useState({});
const [commentDisplay,setCommentDisplay] = useState({});
const [value, setValue] = React.useState('Controlled');
const [toggleComments, setToggleComments] = useState(false);
const [liked,setLiked] = useState(false);
const textRef = useRef(null);
const imgRef = useRef(null);
const imgInput = useRef(null);
const [imageUploaded,setImageUploaded] = useState(false);
const [imageToUpload,setImageToUpload] = useState({});
const [postText,setPostText] = useState("");
const [postDisabled,setPostDisabled] = useState(true);
const [postIsUploading,setPostIsUploading] = useState(false);
const [postError,setPostError] = useState(false);
const [posts,setPosts] = useState([]);
const [postLiked,setPostLiked] = useState({});

const handleChange = (event) => {
 setValue(event.target.value);
};

const resFunc = ()=>{

}

const handleToggleComm = (psId)=>{
    const data = {}
    data[psId] = !commentDisplay[psId];
    setCommentDisplay({...commentDisplay,...data});
}



const imgUploadProcess = (evt)=>{
  if(evt.target.files[0]!=undefined)
  {
    const file = evt.target.files[0];
    const renderedData = URL.createObjectURL(file);
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    setImageUploaded(true);
    fileReader.onload = ev =>{
      const obj = {
        coverPicture:ev.target.result.split("base64,")[1]
      }
      setImageToUpload(obj);

    }
  }

}

const handlePhotoUpload = (evt)=>{
  setImageUploaded(false);
  evt.preventDefault();
  imgInput.current.click()
}


const postData = ()=>{
  setImageUploaded(false);
  setPostIsUploading(true);
  const {token} = getStoredTokens();
  axios({
    url:POST,
    method:'post',
    headers:{
      'Authorization':`Bearer ${token}`
    },
    data:{
      description:postText,
      postPicture:imageToUpload.coverPicture
    }
  }).then(resp=>{


    if(resp.status == 200)
    {
      setPostIsUploading(false);

      let postObj = {
        comments:[],
        desc:postText,
        img:imageToUpload.coverPicture,
        likes:[],
        postHolder:ContextApp.user,
        userId:ContextApp.user._id,
        _id:resp.data
      }
      let oldElems;
      setPosts(oldArr => [postObj,...oldArr]);
      setImageToUpload("");
      setPostText("");

      const data = {}
      data[resp.data] = false;
     setPostLiked({...postLiked,...data})
    }
    else{
      setPostIsUploading(false);
      alert("Error while posting!");
    }
  }).catch(err=>{
    if( err.response && err.response.status == 401)
    {
      ContextApp.setLoggedIn(false);
    }

    setPostIsUploading(false);
    alert("Error while posting!");
  })
}

const handlePostText = (evt)=>{
  const text = evt.target.value;
  setPostText(text);
  if(text.length>0)
  {
    setPostDisabled(false);
  } else {
    setPostDisabled(true);
  }

}


const getData = ()=>{
  const {token} = getStoredTokens();
  axios({
    url:GET_POSTS,
    method:'post',
    headers:{
      'Authorization':`Bearer ${token}`
    }
  }).then(resp=>{

  }).catch(err=>{
    console.log(err);
  })
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
               const newPosts = posts.map((post)=>{
                 if(post._id == postId)
                 {
                   post.likes.push({
                     userId:ContextApp.user._id
                   })
                 }
                 return post;
               });

               setPosts([...newPosts]);
             } else {
               const newPosts = posts.map((post)=>{
                 if(post._id == postId)
                 {
                   post.likes = post.likes.filter(ps=>ps.userId!=ContextApp.user._id);
                 }
                 return post;
               });

               setPosts([...newPosts]);

             }
          }
      }).catch(err=>{
        console.log(err);
      })
    })(stateValue);
}

const [isLoadingData,setIsLoadingData] = useState(true);
let user;

const handleChangeCommentText = (evt,psId)=>{
   const data = evt.target.value;
   const newCommentData = {};
   newCommentData[psId] = data;
   setCommentsContent({...commentsContent,...newCommentData});
}

const handlePostCommentData = (evt,postId)=>{
   const newPosts = posts;
   const commentObj = {
     userId:  ContextApp.user._id,
     comment : commentsContent[postId],
     userPhoto: ContextApp.user.profilePicture,
     username:ContextApp.user.username
   };
   const newCommentData = {};
   const commToPost = commentsContent[postId];
   newCommentData[postId] = '';
   setCommentsContent({...commentsContent,...newCommentData});

   const {token} = getStoredTokens();

    if(token){
      axios({
        method:'put',
        url:ADD_COMMENT(postId),
        headers:{
          'Authorization':`Bearer ${token}`
        },
        data:{
          comment:commToPost
        }
      }).then(resp=>{
        if(resp.status == 200)
        {
          for (const post of newPosts){
             if(post._id == postId)
             {
               post.comments.unshift(commentObj)
             }
          }

          setPosts([...newPosts]);
        }
      }).catch(err=>{
        console.log(err);
      })

    } else {
      AppContext.setLoggedIn(false);
    }
}



useEffect(()=>{

    window.addEventListener('resize',resFunc);

    if(ContextApp.user){
      setIsLoadingData(false);
    }

    const commentData = {};

    setCommentDisplay({...commentDisplay,...commentData});

    return()=>{
      window.removeEventListener('resize',resFunc);
    }
},[ContextApp.user]);



useEffect(()=>{
    setPosts(ContextApp.feedPosts);
    const data = {};
    const myCommentData = {};
    for(const post of ContextApp.feedPosts)
    {
       const likedPost = !(post.likes.find((ps)=>ps.userId == ContextApp.user._id) == undefined);
       const psId = post._id;
       data[psId] = likedPost;
       myCommentData[psId] = '';
    }
     setPostLiked({...postLiked,...data});
     setCommentsContent({...commentsContent,...myCommentData});

},[ContextApp.feedPosts])


if(ContextApp.user)
 {
    return(
      <div className="main-container">
      <div className="side-nav options">
     <div className="item-container item-large special-align">
       <FontAwesomeIcon icon={faCommentDots} className="icon-container"/>
         <span className="inline">
          <Link to="/user/messages" style={{textDecoration:"none",fontSize:"1.3rem", color:"#000"}}>Chats</Link>
         </span>
     </div>

  </div>
  <div className="main-content">
  <div className="post-card">
   <div className="form-container">
   <div className="person-avatar-container">
     <img src={`data:image/jpeg;base64,${ContextApp.user.profilePicture}`} alt="person" className="person-avatar"/>
   </div>
      <form className={`${classes.root} text-input`} noValidate autoComplete="off">
      <TextField
         id="outlined-multiline-static"
         label="What is on your mind?"
         multiline
         style={{width:"80%"}}
         rows={2}
         defaultValue=""
         ref={textRef}
         onChange={handlePostText}
    />

   {imageUploaded && <p className="success-img">Image Uploaded!</p>}
    <div className="media-type-container">
    <input type="file" hidden={true}  accept=".jpg, .jpeg, .png" ref={imgInput} onChange={imgUploadProcess}/>
      <button onClick={handlePhotoUpload} className="media-type">
          <FontAwesomeIcon icon={faPhotoVideo} className="icon-container photo-video"/>
          <p className="media-icon-desc ">Photo</p>
      </button>

      <Button disabled={postDisabled} variant="contained" className="btn" onClick={postData} color="primary">
        Share!
      </Button>
    </div>

    </form>
   </div>
  </div>

  <div className="feed-container">

  {postIsUploading &&    <div className="post-is-loading">
      <img src={Loader} className="gif-loader" />
      <p className="loading-post-text">Uploading Post...</p>
    </div>
  }

  {postError && <p className='post-error-uploaded'>ERROR WHILE UPLOADING POST!</p>}


  {/*======================== HERE WE HAVE POSTS ========================*/}
  {posts.length>0 && posts.map((post,id)=>{
      return(
        <div className="post-container" key={id}>
          <div className="header">
               <img src={`data:image/jpeg;base64,${post.postHolder.profilePicture}`} className="person-avatar-online"/>
               <p className="post-username">{post.postHolder.name}</p>
          </div>
          <div className="post-body">
            <p className="description"> {post.desc}</p>
            <div>
            {post.img &&  <img src={`data:image/jpeg;base64,${post.img}`} alt="post-image" className="post-image"/>}
          </div>
           <div className="post-feedback-section">
             <div><FontAwesomeIcon icon={faThumbsUp} style={{cursor:'pointer'}} onClick={()=>{handleLike(post._id)}} className={postLiked[post._id]?"icon-container like post-elem-clicked":"icon-container"}/><span style={{marginLeft:'20px'}}>{post.likes.length}</span></div>
             <FontAwesomeIcon icon={faComment} style={{cursor:'pointer'}} onClick={()=>{handleToggleComm(post._id)}}  className={commentDisplay[post._id]?"icon-container like post-elem-clicked":"icon-container"}/>
           </div>

           <div className={commentDisplay[post._id]? "post-comment-section" : "post-comment-section not-display"}>

              <TextField
              id="outlined-multiline-static"
              label="Add comment"
              multiline
              style={{width:"80%"}}
              rows={2}
              value = {commentsContent[post._id]}
              onChange = {(evt)=>{handleChangeCommentText(evt,post._id)}}
              defaultValue=""
               />
             <Button variant="contained" onClick={(evt)=>{handlePostCommentData(evt,post._id)}} className="btn btn-post" color="primary">
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
  })}

{/*======================== HERE IS POST END(there is another post below this) ========================*/}


  </div>
  <div className="right-nav">

      <img src={Add} alt="add" className="addImg" />
    </div>
   </div>

  </div>
    )
  } else {
    return(
      <div></div>
    )
  }
}

export default MainPage;
