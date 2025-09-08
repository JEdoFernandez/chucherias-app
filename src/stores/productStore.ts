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

  // Obtener productos
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`)
      products.value = response.data
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  // Crear producto
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

  // Eliminar producto
  const deleteProduct = async (productId: number) => {
    try {
      await axios.delete(`${API_URL}/products/${productId}`)
      products.value = products.value.filter(p => p.id !== productId)
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }

  // Obtener carrito
  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API_URL}/cart`)
      cart.value = response.data
    } catch (error) {
      console.error('Error fetching cart:', error)
    }
  }

  // Añadir al carrito
  const addToCart = async (product: Product) => {
    try {
      await axios.post(`${API_URL}/cart`, {
        productId: product.id,
        quantity: 1
      })
      await fetchCart()
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  // Eliminar del carrito
  const removeFromCart = async (cartItemId: number) => {
    try {
      await axios.delete(`${API_URL}/cart/${cartItemId}`)
      await fetchCart()
    } catch (error) {
      console.error('Error removing from cart:', error)
    }
  }

  // Actualizar cantidad
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

  // Crear pedido para backend
  const createOrder = async () => {
    try {
      const total = cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      await axios.post(`${API_URL}/orders`, {
        items: cart.value,
        total: total
      });
      
      // Vaciar carrito en el backend y frontend
      await fetchCart(); // Esto recargará el carrito vacío desde el backend
      return true;
    } catch (error) {
      console.error('Error creating order:', error);
      return false;
    }
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
    fetchCart,
    createOrder
  }
})