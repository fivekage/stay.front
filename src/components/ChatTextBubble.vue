<template>
  <div class="text-bubble">
    <v-avatar
      :image="avatar"
      v-if="isInwards"
      alt="Photo de profil"
      size="80"
      referrerpolicy="no-referrer"
    >
    </v-avatar>
    <div>
      <p class="name" v-if="isInwards">{{ name }}</p>
      <div :class="{ contents, inwards: isInwards }">
        <slot></slot>
      </div>
    </div>
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
  margin: 10px 0;

  .name {
    font-size: 0.8rem;
    margin: 0;
    margin-bottom: 5px;
  }

  .contents {
    display: inline-block;
    padding: 10px;
    border-radius: 10px;
    background-color: #ec6f09;
    color: #fff;
    max-width: 80%;
    word-wrap: break-word;
    margin: 0 10px;

    &.inwards {
      background-color: #c7c7c7;
      color: #000;
    }
  }
}
</style>
