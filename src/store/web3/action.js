import type from './type'
import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider'

const actions = {
    async connectWallet(context, walletType) {
        const currentProvider = await detectEthereumProvider();
        if (currentProvider && walletType == 0) {
            // console.log('Installed MetaMask!');
            // console.log(currentProvider)
            // console.log(window.ethereum)
            // console.log(window.web3)
            let web3Instance = new Web3(currentProvider);
            if (!window.ethereum.selectedAddress) {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
            }
            let currentAddress = window.ethereum.selectedAddress;
            const chainId = await currentProvider.request({
                method: 'eth_chainId'
            })
            let data={
                isInjected: true,
                walletType: walletType,
                ethProvider: window.ethereum,
                web3Instance: web3Instance,
                address: currentAddress,    
                networkId: chainId,
            };
            // console.log(data)
            context.commit(type.SET_WEB3, data);
            //context.commit(type.SET_CONTRACT, data);
            console.log(window.ethereum.selectedAddress);
        } else {
            console.log('Please install MetaMask!');
        }

        //context.commit(type.SET_WEB3, data);
    },

    setContractInstance(context, data) {
        context.commit(type.SET_CONTRACT, data);
    },

};

export default actions;