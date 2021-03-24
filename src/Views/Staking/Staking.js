import React, { useState, useEffect, useContext,useRef } from "react";
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
  CardConnectButton,
  ConnectButton,
  StakingTableLayout,
   
} from "./Staking.styled";
import { AlertContext } from "../../Components/Alert/alert";
import SweetAlert from "react-bootstrap-sweetalert";
import utils from "../../utils";
import eth from "../../utils/eth";
import Staking from "../../utils/Staking";
import ERC20 from "../../utils/ERC20";
import contracts from "../../utils/contracts";
import { SubHeader } from "../../Components/SubHeader/subHeader";
import {TextHeader} from "../../Components/SubHeader/TextHeader"
import { Header } from '../../Components/Header/Index';
import "./Staking.scss";

const A5TStaking = () => {
  const forceUpdate = useForceUpdate();
  const { onAlert } = useContext(AlertContext);
  const [loaded, setloaded] = useState(false);
  const [approving, setapproving] = useState(false);
  const [intervalHandle, setintervalHandle] = useState(null);
  const [poolbundle, setpoolbundle] = useState([]);
  const [address,setaddress]=useState("")
  const [balance,setbalance]=useState(0)
  const [USDC_balance,setUSDC_balance]=useState("")
  const [A5T_balance,setA5T_balance]=useState("")
  const [A5T_USDC_balance,setA5T_USDC_balance]=useState("")
  const [start_date,setstart_date]=useState(0)
  const [end_date,setend_date]=useState(0)
  const [pool_count,setpool_count]=useState(0)
  const [approved,setapproved]=useState(null)
  const [history,sethistory]=useState([])
  const [popup,setpopup]=useState(null)
  const moveToPool = useRef(null)
 
  useEffect(() => {
    connect();
    setTimeout(() => {
      tick();
    }, 3000);

    // var intervalId = setInterval(tick, 3000);
    // setintervalHandle(intervalId)
    //  return ()=>{
    //     clearInterval(intervalHandle);
    //  }
  }, []);

 const handlePoolMove = (event) => {
    window.scrollTo({
        top: 500,
        behavior: 'smooth'
      });
    
  }

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
  ];

  const connect = async () => {
    setloaded(false);
    let res = await eth.connect();
    if (res) {
        setaddress(eth.address)
        setUSDC_balance(eth.USDC_balance)
        setA5T_balance(eth.A5T_balance)
        setA5T_USDC_balance(eth.A5T_USDC_balance)
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
      setend_date(await Staking.window_end_date())
      setpool_count(pool_count)
      
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
      setapproved(approved)
      
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
   setapproved(approved)
  };

  //stake function
  const stake = (pool_number) => {
    if (end_date == 0 || start_date == 0) {
      alert("Pool Start End Date not set");
      return;
    }
    setpopup((
        <SweetAlert
          style={{ color: "black" }}
          input
          showCancel
          title="Enter amount of A5T-USDC pair token to stake"
          inputType="number"
          onConfirm={(response) => onStake(pool_number, response)}
          onCancel={hideModal}
        />
      ))
  };

  const onStake = async (pool_number, amount) => {
    hideModal();
    if (parseFloat(A5T_USDC_balance) < parseFloat(amount)) {
      alert("Dont have enough A5T-USDC pair token to stake");
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

  const getHistory = () => {
    var array = [];
    var events = eth.StakingContract.getPastEvents(
      "allEvents",
      { filter: {}, fromBlock: 0, toBlock: "latest" },
      function (error, log) {
        sethistory(log)
      }
    );
  };

  const openLink = (addr) => {
    window.open(addr, "_blank");
  };

  return (
    <>
      {popup}
      <Header handlePoolMove={handlePoolMove}/>
      <SubHeader />
      <div className="staking-container">
        <div className="staking-section-1">
          <div className="card text-white mx-auto">
            <div className="card-body">
              <CardSubTitle className="staking-sub-title">
                Staking Details
              </CardSubTitle>
              <CardContent rowNo={4} colNo={1} style={{padding :"1.8rem 0px"}}>
                <CardFields>
                  <CardFieldName>Staking Contract:</CardFieldName>
                  <CardFieldValue>{contracts.Staking_Address}</CardFieldValue>
                </CardFields>
                <CardFields>
                  <CardFieldName>Staking Contract Balance:</CardFieldName>
                  <CardFieldValue>
                    {utils.numberWithCommas(
                      parseFloat(eth?.Staking_Balance).toFixed(3)
                    )}{" "}
                    A5T
                  </CardFieldValue>
                </CardFields>
                <CardFields>
                  <CardFieldName>Staking Start Date:</CardFieldName>
                  <CardFieldValue>
                    {" "}
                    {start_date == 0
                      ? "Not Set"
                      : utils.convertTimeStamp(start_date * 1000)}
                  </CardFieldValue>
                </CardFields>
                <CardFields>
                  <CardFieldName>
                    Staking End Date (Pool Start Date):
                  </CardFieldName>
                  <CardFieldValue>
                    {end_date == 0
                      ? "Not Set"
                      : utils.convertTimeStamp(end_date * 1000)}
                  </CardFieldValue>
                </CardFields>
                <CardFields>
                  <CardFieldName>Total Pools:</CardFieldName>
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
                <Button
                  border="blue"
                  onClick={() => connect()}
                >
                 Connect
                </Button>
                <Button
                  border="blue"
                  onClick={() =>window.location.reload()  
                  }
                >
                 Refresh
                </Button>
              </ButtonGroup>
              {/* <CardConnectButton>
                <ConnectButton onClick={() => connect()}>Connect</ConnectButton>
              </CardConnectButton> */}
              <CardContent rowNo={4} colNo={1}>
                <CardFields>
                  <CardFieldName>Your address:</CardFieldName>
                  <CardFieldValue>
                    {eth.address != ""
                      ? eth.address
                      : "Please use Metamask/TrustWallet"}
                  </CardFieldValue>
                </CardFields>
                <CardFields>
                  <CardFieldName>ETH Balance:</CardFieldName>
                  <CardFieldValue>
                    {" "}
                    {utils.numberWithCommas(
                      parseFloat(eth?.balance).toFixed(3)
                    )}{" "}
                    ETH
                  </CardFieldValue>
                </CardFields>
                <CardFields>
                  <CardFieldName>USDC Balance:</CardFieldName>
                  <CardFieldValue>
                    {utils.numberWithCommas(
                      parseFloat(eth?.USDC_balance).toFixed(3)
                    )}{" "}
                    USDC
                  </CardFieldValue>
                </CardFields>
                <CardFields>
                  <CardFieldName>A5T Balance:</CardFieldName>
                  <CardFieldValue>
                    {utils.numberWithCommas(
                      parseFloat(eth?.A5T_balance).toFixed(3)
                    )}{" "}
                    A5T
                  </CardFieldValue>
                </CardFields>
                <CardFields>
                  <CardFieldName>A5T-USDC Pair Balance:</CardFieldName>
                  <CardFieldValue>
                    {utils.numberWithCommas(
                      parseFloat(eth?.A5T_USDC_balance).toFixed(3)
                    )}{" "}
                    A5T-USDC Pair Token
                  </CardFieldValue>
                </CardFields>
              </CardContent>
              <ButtonGroup width="100%">
                <Button
                  border="blue"
                  onClick={() =>
                    openLink(
                      "https://a5t.io/uniswap/#/add/0x2833F57918b7469270eFDd5088F510AdC2efb473/0x38fdDbD09Cc4e617b85DA61F4B57D3Cda1897b87"
                    )
                  }
                >
                  Add Liquidity
                </Button>
                <Button
                  border="red"
                  onClick={() =>
                    openLink(
                      "https://a5t.io/uniswap/#/remove/0x2833F57918b7469270eFDd5088F510AdC2efb473/0x38fdDbD09Cc4e617b85DA61F4B57D3Cda1897b87"
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

      <div className="staking-container" ref={moveToPool} style={{marginTop:"2rem"}}>
        {poolbundle.length > 0 && (
          <div className="staking-section-1">
            <div className="card text-white mx-auto">
              <div className="card-body">
                <CardSubTitle className="staking-sub-title">
                  Pool 1
                </CardSubTitle>
                <CardContent rowNo={4} colNo={1}>
                  <CardFields>
                    <CardFieldName>Pool Start on:</CardFieldName>
                    <CardFieldValue>
                      Start on:
                      {end_date == 0
                        ? "Not Set"
                        : utils.convertTimeStamp(end_date * 1000)}
                    </CardFieldValue>
                  </CardFields>

                  <CardFields>
                    <CardFieldName>Pool Duration:</CardFieldName>
                    <CardFieldValue>
                      {utils.convertDuration(poolbundle[0].pool_Duration)}
                    </CardFieldValue>
                  </CardFields>

                  <CardFields>
                    <CardFieldName>Total Reward:</CardFieldName>
                    <CardFieldValue>
                      {" "}
                      {utils.numberWithCommas(
                        Math.round(poolbundle[0].total_A5T_Reward / 1e18)
                      )}{" "}
                      A5T
                    </CardFieldValue>
                  </CardFields>
                  <CardFields>
                    <CardFieldName>Total Staked:</CardFieldName>
                    <CardFieldValue>
                      {utils.numberWithCommas(
                        parseFloat(poolbundle[0].TVL / 1e18).toFixed(3)
                      )}{" "}
                      A5T-USDC Pair Token
                    </CardFieldValue>
                  </CardFields>
                  <CardFields>
                    <CardFieldName>Your Staked:</CardFieldName>
                    <CardFieldValue>
                      {" "}
                      {!eth.isInfura
                        ? utils.numberWithCommas(
                            parseFloat(poolbundle[0].stakeAmount).toFixed(3)
                          )
                        : 0}{" "}
                      A5T-USDC Pair Token
                    </CardFieldValue>
                  </CardFields>
                  <CardFields>
                    <CardFieldName>
                      Your Reward at the end of the Pool::
                    </CardFieldName>
                    <CardFieldValue>
                      {poolbundle[0].TVL == 0
                        ? 0
                        : utils.numberWithCommas(
                            parseFloat(
                              (poolbundle[0].stakeAmount /
                                (poolbundle[0].TVL / 1e18)) *
                                (poolbundle[0].total_A5T_Reward / 1e18)
                            ).toFixed(3)
                          )}{" "}
                      A5T
                    </CardFieldValue>
                  </CardFields>
                </CardContent>
                <ButtonGroup width="100%">
                  {poolbundle.length > 0 && !eth.isInfura ? (
                    isPoolComplete(poolbundle[0].pool_Duration) ? (
                      <>
                        {!poolbundle[0].isClaimed ? (
                          <Button border="blue" onClick={() => claim(1)}>
                            Unstake and Claim Reward
                          </Button>
                        ) : (
                          <Button border="blue" disabled>
                            Claimed
                          </Button>
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
                </ButtonGroup>
              </div>
            </div>
          </div>
        )}

        {poolbundle.length > 0 && (
          <div className="staking-section-1">
            <div className="card text-white mx-auto">
              <div className="card-body">
                <CardSubTitle className="staking-sub-title">
                  Pool 2
                </CardSubTitle>
                <CardContent rowNo={4} colNo={1}>
                  <CardFields>
                    <CardFieldName>Pool Start on:</CardFieldName>
                    <CardFieldValue>
                      Start on:{" "}
                      {end_date == 0
                        ? "Not Set"
                        : utils.convertTimeStamp(end_date * 1000)}
                    </CardFieldValue>
                  </CardFields>

                  <CardFields>
                    <CardFieldName>Pool Duration:</CardFieldName>
                    <CardFieldValue>
                      {utils.convertDuration(poolbundle[1].pool_Duration)}
                    </CardFieldValue>
                  </CardFields>

                  <CardFields>
                    <CardFieldName>Total Reward:</CardFieldName>
                    <CardFieldValue>
                      {utils.numberWithCommas(
                        Math.round(poolbundle[1].total_A5T_Reward / 1e18)
                      )}{" "}
                      A5T
                    </CardFieldValue>
                  </CardFields>
                  <CardFields>
                    <CardFieldName>Total Staked:</CardFieldName>
                    <CardFieldValue>
                      {utils.numberWithCommas(
                        parseFloat(poolbundle[1].TVL / 1e18).toFixed(3)
                      )}{" "}
                      A5T-USDC Pair Token
                    </CardFieldValue>
                  </CardFields>
                  <CardFields>
                    <CardFieldName>Your Staked:</CardFieldName>
                    <CardFieldValue>
                      {!eth.isInfura
                        ? utils.numberWithCommas(
                            parseFloat(poolbundle[1].stakeAmount).toFixed(3)
                          )
                        : 0}{" "}
                      A5T-USDC Pair Token
                    </CardFieldValue>
                  </CardFields>
                  <CardFields>
                    <CardFieldName>
                      Your Reward at the end of the Pool::
                    </CardFieldName>
                    <CardFieldValue>
                      {poolbundle[1].TVL == 0
                        ? 0
                        : utils.numberWithCommas(
                            parseFloat(
                              (poolbundle[1].stakeAmount /
                                (poolbundle[1].TVL / 1e18)) *
                                (poolbundle[1].total_A5T_Reward / 1e18)
                            ).toFixed(3)
                          )}{" "}
                      A5T
                    </CardFieldValue>
                  </CardFields>
                </CardContent>
                <ButtonGroup width="100%">
                  {poolbundle.length > 0 && !eth.isInfura ? (
                    isPoolComplete(poolbundle[1].pool_Duration) ? (
                      <>
                        {!poolbundle[1].isClaimed ? (
                          <Button border="blue" onClick={() => claim(2)}>
                            Unstake and Claim Reward
                          </Button>
                        ) : (
                          <Button border="blue" disabled>
                            Claimed
                          </Button>
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
                            <Button border="blue" onClick={() => stake(2)}>
                              Stake
                            </Button>
                          )
                        ) : null}
                      </>
                    )
                  ) : null}
                </ButtonGroup>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="staking-container-2 mt-3">
        <div className="staking-section-3 rounded-lg">
            <TextHeader title={"Transaction History"}/>
          <StakingTableLayout>
            <table className="new-table">
              <thead>
                <tr className="rounded-lg">
                  <th>Event</th>
                  <th>Staker</th>
                  <th>Amount</th>
                  <th>Pool Number</th>
                  <th>Transaction</th>
                </tr>
              </thead>
              <tbody>
                {history.map((value) => {
                  return (
                    <>
                      {value.event == "rewardEvent" && (
                        <tr>
                          <td>{value.event}</td>
                          <td>
                            <a
                              style={{ color: "#47a1fb" }}
                              href={`https://ropsten.etherscan.io/address/${value.returnValues.staker}`}
                              target="_blank"
                            >
                              {utils.truncateStr(value.returnValues.staker, 8)}
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
                              style={{ color: "#47a1fb" }}
                              href={`https://ropsten.etherscan.io/tx/${value.transactionHash}`}
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
                              href={`https://ropsten.etherscan.io/address/${value.returnValues.staker}`}
                              target="_blank"
                            >
                              {utils.truncateStr(value.returnValues.staker, 8)}
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
                              href={`https://ropsten.etherscan.io/tx/${value.transactionHash}`}
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
        </div>
      </div>
    </>
  );
};

export default A5TStaking;
//table backup

{
  /* <div className="staking-container-2">
<div className="staking-section-3">
  <StakingTableLayout>
    <table className="staking-table">
      <thead className="staking-table-thead bg-heading">
        <tr className="staking-table-tr bg-heading">
          <th className="staking-table-th">Event</th>
          <th className="staking-table-th">Staker</th>
          <th className="staking-table-th">Amount</th>
          <th className="staking-table-th">Pool Number</th>
          <th className="staking-table-th"> Transaction</th>
        </tr>
      </thead>
      <tbody className="staking-table-tbody">
        {state?.history.map((value) => {
          return (
            <>
              {value.event == "rewardEvent" && (
                <tr className="staking-table-tr">
                  <td className="staking-table-td">{value.event}</td>
                  <td className="staking-table-td">
                    <a
                      style={{ color: "#47a1fb" }}
                      href={`https://ropsten.etherscan.io/address/${value.returnValues.staker}`}
                      target="_blank"
                    >
                      {utils.truncateStr(value.returnValues.staker, 8)}
                    </a>
                  </td>
                  <td className="staking-table-td">
                    {parseFloat(
                      value.returnValues.reward_amount / 1e18
                    ).toFixed(3)}{" "}
                    A5T{" "}
                  </td>
                  <td className="staking-table-td">
                    {value.returnValues.pool_number}
                  </td>
                  <td className="staking-table-td">
                    <a
                      style={{ color: "#47a1fb" }}
                      href={`https://ropsten.etherscan.io/tx/${value.transactionHash}`}
                      target="_blank"
                    >
                      {utils.truncateStr(value.transactionHash, 8)}
                    </a>
                  </td>
                </tr>
              )}
              {value.event == "stakeEvent" && (
                <tr className="staking-table-tr">
                  <td className="staking-table-td">{value.event}</td>
                  <td className="staking-table-td">
                    <a
                      style={{ color: "#47a1fb" }}
                      href={`https://ropsten.etherscan.io/address/${value.returnValues.staker}`}
                      target="_blank"
                    >
                      {utils.truncateStr(value.returnValues.staker, 8)}
                    </a>
                  </td>
                  <td className="staking-table-td">
                    {parseFloat(
                      value.returnValues.LP_amount / 1e18
                    ).toFixed(3)}{" "}
                    A5T-USDC
                  </td>
                  <td className="staking-table-td">
                    {value.returnValues.pool_number}
                  </td>
                  <td className="staking-table-td">
                    <a
                      style={{ color: "#47a1fb" }}
                      href={`https://ropsten.etherscan.io/tx/${value.transactionHash}`}
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
</div>
</div> */
}
