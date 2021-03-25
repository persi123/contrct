import React from 'react';
import styled from 'styled-components';

export const SubHeader = ({title}) => {
    return <>
        <Section>
           <Heading>
           {title}
           </Heading>
        </Section>
    </>
}

const Section = styled.section`
width : min(85%,1320px);
height : 40px;
margin : 0.5rem auto 0.2rem;
display : flex;
justify-content : center;
align-items : center;
background : transparent;
`;
const Heading=styled.h3`
color:#00a1fd;
user-select: none;
font-weight:600;
letter-spacing:1px;
font-size:1.0rem;
`
