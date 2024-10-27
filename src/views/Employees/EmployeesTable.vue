<template>
  <div>
    <!-- eslint-disable -->
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-primary"></base-header>
    <b-container fluid class="mt--7">

      <!-- Botão para adicionar novo funcionário -->
      <b-row class="mb-4">
        <b-col class="text-right">
          <b-button variant="success" size="lg" @click="openCreateModal">Adicionar Funcionário</b-button>
        </b-col>
      </b-row>

      <!-- Tabela -->
      <b-row>
        <b-col>
          <light-table :data="tableData.data" :current-page="tableData.current_page" :per-page="tableData.per_page"
            :total-records="tableData.total_records" :total-pages="tableData.total_pages"
            @page-changed="handlePageChange" :show-actions="true" @delete="openDeleteModal" @edit="openEditModal">

            <template #id="{ row }">
              {{ row.id }}
            </template>

            <!-- Slot personalizado para "name" -->
            <template #name="{ row }">
              {{ row.name }}
            </template>

            <!-- Slot personalizado para "email" -->
            <template #email="{ row }">
              {{ row.email }}
            </template>

            <!-- Slot personalizado para "document" (CPF com formatação específica, se necessário) -->
            <template #document="{ row }">
              {{ row.document }}
            </template>

            <!-- Slot personalizado para "age" -->
            <template #age="{ row }">
              {{ row.age }} anos
            </template>

            <!-- Slot personalizado para "manager_name" -->
            <template #manager_name="{ row }">
              {{ row.manager_name }}
            </template>

            <!-- Slot personalizado para "address" (formatando o endereço completo) -->
            <template #address="{ row }">
              {{ formatAddress(row.address) }}
            </template>

            <template #birthdate="{ row }">
              {{ formatDate(row.birthdate) }}
            </template>

            <!-- Slot personalizado para "created_at" -->
            <template #created_at="{ row }">
              {{ formatDateTime(row.created_at) }}
            </template>

            <!-- Slot personalizado para "updated_at" -->
            <template #updated_at="{ row }">
              {{ formatDateTime(row.updated_at) }}
            </template>
          </light-table>
        </b-col>
      </b-row>

      <!-- Modais para CRUD -->
      <create-employee-modal v-model="showCreateModal" @createdEmployee="refreshTableData" />

      <edit-employee-modal v-model="showEditModal" :employee="selectedEmployee" @updateEmployee="refreshTableData" />

      <delete-confirmation-modal v-model:modalShow="showDeleteModal" :employee="selectedEmployee"
        @deleted="confirmDelete" />

      <div class="mt-5"></div>
    </b-container>
  </div>
</template>

<script>
import LightTable from "@/views/Tables/RegularTables/LightTable";
import CreateEmployeeModal from "./CreateEmployeeModal";
import EditEmployeeModal from "./EditEmployeeModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

export default {
  components: {
    LightTable,
    CreateEmployeeModal,
    EditEmployeeModal,
    DeleteConfirmationModal,
  },
  data() {
    return {
      repositores: {
        user: null
      },
      tableData: {
        data: [],
        current_page: 1,
        per_page: 10,
        total_records: 0,
        total_pages: 1,
      },
      showCreateModal: false,
      showEditModal: false,
      showDeleteModal: false,
      selectedEmployee: null,
    };
  },
  mounted() {
    this.repositores.user = this.$repositories.get('user');
    this.getEmployees();
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
    formatAddress(address) {
      return `${address.zip_code}, ${address.street}, ${address.neighborhood}, ${address.city} - ${address.state}`;
    },
    formatDate(date) {
      if (!date) return '';
      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
    },

    formatEmployeeData(data) {
      return data.map(({ role, ...employee }) => employee);
    },
    handlePageChange(page) {
      this.tableData.current_page = page;
      this.getEmployees({ page });
    },
    async getEmployees({ page = 1, limit = 10 } = {}) {
      this.$store.dispatch('setStatusLoader', true);

      const params = { page, limit };

      await this.repositores.user
        .index(params)
        .then((response) => {
          this.tableData.data = this.formatEmployeeData(response.data.data);
          this.tableData.current_page = response.data.meta.pagination.current_page;
          this.tableData.per_page = response.data.meta.pagination.per_page;
          this.tableData.total_records = response.data.meta.pagination.total;
          this.tableData.total_pages = response.data.meta.pagination.total_pages;
          this.$store.dispatch('setStatusLoader', false);
        })
        .catch((e) => {
          console.log(e);
          this.showErrorAlert('Erro ao recuperar funcionários.');
          this.$store.dispatch('setStatusLoader', false);
        });
    },
    openCreateModal() {
      this.showCreateModal = true;
    },
    closeCreateModal() {
      this.showCreateModal = false;
    },
    openEditModal(employee) {
      this.selectedEmployee = employee;
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
    },
    openDeleteModal(employee) {
      this.selectedEmployee = employee;
      this.showDeleteModal = true;
    },
    confirmDelete(employeeId) {
      this.showDeleteModal = false;
      this.$store.dispatch('setStatusLoader', true);

      this.repositores.user
        .destroy(employeeId)
        .then(() => {
          this.$store.dispatch('setStatusLoader', false);
          this.showSuccessAlert('Funcionário excluído com sucesso.');
          this.refreshTableData();
        })
        .catch((e) => {
          console.log(e);
          this.showErrorAlert('Erro ao excluir funcionário.');
          this.$store.dispatch('setStatusLoader', false);
        });
    },
    refreshTableData() {
      this.getEmployees({ page: this.tableData.current_page });
    }
  }
};
</script>

<style scoped>
.col-form-label {
  font-weight: 500;
}
</style>
