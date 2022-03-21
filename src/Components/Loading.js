import React from "react";
import GIF_LOADING from "../images/loading-data.gif";
import "../Styles/Loading.css";

const Loading = ()=>{

return(
  <div>
    <h1 className="loading-title">Loading ...</h1>
    <div className="loading-gif-container">
      <img src={GIF_LOADING} className="loading-gif"/>
   </div>

  </div>
)

}

export default Loading;
