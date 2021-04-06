<script>
/**
 * Search sidebar component
 */
export default {
  components: {},
  data() {
    return {
      config: {
        handler: this.handleSearchBarClick,
        middleware: this.middleware,
        events: ["click"]
      },
      filter_by: '',
      recentItems: [],
      trendingItems: [
        {
          name: 'XML',
          description: 'xml.network',
          liquidity: 0,
        },
      ],
      searchItems: [],
      isSearch: false,
    };
  },

  methods: {
    hide() {
      this.$parent.toggleSearchbar();
    },
    // eslint-disable-next-line no-unused-vars
    handleSearchBarClick(e, el) {
      this.$parent.hideSearchbar();
    },
    // eslint-disable-next-line no-unused-vars
    middleware(event, el) {
      return !event.target.classList.contains("toggle-search");
    },
    selectPair(item) {
      // console.log(item)
      this.$parent.$parent.selectPair(item);
      this.hide();
    },
  }
};
</script>

<template>
  <div>
    <div v-click-outside="config" class="search-bar">
      <div data-simplebar class="h-100">
        <div class="px-2 py-1">
          <div class="app-search">
            <div class="position-relative">
              <input type="text" v-model="filter_by" class="form-control" placeholder="Search..." />
              <span class="ti-search"></span>
            </div>
          </div>
          <div v-if="recentItems.length > 0 && !isSearch">
            <p class="mb-1 title">RECENT</p>
            <ul>
              <li v-for="(recentItem, index) in recentItems" :key="index" @click="selectPair(recentItem)">
                <div style="display: flex;align-items: center;">
                  <b-img
                    :src="require('@/assets/images/services-icon/' + recentItem.name + '.png')"
                    rounded="circle"
                    height="35"
                    alt="pair image"
                  ></b-img>
                  <span class="pl-3">{{ recentItem.description }}</span>
                </div>
                <div>
                  <span class="desc-muted pr-1">{{ recentItem.name }}</span>
                </div>
              </li>
            </ul>
          </div>
          <div v-if="!isSearch">
            <p class="mb-1 title">TRENDING</p>
            <ul>
              <li v-for="(trendingItem, index) in trendingItems" :key="index" @click="selectPair(trendingItem)">
                <div style="display: flex;align-items: center;">
                  <b-img
                    :src="require('@/assets/images/services-icon/' + trendingItem.name + '.png')"
                    rounded="circle"
                    height="35"
                    alt="pair image"
                  ></b-img>
                  <span class="pl-3">{{ trendingItem.description }}</span>
                </div>
                <div>
                  <span class="desc-muted pr-1">{{ trendingItem.name }}</span>
                </div>
              </li>
            </ul>
          </div>
          <div v-if="isSearch">
            <p class="mb-1 title">SEARCH</p>
            <ul>
              <li v-for="(searchItem, index) in searchItems" :key="index" @click="selectPair(searchItem)">
                <div style="display: flex;align-items: center;">
                  <b-img
                    :src="require('@/assets/images/services-icon/' + searchItem.name + '.png')"
                    rounded="circle"
                    height="35"
                    alt="pair image"
                  ></b-img>
                  <span class="pl-3">{{ searchItem.description }}</span>
                </div>
                <div>
                  <span>{{ searchItem.name }}</span>
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
