import React, { Component } from "react";
import Auth from "../functions/AuthService";

class GooeyMenu extends Component {
  render() {
    return (
      <nav className="menu">
        <input type="checkbox" className="menu__checkbox" id="menu__checkbox" />
        <label className="menu__button" htmlFor="menu__checkbox">
          <span className="menu__icon" />
        </label>
        <a href="/home" className="menu__item">
          <i className="fas fa-home" />
        </a>
        <a href="/tempgraph" className="menu__item">
          <i className="far fa-chart-bar" />
        </a>
        <a href="/camera" className="menu__item">
          <i className="fas fa-video" />
        </a>
        <a href="/" onClick={() => Auth.logout()} className="menu__item">
          <i className="fas fa-sign-out-alt" />
        </a>
      </nav>
    );
  }
}

const SimpleNavBar = () => (
  <nav class="navbar fixed-top navbar-expand-lg navbar-light bg-secondary">
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon" />
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <a class="nav__link" href="/">
            Home
          </a>
        </li>
        <li class="nav-item">
          <a class="nav__link" href="/tempgraph">
            Graph
          </a>
        </li>
      </ul>
    </div>
  </nav>
);

export { GooeyMenu, SimpleNavBar as default };
