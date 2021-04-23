import axios from 'axios'

 changeToken0InfoByAddress(context, data, all_tokens, address) {
    console.log(data, all_tokens, address)
    let selToken = all_tokens.find(
        token => token.platforms.ethereum && token.platforms.ethereum == address.toLowerCase()
    );
    if(selToken){
        let tokenInfo = await axios.get("https://api.ethplorer.io/getTokenInfo/"+selToken.platforms.ethereum +"?apiKey=freekey");
        let priceInfo = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids="+selToken.id+"&vs_currencies=usd");
        tokenInfo.price = priceInfo[selToken.id].usd;
        data.token = tokenInfo;
        console.log(tokenInfo)
        context.commit(type.SET_CURRENT_TOKEN0, data);
    }
},

async changeToken0InfoBySymbol(context, data, all_tokens, symbol) {
    var selToken = {};
    selToken = all_tokens.find(
        token => token.platforms.ethereum && token.symbol == symbol.toLowerCase()
    );
    if(selToken){
        let tokenInfo = await axios.get("https://api.ethplorer.io/getTokenInfo/"+selToken.platforms.ethereum +"?apiKey=freekey");
        let priceInfo = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids="+selToken.id+"&vs_currencies=usd");
        tokenInfo.price = priceInfo[selToken.id].usd;
        data.token = tokenInfo;
        context.commit(type.SET_CURRENT_TOKEN0, data);
    }
},    