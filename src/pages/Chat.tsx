// pages/ChatPage.tsx
import React, { useState, useEffect, useRef, use } from "react";
import { useQuery, useMutation, useSubscription, gql } from "@apollo/client";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Message from "../components/Message";

import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { initializeSocket } from "../lib/socket";

const GET_STUDENTS = gql`
  query GetStudents {
    getStudents {
      id
      username
      role
    }
  }
`;
const GET_ADMINS = gql`
  query GetAdmins {
    getAdmins {
      id
      username
      role
    }
  }
`;

const GET_MESSAGES = gql`
  query GetMessages($receiver: String!) {
    messagesByReceiver(receiver: $receiver) {
      id
      sender
      receiver
      text
      timestamp
    }
  }
`;
const GET_ALL_MESSAGES = gql`
  query GetAllMessages {
   messages {
      id
      sender
      receiver
      text
      timestamp
    }
  }
`;

const ADD_MESSAGE = gql`
  mutation addMessage($input: MessageInput!) {
    addMessage(input: $input) {
      id
      sender
      receiver
      text
      timestamp
    }
  }
`;

const MESSAGE_ADDED_SUBSCRIPTION = gql`
  subscription OnMessageAdded {
    messageAdded {
      id
      sender
      receiver
      text
      timestamp
    }
  }
`;

interface Student {
  id: string;
  username: string;
  role: string;
}

interface MessageType {
  id: string;
  text: string;
  sender: string;
  receiver: string;
  timestamp: string;
  sent?: boolean;
}

const Chat = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string; role: string } | null>(null);
  const isStudent = currentUser?.role === "student";
  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  , [messages]);

  // Initialize socket connection
  
