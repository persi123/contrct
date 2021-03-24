import React, { useState, useRef } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import utils from "../../utils";
import "./index.css";

const numberFixed = (n, fixed) =>
  ~~(Math.pow(10, fixed) * n) / Math.pow(10, fixed);

const AmountModal = ({
  poolNumber,
  showModal,
  hideModal,
  balance,
  getStakeDetail,
}) => {
  const [amount, setAmount] = useState(0);
  const [amountError, setamountError] = useState(false);
  const [insufficientFundError, setinsufficientFundError] = useState(false);

  const handleConfirm = (e) => {
    if (amount && amountError===false && insufficientFundError===false)
      getStakeDetail(poolNumber, amount);
    else if (!amount) setamountError(true);
  };

  const handleMaxAmount=()=>{
    setAmount(numberFixed(balance,2))
  }

  const handleInputAmount = (e) => {
    const net_balance=utils.numberWithCommas(parseFloat(balance).toFixed(3));
    setamountError(false);
    setinsufficientFundError(false);
    let val = parseFloat(e.target.value);
    if (!val) {
      setamountError(true);
      setinsufficientFundError(false);
    } else if (val >= net_balance) {
      setamountError(false);
      setinsufficientFundError(true);
    } else setAmount(val);
  };

  const getErrorMsg = () => {
    return amountError ? (
      "Amount Required !"
    ) : insufficientFundError ? (
      "Insufficient Funds !"
    ) : (
      <></>
    );
  };

  const handleClose=()=>{
    hideModal();
    setamountError(false);
    setAmount(0);
    setinsufficientFundError(false);
  }
  
  return showModal ? (
    <>
      <Modal
        show={showModal}
        onHide={hideModal}
        className="modal-wallet-transform"
      >
        <Modal.Body>
          <div class="amount-modal">
            <ModalHeading>A5T-USDC LP STAKING</ModalHeading>
            <AvailableBalance>
              Available Balance :
              <span className="text-white">
                {utils.numberWithCommas(parseFloat(balance).toFixed(3))}{" "}
                A5T-USDC
              </span>
            </AvailableBalance>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text">A5T-USDC</span>
              </div>
              <input
                value={amount}
                type="number"
                class="form-control"
                placeholder="Enter amount"
                onChange={(e) => handleInputAmount(e)}
              />
            </div>
            <MaxButton
              onClick={() =>handleMaxAmount()}
              className="resend-email-btn"
              style={{
                outline: "none",
              }}
            >
              <span>
                <b>MAX</b>
              </span>
            </MaxButton>
            <span className="text-danger">{getErrorMsg()}</span>
            <ButtonGroup>
              <Button   onClick={() => handleClose()}>
                Cancel
              </Button>
              <Button  onClick={() => handleConfirm()}>
                Confirm
              </Button>
            </ButtonGroup>
          </div>
        </Modal.Body>
      </Modal>
    </>
  ) : (
    <></>
  );
};

export default AmountModal;

const ModalHeading = styled.h2`
  color: #516b86;
  display: block;
  font-size: 24px;
  text-align: center;
  user-select: none;
`;
const AvailableBalance = styled.span`
  color: #516b86;
  display: block;
  font-size: 14px;
  padding: 2rem 1rem 0.5rem 0rem;
  user-select: none;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  background-color: #47a1fb;
  width: 30%;
  margin-top: 2rem;
  border-radius: 0;
  font-size: 16px;
  font-weight: 700;
  outline: none !important;
  font-style: italic;
  padding: 6px 0;
  border-radius: 2px;
  color: #fff;
  border:none;
`;

const MaxButton = styled.button`
  font-size: 14px;
  color: #47a1fb;
  border: none;
  background: none;
  display: flex;
  justify-content: flex-end;
  margin-top: -46px;
  z-index: 1;
  float: right;
  margin-right: 5px;
  cursor: pointer;
  position: sticky;
`;
