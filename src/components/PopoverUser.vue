<template>
  <div class="text-center">
    <v-menu v-model="menu" :close-on-content-click="false" location="end">
      <template v-slot:activator="{ props }">
        <img
          v-if="this.name !== 'system'"
          class="avatar"
          :src="this.avatar"
          alt="Photo de profil"
          referrerpolicy="no-referrer"
          v-bind="props"
        />
      </template>

      <v-card min-width="300">
        <v-list>
          <v-list-item
            :prepend-avatar="this.avatar"
            :title="this.name"
            :subtitle="'#' + this.userUid.slice(0, 4)"
          >
            <template v-slot:append>
              <v-btn
                variant="text"
                :class="fav ? 'text-red' : ''"
                :icon="fav ? 'mdi-heart' : 'mdi-heart-off-outline'"
                @click="like()"
                :disabled="likeDisabled"
              ></v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { likeAnUser } from "@/utils/api";

export default {
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
    liked: {
      type: Boolean,
    },
  },
  data: () => ({
    fav: false,
    menu: false,
    likeDisabled: false,
  }),
  created() {
    console.log("name: ", this.userUid);
    console.log("do i like him again ? ", this.liked);
    if (this.liked) {
      this.fav = true;
    } else {
      this.fav = false;
      if (
        this.name !== "system" &&
        this.userUid != null &&
        localStorage.getItem("uid") === this.userUid
      ) {
        this.likeDisabled = true;
      }
    }
  },
  methods: {
    like() {
      const previousStateFav = this.fav;
      this.fav = !this.fav;
      likeAnUser(localStorage.getItem("uid"), this.userUid)
        .then((res) => {
          console.log("likeAnUser: ", res);
        })
        .catch((err) => {
          console.log("error during likeAnUser: ", err);
          this.fav = previousStateFav;
        });
    },
  },
};
</script>

<style scoped>
.avatar {
  margin: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #c7c7c7;
  object-fit: cover;
  object-position: center;
}
</style>
