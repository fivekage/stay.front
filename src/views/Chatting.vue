<template>
  <h2>{{ roomTitle }}</h2>
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
import { connect, disconnect, sendMsg } from "@/utils/chatting";
import { getUserInfos, getMessages, getRoomById } from "@/utils/api";

export default {
  components: {
    ChatTextBubble,
  },
  params: {
    type: {
      type: String,
      required: true,
      default: "room",
      validator(value) {
        // The value must match one of these strings
        return ["room", "direct"].includes(value);
      },
    },
    channelId: {
      type: String,
      required: true,
      default: "1852f195-0487-48be-9874-e9911189fbc0",
    },
  },
  data() {
    return {
      // room title
      roomTitle: "Room 1",
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
      roomId: {
        type: String,
        required: true,
      },
      // message to be sending
      message: "",
      // all messages in current channel
      messages: [],
      // actively sending a message right now
      sending: false,
      // users correspondances
      users: [],
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
      localStorage.setItem("uid", user.uid);
    }

    // connect to the websocket
    connect(async (msg) => {
      let receivedMessage = {};
      if (msg.body.user_id === "system") {
        let messageContent = msg.body.content.split(" ");

        if (messageContent.length == 2) {
          let userInfos = await getUserInfos(messageContent[0]);
          this.users[messageContent[0]] = userInfos.data;
        }

        const messageContentParsed =
          messageContent.length == 2
            ? `${this.users[messageContent[0]].username} ${messageContent[1]}`
            : null;
        receivedMessage = {
          content: messageContentParsed,
          isInwards: false,
          name: "system",
          content_type: msg.body.content_type,
          userUid: messageContent.length == 2 ? messageContent[0] : null,
        };
      } else {
        receivedMessage = {
          content: msg.body.content,
          isInwards: msg.body.user_id == this.user.uid ? false : true,
          name: this.users[msg.body.user_id].username,
          content_type: msg.body.content_type,
          avatar: this.users[msg.body.user_id].avatarURL,
        };
        debugger;
      }
      this.messages.push(receivedMessage);
    });
  },
  async mounted() {
    // Get room title
    this.getRoomInfos();
    // scroll to the bottom of the messages
    const messages = document.getElementById("messages");
    messages.scrollTop = messages.scrollHeight;
    // get history of messages
    const data = await getMessages(this.$route.params.channelId);
    const uniqueUsers = [
      ...new Set(data.data.map((message) => message.writedBy)),
    ];
    for (const userId of uniqueUsers) {
      const userInfos = await getUserInfos(userId);
      if (!this.users[userId]) {
        this.users[userId] = userInfos.data;
      }
    }
    this.messages = data.data.map((message) => {
      return {
        content: message.content,
        isInwards: message.writedBy == this.user.uid ? false : true,
        name: this.users[message.writedBy]?.username,
        content_type: message.content_type,
        avatar: this.users[message.writedBy]?.avatarURL,
      };
    });
  },
  beforeUnmount() {
    // disconnect from the websocket
    disconnect();
  },
  methods: {
    send() {
      if (this.message === "") return;
      this.sending = true;
      const msgToSend = {
        room_id: "1852f195-0487-48be-9874-e9911189fbc0", //this.channelId,
        user_id: this.user.uid,
        content_type: "text",
        content: this.message,
      };
      sendMsg(msgToSend);
      this.sending = false;
      this.message = "";
    },
    getRoomInfos() {
      getRoomById(this.$route.params.channelId).then((data) => {
        this.roomTitle = data.data.name;
      });
    },
  },
};
</script>
