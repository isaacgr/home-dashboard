import React from "react";

const NavBar = () => (
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

export default NavBar;
