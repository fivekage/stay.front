<template>
  <div
    class="text-bubble"
    :class="{ inwards: isInwards, system: name === 'system' }"
  >
    <div class="name-content">
      <p v-if="this.name !== 'system'" class="name">{{ this.name }}</p>
      <div class="contents" :class="{ inwards: isInwards }">
        <!-- image -->
        <img
          v-if="this.content_type === 'image'"
          :src="this.content"
          alt="image"
          style="max-width: 100%; max-height: 100%"
        />
        <!-- text -->
        <p v-else>
          {{ this.content }}
        </p>
      </div>
      <p class="name block" v-if="this.name !== 'system'">
        {{ this.formattedDate }}
      </p>
    </div>
    <PopoverUser
      :avatar="this.avatar"
      :name="this.name"
      :userUid="this.userUid"
      :liked="this.liked"
    ></PopoverUser>
  </div>
</template>

<script>
import PopoverUser from "./PopoverUser.vue";
export default {
  components: { PopoverUser },
  name: "ChatTextBubble",
  props: {
    avatar: {
      type: String,
    },
    name: {
      type: String,
    },
    userUid: {
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
    liked: {
      type: Boolean,
    },
    date: {
      type: String,
    },
  },
  data() {
    return {
      formattedDate: "",
    };
  },
  created() {
    console.log(this.content);
    const date = new Date(this.date);
    this.formattedDate = date
      .toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(/(\d+)\/(\d+)\/(\d+),\s(\d+):(\d+)/, "$3-$1-$2 $4:$5");
  },
};
</script>

<style scoped lang="scss">
.text-bubble {
  margin: 10px 1em 0 1em;
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
