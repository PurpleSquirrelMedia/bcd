<template>
  <v-row>
    <v-col cols="2">
      <h3>Statistics</h3>
    </v-col>
    <v-col cols="10" class="d-flex justify-end">
        <v-btn-toggle v-model="selectedPeriod" color="primary" dense mandatory>
          <v-btn
            :disabled="loadingSeries || loadingSummary"
            small
            :value="period"
            v-for="(text, period) in {
                'hour': 'Hourly',
                'day': 'Daily',
                'month': 'Monthly',
                'year': 'Yearly'
            }"
            :key="period"
          >{{ text }}</v-btn>
        </v-btn-toggle>
    </v-col>
    <v-col cols="6">
      <v-skeleton-loader :loading="loadingSeries || loadingSummary" type="image">
        <v-card flat outlined>
          <v-card-text class="data pa-0">
            <ColumnChart
              :data="series.users"
              title="Unique accounts"
              name="Accounts"
            ></ColumnChart>
          </v-card-text>
        </v-card>
      </v-skeleton-loader>
    </v-col>
    <v-col cols="6">
      <v-skeleton-loader :loading="loadingSeries || loadingSummary" type="image">
        <v-card flat outlined>
          <v-card-text class="data pa-0">
            <ColumnChart
              :data="series.volume"
              :title="summary ? `<div class='text-center py-0'>Activity (contracts calls count)<div>
                <div class='text--secondary caption text-center py-0'>Total ${summary.txs} calls</div>` : 'Calls count'"
              name="Calls count"
            ></ColumnChart>
          </v-card-text>
        </v-card>
      </v-skeleton-loader>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from "vuex";
import ColumnChart from "@/components/Charts/ColumnChart.vue";

export default {
  name: "StatisticsBlock",
  props: {
    dapp: Object,
    loading: Boolean,
  },
  components: {
    ColumnChart,
  },
  computed: {
    contracts() {
      if (!this.dapp || !this.dapp.contracts) return [];
      let contracts = [];
      this.dapp.contracts.forEach((x) => contracts.push(x.address));
      return contracts;
    },
  },
  data: () => ({
    loadingSeries: true,
    loadingSummary: true,
    series: {
      volume: [],
      users: [],
    },
    selectedToken: 0,
    selectedPeriod: "day",
    summary: null,
  }),
  methods: {
    ...mapActions(["showError"]),
    getSeries(period) {
      this.loadingSeries = true;

      this.api
        .getNetworkStatsSeries("mainnet", "users", period, this.contracts)
        .then((res) => {
          this.series.users = res;
          return this.api.getNetworkStatsSeries(
            "mainnet",
            "operation",
            period,
            this.contracts
          );
        })
        .then((res) => {
          this.series.volume = res;
        })
        .catch((err) => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => {
          this.loadingSeries = false;
        });
    },
    getGeneralStats() {
      this.loadingSummary = true;
      this.api
        .getContractsStats("mainnet", this.contracts, "all")
        .then((res) => {
          this.summary = res;
        })
        .catch((err) => {
          console.log(err);
          this.showError(err);
        })
        .finally(() => {
          this.loadingSummary = false;
        });
    },
  },
  watch: {
    selectedPeriod: function (newValue) {
      this.getSeries(newValue);
    },
    contracts: function(newValue) {
      if (newValue && newValue.length > 0) {
        this.getSeries(this.selectedPeriod);
        this.getGeneralStats();
      }
    }
  },
};
</script>