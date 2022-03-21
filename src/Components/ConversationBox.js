import React ,{useRef,useState,useContext,useEffect} from "react";
import "../Styles/Messages.css";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPaperPlane} from '@fortawesome/free-solid-svg-icons';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {faEdit}from '@fortawesome/free-solid-svg-icons';
import {AppContext} from "../Context/AppContext";
import Loading from "./Loading.js";

const ConversationBox = (props)=>{

const myAppContext = useContext(AppContext);
const messageField = useRef(null);
const [msgToSend,setMsgToSend] = useState("");
const [isEmpty,setIsEmpty] = useState(true);

const handleChange=(el)=>{
   if(el.target.value.length>0)
   {
     setIsEmpty(false);
   } else {
     setIsEmpty(true);
   }
   setMsgToSend(el.target.value);
}

const handleSend = ()=>{


  if(!isEmpty)
  {

    props.sendMsg.emit("send-message",msgToSend,props.convInd,myAppContext.user._id,props.messageRecipient);
    setMsgToSend("");
    setIsEmpty(true);
    const msgData = {
      sender:myAppContext.user._id,
      content:msgToSend,
      conversationId:props.convInd,
    };
    const oldMessages = [...props.messages];
    oldMessages.push(msgData);
    props.divRef.current.scrollIntoView({ behavior: 'smooth' });
    props.setMessages(oldMessages);
  }
}

useEffect(()=>{

},[]);


if(!props.isLoading)
{
  return(
    <>
    <div className="msg-texts-container">

      {
        props.messages.length>0 && props.messages.map((msg)=>{
          if(msg.sender == myAppContext.user._id)
          {
            return(
            <div className="box3 sb13">
              <p className="msg-text">{msg.content}</p>
            </div>);
          } else {
            return(
              <div className="sb14 box3 answer">
                <p className="msg-text">{msg.content}</p>
              </div>
            )
          }
      })
    }

      </div>
      <div ref={props.divRef}>
      </div>
      <form className="msg-form" onSubmit={(el)=>{el.preventDefault()}} noValidate autoComplete="off">
          <TextField ref={messageField} value={msgToSend} id="outlined-basic" onChange={handleChange} label="Send a message" variant="outlined" className="msg-input"/>
          <FontAwesomeIcon onClick={handleSend} icon={faPaperPlane} className={isEmpty?"msg-send-btn disabled-send":"msg-send-btn"}/>
      </form>

    </>

    );
} else {

  return <Loading/>
}

}


export default ConversationBox;
