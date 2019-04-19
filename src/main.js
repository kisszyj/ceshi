// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import VueI18n from "vue-i18n";
import Constants from '@/util/constants';
import VueLazyLoad from 'vue-lazyload';
import VueSuperagent from 'vue-superagent'

import langEn from '../static/lang/en';
import langZhCH from '../static/lang/zhCH';
import 'swiper/dist/css/swiper.min.css';
import "@/css/index.css"


Vue.config.productionTip = false
Vue.use(VueI18n);
Vue.use(Constants);
Vue.use(VueLazyLoad);
Vue.use(VueSuperagent)


const i18n = new VueI18n({
  locale:"zh-hk",
  messages:{
    "en":langEn,
    "zh-hk":langZhCH,
  }

})

/* eslint-disable no-new */
window.myApp = new Vue({
  el: '#app',
  router,
  i18n,
  components: { App },
  template: '<App/>',
  data:{
    eventHub:new Vue(),
  }
})
