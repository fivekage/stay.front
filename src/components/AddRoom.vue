<template>
  <form class="form" ref="form" @submit.prevent="validate">
    <v-text-field
      v-model="roomName"
      label="Nom"
      variant="outlined"
      color="primary-darker"
      required
    ></v-text-field>
    <v-text-field
      v-model="roomDescription"
      label="Description"
      required
      variant="outlined"
      color="primary-darker"
    ></v-text-field>
    <div>
      <div class="text-caption">
        Rayon
        <span class="">({{ roomRadius.toFixed(1) }} mètres)</span>
      </div>
      <v-slider
        v-model="roomRadius"
        on-update:model-value="roomRadius = $event.toFixed(1)"
        thumb-label="always"
        min="50"
        max="1000"
        color="primary"
      ></v-slider>
    </div>
    <v-color-picker
      v-model="roomColor"
      class="ma-2 colorPicker"
      :swatches="swatches"
      show-swatches
      rounded
      :modes="['rgb']"
      hide-canvas
      hide-inputs
      required
    ></v-color-picker>
    <v-row class="py-2">
      <v-col cols="12" align="center">
        <v-btn
          block
          class="mr-4"
          center
          color="primary"
          flat
          @click="validate"
          :disabled="button.disabled"
          rounded="lg"
          >Créer</v-btn
        >
      </v-col>
    </v-row>
    <v-alert
      density="compact"
      :type="this.message.type"
      v-show="this.message.display"
      variant="outlined"
      >{{ this.message.text }}</v-alert
    >
  </form>
</template>

<script>
import { required, maxLength } from "vuelidate/lib/validators";
import { createRoom } from "../utils/api";

export default {
  name: "AddRoom",
  // NEED to pass data to make it work <child-vue :some-data="someData"></child-vue>
  props: [`"lat", "lng"`],

  validations: {
    roomName: { required, maxLength: maxLength(10) },
    roomDescription: { required },
    roomRadius: { required },
  },

  data: () => ({
    roomName: "",
    roomDescription: "",
    roomRadius: 0,
    roomColor: "#0000FF",
    button: {
      disabled: false,
    },
    message: {
      type: "",
      text: "",
      display: false,
    },

    swatches: [["#FF0000"], ["#FFFF00"], ["#00FF00"], ["#00FFFF"], ["#0000FF"]],
  }),

  methods: {
    validate() {
      this.lat = 53.3;
      this.lng = 3.3;
      createRoom(
        {
          name: this.roomName,
          description: this.roomDescription,
          radius: this.roomRadius,
          color: this.roomColor,
          lat: this.lat,
          lng: this.lng,
          // TODO: to remove
          uid: "8a283a77-6fd3-4625-9087-fac29c8eb5df",
          createdBy: "samy",
        },
        () => {
          this.message.type = "success";
          this.message.text = "Le salon a bien été créée";
          this.message.display = true;
        },
        (error) => {
          console.error(error);
          this.message.type = "error";
          this.message.text = error.message;
          this.message.display = true;
        }
      );

      this.$emit("add-room", {
        name: this.roomName,
        description: this.roomDescription,
        radius: this.roomRadius,
        color: this.roomColor,
        lat: this.lat,
        lng: this.lng,
      });
    },
  },
};
</script>

<style scoped>
div.add-room {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 20px;
}
.full-width {
  width: 100%;
}
div.v-field {
  outline: solid;
  outline-color: brown;
}
.colorPicker {
  display: inline;
}

.form {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
</style>
