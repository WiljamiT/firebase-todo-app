import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import './Navbar.css';

const Navbar = () => {
  const {dispatch} = useContext(AuthContext);

  const {currentUser} = useContext(AuthContext);
  currentUser === null ? console.log("No user") : console.log("User:", currentUser.email)

  return (
    <div className="nav">
      <p>{currentUser ? `Loggen in as ${currentUser.email}` : 'Not logged in'}</p>
      {currentUser ? <button onClick={ () => dispatch({type: "LOGOUT"})}>Logout</button> : null}
    </div>
  )
}

export default Navbar
