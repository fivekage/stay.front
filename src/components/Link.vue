<template>
  <v-card color="#fafafa" theme="light" class="mx-3 my-3 card">
    <v-row no-gutters>
      <v-col xs="8">
        <div>
          <div>
            <v-card-title class="text-h5"> {{ this.username }} </v-card-title>

            <v-card-subtitle class="text-caption subtitle"
              >{{ this.userUuid }}
              <v-tooltip activator="parent" location="end">{{
                this.userUuid
              }}</v-tooltip>
            </v-card-subtitle>
          </div>
        </div>
      </v-col>
      <v-col xs="4">
        <div class="d-flex justify-end">
          <v-avatar class="ma-1" size="65" rounded="0">
            <v-img
              class="avatar"
              src="https://cdn.vuetifyjs.com/images/cards/foster.jpg"
            ></v-img>
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
    userUuid: String,
    photo: String,
    username: String,
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
