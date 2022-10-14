<template>
  <div class="hello">
    <h1>HelloWorld status: {{ msg }}</h1>
    <h1>input: <span :style="styleObj.input">{{ rawActual }}</span></h1>
    <h1>output: <span :style="styleObj.output">{{ engActual }} deg C</span></h1>
    <br>
    <h1>Settings form:</h1>
    <form action="javascript:void(0)">
        <label for="rawLow">Raw Low : </label>
        <input type="range" id="rawLow" v-model="rawLow" min="0" max="100"> <b>{{ rawLow }}</b>
        <br><br>
        <label for="rawHigh">Raw High : </label> 
        <input type="range" id="rawHigh" v-model="rawHigh" min="0" max="100"> <b>{{ rawHigh }}</b>
        <br><br>
        <label for="engLow">Engineering Low : </label>
        <input type="range" id="engLow" v-model="engLow" min="-100" max="100"> <b>{{ engLow }}</b>
        <br><br>
        <label for="engHigh">Engineering High : </label>
        <input type="range" id="engHigh" v-model="engHigh" min="-100" max="100"> <b>{{ engHigh }}</b>
        <br><br>
        <label for="oscSpeed">Oscillation speed : </label>
        <input type="range" id="oscSpeed" v-model="oscSpeed" min="0.01" max="9999" step="0.01"> <b>{{ oscSpeed }}</b>
    </form>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      msg: "init",
      rawActual: 0, // Received raw sensor value, mA
      rawLow: 4, // Minimum sensor reading, mA
      rawHigh: 20, // Maximum sensor readin, mA
      engActual: 0, // Current thermometer reading, deg C
      engLow: -70, // Minimum temperature of thermometer, deg C
      engHigh: 70, // Maximum temperature of thermometer, deg C
      oscSpeed: 1000, // Oscilation speed
      styleObj: {
          input: {},
          output: {},
      },
    };
  },
  mounted() {
    this.$root.$on("mqtt-connected", () => {
      this.$root.mqtt.sub("iws_slava", 0, this.onIwsFoo);
      this.$root.mqtt.pub("iws-foo", "mounted");
      this.$root.mqtt.onMessage = (topic, payload) => {console.log(topic, payload)}
    });
  },
  methods: {
    onIwsFoo(topic, payload) {
// Required condition for styling results         
      this.rawActual = payload;
        
      if (this.rawActual < this.rawLow) {
          this.styleObj.input = {'color' : 'red'}
      }else{
          this.styleObj.input = {}
      }
     
      if (this.rawActual <= ((this.rawHigh/100)*40)) {
          this.styleObj.output = {'background-color' : 'blue', 'color': 'white'}
      }else if (this.rawActual >= ((this.rawHigh/100)*80)) {
          this.styleObj.output = {'background-color' : 'red', 'color': 'white'}
      }else{
          this.styleObj.output = {}
      }
        
// conversion from a physical (Pv) value to a curent (I) value. Source of formula: https://www.divize.com/techinfo/4-20ma-calculator.html 
      let output = (((this.engHigh - this.engLow) / (this.rawHigh - this.rawLow)) * (this.rawActual - this.rawLow)) + this.engLow ;
      this.engActual = parseFloat(output).toFixed(2);
      
//      console.log(`Foo - topic: ${topic} payload: ${payload}`);
//      this.msg = payload;
    },
  },
};
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
