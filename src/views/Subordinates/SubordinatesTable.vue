<template>
  <div>
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-success"></base-header>
    <b-container fluid class="mt--7">
      <!-- Filtro de Datas com base-input e datetime-local -->
      <b-row class="align-items-center mb-4">
        <b-col md="5">
          <b-row class="form-group align-items-center">
            <label for="start-date" class="col-md-4 col-form-label form-control-label">Data de Início:</label>
            <b-col md="8" class="mt-4">
              <base-input id="start-date" v-model="filters.start_date" type="date" placeholder="Data de Início" />
            </b-col>
          </b-row>
        </b-col>

        <b-col md="5">
          <b-row class="form-group align-items-center">
            <label for="end-date" class="col-md-4 col-form-label form-control-label">Data de Término:</label>
            <b-col md="8" class="mt-4">
              <base-input id="end-date" v-model="filters.end_date" type="date" placeholder="Data de Término" />
            </b-col>
          </b-row>
        </b-col>

        <b-col md="2" class="text-right mb-4">
          <b-button variant="primary" size="lg" @click="applyDateFilter"
            :disabled="!((filters.start_date && filters.end_date) || (!filters.start_date && !filters.end_date))">Filtrar</b-button>
        </b-col>
      </b-row>

      <!-- Tabela -->
      <b-row>
        <b-col>
          <light-table :data="tableData.data" :current-page="tableData.current_page" :per-page="tableData.per_page"
            :total-records="tableData.total_records" :total-pages="tableData.total_pages"
            @page-changed="handlePageChange">
            <template #timestamp="{ row }">
              {{ formatDateTime(row.timestamp) }}
            </template>
          </light-table>
        </b-col>
      </b-row>
      <div class="mt-5"></div>
    </b-container>
  </div>
</template>

<script>
import LightTable from "@/views/Tables/RegularTables/LightTable";

export default {
  components: {
    LightTable,
  },
  data() {
    return {
      repositores: {
        checkIn: null
      },
      tableData: {
        data: [],
        current_page: 1,
        per_page: 2,
        total_records: 0,
        total_pages: 1,
      },
      filters: {
        start_date: null,
        end_date: null
      }
    };
  },
  mounted() {
    this.repositores.checkIn = this.$repositories.get('checkIn');
    this.getCheckInsSubordinates();
  },
  methods: {
    formatDateTime(date) {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    return new Date(date).toLocaleString('pt-BR', options);
  },
    handlePageChange(page) {
      this.tableData.current_page = page;
      this.getCheckInsSubordinates({ page });
    },
    applyDateFilter() {
      const { start_date, end_date } = this.filters;
      this.getCheckInsSubordinates({ start_date, end_date });
    },
    async getCheckInsSubordinates({ start_date = null, end_date = null, page = 1, per_page = 10 } = {}) {
      this.$store.dispatch('setStatusLoader', true);

      const params = {};
      if (start_date && end_date) {
        params.start_date = start_date;
        params.end_date = end_date;
      }
      params.page = page;
      params.per_page = per_page;

      await this.repositores.checkIn
        .indexSubordinates(params)
        .then((response) => {
          this.tableData.data = response.data.data;
          this.tableData.current_page = response.data.current_page;
          this.tableData.per_page = response.data.per_page;
          this.tableData.total_records = response.data.total_records;
          this.tableData.total_pages = response.data.total_pages;
          this.$store.dispatch('setStatusLoader', false);
        })
        .catch((e) => {
          console.log(e);
          this.showErrorAlert('Erro ao recuperar pontos.');
          this.$store.dispatch('setStatusLoader', false);
        });
    },
  }
};
</script>

<style scoped>
.col-form-label {
  font-weight: 500;
}
</style>
