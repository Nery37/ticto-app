import RepositoryFactory from "@/repositories/RepositoryFactory";

const Repository = {
  install(Vue) {
    Vue.prototype.$repositories = RepositoryFactory;
  },
};

export default Repository;
