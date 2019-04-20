import React, { useState, useEffect } from "react";
import Auth from "../functions/AuthService";
import Message from "./Message";

const Login = ({ history }) => {
  const [username, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // useEffect(() => {
  //   if (Auth.loggedIn()) {
  //     history.replace("/home");
  //   }
  // }, []);

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
    <section className="login-section">
      <div className="container">
        <form className="form u-raised" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form__label" htmlFor="username">
              Username
            </label>
            <input
              className="form__input form-control"
              placeholder="Username"
              type="text"
              name="username"
              required
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form__label" htmlFor="password">
              Password
            </label>
            <input
              className="form__input form-control"
              placeholder="Password"
              type="password"
              name="password"
              required
              onChange={handleChange}
            />
          </div>
          <button className="form__button btn btn-primary btn-lg" type="submit">
            Login
          </button>
          <Message message={message} />
        </form>
      </div>
    </section>
  );
};

export default Login;
