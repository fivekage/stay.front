<template>
  <div class="text-bubble" :class="{ inwards: isInwards }">
    <div class="name-content">
      <p class="name">{{ this.name }}</p>
      <div class="contents" :class="{ inwards: isInwards }">
        <p v-if="this.content_type == 'text'">
          {{ this.content }}
        </p>
      </div>
    </div>
    <v-avatar
      :image="this.avatar"
      class="avatar"
      alt="Photo de profil"
      size="40"
      referrerpolicy="no-referrer"
    >
    </v-avatar>
  </div>
</template>

<script>
export default {
  name: "ChatTextBubble",
  props: {
    avatar: {
      type: String,
    },
    name: {
      type: String,
    },
    isInwards: {
      type: Boolean,
      default: true,
      required: true,
    },
    content_type: {
      type: String,
      default: "text",
    },
    content: {
      default: "",
      required: true,
    },
  },
};
</script>

<style scoped lang="scss">
.text-bubble {
  display: flex;
  flex-direction: row;
  margin: 0;
  margin-bottom: 10px;
  justify-content: flex-end;

  &.inwards {
    flex-direction: row-reverse;
  }

  .avatar {
    margin-right: 10px;
  }

  .name-content {
    .name {
      font-size: 0.8rem;
      margin: 0;
      text-align: end;
      padding: 0 10px;
    }

    .contents {
      padding: 10px;
      border-radius: 10px 0 10px 10px;
      background-color: #e08600;
      color: #000;
      max-width: 70%;
      /*min-width: fit-content;*/
      margin-right: 10px;
      float: right;

      &.inwards {
        background-color: #c7c7c7;
        border-radius: 10px 10px 0 10px;
      }
    }
  }
}
</style>
