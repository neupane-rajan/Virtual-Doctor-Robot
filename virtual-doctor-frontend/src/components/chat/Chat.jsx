import { useState, useRef, useEffect } from 'react';
import { Card, Form, Button, InputGroup, Container, Badge } from 'react-bootstrap';
import { getChatResponse } from '../../services/chatService'; // Import the function
import './Chat.css'; // Ensure you have this CSS file

function Chat() {
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: 'Hello! I am your Virtual Doctor. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Suggestions for common health questions
  const suggestions = [
    "I have a headache that won't go away",
    "My throat is sore and I have a fever",
    "I have a rash on my arm",
    "What causes stomach pain after eating?",
    "I've been feeling very tired lately",
    "My knee hurts when I walk"
  ];

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = { 
      sender: 'user', 
      text: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Use the updated chatService function
      const response = await getChatResponse(input);
      
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: response.response, 
        specialty: response.specialty, // From Django backend
        isMedical: response.isMedical, // From Django backend
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to use suggested questions
  const useSuggestion = (suggestion) => {
    setInput(suggestion);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Container className="chat-page-container py-4">
      <div className="chat-header">
        <div className="chat-header-icon">
          <i className="bi bi-robot"></i>
        </div>
        <div className="chat-header-content">
          <h2>Virtual Doctor</h2>
          <p>Ask me about symptoms, treatments, or general health questions</p>
        </div>
      </div>

      <Card className="chat-card">
        <Card.Body 
          className="chat-container"
          ref={chatContainerRef}
        >
          <div className="chat-date-divider">
            <span>Today</span>
          </div>

          {messages.map((message, index) => (
            <div
              key={index}
              className={`message-container ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
            >
              {message.sender === 'bot' && (
                <div className="avatar-container bot-avatar">
                  <i className="bi bi-robot"></i>
                </div>
              )}
              
              <div className="message-content-wrapper">
                <div className="message-bubble">
                  {message.text}
                  
                  {/* Display specialty badge for medical responses */}
                  <div className="message-badges">
                    {message.specialty && message.isMedical && (
                      <span className="medical-specialty">
                        <i className="bi bi-clipboard-pulse me-1"></i>{message.specialty}
                      </span>
                    )}
                  </div>
                </div>
                <div className="message-timestamp">
                  {formatTime(message.timestamp)}
                </div>
              </div>

              {message.sender === 'user' && (
                <div className="avatar-container user-avatar">
                  <i className="bi bi-person-fill"></i>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="message-container bot-message">
              <div className="avatar-container bot-avatar">
                <i className="bi bi-robot"></i>
              </div>
              <div className="message-content-wrapper">
                <div className="message-bubble typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </Card.Body>
        
        <Card.Footer className="chat-footer">
          {/* Add suggested questions */}
          <div className="suggested-questions">
            {suggestions.map((suggestion, index) => (
              <Button 
                key={index} 
                variant="outline-primary" 
                size="sm" 
                className="suggestion-btn"
                onClick={() => useSuggestion(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>

          <Form onSubmit={handleSendMessage} className="message-form">
            <InputGroup>
              <Form.Control
                placeholder="Ask me anything about health or medical topics..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="message-input"
              />
              <Button 
                type="submit" 
                className="send-button" 
                disabled={isLoading || !input.trim()}
              >
                <i className="bi bi-send-fill"></i>
              </Button>
            </InputGroup>
          </Form>
          <div className="chat-disclaimer">
            <i className="bi bi-info-circle me-2"></i>
            This is a virtual consultation. For emergencies, please call 911 or visit the nearest hospital.
          </div>
        </Card.Footer>
      </Card>
    </Container>
  );
}

export default Chat;