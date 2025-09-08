<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h3">🍬 Tienda de Chucherías</h1>
      <ProductForm />
    </div>
    
    <v-row>
      <v-col
        v-for="product in store.products"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <ProductCard :product="product" />
      </v-col>
    </v-row>

    <v-alert
      v-if="store.products.length === 0"
      type="info"
      class="mt-6"
    >
      No hay productos disponibles. ¡Añade el primero!
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import ProductForm from '@/components/ProductForm.vue'
import { useProductStore } from '@/stores/productStore'

const store = useProductStore()

onMounted(() => {
  if (store.products.length === 0) {
    store.fetchProducts()
  }
})
</script>

<style scoped>
h1 {
  color: #FF6B6B;
}
</style>