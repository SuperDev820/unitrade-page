<script>
/**
 * Search sidebar component
 */
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    Loading,
  },
  data() {
    return {
      config: {
        handler: this.handleSearchBarClick,
        middleware: this.middleware,
        events: ["click"]
      },
      isLoading: false,
      pair_filter_by: '',
      searchPairs: [],
      isSearch: false,
    };
  },
  computed: {
    ...mapGetters([
      'recentPairs',
      'trendingPairs',
    ]),
  },
  methods: {
    ...mapActions([
      'setRecentPairs',
    ]),
    hide() {
      this.$parent.toggleSearchbar();
    },
    // eslint-disable-next-line no-unused-vars
    handleSearchBarClick(e, el) {
      this.pair_filter_by = '';
      this.isSearch = false;
      this.$parent.hideSearchbar();
    },
    // eslint-disable-next-line no-unused-vars
    middleware(event, el) {
      return !event.target.classList.contains("toggle-search");
    },
    selectPair(item) {
      // console.log(item)
      this.pair_filter_by = '';
      this.isSearch = false;
      this.recentPairs.push(item);
      this.setRecentPairs(this.recentPairs);
      this.$parent.$parent.selectPair(item);
      this.hide();
    },
    pairFilterHandler() {
      this.isSearch = true;
      this.isLoading = true;
      this.searchPairs = [];
      this.trendingPairs.forEach((item) => {
        if ((item.name.includes(this.pair_filter_by)) || (item.description.includes(this.pair_filter_by))) {
          this.searchPairs.push(item);
        }
      })
      setTimeout(() => {
        this.isLoading = false
      },2000)
    },
  }
};
</script>

<template>
  <div>
    <div v-click-outside="config" class="search-bar">
      <loading :active.sync="isLoading" 
        :is-full-page="false"
        :width="36"
        :height="36"
        :background-color="'#222736'"
        :color="'#38a4f8'"
        :opacity="1"
        :z-index="9997"
      ></loading>
      <div data-simplebar class="h-100">
        <div class="px-2 py-1">
          <div class="app-search">
            <div class="position-relative">
              <input type="text" v-model="pair_filter_by" class="form-control" v-on:keyup="pairFilterHandler" placeholder="Search..." />
              <span class="ti-search"></span>
            </div>
          </div>
          <div v-if="recentPairs.length > 0 && !isSearch">
            <p class="mb-1 title">RECENT</p>
            <ul>
              <li v-for="(recentPair, index) in recentPairs" :key="index" @click="selectPair(recentPair)">
                <div style="display: flex;align-items: center;">
                  <b-img
                    :src="require('@/assets/images/services-icon/' + recentPair.name + '.png')"
                    rounded="circle"
                    height="35"
                    alt="pair image"
                  ></b-img>
                  <span class="pl-3">{{ recentPair.description }}</span>
                </div>
                <div>
                  <span class="desc-muted pr-1">{{ recentPair.name }}</span>
                </div>
              </li>
            </ul>
          </div>
          <div v-if="!isSearch">
            <p class="mb-1 title">TRENDING</p>
            <ul>
              <li v-for="(trendingPair, index) in trendingPairs" :key="index" @click="selectPair(trendingPair)">
                <div style="display: flex;align-items: center;">
                  <b-img
                    :src="require('@/assets/images/services-icon/' + trendingPair.name + '.png')"
                    rounded="circle"
                    height="35"
                    alt="pair image"
                  ></b-img>
                  <span class="pl-3">{{ trendingPair.description }}</span>
                </div>
                <div>
                  <span class="desc-muted pr-1">{{ trendingPair.name }}</span>
                </div>
              </li>
            </ul>
          </div>
          <div v-if="isSearch">
            <p class="mb-1 title">SEARCH</p>
            <ul>
              <li v-for="(searchPair, index) in searchPairs" :key="index" @click="selectPair(searchPair)">
                <div style="display: flex;align-items: center;">
                  <b-img
                    :src="require('@/assets/images/services-icon/' + searchPair.name + '.png')"
                    rounded="circle"
                    height="35"
                    alt="pair image"
                  ></b-img>
                  <span class="pl-3">{{ searchPair.description }}</span>
                </div>
                <div>
                  <span>{{ searchPair.name }}</span>
                </div>
              </li>
            </ul>
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
</style>