// In your Chat component
// In your frontend code (Chat component)
useEffect(() => {
  if (!currentUser) return;

  socketRef.current = initializeSocket();

  // Wait for connection before joining rooms
  socketRef.current.on('connect', () => {
    console.log('✅ Socket connected with ID:', socketRef.current?.id);
    socketRef.current?.emit('joinUserRoom', currentUser.id);
  });

  // Handle incoming messages
  // socketRef.current.on('receiveMessage', (message: MessageType) => {
  //   console.log('🔁 Received message:', message);
  
  //   setMessages((prev) => {
  //     // Check if already exists (match text, sender, receiver, timestamp)
  //     const isDuplicate = prev.some(
  //       (msg) =>
  //         msg.text === message.text &&
  //         msg.sender === message.sender &&
  //         msg.receiver === message.receiver &&
  //         msg.timestamp === message.timestamp
  //     );
  
  //     if (isDuplicate) {
  //       console.log('⚠️ Duplicate message skipped');
  //       return prev;
  //     }
    
  //     // Append new message
  //     return [...prev, {
  //       ...message,
  //       timestamp:new Date(message.timestamp).getTime(),
  //       sent: message.sender === currentUser?.username,
  //     }];console.log("receiveMessage", message);
  //   });
  // });
  
  
  return () => {
    socketRef.current?.off('receiveMessage', (message: MessageType) => {
   //   console.log('Received message:', message);
  });}
}, [currentUser]);
useEffect(() => {
 // if (!socketRef.current || !currentUser) return;

  // Only handle messages where currentUser is the receiver
  const handleNewMessage = (message) => {
    console.log("New message received:", message);
    if (message.receiver === currentUser.username) {
      setMessages(prev => [...prev, {
        ...message,
        sent: false // Mark as received message
      }]);
    }
  };

  //socketRef.current.on('addMessage', handleNewMessage);

  return () => {
    socketRef.current?.off('addMessage', handleNewMessage);
  };
}, [currentUser?.id]); // Only re-run if user ID changes
useEffect(() => {
  if (!currentUser) return;

  socketRef.current = initializeSocket();
  
  // Join user's personal room
  socketRef.current.emit('joinUserRoom', currentUser.id);

  socketRef.current.on('receiveMessage', (message: MessageType) => {
    //console.log("Received message:", message);
    // Only add message if it's relevant to current chat
    if (
      (message.sender === currentUser.username && 
       message.receiver === selectedStudent?.username) ||
      (message.receiver === currentUser.username && 
       message.sender === selectedStudent?.username)
    ) {
      setMessages((prev) => [
        ...prev,
        {
          ...message,
          timestamp: new Date(message.timestamp).getTime().toString(),
          sent: message.sender === currentUser.username,
        },
      ]);
    }
    console.log("Received message:", message);
  });

  return () => {
   // socketRef.current?.disconnect();
  };
}, [currentUser, selectedStudent]);
  // Get students list
  const { loading: studentsLoading, error: studentsError, data: studentsData } = useQuery(GET_STUDENTS, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  });
  // Get admins list
  const { loading: adminsLoading, error: adminsError, data: adminsData } = useQuery(GET_ADMINS, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  });

  // Get messages for selected student
  const {
    loading: messagesLoading,
    error: messagesError,
    data: messagesData,
    refetch: refetchMessages,
  } = useQuery(GET_ALL_MESSAGES, {
    variables: { receiver: selectedStudent?.username || "" },
    skip: !selectedStudent,
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  });

  // Mutation for sending messages
  const [addMessage] = useMutation(ADD_MESSAGE, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  });

  // Real-time subscription to new messages
  const { data: subscriptionData } = useSubscription(MESSAGE_ADDED_SUBSCRIPTION, {
    variables: { currentUser: currentUser?.username },
    onSubscriptionData: ({ subscriptionData }) => {
      const newMsg = subscriptionData.data?.messageAdded;
      if (!newMsg || !currentUser || !selectedStudent) return;

      const isRelevantMessage =
        (newMsg.sender === currentUser.username && newMsg.receiver === selectedStudent.username) ||
        (newMsg.receiver === currentUser.username && newMsg.sender === selectedStudent.username);

      if (isRelevantMessage) {
        setMessages((prev) => [
          ...prev,
          {
            ...newMsg,
            sent: newMsg.sender === currentUser.username,
          },
        ]);
      }
    },
  });

  // Set current user from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const userId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("role");

    if (token && username && userId && userRole) {
      setCurrentUser({
        id: userId,
        username,
        role: userRole,
      });
    } else {
      alert("No user signed in! Redirecting...");
      window.location.href = "/signin";
    }
  }, []);

  // Refetch messages when selected student changes
  useEffect(() => {
    if (selectedStudent) {
      refetchMessages({ receiver: selectedStudent.username });
    }
  }, [selectedStudent, refetchMessages]);

  // Update messages when messagesData changes
  useEffect(() => {
    if (messagesData?.messages && currentUser) {
      console.log("Messages data:", messagesData.messages);
      setMessages(
        messagesData.messages.map((msg: MessageType) => ({
          ...msg,
          sent: msg.sender === currentUser.username&&msg.receiver==selectedStudent?.username||msg.receiver === currentUser.username&&msg.sender==selectedStudent?.username,
        }))
      );
     
    }
  }, [messagesData, currentUser,selectedStudent]);

  const handleSendMessage = async () => {
    const timestamp = Number(Date.now().toString().replace(/,/g, ''));

// 2. Create a Date object
const date = new Date(timestamp);

// 3. Format to ISO 8601 with offset (e.g., `+00:00`)
const isoString = date.toISOString(); // e.g., "2025-05-15T20:23:18.896Z"

// 4. Replace the 'Z' with '+00:00' for your desired format
const formatted = isoString.replace('Z', '+00:00');
    if (newMessage.trim() === "" || !selectedStudent || !currentUser) return;
  
    const tempId = Date.now();
    const optimisticMessage = {
      id: tempId,
      text: newMessage,
      sender: currentUser.username,
      receiver: selectedStudent.username,
      timestamp: Date.now().toString(),
      sent: true,
    };
    console.log("Optimistic message:", optimisticMessage);
  
    // Optimistic update
    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");
  
    try {
      // Send via Socket.io
      socketRef.current.emit('addMessage', {
        from: currentUser.username,
        to: selectedStudent.username,
        content: newMessage,
        timestamp:Date.now().toString(),
        recId: selectedStudent.id,
      },
    console.log("Message sent via socket:", {
        from: currentUser.username, }));
      console.log("Message sent via socket:", {
        from: currentUser.id,
        to: selectedStudent.id,
        content: newMessage,
      });
      
      // Optionally also save to database via GraphQL
      // await addMessage({
      //   variables: {
      //     input: {
      //       text: newMessage,
      //       receiver: selectedStudent.username,
      //       sender: currentUser.username,
      //       timestamp: new Date().toISOString(),
      //     },
      //   },
      // });
    } catch (error) {
      console.error("Error sending message:", error);
      // Rollback optimistic update
   //   setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/signin";
  };

  if (studentsLoading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center">Loading...</div>;
  if (studentsError) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-500">Error: {studentsError.message}</div>;

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Header username={currentUser?.username || ""} role={currentUser?.role || ""} onLogout={handleLogout} />

      <main className="flex flex-1">
        <Sidebar isStudent={currentUser?.role === "student"} />

        <section className="content flex flex-1 p-5 gap-5  flex-row sm:flex-col ">
         { isStudent? (
            <div className="admins-section w-64">
              <h2 className="text-xl mb-4">List of Admins</h2>
              <ul className="admins-list space-y-2">
                {adminsData?.getAdmins?.map((admin: Student) => (
                  <li
                    key={admin.id}
                    className={`admin-item p-4 rounded cursor-pointer ${
                      selectedStudent?.id === admin.id ? "bg-blue-600" : "bg-gray-700"
                    }`}
                    onClick={() => setSelectedStudent(admin)}
                  >
                    {admin.username}
                  </li>
                ))}
              </ul>
            </div>):(
          <div className="students-section w-64">
            
            <h2 className="text-xl mb-4">List of Students</h2>
            <ul className="students-list space-y-2">
              {studentsData?.getStudents?.map((student: Student) => (
                <li
                  key={student.id}
                  className={`student-item p-4 rounded cursor-pointer ${
                    selectedStudent?.id === student.id ? "bg-blue-600" : "bg-gray-700"
                  }`}
                  onClick={() => setSelectedStudent(student)}
                >
                  {student.username}
                </li>
              ))}
            </ul>
          </div>)}

          <div className="chat-section flex-1 flex flex-col  border border-gray-700 rounded-lg overflow-y-auto h-120 w-100  ">
            <div className="chat-header p-4 border-b border-gray-700">
              <h3 className="text-lg">
                {selectedStudent ? `Chatting with ${selectedStudent.username}` :isStudent? "Select an admin to chat": "Select a student to chat"}
              </h3>
            </div>

            <div className="chat-messages flex-1 p-4 overflow-y-auto min-h-[300px] h-300 ">
              {messagesLoading ? (
                <div className="flex justify-center items-center h-full">Loading messages...</div>
              ) : messagesError ? (
                <div className="text-red-500 text-center">Error loading messages</div>
              ) : messages.length === 0 ? (
                <div className="flex justify-center items-center h-full text-gray-400">
                  {selectedStudent ? "No messages yet" : isStudent? "Select an admin to view messages":"Select a student to view messages"}
                </div>
              ) : (
                messages
                  .filter(message => 
                    ( message.sender === currentUser?.username && message.receiver === selectedStudent?.username) ||
                    (message.receiver === currentUser?.username && message.sender === selectedStudent?.username)
                  )
                  .map((message) => (
                    <Message key={message.id} sent={message.sender === currentUser?.username}>
                      <div className="flex flex-col">
                        <span>{message.text}</span>
                        <span className="text-xs text-black mt-1">
  {new Date(Number(message.timestamp)).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // change to false if you want 24-hour format
  })}
</span>

                      </div>
                    </Message>
                  ))
                
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input flex p-3 border-t border-gray-700">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 rounded border-none bg-gray-700 text-white mr-2"
                disabled={!selectedStudent || messagesLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!selectedStudent || messagesLoading || newMessage.trim() === ""}
                className={`send-btn ${
                  selectedStudent && !messagesLoading && newMessage.trim() !== ""
                    ? "bg-green-500 hover:bg-green-600 cursor-pointer"
                    : "bg-gray-600 cursor-not-allowed"
                } text-white border-none px-5 rounded transition-colors`}
              >
                Send
              </button>
            </div>
          
          </div>
        </section>
      </main>
    </div>
  );
};

export default Chat;