import React, { useEffect, useState, useContext } from "react";

import { AuthContext } from "./context/AuthContext";
import Login from "./pages/login/Login";
import Navbar from "./pages/navbar/Navbar";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore/lite";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./App.css";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,

  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,

  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,

  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,

  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,

  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function ToDoFormAndList() {
  const [itemText, setItemText] = useState("");
  const [items, setItems] = useState([]);

  // add todo
  const handleSubmit = async (event) => {
    // prevent normal submit event
    event.preventDefault();
    // add item to Firebase
    let newItem = { text: itemText };
    const docRef = await addDoc(collection(db, "todos"), newItem);
    // get added doc id and set id to newItem
    newItem.id = docRef.id;
    // update states in App
    setItems([...items, newItem]);
    // modify newItem text to ""
    setItemText("");
  };

  const removeItem = (item) => {
    // delete from firebase
    deleteDoc(doc(db, "todos", item.id));
    // delete from items state and update state
    let filteredArray = items.filter(
      (collectionItem) => collectionItem.id !== item.id
    );
    setItems(filteredArray);
  };

  const [loading, setLoading] = useState(true);

  // load todo list items
  useEffect(() => {
    const fetchData = async () => {
      // connect todos collection
      const todosCol = collection(db, "todos");
      const todoSnapshot = await getDocs(todosCol);
      // todo text and id
      // document id is unique, can be used with deleting todo
      const todos = todoSnapshot.docs.map((doc) => {
        return {
          text: doc.data().text,
          id: doc.id,
        };
      });
      // states
      console.log(todos);
      setItems(todos);
      setLoading(false);
    };
    // loading data
    console.log("fetch data...");
    fetchData();
  }, []); 

  return (
    <div>
      <Navbar />
      <h1>Firebase Todo</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={itemText}
          onChange={(event) => setItemText(event.target.value)}
          placeholder="Write a new todo here"
        />
        <input type="submit" value="Add" />
      </form>
      <ul>
        {loading && <p>Loading...</p>}
        {items.map((item) => (
          <li key={item.id}>
            {item.text + " "} <span onClick={() => removeItem(item)}> x </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  const { currentUser } = useContext(AuthContext);

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/" />;
  };

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/todo"
            element={
              <RequireAuth>
                <ToDoFormAndList />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
