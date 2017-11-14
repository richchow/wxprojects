// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
//import Vuex from 'vuex'
import App from './App'
import router from './router'
import 'weui/dist/style/weui.min.css'
//import AMap from 'vue-amap';
//import wx from 'weixin-js-sdk';

Vue.config.productionTip = false

//Vue.use(Vuex)
/*
Vue.use(AMap);
AMap.initAMapApiLoader({
  key: 'ff0e4c292a8227558e2eb56e1fcaa2b0',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor','Geolocation']
});
*/

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
