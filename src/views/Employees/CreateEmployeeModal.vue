<template>
  <b-modal v-model="localModalShow" title="Criar Funcionário" @hide="closeModal">
    <validation-observer ref="observer" v-slot="{}">
      <b-form @submit.stop.prevent="confirmCreate">
        <!-- Nome do funcionário -->
        <validation-provider name="nome" rules="required" v-slot="{ errors }">
          <b-form-group label="Nome">
            <b-form-input v-model="newEmployee.name" :state="!errors.length" required />
            <b-form-invalid-feedback v-if="errors.length">{{ errors[0] }}</b-form-invalid-feedback>
          </b-form-group>
        </validation-provider>

        <!-- E-mail do funcionário -->
        <validation-provider name="email" rules="required|email" v-slot="{ errors }">
          <b-form-group label="E-mail">
            <b-form-input type="email" v-model="newEmployee.email" :state="!errors.length" required />
            <b-form-invalid-feedback v-if="errors.length">{{ errors[0] }}</b-form-invalid-feedback>
          </b-form-group>
        </validation-provider>

        <!-- CPF com máscara -->
        <validation-provider name="cpf" rules="required|validCpf" v-slot="{ errors }">
          <b-form-group label="CPF">
            <b-form-input v-model="newEmployee.document" type="text" required v-mask="'###.###.###-##'"
              :state="!errors.length" />
            <b-form-invalid-feedback v-if="errors.length">{{ errors[0] }}</b-form-invalid-feedback>
          </b-form-group>
        </validation-provider>

        <!-- Campo de Senha -->
        <validation-provider name="senha" rules="required|min:8" v-slot="{ errors }" vid="password">
          <b-form-group label="Senha">
            <b-form-input v-model="newEmployee.password" type="password" :state="!errors.length" required />
            <b-form-invalid-feedback v-if="errors.length">{{ errors[0] }}</b-form-invalid-feedback>
          </b-form-group>
        </validation-provider>

        <!-- Campo de Confirmação de Senha -->
        <validation-provider name="confirmação de senha" rules="required|confirmed:password" v-slot="{ errors }">
          <b-form-group label="Confirme a Senha">
            <b-form-input v-model="newEmployee.password_confirmation" type="password" :state="!errors.length"
              required />
            <b-form-invalid-feedback v-if="errors.length">{{ errors[0] }}</b-form-invalid-feedback>
          </b-form-group>
        </validation-provider>

        <!-- Campo de Data de Nascimento -->
        <validation-provider name="data de nascimento" rules="required" v-slot="{ errors }">
          <b-form-group label="Data de Nascimento">
            <b-form-input v-model="newEmployee.birthdate" type="date" :state="!errors.length" required />
            <b-form-invalid-feedback v-if="errors.length">{{ errors[0] }}</b-form-invalid-feedback>
          </b-form-group>
        </validation-provider>


        <!-- CEP -->
        <validation-provider name="cep" rules="required" v-slot="{ errors }">
          <b-form-group label="CEP">
            <b-form-input v-model="newEmployee.address.zip_code" type="text" required v-mask="'#####-###'"
              @blur="fetchAddressData" :state="!errors.length" />
            <b-form-invalid-feedback v-if="errors.length">{{ errors[0] }}</b-form-invalid-feedback>
          </b-form-group>
        </validation-provider>

        <!-- Rua -->
        <validation-provider name="rua" rules="required" v-slot="{ errors }">
          <b-form-group label="Rua">
            <b-form-input v-model="newEmployee.address.street" :state="!errors.length" required />
            <b-form-invalid-feedback v-if="errors.length">{{ errors[0] }}</b-form-invalid-feedback>
          </b-form-group>
        </validation-provider>

        <!-- Complemento (Opcional) -->
        <b-form-group label="Complemento">
          <b-form-input v-model="newEmployee.address.complement" />
        </b-form-group>

        <!-- Bairro -->
        <validation-provider name="bairro" rules="required" v-slot="{ errors }">
          <b-form-group label="Bairro">
            <b-form-input v-model="newEmployee.address.neighborhood" :state="!errors.length" required />
            <b-form-invalid-feedback v-if="errors.length">{{ errors[0] }}</b-form-invalid-feedback>
          </b-form-group>
        </validation-provider>

        <!-- Cidade -->
        <validation-provider name="cidade" rules="required" v-slot="{ errors }">
          <b-form-group label="Cidade">
            <b-form-input v-model="newEmployee.address.city" :state="!errors.length" required />
            <b-form-invalid-feedback v-if="errors.length">{{ errors[0] }}</b-form-invalid-feedback>
          </b-form-group>
        </validation-provider>

        <!-- Estado -->
        <validation-provider name="estado" rules="required" v-slot="{ errors }">
          <b-form-group label="Estado">
            <b-form-select v-model="newEmployee.address.state" :options="states" :state="!errors.length" required />
            <b-form-invalid-feedback v-if="errors.length">{{ errors[0] }}</b-form-invalid-feedback>
          </b-form-group>
        </validation-provider>
      </b-form>
    </validation-observer>

    <template #modal-footer>
      <b-button variant="secondary" @click="closeModal">Cancelar</b-button>
      <b-button variant="primary" @click="confirmCreate">Criar</b-button>
    </template>
  </b-modal>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { extend } from 'vee-validate';

