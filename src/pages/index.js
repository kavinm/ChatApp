import { useState, useEffect } from "react";
import PubNub from "pubnub";
import ChatInput from "../components/ChatInput";
import ChatMessage from "../components/ChatMessage";

const pubnub = new PubNub({
  publishKey: "pub-c-6f6f44cf-32bb-46fc-bd2a-0352780e0145",
  subscribeKey: "sub-c-d015da5c-7af2-4051-bfa1-771db14be0a0",
  uuid: Math.random().toString(36).substring(7),
});

export default function Home() {
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    pubnub.addListener({
      message: (message) => {
        setMessages((prevMessages) => [...prevMessages, message.message]);
      },
    });

    pubnub.subscribe({
      channels: ["chat"],
    });

    return () => {
      pubnub.unsubscribe({
        channels: ["chat"],
      });
    };
  }, []);

  const handleUsernameSubmit = (submittedUsername) => {
    setUsername(submittedUsername);
  };

  const handleSendMessage = (message) => {
    pubnub.publish({
      channel: "chat",
      message: { username, message },
    });
  };

  return (
    <div>
      {username ? (
        <>
          <ChatInput onSendMessage={handleSendMessage} />
          <div>
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
          </div>
        </>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUsernameSubmit(e.target.username.value);
          }}>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
          />
          <button type="submit">Join Chat</button>
        </form>
      )}
    </div>
  );
}
