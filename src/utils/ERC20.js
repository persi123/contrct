import contracts from "./contracts";
import eth from "./eth";

const ERC20 = {

	async balanceOf(ERC20Contract,address){
		if (ERC20Contract == null) return 0;

		let res = await ERC20Contract
		.methods
        .balanceOf(address)
        .call();

        return parseFloat(res/1e18);
	},
	async allowance(ERC20Contract,owner,spender){
		if (ERC20Contract == null) return 0;

		let res = await ERC20Contract
		.methods
        .allowance(owner,spender)
        .call();

        return parseFloat(res/1e18);
	},
}
export default ERC20;