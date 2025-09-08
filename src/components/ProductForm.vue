<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ props }">
      <v-btn color="primary" v-bind="props" class="mb-4">
        <v-icon start>mdi-plus</v-icon>
        Añadir Producto
      </v-btn>
    </template>

    <v-card>
      <v-card-title>
        <span class="text-h5">Nuevo Producto</span>
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="submitForm">
          <v-text-field
            v-model="form.name"
            label="Nombre del producto"
            required
            :error-messages="errors.name"
          ></v-text-field>

          <v-text-field
            v-model="form.price"
            label="Precio (€)"
            type="number"
            step="0.01"
            min="0"
            required
            :error-messages="errors.price"
          ></v-text-field>

          <v-text-field
            v-model="form.image"
            label="URL de la imagen"
            required
            :error-messages="errors.image"
          ></v-text-field>

          <v-btn 
            color="primary" 
            type="submit" 
            :loading="loading"
            block
          >
            Crear Producto
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useProductStore } from '@/stores/productStore'

const store = useProductStore()
const dialog = ref(false)
const loading = ref(false)

const form = reactive({
  name: '',
  price: 0,
  image: ''
})

const errors = reactive({
  name: '',
  price: '',
  image: ''
})

const validateForm = () => {
  let isValid = true
  errors.name = ''
  errors.price = ''
  errors.image = ''

  if (!form.name.trim()) {
    errors.name = 'El nombre es obligatorio'
    isValid = false
  }

  if (form.price <= 0) {
    errors.price = 'El precio debe ser mayor a 0'
    isValid = false
  }

  if (!form.image.trim()) {
    errors.image = 'La imagen es obligatoria'
    isValid = false
  }

  return isValid
}

const submitForm = async () => {
  if (!validateForm()) return

  loading.value = true
  try {
    await store.createProduct(form)
    dialog.value = false
    // Reset form
    form.name = ''
    form.price = 0
    form.image = ''
  } catch (error) {
    console.error('Error creating product:', error)
    alert('Error al crear el producto')
  } finally {
    loading.value = false
  }
}
</script>