<template>
  <div>
    <p>Publisher: {{ rawActual }}</p>
  </div>
</template>

<script>
export default {
  name: "RawPublisher",
  data() {
    return {
      rawActual: 0,
    };
  },
  mounted() {
    console.log("mounted");
    window.setInterval( ()=>{
        this.rawPublisher();
    }, 1000);
  },
  methods: {
    rawPublisher() {       
      // This function oscillates rawActual between 0 & 20 and publishes result to mqtt.
      this.rawActual = (Math.random() * (20 - 0) + 0).toFixed(2);
      //console.log("fix me");
      this.$root.mqtt.pub('iws_slava', this.rawActual.toString())
        
        
    },
  },
};
</script>