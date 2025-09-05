import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export interface Product {
  id: number
  name: string
  price: number
  image: string
}

interface CartItem {
  id: number
  productId: number
  quantity: number
  name: string
  price: number
  image: string
}

export const useProductStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const cart = ref<CartItem[]>([])

  // Obtener productos desde el backend
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`)
      products.value = response.data
    } catch (error) {
      console.error('Error fetching products:', error)
      // Fallback a datos mock si el backend falla
      products.value = [
        { id: 1, name: 'Gominolas', price: 1.50, image: 'https://via.placeholder.com/150?text=Gominolas' },
        { id: 2, name: 'Chocolate', price: 2.00, image: 'https://via.placeholder.com/150?text=Chocolate' }
      ]
    }
  }

  // Crear producto en el backend
  const createProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const response = await axios.post(`${API_URL}/products`, productData)
      products.value.push(response.data)
      return response.data
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  }

  // Eliminar producto del backend
  const deleteProduct = async (productId: number) => {
    try {
      await axios.delete(`${API_URL}/products/${productId}`)
      products.value = products.value.filter(p => p.id !== productId)
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }

  // Obtener carrito desde el backend
  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API_URL}/cart`)
      cart.value = response.data
    } catch (error) {
      console.error('Error fetching cart:', error)
    }
  }

  // Añadir al carrito en el backend
  const addToCart = async (product: Product) => {
    try {
      await axios.post(`${API_URL}/cart`, {
        productId: product.id,
        quantity: 1
      })
      await fetchCart() // Recargar carrito
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  // Eliminar del carrito en el backend
  const removeFromCart = async (cartItemId: number) => {
    try {
      await axios.delete(`${API_URL}/cart/${cartItemId}`)
      await fetchCart()
    } catch (error) {
      console.error('Error removing from cart:', error)
    }
  }

  // Actualizar cantidad en el backend
  const updateQuantity = async (cartItemId: number, newQuantity: number) => {
    try {
      await axios.put(`${API_URL}/cart/${cartItemId}`, {
        quantity: newQuantity
      })
      await fetchCart()
    } catch (error) {
      console.error('Error updating quantity:', error)
    }
  }

  // Vaciar carrito
  const clearCart = () => {
    cart.value = []
  }

  // Cargar datos iniciales
  fetchProducts()
  fetchCart()

  return { 
    products, 
    cart, 
    fetchProducts, 
    createProduct,
    deleteProduct,
    addToCart, 
    removeFromCart, 
    updateQuantity,
    clearCart,
    fetchCart
  }
})