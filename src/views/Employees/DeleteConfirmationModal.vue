<template>
  <b-modal
    v-model="localModalShow"
    title="Confirmar Exclusão"
    ok-title="Excluir"
    ok-variant="danger"
    @ok="confirmDelete"
    @hide="closeModal"
  >
    <p v-if="employee">Tem certeza de que deseja excluir o funcionário <strong>{{ employee.name }}</strong>?</p>
    <p v-else>Tem certeza de que deseja excluir este funcionário?</p>
  </b-modal>
</template>

<script>
export default {
  props: {
    employee: {
      type: Object,
      default: null
    },
    value: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      localModalShow: this.value 
    };
  },
  watch: {
    value(newVal) {
      this.localModalShow = newVal;
    },
    localModalShow(newVal) {
      this.$emit("input", newVal);
    }
  },
  methods: {
    confirmDelete() {
      if (this.employee) {
        this.$emit("deleted", this.employee.id);
      }
    },
    closeModal() {
      this.localModalShow = false;
    }
  }
};
</script>
