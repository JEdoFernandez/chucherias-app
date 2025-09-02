<template>
  <v-app>
    <Header />
    
    <v-main>
      <v-container class="py-8">
        <RouterView />
      </v-container>
    </v-main>

    <Footer />
  </v-app>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
</script>

<style>
/* Estilos globales */
.v-application {
  background-color: #f5f5f5 !important;
}
</style>