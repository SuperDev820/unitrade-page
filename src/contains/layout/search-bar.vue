<script>
/**
 * Search sidebar component
 */
 Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import axios from "axios";
import { mapActions, mapGetters } from "vuex";
const all_tokens = require("../tokenlist_2.json");
const allow_tokens = require("../allowlist.json");
import {
  TOKEN_INFO_QUERY,
  FIND_TOKEN_BY_KEY_QUERY,
} from "../../graphql/queries/query";
export default {
  components: {
    Loading,
  },
  data() {
    return {
      config: {
        handler: this.handleSearchBarClick,
        middleware: this.middleware,
        events: ["click"],
      },
      isLoading: false,
      token_filter_by: "",
      searchPairs: [],
      isSearch: false,
    };
  },
  computed: {
    ...mapGetters([
      "recentTokenList",
      "trendTokenList",
      "foundTokenList",
      "ethPrice",
    ]),
  },
  methods: {
    ...mapActions(["setTrendTokens", "setRecentTokens", "setFoundTokens"]),
    hide() {
      this.$parent.toggleSearchbar();
    },
    // eslint-disable-next-line no-unused-vars
    handleSearchBarClick(e, el) {
      this.token_filter_by = "";
      this.isSearch = false;
      this.$parent.hideSearchbar();
    },
    // eslint-disable-next-line no-unused-vars
    middleware(event, el) {
      return !event.target.classList.contains("toggle-search");
    },
    getTokenInfo(addr) {
      const item = this.state.all_tokenList.find(
        (element) => element.address == addr
      );
      return item;
    },

    selectPair(item) {
      // console.log(item)
      this.token_filter_by = "";
      this.isSearch = false;
      this.recentTokenList.push(item);
      this.setRecentTokens(this.recentTokenList);
      this.$parent.$parent.selectPair(item);
      this.hide();
    },

    tokenFilterHandler() {
      this.isSearch = true;
      this.isLoading = true;
      this.searchPairs = [];
      if (this.token_filter_by !== "") {
        this.findTokenInfoByCondition(this.token_filter_by);
      } else {
        this.isSearch = false;
      }
      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
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

        if (selToken && selToken.data && selToken.data.tokens.length >0) {
        //console.log(selToken.data.tokens[0])
          let tokenInfo = selToken.data.tokens[0];
          let selAddr = allow_tokens.find(
            (token) => token.toLowerCase() == address.toLowerCase()
          );
          tokenInfo.address = selAddr ? selAddr : tokenInfo.id;

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

    async getTokenInfoById(tokenitem) {
      let selToken = all_tokens.find(
        (token) =>
          token.platforms.ethereum &&
          token.name.toLowerCase() == tokenitem.name.toLowerCase() &&
          token.symbol.toLowerCase() == tokenitem.symbol.toLowerCase()
      );

      if (selToken) {
        let tokenInfo = await this.getTokenInfoByAddress(
          selToken.platforms.ethereum,
          null
        );
        return tokenInfo;
      }
      return null;
    },
    
    async findTrendTokens() {
        let trendTokenList = await axios.get(
            "https://api.coingecko.com/api/v3/search/trending"
        );
        if (trendTokenList.status == 200) {
            let newTrendTokenList = [];
            trendTokenList.data.coins.forEach(async (element) => {
                let item = await this.getTokenInfoById(element.item);
                if (item) newTrendTokenList.push(item);
            });
            this.setTrendTokens(newTrendTokenList);
        }
    },
    
    async findTokenInfoByCondition(key) {
        if(key.indexOf("0x")!==-1) key = key.toLowerCase();
        console.log(key)
        const items = await this.$apollo.query({
          query: FIND_TOKEN_BY_KEY_QUERY,
          variables: {
            asSymbol: key,
            asAddress: key,
            asName:key,
          },
        });

        let temp = [];
        //if(items.data.address) temp.push(items.data.address);
        let foundList =[...temp,...items.data.addresses,...items.data.symbol];//,...items.data.name];
        foundList = foundList.concat(items.data.name).unique();
        console.log(items);
        let newFoundTokenList = [];
        var loopCount = foundList.length > 10 ? 10 : foundList.length;
        for(let i = 0; i < loopCount ; i++){
          let item = await this.getTokenInfoByAddress(foundList[i].id, foundList[i]);
          if (item) {
            newFoundTokenList.push(item);
          }
        }
        this.setFoundTokens(newFoundTokenList);
      }
  },

  mounted() {
    setInterval(async () => {
      console.log("Timer executing!");
      this.findTrendTokens().then(() => {
      });
    }, 10000);
  },
};
</script>

<template>
  <div>
    <div v-click-outside="config" class="search-bar">
      <div data-simplebar class="h-100">
        <div class="px-2 py-1 h-100">
          <div class="app-search">
            <div class="position-relative">
              <input
                type="text"
                v-model="token_filter_by"
                class="form-control"
                v-on:change="tokenFilterHandler"
                placeholder="Search..."
              />
              <span class="ti-search"></span>
            </div>
          </div>
          <div class="h-100" style="position: relative;">
            <loading
              :active.sync="isLoading"
              :is-full-page="false"
              :width="36"
              :height="36"
              :background-color="'#222736'"
              :color="'#38a4f8'"
              :opacity="1"
              :z-index="9997"
            ></loading>
            <div v-if="recentTokenList.length > 0 && !isSearch">
              <p class="mb-1 title">RECENT</p>
              <ul>
                <li
                  v-for="(recentToken, index) in recentTokenList"
                  :key="index"
                  @click="selectPair(recentToken)"
                >
                  <div style="display: flex;align-items: center;">
                    <b-img
                      :src="recentToken.image"
                      rounded="circle"
                      height="35"
                      alt="pair image"
                    ></b-img>
                    <span class="pl-3">{{ recentToken.name | truncate(16) }}</span>
                  </div>
                  <div>
                    <span class="desc-muted pr-1">{{ recentToken.symbol }}</span>
                  </div>
                </li>
              </ul>
            </div>
            <div v-if="!isSearch">
              <p class="mb-1 title">TRENDING</p>
              <ul>
                <li
                  v-for="(trendingToken, index) in trendTokenList"
                  :key="index"
                  @click="selectPair(trendingToken)"
                >
                  <div style="display: flex;align-items: center;">
                    <b-img
                      :src="trendingToken.image"
                      rounded="circle"
                      height="35"
                      alt="pair image"
                    ></b-img>
                    <span class="pl-3">{{ trendingToken.name | truncate(16) }}</span>
                  </div>
                  <div>
                    <span class="desc-muted pr-1">{{
                      trendingToken.symbol
                    }}</span>
                  </div>
                </li>
              </ul>
            </div>
            <div v-if="isSearch">
              <p class="mb-1 title">SEARCH</p>
              <ul>
                <li
                  v-for="(foundToken, index) in foundTokenList"
                  :key="index"
                  @click="selectPair(foundToken)"
                >
                  <div style="display: flex;align-items: center;">
                    <b-img
                      :src="foundToken.image"
                      rounded="circle"
                      height="35"
                      alt="pair image"
                    ></b-img>
                    <span class="pl-3">{{ foundToken.name | truncate(16) }}</span>
                  </div>
                  <div>
                    <span>{{ foundToken.symbol }}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <!-- end scroll-->
    </div>
    <!-- Right bar overlay-->
    <div class="searchbar-overlay"></div>
  </div>
</template>

<style lang="scss">
.simplebar-content {
  height: 100%;
}
.search-bar .vld-overlay {
  top: 0;
  left: -8px;
  right: -8px;
}
</style>
