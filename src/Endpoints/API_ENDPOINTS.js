const LOGIN_URL = 'https://peach-pen-deploy.herokuapp.com/api/auth/login';
const SIGNUP_URL = 'https://peach-pen-deploy.herokuapp.com/api/auth/register';
const DELETE_TOKEN_URL = "https://peach-pen-deploy.herokuapp.com/api/auth/logout";
const CHECK_TOKEN_URL = "https://peach-pen-deploy.herokuapp.com/api/auth/checkToken";
const GET_USER_URL = "https://peach-pen-deploy.herokuapp.com/api/auth/user";
const UPDATE_USER = (userId)=>{ return `https://peach-pen-deploy.herokuapp.com/api/user/${userId}/update`}
const REFRESH_TOKEN_URL = "https://peach-pen-deploy.herokuapp.com/api/auth/token";
const FETCH_USER_URL = (userId)=>`https://peach-pen-deploy.herokuapp.com/api/user/${userId}`
const POST = "https://peach-pen-deploy.herokuapp.com/api/posts/create";
const ADD_COMMENT = (id)=>`https://peach-pen-deploy.herokuapp.com/api/posts/${id}/comment`;
const LIKE_POST = (id)=>`https://peach-pen-deploy.herokuapp.com/api/posts/${id}/like`;
const FOLLOW_USER = (id)=>`https://peach-pen-deploy.herokuapp.com/api/user/${id}/follow`;
const UNFOLLOW_USER = (id)=>`https://peach-pen-deploy.herokuapp.com/api/user/${id}/unfollow`;
const FEED_POSTS = `https://peach-pen-deploy.herokuapp.com/api/posts/time/all`;
const SEARCH_USER = `https://peach-pen-deploy.herokuapp.com/api/user/search_user`;
const CREATE_CONVERSATION = `https://peach-pen-deploy.herokuapp.com/api/message/create_conversation`
const SOCKET_URL = "https://peach-pen-deploy.herokuapp.com:8080";
const GET_MESSAGES = "https://peach-pen-deploy.herokuapp.com/api/message/messages-conv";
const GET_POSTS = 'https://peach-pen-deploy.herokuapp.com/api/posts/getposts';

export {LOGIN_URL,SIGNUP_URL,DELETE_TOKEN_URL,CHECK_TOKEN_URL,GET_USER_URL,UPDATE_USER,REFRESH_TOKEN_URL,FETCH_USER_URL,POST,ADD_COMMENT,LIKE_POST,FOLLOW_USER,UNFOLLOW_USER,FEED_POSTS,SEARCH_USER,CREATE_CONVERSATION,SOCKET_URL,GET_MESSAGES,GET_POSTS};