extend('validCpf', {
  validate: (value) => {
    const cpf = value.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    let sum = 0, remainder;
    for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;
    sum = 0;
    for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    return remainder === parseInt(cpf.substring(10, 11));
  },
  message: 'O CPF é inválido'
});

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      repositores: {
        user: null,
        address: null
      },
      localModalShow: this.value,
      newEmployee: {
        name: '',
        email: '',
        document: '',
        birthdate: '',
        address: {
          zip_code: '',
          street: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: ''
        },
        password: '',
        password_confirmation: ''
      },
      states: [
        { value: 'AC', text: 'Acre' },
        { value: 'AL', text: 'Alagoas' },
        { value: 'AP', text: 'Amapá' },
        { value: 'AM', text: 'Amazonas' },
        { value: 'BA', text: 'Bahia' },
        { value: 'CE', text: 'Ceará' },
        { value: 'DF', text: 'Distrito Federal' },
        { value: 'ES', text: 'Espírito Santo' },
        { value: 'GO', text: 'Goiás' },
        { value: 'MA', text: 'Maranhão' },
        { value: 'MT', text: 'Mato Grosso' },
        { value: 'MS', text: 'Mato Grosso do Sul' },
        { value: 'MG', text: 'Minas Gerais' },
        { value: 'PA', text: 'Pará' },
        { value: 'PB', text: 'Paraíba' },
        { value: 'PR', text: 'Paraná' },
        { value: 'PE', text: 'Pernambuco' },
        { value: 'PI', text: 'Piauí' },
        { value: 'RJ', text: 'Rio de Janeiro' },
        { value: 'RN', text: 'Rio Grande do Norte' },
        { value: 'RS', text: 'Rio Grande do Sul' },
        { value: 'RO', text: 'Rondônia' },
        { value: 'RR', text: 'Roraima' },
        { value: 'SC', text: 'Santa Catarina' },
        { value: 'SP', text: 'São Paulo' },
        { value: 'SE', text: 'Sergipe' },
        { value: 'TO', text: 'Tocantins' }
      ],
      lastSearchedZipCode: '',
    };
  },
  mounted() {
    this.repositores.user = this.$repositories.get('user');
    this.repositores.address = this.$repositories.get('address');
  },
  watch: {
    value(newVal) {
      this.localModalShow = newVal;
    },
    localModalShow(newVal) {
      if (!newVal) {
        this.resetNewEmployee();
        this.lastSearchedZipCode = '';
      }
      this.$emit("input", newVal);
    }
  },
  methods: {
    async confirmCreate() {
      const isValid = await this.$refs.observer.validate();
      if (!isValid) return;

      this.createEmployee();
      this.localModalShow = false;
    },
    closeModal() {
      this.localModalShow = false;
    },
    resetNewEmployee() {
      this.newEmployee = {
        name: '',
        email: '',
        document: '',
        birthdate: '',
        address: {
          zip_code: '',
          street: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: ''
        },
        password: '',
        password_confirmation: ''
      };
    },
    fetchAddressData() {
      const zipCode = this.newEmployee.address.zip_code;
      if (zipCode && zipCode.length === 9 && zipCode !== this.lastSearchedZipCode) {
        this.lastSearchedZipCode = zipCode;
        this.getAddressByZipCode(zipCode);
      }
    },
    async createEmployee() {
      this.$store.dispatch('setStatusLoader', true);
      const employeeToCreate = { ...this.newEmployee };
      employeeToCreate.address.zip_code = employeeToCreate.address.zip_code.replace(/[^0-9]/g, '');
      employeeToCreate.document = employeeToCreate.document.replace(/[^0-9]/g, '');

      await this.repositores.user
        .store(employeeToCreate)
        .then(() => {
          this.showSuccessAlert('Funcionário criado com sucesso.');
          this.$store.dispatch('setStatusLoader', false);
          this.$emit("createdEmployee");
        })
        .catch((e) => {
          console.log(e);
          this.showErrorAlert('Erro ao criar funcionário.');
          this.$store.dispatch('setStatusLoader', false);
        });
    },
    async getAddressByZipCode(zipCode) {
      this.$store.dispatch('setStatusLoader', true);
      await this.repositores.address
        .getByZipCode(zipCode)
        .then((response) => {
          const addressData = response.data.data;
          if (addressData) {
            this.newEmployee.address = {
              ...this.newEmployee.address,
              zip_code: addressData.cep,
              street: addressData.logradouro || '',
              complement: addressData.complemento || '',
              neighborhood: addressData.bairro || '',
              city: addressData.localidade || '',
              state: addressData.uf || ''
            };
          }
          this.$store.dispatch('setStatusLoader', false);
        })
        .catch((e) => {
          console.log(e);
          this.showErrorAlert('Erro ao recuperar dados de CEP.');
          this.$store.dispatch('setStatusLoader', false);
        });
    },
  }
};
</script>
