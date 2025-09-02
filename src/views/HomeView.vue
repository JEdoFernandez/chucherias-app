<template>
  <div>
    <h1 class="text-h3 mb-6">🍬 Tienda de Chucherías</h1>
    
    <v-row>
      <v-col
        v-for="product in store.products"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
      >
        <ProductCard :product="product" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import { useProductStore } from '@/stores/productStore'

const store = useProductStore()

onMounted(() => {
  if (store.products.length === 0) {
    store.fetchProducts()
  }
})
</script>