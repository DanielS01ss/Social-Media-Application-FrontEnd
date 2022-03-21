import React,{useEffect,useState} from "react";
import Loading from "./Loading";
import Person from "../images/person.jpg";
import "../Styles/Search.css";
import {SEARCH_USER} from '../Endpoints/API_ENDPOINTS';
import axios from 'axios';
import {getStoredTokens} from '../utility-functions/utility-functions.js';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Link} from 'react-router-dom';

const Search =(params)=>{

  const [dataIsLoading,setDataIsLoading] = useState(true);
  const [fetchedUsers,setFetchedUsers] = useState([]);

  const handleSearch = (toSearch)=>{
    setDataIsLoading(true);
    const {token} = getStoredTokens();
    setFetchedUsers([]);
    axios({
      method:'post',
      url:SEARCH_USER,
      headers:{
        'Authorization':`Bearer ${token}`
      },
      data:{
        searchData:toSearch
      }
    }).then(result=>{
      if(result.status == 200)
      {
        setFetchedUsers(result.data);
      }
      setDataIsLoading(false);
    }).catch(err=>{
      console.log(err);
    })
  }

  useEffect(()=>{
    const parameters = new URLSearchParams(params.data.search);
    const query = parameters.get('q');
    handleSearch(query);
  },[params.data])

  return(
    <div>
      {
        dataIsLoading?
        <div style={{paddingTop:'50px'}}>
          <Loading />
        </div>
        :

        <div style={{paddingTop:'90px'}}>

          {fetchedUsers.length >0?

            fetchedUsers.map((user,id)=>{
                return(
                  <div className='cards-container' style={{marginTop:'30px'}} key = {id}>
                    <Link style={{textDecoration:'none'}} to={`/user/profile/?id=${user._id}`}>
                      <div className='search-card-container'>
                       <div className='search-card-header'>
                           <img src={`data:image/jpeg;base64,${user.profilePicture}`} alt='person-icon' className="person-avatar-online person-search"/>
                           <p className='search-result-name'>{user.username}</p>
                        </div>
                      </div>
                    </Link>

                  </div>
                )
            })

            :
            <div className='no-found-label'>
                <p className="no-found-text">No user found!</p>
                <FontAwesomeIcon className="no-found-text" icon={faSearch} />
            </div>
          }
       </div>
      }
    </div>
  )

}

export default Search;
