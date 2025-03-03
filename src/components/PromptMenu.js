import React, { useState } from "react";
import styled from "styled-components";

export default function PromptMenu() {
    const [messages, setMessages] = useState([]);  // store chat history
    const [input, setInput] = useState("");        // store user input

    const handleSend = () => {
        // stop blank messages
        if (!input.trim()) {
            return; 
        }

        // update the chat history from user
        const userMessage = { text: input, sender: "user" };
        setMessages([...messages, userMessage]); 

        // Example of AI response, remove later for actual AI agent
        // timeout used for simulating response
        setTimeout(() => {
            const aiResponse = { text: `AI Response to: "${input}"`, sender: "ai" };
            setMessages((prev) => [...prev, aiResponse]); 
        }, 1000);

        setInput(""); // Clear input field
    };

    return (
        <ChatContainer>
            <ChatHistory>
                {messages.map((msg, index) => (
                    <Message key={index} sender={msg.sender}>
                        {msg.text}
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
