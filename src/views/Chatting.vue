<template>
  <h2 class="mb-2 d-block text-center">{{ roomTitle }}</h2>
  <v-divider class="mb-4"></v-divider>
  <v-container fluid class="fill-height" id="messages">
    <v-progress-circular
      class="mx-5 my-5 loader"
      v-if="messages == null || messages.length === 0"
      indeterminate
      color="orange"
      :size="80"
      :width="8"
    ></v-progress-circular>
    <chat-text-bubble
      v-for="(message, index) in messages"
      :key="index"
      :content="message.content"
      :isInwards="message.isInwards"
      :name="message.name"
      :userUid="message.userUid"
      :content_type="message.content_type"
      :avatar="message.avatar"
      :liked="message.liked"
      :date="message.date"
    ></chat-text-bubble>
  </v-container>
  <!-- lower text bar and send button -->
  <v-app-bar
    location="bottom"
    fixed
    height="48"
    color="white"
    elevation="0"
    class="text-bar"
  >
    <v-text-field
      v-model="message"
      id="messageBox"
      single-line
      variant="outlined"
      maxlength="255"
      density="compact"
      class="rounded-pill ml-4 msg-to-send"
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
      <template v-slot:append-inner>
        <Canva @submit-canva="sendCanva" ref="canva" />

        <v-btn
          icon="mdi-image-area"
          class="mx-3"
          density="compact"
          :loading="isSelecting"
          @click="handleFileImport"
        >
        </v-btn>
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
    <!-- Create a File Input that will be hidden but triggered with JavaScript -->
    <input
      ref="uploader"
      class="d-none"
      type="file"
      @change="onFileChanged"
      accept="image/gif, image/jpeg, image/png"
    />
  </v-app-bar>
</template>

<script>
import firebase from "firebase/compat/app";
import ChatTextBubble from "@/components/ChatTextBubble.vue";
import Canva from "@/components/Canva.vue";
import { connect, disconnect, sendMsg } from "@/utils/chatting";
import {
  getUserInfos,
  getMessages,
  getRoomById,
  doILikeThisUser,
  storeFile,
} from "@/utils/api";

