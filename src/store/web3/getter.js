const getters = {
    getWeb3(state) {
        return state.web3
    },
    getNetwork(state) {
        if(state.web3.networkId==1) return "Ethereum Main Net";
        if(state.web3.networkId==3) return "Ropsten Test Net";
        if(state.web3.networkId==4) return "Rinkeby Test Net";
        if(state.web3.networkId==5) return "Goerli Test Net";
        if(state.web3.networkId==42) return "Kovan Test Net";
        return "Unknown Network";
    },
    getContract(state) {
        return state.contractInstance
    },
};

export default getters;