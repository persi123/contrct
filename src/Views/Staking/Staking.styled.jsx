import styled from "styled-components";

export const Card = styled.div`
  width: clamp(300px, 90%, 450px);
  // width : max(300px, 90%);

  @media (min-width: 992px) {
    width: 100%;
  }
  min-height: 100px;
  margin: 0.5rem auto;
  border-radius: 5px;
  // background : #373737;
  // background :  #1F1C1C;
  background: #05040440;
  padding: 1.5em;
  // box-shadow: 0 0px 1px 1px rgb(2 0 36);
  box-shadow: rgb(2 0 36) 0px 0px 19px 1px;
  user-select: none;
  media(max-width:800px){
    max-width:698px;
    overflow-x:scroll;
  }
`;
export const CardTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 500;
  font-family: Rubik-Medium, sans-serif;
  // color : #B9B9B9;
  color: #fff;
  letter-spacing: 1px;
  text-align: center;
  padding: 6px 0;
  @media (max-width: 600px) {
    font-size: 1rem;
  }
`;
export const CardSubTitle = styled.div`
  text-align: center;
  margin: 0.5em auto;
  font-size: 20px;
  font-weight: 600;
  width: 82%;
  text-transform:uppercase;
  color:#00a1fd;
  letter-spacing:1px;
  user-select: none;
`;
export const CardConnectButton = styled.div`
  margin: 0 auto;
  width: 97%;
  display: flex;
  justify-content: flex-end;
`;

export const ConnectButton = styled.button`
  width: 24%;
  border-radius: 3px;
  box-shadow: 0px 0px 0px 2px #00a1fd;
  color: #fff !important;
  font-weight: 600;
  letter-spacing: 1px;
  padding: 6px;
`;
export const CardContent = styled.div`
  // display: grid;
  // grid-template-columns: repeat(
  //   ${({ colNo }) => (colNo ? `${colNo}` : "1")},
  //   1fr
  // );
  // grid-template-rows: repeat(${({ rowNo }) => (rowNo ? `${rowNo}` : "1")}, 1fr);
  margin: 1em 0;
  disply:flex;
  flex-direction:column;
  ${({ styles }) => styles}
`;

export const CardFields = styled.div`
display : flex;
justify-content : space-between;
padding : 7px 10px;
box-sizing : border-box;
border-radius : 2px;
&:hover{
    box-shadow: 0 0 0px 2px #00a1fd;
    // box-shadow: 0 0 0px 2px #4180f3ed;
    cursor : pointer;
    border-radius : 2px;
}

}
`;
// background-color : #414141;

export const CardFieldName = styled.div`
  font-size: 14px;
  color: #fff;