export default {
  components: {
    ChatTextBubble,
    Canva,
  },
  data() {
    return {
      // room title
      roomTitle: "Loading..",
      // user object
      user: null,
      // canva image
      canvaImage: null,
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
      // rules for file input
      rules: [
        (value) => {
          return (
            !value?.length ||
            value[0].size < 2000000 ||
            "Avatar size should be less than 2 MB!"
          );
        },
      ],
      // selected file
      isSelecting: false,
      selectedFile: null,
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

    this.roomId = this.$route.params.channelId;
    localStorage.setItem("room_id", this.roomId);

    // connect to the websocket
    this.connectSocket();
  },
  mounted() {
    // Get room title
    this.getRoomInfos();

    // scroll to the bottom of the messages
    const messages = document.getElementById("messages");
    messages.scrollTop = messages.scrollHeight;

    // get all messages
    this.getHistoryMessage();

    // watch canva image
    this.$watch("$refs.canva.image", (newVal) => {
      this.canvaImage = newVal;
    });
  },
  beforeUnmount() {
    // disconnect from the websocket
    disconnect();
  },
  methods: {
    connectSocket() {
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
          // if the user is not on the page, show a notification
          if (document.hidden || msg.body.user_id != this.user.uid) {
            this.showNotification(
              this.users[msg.body.user_id].username,
              this.users[msg.body.user_id].avatarURL,
              msg.body.content
            );
          }
          receivedMessage = {
            content: msg.body.content,
            isInwards: msg.body.user_id == this.user.uid ? false : true,
            name: this.users[msg.body.user_id].username,
            userUid: msg.body.user_id,
            content_type: msg.body.content_type,
            avatar: this.users[msg.body.user_id].avatarURL,
            date: Date.now(),
          };
        }
        this.messages.push(receivedMessage);
      });
    },
    send(contentType = "text") {
      if (this.message === "") return;
      this.sending = true;
      const msgToSend = {
        room_id: this.$route.params.channelId,
        user_id: this.user.uid,
        content_type: contentType,
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
    async getHistoryMessage() {
      // get history of messages
      const data = await getMessages(this.$route.params.channelId);
      const uniqueUsers = [
        ...new Set(data.data.map((message) => message.writedBy)),
      ];

      // Get Users Liked
      const promisesLikes = uniqueUsers.map(async (user) => {
        const userLiked = await this.doILikedThisUser(user);
        if (userLiked.data) {
          return user;
        }
      });
      const usersLiked = await Promise.all(promisesLikes);

      // Fill users correspondances
      const promisesUserInfos = uniqueUsers.map(async (userId) => {
        const userInfos = await getUserInfos(userId);
        if (!this.users[userId]) {
          this.users[userId] = userInfos.data;
        }
      });
      await Promise.all(promisesUserInfos);

      // Handle messages history
      const oldMessages = data.data.map((message) => {
        return {
          content: message.content,
          isInwards: message.writedBy == this.user.uid ? false : true,
          userUid: message.writedBy,
          name: this.users[message.writedBy]?.username,
          content_type: message.contentType,
          avatar: this.users[message.writedBy]?.avatarURL,
          liked: usersLiked.includes(message.writedBy),
          date: message.writedAt,
        };
      });
      if (this.messages.length == 0) {
        this.messages = oldMessages;
      } else {
        // we concat new messages in old messages and not
        // the other way around because we want to display
        // the oldest messages first
        this.messages = oldMessages.concat(this.messages);
      }
    },
    async doILikedThisUser(userUid) {
      if (localStorage.getItem("uid") == userUid) return false;
      return await doILikeThisUser(localStorage.getItem("uid"), userUid);
    },
    async sendCanva() {
      if (!this.canvaImage) return;

      fetch(this.canvaImage)
        .then((res) => res.blob())
        .then(async (blob) => {
          const file = new File([blob], "image.png", {
            type: "image/png",
            lastModified: Date.now(),
          });

          const imageUrl = await storeFile(file);
          this.message = imageUrl.data;
          this.send("image");
        });
    },
    showNotification(username, avatar, message) {
      // Request permission to display notifications
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          // Create a new notification instance
          const notification = new Notification(`${this.roomTitle}`, {
            body: `${username} vous a envoyé un message !`,
            icon: avatar || "/logo.png",
          });

          // Play a sound
          let soundPath = "/notification.mp3"; // default sound
          if (message === "💀") soundPath = "/notification_dead.mp3";

          const audio = new Audio(soundPath);
          audio.play();

          // Handle click event on the notification
          notification.onclick = () => {
            // Do something when the notification is clicked
            console.log("Notification clicked!");
          };
        }
      });
    },

    handleFileImport() {
      this.isSelecting = true;

      // After obtaining the focus when closing the FilePicker, return the button state to normal
      window.addEventListener(
        "focus",
        () => {
          this.isSelecting = false;
        },
        { once: true }
      );

      // Trigger click on the FileInput
      this.$refs.uploader.click();
    },
    onFileChanged(e) {
      this.selectedFile = e.target.files[0];
      // Verify if file is an image, and less than 10MB

      if (!this.selectedFile.type.includes("image")) {
        console.error("need an image file!");
        return;
      }
      storeFile(this.selectedFile).then((imageUrl) => {
        this.message = imageUrl.data;
        this.send("image");
      });
    },
  },
  watch: {
    messages() {
      this.$nextTick(() => {
        const messages = document.getElementById("messages");
        messages.scrollTop = messages.scrollHeight;
        console.log("messages count: ", this.messages.length);
      });
    },
  },
};
</script>

<style lang="scss">
.v-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 !important;

  h2 {
    padding: 16px;
    padding-bottom: 0;
  }

  #messages {
    overflow: auto;
    min-height: 0;

    & > :last-child {
      margin-bottom: 1em;
    }
  }
}

.v-app-bar.text-bar .v-input.msg-to-send {
  margin-right: 10px;
  .v-input__details {
    display: none !important;
  }
}
</style>
