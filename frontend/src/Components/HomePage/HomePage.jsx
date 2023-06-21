import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import AxiosInstance from '../axios/AxiosInstance';
import '../Register/Register.css'

var stompClient =null;
const HomePage = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const [privateChats, setPrivateChats] = useState(new Map());     
    const [publicChats, setPublicChats] = useState([]);
    const [errorMsg, setErrorMessage] = useState('');
    const [users, setUsers] = useState([]); 
    const [currentUserId, setCurrentUserId] = useState('');
    const [tab,setTab] =useState("CHATROOM");
    const [userData, setUserData] = useState({
        username: '',
        receivername: '',
        connected: false,
        message: ''
      });
    const publicChatItems = useRef("");
    const privateChatsItems = useRef("");

    useEffect(() => {
        getUsers();
    }, [ ]);

    useEffect(() => {
        const lastItem = publicChatItems.current?.lastElementChild;
        if(lastItem){
            lastItem.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [publicChats]);

    useEffect(() => {
        const last = privateChatsItems.current?.lastElementChild;
        if(last){
            last.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [privateChats])


    const getUsers = async () => {
        var usersResponse = await AxiosInstance.get("/users").catch(() => {
            setErrorMessage("Chat members failed to load")
        });
        setUsers(usersResponse.data);
        setCurrentUserId(location.state.id);
        setUserData({...userData, 'username': location.state.id});
        connect();
    }

    const connect = () => {
        console.log("CONNECT CHECKING  IF USERID ");
        console.log( currentUserId);
        let Sock = new SockJS('http://localhost:8080/ws');
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    }

    const onConnected = () => {
        setUserData({...userData, "connected": true});
        stompClient.subscribe('/chatroom/public', onMessageReceived);
        stompClient.subscribe('/user/'+ location.state.id +'/private', onPrivateMessage);
        userJoin();
    }

    const userJoin=()=>{
          var chatMessage = {
            sender: location.state.id,
            status:"JOIN"
          };
          stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }

    const onMessageReceived = (payload) => {
        var payloadData = JSON.parse(payload.body);
        switch(payloadData.status){
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                break;
        }
    }
    
    const onPrivateMessage = (payload)=>{
        var payloadData = JSON.parse(payload.body);

        if(privateChats.get(payloadData.senderId)){
            privateChats.get(payloadData.senderId).push(payloadData);
            setPrivateChats(new Map(privateChats));
            console.log(privateChats);
        }
        else{
            privateChats.set(payloadData.senderId, []);
            setPrivateChats(new Map(privateChats));
        }
    }

    const onError = (err) => {
        console.log(err);
    }

    const handleMessage =(event)=>{
        const {value}=event.target;
        setUserData({...userData,"message": value});
    }

    const sendValue=()=>{
        console.log("TAB"+tab);
        if(userData.message === ''){
            return;
        }
        if (stompClient) {
            var chatMessage = {
                senderId: currentUserId,
                message: userData.message,
                status:"MESSAGE"
            };
            console.log(chatMessage);
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
            setUserData({...userData,"message": ""});
        }
    }

    const sendPrivateValue=()=>{
        if(userData.message === ''){
            return;
        }
        if (stompClient) {
            var chatMessage = {
                senderId: currentUserId,
                receiverId: tab,
                message: userData.message,
                status:"MESSAGE"
            };
            privateChats.get(tab).push(chatMessage);
            setPrivateChats(new Map(privateChats));
            stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
            setUserData({...userData,"message": ""});
        }
    }

    function logoutUser () {
        localStorage.removeItem("loggedUser");
        navigate('/login');
    }

    const setTabAndGetMessages = async (user) => {
        console.log("THIS ID SHOULD BE IN MAP");
        console.log(user.id);
        var receiverId = user.id;
        var senderId = currentUserId;

        var messages = await AxiosInstance
                        .get(`/rest/messages/${receiverId}/${senderId}`)
                        .catch(() => {
                            console.log("Error getting messages");
                        });
        privateChats.set(user.id, messages.data);
        setPrivateChats(new Map(privateChats));

        console.log("PRIVATECHATS IN SETTABANDGETMESSAGES");
        console.log(privateChats);
        setTab(user.id);
    }

    return (
    <div className="container">
        <div className="chat-box">
            <div className="member-list">
                <ul>
                    <li>{errorMsg}</li>
                    <li onClick={()=>{setTab("CHATROOM")}} className={`member ${tab==="CHATROOM" && "active"}`}>Chatroom</li>
                    {[...users.map((user) => (
                        <li onClick={() => setTabAndGetMessages(user)} className={`member ${tab===user.id && "active"}`} key={user.id}>{user.name + " " + user.lastname}</li>
                    ))]}
                </ul>
                <div className='logout'>
                    <button type='button' onClick={() => logoutUser()}>Logout</button>
                </div>
            </div>
            {tab==="CHATROOM" && <div className="chat-content">
                <ul ref={publicChatItems} className="chat-messages"
                        style={{
                            overflow: "auto",
                            background: "blue",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                        }}>
                    {publicChats.map((chat,index)=>(
                        <li className={`message ${chat.senderId === currentUserId && "self"}`} key={index}>
                            {chat.senderId !== currentUserId && <div className="avatar">{chat.message}</div>}
                            {chat.senderId === currentUserId && <div className="avatar self">{chat.message}</div>}
                        </li>
                    ))}
                </ul>
                <div className="send-message">
                    <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} /> 
                    <button type="button" className="send-button" onClick={sendValue}>send</button>
                </div>
            </div>}
            {tab!=="CHATROOM" && <div className="chat-content">
                <ul ref={privateChatsItems} className="chat-messages"
                        style={{
                            overflow: "auto",
                            background: "blue",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                        }}>
                    {[...privateChats.get(tab)].map((chat, index)=>(
                        <li className={`message ${chat.senderId === currentUserId && "self"}`} key={index}>
                            {chat.senderId !== currentUserId && <div className="avatar">{chat.message}</div>}
                            {chat.senderId === currentUserId && <div className="avatar self">{chat.message}</div>}
                        </li>
                    ))}
                </ul>
                <div className="send-message">
                    <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} /> 
                    <button type="button" className="send-button" onClick={sendPrivateValue}>send</button>
            </div>
            </div>}
        </div> 
    </div>
    )
}

export default HomePage