import React from 'react';
import styled from 'styled-components';

export const TextHeader = ({title}) => {
    console.log()
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
margin:5px 0px 5px 4.3rem;
display : flex;
justify-content : flex-start;
align-items : center;
background : transparent;
@media(max-width:400px){
width: min(81%,1320px);

}
`;
const Heading=styled.h3`
color:#00a1fd;
user-select: none;
font-weight:600;
font-size:1.0rem;
`
