// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import VueAxios from 'vue-axios';
import axios from 'axios';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/css/VUECharts.less';
Vue.config.productionTip = false;

Vue.use(VueAxios, axios);
Vue.use(ElementUI);
Vue.prototype.$ELEMENT = { size: 'medium' };
/* eslint-disable no-new */
var eventHub = new Vue();
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  data: {
    eventHub: eventHub,
    sprintSelected: null,
    allGroups: [],
    summary: null
  },
  methods: {
    querySummaryData: function (params) {
      var self = this;
      this.summary = null;
      this.allGroups = [];
      var sprintid = params._id;
      this.axios.get('/api/v1/getGroups?sprintid=' + sprintid).then(function (groupsData) {
        self.allGroups = groupsData.data.resData;
        self.axios.get('/api/v1/summary?sprintid=' + sprintid).then(function (summarydata) {
          self.summary = summarydata.data.resData;
          self.eventHub.$emit('sprintChanged', summarydata.data);
        });
      });
    },
    getDayDataDay: function (day) {
      var summaryReturnItem = null;
      for (var i = 0; i < this.summary.summary.length; i++) {
        var summaryItem = this.summary.summary[i];
        var summaryday = summaryItem.day;
        if (summaryday === day) {
          summaryReturnItem = summaryItem;
          break;
        }
      }
      return summaryReturnItem;
    }
  },
  created: function () {
    var self = this;
    if (this.eventHub) {
      this.eventHub.$on('sprintSelected', function (params) {
        self.sprintSelected = params;
      });
      this.eventHub.$on('sprintDataChanged', function (params) {
        self.querySummaryData(self.sprintSelected);
      });
    }
  },
  watch: {
    sprintSelected: function () {
      this.querySummaryData(this.sprintSelected);
    }
  }
});
