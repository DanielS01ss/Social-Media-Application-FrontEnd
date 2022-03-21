import jwt_decode from "jwt-decode";


function clearCookies( wildcardDomain=false, primaryDomain=true, path=null ){
  document.cookie.split(";").forEach(function(c) {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
}

const isTokenExpired = (token)=>{

    if(Date.now()>=jwt_decode(token).exp*1000)
    {
      return true;
    }
    return false;
}

const getStoredTokens = ()=>{

  let refreshToken='';
  let token='';
  if(!document.cookie)
  {
    return {
      refreshToken:refreshToken,
      token:token
    }
  }

   if(document.cookie.includes(";"))
   {
     
      if(document.cookie.split(";")[0].split("=")[0].trim()=='token')
          token = document.cookie.split(";")[0].split("=")[1];
      else if(document.cookie.split(";")[0].split("=")[0].trim()=='refreshToken')
          refreshToken = document.cookie.split(";")[0].split("=")[1];

      if(document.cookie.split(";")[1].split("=")[0].trim()=='token')
          token = document.cookie.split(";")[1].split("=")[1];
      else if(document.cookie.split(";")[1].split("=")[0].trim()=='refreshToken')
          refreshToken = document.cookie.split(";")[1].split("=")[1];

   } else {
     if(document.cookie.split("=")[0]=='refreshToken')
        refreshToken = document.cookie.split("=")[1];
     if(document.cookie.split("=")[0]=='token')
          token = document.cookie.split("=")[1];
   }

  return {
    refreshToken:refreshToken,
    token:token
  }

}


function setCookie(cName, cValue, expDays) {
        let date = new Date();
        date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
}


function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
    array[randomIndex], array[currentIndex]];
  }

  return array;
}


export {clearCookies,isTokenExpired,getStoredTokens,setCookie,shuffle}
