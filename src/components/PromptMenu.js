import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useCalendar } from "../context/CalendarContext";

export default function PromptMenu() {
    const [messages, setMessages] = useState([]);  // store chat history
    const [input, setInput] = useState("");        // store user input
    const [isLoading, setIsLoading] = useState(false); // loading state
    const { selectedDate, events } = useCalendar();

    useEffect(() => {
        console.log(messages);
    }, [messages]);

    /** 
     * Create event based on selection from Calendar, sent request, capture request by CrewAI and create prompt message in chat box
     * */

    function parsePythonStyleJSON(jsonStr) {
        // Extract topic
        const topicMatch = jsonStr.match(/'topic':\s*'([^']+)'/);
        const topic = topicMatch ? topicMatch[1] : "";

        // Extract entries array using regex to identify individual entry objects
        const entryRegex = /{[^{}]*(?:{[^{}]*}[^{}]*)*}/g;
        const entryMatches = jsonStr.match(entryRegex) || [];

        const entries = entryMatches.map(entryStr => {
            // Extract title
            const titleMatch = entryStr.match(/'title':\s*'([^']+)'/);
            const title = titleMatch ? titleMatch[1] : "";

            // Extract authors
            const authorsMatch = entryStr.match(/'authors':\s*(\[[^\]]+\])/);
            let authors = [];
            if (authorsMatch) {
                const authorsStr = authorsMatch[1].replace(/'/g, '"');
                try {
                    authors = JSON.parse(authorsStr);
                } catch (e) {
                    console.error("Error parsing authors:", e);
                }
            }

            // Extract year
            const yearMatch = entryStr.match(/'year':\s*(\d+)/);
            const year = yearMatch ? parseInt(yearMatch[1]) : 0;

            // Extract abstract
            const abstractMatch = entryStr.match(/'abstract':\s*'([^']+)'/);
            const abstract = abstractMatch ? abstractMatch[1] : "";

            // Extract source
            const sourceMatch = entryStr.match(/'source':\s*'([^']+)'/);
            const source = sourceMatch ? sourceMatch[1] : "";

            // Extract doi_url
            const doiMatch = entryStr.match(/'doi_url':\s*'([^']+)'/);
            const doi_url = doiMatch ? doiMatch[1] : "";

            // We'll create a simplified citations object
            const citations = {};

            return {
                title,
                authors,
                year,
                abstract,
                source,
                doi_url,
                citations
            };
        });

        return { topic, entries };
    }


    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = { text: input, sender: "User" };
        setMessages([...messages, userMessage]);
        setIsLoading(true);

        try {
            // Get the selected date's event if it exists
            const selectedDateStr = selectedDate.toISOString().split('T')[0];
            const selectedEvent = events[selectedDateStr] || "No event on this date";

            // Combine the event and user input into a single prompt
            const combinedPrompt = `Event: ${selectedEvent}\nUser Query: ${input}`;

            console.log(combinedPrompt);
            const response = await fetch("http://0.0.0.0:8000/api/research", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    prompt: combinedPrompt
                })
            });

            console.log(response);
            const data = await response.json();
            console.log(data);

            const parsedResponse = parsePythonStyleJSON(data.response);
            console.log(parsedResponse);

            // Format the AI response with chat and articles
            const formattedResponse = `chat: ${input}\n\narticles:\n${parsedResponse.entries.map(entry =>
                `- ${entry.title} (${entry.year})\n  Authors: ${entry.authors.join(', ')}\n  Abstract: ${entry.abstract}\n  Source: ${entry.source}\n  DOI: ${entry.doi_url || 'N/A'}`
            ).join('\n\n')}`;

            const aiResponse = { text: formattedResponse, sender: "AI" };
            setMessages(prevMessages => [...prevMessages, aiResponse]);
        } catch (error) {
            console.error("Response fetching failed...", error);
            setMessages(prevMessages => [...prevMessages, {
                text: "Error: Failed to get response from server",
                sender: "AI"
            }]);
        } finally {
            setIsLoading(false);
        }

        setInput("");
    };

    return (
        <ChatContainer>
            <ChatHistory>
                {messages.map((msg, index) => (
                    <Message key={index} sender={msg.sender}>
                        {msg.sender === "User" ? (
                            <div>
                                <strong>You:</strong> {msg.text}
                            </div>
                        ) : (
                            <div>
                                <strong>AI:</strong>
                                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                    {msg.text}
                                </pre>
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
            <InputContainer>
                <ChatInput
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    disabled={isLoading}
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
    background: ${(props) => (props.sender === "User" ? "#353755" : "#777")};
    color: white;
    padding: 8px;
    border-radius: 8px;
    margin: 5px 0;
    align-self: ${(props) => (props.sender === "User" ? "flex-end" : "flex-start")};
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
    &:disabled {
        background-color: #f0f0f0;
        cursor: not-allowed;
    }
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
    &:disabled {
        background: #999;
        cursor: not-allowed;
    }
`;

const LoadingText = styled.div`
    color: #666;
    font-style: italic;
`;