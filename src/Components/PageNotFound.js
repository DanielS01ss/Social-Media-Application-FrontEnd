import React from "react";
import "../Styles/notFound.css";
import Image from '../images/not-found.jpg';

const PageNotFound = ()=>{

  return(
    <div  className="not-found">
      <img src={Image} style={{width:"90vw"}} />
    </div>
  )

}


export default PageNotFound;
