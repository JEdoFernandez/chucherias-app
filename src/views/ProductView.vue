<template>
  <div v-if="product">
    <v-btn
      to="/"
      color="secondary"
      class="mb-4"
    >
      ← Volver
    </v-btn>
    
    <v-card>
      <v-img
        :src="product.image"
        height="300px"
        cover
      ></v-img>
      
      <v-card-title class="text-h2">{{ product.name }}</v-card-title>
      
      <v-card-text>
        <p class="text-h4 my-4">Precio: {{ product.price }} €</p>
        
        <v-btn
          color="primary"
          size="x-large"
          @click="store.addToCart(product)"
          prepend-icon="mdi-cart-plus"
        >
          Añadir al carrito
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
  
  <v-alert
    v-else
    type="error"
    title="Producto no encontrado"
  ></v-alert>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '@/stores/productStore'

const route = useRoute()
const store = useProductStore()

const product = computed(() => {
  return store.products.find(p => p.id === Number(route.params.id))
})
</script>