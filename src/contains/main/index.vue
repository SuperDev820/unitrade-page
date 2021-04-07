<script>
	import Layout from "../layout/main_layout";
  import appConfig from "@/app.config";
  import Loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/vue-loading.css';

  import { mapActions, mapGetters } from 'vuex';

	export default {
		page: {
        title: "Exchange",
        meta: [{ name: "description", content: appConfig.description }]
    },
    components: {
      Layout,
      Loading,
    },
    data() {
      return {
        isLoading: false,
        tabIndex: 1,
        walletItems: [
          {
            'wallet': 'MetaMask',
            'img': 'metamask'
          },
          {
            'wallet': 'Wallet Connect',
            // 'img': 'wallet-conect'
            'img': 'metamask'
          },
          {
            'wallet': 'Coinbase Wallet',
            // 'img': 'coinbase'
            'img': 'metamask'
          },
          {
            'wallet': 'Fortmatic',
            // 'img': 'fortmatic'
            'img': 'metamask'
          },
          {
            'wallet': 'Portis',
            // 'img': 'portis'
            'img': 'metamask'
          },
        ],
        wallet_address: "d7f8d7f8sd7f8sd7f8sd78f78asdf",
        token_filter_by: '',
        filtered_tokenItems: [],
        isActiveLimit: true,
        isActiveMarket: false,
        usd_amount: '0.0000',
        token_amount: '0.0',
        token_temp: '0.0',
        isUSDToken: true,
        pair_amount: '0.0',
        pair_temp: '0.0',
        isUSDPair: true,
        buy_price: '0.0000',
        current_wallet: '',
      }
    },
    computed: {
      ...mapGetters([
        'currentToken',
        'currentPair',
        'tokenItems',
      ]),
    },
    mounted() {
    },
    methods: {
      ...mapActions([
        'setToken',
        'setPair',
      ]),
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
          this.isActiveMarket = true;
        } else if (text == "limit") {
          this.isActiveLimit = true;
          this.isActiveMarket = false;
        }
      },
      usdToken() {
        if (this.isUSDToken) {
          this.token_amount = this.token_temp;
          this.token_temp = this.usd_amount;
          this.isUSDToken = false;
        } else {
          this.token_temp = this.token_amount;
          this.isUSDToken = true;
        }
      },
      selectToken(tokenItem) {
        // console.log(this.tabIndex)
        if (this.tabIndex == 0) {
          this.setToken(tokenItem);
        } else if (this.tabIndex == 1) {
          this.setPair(tokenItem);
        }
        this.$bvModal.hide('token-modal');
        this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false
        },2000)
      },
      usdPair() {
        if (this.isUSDPair) {
          this.pair_amount = this.pair_temp;
          this.pair_temp = this.usd_amount;
          this.isUSDPair = false;
        } else {
          this.pair_temp = this.pair_amount;
          this.isUSDPair = true;
        }
      },
      selectPair(pairItem) {
        // console.log(this.tabIndex)
        if (this.tabIndex == 1) {
          this.setToken(pairItem);
        } else if (this.tabIndex == 0) {
          this.setPair(pairItem);
        }
        this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false
        },2000)
      },
      selectWallet(walletItem) {
        this.current_wallet = walletItem.wallet;
        this.$bvModal.hide('connect-wallet-modal');
      },
      tokenFilterHandler() {
        this.filtered_tokenItems = [];
        this.tokenItems.forEach((item) => {
          if ((item.name.includes(this.token_filter_by)) || (item.description.includes(this.token_filter_by))) {
            this.filtered_tokenItems.push(item);
          }
        })
      },
    }
	};
