<template>
  <div class="logo">
    <v-img
      :aspect-ratio="1 / 1"
      :width="30"
      :src="require('../assets/logo.png')"
      eager
    ></v-img>
    <div class="logo-text">Stay</div>
  </div>
</template>

<style>
div.logo {
  display: inline-flex;
  align-items: center;
  height: max-content;
}
div.logo > .v-img {
  display: inline-block;
  margin-right: 10px;
}
div.logo > .logo-text {
  font-size: 1.5rem;
  font-weight: 500;
}
</style>
