import React from 'react';
import {useLocation} from 'react-router-dom';
import './index.css';

export const Header = () => {

    const {pathname} = useLocation();
    
    const NavigateTo = (link, target = '_self') => {
        // window.location.href = link;
        window.open(link, target);
    }

    return <div style={{backgroundColor:"#181c1f"}}>
    
     <nav className="navbar navbar-expand-lg navbar-mainbg">
        <a className="navbar-brand navbar-logo" href="#">
        <img src="./Alpha5-logo.svg" alt="N/A" style={{
            width : "170px",
            height : "60px"
        }} />
        </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <i className="fas fa-bars text-white"></i>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav w-100">
                {/* <li className={`nav-item ${pathname === "/" ? "active" : ""}`}>
                    <a className="nav-link" href="/#/bitfex">BfxLev Home</a>
                </li> */}
                <li className="d-none d-lg-block nav-item staking-links">
                 <ul className="d-flex list-style-none justify-content-center">
                 <li className={`d-none d-lg-block ${pathname === "/#/" ? "active" : ""}`} onClick={() => NavigateTo('/#/bitfex/staking')}>
                    <a className="nav-link" href="/#/">A5T-USDC Staking</a>
                </li>
                <li className={`d-none d-lg-block ${pathname === "/uniswap" ? "active" : ""}`} onClick={() => NavigateTo('/#/bitfex/uniswap')}>
                    <a className="nav-link" href="/#/">Pool</a>
                </li>
                 </ul>    
                </li>
                <li className={`d-lg-none my-1 my-lg-0 nav-item ${pathname === "/" ? "active" : ""}`} onClick={() => NavigateTo('/#/bitfex/staking')}>
                    <a className="d-inline-block nav-link" href="/#/">A5T-USDC Staking</a>
                </li>
                <li className={`d-lg-none my-1 my-lg-0 nav-item ${pathname === "/" ? "active" : ""}`} onClick={() => NavigateTo('/#/bitfex/uniswap')}>
                    <a className="d-inline-block nav-link" href="/#/">Pool</a>
                </li>
                <li className={`nav-item my-1 my-lg-0 exchange ${pathname === "/admin" ? "active" : ""}`} onClick={() => NavigateTo('https://www.bitfex.com/trade/#/', '_blank')}>
                   <div>
                   <a className="nav-link" href="https://www.alpha5.io/#/" target="_blank">Exchange</a>
                   </div>
                </li>
            </ul>
        </div>
    </nav>
    
    </div> 
    
}


