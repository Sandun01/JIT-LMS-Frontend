import React from "react";
import {NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="navBar">
        <div className="navBarTitle">LMS</div>
        <ul>
            <input type="checkbox" id="checkbox_toggle" />
            <label for="checkbox_toggle" className="toggleMenu">&#9776;</label>
            
            <div className="navBarMenu">
                <li>
                    <NavLink className="navLink" exact to="/">
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink className="navLink" to="/classrooms">
                        Classrooms
                    </NavLink>
                </li>
                <li>
                    <NavLink className="navLink" to="/students">
                        Students
                    </NavLink>
                </li>
                <li>
                    <NavLink className="navLink" to="/teachers">
                        Teachers
                    </NavLink>
                </li>
            </div>
        </ul>
    </nav>
  );
};

export default NavBar;
