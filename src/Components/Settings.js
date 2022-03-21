import React,{useRef,useState,useContext,useEffect} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUserCog} from '@fortawesome/free-solid-svg-icons';
import {faImages} from '@fortawesome/free-solid-svg-icons';
import "../Styles/Settings.css";
import Post from "../images/dummy-post.jpg";
import Button from '@material-ui/core/Button';
import userProfilePhoto from "../images/person.jpg";
import TextField from '@material-ui/core/TextField';
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';
import {AppContext} from "../Context/AppContext";
import {UPDATE_USER,DELETE_TOKEN_URL} from "../Endpoints/API_ENDPOINTS";
import axios from "axios";
import Loading from "./Loading";
import {isTokenExpired,clearCookies,getStoredTokens} from "../utility-functions/utility-functions";
import { useHistory } from "react-router-dom";

const _ = require("lodash");

const Settings = ()=>{

const history = useHistory();
const [countryFrom,setCountryFrom] = useState("");
const [regionFrom,setRegionFrom] = useState("");
const [countryLives,setCountryLives] = useState("");
const [regionLives,setRegionLives] = useState("");
const [username,setUsername] = useState("");
const [description,setDescription] = useState("");
const [coverPictureErr, setCoverPictureErr] = useState(false);
const [profilePictureErr, setProfilePictureErr] = useState(false);
const [successProfileImg,setSuccessProfileImg] = useState(false);
const [successCoverImg,setSuccessCoverImg] = useState(false);
const [password,setPassword] = useState("");
const [repeatPassword,setRepeatPassword] = useState("");
const [passMatch,setPassMatch] = useState(false);
const [profileImageUploaded,setProfileImageUploaded] = useState(false);
const [coverImageUploaded,setCoverImageUploaded] = useState(false);
const [coverImageObj,setCoverImageObj] = useState({});
const [profileImageObj,setProfileImageObj] = useState({});
const [usernameSuccess,setUsernameSuccess] = useState(false);
const [passwordSuccess,setPasswordSuccess] = useState(false);
const [descriptionSuccess,setDescriptionSuccess] = useState(false);
const [fromSuccess,setFromSuccess] = useState(false);
const [livesSuccess,setLivesSuccess] = useState(false);
const [usernameEmpty,setUsernameEmpty] = useState(false);
const [relationshipStatus,setRelationShipStatus] = useState("");
const [education,setEducation] = useState("");
const [relationshipStatusSuccess,setRelationshipStatusSuccess] = useState(false);
const [educationSuccess,setEducationSuccess] = useState(false);
const [confirmDelete, setConfirmDelete] = useState(false);

const ContextApp = useContext(AppContext);
const inputFile = useRef(null);
const hiddenCoverPhotoInput = useRef(null);
const hiddenProfilePhotoInput = useRef(null);
const coverPhotoImage = useRef(null);
const profilePhotoImage = useRef(null);
const usernameRef = useRef(null);
const passwordRef = useRef(null);
const descriptionRef = useRef(null);



const handleCoverPhotoInput = (evt)=>{
  setSuccessCoverImg(false);
  hiddenCoverPhotoInput.current.click();
}

const handleProfilePhotoInput = (evt)=>{

  setSuccessProfileImg(false);
  hiddenProfilePhotoInput.current.click()
}

const handleUpdateReq = (obj,success)=>
{

  const userUpdateURL = UPDATE_USER(ContextApp.user._id);
  const {token} = getStoredTokens();
  obj.userId = ContextApp.user._id;


 if(token != '')
 {
     axios({
       url:userUpdateURL,
       method:'put',
       data:obj,
       headers:{
         'Authorization':`Bearer ${token}`,
         'Content-Type':'application/json'
       }
     }).then(resp=>{
      if( resp.status && resp.status == 200)
      {
         success(true);
         const newUser = ContextApp.user;
         newUser[Object.keys(obj)[0]] = obj[Object.keys(obj)[0]];
         ContextApp.setUser(newUser);
      }
      else{
        if(isTokenExpired(token))
        {
          ContextApp.refreshToken(token);
          return;
        }
        alert("Error while updating! Try again later!")
      }
     }).catch(err=>{
       if(isTokenExpired(token))
       {

         ContextApp.refreshToken(token);
         return;
       }
       console.log(err);
       alert("Server Error");
     })
 } else {
    clearCookies();
    history.push('/');
 }

}

const handleSetUsername = (txt)=>{
    setUsernameSuccess(false);
    const val = txt.target.value;
    if(val.length == 0)
      setUsernameEmpty(true);
    else
      setUsernameEmpty(false);
    setUsername(val);
}

const handleDescription = (txt)=>{
  setDescriptionSuccess(false);
  const val = txt.target.value;
  setDescription(val);
}

const selectCountryFrom = (val)=> {
  setFromSuccess(false);
  setCountryFrom(val);
}

const selectRegionFrom = (val)=>{
  setFromSuccess(false);
  setRegionFrom(val);
}

const selectCountryLives = (val)=> {
  setLivesSuccess(false);
  setCountryLives(val);
}

const selectRegionLives = (val)=>{
  setLivesSuccess(false);
  setRegionLives(val);
}


function imageSize(url) {
    const img = document.createElement("img");

    const promise = new Promise((resolve, reject) => {
      img.onload = () => {
        const width  = img.naturalWidth;
        const height = img.naturalHeight;
        resolve({width, height});
      };
      img.onerror = reject;
    });
    img.src = url;
    return promise;
}


const handleRepeatPass = (txt)=>{
  const val = txt.target.value;
  if(val == password && val!='')
  {
    setPassMatch(true);
  } else {
    setPassMatch(false);
  }

   setRepeatPassword(val);
}

const handlePassword = (txt)=>{
    const val = txt.target.value;
    if(val == repeatPassword && val!='')
    {
      setPassMatch(true);
    } else {
      setPassMatch(false);
    }

    setPassword(val);

}

const handleCoverImageUpload = async(evt)=>{
  if(evt.target.files[0]!=undefined)
  {
    setCoverPictureErr(false);
    const file = evt.target.files[0];
    const renderedData = URL.createObjectURL(file);
    coverPhotoImage.current.src = renderedData;
    const imageDimensions = await imageSize(renderedData);
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = ev=>{

      if(imageDimensions.width<imageDimensions.height || imageDimensions.width<1000)
      {
        setCoverPictureErr(true);

      } else{
        setCoverImageUploaded(true);
        const obj = {
          coverPicture:ev.target.result.split("base64,")[1]
        }
        setCoverImageObj(obj);

      }
    }
  }
}

const handleUploadImage = (type)=>{

  if(type == "profile")
  {
   if(!_.isEmpty(profileImageObj))
   {
      handleUpdateReq(profileImageObj,setSuccessProfileImg);
   }

  } else if(type == "cover"){
    if(!_.isEmpty(coverImageObj))
    {
      handleUpdateReq(coverImageObj,setSuccessCoverImg);
    }
  }
}


const handleProfileImageUpload = async (evt)=>{

  if(evt.target.files[0]!=undefined)
  {
    setProfilePictureErr(false);
    const file = evt.target.files[0];
    const renderedData = URL.createObjectURL(file);
    profilePhotoImage.current.src = renderedData;
    const imageDimensions = await imageSize(renderedData);
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = ev=>{
      if(Math.abs(imageDimensions.width-imageDimensions.height)>=100)
      {
        setProfilePictureErr(true);

      } else{
        setProfileImageUploaded(true);
        const obj = {
          profilePicture:ev.target.result.split("base64,")[1]
        }
        setProfileImageObj(obj);
      }
    }
  }

}

const data = ()=>{

}

const handlePostData = (type)=>{
    let obj;
    if(type=="username")
    {
      obj = {
        username:username
      }
    handleUpdateReq(obj,setUsernameSuccess)
    } else if(type == "password")
    {
      obj = {
        password:password
      }
      handleUpdateReq(obj,setPasswordSuccess);
    } else if (type == "description")
    {
      obj = {
        description:description
      }
      handleUpdateReq(obj,setDescriptionSuccess);
    } else if (type == "from"){
        if(countryFrom!='' && regionFrom!='')
        {
            const countryFromString=regionFrom+','+countryFrom;
            obj = {
              from:countryFromString
            }
            handleUpdateReq(obj,setFromSuccess);
        }
    } else if (type == "livesIn"){

        if(countryLives!='' && regionLives!='')
        {
            const countryLivesString=regionLives+','+countryLives;
            obj = {
              livesIn:countryLivesString
            }
            handleUpdateReq(obj,setLivesSuccess);
        }
    } else if (type == "relationship")
    {
        obj = {
          relationship:parseInt(relationshipStatus)
        }
        handleUpdateReq(obj,setRelationshipStatusSuccess);
    } else if (type == "education")
    {
        obj = {
          education:education
        }
        handleUpdateReq(obj,setEducationSuccess);
    }
}

useEffect(()=>{
    if(ContextApp.user)
    {
      let fetchedUser = ContextApp.user;
      setUsername(fetchedUser.username);
      if(fetchedUser.description && fetchedUser.description!='')
        setDescription(fetchedUser.description);
      if(fetchedUser.from && fetchedUser.from!='')
      {
        let fromLocationFetched = fetchedUser.from.split(",");
        setRegionFrom(fromLocationFetched[0]);
        setCountryFrom(fromLocationFetched[1]);
      }
      if(fetchedUser.livesIn && fetchedUser.livesIn!='')
      {
        let livesInLocationFetched = fetchedUser.livesIn.split(",");
        setRegionLives (livesInLocationFetched[0]);
        setCountryLives (livesInLocationFetched[1]);
      }
      if(fetchedUser.relationship)
      {

         if(fetchedUser.relationship == 1 ||  fetchedUser.relationship == 2 || fetchedUser.relationship == 3  )
         {
            switch (fetchedUser.relationship) {
              case 0:
                setRelationShipStatus("0");
                break;
              case 1:
                setRelationShipStatus("1");
                break;
              case 2:
                setRelationShipStatus("2");
                break;
              case 3:
                setRelationShipStatus("3");
                break;
            }
         }
        else
         {
           setRelationShipStatus("0");
         }

      }
      if(fetchedUser.education && fetchedUser.education!='')
      {
        setEducation(fetchedUser.education);
      }
    }

},[ContextApp.user])


const handleRelationShipStatus = (evt)=>{
      setRelationShipStatus(evt.target.value.toString());
}

const handleEducation = (evt)=>{
  setEducation(evt.target.value);
}


 if(ContextApp.user)
 {
   return(
     <div className="settings-container">
        <div className="user-settings-header">
        <FontAwesomeIcon icon={faUserCog} className="settings-header-icon" />
          <h1 className="user-settings-header-title">User Settings</h1>
        </div>

        <div className="settings-card">
          <h3>Cover Image</h3>
           <img className="profile-background-image user-settings-bkg-img" ref={coverPhotoImage} src={`data:image/jpeg;base64,${ContextApp.user.coverPicture}`}  alt="bkg image"/>
            <p className="sub-note"><em>Note:</em> Image width must be greater than image height and width should be greater than 1000px</p>
            {coverPictureErr &&  <p className="img-load-error">Image DOES NOT RESPECT REQUIREMENTS ( SEE NOTE ABOVE)</p>}
            {successCoverImg && <p className="load-success">Image uploaded successfully!</p> }
           <div className="settings-action-container">

             <button  onClick={handleCoverPhotoInput} className="browse-img-btn">
               <FontAwesomeIcon icon={faImages}  className="browse-img-icon"/>
                 <span className="browse-btn-text"> Browse </span>
             </button>
             <input type="file"  accept=".jpg, .jpeg, .png" ref={hiddenCoverPhotoInput} onChange={handleCoverImageUpload} style={{"display":"none"}}/>
              {coverImageUploaded && <Button disabled={coverPictureErr} onClick={()=>{handleUploadImage("cover")}} variant="contained" className="btn" color="primary">
               Save!
             </Button>
           }
           </div>
        </div>

        <div className="settings-card">
          <h3>Profile Image</h3>
         <img className="person-avatar-profile user-settings-person-main-photo" ref={profilePhotoImage} src={`data:image/jpeg;base64,${ContextApp.user.profilePicture}`}/>
          <div className="img-sub-msg">
            <p className="sub-note" style={{marginBottom:"0px"}}><em>Note:</em> Image height and image width must be the same</p>
            {profilePictureErr &&  <p style={{marginBottom:"20px"}} className="img-load-error">Image DOES NOT RESPECT REQUIREMENTS ( SEE NOTE ABOVE)</p>}
            {successProfileImg && <p className="load-success">Image uploaded successfully!</p>}
          </div>
          <div className="settings-action-container user-main-image-btn">
           <button onClick={handleProfilePhotoInput} className="browse-img-btn">
             <FontAwesomeIcon icon={faImages} className="browse-img-icon"/>
              Browse
           </button>
           <input type="file" ref={hiddenProfilePhotoInput} style={{"display":"none"}} onChange={handleProfileImageUpload}/>
             {profileImageUploaded && <Button disabled={profilePictureErr} onClick={()=>{handleUploadImage("profile")}}  variant="contained" className="btn" color="primary">
               Save!
             </Button>}

           </div>
        </div>

        <div className="settings-card">
         <h3>Username</h3>
           <div className="change-name-input">

             <TextField
              id="outlined-multiline-static"
              label="Profile Name"
              multiline
              style={{width:"80%"}}
              rows={2}
              value={username}
              onChange = {handleSetUsername}
              ref = {usernameRef}
              />
              <Button variant="contained" disabled={usernameEmpty} onClick={()=>{handlePostData("username")}} className="btn" color="primary">
                Change
              </Button>
           </div>
          {usernameSuccess && <p className="load-success">Username Updated successfully!</p> }
        </div>


      <div className="settings-card">
       <h3>Password</h3>
         <div className="change-name-input">
                 <TextField
                id="standard-password-input"
                label="Password"
                style={{width:"80%"}}
                type="password"
                autoComplete="current-password"
                variant="standard"
                value={password}
                onChange={handlePassword}
              />
              <div style={{marginTop:"50px"}}>
                 <p className="repeat-pass-title" style={{marginTop:"10px",marginBottom:"20px"}}>Repeat password:</p>
                    <TextField
                   id="standard-password-input"
                   label="Password"
                   style={{width:"80%"}}
                   type="password"
                   autoComplete="current-password"
                   variant="standard"
                   value={repeatPassword}
                   onChange={handleRepeatPass}
                   />
              </div>

          <Button disabled={!passMatch} variant="contained" onClick={()=>{handlePostData("password")}} className="btn" color="primary" style={{marginTop:"20px"}}>
            Change
          </Button>
       </div>
         {passwordSuccess && <p className="load-success">Password updated successfully!</p> }
    </div>



        <div className="settings-card">
         <h3>Description</h3>
           <div className="change-name-input">

           <TextField
            id="outlined-multiline-static"
            label="Profile Description"
            multiline
            style={{width:"80%"}}
            rows={2}
            value={description}
            onChange={handleDescription}
            inputProps={
                {maxLength: 50}
              }
           />
              <Button variant="contained" onClick={()=>{handlePostData("description")}} className="btn" color="primary">
                Change
              </Button>
           </div>
             <p className="sub-note" style={{marginBottom:"0px"}}><em>Note:</em> There is a maximum of 50 characters when writing a description!</p>
           {descriptionSuccess && <p className="load-success">Description updated successfully!</p> }
        </div>

        <div className="settings-card">
         <h3>From</h3>
           <div className="change-name-input">
         <CountryDropdown
           value={countryFrom}
             onChange={(val) =>{selectCountryFrom(val)}} />
           <RegionDropdown
             country={countryFrom}
             value={regionFrom}
             onChange={(val) => {selectRegionFrom(val)}} />
              <Button variant="contained" className="btn btn-left-margin"  onClick = {()=>{handlePostData("from")}} color="primary">
                Change
              </Button>
           </div>
             {fromSuccess && <p className="load-success">Account was succesfully updated!</p> }
        </div>
        <div className="settings-card">
         <h3>Lives in</h3>
           <div className="change-name-input">
         <CountryDropdown
           value={countryLives}
             onChange={(val) =>selectCountryLives(val)} />
           <RegionDropdown
             country={countryLives}
             value={regionLives}
             onChange={(val) => selectRegionLives(val)} />
              <Button variant="contained" onClick = {()=>{handlePostData("livesIn")}} className="btn btn-left-margin"  color="primary">
                Change
              </Button>
           </div>
            {livesSuccess && <p className="load-success">Account was succesfully updated!</p> }
        </div>
        <div className="settings-card">
         <h3>Relationship Status</h3>
           <div className="change-name-input">
             <input type="text"/>
             <select className="settings-select-input" value={relationshipStatus} onChange={handleRelationShipStatus} name="relationship-status">
              <option value="0"></option>
               <option value="1">Married</option>
               <option value="2">Single</option>
               <option value="3">In a relationship</option>
             </select>
              <Button variant="contained" className="btn" onClick = {()=>{handlePostData("relationship")}} color="primary">
                Change
              </Button>
           </div>
           {relationshipStatusSuccess && <p className="load-success">Account was succesfully updated!</p> }
        </div>

        <div className="settings-card">
         <h3>Studied at</h3>
           <div className="change-name-input">

           <TextField
            id="outlined-multiline-static"
            label="Where did you studied?"
            multiline
            style={{width:"80%"}}
            rows={2}
            value={education}
            onChange = {handleEducation}
            />
              <Button variant="contained" onClick = {()=>{handlePostData("education")}} className="btn" color="primary">
                Change
              </Button>
           </div>
            {educationSuccess && <p className="load-success">Account was succesfully updated!</p> }
        </div>



     </div>
   )

 } else {
   return (<Loading/>);
 }


}

export default Settings;
