<template>
  <h2>Chatting test</h2>
  <div id="messages">
    <chat-text-bubble
      v-for="(message, index) in messages"
      :key="index"
      :content="message.content"
      :isInwards="message.isInwards"
      :name="message.name"
      :content_type="message.content_type"
      :avatar="message.avatar"
    ></chat-text-bubble>
  </div>
  <!-- lower text bar and send button -->
  <v-app-bar location="bottom" absolute height="48" color="white" elevation="0">
    <v-text-field
      v-model="message"
      id="messageBox"
      single-line
      variant="outlined"
      density="compact"
      class="rounded-pill ml-4"
      color="primary-darker"
      :active="!sending"
      @keyup.enter="send()"
    >
      <template v-slot:loader>
        <v-progress-linear
          v-if="sending"
          color="primary"
          absolute
          height="4"
          indeterminate
        ></v-progress-linear>
      </template>
    </v-text-field>
    <v-btn
      icon="mdi-send"
      variant="flat"
      size="small"
      class="mr-4"
      :active="!sending"
      color="primary-darker"
      @click="send()"
    />
  </v-app-bar>
</template>

<script>
import firebase from "firebase/compat/app";
import ChatTextBubble from "@/components/ChatTextBubble.vue";
import { connect, sendMsg } from "@/utils/chatting";

export default {
  components: {
    ChatTextBubble,
  },
  data() {
    return {
      // user object
      user: null,
      // channel type
      type: {
        type: String,
        required: true,
        validator(value) {
          // The value must match one of these strings
          return ["channel", "direct"].includes(value);
        },
      },
      // channel id
      id: {
        type: Number,
        required: true,
      },
      // message to be sending
      message: "",
      // all messages in current channel
      messages: [],
      // actively sending a message right now
      sending: false,
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
    connect((msg) => {
      console.log("Received message event");
      // TODO: Later, we'll get the user data
      // according to what's stored on firebase
      const receivedMessage = {
        content: msg.body.content,
        isInwards: false,
        name: msg.body.user_id,
        content_type: msg.body.content_type,
        avatar:
          "https://pbs.twimg.com/media/FSoXgecXwAAY81T?format=webp&name=small",
      };
      this.messages.push(receivedMessage);
    });
  },
  methods: {
    send() {
      if (this.message === "") return;
      this.sending = true;
      const msgToSend = {
        user_id: this.user.uid,
        content_type: "text",
        content: this.message,
      };
      sendMsg(msgToSend);
      setTimeout(() => {
        // TODO: Later, we'll get the user data
        // according to what's stored on firebase
        const sentMessage = {
          content: this.message,
          isInwards: false,
          name: "Moi",
          content_type: "text",
          avatar:
            "https://pbs.twimg.com/media/FSoXgecXwAAY81T?format=webp&name=small",
        };
        this.messages.push(sentMessage);
        this.sending = false;
        this.message = "";
      }, 1000);
    },
  },
};
</script>
