import axios from 'axios';
import store from '@/store';
import router from '@/routes/router';

const baseUrl = process.env.VUE_APP_API_URL;

const http = axios.create({
    baseURL: baseUrl + '/api/',
});

http.interceptors.request.use(config => {
    const tokenJson = store.getters.token;
    if (tokenJson) {
        config.headers.Authorization = 'Bearer ' + tokenJson;
    }
    return config;
});

http.interceptors.response.use(response => response, async error => {
    if (error.response && error.response.status === 401) {
        router.push({path: '/login'})
    }
    return Promise.reject(error);
});

export default http;
