import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useCalendar } from "../context/CalendarContext";
import MarkdownRender from "./MarkdownRender";

export default function PromptMenu() {
    const [messages, setMessages] = useState([]);  // store chat history
    const [input, setInput] = useState("");        // store user input
    const [isLoading, setIsLoading] = useState(false); // loading state
    const { selectedDate, events } = useCalendar();
    const [classification, setClassification] = useState("Academic Question");


    useEffect(() => {
        console.log(messages);
    }, [messages]);



    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = { text: input, sender: "User" };
        setMessages([...messages, userMessage]);
        setIsLoading(true);

        try {
            const response = await fetch("http://127.0.0.1:8000/api/research", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    classification: classification,
                    query: input
                })
            });

            const data = await response.json();
            const aiResponse = {  text: data.response.json_dict.response, sender: "AI" };
            setMessages(prev => [...prev, aiResponse]);
        } catch (error) {
            console.error("Response fetching failed:", error);
            setMessages(prev => [...prev, {
                text: "Error: Failed to get response from server",
                sender: "AI"
            }]);
        } finally {
            setIsLoading(false);
            setInput("");
        }
    };

    return (
        <ChatContainer>
            <ChatHistory>
                {messages.map((msg, index) => (
                    <Message key={index} sender={msg.sender}>
                        {msg.sender === "User" ? (
                            <div>
                                {/* <MarkdownRender content={msg.text} /> */}
                                <strong>You:</strong> {msg.text}
                            </div>
                        ) : (
                            <div>
                                <strong>AI:</strong>
                                <MarkdownRender content={msg.text} />
                                {/* <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}> {msg.text} </pre> */}
                            </div>
                        )}
                    </Message>
                ))}
                {isLoading && (
                    <Message sender="AI">
                        <div>
                            <strong>AI:</strong>
                            <LoadingText>Loading...</LoadingText>
                        </div>
                    </Message>
                )}
            </ChatHistory>

            <DropdownContainer>
                <label htmlFor="classification">Select a type:</label>
                <select
                    id="classification"
                    value={classification}
                    onChange={(e) => setClassification(e.target.value)}
                    disabled={isLoading}
                >
                    <option value="Research Topic">Research Topic</option>
                    <option value="Academic Question">Academic Question</option>
                </select>
            </DropdownContainer>

            <InputContainer>
                <ChatInput
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Type your question or research topic..."`}
                    disabled={isLoading}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSend();
                        }
                    }}
                />
                <SendButton onClick={handleSend} disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Send'}
                </SendButton>
            </InputContainer>
        </ChatContainer>
    );
}

const ChatContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 100%;
    height: 100vh;
    border: 2px solid #ccc;
    border-radius: 8px;
    background: #E0E4EE;
    overflow: hidden;
`;

const ChatHistory = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    border-bottom: 2px solid #ccc;
    max-height: calc(100vh - 200px);
`;

// based on sender or ai, set the color for sender and positioning
const Message = styled.div`
    background: ${(props) => (props.sender === "user" ? "#353755" : "#777")};
    color: white;
    padding: 8px;
    border-radius: 8px;
    margin: 5px 0;
    align-self: ${(props) => (props.sender === "user" ? "flex-end" : "flex-start")};
    max-width: 100%;
    word-break: break-word;
    overflow-wrap: anywhere;
    white-space: pre-wrap;
    overflow-x: auto;
    * {
        max-width: 100%;
        overflow-wrap: break-word;
        word-break: break-word;
    }

    pre, code {
        white-space: pre-wrap;
        overflow-x: auto;
        display: block;
    }

    table {
        width: 100%;
        overflow-x: auto;
        display: block;
    }
`;
    


const InputContainer = styled.div`
    display: flex;
    padding: 10px;
    gap: 10px;
    align-items: center;
`;

const ChatInput = styled.textarea`
    flex: 1;
    padding: 8px;
    border: 2px solid #ccc;
    border-radius: 4px;
    resize: none;
    min-height: 40px;
    max-height: 150px;
    overflow-y: auto;
    font-size: 16px;
    line-height: 1.5;
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

const LoadingText = styled.div`
    color: #666;
    font-style: italic;
`;

const DropdownContainer = styled.div`
    margin: 10px 10px 0 10px;
    display: flex;
    gap: 10px;
    align-items: center;

    select {
        padding: 6px;
        border-radius: 4px;
        border: 1px solid #ccc;
    }
`;