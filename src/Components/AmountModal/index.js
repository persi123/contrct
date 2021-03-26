import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import utils from "../../utils";
import "./index.css";

function toFixed(num, fixed) {
  var re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
  return  num.toString().match(re)[0];
}

const AmountModal = ({
  poolNumber,
  showModal,
  hideModal,
  balance,
  getStakeDetail,
}) => {
  const [amount, setAmount] = useState("");
  const [amountError, setamountError] = useState(false);
  const [insufficientFundError, setinsufficientFundError] = useState(false);

  useEffect(() => {
    setAmount("");
    return () => {
      setamountError(false);
      setinsufficientFundError(false);
      setAmount("");
    };
  }, []);

  const handleConfirm = (e) => {
    if (amount && amountError === false && insufficientFundError === false) {
      const amountToSend = toFixed(amount, 2);
      getStakeDetail(poolNumber, parseFloat(amountToSend));
    } else if (!amount) setamountError(true);
  };

  const handleMaxAmount = () => {
    setamountError(false);
    setinsufficientFundError(false);
    const netBalance = utils.numberWithCommas(parseFloat(balance).toFixed(3));
    setAmount(toFixed(netBalance, 2));
  };

  const handleInputAmount = (e) => {
    setamountError(false);
    setinsufficientFundError(false);
    let val = parseFloat(e.target.value);
    const netBalance = utils.numberWithCommas(parseFloat(balance).toFixed(3));

    if (!val) {
      setamountError(true);
      setinsufficientFundError(false);
      setAmount("");
    } else if (val >= netBalance) {
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

  const handleClose = () => {
    hideModal();
    setamountError(false);
    setAmount("");
    setinsufficientFundError(false);
  };

  return showModal ? (
    <>
      <Modal
        show={showModal}
        onHide={hideModal}
        className="modal-wallet-transform"
      >
        <Modal.Body>
          <div className="amount-modal">
            <ModalHeading>A5T-USDC LP STAKING</ModalHeading>
            <AvailableBalance>
              Available Balance :
              <span className="text-white">
               <b> {utils.numberWithCommas(parseFloat(balance).toFixed(3))}{" "}</b>
                A5T-USDC
              </span>
            </AvailableBalance>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text"> A5T-USDC</span>
              </div>
              <input
                value={amount}
                type="number"
                className="form-control"
                placeholder="Enter amount"
                onChange={(e) => handleInputAmount(e)}
              />
              <div className="input-group-prepend">
                <span className="max-btn" onClick={() => handleMaxAmount()}>
                  MAX
                </span>
              </div>
            </div>

            <span className="text-danger">{getErrorMsg()}</span>
            <ButtonGroup>
              <Button onClick={() => handleClose()}>Cancel</Button>
              <Button onClick={() => handleConfirm()}>Confirm</Button>
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

const ModalHeading = styled.span`
  color: #516b86;
  display: block;
  font-size: 24px;
  text-align: center;
  user-select: none;
  font-weight:700;
`;
const AvailableBalance = styled.span`
  color: #516b86;
  display: block;
  font-size: 16px;
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
  border: none;
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
