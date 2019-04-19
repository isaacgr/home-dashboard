import React, { useState, useEffect } from "react";
import AuthService from "../routes/AuthService";
import Message from "./Message";

const Login = ({ history }) => {
  const [username, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  let Auth = new AuthService();

  useEffect(() => {
    if (Auth.loggedIn()) {
      history.replace("/home");
    }
  }, []);

  const handleChange = e => {
    const name = e.target.name;
    switch (name) {
      case "username":
        setUser(e.target.value);
        break;
      case "password":
        setPassword(e.target.value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    Auth.login(username, password)
      .then(response => {
        history.replace("/home");
      })
      .catch(error => {
        setMessage(error["message"]);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          placeholder="Username"
          type="text"
          name="username"
          onChange={handleChange}
        />
        <label htmlFor="password">Password</label>
        <input
          placeholder="Password"
          type="password"
          name="password"
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
        <Message message={message} />
      </form>
    </div>
  );
};

export default Login;
