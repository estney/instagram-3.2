import logo from "/logo.png";
import "./App.css";
import { onChildAdded, push, ref, set } from "firebase/database";
import { database } from "./firebase";
import { useState, useEffect } from "react";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
//set date
const DATE = new Date().toDateString();

function App() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  useEffect(() => {
    const messagesRef = ref(database, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      setMessages((prevState) =>
        // Store message key so we can use it as a key in our list items when rendering messages
        [...prevState, { key: data.key, val: data.val() }]
      );
    });
  }, [setMessages, setUserInput]);

  const writeData = (e) => {
    e.preventDefault();
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);

    const messageData = {
      text: userInput,
      timestamp: DATE,
    };

    set(newMessageRef, messageData);
    setUserInput("");
  };

  // Convert messages in state to message JSX elements to render
  let messageListItems = messages.map((message) => (
    <li key={message.key}>
      <p>
        {message.val.timestamp}: {message.val.text}
      </p>
    </li>
  ));

  return (
    <>
      <div>
        <img src={logo} className="logo" alt="Rocket logo" />
      </div>
      <h1>Instagram Bootcamp</h1>
      <div className="card">
        {/* TODO: Add input field and add text input as messages in Firebase */}
        <form onSubmit={writeData}>
          <input type="text" value={userInput} onChange={handleInputChange} />
          <br />
          <button type="submit" onClick={writeData}>
            Send
          </button>
        </form>
        <ol>{messageListItems}</ol>
      </div>
    </>
  );
}

export default App;
