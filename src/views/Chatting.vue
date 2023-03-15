<template>
  <h2>Chatting test</h2>
  <div class="messages"></div>
  <!-- lower text bar and send button -->
  <v-app-bar location="bottom" height="48" color="primary" elevation="5"></v-app-bar>
</template>

<script>
import firebase from "firebase/compat/app";
import ChatTextBubble from "@/components/ChatTextBubble.vue";
import { connect, sendMsg } from "@/utils/chatting";

export default {
  data: {
    user: null,
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
    send() {
      console.log("hello !");
      sendMsg("hello");
    }
  }
};
