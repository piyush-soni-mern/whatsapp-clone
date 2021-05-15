import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, InsertEmoticon, Mic, MoreVert, SearchOutlined } from '@material-ui/icons';
import React, { useState } from 'react';
import "./Chat.css";
import axios from './axios';

function Chat({messages}) {

    const [input, setInput] = useState("")

    const sendMessage = async (e) => {
        e.preventDefault();
        console.log('Message Submitted')
        await axios.post('/messages/new',{
            message: input,
            name: "Piyush Soni",
            timestamp: "Just Now",
            received: false,
        })
        setInput('');
    }

    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar />
                <div className="chat__headerInfo">
                    <h3>Room Name</h3>
                    <p>Last seen at...</p>
                </div>
                <div className="chat__headerRight">
                <IconButton >
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <label htmlFor="file">
                        <AttachFile />
                        </label>
                        {/* <input type="file" id="file"/> */}
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>

            <div className="chat__body">
                {messages.map((message) => (

                    <p className={`chat__message ${message.received && "chat__reciever"}`}>
                    <span className="chat__name">{message.name}</span>
                    {message.message}
                    <span className="chat__timestamp">
                        {new Date().toUTCString()}
                    </span>
                    </p>
                ))}
            </div>

            <div className="chat__footer">
                <InsertEmoticon />
                <form>
                    <input value={input} onChange={e => setInput(e.target.value)} type="text" placeholder="Type a message"/>
                    <button onClick={sendMessage} type="submit">Send a message</button>
                </form>
                <Mic />
            </div>
        </div>
    )
}

export default Chat;
