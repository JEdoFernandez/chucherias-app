<template>
  <v-card hover elevation="2" class="h-100 d-flex flex-column">
    <v-img
      :src="product.image"
      height="200px"
      cover
    ></v-img>
    
    <v-card-title class="text-h5">{{ product.name }}</v-card-title>
    
    <v-card-text class="flex-grow-1">
      <p class="text-h6 text-primary">{{ product.price }} €</p>
    </v-card-text>

    <!-- Contenedor de botones en columna -->
    <v-card-actions class="mt-auto d-flex flex-column">
      <v-btn
        color="primary"
        variant="outlined"
        :to="{ name: 'product', params: { id: product.id } }"
        block
        class="mb-2"
      >
        Ver detalles
      </v-btn>
      
      <v-btn
        color="error"
        variant="outlined"
        block
        @click="deleteProduct"
      >
        Eliminar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>


<script setup lang="ts">
import { useProductStore } from '@/stores/productStore'

const props = defineProps<{
  product: {
    id: number
    name: string
    price: number
    image: string
  }
}>()

const store = useProductStore()

const deleteProduct = async () => {
  if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
    try {
      await store.deleteProduct(props.product.id)
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error al eliminar el producto')
    }
  }
}
</script>

<style scoped>
.v-card {
  transition: transform 0.2s;
}
.v-card:hover {
  transform: translateY(-5px);
}
</style>