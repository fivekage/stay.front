<template>
  <div class="text-center">
    <v-menu :close-on-content-click="false" location="top">
      <template v-slot:activator="{ props }">
        <v-icon v-bind="props" icon="mdi-draw"></v-icon>
      </template>

      <v-card class="canvas-container">
        <div class="flex-row">
          <div class="source">
            <vue-drawing-canvas
              ref="VueCanvasDrawing"
              v-model:image="image"
              :width="screenWidth < 600 ? screenWidth - 50 : 400"
              :height="screenWidth < 600 ? screenWidth - 50 : 400"
              :stroke-type="strokeType"
              :line-cap="lineCap"
              :line-join="lineJoin"
              :fill-shape="fillShape"
              :eraser="eraser"
              :lineWidth="line"
              :color="color"
              :background-color="backgroundColor"
              :watermark="watermark"
              :initial-image="initialImage"
              saveAs="png"
              :styles="{
                border: 'solid 1px #000',
              }"
              :lock="disabled"
              @mousemove="getCoordinate($event)"
              :additional-images="additionalImages"
            />
            <div class="button-container">
              <button
                type="button"
                @click.prevent="$refs.VueCanvasDrawing.undo()"
              >
                <v-icon v-bind="props" icon="mdi-undo"></v-icon>
                Annuler
              </button>
              <button
                type="button"
                @click.prevent="$refs.VueCanvasDrawing.redo()"
              >
                <v-icon v-bind="props" icon="mdi-redo"></v-icon>
                Revenir
              </button>
              <button
                type="button"
                @click.prevent="$refs.VueCanvasDrawing.reset()"
              >
                <v-icon v-bind="props" icon="mdi-eraser"></v-icon>
                Réinitialiser
              </button>
            </div>
            <div class="button-container">
              <button type="button" @click.prevent="eraser = !eraser">
                <span v-if="eraser">
                  <v-icon icon="mdi-eraser-variant"></v-icon>
                  Effacer
                </span>
                <span v-else>
                  <v-icon icon="mdi-pencil"></v-icon>
                  Dessiner
                </span>
              </button>
              <div>
                <span>
                  Taille
                  <select v-model="line">
                    <option v-for="n in 15" :key="'option-' + n" :value="n">
                      {{ n }}
                    </option>
                  </select>
                </span>
              </div>
              <span
                >Couleur
                <input type="color" v-model="color" />
              </span>
            </div>
            <div class="mt-4">
              <v-btn
                block
                :disabled="!image"
                append-icon="mdi-send"
                size="small"
                variant="tonal"
                @click="sendCanvaImage()"
              >
                Envoyer
              </v-btn>
            </div>
          </div>
        </div>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import VueDrawingCanvas from "vue-drawing-canvas";
export default {
  components: {
    VueDrawingCanvas,
  },
  props: {},
  data() {
    return {
      screenHeight: 400,
      screenWidth: 400,
      initialImage: [
        {
          type: "dash",
          from: {
            x: 262,
            y: 154,
          },
          coordinates: [],
          color: "#000000",
          width: 5,
          fill: false,
        },
      ],
      x: 0,
      y: 0,
      image: "",
      eraser: false,
      disabled: false,
      fillShape: false,
      line: 5,
      color: "#000000",
      strokeType: "dash",
      lineCap: "square",
      lineJoin: "miter",
      backgroundColor: "#FFFFFF",
      watermark: null,
      additionalImages: [],
    };
  },
  mounted() {
    this.screenHeight = screen.height;
    this.screenWidth = screen.width;
    if ("vue-drawing-canvas" in window.localStorage) {
      this.initialImage = JSON.parse(
        window.localStorage.getItem("vue-drawing-canvas")
      );
    }
  },
  methods: {
    sendCanvaImage() {
      console.log("bon");
      this.$emit("submitCanva", this.image);
      this.$refs.VueCanvasDrawing.reset();
    },
    getCoordinate(event) {
      let coordinates = this.$refs.VueCanvasDrawing.getCoordinates(event);
      this.x = coordinates.x;
      this.y = coordinates.y;
    },
  },
};
</script>

<style scoped>
.canvas-container {
  padding: 20px;
}

body {
  font-family: "Roboto", sans-serif;
}
.flex-row {
  display: flex;
  flex-direction: row;
}
.button-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: baseline;
  gap: 20px;
}
.button-container > * {
  margin-top: 15px;
  margin-right: 10px;
}

@media (max-width: 599px) {
  .map {
    height: calc(100% - 65px);
  }
  .button-container {
    gap: 5px;
  }
  .canvas-container {
    padding: 10px;
  }
}
</style>
