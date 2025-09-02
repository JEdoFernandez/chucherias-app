<template>
  <v-card hover elevation="2" class="h-100">
    <v-img
      :src="product.image"
      height="200px"
      cover
    ></v-img>
    
    <v-card-title class="text-h5">{{ product.name }}</v-card-title>
    
    <v-card-text>
      <p class="text-h6 text-primary">{{ product.price }} €</p>
      <v-btn
        color="primary"
        variant="outlined"
        :to="{ name: 'product', params: { id: product.id } }"
        block
      >
        Ver detalles
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  product: {
    id: number
    name: string
    price: number
    image: string
  }
}>()
</script>