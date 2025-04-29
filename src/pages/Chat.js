import React, { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import { useUser } from "../UserContext";
import { Link } from "react-router-dom";
import { Send, Search, User, MessageSquare, ArrowLeft } from "lucide-react";
import { useCallback } from "react";

const Chat = () => {
    const { user } = useUser();
    const userId = user?.id;

    const [client, setClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [recentUsers, setRecentUsers] = useState([]);
    const [receiverId, setReceiverId] = useState("");
    const [receiverName, setReceiverName] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedContent, setEditedContent] = useState("");

    var prevuserId = 0;
    var prev_users = [];
    const [triggerEffect, setTriggerEffect] = useState(0);

    useEffect(() => {
        if (!userId) return;
        axios.get(`https://alumni-back-yabh.onrender.com/api/chat/recent/${userId}`, { withCredentials: true })
            .then(response => setRecentUsers(response.data))
            .catch(error => console.error("Error fetching recent contacts:", error));
    }, [userId]);
   

    // const updateMessage = (id, newContent) => {
    //     axios.put(`https://alumni-back-yabh.onrender.com/api/chat/edit/${id}`, newContent, {
    //         headers: { "Content-Type": "text/plain" },
    //         withCredentials: true
    //     })
    //     .then(response => {
    //         console.log("Message updated:", response.data);
            
    //         // Send update event via WebSocket
    //         if (client && client.connected) {
    //             client.publish({
    //                 destination: `/app/messageUpdate`,
    //                 body: JSON.stringify(response.data)
    //             });
    //         }
    //     })
    //     .catch(error => console.error("Error updating message:", error));
    // };

    const updateMessage = (id, newContent) => {
        axios.put(`https://alumni-back-yabh.onrender.com/api/chat/edit/${id}`, newContent, {
            headers: { "Content-Type": "text/plain" },
            withCredentials: true
        })
        .then(response => {
            console.log("Message updated:", response.data);
            
            // Send update event via WebSocket
            if (client && client.connected) {
                client.publish({
                    destination: `/app/messageUpdate`,  // ✅ Changed to the correct endpoint
                    body: JSON.stringify(response.data)
                });
            }
        })
        .catch(error => console.error("Error updating message:", error));
    };
    
    
   
    const deleteMessage = (id) => {
            // Send delete event via WebSocket
            if (client && client.connected) {
                client.publish({
                    destination: `/app/messageDelete`,
                    body: JSON.stringify({ id: id }) // ✅ Ensures JSON format
                });
            setEditingIndex(null);
            }
       
    };
    
    

    
    // ✅ Delete Message
    // const deleteMessage = (id) => {
    //     axios.delete(`https://alumni-back-yabh.onrender.com/api/chat/delete/${id}`)
    //     .then(() => {
    //         console.log("Message deleted");
    //         setEditingIndex(null);  // Close the menu after deleting the message
    //     })
    //         .catch(error => console.error("Error deleting message:", error));
    // };

    useEffect(() => {
        console.log("Bye");
        if (!userId || !receiverId) return;
        axios.get(`https://alumni-back-yabh.onrender.com/api/chat/history/${userId}/${receiverId}`)
            .then(response => setMessages(response.data))
            .catch(error => console.error("Error fetching messages:", error));
        scrollToBottom();   
    }, [userId, receiverId
    ]);


    useEffect(() => {
        if (!userId) return;
    
        if (prevuserId == userId)
            return;
        prevuserId = userId;
    
        const socket = new SockJS("https://alumni-back-yabh.onrender.com/chat");
        const stompClient = new Client({
            webSocketFactory: () => socket,
            connectHeaders: { userId: userId.toString() },
            debug: (str) => console.log(str),
    
            onConnect: () => {
                console.log("Connected to WebSocket!");
    
                // ✅ Listen for new messages
                stompClient.subscribe(`/user/${userId}/messages`, (message) => {
                    try {
                        const parsedMessage = JSON.parse(message.body);
                        console.log("New message received:", parsedMessage);
                        setMessages((prev) => {
                            // Check if message with the same ID already exists
                            if (prev.some(msg => msg.id === parsedMessage.id)) {
                                return prev; // Do not add duplicate messages
                            }
                            return [...prev, parsedMessage];
                        });


                        setRecentUsers((prevUsers) => {
                            console.log("entered recent users")
                            const exists = prevUsers.some(user => user.id == parsedMessage.senderId);
                            console.log(exists)
                            if (!exists) {
                                console.log("User not in recent chats, fetching details...");

                                axios.get(`https://alumni-back-yabh.onrender.com/api/users/${parsedMessage.senderId}`)
                                    .then(response => {
                                        const userDetails = response.data;
                                        if (prev_users != recentUsers) {
                                            setRecentUsers(prev => [userDetails, ...prev]);
                                            prev_users = recentUsers;
                                        }
                                    })
                                    .catch(error => console.error("Error fetching user details:", error));
                            }
                            else {
                                axios.get(`https://alumni-back-yabh.onrender.com/api/chat/recent/${userId}`, { withCredentials: true })
                                    .then(response => setRecentUsers(response.data))
                                    .catch(error => console.error("Error fetching recent contacts:", error));
                            }
                            return prevUsers;
                        });
                        // setMessages((prev) => [...prev, parsedMessage]);
                    } catch (error) {
                        console.error("Error parsing WebSocket message:", error);
                    }
                });
    
                // ✅ Listen for message updates
                stompClient.subscribe(`/user/${userId}/messageUpdate`, (message) => {
                    try {
                        const updatedMessage = JSON.parse(message.body);
                        console.log("Message updated:", updatedMessage);
                        
                        setMessages((prev) => prev.map(msg =>
                            msg.id === updatedMessage.id ? updatedMessage : msg
                        ));
                    } catch (error) {
                        console.error("Error parsing message update:", error);
                    }
                });
    
                // ✅ Listen for message deletions
                stompClient.subscribe(`/user/${userId}/messageDelete`, (delid) => {
                    try {
                        const deletedid = JSON.parse(delid.body);
                        console.log("Message deleted:", deletedid);
                    
                        setMessages((prev) => prev.filter(msg => msg.id !== deletedid));
                        console.log(messages);
                    } catch (error) {
                        console.error("Error parsing delete message:", error);
                    }
                });
    
                setClient(stompClient);
            },
    
            onStompError: (frame) => console.error("STOMP Error:", frame),
            onWebSocketClose: () => console.warn("WebSocket disconnected. Attempting reconnect..."),
        });
    
        stompClient.activate();
    
        return () => {
            if (stompClient.connected) stompClient.deactivate();
        };
    }, [userId]);
    

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };


    const handleEdit = (index, content) => {
        setEditingIndex(index);
        setEditedContent(content);
    };

    const handleSaveEdit = (id) => {
        updateMessage(id, editedContent);
        console.log(editedContent);
        setEditingIndex(null);
    };



    const menuRefs = useRef([]);
    const handleClickOutside = (event) => {
        if (
            menuRefs.current[editingIndex] && 
            !menuRefs.current[editingIndex].contains(event.target) && 
            event.target.tagName !== "INPUT"
        ) {
            setEditingIndex(null);
        }
    };
    
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [editingIndex]);

    // useEffect(() => {
    //     if (searchQuery.length === 0) {
    //         setSearchResults([]);
    //         return;
    //     }
    //     axios.get(`https://alumni-back-yabh.onrender.com/api/searchchat?query=${searchQuery}`)
    //         .then(response => setSearchResults(response.data))
    //         .catch(error => console.error("Error fetching users:", error));
    // }, [searchQuery]);

    useEffect(() => {
        if (searchQuery.length === 0) {
            setSearchResults([]);
            return;
        }
        axios.get(`https://alumni-back-yabh.onrender.com/api/searchchat?query=${searchQuery}`)
            .then(response => {
                // Filter out users with role "admin"
                const filteredResults = response.data.filter(user => user.role !== "admin");
                setSearchResults(filteredResults);
            })
            .catch(error => console.error("Error fetching users:", error));
    }, [searchQuery]);
    


    useEffect(()=>{
     axios.get(`https://alumni-back-yabh.onrender.com/api/chat/recent/${userId}`,{withCredentials:true}).then(response=>setRecentUsers(response.data)).catch(error=>console.error("Error fetching recent users"));
    },[messages]);

    const handleUserSelect = (user) => {
        setReceiverId(user.id);
        setReceiverName(user.name);
        setSearchQuery("");
        setSearchResults([]);
        scrollToBottom();
    };

    const sendMessage = () => {
        if (!client || !client.connected || !receiverId || !input) return;
        const msg = { senderId: userId, receiverId, content: input };
        client.publish({ destination: "/app/sendMessage", body: JSON.stringify(msg) });
        // setMessages((prev) => [...prev, msg]);
        setInput("");
        scrollToBottom();
    }
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight; // Scroll within the chat box
        }
    };

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            console.log("entered")
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                console.log("eneter")
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    useEffect(() => {
        scrollToBottom();
    },[messages])
    return (
        <div className="flex h-screen bg-chat-light dark:bg-chat-dark">
            {/* Sidebar */}

            {/* <div className="space-y-2 animate-slide-up bg-blue-50 p-3 rounded-lg shadow-sm border-l-4 border-blue-500"></div> */}
            <div className="w-64 bg-white shadow-soft h-[600px] overflow-hidden flex flex-col animate-fade-in">
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-4">
                        <Link to="/" className="flex items-center text-blue-500 hover:text-blue-600 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            <span className="text-sm font-medium">Back</span>
                        </Link>
                        <Link to="/group-chat" className="flex items-center text-blue-500 hover:text-blue-600 transition-colors">
                            <span className="text-sm font-medium">Group Chat</span>
                            <MessageSquare className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsDropdownOpen(true)}
                            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Search Results */}
                {isDropdownOpen && searchResults.length > 0 && (
                    <div ref={dropdownRef} className="absolute top-[180px] left-4 bg-white border rounded-lg shadow-glass w-56 z-10 overflow-hidden animate-slide-up">
                        {searchResults.map(user => (
                            <div
                                key={user.id}
                                onClick={() => {handleUserSelect(user); scrollToBottom();setIsDropdownOpen(false);}}
                                className="p-3 hover:bg-gray-100 cursor-pointer transition-colors flex items-center gap-2 border-b border-gray-100 last:border-0"
                            >
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                    <User className="w-4 h-4" />
                                </div>
                                <span>{user.name}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Recent Chats */}
                <div className="p-3">
                    <h4 className="text-sm font-medium text-gray-500 mb-2 px-2">Recent Conversations</h4>
                </div>
                {/* </div><div className="space-y-2 animate-slide-up bg-blue-50 p-3 rounded-lg shadow-sm border-l-4 border-blue-500"> */}
                <div className="flex-1 ml-3 px-3 overflow-y-auto animate-slide-up bg-blue-50 rounded-lg shadow-sm border-l-4 border-blue-500 p-5">
                    <div className="space-y-2 pr-2">
                        {recentUsers.map((user, index) => (
                            <div
                                key={user.id}
                                onClick={() => {handleUserSelect(user); scrollToBottom();}}
                                className={`p-3 rounded-lg cursor-pointer transition-all hover-scale ${receiverId === user.id
                                    ? "bg-blue-500 text-white shadow-md"
                                    : "bg-gray-50 text-gray-800 hover:bg-gray-100"
                                    }`}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${receiverId === user.id ? "bg-blue-600" : "bg-gray-200"
                                        }`}>
                                        <User className={`w-5 h-5 ${receiverId === user.id ? "text-white" : "text-gray-500"}`} />
                                    </div>
                                    <div>
                                        <div className="font-medium">{user.name}</div>
                                        <div className={`text-xs ${receiverId === user.id ? "text-blue-100" : "text-gray-500"}`}>
                                            Tap to chat
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chat Section */}
            <div className="flex-1 flex flex-col animate-fade-in">
                {receiverId ? (
                    <div className="flex flex-col h-[650px]">
                        {/* Chat Header */}
                        <div className="bg-gray-100 shadow-sm p-4 flex items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">{receiverName}</h3>

                            </div>
                        </div>
                        {/* <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                            <div className="space-y-3">
                                {messages.map((msg, index) => (
                                    (msg.senderId === receiverId || msg.receiverId === receiverId) ? (
                                        <div key={index} className={`flex items-center ${msg.senderId === userId ? "justify-end" : "justify-start"}`}>
                                            <div className={`chat-bubble flex items-center gap-2 px-4 py-2 rounded-lg text-black ${msg.senderId === userId ? "bg-blue-500" : "bg-gray-300 text-black"}`}>
                                                <div>{msg.content}</div>
                                                
                                            </div>
                                        </div>
                                    ) : null
                                ))}
                            </div>
                        </div> */}
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50" ref={chatContainerRef}>
                            <div className="space-y-3">
                                {messages.map((msg, index) => (
                                    (msg.senderId === receiverId || msg.receiverId === receiverId) ? (
                                        <div key={msg.id} className={`flex items-center ${msg.senderId === userId ? "justify-end" : "justify-start"}` }  ref={index === messages.length - 1 ? messagesEndRef : null} >
                                            <div className={`relative chat-bubble flex items-center gap-2 px-4 py-2 rounded-lg text-black ${msg.senderId === userId ? "bg-blue-500" : "bg-gray-300 text-black"}`}>
                                                {editingIndex === index ? (
                                                    <input
                                                        type="text"
                                                        value={editedContent}
                                                        onChange={(e) => setEditedContent(e.target.value)}
                                                        className="bg-white px-2 py-1 rounded border"
                                                    />
                                                ) : (
                                                    <div>{msg.content}</div>
                                                )}

                                                {msg.senderId === userId && (
                                                    <div className="relative" ref={(el) => (menuRefs.current[index] = el)}>
                                                        <button className="ml-2 text-white" onClick={() => handleEdit(index, msg.content)}>⋮</button>
                                                        {editingIndex === index && (
                                                            <div className="absolute right-0 mt-2 bg-white border shadow-lg rounded-lg p-2 z-50">
                                                                <button onClick={() => handleSaveEdit(msg.id)} className="block px-2 py-1 text-sm text-blue-600 hover:bg-gray-200 w-full">Save</button>
                                                                <button onClick={() => deleteMessage(msg.id)} className="block px-2 py-1 text-sm text-red-600 hover:bg-gray-200 w-full">Delete</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
    
                                            </div>
                                        </div>
                                    ) : null
                                ))}
                                 <div ref={messagesEndRef} />
                            </div>
                        </div >



                        {/* Input Area */}
                        <div className="p-4 bg-white border-t flex items-center space-x-2">
                            <input
                                className="flex-1 p-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Type a message..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                            />
                            <button
                                onClick={sendMessage}
                                className={`p-3 rounded-full transition-colors shadow-sm flex items-center justify-center ${input.trim()
                                    ? "bg-green-400 text-green-900 text-white"
                                    : "bg-blue-300 hover:bg-blue-600 cursor-not-allowed"
                                    }`}
                                disabled={!input.trim()}
                            >
                                <Send className="w-5 h-5 " />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-center p-4">
                        <div className="max-w-md animate-slide-up">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="h-8 w-8 text-blue-500" />
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Start a Conversation</h3>
                            <p className="text-gray-600">Select a user from the sidebar to start chatting.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;