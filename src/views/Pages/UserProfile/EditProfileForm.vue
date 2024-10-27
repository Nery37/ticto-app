<template>
  <card>
    <b-row align-v="center" slot="header">
      <b-col cols="8">
        <h3 class="mb-0">Alteração de senha</h3>
      </b-col>
      <b-col class="text-right">
        <b-button variant="primary" type="submit" form="passwordForm">Salvar</b-button>
      </b-col>
    </b-row>

    <b-form @submit.prevent="updatePassword" id="passwordForm">
      <div class="pl-lg-4">
        <b-row>
          <!-- Senha atual -->
          <b-col lg="4">
            <validation-provider name="Senha atual" rules="required|min:8" v-slot="{ errors, valid, validated }">
              <b-form-group label="Senha atual" label-for="current_password">
                <b-form-input
                  id="current_password"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  placeholder="Senha atual"
                  v-model="user.current_password"
                  :class="{ 'is-valid': valid && validated, 'is-invalid': errors.length > 0 && validated }"
                >
                  <template #prepend>
                    <span class="input-group-text">
                      <i class="ni ni-lock-circle-open"></i>
                    </span>
                  </template>
                  <template #append>
                    <b-icon
                      :icon="showCurrentPassword ? 'eye-slash' : 'eye'"
                      class="cursor-pointer"
                      @click="showCurrentPassword = !showCurrentPassword"
                    />
                  </template>
                </b-form-input>
                <div v-if="errors[0]" class="invalid-feedback" style="display: block;">
                  {{ errors[0] }}
                </div>
              </b-form-group>
            </validation-provider>
          </b-col>

          <!-- Nova senha -->
          <b-col lg="4">
            <validation-provider name="Nova senha" rules="required|min:8" v-slot="{ errors, valid, validated }" vid="password">
              <b-form-group label="Nova senha" label-for="new_password">
                <b-form-input
                  id="new_password"
                  :type="showNewPassword ? 'text' : 'password'"
                  placeholder="Nova senha"
                  v-model="user.new_password"
                  :class="{ 'is-valid': valid && validated, 'is-invalid': errors.length > 0 && validated }"
                >
                  <template #prepend>
                    <span class="input-group-text">
                      <i class="ni ni-lock-circle-open"></i>
                    </span>
                  </template>
                  <template #append>
                    <b-icon
                      :icon="showNewPassword ? 'eye-slash' : 'eye'"
                      class="cursor-pointer"
                      @click="showNewPassword = !showNewPassword"
                    />
                  </template>
                </b-form-input>
                <div v-if="errors[0]" class="invalid-feedback" style="display: block;">
                  {{ errors[0] }}
                </div>
              </b-form-group>
            </validation-provider>
          </b-col>

          <!-- Confirmação de nova senha -->
          <b-col lg="4">
            <validation-provider
              name="Confirmação nova senha"
              rules="required|min:8|confirmed:password"
              v-slot="{ errors, valid, validated }"
            >
              <b-form-group label="Confirmação nova senha" label-for="new_password_confirmation">
                <b-form-input
                  id="new_password_confirmation"
                  :type="showNewPasswordConfirmation ? 'text' : 'password'"
                  placeholder="Confirmar nova senha"
                  v-model="user.new_password_confirmation"
                  :class="{ 'is-valid': valid && validated, 'is-invalid': errors.length > 0 && validated }"
                >
                  <template #prepend>
                    <span class="input-group-text">
                      <i class="ni ni-lock-circle-open"></i>
                    </span>
                  </template>
                  <template #append>
                    <b-icon
                      :icon="showNewPasswordConfirmation ? 'eye-slash' : 'eye'"
                      class="cursor-pointer"
                      @click="showNewPasswordConfirmation = !showNewPasswordConfirmation"
                    />
                  </template>
                </b-form-input>
                <div v-if="errors[0]" class="invalid-feedback" style="display: block;">
                  {{ errors[0] }}
                </div>
              </b-form-group>
            </validation-provider>
          </b-col>
        </b-row>
      </div>
      <hr class="my-4">
    </b-form>
  </card>
</template>
<script>
export default {
  data() {
    return {
      user: {
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      },
      showNewPasswordConfirmation: false,
      showNewPassword: false,
      showCurrentPassword: false,
      repositores: {
        auth: null,
      },
    };
  },
  mounted() {
    this.repositores.auth = this.$repositories.get('auth');
  },
  methods: {
    async updatePassword() {
      this.$store.dispatch('setStatusLoader', true)
      await this.repositores.auth
        .changePassword(this.user)
        .then(() => {
          this.$store.dispatch('setStatusLoader', false)
          this.showSuccessAlert('Senha alterada com sucesso.');
          this.$router.push({ path: '/login' });
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
<style></style>
