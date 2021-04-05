<script>
import router from "@/router";

import Sidebar from "./sidebar";
import Rightbar from "./right-bar";

export default {
  components: {
    Sidebar,
    Rightbar,
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
    toggleRightSidebar() {
      document.body.classList.toggle("right-bar-enabled");
    },
    hideRightSidebar() {
      document.body.classList.remove("right-bar-enabled");
    }
  }
};
</script>

<template>
  <div id="layout-wrapper">
    <Sidebar />
    <div class="main-content">
      <div class="page-content">
        <div class="container-fluid">
          <slot />
        </div>
      </div>
    </div>
    <Rightbar />
  </div>
</template>