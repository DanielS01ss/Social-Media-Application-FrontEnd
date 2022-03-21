import React from "react";
import "../Styles/Questions.css";
import Person from "../images/person.jpg";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPhotoVideo} from '@fortawesome/free-solid-svg-icons';
import {faTags} from '@fortawesome/free-solid-svg-icons';
import Button from '@material-ui/core/Button';
import {faLocationArrow} from '@fortawesome/free-solid-svg-icons';
import {faQuestionCircle} from '@fortawesome/free-solid-svg-icons';


const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));


const Questions = ()=>{

  const classes = useStyles();

  return(
    <div className="questions-container">
      <div className="post-card questions-main-container">
        <div className="form-container questions-form">
       <div className="person-avatar-container">
         <img src={Person} alt="person" className="person-avatar"/>
       </div>

        <form className={`${classes.root} text-input questions-form`} noValidate autoComplete="off">
          <TextField
           id="outlined-multiline-static"
           label="What questions do you have?"
           multiline
           style={{width:"80%"}}
           rows={2}
           defaultValue=""
           />
        <div className="media-type-container">

          <Button variant="contained" className="btn" color="primary">
            Ask!
          </Button>
        </div>
        </form>

       </div>
      </div>

      <div className="questions-cards-container">
        <div className="question-card-header">
          <img src={Person} alt="person" className="person-avatar question-card-person-image"/>
          <p className="question-person-name-header">Person name asked <FontAwesomeIcon icon={faQuestionCircle}/></p>
        </div>
        <div className="question-card-body">
          <p className="question-text">Caini zboara? Si pot sa ii dau catelului meu Wiskey? Se va transforma in pisica daca fac asta?</p>
        </div>
        <div className="questions-replies-sections">
          <p className="question-card-replies-title">Replies(1):</p>

            <div className="questions-reply-container">
              <TextField id="outlined-basic" label="Reply" variant="outlined" className="msg-input"/>
              <Button variant="contained" className="btn question-btn-post-reply" color="primary">
                Post Reply!
              </Button>
            </div>

          <div className="card-reply">
              <div className="card-reply-header">
                <img src={Person} alt="person" className="person-avatar question-card-reply-person-image"/>
                <p className="card-reply-username">Person name said:</p>
              </div>
              <p className="question-card-reply-text">Eu sincer nu cred ca merg lucrurile asa cum spui tu, se poate sa gasesti o solutie mai buna</p>
          </div>

          <div className="card-reply">
              <div className="card-reply-header">
                <img src={Person} alt="person" className="person-avatar question-card-reply-person-image"/>
                <p className="card-reply-username">Person name said:</p>
              </div>
              <p className="question-card-reply-text">Eu sincer nu cred ca merg lucrurile asa cum spui tu, se poate sa gasesti o solutie mai buna</p>
          </div>

       </div>
      </div>
    </div>
  )
}

export default Questions;
