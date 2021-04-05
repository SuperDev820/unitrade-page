<script>
	import Layout from "../layout/main_layout";
  import appConfig from "@/app.config";

  // import { mapActions, mapGetters } from 'vuex';

	export default {
		page: {
        title: "Exchange",
        meta: [{ name: "description", content: appConfig.description }]
    },
    components: {
      Layout,
    },
    data() {
      return {
        title: "UniTrade",
        items: [
        ],
      }
    },
    computed: {
    },
    mounted() {
    },
    methods: {
      toggleRightSidebar() {
        document.body.classList.toggle("right-bar-enabled");
      },
    }
	};
</script>
<template>
  <Layout>
    <div style="display: flex;flex-direction: column;min-height: 100vh;justify-content: space-between;">
      <div>
        <p>Header</p>
        <button
          type="button"
          class="btn header-item noti-icon right-bar-toggle toggle-right d-inline-block d-md-none"
          style="position: absolute;top: 0;right: 0;"
          @click="toggleRightSidebar"
        >
          <i class="mdi mdi-menu toggle-right"></i>
        </button>
      </div>
      <div class="row">
        <div class="card ml-auto mr-auto" style="width: 450px;">
          <div class="card-body">
            <b-tabs justified class="navtab-bg" content-class="p-3">
              <b-tab active>
                <template v-slot:title>
                  <h3 class="buy">Buy</h3>
                </template>
                <div>
                  <div class="rounded-div">
                    <div>
                      <p class="desc-muted mb-1 ml-2">No wallet connected</p>
                      <b-button pill variant="outline-success" size="md" style="font-size: 18px;">
                        <b-img
                          :src="require('@/assets/images/services-icon/ETH.png')"
                          rounded="circle"
                          height="20"
                          alt="token image"
                        ></b-img>
                        ETH
                        <i class="mdi mdi-chevron-down"></i>
                      </b-button>
                    </div>
                    <div class="text-right">
                      <p class="desc-muted mb-1" style="cursor: pointer;">0.0000 USD</p>
                      <input
                        type="string"
                        step="0.0001"
                        name=""
                        class="custom-input text-right"
                        placeholder="0.0"
                      />
                    </div>
                  </div>
                  <b-button variant="outline-primary" block size="lg">Connect Wallet</b-button>
                </div>
              </b-tab>
              <b-tab>
                <template v-slot:title>
                  <h3 class="sell">Sell</h3>
                </template>
                <div class="">asdfdsaf</div>
              </b-tab>
            </b-tabs>
          </div>
        </div>
      </div>
      <div>
        <p>updated 2 days ago</p>
      </div>
    </div>

    <b-modal
      id="token-modal"
      centered
      title="Delete Item"
      title-class="font-18"
      hide-footer
    >
      <p>Are you sure you want to delete selected item?</p>
      <footer id="delete-modal___BV_modal_footer_" class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="$bvModal.hide('token-modal')">Cancel</button>
        <button type="button" class="btn btn-primary">OK</button>
      </footer>
    </b-modal>
  </Layout>
</template>
<style>
  .tab-content {
    padding: 15px 0 !important;
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
    padding: 9px 18px;
    border-radius: 0.35rem;
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
</style>