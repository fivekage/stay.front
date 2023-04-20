<template>
  <v-card color="#fafafa" theme="light" class="mx-3 my-3 card">
    <v-row no-gutters>
      <v-col xs="8">
        <div>
          <div>
            <v-card-title class="text-h6 mr-0">
              {{ this.user.username }}
            </v-card-title>

            <v-card-subtitle class="text-caption subtitle"
              >#{{ this.user.uid.slice(0, 4) }}
            </v-card-subtitle>
          </div>
        </div>
      </v-col>
      <v-col xs="3">
        <div class="d-flex justify-end">
          <v-avatar class="ma-1" size="55" rounded="0">
            <v-img class="avatar" :src="this.user.avatarURL"></v-img>
          </v-avatar>
          <v-card-actions class="chat">
            <v-btn size="large" color="#000">
              <v-icon
                icon="mdi-message-text"
                size="x-large"
                color="black"
              ></v-icon>
            </v-btn>
          </v-card-actions>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: "Link",
  props: {
    roomGuid: String,
    user: Object,
  },
  computed: {
    mobile() {
      return this.$vuetify.breakpoint.sm;
    },
  },
};
</script>

<style scoped>
.avatar {
  border-radius: 0;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
}
.card {
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
    rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;

  border-radius: 0;
}
.subtitle {
  max-width: 100px;
}
</style>
