<script setup>
import Navbar from "@/components/UseNavbar.vue";
</script>

<template>
  <header class="navbar-wrapper">
    <Navbar></Navbar>
  </header>
  <router-view></router-view>
</template>

<style scoped>
.navbar-wrapper {
  position: sticky;
}
</style>
