import type from './type'
import minABI from '../web3/contractABI'
import axios from "axios";
//import VueAxios from 'vue-axios'
const getBalance = async (context, data)=>{
    let web3 = context.getters.getWeb3;
    if (web3.isInjected) {
        let balance = 0;
        if (data.token.id.indexOf("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2") !== -1) {
            var balance1 = await web3.web3Instance.eth.getBalance(context.getters.getWeb3.address);
            balance = web3.web3Instance.utils.fromWei(balance1, "ether");
        } else {
            let contract = new web3.web3Instance.eth.Contract(minABI, data.token.id);
            let balance2 = await contract.methods.balanceOf(web3.address).call();
            let decimals = await contract.methods.decimals().call();
            balance =  balance2 / Math.pow(10, decimals);
        }
        return balance;
    }
    return 0;
}

const actions = {
    async updateGasFee(context) {
        let web3 = context.getters.getWeb3;
        if (web3.isInjected) {
            let gas = await axios.get(
                "https://unitrade-server-prod.herokuapp.com/historicGasPrices?networkId="+web3.networkId
            );
            // console.log(gas.data);
            let options = [
                {
                  title: 'Slow',
                  color: '#e6183a',
                  usd: 0,
                  eth: 0,
                  gwei: 0,
                },
                {
                  title: 'Medium',
                  color: '#f8b425',
                  usd: 0,
                  eth: 0,
                  gwei: 0,
                },
                {
                  title: 'Fast',
                  color: '#01726a',
                  usd: 0,
                  eth: 0,
                  gwei: 0,
                },
            ];
            let temp = [
                gas.data.low, 
                gas.data.medium, 
                gas.data.high
            ];
            for (let i=0;i<3;i++) {
                options[i].gwei = parseFloat(temp[i]).toFixed(2);
                options[i].eth = parseFloat(temp[i]*0.00036).toFixed(5);
                options[i].usd = parseFloat(temp[i]*0.00036*context.getters.ethPrice).toFixed(2);
            }
            context.commit(type.SET_GAS_FEE_OPTIONS, options);
        }
    },
    
    async setToken0(context, data) {
        data.balance = await getBalance(context, data);
        context.commit(type.SET_CURRENT_TOKEN0, data);
    },

    async setToken1(context, data) {
        data.balance = await getBalance(context, data);
        context.commit(type.SET_CURRENT_TOKEN1, data);
        // toastr.warning('Warning', 'Pair does not exist on Uniswap. Switching to default ETH pair.', {timeout: 10000,closeButton: true,closeMethod: 'fadeOut',closeDuration: 300,position: 'toast-bottom-left'});
    },

    setMode(context, data) {
        // console.log(token)
        context.commit(type.SET_CURRENT_MODE, data);
    },

    // setPairTokens(context, data) {
    //     context.commit(type.SET_PAIR_TOKENS, data);
    // },

    setEthPrice(context, data) {
        // console.log(token)
        context.commit(type.SET_ETH_PRICE, data);
    },
};

export default actions;