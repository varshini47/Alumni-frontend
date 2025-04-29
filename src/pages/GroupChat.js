import React, { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import { useUser } from "../UserContext";
import { Link } from "react-router-dom";
import { Send, Plus, Users, MessageSquare, ArrowLeft, LogOut,Search,X } from "lucide-react";
import { toast } from "react-toastify";

const CreateGroupModal = ({ isOpen, onClose, onCreate }) => {
    const [groupName, setGroupName] = useState("");

    const handleCreate = () => {
        if (!groupName.trim()) return;
        onCreate(groupName);
        setGroupName(""); // Reset input
        onClose(); // Close modal
    };

    if (!isOpen) return null; // Hide modal if not open

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h2 className="text-lg font-semibold text-gray-700 mb-3">Create New Group</h2>
                <input
                    type="text"
                    placeholder="Enter group name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                />
                <div className="flex justify-end mt-4 space-x-2">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleCreate} 
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

const GroupChat = () => {
    const { user } = useUser();
    const userId = user?.id;
    const [userNames, setUserNames] = useState({});
    const prevUserIdRef = useRef(null);
    const prevGroupIdRef = useRef(null);
    const [client, setClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [groupMessages, setGroupMessages] = useState([]);
    const [input, setInput] = useState("");
    const [groupInput, setGroupInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchType, setSearchType] = useState("users"); // "users" or "groups"
    const [sortedGroups, setSortedGroups] = useState([]);
    const [recentUsers, setRecentUsers] = useState([]);
    const [receiverId, setReceiverId] = useState("");
    const [receiverName, setReceiverName] = useState("");
    const [groupId, setGroupId] = useState("");
    const stompClientRef = useRef(null);
    const subscriptionRef = useRef(null);
    // const [groups, setGroups] = useState([]);
    const [groups, setGroups] = useState({ joined: [], notJoined: [] });
    const [filteredGroups, setFilteredGroups] = useState(groups.notJoined);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groupMembers, setGroupMembers] = useState([]);
    const [joinStatus, setJoinStatus] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedContent, setEditedContent] = useState("");
    var x = 1;
    const [isSearching, setIsSearching] = useState(false);
    const menuRefs = useRef([]);

    const [isModalOpen, setIsModalOpen] = useState(false);

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
    const handleSearch = (query) => {
        setSearchQuery(query);

        if (query.trim() === "") {
            setFilteredGroups(groups.notJoined); // Reset to original list
        } else {
            setFilteredGroups(groups.notJoined.filter(group =>
                group.name.toLowerCase().includes(query.toLowerCase())
            ));
        }
    };
    const handleCloseSearch = () => {
        setIsSearching(false);
        setSearchQuery("");
        setFilteredGroups(groups.notJoined); // Restore original groups
    };

    const exitGroup = (groupId) => {
        toast.info(
            <div>
                <p>Are you sure you want to exit this group?</p>
                <div className="mt-2 flex justify-center space-x-3">
                    <button 
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        onClick={() => {
                            toast.dismiss();
                            performExitGroup(groupId);
                        }}
                    >
                        Yes, Exit
                    </button>
                    <button 
                        className="bg-gray-500 text-white px-3 py-1 rounded"
                        onClick={() => toast.dismiss()}
                    >
                        Cancel
                    </button>
                </div>
            </div>,
            {
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                closeButton: false
            }
        );
    };

    const performExitGroup = (groupId) => {
        axios.post("http://localhost:8080/api/chat/groups/exit", {groupId, userId}, { withCredentials: true })
            .then(() => {
                toast.success("You have successfully exited the group");
                setGroupMembers((prev) => prev.filter((member) => member !== userId)); // Update UI

                setGroups(prev => {
                    const joinedGroup = prev.joined.find(group => group.id === groupId);
                    if (!joinedGroup) return prev; // Safety check

                    return {
                        notJoined: [...prev.notJoined, joinedGroup], // Move to joined
                        joined: prev.joined.filter(group => group.id !== groupId) // Remove from notJoined
                    };
                });
                setFilteredGroups(groups.notJoined);
            })
            .catch(error => {
                toast.error("Failed to exit group. Please try again.");
            });
    };

    useEffect(()=>{
        setFilteredGroups(groups.notJoined);
    },[groups]);
    

    // const updateMessage = (id, newContent) => {
    //     console.log(newContent);
    //     axios.put(`http://localhost:8080/api/chat/group/edit/${id}`, newContent, {
    //         headers: { "Content-Type": "text/plain" }
    //     }, { withCredentials: true })
    //         .then((response) => {
    //             console.log("Message updated:", response.data);
    //             setEditingIndex(null);  // Close the menu after deleting the message
    //             // if (selectedGroup != null)
    //             //     handleGroupSelect(selectedGroup);
    //         })
    //         .catch(error => console.error("Error updating message:", error));
    // };

    // // ✅ Delete Message
    // const deleteMessage = (id) => {
    //     axios.delete(`http://localhost:8080/api/chat/group/delete/${id}`)
    //         .then(() => {
    //             console.log("Message deleted");
    //             setEditingIndex(null);  // Close the menu after deleting the message
    //             if(x==1) x=0;
    //             else x=1;
    //             // if (selectedGroup != null)
    //             //     handleGroupSelect(selectedGroup);
    //         })
    //         .catch(error => console.error("Error deleting message:", error));
    // };

    const updateMessage = (id, newContent) => {
        axios.put(`http://localhost:8080/api/chat/group/edit/${id}`, newContent, {
            headers: { "Content-Type": "text/plain" },
            withCredentials: true
        })
            .then(response => {
                console.log("Group message updated:", response.data);

                // ✅ Send update event via WebSocket
                if (client && client.connected) {
                    client.publish({
                        destination: `/app/groupMessageUpdate`,  // ✅ WebSocket endpoint for updates
                        body: JSON.stringify(response.data)
                    });
                }
            })
            .catch(error => {
                toast.error("Failed to update message");
            });
    };


    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight; // Scroll within the chat box
        }
    };

    const deleteMessage = (id) => {
        // ✅ Send delete event via WebSocket
        if (client && client.connected) {
            client.publish({
                destination: `/app/groupMessageDelete`,
                body: JSON.stringify({ id: id })  // ✅ Send message ID in JSON format
            });
            setEditingIndex(null);
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



    const fetchSenderName = async (senderId) => {
        if (userNames[senderId]) return; // Skip fetching if already stored

        try {
            const response = await fetch(`http://localhost:8080/api/users/${senderId}`);
            const data = await response.json();
            console.log(data);

            setUserNames((prev) => {
                const updatedNames = { ...prev, [senderId]: data.name };
                console.log(updatedNames);
                return updatedNames;
            });
        } catch (error) {
            toast.error("Failed to fetch user information");
        }
    };



    // Fetch names when messages change
    useEffect(() => {
        groupMessages.forEach((msg) => {
            fetchSenderName(msg.senderId);
        });
    }, [groupMessages]);


    // useEffect(() => {
    //     if (!userId) return;

    //     axios.get("http://localhost:8080/api/chat/groups", { withCredentials: true })
    //         .then(response => {
    //             const allGroups = response.data;
    //             console.log(response.data);
    //             // Segregate groups
    //             const joinedGroups = [];
    //             const notJoinedGroups = [];

    //             allGroups.forEach(group => {
    //                 console.log(userId);
    //                 const isMember = group.members.some(member => member.id == userId);
    //                 console.log(isMember);
    //                 if (isMember) {
    //                     joinedGroups.push(group);
    //                 } else {
    //                     notJoinedGroups.push(group);
    //                 }
    //             });
    //             console.log(joinedGroups);
    //             console.log(notJoinedGroups);

    //             setGroups({ joined: joinedGroups, notJoined: notJoinedGroups });
    //             console.log(groups);
    //         })
    //         .catch(error => console.error("Error fetching groups:", error));
    // }, [userId, groupMessages]);

    useEffect(() => {
        if (!userId) return;
    
        axios.get("http://localhost:8080/api/chat/groups", { withCredentials: true })
            .then(response => {
                const allGroups = response.data;
                console.log(response.data);
                
                // Segregate groups
                const joinedGroups = [];
                const notJoinedGroups = [];
    
                allGroups.forEach(group => {
                    console.log(userId);
                    const isMember = group.members.some(member => member.id == userId);
                    console.log(isMember);
                    if (isMember) {
                        joinedGroups.push(group);
                    } else {
                        notJoinedGroups.push(group);
                    }
                });
    
                // Sort notJoinedGroups alphabetically by group name
                notJoinedGroups.sort((a, b) => a.name.localeCompare(b.name));
                setFilteredGroups(notJoinedGroups);
                console.log(joinedGroups);
                console.log(notJoinedGroups);
    
                setGroups({ joined: joinedGroups, notJoined: notJoinedGroups });
                console.log(groups);
            })
            .catch(error => console.error("Error fetching groups:", error));
    }, [userId, groupMessages]);
    
    useEffect(() => {
        if (!userId) return;

        console.log(prevUserIdRef.current + " + " + userId);
        console.log(prevGroupIdRef.current + " + " + groupId);

        console.log(groupId)
        const socket = new SockJS("http://localhost:8080/chat");


        const stompClient = new Client({
            webSocketFactory: () => socket,
            connectHeaders: { groupId: groupId.toString() },
            debug: (str) => console.log(str),
            onConnect: () => {
                console.log("Connected to WebSocket!");


                stompClient.subscribe(`/user/${groupId}/messages`, (message) => {
                    try {
                        console.log("Entered subscribe");
                        console.log(message);
                        const parsedMessage = JSON.parse(message.body);
                        console.log(parsedMessage);

                        setGroupMessages((prev) => {
                            // Check if message with the same ID already exists
                            if (prev.some(msg => msg.id === parsedMessage.id)) {
                                return prev; // Do not add duplicate messages
                            }
                            return [...prev, parsedMessage];
                        });

                    } catch (error) {
                        console.error("Error parsing WebSocket message:", error);
                    }
                });

                stompClient.subscribe(`/user/${groupId}/groupMessageUpdate`, (message) => {
                    try {
                        console.log("Received message update");
                        const parsedMessage = JSON.parse(message.body);
                        console.log(parsedMessage);

                        setGroupMessages((prev) =>
                            prev.map((msg) =>
                                msg.id === parsedMessage.id ? { ...msg, content: parsedMessage.content } : msg
                            )
                        );
                    } catch (error) {
                        console.error("Error parsing message update:", error);
                    }
                });

                // ✅ Subscribe for message deletions
                stompClient.subscribe(`/user/${groupId}/groupMessageDelete`, (messageId) => {
                    try {
                        console.log("Received message delete");
                        const parsedMessageId = JSON.parse(messageId.body);
                        console.log(parsedMessageId);

                        setGroupMessages((prev) => prev.filter((msg) => msg.id !== parsedMessageId));
                    } catch (error) {
                        console.error("Error parsing message delete:", error);
                    }
                }



                );
                setClient(stompClient);
            },
            onStompError: (frame) => console.error("STOMP Error:", frame),
            onWebSocketClose: () => console.warn("WebSocket disconnected. Attempting reconnect..."),
        });


        stompClient.activate();
        return () => {
            if (stompClient.connected) stompClient.deactivate();
        };

    }, [groupId, userId]);

    useEffect(() => {
        console.log(groupId);
    }, [groupId])

    const handleGroupSelect = (group) => {
        setSelectedGroup(group);
        console.log(group.id);

        setJoinStatus(null);

        setGroupId(prev => {
            console.log("Updating groupId to:", group.id);
            return group.id;
        });

    };

    var prevUpdateMessage = useRef(null);
    var prevDeleteMessage = useRef(null);
    var prevselectedGroup = useRef(null);
    useEffect(() => {
        if (selectedGroup == null)
            return;
        console.log("hi");

        if (prevselectedGroup !== selectedGroup.id)
            console.log(prevselectedGroup + " " + selectedGroup);

        prevselectedGroup = selectedGroup.id;
        axios.get(`http://localhost:8080/api/searchchat/groups/${selectedGroup.id}/members`, { withCredentials: true })
            .then(response => {
                setGroupMembers(response.data.map(member => member.id));

                // Fetch group messages if user is in the group
                if (response.data.some(member => member.id === userId)) {
                    axios.get(`http://localhost:8080/api/chat/groups/${selectedGroup.id}/messages`, { withCredentials: true })
                        .then(res => setGroupMessages(res.data))
                        .catch(error => console.error("Error fetching group messages:", error));
                }
            })
            .catch(error => console.error("Error fetching group members:", error));
    }, [selectedGroup, userId]);

    const joinGroup = (groupId) => {
        axios.post(`http://localhost:8080/api/chat/groups/${groupId}/join`, { userId }, { withCredentials: true })
            .then(() => {
                toast.success("You have successfully joined the group!");
                setJoinStatus("You have successfully joined the group!");
                setGroupMembers((prev) => [...prev, userId]);
                setGroups(prev => {
                    const joinedGroup = prev.notJoined.find(group => group.id === groupId);
                    if (!joinedGroup) return prev; // Safety check

                    return {
                        joined: [...prev.joined, joinedGroup], // Move to joined
                        notJoined: prev.notJoined.filter(group => group.id !== groupId) // Remove from notJoined
                    };
                });
                setFilteredGroups(groups.notJoined);
            })
            .catch(() => {
                toast.error("Failed to join the group. Please try again.");
                setJoinStatus("Failed to join group!");
            });
    };

    // const createGroup = () => {
    //     const groupName = prompt("Enter group name:");
    //     if (!groupName) return;
    //     axios.post("http://localhost:8080/api/chat/groups", { name: groupName, createdBy: userId }, { withCredentials: true })
    //         .then(response => {
    //             const newGroup = response.data;

    //             setGroups(prev => ({
    //                 joined: [...prev.joined, newGroup], // Add new group to joined
    //                 notJoined: prev.notJoined // Keep notJoined unchanged
    //             }));
    //         })
    //         .catch(error => console.error("Error creating group:", error));
    // };

    const createGroup = (groupName) => {
        if (!groupName.trim()) {
            toast.warning("Please enter a valid group name");
            return;
        }
        
        axios.post("http://localhost:8080/api/chat/groups", { name: groupName, createdBy: userId }, { withCredentials: true })
            .then(response => {
                const newGroup = response.data;
                setGroups(prev => ({
                    joined: [...prev.joined, newGroup], // Add to joined groups
                    notJoined: prev.notJoined // Keep notJoined unchanged
                }));
                toast.success(`Group "${groupName}" created successfully!`);
            })
            .catch(error => {
                toast.error("Failed to create group. Please try again.");
            });
    };

    useEffect(() => {
        const fetchGroupMessages = (groupId) => {
            axios.get(`http://localhost:8080/api/chat/groups/${groupId}/messages`, { withCredentials: true })
                .then(response => setGroupMessages(response.data))
                .catch(error => console.error("Error fetching group messages:", error));
        };
    }, [userId, groupId]);


    const sendGroupMessage = () => {
        if (!input.trim()) {
            return;
        }
        
        if (!client || !client.connected) {
            toast.error("Not connected to chat service. Please try again.");
            return;
        }
        
        console.log(groupId);

        const msg = { senderId: userId, groupId, content: input };
        client.publish({ 
            destination: "/app/sendGroupMessage", 
            body: JSON.stringify(msg),
            headers: {},
            onSendCallback: () => {
                // Success handling if needed
            },
            onErrorCallback: (error) => {
                toast.error("Failed to send message. Please try again.");
            }
        });

        setInput("");
    };



   
    // Handle pressing Enter to send a message
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendGroupMessage();
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [groupMessages])

    return (
        <div className="flex h-screen bg-chat-light">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-soft h-[600px] overflow-hidden flex flex-col animate-fade-in">
                {/* <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-4">
                        <Link to="/chat" className="flex items-center text-blue-500 hover:text-blue-600 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            <span className="text-sm font-medium">Back to Chat</span>
                        </Link>
                    </div>
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">Groups</h2>
                        <button
                            onClick={createGroup}
                            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors shadow-sm"
                            aria-label="Create a new group"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div> */}
                <div>
            {/* Header Section */}
            <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-4">
                    <Link to="/chat" className="flex items-center text-blue-500 hover:text-blue-600 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">Back to Chat</span>
                    </Link>
                </div>
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">Groups</h2>
                    <button
                        onClick={() => setIsModalOpen(true)} // Open modal on click
                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors shadow-sm"
                        aria-label="Create a new group"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Modal Component */}
            <CreateGroupModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onCreate={createGroup} 
            />
        </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-6">

                    {/* Your Groups Section */}
                    {groups.joined.length > 0 && (
                        <div className="space-y-2 animate-slide-up bg-blue-50 p-3 rounded-lg shadow-sm border-l-4 border-blue-500">
                            <div className="flex items-center space-x-2 px-2">
                                <Users className="w-4 h-4 text-blue-500" />
                                <h3 className="text-sm font-semibold text-blue-600">Your Groups</h3>
                            </div>
                            {groups.joined.map((group, index) => (
                                <div
                                    key={group.id}
                                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 
                        ${selectedGroup?.id === group.id
                                            ? "bg-blue-500 text-white shadow-md"
                                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                        }`}
                                    onClick={() => handleGroupSelect(group)}
                                    style={{ animationDelay: `${(index + 1) * 50}ms` }}
                                >
                                    <div className="font-medium">{group.name}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Discover Groups Section */}
                    {/* {groups.notJoined.length > 0 && (
                        <div className="space-y-2 animate-slide-up bg-green-50 p-3 rounded-lg shadow-sm border-l-4 border-green-500">
                            <div className="flex items-center space-x-2 px-2">
                                <MessageSquare className="w-4 h-4 text-green-500" />
                                <h3 className="text-sm font-semibold text-green-600">Discover Groups</h3>
                            </div>
                            {groups.notJoined.map((group, index) => (
                                <div
                                    key={group.id}
                                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 
                        ${selectedGroup?.id === group.id
                                            ? "bg-gray-200 text-gray-800"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    onClick={() => handleGroupSelect(group)}
                                    style={{ animationDelay: `${(index + 1) * 50}ms` }}
                                >
                                    <div className="font-medium">{group.name}</div>
                                </div>
                            ))}
                        </div>
                    )} */}

                    {groups.notJoined.length > 0 && (
            <div className="space-y-2 animate-slide-up bg-green-50 p-3 rounded-lg shadow-sm border-l-4 border-green-500">
                {/* Header Section */}
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4 text-green-500" />
                        <h3 className="text-sm font-semibold text-green-600">Discover Groups</h3>
                    </div>

                    {/* Search Icon */}
                    <Search 
                        className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700 transition-all"
                        onClick={() => setIsSearching(true)}
                    />
                </div>

                {/* Search Box */}
                {isSearching && (
                    <div className="relative mt-2 px-2">
                        <div className="flex items-center border rounded-md px-2 py-1 bg-white shadow-md">
                            <Search className="w-4 h-4 text-gray-500 mr-2" />
                            <input
                                type="text"
                                placeholder="Search groups..."
                                value={searchQuery}
                                autoFocus
                                onChange={(e) => handleSearch(e.target.value)}
                                className="text-sm outline-none w-full"
                            />
                            <X 
                                className="w-4 h-4 text-gray-500 cursor-pointer ml-2 hover:text-gray-700"
                                onClick={handleCloseSearch} // Reset search
                            />
                        </div>
                    </div>
                )}

                {/* Group List */}
                {filteredGroups.map((group, index) => (
                    <div
                        key={group.id}
                        className={`p-3 rounded-lg cursor-pointer transition-all duration-200 
                            hover:bg-gray-200 text-gray-600`}
                        onClick={() => handleGroupSelect(group)}
                        style={{ animationDelay: `${(index + 1) * 50}ms` }}
                    >
                        <div className="font-medium">{group.name}</div>
                    </div>
                ))}
            </div>
        )}
    
    

                </div>


            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col">
                {selectedGroup ? (
                    <div className="flex flex-col h-[650px] animate-fade-in">
                        {/* Chat Header */}
                        <div className="bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-10">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">{selectedGroup.name}</h3>
                                <p className="text-xs text-gray-500">{groupMembers.length} members</p>
                            </div>

                            {/* Join button only shows for non-joined groups */}
                            {!groupMembers.includes(userId) && (
                                <button
                                    onClick={() => joinGroup(selectedGroup.id)}
                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
                                >
                                    Join Group
                                </button>
                            )}

                            {groupMembers.includes(userId) && (
                                <button
                                    onClick={() => exitGroup(selectedGroup.id)}
                                    className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition"
                                    title="Exit Group"
                                >
                                    <LogOut size={20} />
                                </button>
                            )}
                        </div>

                        {/* Status message if any */}
                        {joinStatus && (
                            <div className={`text-center p-2 text-sm ${joinStatus.includes("success") ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                                }`}>
                                {joinStatus}
                            </div>
                        )}



                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50" ref={chatContainerRef}>
                            {groupMembers.includes(userId) ? (
                                groupMessages.length > 0 ? (
                                    <div className="space-y-3">
                                        {groupMessages.map((msg, index) => (
                                            <div key={index} className={`flex items-center ${msg.senderId === userId ? "justify-end" : "justify-start"}`}>
                                                <div className={`chat-bubble flex items-center gap-2 px-4 py-2 rounded-lg text-black 
                        ${msg.senderId === userId ? "bg-blue-500" : "bg-gray-300 text-black"}`}>

                                                    {/* Edit mode */}
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

                                                    {/* Sender's Name */}
                                                    <span className="text-xs opacity-70">
                                                        {msg.senderId === userId ? "You" : userNames[msg.senderId] || "User"}
                                                    </span>

                                                    {/* Edit & Delete Options (Only for User's Messages) */}
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
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-gray-500 text-center max-w-md">
                                            No messages yet. Be the first to start the conversation!
                                        </p>
                                    </div>
                                )
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-soft">
                                        <h4 className="text-lg font-medium text-gray-800 mb-2">Join this group</h4>
                                        <p className="text-gray-600 mb-4">You need to join this group to see messages and participate in the conversation.</p>
                                        <button
                                            onClick={() => joinGroup(selectedGroup.id)}
                                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md shadow-sm transition-colors w-full"
                                        >
                                            Join Group
                                        </button>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />

                        </div>


                        {/* Input Area - Only show for joined groups */}
                        {groupMembers.includes(userId) && (
                            <div className="p-4 bg-white border-t flex items-center space-x-2">
                                <input
                                    className="flex-1 p-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Type a message..."
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                />
                                <button
                                    className={`p-3 rounded-full transition-colors shadow-sm flex items-center justify-center ${input.trim()
                                        ? "bg-green-400 text-green-900 text-white"
                                        : "bg-blue-300 hover:bg-blue-600 cursor-not-allowed"
                                        }`}
                                    onClick={sendGroupMessage}
                                    disabled={!input.trim()}
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-center p-4 animate-fade-in">
                        <div className="max-w-md">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Group Conversations</h3>
                            <p className="text-gray-600 mb-6">Select a group from the sidebar to start chatting or create a new group.</p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center mx-auto"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Create a Group
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GroupChat;


