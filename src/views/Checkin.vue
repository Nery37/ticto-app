<template>
  <div>

    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-success">
      <!-- Card stats -->
      <b-row>
        <b-col v-for="item in records" :key="item.id" xl="3" md="6">
          <stats-card :title="item.user.name" :type="getTypeColor(item.type_name)"
            :sub-title="formatDate(item.created_at)" :icon="getIcon(item.type_name)" class="mb-4">
            <template slot="footer">
        <span class="text-nowrap">{{ translateTypeName(item.type_name) }}</span>
      </template>
          </stats-card>
        </b-col>
      </b-row>
    </base-header>

    <b-container fluid class="mt--7">
      <b-row>
        <b-col xl="12" class="mb-5 mb-xl-0">
          <card type="default" header-classes="bg-transparent">
            <b-row align-v="center" slot="header">
              <b-col>
                <h6 class="text-light text-uppercase ls-1 mb-1">Faça o registro do seu ponto</h6>
                <h5 class="h3 text-white mb-0">Clicando no botão abaixo</h5>
              </b-col>
              <b-col>
                <b-nav class="nav-pills justify-content-end">
                </b-nav>
              </b-col>
            </b-row>
            <!-- Adição do botão centralizado -->
            <b-row class="justify-content-center mt-4">
              <b-button variant="primary" size="lg" @click="storeCheckIn()">BATER PONTO</b-button>
            </b-row>
          </card>
        </b-col>
      </b-row>
    </b-container>


  </div>
</template>
<script>

export default {
  data() {
    return {
      repositores: {
        checkIn: null,
      },
      records: [],
    };
  },
  mounted() {
    this.repositores.checkIn = this.$repositories.get('checkIn');
    this.getCheckInsToday()
  },
  methods: {
    formatDate(dateString) {
      const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
      return new Date(dateString).toLocaleDateString("pt-BR", options);
    },
    getIcon(type) {
      return type === "check_in" ? "ni ni-check-bold" : "ni ni-signout";
    },
    getTypeColor(type) {
      return type === "check_in" ? "gradient-green" : "gradient-orange";
    },
    translateTypeName(type) {
      return type === "check_in" ? "Entrada" : "Saída";
    },
    async getCheckInsToday() {
      this.$store.dispatch('setStatusLoader', true)
      await this.repositores.checkIn
        .indexUserToday()
        .then((response) => {
          this.records = response.data.data
          this.$store.dispatch('setStatusLoader', false)
        })
        .catch((e) => {
          console.log(e)
          this.showErrorAlert('Erro ao recuperar pontos.');
          this.$store.dispatch('setStatusLoader', false)
        })
    },
    async storeCheckIn() {
      this.$store.dispatch('setStatusLoader', true)
      await this.repositores.checkIn
        .store()
        .then(() => {
          this.showSuccessAlert('Ponto validado com sucesso.');
          this.$store.dispatch('setStatusLoader', false)
          this.getCheckInsToday()
        })
        .catch((e) => {
          console.log(e)
          this.showErrorAlert('Erro ao bater ponto.');
          this.$store.dispatch('setStatusLoader', false)
        })
    }
  },
};
</script>
<style>
.el-table .cell {
  padding-left: 0px;
  padding-right: 0px;
}
</style>
