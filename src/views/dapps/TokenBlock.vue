<template>
  <v-row>
    <v-col cols="12">
      <h3>Tokens</h3>
    </v-col>
    <v-col cols="12">
      <v-skeleton-loader :loading="loading" type="table">
        <v-data-table :headers="headers" :items="tokens" class="transparent">
          <template v-slot:item.supply="{ item }"
            >{{ helpers.round(item.supply, item.decimals) }}
            {{ item.symbol }}</template
          >
          <template v-slot:item.transfered="{ item }"
            >{{ helpers.round(item.transfered, item.decimals) }}
            {{ item.symbol }}</template
          >
        </v-data-table>
      </v-skeleton-loader>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "TokenBlock",
  props: {
    dapp: Object,
    tokens: Array,
    loading: Boolean,
  },
  computed: {
    contracts() {
      if (!(this.dapp && this.dapp.contracts)) return [];
      let contracts = [];
      this.dapp.contracts.forEach((x) => contracts.push(x.address));
      return contracts;
    },
    headers() {
      return [
        {
          text: "Name",
          value: "name",
        },
        {
          text: "Symbol",
          value: "symbol",
        },
        {
          text: "Contract",
          value: "contract",
        },
        {
          text: "Supply",
          value: "supply",
        },
        // {
        //   text: "Transfered",
        //   value: "transfered",
        // },
        {
          text: "Decimals",
          value: "decimals",
        },
        {
          text: "Token ID",
          value: "token_id",
        },
      ];
    },
  },
  data: () => ({
    data: {},
    selectedToken: 0,
  }),
  methods: {
    ...mapActions(["showError"]),
  },
};
</script>
