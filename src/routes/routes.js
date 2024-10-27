import DashboardLayout from '@/views/Layout/DashboardLayout.vue';
import AuthLayout from '@/views/Pages/AuthLayout.vue';
import NotFound from '@/views/NotFoundPage.vue';
import store from '@/store';
import Roles from '@/enums/roles';

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.user || Object.keys(store.getters.user).length === 0) {
    next({ name: 'login' });
  } else {
    next();
  }
};

const ifAdmin = (to, from, next) => {
  const user = store.getters.user;
  if (user && user.role && user.role.id === Roles.ADMIN) {
    next();
  } else {
    next({ name: 'Controle de ponto' });
  }
};

const routes = [
  {
    path: '/',
    redirect: 'check-in',
    component: DashboardLayout,
    children: [
      {
        path: '/check-in',
        name: 'Controle de ponto',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Checkin.vue'),
        beforeEnter: ifNotAuthenticated,
      },
      {
        path: '/profile',
        name: 'Perfil',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Pages/UserProfile.vue'),
        beforeEnter: ifNotAuthenticated,
      },
      {
        path: '/subordinates/checkins',
        name: 'Pontos dos subordinados',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Subordinates/SubordinatesTable.vue'),
        beforeEnter: ifAdmin,
      },
      {
        path: '/employees',
        name: 'Funcionários',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Employees/EmployeesTable.vue'),
        beforeEnter: ifAdmin,
      }
    ]
  },
  {
    path: '/',
    redirect: 'login',
    component: AuthLayout,
    children: [
      {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Pages/Login.vue')
      },
      { path: '*', component: NotFound }
    ]
  }
];

export default routes;
