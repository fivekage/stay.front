<template>
  <div
    class="text-bubble"
    :class="{ inwards: isInwards, system: name === 'system' }"
  >
    <div class="name-content">
      <p v-if="this.name !== 'system'" class="name">{{ this.name }}</p>
      <div class="contents" :class="{ inwards: isInwards }">
        <p v-if="this.content_type === 'text'">
          {{ this.content }}
        </p>
      </div>
    </div>
    <v-avatar
      v-if="this.name !== 'system'"
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
  margin: 0;
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  &.system {
    justify-content: center;
    text-align: center;

    .name-content .contents {
      padding: 0;
      background-color: transparent;
      color: #000a;
      max-width: unset;
    }
  }

  &.inwards {
    flex-direction: row-reverse;
    text-align: start;
  }

  .name-content {
    .name {
      font-size: 0.8rem;
      margin: 0;
      padding: 0 10px;
    }

    .contents {
      padding: 10px;
      border-radius: 10px 0 10px 10px;
      background-color: #e08600;
      color: #000;
      min-width: fit-content;
      margin: 0 10px;
      float: right;

      &.inwards {
        background-color: #c7c7c7;
        border-radius: 0 10px 10px 10px;
        float: left;
      }
    }
  }
}
</style>
