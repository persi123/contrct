import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import logo from "../../assets/A5tDark.png";
import "./Index.scss";
import styled from "styled-components";

export const Header = ({ handlePoolMove }) => {
  const { pathname } = useLocation();
  // const [navaction, setNavaction] = useState(false);
  // const toggleNav = () => {
  //   setNavaction(!navaction);
  // };
  const NavigateTo = (link, target = "_self") => {
    // window.location.href = link;
    window.open(link, target);
  };

  return (
    <Container>
      <nav className="navbar navbar-expand-lg navbar-mainbg">
        <div className="navbar-brand navbar-logo" href="#">
          <img
            src={logo}
            style={{
              width: "139px",
              height: "42px",
            }}
          />
          {/* A<span>5</span>T */}
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          // onClick={toggleNav}
        >
          <i className="fas fa-bars text-white"></i>
        </button>
        <div
          className="collapse navbar-collapse" 
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav w-100">
            {/* <li className={`nav-item ${pathname === "/" ? "active" : ""}`}>
                    <a className="nav-link" href="/#/bitfex">BfxLev Home</a>
                </li> */}
            <li className="d-none d-lg-block nav-item staking-links">
              <ul className="d-flex list-style-none justify-content-center">
                <li
                  className={`d-none d-lg-block ${
                    pathname === "/#/" ? "active" : ""
                  }`}
                >
                  <span className="nav-link" style={{cursor:"pointer"}}>
                    A5T-USDC Staking
                  </span>
                </li>
                <li
                  className={`d-none d-lg-block ${
                    pathname === "/uniswap" ? "active" : ""
                  }`}
                >
                  <span className="nav-link" onClick={handlePoolMove} style={{cursor:"pointer"}}>
                    Pools
                  </span>
                </li>
              </ul>
            </li>
            <li
              className={`d-lg-none my-1 my-lg-0 nav-item ${
                pathname === "/" ? "active" : ""
              }`}
            >
              <span className="d-inline-block nav-link">
                A5T-USDC Staking
              </span>
            </li>
            <li
              className={`d-lg-none my-1 my-lg-0 nav-item ${
                pathname === "/" ? "active" : ""
              }`}
            >
              <span
                className="d-inline-block nav-link"
                onClick={handlePoolMove}
              >
                Pool
              </span>
            </li>
            {/* <li className={`nav-item my-1 my-lg-0 exchange ${pathname === "/admin" ? "active" : ""}`} onClick={() => NavigateTo('https://www.alpha5.io/#/', '_blank')}>
                   <div>
                   <a className="nav-link" href="https://www.alpha5.io/#/" target="_blank">Exchange</a>
                   </div>
                </li> */}
          </ul>
        </div>
      </nav>
    </Container>
  );
};

const Container=styled.div`
background-color: #181c1f;
position:fixed;
width:100%;
top:0;
z-index:10;
`
