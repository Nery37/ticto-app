<template>
  <div>
    <!-- Header -->
    <div class="header bg-gradient-success py-7 py-lg-8 pt-lg-9">
      <b-container>
        <div class="header-body text-center mb-7">
          <b-row class="justify-content-center">
            <b-col xl="5" lg="6" md="8" class="px-5">
              <h1 class="text-white">Olá!</h1>
              <p class="text-lead text-white">Seja bem vindo ao seu controle de ponto.</p>
            </b-col>
          </b-row>
        </div>
      </b-container>
      <div class="separator separator-bottom separator-skew zindex-100">
        <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1"
          xmlns="http://www.w3.org/2000/svg">
          <polygon class="fill-default" points="2560 0 2560 100 0 100"></polygon>
        </svg>
      </div>
    </div>
    <!-- Page content -->
    <b-container class="mt--8 pb-5">
      <b-row class="justify-content-center">
        <b-col lg="5" md="7">
          <b-card no-body class="bg-secondary border-0 mb-0">
            <b-card-body class="px-lg-5 py-lg-5">
              <div class="text-center text-muted mb-4">
              </div>
              <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
                <b-form role="form" @submit.prevent="handleSubmit(onSubmit)">
                  <base-input alternative class="mb-3" name="Email" :rules="{ required: true, email: true }"
                    prepend-icon="ni ni-email-83" placeholder="Email" v-model="model.email">
                  </base-input>

                  <base-input alternative class="mb-3" name="Password" :rules="{ required: true, min: 6 }"
                    prepend-icon="ni ni-lock-circle-open" type="password" placeholder="Password"
                    v-model="model.password">
                  </base-input>
                  <div class="text-center">
                    <base-button type="primary" native-type="submit" class="my-4">Login</base-button>
                  </div>
                </b-form>
              </validation-observer>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      model: {
        email: '',
        password: '',
      },
      repositores: {
        auth: null,
        user: null
      }
    };
  },
  mounted() {
    this.$store.commit('RESET_STATE');
    this.$store.dispatch('setStatusLoader', false)
    this.repositores.auth = this.$repositories.get('auth');
    this.repositores.user = this.$repositories.get('user');
  },
  methods: {
    async onSubmit() {
      this.$store.dispatch('setStatusLoader', true)
      await this.repositores.auth
        .login(this.model.email, this.model.password)
        .then((response) => {
          this.$store.dispatch('setToken', response.data.data.access_token)
          this.me()
        })
        .catch((e) => {
          console.log(e)
          this.showErrorAlert('Algo deu errado! Verifique os dados e tente novamente.');
          this.$store.dispatch('setStatusLoader', false)
        })
    },
    async me() {
      await this.repositores.user
        .me()
        .then((response) => {
          const userData = response.data.data;
          this.$store.dispatch('setUser', userData)
          .then(() => {
            const redirectPath = userData.role.id === this.$roles.ADMIN ? '/subordinates/checkins' : '/check-in';
            this.$router.push({ path: redirectPath  });
          })
          this.$store.dispatch('setStatusLoader', false)
        })
        .catch((e) => {
          console.log(e)
          this.showErrorAlert('Algo deu errado! Verifique os dados e tente novamente.');
          this.$store.dispatch('setStatusLoader', false)
        })
    }
  }
};
</script>
