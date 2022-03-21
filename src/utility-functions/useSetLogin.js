import  {AppContext} from "../Context/AppContext";
import React, {useContext} from "react";

const useSetLoggedInTrue = ()=>{
  const myContext = useContext(AppContext);

  const setFunc = ()=>{
    myContext.isLoggedIn = true;
  }
  const data = true;
  return [setFunc];
}

export { useSetLoggedInTrue};
