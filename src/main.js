import Vue from "vue";
import {createStore} from "vuex";
import App from "./App.vue";
import IWS_MQTT from "./mqtt"


const store  = createStore({
    /* your code here */
    state: {
        oscSpeed: 0
    }
});

Vue.config.productionTip = false;
new Vue({
  store,    
  render: function (h) {
    return h(App);
  },
  data() {
    return {
      mqtt: null
    }
  },
  created() {
    const HOST = 'test.mosquitto.org';
    const PORT = 8080;
    this.mqtt = new IWS_MQTT(HOST, PORT);
    this.mqtt.connect(() => {
      this.$emit('mqtt-connected', true)
    })

  }
}).$mount("#app");