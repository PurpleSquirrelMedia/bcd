<template>
  <div>
    <header class="d-flex mb-4">
      <h3 class="text--secondary font-weight-regular header-table">Referenced contracts</h3>
    </header>
    <v-fade-transition>
      <v-skeleton-loader :loading="loading" type="article" transition="fade-transition">
        <v-data-table
            :items="contracts"
            v-if="contracts.length"
            hide-default-header
            :class="['ba-1 mt-4 avg-gas-consumption', 'hide-pagination-count']"
            hide-default-footer
            :page.sync="page"
            :options="{itemsPerPage}"
            :footer-props="{
            itemsPerPageOptions: []
        }"
        >
          <template v-slot:item="{item}">
            <tr class="table-row">
              <td>
                <v-btn
                    :to="`/${item.network}/${item.address}/`"
                    class="text--secondary hash"
                    style="text-transform: none;"
                    text>
                  <span v-if="item.alias">{{
                      item.alias.length > aliasMaxLength
                          ? item.alias.slice(0, aliasMaxLength).trim()
                          : item.alias
                    }}
                    <em v-if="item.alias.length > aliasMaxLength"
                        class="v-icon notranslate mdi mdi-dots-horizontal"
                        style="font-size: 16px;"
                    />
                  </span>
                  <span v-else v-past-html="helpers.shortcut(item.address, 12)"></span>
                </v-btn>
              </td>
            </tr>
          </template>
          <template v-slot:no-data>
            <span>No references to contracts</span>
          </template>
          <template v-slot:footer>
            <div class="footer-pagination">
              <v-btn icon @click="changePage(page - 1)" :disabled="page === 0">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn icon @click="changePage(page + 1)" :disabled="isLastPage">
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
        <span v-else class="not-found-text">
          There are no references to this constant
        </span>
      </v-skeleton-loader>
    </v-fade-transition>
  </div>
</template>

<script>
export default {
  name: "ReferenceContract",
  props: {
    contractInfoItems: Array
  },
  data() {
    return {
      loading: true,
      aliasMaxLength: 26,
      contracts: [],
      isLastPage: true,
      itemsPerPage: 10,
      page: 0,
    }
  },
  async mounted() {
    this.fetchReferences();
  },
  methods: {
    async fetchReferences() {
      this.loading = true;

      const offset = this.page * this.itemsPerPage;
      const {network, address} = this.$route.params;
      this.contracts = await this.api.getConstantsByAddress(network, address, offset);
      this.isLastPage = this.contracts.length < this.itemsPerPage

      this.loading = false;
    },
    navigate(path) {
      this.$router.push(path);
    },
    changePage(newPageNum) {
      this.page = newPageNum;
      this.fetchReferences();
    },
  }
}
</script>
<style scoped>
.not-found-text {
  color: rgba(255, 255, 255, 0.5);
}
</style>
