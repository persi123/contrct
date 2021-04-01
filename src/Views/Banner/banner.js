import React from 'react';
import styled from "styled-components";

export default function banner() {
    return (
        <Main>
            <div><p><span>POOL 1 Total Reward:  50,000 A5T</span><br/>(If &gt; 1,000,000 A5T staked, then 100,000 A5T total reward) </p></div>
            <div><p><span>POOL 2 Total Reward: 500,000 A5T</span><br/>(If &gt; 2,000,000 A5T staked, then 900,000 A5T total reward)</p></div>
        </Main>
    )
}


const Main=styled.div`
color : white;
display:flex;
justify-content:space-around;
background: rgb(0,161,251);
background: linear-gradient(90deg, rgba(0,161,251,1) 32%, rgba(236,88,94,1) 73%);
padding: 10px 63px;
font-family:CODEC PRO Light;
font-weight:bold;
font-size:18px;
margin-top:65px;
span{
font-size:30px;
font-weight:bolder;
}
@media(max-width:1114px){
    font-size:18px;
    padding: 10px 16px;
    span{
        font-size:20px;
        }
}
@media(max-width:500px){
    font-size:10px;
    
    padding: 3px 9px;

    span{
        font-size:12px;
        }
}
`;