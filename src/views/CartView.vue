<template>
  <div>
    <h1 class="text-h3 mb-6">🛒 Tu Carrito</h1>
    
    <v-alert
      v-if="store.cart.length === 0"
      type="info"
      text="Tu carrito está vacío"
      class="mb-4"
    ></v-alert>
    
    <v-table v-else>
      <thead>
        <tr>
          <th>Producto</th>
          <th>Precio Unitario</th>
          <th>Cantidad</th>
          <th>Subtotal</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in store.cart" :key="item.product.id">
          <td>{{ item.product.name }}</td>
          <td>{{ item.product.price }} €</td>
          <td>
            <v-btn
              icon="mdi-minus"
              size="small"
              @click="store.updateQuantity(item.product.id, item.quantity - 1)"
            ></v-btn>
            {{ item.quantity }}
            <v-btn
              icon="mdi-plus"
              size="small"
              @click="store.updateQuantity(item.product.id, item.quantity + 1)"
            ></v-btn>
          </td>
          <td>{{ (item.product.price * item.quantity).toFixed(2) }} €</td>
          <td>
            <v-btn
              icon="mdi-delete"
              color="error"
              @click="store.removeFromCart(item.product.id)"
            ></v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
    
    <v-card
      v-if="store.cart.length > 0"
      class="mt-6 pa-4"
    >
      <v-card-title class="text-h4">Total: {{ total }} €</v-card-title>
      <v-btn
        color="success"
        size="x-large"
        block
        @click="finishOrder"
      >
        Finalizar compra
      </v-btn>
    </v-card>

    <v-dialog v-model="showSuccessDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">¡Pedido registrado!</v-card-title>
        <v-card-text>Tu pedido ha sido procesado correctamente.</v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="showSuccessDialog = false">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useProductStore } from '@/stores/productStore'

const store = useProductStore()
const showSuccessDialog = ref(false)

const total = computed(() => {
  return store.cart.reduce(
    (sum, item) => sum + (item.product.price * item.quantity), 
    0
  ).toFixed(2)
})

const finishOrder = () => {
  showSuccessDialog.value = true
  store.clearCart()
}
</script>