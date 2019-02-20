import React, { Component } from "react";

class GooeyMenu extends Component {
  render() {
    return (
      <nav className="menu">
        <input type="checkbox" className="menu__checkbox" id="menu__checkbox" />
        <label className="menu__button u-raised" htmlFor="menu__checkbox">
          <span className="menu__icon" />
        </label>
        <a href="/" className="menu__item">
          <i className="fas fa-home" />
        </a>
        <a href="/tempgraph" className="menu__item">
          <i className="far fa-chart-bar" />
        </a>
        <a href="#" className="menu__item">
          <i className="fas fa-video" />
        </a>
        <a href="#" className="menu__item">
          <i className="fa fa-envelope" />
        </a>
      </nav>
    );
  }
}

const SimpleNavBar = () => (
  <nav class="navbar u-raised fixed-top navbar-expand-lg navbar-light bg-secondary">
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
