import Web3 from 'web3';
import contracts from "./contracts";
import ERC20 from "./ERC20";
const eth = {
	address:'',
	connected:false,
	balance:0,
	USDC_balance:0,
	A5T_balance:0,
	A5T_USDC_balance:0,
	Staking_Balance:0,
	A5T:null,
	USDC:null,
	A5T_USDC:null,
	StakingContract:null,
	issuers:[],
	isInfura:false,
	async connect (){
	    if (window.ethereum)
	      await window.ethereum.enable();
	      let is_infura = false;
	      if (typeof window.web3 !== 'undefined') {
	          window.web3 = new Web3(window.web3.currentProvider);
	      } else {
	          //alert('Need Metamask/TrusWallet');
	          const infura = 'https://ropsten.infura.io/v3/c3ddecfcf85f47d292f9a97ee00e03bc';
        	  window.web3 = new Web3(new Web3.providers.HttpProvider(infura));
        	  eth.isInfura = true;
	      }
	      let address = '';
	      let balance = 0;

	        
	        
	        if (!eth.isInfura){
	        	await window.web3.eth.getAccounts().then(function (result) {
		            address = result[0];
		        });
		        await window.web3.eth.getBalance(address).then((res) => {
		            balance = res;
		        });
		        eth.address = address;
	        	eth.balance = parseFloat(balance)/1e18;
	        }
		        
	        eth.connected = true;
	        

	        eth.A5T = new window.web3.eth.Contract(
		      contracts.ERC20_ABI,
		      contracts.A5T_Address
		    );
		    eth.USDC = new window.web3.eth.Contract(
		      contracts.ERC20_ABI,
		      contracts.USDC_Address
		    );
		    eth.A5T_USDC = new window.web3.eth.Contract(
		      contracts.ERC20_ABI,
		      contracts.A5T_USDC_Address
		    ); 
		    eth.StakingContract = new window.web3.eth.Contract(
		      contracts.Staking_ABI,
		      contracts.Staking_Address
		    );
		    if (!eth.isInfura){
			    eth.A5T_balance = await ERC20.balanceOf(eth.A5T,address);
			    eth.USDC_balance = await ERC20.balanceOf(eth.USDC,address);
			    eth.A5T_USDC_balance = await ERC20.balanceOf(eth.A5T_USDC,address);
			}
		    eth.Staking_Balance = await ERC20.balanceOf(eth.A5T,contracts.Staking_Address);
	        return true;
	      
	}
}
export default eth;