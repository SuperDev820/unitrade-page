<script>
	import Layout from "../layout";
  import appConfig from "@/app.config";
  import Loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/vue-loading.css';

  import { mapActions, mapGetters } from 'vuex';

	export default {
		page: {
        title: "Overview",
        meta: [{ name: "description", content: appConfig.description }]
    },
    components: {
      Layout,
      Loading,
    },
    data() {
      return {
        isLoading: false,
        totalRows: 1,
        currentPage: 1,
        perPage: 10,
        pageOptions: [10, 25, 50, 100],
        filter: null,
        filterOn: [],
        sortBy: "no",
        sortDesc: false,
        fields: [
          { key: "no", sortable: true },
          { key: "date", sortable: true },
          { key: "type", sortable: false },
          { label: "BUY/SELL", key: "buy_sell", sortable: false },
          { key: "from", sortable: false },
          { label: "Amount", key: "from_amount", sortable: true },
          { key: "to", sortable: false },
          { label: "Amount", key: "to_amount", sortable: true },
          { key: "actions", sortable: false }
        ],
      }
    },
    computed: {
      ...mapGetters([
        'overviewTableRows'
      ]),
      /**
       * Total no. of records
       */
      rows() {
        return this.overviewTableRows.length;
      }
    },
    mounted() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false
      },2000)
      // Set the initial number of items
      this.totalRows = this.overviewTableRows.length;
      this.initTableRows();
    },
    methods: {
      ...mapActions([
        'setPair',
        'initTableRows',
      ]),
      selectPair(pairItem) {
        // console.log(this.tabIndex)
        this.setPair(pairItem);
        this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false
        },2000)
      },
      /**
       * Search the table data with search input
       */
      onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length;
        this.currentPage = 1;
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
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="mb-3" style="display: flex;align-items: center;">
              <router-link to="/" class="desc-muted mr-3">
                <i class="ti-arrow-circle-left" style="font-size: 20px;"></i>
              </router-link>
              <h2>Overview</h2>
            </div>
            <!-- <p class="card-title-desc"></p> -->
            <div class="row mb-md-2">
              <div class="col-sm-12 col-md-6">
                <div id="tickets-table_length" class="dataTables_length">
                  <label class="d-inline-flex align-items-center">
                    Show
                    <b-form-select v-model="perPage" size="sm" :options="pageOptions"></b-form-select>entries
                  </label>
                </div>
              </div>
              <!-- Search -->
              <div class="col-sm-12 col-md-6">
                <div id="tickets-table_filter" class="dataTables_filter text-md-right">
                  <label class="d-inline-flex align-items-center">
                    Search:
                    <b-form-input
                      v-model="filter"
                      type="search"
                      placeholder="Search..."
                      class="form-control form-control-sm ml-2"
                    ></b-form-input>
                  </label>
                </div>
              </div>
              <!-- End search -->
            </div>
            <!-- Table -->
            <div class="table-responsive table-dark mb-0">
              <b-table
                :items="overviewTableRows"
                :fields="fields"
                responsive="sm"
                :per-page="perPage"
                :current-page="currentPage"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :filter="filter"
                :filter-included-fields="filterOn"
                @filtered="onFiltered"
              >
                <template #cell(no)="row">
                  {{row.index + 1}}
                </template>
                <template #cell(buy_sell)="row">
                  <b-badge variant="info" class="" v-if="row.item.buy_sell=='Buy'">Buy</b-badge>
                  <b-badge variant="danger" class="" v-if="row.item.buy_sell=='Sell'">Sell</b-badge>
                </template>
                <template #cell(actions)="row">
                  <div v-if="row.item.status == 'pending'">
                    <router-link :to="{ name: 'RowUpdate', params: { rowId: row.item.id }}" class="btn btn-sm btn-info mr-2" v-b-tooltip.hover.top="'Update'">
                      <i class="far fa-edit"></i>
                    </router-link>
                    <b-button variant="success" size="sm" class="mr-2" v-b-tooltip.hover.top="'Execute'">
                      <i class="fas fa-external-link-alt"></i>
                    </b-button>
                    <b-button variant="warning" size="sm" class="mr-2" v-b-tooltip.hover.top="'Cancel'" v-b-modal.cancel-modal>
                      <i class="far fa-closed-captioning"></i>
                    </b-button>
                  </div>
                  <div v-if="row.item.status == 'cancel'">
                    <b-button variant="dark" size="sm" class="mr-2" disabled>Cancelled</b-button>
                  </div>
                  <div v-if="row.item.status == 'execute'">
                    <b-button variant="primary" size="sm" class="mr-2" disabled>Executed</b-button>
                  </div>
                </template>
              </b-table>
            </div>
            <div class="row">
              <div class="col">
                <div class="dataTables_paginate paging_simple_numbers float-right">
                  <ul class="pagination pagination-rounded mb-0">
                    <!-- pagination -->
                    <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage"></b-pagination>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <b-modal
      id="cancel-modal"
      centered
      title="Cancel Item"
      title-class="font-18"
      hide-footer
    >
      <p>Are you sure you want to cancel selected item?</p>
      <footer id="cancel-modal___BV_modal_footer_" class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="$bvModal.hide('cancel-modal')">Cancel</button>
        <button type="button" class="btn btn-primary" @click="$bvModal.hide('cancel-modal')">OK</button>
      </footer>
    </b-modal>
  </Layout>
</template>
<style scoped>
</style>