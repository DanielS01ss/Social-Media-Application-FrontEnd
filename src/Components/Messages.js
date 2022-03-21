import React ,{useEffect,useState,useContext,useRef} from "react"
import "../Styles/Messages.css";
import Person from "../images/person.jpg";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPaperPlane} from '@fortawesome/free-solid-svg-icons';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {faEdit}from '@fortawesome/free-solid-svg-icons';
import {AppContext} from "../Context/AppContext";
import ConversationBox from "./ConversationBox.js";
import {io} from "socket.io-client";
import {SOCKET_URL,GET_MESSAGES} from "../Endpoints/API_ENDPOINTS";
import {getStoredTokens} from "../utility-functions/utility-functions.js";
import useSound from 'use-sound';
import notificationSound from "../media/audio/notification.mp3";
import axios from 'axios';

const Messages = ()=>{

  const divRef = useRef(null);
  const [socket,setSocket]=useState(null);
  const [mobileView,setMobileView] = useState(false);
  const [toggled,setToggled] = useState(false);
  const [isLoading,setIsLoading] = useState(false);
  const [currentConvIndex,setCurrentConvIndex] = useState(0);
  const [messages,setMessages] = useState([]);
  const [currentConvBtn,setCurrentConvBtn] = useState(null);
  const [cvIndex,setCvIndex] = useState(0);
  const [firstClicked,setFirstClicked] = useState(false);
  const [messageRecipient,setMessageRecipient] = useState(null);
  const [notificationBeep] = useSound(notificationSound,{volume:0.25});


  const myFunction = ()=>{
    if(window.innerWidth<1000)
    {
          setMobileView(true);
          setToggled(false);
    } else{
      setMobileView(false);
      setToggled(true);
    }
  }

  const AppCtx = useContext(AppContext);

  const handlePersonsListToggle = ()=>{
    setToggled(!toggled);
  }
  useEffect(()=>{

    const {token} = getStoredTokens();
    const mySocket = io(SOCKET_URL,{
       "query":token
     });

     AppCtx.setGlobalSocket(mySocket);

    mySocket.on('connect',()=>{

     })
     let emitted = 0;
     mySocket.on('error',()=>{
       if(!emitted)
       {
         alert("There was an error connecting to the server! Logout and Login back!!");
         emitted = 1;
       }
     })


    setSocket(mySocket);

    mySocket.on('sended-message',(mObj)=>{

      notificationBeep();
      if(mObj.conversationId==AppCtx.user.conversations[currentConvIndex])
      {
        setMessages(oldArr=>[...oldArr,mObj]);
        divRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    })



    myFunction();
    window.addEventListener("resize",myFunction);
    return ()=>{
      window.removeEventListener("resize",myFunction);
    }
  },[]);

  const handleConversationChange = (evt,cvInd,recipient)=>{
    setFirstClicked(true);
    setIsLoading(true);
    setMessageRecipient(recipient.id);
     // evt.currentTarget;
    if(currentConvBtn!=null)
    {
      currentConvBtn.classList.remove("conversation-selected");
    }

    evt.currentTarget.classList.add("conversation-selected");
    setCurrentConvBtn(evt.currentTarget);
    setCurrentConvIndex(cvInd);
    setCvIndex(AppCtx.user.conversations[currentConvIndex]);
    ///aici tragi messajele
    ///si setezi si asta isLoading la true

    const {token} = getStoredTokens();
    axios.get(GET_MESSAGES,{
      headers:{
       Authorization:`Bearer ${token}`,
       cvId: AppCtx.user.conversations[currentConvIndex]
      }
    }).then(resp=>{
      setMessages(...[resp.data]);
      setIsLoading(false);
    }).catch(err=>{
      setIsLoading(false);
      console.log(err);
    })

  }

  return(
    <div className="msg-container">

    {toggled &&  <div className={mobileView? "msg-left-nav-mobile":"msg-left-nav"}>
        <div className="msg-left-close">
          <FontAwesomeIcon icon={faTimes} className="msg-left-close-btn" onClick={handlePersonsListToggle}/>
        </div>
      <p className="msg-header">Messages</p>

        {AppCtx.user.conversationsParteners.map((usr,index)=>{

          return(
             <button onClick={(evt)=>{handleConversationChange(evt,index,usr)}}  className="toggle-conv-container-btn">
             <span className="not-display">{index}</span>
            <div className="msg-person-container">
               <img src={`data:image/jpeg;base64,${usr.profilePicture}`}  className="msg-person-image"/>
               <p className="msg-person-name">{usr.username}</p>
            </div>
            </button>
          )
        })}
      </div> }

      <div className="msg-right-nav">

    {!toggled && mobileView && <button onClick={handlePersonsListToggle} className={mobileView?"toggle-pers-list":"not-displayed"}> <FontAwesomeIcon icon={faArrowLeft} style={{marginRight:"10"}}/>See persons <FontAwesomeIcon icon={faUser}/> </button>}
  {firstClicked && <ConversationBox divRef={divRef} setMessages={setMessages} convInd={cvIndex} personId={AppCtx.user._id} messages={messages} setIsLoading={setIsLoading} isLoading={isLoading} sendMsg={socket} messageRecipient={messageRecipient}/>}

      </div>
    </div>
  )

}

export default Messages;
