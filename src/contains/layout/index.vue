<script>
import router from "@/router";

import Sidebar from "./sidebar";
import Searchbar from "./search-bar";

export default {
  components: {
    Sidebar,
    Searchbar,
  },
  created() {
    document.body.setAttribute("data-sidebar", "dark");
    document.body.removeAttribute("data-topbar", "light");
    document.body.removeAttribute("data-layout-size", "boxed");
    document.body.removeAttribute("data-layout", "horizontal");
  },
  methods: {
    toggleMenu() {
      document.body.classList.toggle("sidebar-enable");
      document.body.classList.toggle("vertical-collpsed");

      if (window.screen.width <= 768) {
        document.body.classList.remove("vertical-collpsed");
        // eslint-disable-next-line no-unused-vars
        router.afterEach((routeTo, routeFrom) => {
          document.body.classList.remove("sidebar-enable");
        });
      }
    },
    toggleSearchbar() {
      document.body.classList.toggle("search-bar-enabled");
    },
    hideSearchbar() {
      document.body.classList.remove("search-bar-enabled");
    },
  }
};
</script>

<template>
  <div id="layout-wrapper">
    <Sidebar />
    <Searchbar />
    <div class="main-content">
      <div class="page-content">
        <div class="container-fluid">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
  .main-content {
    margin-right: 0;
  }
</style>