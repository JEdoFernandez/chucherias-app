<template>
  <v-app-bar color="primary">
    <v-toolbar-title>Tienda de Chucherías</v-toolbar-title>
    
    <v-spacer></v-spacer>
    
    <v-btn to="/" variant="text">Inicio</v-btn>
    <v-btn to="/cart" variant="text">
      Carrito
      <v-badge 
        v-if="store.cart.length > 0" 
        :content="store.cart.length" 
        color="error"
        inline
      ></v-badge>
    </v-btn>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useProductStore } from '@/stores/productStore'
const store = useProductStore()
</script>