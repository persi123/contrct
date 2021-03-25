///////////////////////////////////////////////////////////////
import React, { Component } from "react";
import utils from "../../utils";
import eth from "../../utils/eth";
import Staking from "../../utils/Staking";
import ERC20 from "../../utils/ERC20";
import contracts from "../../utils/contracts";
import $ from 'jquery';
import "./Admin.css"

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popup:null,
      start_date:0,
      end_date:0
    };
    this.tick = this.tick.bind(this);
    this.intervalHandle = null;
    this.loaded = false;
  }
  async connect(){

  }
  async tick() { 
    
  }
  async setStartDate(){
    if (! await Staking.isAdmin(eth.address )){
      alert('Only Admin can access this');
      return;
    }
    var date = $('[name="startdate"]').val();
    if (date ==0 ){
      alert('Please select a date');
      return;
    }
    var timeStamp = parseInt((new Date(date)).getTime() /1000);
    if (this.state.end_date>0){
      if (this.state.end_date <= timeStamp){
        alert('Start Date must be less than End Date');
        return;
      }
    }
    await eth.StakingContract.methods
    .setWindow_Start_Date(
        timeStamp
    )
    .send(
        {
            from: eth.address,
        }
    ).on('transactionHash', function (hash) {
        $('#setStartDate_message').html('Transaction Pending ....');
    })
    .on('receipt', async function (receipt) {
            
        if (receipt.status) {
            $('#setStartDate_message').html('Set Start Date');
            
        }
        else {
            $('#setStartDate_message').html('Error during setting Start Date');
        }

    })
    .on('error', function (receipt) {
        $('#setStartDate_message').html('Error during setting Start Date');
    });
  }
  async setEndDate(){
    if (! await Staking.isAdmin(eth.address )){
      alert('Only Admin can access this');
      return;
    }
    var date = $('[name="enddate"]').val();
    if (date ==0 ){
      alert('Please select a date');
      return;
    }
    var timeStamp = parseInt((new Date(date)).getTime() /1000);
    if (this.state.start_date>0){
      if (this.state.start_date >= timeStamp){
        alert('End Date must be greater than Start Date');
        return;
      }
    }
    await eth.StakingContract.methods
    .setWindow_End_Date(
        timeStamp
    )
    .send(
        {
            from: eth.address,
        }
    ).on('transactionHash', function (hash) {
        $('#setEndDate_message').html('Transaction Pending ....');
    })
    .on('receipt', async function (receipt) {
            
        if (receipt.status) {
            $('#setEndDate_message').html('Set End Date');
            
        }
        else {
            $('#setEndDate_message').html('Error during setting End Date');
        }

    })
    .on('error', function (receipt) {
        $('#setEndDate_message').html('Error during setting End Date');
    });
  }
  async setPoolDuration(pool_number){
    if (! await Staking.isAdmin(eth.address )){
      alert('Only Admin can access this');
      return;
    }
    var duration = 0 ;
    let msg = '';
    if (pool_number == 1){
      duration = $('[name="duration1"]').val();
      msg = '#setDuration1_message';
    }
    else if (pool_number == 2){
      duration = $('[name="duration2"]').val();
      msg = '#setDuration2_message';
    }
    

    if (duration ==0 || parseFloat(duration) != parseFloat((duration*10) / 10) ){
      alert('Invalid Duration');
      return;
    }
    await eth.StakingContract.methods
    .change_Pool_Duration(
      pool_number,
        duration
    )
    .send(
        {
            from: eth.address,
        }
    ).on('transactionHash', function (hash) {
        $(msg).html('Transaction Pending ....');
    })
    .on('receipt', async function (receipt) {
            
        if (receipt.status) {
            $(msg).html('Set Duration');
            
        }
        else {
            $(msg).html('Error during setting Duration');
        }

    })
    .on('error', function (receipt) {
        $(msg).html('Error during setting Duration');
    });
  }
  async setPoolReward(pool_number){
    if (! await Staking.isAdmin(eth.address )){
      alert('Only Admin can access this');
      return;
    }
    var reward = 0 ;
    let msg = '';
    if (pool_number == 1){
      reward = $('[name="reward1"]').val();
      msg = '#setReward1_message';
    }
    else if (pool_number == 2){
      reward = $('[name="reward2"]').val();
      msg = '#setReward2_message';
    }
    

    if (reward == 0){
      alert('Invalid Duration');
      return;
    }
    await eth.StakingContract.methods
    .change_Pool_Reward(
      pool_number,
      window.web3.utils.toBN(
         Math.floor(reward * 1e18).toLocaleString("fullwide", {
             useGrouping: false,
         }))
    )
    .send(
        {
            from: eth.address
        }
    ).on('transactionHash', function (hash) {
        $(msg).html('Transaction Pending ....');
    })
    .on('receipt', async function (receipt) {
        if (receipt.status) {
            $(msg).html('Set Reward');
        }
        else {
            $(msg).html('Error during setting Reward');
        }
    })
    .on('error', function (receipt) {
        $(msg).html('Error during setting Reward');
    });
  }
  hideModal = () => {
      this.setState({ popup: null });
  };
  async componentWillUnmount(){
    //console.log("unmounted");
    clearInterval(this.intervalHandle);
    
  }
  async componentDidMount() {
    if (!eth.connected){
      alert('Please go to home page and connect to Blockchain first');
    }
    this.intervalHandle = setInterval(this.tick, 3000);
    return;

  }

  render() {
   
    return (
      <div>
          {this.state.popup}
          <section className="site-section bg-light" id="contact-section">
            <div className="container" style={{marginTop:"50px"}}>
              <div className="row mb-5">
                <div className="col-12 text-center">
                  <h3 className="section-sub-title">A5T-USDC LP Staking</h3>
                  <h3 className="section-sub-title">ADMIN AREA</h3>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-5">
                  <form action="#" className="p-5 bg-white">
                      <label className="text-black" for="subject">Set Start Date: {this.state.start_date != 0 ? utils.convertTimeStampNoTime(this.state.start_date*1000): 'Not Set'}</label> <br/>
                      <input type="date" name="startdate" className="form-control" placeholder="Select a date (UTC)" />
                      <a href={void(0)} className="btn btn-primary" onClick={()=>this.setStartDate()}>Set</a>
                      <br/><br/>
                      <label className="text-black" for="subject">Set End Date: {this.state.end_date != 0 ? utils.convertTimeStampNoTime(this.state.end_date*1000): 'Not Set'}</label> <br/>
                      <input type="date" name="enddate" className="form-control" placeholder="Select a date (UTC)" />
                      <a href={void(0)} className="btn btn-primary" onClick={()=>this.setEndDate()}>Set</a>
                      <p id="setStartDate_message"></p>
                      <p id="setEndDate_message"></p>
                  </form>
                </div>
                <div className="col-md-6 mb-5">
                  <form action="#" className="p-5 bg-white">
                      <label className="text-black" for="subject">Change Pool 1 Duration: {}</label> <br/>
                      <input type="number" name="duration1" className="form-control" placeholder="Duration in seconds" />
                      <a href={void(0)} className="btn btn-primary" onClick={()=>this.setPoolDuration(1)}>Set</a>
                      <br/><br/>
                      <label className="text-black" for="subject">Change Pool 2 Duration: {}</label> <br/>
                      <input type="number" name="duration2" className="form-control" placeholder="Duration in seconds" />
                      <a href={void(0)} className="btn btn-primary" onClick={()=>this.setPoolDuration(2)}>Set</a>
                      <p id="setDuration1_message"></p>
                      <p id="setDuration2_message"></p>
                  </form>
                </div>
              </div>
              <div className="row">
                
                  <div className="col-md-6 mb-5">
                    <form action="#" className="p-5 bg-white">
                        <label className="text-black" for="subject">Change Pool 1 Reward: {}</label> <br/>
                        <input type="number" name="reward1" className="form-control" placeholder="Reward in A5T" />
                        <a href={void(0)} className="btn btn-primary" onClick={()=>this.setPoolReward(1)}>Set</a>
                        <br/><br/>
                        <label className="text-black" for="subject">Change Pool 2 Reward: {}</label> <br/>
                        <input type="number" name="reward2" className="form-control" placeholder="Reward in A5T" />
                        <a href={void(0)} className="btn btn-primary" onClick={()=>this.setPoolReward(2)}>Set</a>
                        <p id="setReward1_message"></p>
                        <p id="setReward2_message"></p>
                    </form>
                  </div>
                  <div className="col-md-6 mb-5">
                    <form action="#" className="p-5 bg-white">
                        
                    </form>
                  </div>
                <div className="row">
                  <p id="approveMsg"></p>
                </div>
                
                
              </div>
              
            </div>
            

        </section>          
      </div>

    );
  }
}

