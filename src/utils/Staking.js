import contracts from "./contracts";
import eth from "./eth";

const Staking = {
	async isAdmin(_address){
		if (eth.StakingContract == null) return null;

		let res = await eth.StakingContract
		.methods
        .isAdmin(_address)
        .call();
        return res;
	},
	async owner(){
		if (eth.StakingContract == null) return null;

		let res = await eth.StakingContract
		.methods
        .owner()
        .call();
        return res;
	},
	async window_start_date(){
		if (eth.StakingContract == null) return 0;

		let res = await eth.StakingContract
		.methods
        .window_start_date()
        .call();
        return parseInt(res);
	},
	async window_end_date(){
		if (eth.StakingContract == null) return 0;

		let res = await eth.StakingContract
		.methods
        .window_end_date()
        .call();
        return parseInt(res);
	},
	async pool_count(){
		if (eth.StakingContract == null) return 0;

		let res = await eth.StakingContract
		.methods
        .pool_count()
        .call();
        return parseInt(res);
	},
	
	async pools(index){
		if (eth.StakingContract == null) return null;

		let res = await eth.StakingContract
		.methods
        .pools(index)
        .call();
        return res;
	},
	async getPool_stakeAmount(_pool_number,_staker){
		if (eth.StakingContract == null) return 0;

		let res = await eth.StakingContract
		.methods
        .getPool_stakeAmount(_pool_number,_staker)
        .call();
        return res/1e18;
	}
	,
	async getPool_isUnstaked(_pool_number,_staker){
		if (eth.StakingContract == null) return 0;

		let res = await eth.StakingContract
		.methods
        .getPool_isUnstaked(_pool_number,_staker)
        .call();
        return res;
	}
	,
	async getPool_isClaimed(_pool_number,_staker){
		if (eth.StakingContract == null) return 0;

		let res = await eth.StakingContract
		.methods
        .getPool_isClaimed(_pool_number,_staker)
        .call();
        return res;
	}
	
	
}
export default Staking;