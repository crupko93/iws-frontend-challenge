import Paho from 'paho-mqtt'

export default class IWS_MQTT {
  /** This class is a wrapper for the Paho MQTT class to provide extra
   *  functionality to the publish, subsribe and onMessage methods.
   * 
   * Paho JS MQTT Docs: https://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html
   * 
   * @param {string} host the hostname of the MQTT broker.
   * @param {int} port the port of the MQTT broker.
   */
    
// Create and initializes an object instance of a class. Check Paho js MQTT documentation to see required params.  
  constructor(host, port) {
    this.host = host
    this.port = port
    this.connected = false
    this.client = new Paho.Client(host, port, "clientjs");
    this.client.onMessageArrived = this.handleMessage.bind(this)
    this.callbackMap = new Map()
    this.onMessage = null
    this.subbedTopics = []
  }
// Change conection status property of object in case of successful connection.
  _defaultConnect() {
    this.connected = true
    console.log('Connected!')
  }
// Connect this Messaging client to its server.
  connect(callbackFn = null) {
    console.log(`Connecting to ws://${this.host}:${this.port}`);
    let successCallbackFn = this._defaultConnect
    if (callbackFn) {
      successCallbackFn = () => {
        this._defaultConnect()
        callbackFn()
      }
    }
    let options = {
      timeout: 3,
      onSuccess: successCallbackFn
    }
    this.client.connect(options)
  }
// Subscribe for messages.
  sub(topic, qos = 0, callbackFn = null) {
    this.client.subscribe(topic, { qos: qos })
    this.subbedTopics.push(topic)
    if (callbackFn) {
      this.callbackMap.set(topic, callbackFn)
    }
  }
// Add subbscribed topic in callback Map
  addSubCallback(topic, callbackFn) {
    if (this.subbedTopics.indexOf(topic) != -1) {
      this.callbackMap.set(topic, callbackFn)
    } else {
      console.log(`Callback cannot be added to topic:
      '${topic}'
      because it does not exist.`)
    }
  }
// Unsubscribe for messages.
 unsub(topic, callbackFn = null){
     this.client.unsubscribe(topic)
     this.subbedTopics.remove(topic)
     if(callbackFn){
         this.callbackMap.delete(topic)
     }
 } 
// Remove unsubbscribed topic in callback Map  
 removeSubCallback(topic, callbackFn) {
    if (this.subbedTopics.indexOf(topic) != -1) {
      this.callbackMap.delete(topic, callbackFn)
    } else {
      console.log(`Callback cannot be deleted:
      '${topic}'
      because it does not exist.`)
    }
 }    
// Publish a message to the consumers of the destination in the Message.
  pub(topic, payload, qos = 0, retain = false) {
    if (this.connected) {
      this.client.publish(topic, payload, qos, retain)
    } else {
      console.log(`MQTT not connected. Failed to publish:
      topic: ${topic}
      payload: ${payload}`)
    }
  }
// Handle arrived message and check if it exists in callback map
  handleMessage(message) {
    try {
      const callbackFn = this.callbackMap.get(message.destinationName)
      if (callbackFn) {
        callbackFn(message.destinationName, message.payloadString)
      } else if (this.onMessage) {
        this.onMessage(message.destinationName, message.payloadString)
      }
    } catch (e) {
      console.log(`Handler for topic ${message.destinationName} failed. Error: `, e)
    }
  }
}   