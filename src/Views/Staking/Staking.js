import React, { useState, useEffect, useContext, useRef } from "react";
import useForceUpdate from "use-force-update";
import NumberFormat from "react-number-format";
import {
  CardSubTitle,
  CardContent,
  CardFields,
  CardFieldName,
  CardFieldValue,
  ButtonGroup,
  Button,
  NoDataFound,
  NoDataParentDiv,
  StakingTableLayout,
  StakeButtonGroup,
  InformationText
} from "./Staking.styled";
import { AlertContext } from "../../Components/Alert/alert";
import SweetAlert from "react-bootstrap-sweetalert";
import utils from "../../utils";
import eth from "../../utils/eth";
import Staking from "../../utils/Staking";
import ERC20 from "../../utils/ERC20";
import contracts from "../../utils/contracts";
import { SubHeader } from "../../Components/SubHeader/subHeader";
import { TextHeader } from "../../Components/SubHeader/TextHeader";
import { Header } from "../../Components/Header/Index";
import AmountModal from "../../Components/AmountModal";
import "./Staking.scss";
import Banner from "../Banner/banner";

const A5TStaking = () => {
  const forceUpdate = useForceUpdate();
  const { onAlert } = useContext(AlertContext);
  const [loaded, setloaded] = useState(false);
  const [approving, setapproving] = useState(false);
  const [intervalHandle, setintervalHandle] = useState(null);
  const [poolbundle, setpoolbundle] = useState([]);
  const [address, setaddress] = useState("");
  const [balance, setbalance] = useState(0);
  const [USDC_balance, setUSDC_balance] = useState("");
  const [A5T_balance, setA5T_balance] = useState("");
  const [A5T_USDC_balance, setA5T_USDC_balance] = useState("");
  const [start_date, setstart_date] = useState(0);
  const [end_date, setend_date] = useState(0);
  const [pool_count, setpool_count] = useState(0);
  const [approved, setapproved] = useState(null);
  const [history, sethistory] = useState([]);
  const [popup, setpopup] = useState(null);
  const [showModal, setshowModal] = useState(false);
  const [selectedPool, setselectedPool] = useState("");
  const moveToPool = useRef(null);

  useEffect(() => {
    connect();
    tick();
    // setTimeout(() => {
    //   tick();
    // }, 3000);

    var intervalId = setInterval(tick, 3000);
    setintervalHandle(intervalId)
     return ()=>{
        clearInterval(intervalHandle);
     }
  }, []);

  const handlePoolMove = (event) => {
    window.scrollTo({
      top: 1800,
      behavior: "smooth",
    });
  };
  const handleStakeAmount = (pool_number, value) => {
    setshowModal(false);
    onStake(pool_number, value);
  };
  const AlertFn = [
    {
      info: () =>
        onAlert({
          type: "INFO",
          title: "Pending",
          message: "Waiting for transaction confirmation",
        }),
    },
    {
      success: () =>
        onAlert({
          type: "SUCCESS",
          title: "Successful",
          message: "Transaction Succeeded",
        }),
    },
    {
      error: () =>
        onAlert({
          type: "ERROR",
          title: "Failure",
          message: "Transaction unable to proceed",
        }),
    },
    {
      warn: () =>
        onAlert({
          type: "WARN",
          title: "Alert",
          message: "Something went wrong",
        }),
    },
    {
      default: (msg) =>
        onAlert({
          type: "WARN",
          title: "Failed",
          message:  msg,
        }),
    },
  ];

  const connect = async () => {
    setloaded(false);
    let res = await eth.connect();
    if (res) {
      setaddress(eth.address);
      setUSDC_balance(eth.USDC_balance);
      setA5T_balance(eth.A5T_balance);
      setA5T_USDC_balance(eth.A5T_USDC_balance);
      
      onAlert({
        type: "INFO",
        title: "Online",
        message: "Connected to ETH network. Loading data...",
      });
      localStorage.setItem("eth_connect", true);
    } else {
      onAlert({
        type: "Warn",
        title: "Offline",
        message: "Please connect to ETH network",
      });
    }
  };

  const tick = async () => {
    if (eth.connected && !loaded) {
      setloaded(true);
      let pool_count = await Staking.pool_count();
      setstart_date(await Staking.window_start_date());
      setend_date(await Staking.window_end_date());
      setpool_count(pool_count);

      var pools = [];
      for (var i = 1; i <= pool_count; i++) {
        let pool = await Staking.pools(i);
        if (pool != null && !eth.isInfura) {
          pool["stakeAmount"] = await Staking.getPool_stakeAmount(
            i,
            eth.address
          );
          pool["isClaimed"] = await Staking.getPool_isClaimed(i, eth.address);
        }
        pools.push(pool);
      }

      let approved = false;
      if (!eth.isInfura) {
        let allowance = await ERC20.allowance(
          eth.A5T_USDC,
          eth.address,
          contracts.Staking_Address
        );
        approved = allowance < 1e25 ? false : true;
      }
      setpoolbundle(pools);
      setapproved(approved);

      getHistory();
    } else if (!eth.connected && !loaded) {
      await connect();
    }
  };

  const approve = async () => {
    if (!eth.A5T_USDC) {
      return;
    }
    if (approving) return;
    setapproving(true);

    await eth.A5T_USDC.methods
      .approve(
        contracts.Staking_Address,
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      )
      .send({
        from: eth.address,
      })
      .on("transactionHash", function (hash) {
        AlertFn[0].info();
      })

      .on("receipt", async function (receipt) {
        if (receipt.status) {
          AlertFn[1].success();
        } else {
          AlertFn[2].error();
        }
      })
      .on("error", function (receipt) {
        AlertFn[3].warn();
      });
    let allowance = await ERC20.allowance(
      eth.A5T_USDC,
      eth.address,
      contracts.Staking_Address
    );
    let approved = allowance < 1e25 ? false : true;
    setapproved(approved);
  };

  //stake function
  const stake = (pool_number) => {
    if (end_date == 0 || start_date == 0) {
      AlertFn[4].default("Pool Start and End Date not set yet");
      //salert("Pool Start End Date not set");
      return;
    } else {
      var timeStamp = parseInt(new Date().getTime() / 1000);
      if (timeStamp < start_date ){
        AlertFn[4].default("Not time to stake yet");
        //salert("Pool Start End Date not set");
        return;
      }
      if (timeStamp > end_date ){
        AlertFn[4].default("Not time to stake");
        //salert("Pool Start End Date not set");
        return;
      }
      setselectedPool(pool_number);
      setshowModal(true);
    }

    // setpopup(
    //   <SweetAlert
    //     style={{ color: "black" }}
    //     input
    //     showCancel
    //     title="Enter amount of A5T-USDC pair token to stake"
    //     inputType="number"
    //     onConfirm={(response) => onStake(pool_number, response)}
    //     onCancel={hideModal}
    //   />
    // );
  };

  const onStake = async (pool_number, amount) => {
    hideModal();
    if (parseFloat(A5T_USDC_balance) < parseFloat(amount)) {
      AlertFn[4].default("Dont have enough A5T-USDC pair token to stake");
      return;
    }

    await eth.StakingContract.methods
      .stake(
        pool_number,
        window.web3.utils.toBN(
          Math.floor(amount * 1e18).toLocaleString("fullwide", {
            useGrouping: false,
          })
        )
      )
      .send({
        from: eth.address,
      })
      .on("transactionHash", function (hash) {
        AlertFn[0].info();
      })
      .on("receipt", async function (receipt) {
        if (receipt.status) {
          AlertFn[1].success();
        } else {
          AlertFn[2].error();
        }
      })
      .on("error", function (receipt) {
        AlertFn[3].warn();
      });
  };

  const unstake = async (pool_number) => {
    await eth.StakingContract.methods
      .unstake(pool_number)
      .send({
        from: eth.address,
      })
      .on("transactionHash", function (hash) {
        AlertFn[0].info();
      })
      .on("receipt", async function (receipt) {
        if (receipt.status) {
          AlertFn[1].success();
        } else {
          AlertFn[2].error();
        }
      })
      .on("error", function (receipt) {
        AlertFn[3].warn();
      });
    connect();
  };

  const claim = async (pool_number) => {
    await eth.StakingContract.methods
      .claimAndUnstake(pool_number)
      .send({
        from: eth.address,
      })
      .on("transactionHash", function (hash) {
        AlertFn[0].info();
      })
      .on("receipt", async function (receipt) {
        if (receipt.status) {
          AlertFn[1].success();
        } else {
          AlertFn[2].error();
        }
      })
      .on("error", function (receipt) {
        AlertFn[3].warn();
      });
    connect();
  };

  const hideModal = () => {
    setpopup(null);
    setshowModal(false);
  };

  const isPoolComplete = (duration) => {
    var timeStamp = parseInt(new Date().getTime() / 1000);
    if (
      parseInt(end_date) + parseInt(duration) < timeStamp &&
      parseInt(end_date) > 0
    ) {
      return true;
    }
    return false;
  };

  const getHistory = async () => {
    var array = [];
    var events = await eth.StakingContract.getPastEvents(
      "allEvents",
      { filter: {}, fromBlock: 0, toBlock: "latest" },
      function (error, log) {
        array = log;
      }
    );
    array.sort(function (a, b) {
      return b.blockNumber - a.blockNumber;
    });
    //console.log(array);
    sethistory(array);
  };

  const openLink = (addr) => {
    window.open(addr, "_blank");
  };
  //console.log("history",history)
  return (
    <div style={{position:"relative"}}>
      {/* {popup} */}
      <AmountModal />
      <Header handlePoolMove={handlePoolMove}  />
      <Banner/>
      <SubHeader title={"A5T-USDC LP STAKING"} />
      <div className="staking-container">
        <div className="staking-section-1">
          <div className="card text-white mx-auto">
            <div className="card-body">
              <CardSubTitle className="staking-sub-title">
                <span className="badge badge-pill badge-primary py-2 px-3">
                  Staking Details
                </span>
              </CardSubTitle>
              <CardContent
                rowNo={4}
                colNo={1}
                style={{ padding: "1.8rem 0px" }}
              >
                <CardFields>
                  <CardFieldName>Staking Contract</CardFieldName>
                  <CardFieldValue  onClick={() =>{window.open(`https://etherscan.io/address/${contracts.Staking_Address}`, '_blank')}} >{contracts.Staking_Address}</CardFieldValue>
                </CardFields>
                <CardFields>
                  <CardFieldName>Staking Contract Balance</CardFieldName>
                  <CardFieldValue>
                    {utils.numberWithCommas(
                      parseFloat(eth?.Staking_Balance).toFixed(3)
                    )}{" "}
                    A5T
                  </CardFieldValue>
                </CardFields>
                <CardFields>
                  <CardFieldName>Staking Start Date</CardFieldName>
                  <CardFieldValue>
                    {" "}
                    {start_date == 0
                      ? "Not Set"
                      : utils.convertTimeStamp(start_date * 1000)}
                  </CardFieldValue>
                </CardFields>
                <CardFields>
                  <CardFieldName>
                    Staking End Date (Pool Start Date)
                  </CardFieldName>
                  <CardFieldValue>
                    {end_date == 0
                      ? "Not Set"
                      : utils.convertTimeStamp(end_date * 1000)}
                  </CardFieldValue>
                </CardFields>
                <CardFields>
                  <CardFieldName>Total Pools</CardFieldName>
                  <CardFieldValue>{pool_count}</CardFieldValue>
                </CardFields>
              </CardContent>

              {/* <a href="#" className="card-link">Card link</a>
    <a href="#" className="card-link">Another link</a> */}
            </div>
          </div>
        </div>

        <div className="staking-section-1">
          <div className="card text-white mx-auto">
            <div className="card-body">
              <ButtonGroup width="100%">
                <Button border="blue" onClick={() => connect()}>
                  Connect
                </Button>
                <Button border="blue" onClick={() => window.location.reload()}>
                  Refresh
                </Button>
              </ButtonGroup>
              {/* <CardConnectButton>
                <ConnectButton onClick={() => connect()}>Connect</ConnectButton>
              </CardConnectButton> */}
              <CardContent rowNo={4} colNo={1}>
                <CardFields>
                  <CardFieldName>Your address</CardFieldName>
                  <CardFieldValue>
                    {eth.address != ""
                      ? eth.address
                      : "Please use Metamask/TrustWallet"}
                  </CardFieldValue>
                </CardFields>
                <CardFields>
                  <CardFieldName>ETH Balance</CardFieldName>
                  <CardFieldValue>
                    {" "}
                    {utils.numberWithCommas(
                      parseFloat(eth?.balance).toFixed(3)
                    )}{" "}
                    ETH
                  </CardFieldValue>
                </CardFields>
                <CardFields>
                  <CardFieldName>USDC Balance</CardFieldName>
                  <CardFieldValue>
                    {utils.numberWithCommas(
                      parseFloat(eth?.USDC_balance).toFixed(3)
                    )}{" "}
                    USDC
                  </CardFieldValue>
                </CardFields>
                <CardFields>
                  <CardFieldName>A5T Balance</CardFieldName>
                  <CardFieldValue>
                    {utils.numberWithCommas(
                      parseFloat(eth?.A5T_balance).toFixed(3)
                    )}{" "}
                    A5T
                  </CardFieldValue>
                </CardFields>
                <CardFields>
                  <CardFieldName>A5T-USDC Pair Balance</CardFieldName>
                  <CardFieldValue>
                    <b>
                      {utils.numberWithCommas(
                        parseFloat(eth?.A5T_USDC_balance).toFixed(3)
                      )}{" "}
                    </b>
                    A5T-USDC Pair Token
                  </CardFieldValue>
                </CardFields>
              </CardContent>
              <ButtonGroup width="100%">
                <Button
                  border="blue"
                  onClick={() =>
                    openLink(
                      "https://app.uniswap.org/#/add/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/0xe8272210954eA85DE6D2Ae739806Ab593B5d9c51"
                    )
                  }
                >
                  Add Liquidity
                </Button>
                <Button
                  border="red"
                  onClick={() =>
                    openLink(
                      "https://app.uniswap.org/#/remove/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/0xe8272210954eA85DE6D2Ae739806Ab593B5d9c51"
                    )
                  }
                >
                  Remove Liquidity
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      </div>
      <SubHeader title={"POOLS DETAILS"} />
      <div
        className="staking-container"
        ref={moveToPool}
        style={{ marginTop: "5px" }}
      >
        <div className="staking-section-1">
          <div className="card text-white mx-auto">
            <div className="card-body">
              <CardSubTitle className="staking-sub-title">
                <span className="badge badge-pill badge-primary py-2 px-3">
                  Pool 1
                </span>
              </CardSubTitle>
              <CardContent rowNo={4} colNo={1}>
                <CardFields>
                  <CardFieldName>Pool Start Date</CardFieldName>
                  <CardFieldValue>
                    {poolbundle.length > 0 ? (
                      <>
                        {end_date == 0
                          ? "Not Set"
                          : utils.convertTimeStamp(end_date * 1000)}
                      </>
                    ) : (
                      "-"
                    )}
                  </CardFieldValue>
                </CardFields>

                <CardFields>
                  <CardFieldName>Pool Duration</CardFieldName>
                  <CardFieldValue>
                    {poolbundle.length > 0 ? (
                      <>{utils.convertDuration(poolbundle[0].pool_Duration)}</>
                    ) : (
                      "-"
                    )}
                  </CardFieldValue>
                </CardFields>

                <CardFields>
                  <CardFieldName>Total Reward</CardFieldName>
                  <CardFieldValue>
                  {poolbundle.length > 0 ? (
                      <> {utils.numberWithCommas(
                        Math.round(poolbundle[0].total_A5T_Reward / 1e18)
                      )} A5T{" "}</>
                    ) : (
                      "-"
                    )}
                   
                  </CardFieldValue>
                </CardFields>
                <CardFields>
                  <CardFieldName>Total Staked</CardFieldName>
                  <CardFieldValue>
                  {poolbundle.length > 0 ? (
                      <> {utils.numberWithCommas(
                        parseFloat(poolbundle[0].TVL / 1e18).toFixed(3)
                      )} A5T-USDC Pair Token{" "}</>
                    ) : (
                      "-"
                    )}
                    
                    
                  </CardFieldValue>
                </CardFields>
                <CardFields>
                  <CardFieldName>Your Staked</CardFieldName>
                  <CardFieldValue>
                  {poolbundle.length > 0 ? (
                      <> {!eth.isInfura
                        ? utils.numberWithCommas(
                            parseFloat(poolbundle[0].stakeAmount).toFixed(3)
                          )
                        : 0} A5T-USDC Pair Token {" "}</>
                    ) : (
                      "-"
                    )}
                    
                    
                   
                  </CardFieldValue>
                </CardFields>
                <CardFields>
                  <CardFieldName>
                    Your Reward at the end of the Pool
                  </CardFieldName>
                  <CardFieldValue>
                  {poolbundle.length > 0 ? (
                      <> 
                      {poolbundle[0]?.TVL == 0
                      ? 0
                      : utils.numberWithCommas(
                          parseFloat(
                            (poolbundle[0]?.stakeAmount /
                              (poolbundle[0]?.TVL / 1e18)) *
                              (poolbundle[0]?.total_A5T_Reward / 1e18)
                          ).toFixed(3)
                        )}{" "}
                    A5T
                      </>   ) : (
                        "-"
                      )}
                    
                  </CardFieldValue>
                </CardFields>
              </CardContent>
              <StakeButtonGroup width="100%">
                {poolbundle.length > 0 && !eth.isInfura ? (
                  isPoolComplete(poolbundle[0].pool_Duration) ? (
                    <>
                      {!poolbundle[0].isClaimed && poolbundle[0].stakeAmount >0 ? (
                        <Button border="blue" onClick={() => claim(1)}>
                          Unstake and Claim Reward
                        </Button>
                      ) : (
                        poolbundle[0].stakeAmount >0 ?
                          <InformationText>
                             Claimed
                         </InformationText>
                         : null
                      )}
                    </>
                  ) : (
                    <>
                      {approved != null ? (
                        !approved ? (
                         
                          <Button border="blue" onClick={() => approve()}>
                            Approve
                          </Button>
                        ) : (
                          <Button border="blue" onClick={() => stake(1)}>
                            Stake
                          </Button>
                        )
                      ) : null}
                    </>
                  )
                ) : null}
              </StakeButtonGroup>
            </div>
          </div>
        </div>

        
          <div className="staking-section-1">
            <div className="card text-white mx-auto">
              <div className="card-body">
                <CardSubTitle className="staking-sub-title">
                  <span className="badge badge-pill badge-primary py-2 px-3">
                    Pool 2
                  </span>
                </CardSubTitle>
                <CardContent rowNo={4} colNo={1}>
                  <CardFields>
                    <CardFieldName>Pool Start Date</CardFieldName>
                    <CardFieldValue>
                    {poolbundle.length > 0 ? (
                      <>
                      {end_date == 0
                        ? "Not Set"
                        : utils.convertTimeStamp(end_date * 1000)}
                      </>
                    ) : (
                      "-"
                    )}
                      
                    </CardFieldValue>
                  </CardFields>

                  <CardFields>
                    <CardFieldName>Pool Duration</CardFieldName>
                    <CardFieldValue>
                    {poolbundle.length > 0 ? (
                      <>
                       {utils.convertDuration(poolbundle[1].pool_Duration)}
                      </>
                    ) : (
                      "-"
                    )}
                     
                    </CardFieldValue>
                  </CardFields>

                  <CardFields>
                    <CardFieldName>Total Reward</CardFieldName>
                    <CardFieldValue>
                    {poolbundle.length > 0 ? (
                      <>
                       {utils.numberWithCommas(
                        Math.round(poolbundle[1].total_A5T_Reward / 1e18)
                      )} A5T{" "}
                      </>
                    ) : (
                      "-"
                    )}
                     
                      
                    </CardFieldValue>
                  </CardFields>
                  <CardFields>
                    <CardFieldName>Total Staked</CardFieldName>
                    <CardFieldValue>
                    {poolbundle.length > 0 ? (
                      <>
                        {utils.numberWithCommas(
                        parseFloat(poolbundle[1].TVL / 1e18).toFixed(3)
                      )}  A5T-USDC Pair Token{" "}
                      </>
                    ) : (
                      "-"
                    )}
                     
                    
                    </CardFieldValue>
                  </CardFields>
                  <CardFields>
                    <CardFieldName>Your Staked</CardFieldName>
                    <CardFieldValue>
                    {poolbundle.length > 0 ? (
                      <>
                        {!eth.isInfura
                        ? utils.numberWithCommas(
                            parseFloat(poolbundle[1].stakeAmount).toFixed(3)
                          )
                        : 0} A5T-USDC Pair Token{" "}
                      </>
                    ) : (
                      "-"
                    )}
                     
                     
                    </CardFieldValue>
                  </CardFields>
                  <CardFields>
                    <CardFieldName>
                      Your Reward at the end of the Pool
                    </CardFieldName>
                    <CardFieldValue>
                      
                      {poolbundle.length > 0 ? (
                      <> 
                      {poolbundle[1]?.TVL == 0
                        ? 0
                        : utils.numberWithCommas(
                            parseFloat(
                              (poolbundle[1]?.stakeAmount /
                                (poolbundle[1]?.TVL / 1e18)) *
                                (poolbundle[1]?.total_A5T_Reward / 1e18)
                            ).toFixed(3)
                        )}{" "}
                    A5T
                      </>   ) : (
                        "-"
                      )}
                    </CardFieldValue>
                  </CardFields>
                </CardContent>
                <StakeButtonGroup width="100%">
                  {poolbundle.length > 0 && !eth.isInfura ? (
                    isPoolComplete(poolbundle[1].pool_Duration) ? (
                      <>
                        {!poolbundle[1].isClaimed && poolbundle[1].stakeAmount >0 ? (
                          <Button border="blue" onClick={() => claim(2)}>
                            Unstake and Claim Reward
                          </Button>
                        ) : (
                        poolbundle[1].stakeAmount >0 ?
                          <InformationText>
                             Claimed
                         </InformationText>
                         : null
                        )}
                      </>
                    ) : (
                      <>
                        {approved != null ? (
                          !approved ? (
                            <Button border="blue" onClick={() => approve()}>
                              Approve
                            </Button>
                          ) : (
                            <Button
                              border="blue"
                              onClick={() => stake(2)}
                              className="align-middle"
                            >
                              Stake
                            </Button>
                          )
                        ) : null}
                      </>
                    )
                  ) : null}
                </StakeButtonGroup>
              </div>
            </div>
          </div>
     
      </div>

      <div
        className="staking-container-2 mt-3"
        style={{ marginBottom: "1rem" }}
      >
        <div className="staking-section-3 ">
          {/* <TextHeader title={"Transaction History"} /> */}
          <SubHeader title={"POOLS TRANSACTION HISTORY"} />
          <StakingTableLayout>
            <table className="new-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Staker</th>
                  <th>Amount</th>
                  <th>Pool Number</th>
                  <th>Transaction</th>
                </tr>
              </thead>
              <tbody>
                {history.length > 0 &&
                  history.map((value) => {
                    return (
                      <>
                        {value.event == "rewardEvent" && (
                          <tr>
                            <td>{value.event}</td>
                            <td>
                              <a
                                // style={{ color: "#47a1fb" }}
                                href={`https://etherscan.io/address/${value.returnValues.staker}`}
                                target="_blank"
                              >
                                {utils.truncateStr(
                                  value.returnValues.staker,
                                  8
                                )}
                              </a>
                            </td>
                            <td>
                              {parseFloat(
                                value.returnValues.reward_amount / 1e18
                              ).toFixed(3)}{" "}
                              A5T{" "}
                            </td>
                            <td>{value.returnValues.pool_number}</td>
                            <td>
                              <a
                                //style={{ color: "#47a1fb" }}
                                href={`https://etherscan.io/tx/${value.transactionHash}`}
                                target="_blank"
                              >
                                {utils.truncateStr(value.transactionHash, 8)}
                              </a>
                            </td>
                          </tr>
                        )}
                        {value.event == "stakeEvent" && (
                          <tr>
                            <td>{value.event}</td>
                            <td>
                              <a
                                style={{ color: "#47a1fb" }}
                                href={`https://etherscan.io/address/${value.returnValues.staker}`}
                                target="_blank"
                              >
                                {utils.truncateStr(
                                  value.returnValues.staker,
                                  8
                                )}
                              </a>
                            </td>
                            <td>
                              {parseFloat(
                                value.returnValues.LP_amount / 1e18
                              ).toFixed(3)}{" "}
                              A5T-USDC
                            </td>
                            <td>{value.returnValues.pool_number}</td>
                            <td>
                              <a
                                style={{ color: "#47a1fb" }}
                                href={`https://etherscan.io/tx/${value.transactionHash}`}
                                target="_blank"
                              >
                                {utils.truncateStr(value.transactionHash, 8)}
                              </a>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
              </tbody>
            </table>
          </StakingTableLayout>
          {history.length === 0 && (
            <NoDataParentDiv>
              <NoDataFound>No Data Found</NoDataFound>
            </NoDataParentDiv>
          )}
        </div>
      </div>
      <AmountModal
        poolNumber={selectedPool}
        showModal={showModal}
        hideModal={hideModal}
        balance={eth?.A5T_USDC_balance}
        getStakeDetail={(pool_number, value) =>
          handleStakeAmount(pool_number, value)
        }
      />
    </div>
  );
};

export default A5TStaking;
 