export default {
  methods: {
    showErrorAlert(message = 'Ocorreu um erro!', title = 'Erro') {
      this.$swal.fire({
        title: title,
        text: message,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    },
    showSuccessAlert(message = 'Operação bem-sucedida!', title = 'Sucesso') {
      this.$swal.fire({
        title: title,
        text: message,
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 2000, 
        timerProgressBar: true
      });
    },
  },
};
