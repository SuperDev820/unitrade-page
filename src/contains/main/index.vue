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
        isConnectedWallet: true,
        pageIndex: 1,
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
        fee_usd: 0.0,
        fee_token: 0.0000,
        fee_options: [
          {
            title: 'Slow',
            color: '#e6183a',
            usd: 85.77,
            gwei: 123.35,
          },
          {
            title: 'Medium',
            color: '#f8b425',
            usd: 120.07,
            gwei: 172.70,
          },
          {
            title: 'Fast',
            color: '#01726a',
            usd: 154.38,
            gwei: 224.04,
          },
        ],
        selectedFee: {},
        custom_gas: '',
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
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false
      },2000)
      this.selectedFee = {...this.fee_options[0]};
      if (window.screen.width <= 768) {
        document.body.classList.remove("right-bar-enabled");
      }
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
      selectFee(option) {
        this.selectedFee = {...option}
        console.log(this.selectedFee)
      },
      customGasSave() {
        this.fee_options.push({
            title: 'Custom',
            color: '#3a49c9',
            usd: 13.99,
            gwei: this.custom_gas,
          });
        this.$bvModal.hide("gas-modal");
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
    <div class="d-flex justify-content-between flex-column">
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
        <div class="card m-0" style="width: 440px;">
          <div class="card-body">
            <b-tabs justified class="navtab-bg" content-class="p-3" v-model="tabIndex" v-if="pageIndex==1">
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
                      <div class="desc-muted">
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
                    <div class="ml-2 d-flex align-items-center">
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

                  <b-button variant="outline-primary" class="mt-4 mb-2" block size="lg" v-b-modal.connect-wallet-modal v-if="!isConnectedWallet">Connect Wallet</b-button>
                  <b-button variant="outline-success" class="mt-4 mb-2" block size="lg" @click="pageIndex++" v-if="isConnectedWallet">Next</b-button>
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
                    <div class="ml-2 d-flex align-items-center">
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
                      <div class="desc-muted">
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

                  <b-button variant="outline-primary" class="mt-4 mb-2" block size="lg" v-b-modal.connect-wallet-modal v-if="!isConnectedWallet">Connect Wallet</b-button>
                  <b-button variant="outline-success" class="mt-4 mb-2" block size="lg" @click="pageIndex++" v-if="isConnectedWallet">Next</b-button>
                </div>
              </b-tab>
            </b-tabs>

            <div v-if="pageIndex==2">
              <div class="my-3 d-flex align-items-center justify-content-center">
                <div class="d-flex align-items-center">
                  <b-img
                    :src="require('@/assets/images/services-icon/'+ currentToken.name +'.png')"
                    rounded="circle"
                    height="35"
                    alt="image"
                  ></b-img>
                  <h4 class="ml-2 mb-0">{{ currentToken.name }}</h4>
                </div>
                <i class="fas fa-long-arrow-alt-right px-4" style="font-size: 1.75rem;color: #098df4;"></i>
                <div class="d-flex align-items-center">
                  <b-img
                    :src="require('@/assets/images/services-icon/'+ currentPair.name +'.png')"
                    rounded="circle"
                    height="35"
                    alt="image"
                  ></b-img>
                  <h4 class="ml-2 mb-0">{{ currentPair.name }}</h4>
                </div>
              </div>

              <div class="text-center desc-muted mb-3">
                <span class="pr-5">{{ token_amount +" "+ currentToken.name }}</span>
                <span>{{ pair_amount +" "+ currentPair.name }}</span>
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
                    <b-dropdown-item href="#" v-for="(option, index) in fee_options" :key="index" @click="selectFee(option)">
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
                <h4 class="mb-0">Limit Order</h4>
                <i class="fas fa-long-arrow-alt-right px-4" style="font-size: 1.75rem;"></i>
                <h4 class="mb-0">Buy</h4>
              </div>

              <div class="rounded-div align-items-center">
                <div class="d-flex align-items-center">
                  <b-img
                    :src="require('@/assets/images/services-icon/'+ currentToken.name +'.png')"
                    rounded="circle"
                    height="35"
                    alt="image"
                  ></b-img>
                  <h4 class="ml-2 mb-0">{{ currentToken.name }}</h4>
                </div>
                <div class="text-right">
                  <p class="desc-muted mb-0" style="line-height: 1;">
                    {{ usd_amount }} USD
                  </p>
                  <p class="mb-0" style="font-size: 20px;">
                    {{ token_amount }}
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
                      :src="require('@/assets/images/services-icon/'+ currentPair.name +'.png')"
                      rounded="circle"
                      height="35"
                      alt="image"
                    ></b-img>
                    <h4 class="ml-2 mb-0">{{ currentPair.name }}</h4>
                  </div>
                  <div class="text-right">
                    <p class="mb-0" style="font-size: 20px;">
                      {{ pair_amount }}
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
                    $ 353.6008
                  </p>
                </div>
              </div>

              <div class="rounded-div align-items-center">
                <h4 class="mb-0">Processing Fee</h4>
                <div class="text-right">
                  <p class="desc-muted mb-0" style="line-height: 1;">
                    {{ fee_token +" "+ currentToken.name }}
                  </p>
                  <p class="mb-0" style="font-size: 20px;">
                    $ {{ fee_usd }}
                  </p>
                </div>
              </div>

              <div class="rounded-div align-items-center">
                <h4 class="mb-0">Total</h4>
                <div class="text-right">
                  <p class="desc-muted mb-0" style="line-height: 1;">
                    {{ fee_usd + usd_amount }} USD
                  </p>
                  <p class="mb-0" style="font-size: 20px;">
                    {{ fee_token + token_amount }} {{ currentToken.name }}
                  </p>
                </div>
              </div>
              <div class="d-flex">
                <b-button variant="outline-primary" class="mt-4 mb-2 mr-4" block size="lg" @click="pageIndex--">Back</b-button>
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
      <div class="d-flex justify-content-between" style="font-size: 17px;padding: 0 8px;font-weight: 500;">
          <p>Token</p>
          <p>Liquidity</p>
      </div>
      <ul class="token-ul">
        <li class="token-li" v-for="(tokenItem, index) in filtered_tokenItems" :key="index" @click="selectToken(tokenItem)">
          <div class="d-flex align-items-center">
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
      <b-button variant="outline-primary" class="mt-4 mb-2 mr-4" block size="md" @click="customGasSave">Save</b-button>
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
    border: 1px solid #5f666d;
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
    #connect-wallet-modal .modal-dialog {
      width: 450px;
    }
  }
  @media (max-width: 768px) {
    .modal {
      left: 35px;
    }
  }
  @media (min-width: 576px) {
    .modal-sm {
        max-width: 360px;
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