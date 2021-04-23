<script>
import Layout from "../layout/main_layout";
import appConfig from "@/app.config";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
//import axios from "axios";
import { mapActions, mapGetters } from "vuex";
import {
  TOKEN_INFO_QUERY,
  ETH_PRICE_QUERY,
  FIND_TOKEN_BY_KEY_QUERY,
} from "../../graphql/queries/query";


//const all_tokens = require("../tokenlist_2.json");
const allow_tokens = require("../allowlist.json");

export default {
  page: {
    title: "Exchange",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: {
    Layout,
    Loading,
  },
  data() {
    return {
      isLoading: false,
      tabIndex: 0,
      walletItems: [
        {
          id:0,
          wallet: "MetaMask",
          img: "metamask",
        },
        {
        id:1,
          wallet: "Wallet Connect",
          // 'img': 'wallet-conect'
          img: "metamask",
        },
        {
        id:2,
          wallet: "Coinbase Wallet",
          // 'img': 'coinbase'
          img: "metamask",
        },
        {
        id:3,
          wallet: "Fortmatic",
          // 'img': 'fortmatic'
          img: "metamask",
        },
        {
        id:4,
          wallet: "Portis",
          // 'img': 'portis'
          img: "metamask",
        },
      ],
      network_name: "",
      token_filter_by: "",
      filtered_tokenItems: [],
      isActiveLimit: true,
      usd_amount: "0.0000",
      token0_amount: "0.0",
      token0_temp: "0.0",
      isUSDToken0: true,
      token1_amount: "0.0",
      token1_temp: "0.0",
      isUSDToken1: true,
      buy_sell_price: "0.0000",
      pageIndex: 1,
      selectedFee: {
        title: 'Slow',
        color: '#e6183a',
        usd: 0,
        eth: 0,
        gwei: 0,
      },
      custom_gas: 0.00,
    };
  },
  computed: {
    ...mapGetters([
      "currentToken0",
      "currentToken1",
      "currentMode",
      "pairTokenList",
      "ethPrice",
      "getWeb3",
      "getContract",
      "getNetwork",
      "gasFeeOptions",
    ]),
  },
  async mounted() {
    await this.updateTokens(
      true,
      "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      "0xdAC17F958D2ee523a2206206994597C13D831ec7"
    );
    
    if (this.getWeb3.isInjected) {
      this.connectWallet(this.getWeb3.walletType)
    }
        
    setInterval(async () => {
      this.updateTokens(false, "", "");
      this.updateGasFee();
    }, 10000);
    
  },
  methods: {
    ...mapActions([
      "setToken0",
      "setToken1",
      "setMode",
      "setEthPrice",
      "connectWallet",
      "connectWallet",
      "updateGasFee",
    ]),
    async updateTokens(isInit, addr0, addr1) {
      var curToken0 = this.currentToken0;
      var curToken1 = this.currentToken1;
      let temp = await this.$apollo.query({ query: ETH_PRICE_QUERY });
      let price = parseFloat(temp.data.bundle.ethPrice);
      this.setEthPrice(price);
      this.getTokenInfoByAddress(isInit ? addr0 : curToken0.token.id).then(
        async (tokenInfo0) => {
          curToken0.token = tokenInfo0;
          if (this.pageIndex == 1) {
            this.token0_amount = this.usd_amount / tokenInfo0.priceUSD;
            if (this.isUSDToken0) {
              this.token0_temp = parseFloat(this.token0_amount).toFixed(4);
            } else {
              this.token0_temp = parseFloat(this.usd_amount).toFixed(4);
            }
          }
          await this.setToken0(curToken0);
        }
      );
      this.getTokenInfoByAddress(isInit ? addr1 : curToken1.token.id).then(
        async (tokenInfo1) => {
          curToken1.token = tokenInfo1;
          // console.log(tokenInfo1.priceUSD)
          if (this.pageIndex == 1) {
            this.buy_sell_price = parseFloat(tokenInfo1.priceUSD).toFixed(4);
            this.pricehandler();
          }
          await this.setToken1(curToken1);
        }
      );
    },

    async getTokenInfoByAddress(address, oldToken) {
      let selToken;
      if (oldToken) {
        let tokenInfo = oldToken;
        let selAddr = allow_tokens.find(
          (token) => token.toLowerCase() == address.toLowerCase()
        );
        tokenInfo.address = selAddr;

        tokenInfo.priceETH = parseFloat(tokenInfo.derivedETH);
        tokenInfo.priceUSD = tokenInfo.priceETH * this.ethPrice;

        tokenInfo.image = selAddr
          ? "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/" +
            tokenInfo.address +
            "/logo.png"
          : "/images/services-icon/default-image.png";
        return tokenInfo;
      } else {
        selToken = await this.$apollo.query({
          query: TOKEN_INFO_QUERY,
          variables: {
            tokenAddress: address.toLowerCase(),
          },
        });

        if (selToken && selToken.data) {
          let tokenInfo = selToken.data.tokens[0];
          let selAddr = allow_tokens.find(
            (token) => token.toLowerCase() == address.toLowerCase()
          );
          tokenInfo.address = selAddr;

          tokenInfo.priceETH = parseFloat(tokenInfo.derivedETH);
          tokenInfo.priceUSD = tokenInfo.priceETH * this.ethPrice;

          tokenInfo.image = selAddr
            ? "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/" +
              tokenInfo.address +
              "/logo.png"
            : "/images/services-icon/default-image.png";
          return tokenInfo;
        }
        return null;
      }
    },

    toggleRightSidebar() {
      document.body.classList.toggle("right-bar-enabled");
    },
    toggleSearchbar() {
      document.body.classList.toggle("search-bar-enabled");
    },

    limitMarket(text) {
      // console.log(text)
      if (text == "market") {
        this.isActiveLimit = false;
      } else if (text == "limit") {
        this.isActiveLimit = true;
      }
    },

    usdToken0() {
      if (this.isUSDToken0) {
        this.token0_amount = this.token0_temp;
        this.token0_temp = parseFloat(this.usd_amount).toFixed(4);
        this.isUSDToken0 = false;
      } else {
        this.token0_temp = parseFloat(this.token0_amount).toFixed(4);
        this.isUSDToken0 = true;
      }
    },
    token0Handler() {
      if (this.isUSDToken0) {
        this.token0_amount = this.token0_temp;
        this.usd_amount = this.token0_temp * this.currentToken0.token.priceUSD;
        this.token1_amount = this.usd_amount / this.currentToken1.token.priceUSD;
        if (this.isUSDToken1) {
          this.token1_temp = parseFloat(this.token1_amount).toFixed(4);
        } else {
          this.token1_temp = parseFloat(this.usd_amount).toFixed(4);
        }
      }
    },
    async selectToken(tokenItem) {
      console.log(this.tabIndex)
      if (this.tabIndex == 0) {
        this.currentToken0.token = tokenItem;
        await this.setToken0(this.currentToken0);
      } else if (this.tabIndex == 1) {
        this.currentToken1.token = tokenItem;
        await this.setToken1(this.currentToken1);
      }
      this.$bvModal.hide("token-modal");
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
    },
    usdToken1() {
      if (this.isUSDToken1) {
        this.token1_amount = this.token1_temp;
        this.token1_temp = parseFloat(this.usd_amount).toFixed(4);
        this.isUSDToken1 = false;
      } else {
        this.token1_temp = parseFloat(this.token1_amount).toFixed(4);
        this.isUSDToken1 = true;
      }
    },
    token1Handler() {
      if (this.isUSDToken1) {
        this.token1_amount = this.token1_temp;
        this.usd_amount = this.token1_temp * this.currentToken1.token.priceUSD;
        this.token0_amount = this.usd_amount / this.currentToken0.token.priceUSD;
        if (this.isUSDToken0) {
          this.token0_temp = parseFloat(this.token0_amount).toFixed(4);
        } else {
          this.token0_temp = parseFloat(this.usd_amount).toFixed(4);
        }
      }
    },
    selectPair(pairItem) {
      if (this.tabIndex == 1) {
        this.currentToken0.token = pairItem;
        this.setToken0(this.currentToken0);
      } else if (this.tabIndex == 0) {
        this.currentToken1.token = pairItem;
        this.setToken1(this.currentToken1);
      }
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
    },
    pricehandler() {
      this.token1_amount = this.usd_amount / this.buy_sell_price;
      if (this.isUSDToken1) {
        this.token1_temp = parseFloat(this.token1_amount).toFixed(4);
      } else {
        this.token1_temp = parseFloat(this.usd_amount).toFixed(4);
      }
    },
    selectWallet(walletItem) {
      this.connectWallet(walletItem.id);
      this.$bvModal.hide("connect-wallet-modal");
    },

    async tokenFilterHandler() {
      this.$bvModal.show("token-modal");

      this.filtered_tokenItems = [];

      let key = "";
      if (key.indexOf("0x") !== -1) key = key.toLowerCase();
      this.filtered_tokenItems = [];
      const items = await this.$apollo.query({
        query: FIND_TOKEN_BY_KEY_QUERY,
        variables: {
          asSymbol: key,
          asAddress: key,
          asName: key,
        },
      });

      let temp = [];
      //if(items.data.address) temp.push(items.data.address);
      let foundList = [...temp, ...items.data.addresses, ...items.data.symbol]; //,...items.data.name];
      foundList = foundList.concat(items.data.name).unique();
      var loopCount = foundList.length > 5 ? 5 : foundList.length;
      for (let i = 0; i < loopCount; i++) {
        let item = await this.getTokenInfoByAddress(
          foundList[i].id,
          foundList[i]
        );
        if (item) {
          this.filtered_tokenItems.push(item);
        }
      }
    },
    async findTokenInfoByCondition() {
      let key = this.token_filter_by;
      if (key.indexOf("0x") !== -1) key = key.toLowerCase();
      this.filtered_tokenItems = [];
      const items = await this.$apollo.query({
        query: FIND_TOKEN_BY_KEY_QUERY,
        variables: {
          asSymbol: key,
          asAddress: key,
          asName: key,
        },
      });

      let temp = [];
      //if(items.data.address) temp.push(items.data.address);
      let foundList = [...temp, ...items.data.addresses, ...items.data.symbol]; //,...items.data.name];
      foundList = foundList.concat(items.data.name).unique();
      var loopCount = foundList.length > 10 ? 10 : foundList.length;
      for (let i = 0; i < loopCount; i++) {
        let item = await this.getTokenInfoByAddress(
          foundList[i].id,
          foundList[i]
        );
        if (item) {
          this.filtered_tokenItems.push(item);
        }
      }
    },
    
    selectFee(option) {
      this.selectedFee = {...option}
      console.log(this.selectedFee)
    },
    customGasSave() {
      if (this.gasFeeOptions.length == 3) {
        this.gasFeeOptions.push({
          title: 'Custom',
          color: '#3a49c9',
          usd: parseFloat(0.00036*this.custom_gas*this.ethPrice).toFixed(2),
          eth: parseFloat(0.00036*this.custom_gas).toFixed(5),
          gwei: parseFloat(this.custom_gas).toFixed(2),
        });
      } else {
        this.gasFeeOptions.splice(3, 1, {
          title: 'Custom',
          color: '#3a49c9',
          usd: parseFloat(0.00036*this.custom_gas*this.ethPrice).toFixed(2),
          eth: parseFloat(0.00036*this.custom_gas).toFixed(5),
          gwei: parseFloat(this.custom_gas).toFixed(2),
        });
      }
      this.$bvModal.hide("gas-modal");
    },
    
    customTruncate(text, first, last) {
      let temp = text.substr(text.length - last);
      return text.substr(0,first-1) + '...' + temp
    },
  },
};
</script>
<template>
  <Layout>
    <loading
      :active.sync="isLoading"
      :is-full-page="false"
      :background-color="'#222736'"
      :color="'#38a4f8'"
      :opacity="1"
      :z-index="9997"
    ></loading>
    <div 
      class="d-flex justify-content-between flex-column"
    >
      <div class="ml-2 d-lg-flex justify-content-between">
        <div>
          <div class="header-title mb-3">
            <b-img
              :src="currentToken1.token.image"
              rounded="circle"
              height="40"
              alt="image"
            ></b-img>
            <h2 class="ml-3 mb-0">
              {{
                currentToken1.token.name +
                  "  " +
                  currentToken1.token.symbol +
                  "  $" +
                  currentToken1.token.priceUSD
              }}
            </h2>
          </div>
          <a href="#" class="desc-muted wallet-address">
            {{ currentToken1.address }}
          </a>
          <!-- <div class="mt-2 text-lg-left text-md-center text-sm-center">
            <a href="https://unitrade.app/" class="desc-muted mr-3"
              >https://unitrade.app/</a
            >
            <a href="https://twitter.com/" class="desc-muted"
              ><i class="ti-twitter-alt"></i
            ></a>
          </div> -->
        </div>
        <div class="d-lg-flex" v-if="getWeb3.isInjected">
          <div
            class="wallet-info-div mb-md-3 mb-sm-3 mb-xs-2 mx-md-auto mx-sm-auto"
            style="border-color: #626ed4;"
          >{{ getNetwork }}</div>
          <div
            class="wallet-info-div ml-lg-3 mx-md-auto mx-sm-auto"
            style="border-color: #e9ecef;"
          >{{  customTruncate(getWeb3.address,5,5) }}</div>
        </div>
        <button
          type="button"
          class="btn header-item noti-icon right-bar-toggle toggle-right d-inline-block d-md-none"
          style="position: absolute;top: 0;right: 0;"
          @click="toggleRightSidebar"
        >
          <i class="mdi mdi-menu toggle-right"></i>
        </button>
      </div>
      <div class="row" style="margin: 10% auto 150px;">
        <div class="card m-0" style="width: 450px;">
          <div class="card-body">
            <b-tabs
              justified
              class="navtab-bg"
              content-class="p-3"
              v-model="tabIndex"
              v-if="pageIndex==1"
            >
              <b-tab active>
                <template v-slot:title>
                  <h3 class="buy desc-muted">Buy</h3>
                </template>
                <div>
                  <div class="rounded-div">
                    <div>
                      <p class="desc-muted mb-1 ml-2" v-if="!getWeb3.isInjected">No wallet connected</p>
                      <p class="desc-muted mb-1 ml-2" v-if="getWeb3.isInjected">Balance: {{currentToken0.balance}}</p>
                      <b-button
                        pill
                        variant="outline-success"
                        size="md"
                        style="font-size: 17px;"
                        @click="tokenFilterHandler"
                      >
                        <b-img
                          :src="currentToken0.token.image"
                          rounded="circle"
                          height="20"
                          alt="token image"
                        ></b-img>
                        {{ currentToken0.token.symbol }}
                        <i class="mdi mdi-chevron-down"></i>
                      </b-button>
                    </div>
                    <div class="text-right">
                      <p
                        class="usd-p desc-muted mb-1"
                        style="cursor: pointer;"
                        @click="usdToken0"
                      >
                        <span v-if="isUSDToken0">{{ parseFloat(usd_amount).toFixed(4) }} USD</span>
                        <span v-else>
                          {{
                            parseFloat(token0_amount).toFixed(4) + " " + currentToken0.token.symbol
                          }}</span
                        >
                      </p>
                      <input
                        v-model="token0_temp"
                        v-on:keyup="token0Handler"
                        type="number"
                        step="0.0001"
                        class="custom-input text-right"
                        placeholder="0.0"
                      />
                    </div>
                  </div>

                  <div class="limit-market">
                    <div class="ml-2">
                      <div class="desc-muted" style="">
                        <span class="pr-3">Order Type</span>
                        <i
                          class="far fa-question-circle"
                          v-b-tooltip.hover.right="
                            'Place a limit order for a trade of these two assets to be excuted in the future at a specific price point.'
                          "
                        >
                        </i>
                      </div>
                      <div class="limit-market-tabs">
                        <p
                          class="desc-muted mb-0 pr-2"
                          v-bind:class="{ active: isActiveLimit }"
                          @click="limitMarket('limit')"
                        >
                          Limit
                        </p>
                        <div></div>
                        <p
                          class="desc-muted mb-0 pl-2"
                          v-bind:class="{ active: !isActiveLimit }"
                          @click="limitMarket('market')"
                        >
                          Market
                        </p>
                      </div>
                    </div>
                    <div
                      style="color: #098df4;font-size: 26px;cursor: pointer;"
                    >
                      <i
                        class="far fa-arrow-alt-circle-down"
                        @click="tabIndex++"
                      ></i>
                    </div>
                  </div>

                  <div class="rounded-div">
                    <div>
                      <p class="desc-muted mb-1 ml-2" v-if="!getWeb3.isInjected">No wallet connected</p>
                      <p class="desc-muted mb-1 ml-2" v-if="getWeb3.isInjected">Balance: {{currentToken1.balance}}</p>
                      <b-button
                        pill
                        variant="outline-success"
                        class="toggle-search"
                        size="md"
                        style="font-size: 17px;"
                        @click="toggleSearchbar"
                      >
                        <b-img
                          :src="currentToken1.token.image"
                          rounded="circle"
                          height="20"
                          alt="pair image"
                        ></b-img>
                        {{ currentToken1.token.symbol }}
                        <i class="mdi mdi-chevron-down"></i>
                      </b-button>
                    </div>
                    <div class="text-right">
                      <p
                        class="usd-p desc-muted mb-1"
                        style="cursor: pointer;"
                        @click="usdToken1"
                      >
                        <span v-if="isUSDToken1">{{ parseFloat(usd_amount).toFixed(4) }} USD</span>
                        <span v-else>
                          {{
                            parseFloat(token1_amount).toFixed(4) + " " + currentToken1.token.symbol
                          }}</span
                        >
                      </p>
                      <input
                        v-model="token1_temp"
                        v-on:keyup="token1Handler"
                        type="number"
                        step="0.0001"
                        class="custom-input text-right"
                        placeholder="0.0"
                      />
                    </div>
                  </div>

                  <div class="rounded-div" v-if="isActiveLimit">
                    <div
                      class="ml-2 d-flex align-items-center"
                    >
                      <p class="mb-0" style="font-size: 28px;">$</p>
                      <div class="ml-3">
                        <p class="desc-muted mb-0" style="line-height: 1;">
                          USD
                        </p>
                        <p class="mb-0" style="font-size: 17px;">BUY PRICE</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <input
                        v-model="buy_sell_price"
                        v-on:keyup="pricehandler"
                        type="number"
                        step="0.0001"
                        class="custom-input text-right"
                      />
                    </div>
                  </div>

                  <b-button
                    variant="outline-primary"
                    class="mt-4 mb-2"
                    block
                    size="lg"
                    v-b-modal.connect-wallet-modal
                    v-if="!getWeb3.isInjected"
                    >Connect Wallet</b-button
                  >
                  <b-button 
                    variant="outline-primary" 
                    class="mt-4 mb-2" 
                    block 
                    size="lg" 
                    v-if="getWeb3.isInjected && (token0_temp == 0 || currentToken0.balance < token0_amount)"
                    >Invalid Amount</b-button>
                  <b-button 
                    variant="outline-success" 
                    class="mt-4 mb-2" 
                    block 
                    size="lg" 
                    @click="pageIndex++" 
                    v-if="getWeb3.isInjected && token0_temp != 0 && currentToken0.balance >= token0_amount && isActiveLimit"
                    >Next</b-button>
                  <b-button 
                    variant="outline-success" 
                    class="mt-4 mb-2" 
                    block 
                    size="lg" 
                    @click="pageIndex+=2" 
                    v-if="getWeb3.isInjected && token0_temp != 0 && currentToken0.balance >= token0_amount && !isActiveLimit"
                    >Next</b-button>
                </div>
              </b-tab>
              <b-tab>
                <template v-slot:title>
                  <h3 class="sell desc-muted">Sell</h3>
                </template>
                <div>
                  <div class="rounded-div">
                    <div>
                      <p class="desc-muted mb-1 ml-2" v-if="!getWeb3.isInjected">No wallet connected</p>
                      <p class="desc-muted mb-1 ml-2" v-if="getWeb3.isInjected">Balance: {{currentToken1.balance}}</p>
                      <b-button
                        pill
                        variant="outline-success"
                        size="md"
                        style="font-size: 17px;"
                        @click="tokenFilterHandler"
                      >
                        <b-img
                          :src="currentToken1.token.image"
                          rounded="circle"
                          height="20"
                          alt="pair image"
                        ></b-img>
                        {{ currentToken1.token.symbol }}
                        <i class="mdi mdi-chevron-down"></i>
                      </b-button>
                    </div>
                    <div class="text-right">
                      <p
                        class="usd-p desc-muted mb-1"
                        style="cursor: pointer;"
                        @click="usdToken1"
                      >
                        <span v-if="isUSDToken1">{{ parseFloat(usd_amount).toFixed(4) }} USD</span>
                        <span v-else>
                          {{
                            parseFloat(token1_amount).toFixed(4) + " " + currentToken1.token.symbol
                          }}</span
                        >
                      </p>
                      <input
                        v-model="token1_temp"
                        v-on:keyup="token1Handler"
                        type="number"
                        step="0.0001"
                        class="custom-input text-right"
                        placeholder="0.0"
                      />
                    </div>
                  </div>

                  <div class="rounded-div" v-if="isActiveLimit">
                    <div
                      class="ml-2 d-flex align-items-center"
                    >
                      <p class="mb-0" style="font-size: 28px;">$</p>
                      <div class="ml-3">
                        <p class="desc-muted mb-0" style="line-height: 1;">
                          USD
                        </p>
                        <p class="mb-0" style="font-size: 17px;">SELL PRICE</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <input
                        v-model="buy_sell_price"
                        v-on:keyup="pricehandler"
                        type="number"
                        step="0.0001"
                        class="custom-input text-right"
                      />
                    </div>
                  </div>

                  <div class="limit-market">
                    <div class="ml-2">
                      <div class="desc-muted" style="">
                        <span class="pr-3">Order Type</span>
                        <i
                          class="far fa-question-circle"
                          v-b-tooltip.hover.right="
                            'Place a limit order for a trade of these two assets to be excuted in the future at a specific price point.'
                          "
                        >
                        </i>
                      </div>
                      <div class="limit-market-tabs">
                        <p
                          class="desc-muted mb-0 pr-2"
                          v-bind:class="{ active: isActiveLimit }"
                          @click="limitMarket('limit')"
                        >
                          Limit
                        </p>
                        <div></div>
                        <p
                          class="desc-muted mb-0 pl-2"
                          v-bind:class="{ active: !isActiveLimit }"
                          @click="limitMarket('market')"
                        >
                          Market
                        </p>
                      </div>
                    </div>
                    <div
                      style="color: #e6183a;font-size: 26px;cursor: pointer;"
                    >
                      <i
                        class="far fa-arrow-alt-circle-down"
                        @click="tabIndex--"
                      ></i>
                    </div>
                  </div>

                  <div class="rounded-div">
                    <div>
                      <p class="desc-muted mb-1 ml-2" v-if="!getWeb3.isInjected">No wallet connected</p>
                      <p class="desc-muted mb-1 ml-2" v-if="getWeb3.isInjected">Balance: {{currentToken0.balance}}</p>
                      <b-button
                        pill
                        variant="outline-success"
                        size="md"
                        class="toggle-search"
                        style="font-size: 17px;"
                        @click="toggleSearchbar"
                      >
                        <b-img
                          :src="currentToken0.token.image"
                          rounded="circle"
                          height="20"
                          alt="token image"
                        ></b-img>
                        {{ currentToken0.token.symbol }}
                        <i class="mdi mdi-chevron-down"></i>
                      </b-button>
                    </div>
                    <div class="text-right">
                      <p
                        class="usd-p desc-muted mb-1"
                        style="cursor: pointer;"
                        @click="usdToken0"
                      >
                        <span v-if="isUSDToken0">{{ parseFloat(usd_amount).toFixed(4) }} USD</span>
                        <span v-else>
                          {{
                            parseFloat(token0_amount).toFixed(4) + " " + currentToken0.token.symbol
                          }}</span
                        >
                      </p>
                      <input
                        v-model="token0_temp"
                        v-on:keyup="token0Handler"
                        type="number"
                        step="0.0001"
                        class="custom-input text-right"
                        placeholder="0.0"
                      />
                    </div>
                  </div>

                  <b-button
                    variant="outline-primary"
                    class="mt-4 mb-2"
                    block
                    size="lg"
                    v-b-modal.connect-wallet-modal
                    v-if="!getWeb3.isInjected"
                    >Connect Wallet</b-button
                  >
                  <b-button 
                    variant="outline-primary" 
                    class="mt-4 mb-2" 
                    block 
                    size="lg" 
                    v-if="getWeb3.isInjected && (token0_temp == 0 || currentToken0.balance < token0_amount)"
                    >Invalid Amount</b-button>
                  <b-button 
                    variant="outline-success" 
                    class="mt-4 mb-2" 
                    block 
                    size="lg" 
                    @click="pageIndex++" 
                    v-if="getWeb3.isInjected && token0_temp != 0 && currentToken0.balance >= token0_amount && isActiveLimit"
                    >Next</b-button>
                  <b-button 
                    variant="outline-success" 
                    class="mt-4 mb-2" 
                    block 
                    size="lg" 
                    @click="pageIndex+=2" 
                    v-if="getWeb3.isInjected && token0_temp != 0 && currentToken0.balance >= token0_amount && !isActiveLimit"
                    >Next</b-button>
                </div>
              </b-tab>
            </b-tabs>
            
            <div v-if="pageIndex==2 && isActiveLimit">
              <div class="my-3 d-flex align-items-center justify-content-center">
                <div class="d-flex align-items-center">
                  <b-img
                    :src="currentToken0.token.image"
                    rounded="circle"
                    height="35"
                    alt="image"
                  ></b-img>
                  <h4 class="ml-2 mb-0">{{ currentToken0.token.symbol }}</h4>
                </div>
                <i class="fas fa-long-arrow-alt-right px-4" style="font-size: 1.75rem;color: #098df4;"></i>
                <div class="d-flex align-items-center">
                  <b-img
                    :src="currentToken1.token.image"
                    rounded="circle"
                    height="35"
                    alt="image"
                  ></b-img>
                  <h4 class="ml-2 mb-0">{{ currentToken1.token.symbol }}</h4>
                </div>
              </div>

              <div class="text-center desc-muted mb-3">
                <span class="pr-5">{{ token0_amount +" "+ currentToken0.token.symbol }}</span>
                <span>{{ token1_amount +" "+ currentToken1.token.symbol }}</span>
              </div>

              <div class="form-group">
                <label class="col-form-label">
                  <strong style="font-size: 17px;">Processing Fee</strong>
                  <span class="desc-muted pl-2"><i class="far fa-question-circle" v-b-tooltip.hover.right="'Help'"></i></span>
                </label>
                <div class="d-flex align-items-center">
                  <b-dropdown id="dropdown-right" right variant="secondary" class="w-100">
                    <template slot="button-content">
                      <div class="row">
                        <div class="col-4" style="font-size: 20px;" :style="{ color: selectedFee.color }">{{selectedFee.title}}</div>
                        <div class="col-4" style="font-size: 20px;color: #e9ecef;">${{selectedFee.usd}}</div>
                        <div class="col-4 desc-muted" style="line-height: 30px;">{{selectedFee.gwei}} Gwei</div>
                      </div>
                      <i class="mdi mdi-chevron-up"></i>
                    </template>
                    <b-dropdown-item href="#" v-for="(option, index) in gasFeeOptions" :key="index" @click="selectFee(option)">
                      <div class="row">
                        <div class="col-4" style="font-size: 20px;" :style="{ color: option.color }">{{option.title}}</div>
                        <div class="col-6" style="font-size: 20px;color: #e9ecef;">${{option.usd}}USD</div>
                        <div class="col-2 desc-muted">{{option.gwei}}<br>Gwei</div>
                      </div>
                    </b-dropdown-item>
                  </b-dropdown>
                  <i class="mdi mdi-settings-outline mx-3" style="font-size: 20px;cursor: pointer;" v-b-modal.gas-modal></i>
                </div>
              </div>

              <div class="d-flex">
                <b-button variant="outline-primary" class="mt-4 mb-2 mr-4" block size="lg" @click="pageIndex--">Back</b-button>
                <b-button variant="outline-success" class="mt-4 mb-2" block size="lg" @click="pageIndex++">Next</b-button>
              </div>
            </div>

            <div v-if="pageIndex==3">
              <div class="my-3 d-flex align-items-center justify-content-center">
                <h4 class="mb-0" v-if="isActiveLimit">Limit Order</h4>
                <h4 class="mb-0" v-else>Market Order</h4>
                <i class="fas fa-long-arrow-alt-right px-4" style="font-size: 1.75rem;"></i>
                <h4 class="mb-0">Buy</h4>
              </div>

              <div class="rounded-div align-items-center">
                <div class="d-flex align-items-center">
                  <b-img
                    :src="currentToken0.token.image"
                    rounded="circle"
                    height="35"
                    alt="image"
                  ></b-img>
                  <h4 class="ml-2 mb-0">{{ currentToken0.token.symbol }}</h4>
                </div>
                <div class="text-right">
                  <p class="desc-muted mb-0" style="line-height: 1;">
                    {{ parseFloat(usd_amount).toFixed(4) }} USD
                  </p>
                  <p class="mb-0" style="font-size: 20px;">
                    {{ parseFloat(token0_amount).toFixed(4) }}
                  </p>
                </div>
              </div>

              <div class="text-right pr-3" style="margin-bottom: 16px;">
                <i class="far fa-arrow-alt-circle-down" style="color: #098df4;font-size: 26px;cursor: pointer;"></i>
              </div>

              <div style="margin-bottom: 16px;border: 1px solid #5f666d;border-radius: 0.35rem;">
                <div class="rounded-div mb-0 align-items-center">
                  <div class="d-flex align-items-center">
                    <b-img
                      :src="currentToken1.token.image"
                      rounded="circle"
                      height="35"
                      alt="image"
                    ></b-img>
                    <h4 class="ml-2 mb-0">{{ currentToken1.token.symbol }}</h4>
                  </div>
                  <div class="text-right">
                    <p class="mb-0" style="font-size: 20px;">
                      {{ parseFloat(token1_amount).toFixed(4) }}
                    </p>
                    <p class="desc-muted mb-0" style="line-height: 1;">
                      estimated
                    </p>
                  </div>
                </div>
                <div class="d-flex justify-content-between" style="padding: 9px 20px;">
                  <p class="mb-0" style="font-size: 20px;">
                    Price
                  </p>
                  <p class="mb-0" style="font-size: 20px;">
                    $ {{ buy_sell_price }}
                  </p>
                </div>
              </div>

              <div class="rounded-div align-items-center" v-if="isActiveLimit">
                <h4 class="mb-0">Processing Fee</h4>
                <div class="text-right">
                  <p class="desc-muted mb-0" style="line-height: 1;">
                    {{ selectedFee.eth + " ETH" }}
                  </p>
                  <p class="mb-0" style="font-size: 20px;">
                    $ {{ selectedFee.usd }}
                  </p>
                </div>
              </div>

              <div class="rounded-div align-items-center">
                <h4 class="mb-0">Total</h4>
                <div class="text-right">
                  <p class="desc-muted mb-0" style="line-height: 1;">
                    {{ parseFloat(parseFloat(usd_amount) + parseFloat(selectedFee.usd)).toFixed(4) }} USD
                  </p>
                  <p class="mb-0" style="font-size: 20px;" v-if="currentToken0.token.symbol=='WETH' || currentToken0.token.symbol=='ETH'">
                    {{ parseFloat(parseFloat(token0_amount) + parseFloat(selectedFee.eth)).toFixed(4) }} ETH
                  </p>
                  <p class="mb-0" style="font-size: 20px;" v-else>
                    {{ parseFloat(selectedFee.eth).toFixed(4) + " ETH" + " + " + parseFloat(token0_amount).toFixed(4) + " " + currentToken0.token.symbol }}
                  </p>
                </div>
              </div>
              <div class="d-flex">
                <b-button variant="outline-primary" class="mt-4 mb-2 mr-4" block size="lg" v-if="isActiveLimit" @click="pageIndex--">Back</b-button>
                <b-button variant="outline-primary" class="mt-4 mb-2 mr-4" block size="lg" v-if="!isActiveLimit" @click="pageIndex-=2">Back</b-button>
                <b-button variant="outline-success" class="mt-4 mb-2" block size="lg">Submit</b-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="ml-5 mb-3">
        <i class="ti-reload" style="color: #02a499;"></i>
        <span class="desc-muted pl-2">updated 2 days ago</span>
      </div>
    </div>
    <!-- token-modal -->
    <b-modal id="token-modal" centered hide-header hide-footer>
      <div class="app-search">
        <div class="position-relative">
          <input
            v-model="token_filter_by"
            type="text"
            v-on:change="findTokenInfoByCondition"
            class="form-control"
            placeholder="Search pairs..."
          />
          <span class="ti-search"></span>
        </div>
      </div>
      <div
        class="d-flex justify-content-between"
        style="font-size: 17px;font-weight: 500;padding: 0 8px;"
      >
        <p>Token</p>
        <p>Liquidity</p>
      </div>
      <ul class="token-ul">
        <li
          class="token-li"
          v-for="(tokenItem, index) in filtered_tokenItems"
          :key="index"
          @click="selectToken(tokenItem)"
        >
          <div class="d-flex align-items-center">
            <b-img
              :src="tokenItem.image"
              rounded="circle"
              height="35"
              alt="token image"
            ></b-img>
            <span class="pl-3"
              >{{ tokenItem.name | truncate(10) }}({{ tokenItem.symbol | truncate(6) }})</span
            >
          </div>
          <div>
            <span>${{ parseFloat(tokenItem.totalLiquidity).toFixed(2) }}</span>
          </div>
        </li>
      </ul>
    </b-modal>
    <!-- end -->
    <!-- connect wallet modal -->
    <b-modal
      id="connect-wallet-modal"
      title="Connect Wallet"
      centered
      hide-footer
    >
      <ul class="">
        <li
          v-for="(walletItem, index) in walletItems"
          :key="index"
          class=""
          @click="selectWallet(walletItem)"
        >
          <div>
            {{ walletItem.wallet }}
          </div>
          <div>
            <b-img
              :src="
                require('@/assets/images/services-icon/' +
                  walletItem.img +
                  '.png')
              "
              height="25"
              alt="wallet image"
            ></b-img>
          </div>
        </li>
      </ul>
      <div class="text-center mb-3">
        <span>New to Ethereum?</span>
        <router-link to="/">Learn more about wallets</router-link>
      </div>
    </b-modal>
    <!-- end -->
    <!-- gas-modal -->
    <b-modal
      id="gas-modal"
      size="sm"
      centered
      hide-header
      hide-footer
    >
      <h4 class="mb-3">Custom Gas(GWEI)</h4>
      <p>You can input a custom amount that you with to pay for gas for your future transaction. However it is recommended to select from the dropdown box as the amounts are averaged and calculated for you.</p>
      <input
        v-model="custom_gas"
        type="number"
        step="0.01"
        class="form-control"
        style="color: #e9ecef;font-size: 20px;"
      />
      <b-button variant="outline-primary" class="mt-4 mb-2 mr-4 disabled" block size="md" v-if="custom_gas == 0">Save</b-button>
      <b-button variant="outline-primary" class="mt-4 mb-2 mr-4" block size="md" @click="customGasSave" v-else>Save</b-button>
    </b-modal>
    <!-- end -->
  </Layout>
</template>
<style>
.main-content {
  position: relative;
}
.vld-overlay {
  top: -300px;
}
.header-title {
  display: flex;
  align-items: center;
}
.wallet-info-div {
  font-size: 14px;
  border-radius: 20px;
  border: 2px solid white;
  height: 40px;
  min-width: 170px;
  text-align: center;
  padding: 8px 20px;
  line-height: 20px;
}
.wallet-address {
  cursor: pointer;
}
.wallet-address:hover {
  color: #e9ecef;
}
.tab-content {
  padding: 16px 0 0 0 !important;
}
.nav-tabs {
  border-bottom: none;
}
.nav-tabs .nav-link {
  border: none;
}
.nav-tabs .nav-link.active {
  border: none;
  background: transparent;
}
.nav-tabs .nav-link:hover,
.nav-tabs .nav-link:focus {
  border: none;
}
.nav-tabs .nav-link .buy:hover {
  color: #e9ecef;
}
.nav-tabs .nav-link .sell:hover {
  color: #e9ecef;
}
.nav-tabs .nav-link.active .buy {
  color: #098df4;
}
.nav-tabs .nav-link.active .sell {
  color: #e6183a;
}
.btn-lg {
  font-size: 25px;
}
.desc-muted {
  color: #9ca8b3;
}
.rounded-div {
  display: flex;
  justify-content: space-between;
  background: #222736;
  padding: 9px 20px;
  border-radius: 0.35rem;
  border: 1px solid #5f666d;
  margin-bottom: 16px;
}
.custom-input {
  background: transparent;
  font-size: 26px;
  max-width: 220px;
  border: 0;
  color: #e9ecef;
}
.custom-input:focus {
  outline: none;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
#token-modal .app-search .form-control {
  font-size: 24px;
  color: #e9ecef;
  height: 50px;
  padding-left: 25px;
  padding-right: 25px;
}
#token-modal .app-search span {
  font-size: 21px;
  color: #9ca8b3;
  line-height: 50px;
}
#token-modal .app-search .form-control::placeholder {
  color: #9ca8b3;
  opacity: 0.8;
}
.modal {
  left: -105px;
}
@media (max-width: 1200px) {
  .modal {
    left: -85px;
  }
  #token-modal .modal-dialog {
    width: 450px;
  }
}
@media (max-width: 768px) {
  .modal {
    left: 35px;
  }
}
#connect-wallet-modal .modal-dialog {
  width: 450px;
}
#connect-wallet-modal .modal-header {
  background: #252627;
}
.token-ul {
  list-style: none;
  padding: 0 8px;
}
.token-li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  cursor: pointer;
}
.token-li:hover {
  background: #3a425a;
}
.token-li span {
  font-size: 20px;
}
.limit-market {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 9px 20px;
  margin-bottom: 16px;
}
.limit-market-tabs {
  font-size: 20px;
  display: flex;
  align-items: center;
}
.limit-market-tabs p {
  cursor: pointer;
}
.limit-market-tabs .active {
  color: #e9ecef;
}
.limit-market-tabs div {
  border-right: 1px solid #e9ecef;
  height: 14px;
}
.usd-p:hover {
  color: #e9ecef;
}
#connect-wallet-modal ul {
  list-style: none;
  padding: 0 12px;
  margin-top: 1rem;
}
#connect-wallet-modal ul li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  cursor: pointer;
  border: 1px solid #9ca8b3;
  border-radius: 0.35em;
  font-size: 18px;
  margin-bottom: 12px;
}
#connect-wallet-modal ul li:hover {
  background: #252627;
}
#dropdown-right button {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#dropdown-right ul {
  width: 100%;
}
</style>
