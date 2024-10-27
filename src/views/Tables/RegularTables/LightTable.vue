<template>
  <b-card no-body>
    <b-card-header class="border-0">
      <h3 class="mb-0">{{ title }}</h3>
    </b-card-header>

    <el-table
      class="table-responsive table"
      header-row-class-name="thead-light"
      :data="data"
    >
      <!-- Colunas dinâmicas com suporte a slots personalizados -->
      <el-table-column
        v-for="(value, key, index) in data[0]"
        :key="index"
        :label="formatColumnLabel(key)"
        :prop="key"
      >
        <template v-slot="scope">
          <!-- Verifica se existe um slot personalizado para a coluna -->
          <template v-if="$scopedSlots[key]">
            <slot :name="key" :row="scope.row" />
          </template>
          <template v-else>
            <span>{{ scope.row[key] }}</span>
          </template>
        </template>
      </el-table-column>

      <!-- Coluna fixa de Ações (opcional) -->
      <el-table-column v-if="showActions" label="Actions" align="center">
        <template v-slot="scope">
          <div class="d-flex flex-column align-items-center">
            <b-button
              variant="warning"
              size="sm"
              class="mb-2"
              @click="$emit('edit', scope.row)"
            >
              Editar
            </b-button>
            <b-button
              variant="danger"
              size="sm"
              @click="$emit('delete', scope.row)"
            >
              Excluir
            </b-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- Paginação -->
    <b-card-footer class="py-4 d-flex justify-content-end">
      <div>
        <b-pagination
          first-number
          last-number
          v-model="localCurrentPage"
          :per-page="perPage"
          :total-rows="totalRecords"
        >
          <template v-slot:prev-text>
            <a class="page-link" aria-label="Previous">
              <span aria-hidden="true"><i class="fa fa-angle-left" aria-hidden="true"></i></span>
            </a>
          </template>
          <template v-slot:next-text>
            <a class="page-link" aria-label="Next">
              <span aria-hidden="true"><i class="fa fa-angle-right" aria-hidden="true"></i></span>
            </a>
          </template>
        </b-pagination>
      </div>
    </b-card-footer>
  </b-card>
</template>

<script>
import { Table, TableColumn } from 'element-ui';

export default {
  name: 'light-table',
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    },
    perPage: {
      type: Number,
      required: true
    },
    totalRecords: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      default: 'Tabela'
    },
    showActions: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      localCurrentPage: this.currentPage,
    };
  },
  watch: {
    currentPage(newVal) {
      this.localCurrentPage = newVal;
    },
    localCurrentPage(newVal) {
      this.$emit('page-changed', newVal);
    }
  },
  methods: {
    formatColumnLabel(key) {
      return key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    }
  }
};
</script>
