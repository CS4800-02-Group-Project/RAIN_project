import React, { useState, useEffect } from "react";
import styled from "styled-components";

export default function PromptMenu() {
    const [messages, setMessages] = useState([]);  // store chat history
    const [input, setInput] = useState("");        // store user input

    useEffect(() => {
        console.log(messages);
    }, [messages]);

    /** 
     * Create event based on selection from Calendar, sent request, capture request by CrewAI and create prompt message in chat box
     * */ 
    const handleSend = async () => {
        if (!input.trim()) return; 
    
        // Update chat history with user message
        const userMessage = { text: input, sender: "User" };
        setMessages([...messages, userMessage]);
    
        try { 
            // continue testing
            // Call Express instead of FastAPI
            // const response = await fetch("http://localhost:3001/api/research", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ prompt: input }),
            // });

            const response = await fetch("http://localhost:3001/api/test", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ prompt: "some input" })
            });
            const data = await response.json();
            const aiResponse = { text: data.response, sender: "AI" };
            setMessages(prevMessages => [...prevMessages, aiResponse]);
        } catch (error) {
            console.error("Response fetching failed...", error);
        }
    
        setInput(""); // Clear input field
    };

    return (
        <ChatContainer>
            <ChatHistory>
                {messages.map((msg, index) => (
                    <Message key={index} sender={msg.sender}>
                        {[msg.sender, ": ", msg.text]}
                    </Message>
                ))}
            </ChatHistory>
            <InputContainer>
                <ChatInput
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <SendButton onClick={handleSend}>Send</SendButton>
            </InputContainer>
        </ChatContainer>
    );
}


const ChatContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 400px;
    height: 500px;
    border: 2px solid #ccc;
    border-radius: 8px;
    background: #E0E4EE;
    padding: 10px;
`;

const ChatHistory = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    border-bottom: 2px solid #ccc;
`;

// based on sender or ai, set the color for sender and positioning
const Message = styled.div`
    background: ${(props) => (props.sender === "user" ? "#353755" : "#777")};
    color: white;
    padding: 8px;
    border-radius: 8px;
    margin: 5px 0;
    align-self: ${(props) => (props.sender === "user" ? "flex-end" : "flex-start")};
    max-width: 80%;
`;

const InputContainer = styled.div`
    display: flex;
    padding: 10px;
    gap: 10px;
`;

const ChatInput = styled.input`
    flex: 1;
    padding: 8px;
    border: 2px solid #ccc;
    border-radius: 4px;
`;

const SendButton = styled.button`
    background: #353755;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
        background: #555;
    }
`;