</script>
<template>
  <Layout>
    <loading :active.sync="isLoading" 
      :is-full-page="false"
      :background-color="'#222736'"
      :color="'#38a4f8'"
      :opacity="1"
      :z-index="9997"
    ></loading>
    <div style="display: flex;flex-direction: column;justify-content: space-between;">
      <div class="ml-2">
        <div class="header-title mb-3">
          <b-img
            :src="require('@/assets/images/services-icon/'+ currentPair.name +'.png')"
            rounded="circle"
            height="40"
            alt="image"
          ></b-img>
          <h1 class="ml-3 mb-0">{{ currentPair.description +'  '+ currentPair.name + '  $' + currentPair.liquidity }}</h1>
        </div>
        <a href="#" class="desc-muted wallet-address">{{ wallet_address }}</a>
        <div class="mt-2">
          <a href="https://unitrade.app/" class="desc-muted mr-3">https://unitrade.app/</a>
          <a href="https://twitter.com/" class="desc-muted"><i class="ti-twitter-alt"></i></a>
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
            <b-tabs justified class="navtab-bg" content-class="p-3" v-model="tabIndex">
              <b-tab active>
                <template v-slot:title>
                  <h3 class="buy desc-muted">Buy</h3>
                </template>
                <div>
                  <div class="rounded-div">
                    <div>
                      <p class="desc-muted mb-1 ml-2">No wallet connected</p>
                      <b-button pill variant="outline-success" size="md" style="font-size: 17px;" v-b-modal.token-modal>
                        <b-img
                          :src="require('@/assets/images/services-icon/'+ currentToken.name +'.png')"
                          rounded="circle"
                          height="20"
                          alt="token image"
                        ></b-img>
                        {{ currentToken.name }}
                        <i class="mdi mdi-chevron-down"></i>
                      </b-button>
                    </div>
                    <div class="text-right">
                      <p class="usd-p desc-muted mb-1" style="cursor: pointer;" @click="usdToken">
                        <span v-if="isUSDToken">{{ usd_amount }} USD</span>
                        <span v-else> {{ token_amount +" "+ currentToken.name }}</span>
                      </p>
                      <input
                        v-model="token_temp"
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
                        <i class="far fa-question-circle" 
                          v-b-tooltip.hover.right="'Place a limit order for a trade of these two assets to be excuted in the future at a specific price point.'">
                        </i>
                      </div>
                      <div class="limit-market-tabs">
                        <p class="desc-muted mb-0 pr-2" v-bind:class="{ active: isActiveLimit }" @click="limitMarket('limit')">Limit</p>
                        <div></div>
                        <p class="desc-muted mb-0 pl-2" v-bind:class="{ active: isActiveMarket }" @click="limitMarket('market')">Market</p>
                      </div>
                    </div>
                    <div style="color: #098df4;font-size: 26px;cursor: pointer;">
                      <i class="far fa-arrow-alt-circle-down" @click="tabIndex++"></i>
                    </div>
                  </div>

                  <div class="rounded-div">
                    <div>
                      <p class="desc-muted mb-1 ml-2">No wallet connected</p>
                      <b-button pill variant="outline-success" class="toggle-search" size="md" style="font-size: 17px;" @click="toggleSearchbar">
                        <b-img
                          :src="require('@/assets/images/services-icon/'+ currentPair.name +'.png')"
                          rounded="circle"
                          height="20"
                          alt="pair image"
                        ></b-img>
                        {{ currentPair.name }}
                        <i class="mdi mdi-chevron-down"></i>
                      </b-button>
                    </div>
                    <div class="text-right">
                      <p class="usd-p desc-muted mb-1" style="cursor: pointer;" @click="usdPair">
                        <span v-if="isUSDPair">{{ usd_amount }} USD</span>
                        <span v-else> {{ pair_amount +" "+ currentPair.name }}</span>
                      </p>
                      <input
                        v-model="pair_temp"
                        type="number"
                        step="0.0001"
                        class="custom-input text-right"
                        placeholder="0.0"
                      />
                    </div>
                  </div>

                  <div class="rounded-div" v-if="isActiveLimit">
                    <div class="ml-2" style="display: flex;align-items: center;">
                      <p class="mb-0" style="font-size: 28px;">$</p>
                      <div class="ml-3">
                        <p class="desc-muted mb-0" style="line-height: 1;">USD</p>
                        <p class="mb-0" style="font-size: 17px;">BUY PRICE</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <input
                        v-model="buy_price"
                        type="number"
                        step="0.0001"
                        class="custom-input text-right"
                      />
                    </div>
                  </div>

                  <b-button variant="outline-primary" class="mt-4 mb-2" block size="lg" v-b-modal.connect-wallet-modal>Connect Wallet</b-button>
                </div>
              </b-tab>
              <b-tab>
                <template v-slot:title>
                  <h3 class="sell desc-muted">Sell</h3>
                </template>
                <div>
                  <div class="rounded-div">
                    <div>
                      <p class="desc-muted mb-1 ml-2">No wallet connected</p>
                      <b-button pill variant="outline-success" size="md" style="font-size: 17px;" v-b-modal.token-modal>
                        <b-img
                          :src="require('@/assets/images/services-icon/'+ currentPair.name +'.png')"
                          rounded="circle"
                          height="20"
                          alt="pair image"
                        ></b-img>
                        {{ currentPair.name }}
                        <i class="mdi mdi-chevron-down"></i>
                      </b-button>
                    </div>
                    <div class="text-right">
                      <p class="usd-p desc-muted mb-1" style="cursor: pointer;" @click="usdPair">
                        <span v-if="isUSDPair">{{ usd_amount }} USD</span>
                        <span v-else> {{ pair_amount +" "+ currentPair.name }}</span>
                      </p>
                      <input
                        v-model="pair_temp"
                        type="number"
                        step="0.0001"
                        class="custom-input text-right"
                        placeholder="0.0"
                      />
                    </div>
                  </div>

                  <div class="rounded-div" v-if="isActiveLimit">
                    <div class="ml-2" style="display: flex;align-items: center;">
                      <p class="mb-0" style="font-size: 28px;">$</p>
                      <div class="ml-3">
                        <p class="desc-muted mb-0" style="line-height: 1;">USD</p>
                        <p class="mb-0" style="font-size: 17px;">SELL PRICE</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <input
                        v-model="buy_price"
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
                        <i class="far fa-question-circle" 
                          v-b-tooltip.hover.right="'Place a limit order for a trade of these two assets to be excuted in the future at a specific price point.'">
                        </i>
                      </div>
                      <div class="limit-market-tabs">
                        <p class="desc-muted mb-0 pr-2" v-bind:class="{ active: isActiveLimit }" @click="limitMarket('limit')">Limit</p>
                        <div></div>
                        <p class="desc-muted mb-0 pl-2" v-bind:class="{ active: isActiveMarket }" @click="limitMarket('market')">Market</p>
                      </div>
                    </div>
                    <div style="color: #e6183a;font-size: 26px;cursor: pointer;">
                      <i class="far fa-arrow-alt-circle-down" @click="tabIndex--"></i>
                    </div>
                  </div>
                  
                  <div class="rounded-div">
                    <div>
                      <p class="desc-muted mb-1 ml-2">No wallet connected</p>
                      <b-button pill variant="outline-success" size="md" class="toggle-search" style="font-size: 17px;" @click="toggleSearchbar">
                        <b-img
                          :src="require('@/assets/images/services-icon/'+ currentToken.name +'.png')"
                          rounded="circle"
                          height="20"
                          alt="token image"
                        ></b-img>
                        {{ currentToken.name }}
                        <i class="mdi mdi-chevron-down"></i>
                      </b-button>
                    </div>
                    <div class="text-right">
                      <p class="usd-p desc-muted mb-1" style="cursor: pointer;" @click="usdToken">
                        <span v-if="isUSDToken">{{ usd_amount }} USD</span>
                        <span v-else> {{ token_amount +" "+ currentToken.name }}</span>
                      </p>
                      <input
                        v-model="token_temp"
                        type="number"
                        step="0.0001"
                        class="custom-input text-right"
                        placeholder="0.0"
                      />
                    </div>
                  </div>

                  <b-button variant="outline-primary" class="mt-4 mb-2" block size="lg" v-b-modal.connect-wallet-modal>Connect Wallet</b-button>
                </div>
              </b-tab>
            </b-tabs>
          </div>
        </div>
      </div>
      <div class="ml-5 mb-3">
        <i class="ti-reload" style="color: #02a499;"></i>
        <span class="desc-muted pl-2">updated 2 days ago</span>
      </div>
    </div>
    <!-- token-modal -->
    <b-modal
      id="token-modal"
      centered
      hide-header
      hide-footer
    >
      <div class="app-search">
        <div class="position-relative">
          <input v-model="token_filter_by" type="text" v-on:keyup="tokenFilterHandler" class="form-control" placeholder="Search pairs..." />
          <span class="ti-search"></span>
        </div>
      </div>
      <div style="display: flex;justify-content: space-between;font-size: 17px;font-weight: 500;padding: 0 8px;">
        <p>Token</p>
        <p>Liquidity</p>
      </div>
      <ul class="token-ul">
        <li class="token-li" v-for="(tokenItem, index) in filtered_tokenItems" :key="index" @click="selectToken(tokenItem)">
          <div style="display: flex;align-items: center;">
            <b-img
              :src="require('@/assets/images/services-icon/' + tokenItem.name + '.png')"
              rounded="circle"
              height="35"
              alt="token image"
            ></b-img>
            <span class="pl-3">{{ tokenItem.description }}({{ tokenItem.name }})</span>
          </div>
          <div>
            <span>${{ tokenItem.liquidity }}</span>
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
        <li v-for="(walletItem, index) in walletItems" :key="index" class="" @click="selectWallet(walletItem)">
          <div>
            {{ walletItem.wallet }}
          </div>
          <div>
            <b-img
              :src="require('@/assets/images/services-icon/' + walletItem.img + '.png')"
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
  .nav-tabs .nav-link:hover, .nav-tabs .nav-link:focus {
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
</style>