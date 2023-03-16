<template>
  <h2>Chatting test</h2>
  <div class="messages"></div>
  <!-- lower text bar and send button -->
  <v-app-bar location="bottom" height="48" color="white" elevation="0">
    <v-text-field
      v-model="message"
      single-line
      variant="outlined"
      density="compact"
      class="rounded-pill px-2 py-0 my-0"
      color="primary-darker"
      @keyup.enter="send(message)"
    ></v-text-field>
    <v-btn
      icon="mdi-send"
      variant="flat"
      size="small"
      color="primary-darker"
      @click="send(message)"
    />
  </v-app-bar>
</template>

<script>
import firebase from "firebase/compat/app";
//import ChatTextBubble from "@/components/ChatTextBubble.vue";
import { connect, sendMsg } from "@/utils/chatting";
import integer from "vuelidate/lib/validators/integer";

export default {
  data() {
    return {
      user: null,
      type: {
        type: String,
        validator(value) {
          // The value must match one of these strings
          return ["channel", "direct"].includes(value);
        },
      },
      id: integer,
    };
  },
  created() {
    const user = firebase.auth().currentUser;
    firebase
      .auth()
      .currentUser.getIdToken()
      .then((data) => localStorage.setItem("token", data));
    if (user) {
      this.user = user;
    }

    // connect to the websocket
    connect();
  },
  methods: {
    send(message) {
      if (message === "") return;
      sendMsg(message);
    },
  },
};
</script>