`;

export const CardFieldValue = styled.div`
  font-size: 14px;
  font-weight: 500;
  // color : #D1D1D1;
  color: #00a1fd;
  // color : #4d6fe8;
  text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  @media(max-width:466px){
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;

export const ActionCard = styled.div`
  width: 95%;
  margin: 0.5rem auto;
  padding: 10px;
  border: 1px solid #454545;
  border-radius: 6px;
  box-sizing: border-box;
  // box-shadow: 0px 3px 3px 1px #000000;
  // background : #414141;
  background-color: #1f1e1e;
`;

export const ActionFlex = styled.div`
  width: 98%;
  display: flex;
  justify-content: space-between;
  margin: 5px auto;
`;

export const ActionInputFlex = styled(ActionFlex)`
  background-color: #1f1b1b91;
  border-radius: 4px;
  box-shadow: 0 0 0px 2px #909090;
  padding: 0 4px;
`;

export const ActionText = styled.div`
  font-size: ${({ fontSize }) => (fontSize ? `${fontSize}` : "1rem")};
  font-weight: ${({ fontWeight }) => (fontWeight ? `${fontWeight}` : "400")};
  color: ${({ fontColor }) => (fontColor ? `${fontColor}` : "#B9B9B9")};
  letter-spacing: ${({ letterSpacing }) =>
    letterSpacing ? `${letterSpacing}` : "0.1em"};
  ${({ styles }) => (styles ? styles : "")}
`;

export const ActionInput = styled.input`
  display: block;
  width: 65%;
  background-color: transparent;
  font-size: ${({ fontSize }) => (fontSize ? `${fontSize}` : "1rem")};
  font-weight: ${({ fontWeight }) => (fontWeight ? `${fontWeight}` : "400")};
  color: ${({ fontColor }) => (fontColor ? `${fontColor}` : "#B9B9B9")};
  letter-spacing: ${({ letterSpacing }) =>
    letterSpacing ? `${letterSpacing}` : "0.1em"};
  ${({ styles }) => (styles ? styles : "")}
  border : 1px solid transparent;
  border-radius: 4px;
  &:focus {
    outline: none;
  }
  // &:hover{
  //     background-color : #5D5D5D;
  // }
  // background-color : #5D5D5D;
`;

export const ActionWrapper = styled.div`
  margin: 8px 0;
  display: flex;
`;
export const ActionLabel = styled.div`
  display: inline-block;
  margin-right: 10px;
  font-size: 0.8em;
  font-weight: 600;
  border: 1px solid #b9b9b9;
  border-radius: 3px;
  padding: 1px 8px;
  cursor: pointer;
  &:hover {
    color: #fff;
  }
  &:active {
    opacity: 0.5;
  }
`;
export const ActionButton = styled.div`
  width: 98%;
  margin: 0.5rem auto;
  padding: 8px;
  // border : 1px solid #8B8B8B;
  border-radius: 5px;
  text-align: center;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.1em;
  cursor: pointer;
  user-select: none;
  //  color  : #747474;
  color: #d1d1d1;
  // background-color : #333333;
  box-shadow: 0px 0px 0px 2px
    ${({ border }) => (border === "red" ? "rgb(236 69 69 / 98%)" : "#00D395")};
  &:hover {
    font-weight: 600;
    color: #fff;
    //  border-width : 0px;
    box-shadow: 0 0px 0px 2px
      ${({ border }) => (border === "red" ? "rgb(236 69 69 / 98%)" : "#00D395")};
    // border-color : ${({ border }) =>
      border === "red" ? "#dc3545" : "#32c24d"};
    // border-color : transparent;
    // #FF4646
    background-color: ${({ border }) =>
      border === "red" ? "#ec0101" : "#00a1fd"};
  }
  &:active {
    opacity: 0.5;
  }
`;

// border-color : #A2A2A2;

export const CardButton = styled.div`
  position: relative;
  overflow: hidden;
  transition: background 400ms;
  width: 95%;
  margin: 0.5rem 5px 2rem;
  padding: 8px 0;
  // border : 1px solid #8B8B8B;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  letter-spacing: 0.1em;
  cursor: pointer;
  user-select: none;
  box-shadow: 0 0px 0px 2px #00d395;
  // box-shadow: 0 0px 0px 2px #4180f3ed;
  // color  : #747474;
  // background-color : #333333;
  color: #d1d1d1;
  &:hover {
    color: #fff;
    border-color: transparent;
    background-color: #00a1fd;
    font-weight: 600;
    box-shadow: 0 0px 0px 3px #00d395;
    //  background-color : #0e49b5;
    //  box-shadow: 0 0px 0px 3px #4180f3ed;
  }
  &:active {
    opacity: 0.5;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  width: ${({ width = "95%" }) => width};
  margin: 1rem auto;
  padding: 0 10px;
`;

export const StakeButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  width: ${({ width = "95%" }) => width};
  margin: 1rem auto;
  padding: 0 10px;
`;

export const Button = styled.div`
  // border : 1px solid #aaaaaa;
  // box-shadow: 0 0px 0px 2px ${({ border }) =>
    border === "red" ? "#f56f6f" : "#056674"};
  // box-shadow: 0 0px 0px 2px ${({ border }) =>
    border === "red" ? "#f56f6f" : "#056674"};
  box-shadow: 0px 0px 0px 2px
    ${({ border }) => (border === "red" ? "#f56f6f" : "#00a1fd")};

  border-radius: 5px;
  padding: 10px 10px;
  font-size: 14px;
  font-weight: 600;
  min-width: 26%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
  opacity: 1;
  color: #e8e8e8;
  &:hover {
    font-size: 14px;
    font-weight: 600;
    color:white;
    // color : #E8E8E8;
    // border-color : ${({ border }) =>
      border === "red" ? "#f56f6f" : "#32c24d"};
    // border-color : transparent;
    // box-shadow: 0 0px 0px 2px ${({ border }) =>
      border === "red" ? "#f56f6f" : "#16e2ff9c"};
    box-shadow: 0px 0px 0px 2px
      ${({ border }) => (border === "red" ? "#f56f6f" : "#00a1fd")};
    // background-color : ${({ border }) =>
      border === "red" ? "#8c0202" : "#056674"};
    // background-color : ${({ border }) =>
      border === "red" ? "#c70039" : "#056674"};
    background-color: ${({ border }) =>
      border === "red" ? "#ec0101" : "#00a1fd"};
  }
  &:active {
    opacity: 0.5;
  }
`;

export const NoDataFound=styled.span`
color:#fff;
font-size:16px;
font-weight:600;
`

export const NoDataParentDiv=styled.div`
width:100%;
text-align:center;
`
export const StakingTableLayout = styled.div`
  width: 100%;
  min-width: 280px;
  box-shadow: #020024 0px 0px 3px 0px;
  border-radius: 10px;
`;
// border-color : #A2A2A2;
