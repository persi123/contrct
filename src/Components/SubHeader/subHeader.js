import React from 'react';
import styled from 'styled-components';

export const SubHeader = () => {
    return <>
        <Section>
           <Heading>
           A5T-USDC LP STAKING
           </Heading>
        </Section>
    </>
}

const Section = styled.section`
width : min(85%,1320px);
height : 40px;
margin : 1rem auto 1rem;
display : flex;
justify-content : center;
align-items : center;
background : transparent;
`;
const Heading=styled.h3`
color:#00a1fd;
user-select: none;
font-weight:600;
`
