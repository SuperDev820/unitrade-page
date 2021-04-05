<script>
/**
 * Right sidebar component
 */
export default {
  components: {},
  data() {
    return {
      config: {
        handler: this.handleRightBarClick,
        middleware: this.middleware,
        events: ["click"]
      }
    };
  },

  methods: {
    hide() {
      this.$parent.toggleRightSidebar();
    },
    // eslint-disable-next-line no-unused-vars
    handleRightBarClick(e, el) {
      if (window.screen.width <= 768) {
        this.$parent.hideRightSidebar();
      }
    },
    // eslint-disable-next-line no-unused-vars
    middleware(event, el) {
      return !event.target.classList.contains("toggle-right");
    }
  }
};
</script>

<template>
  <div>
    <div v-click-outside="config" class="right-bar">
      <div data-simplebar class="h-100">
        <div>
          <b-tabs justified nav-class="nav-tabs-custom" content-class="p-3">
            <b-tab active>
              <template v-slot:title>
                <span>History</span>
              </template>
              <p class="mb-0"></p>
            </b-tab>
            <b-tab>
              <template v-slot:title>
                <span>Pending</span>
              </template>
              <p class="mb-0"></p>
            </b-tab>
          </b-tabs>
        </div>
      </div>
      <!-- end scroll-->
    </div>
  </div>
</template>

<style lang="scss">
</style>
