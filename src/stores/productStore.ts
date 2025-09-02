import { defineStore } from 'pinia'
import { ref } from 'vue'

interface CartItem {
  product: Product
  quantity: number
}

interface Product {
  id: number
  name: string
  price: number
  image: string
}

export const useProductStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const cart = ref<CartItem[]>([])

  // Datos mock
  const fetchProducts = async () => {
    products.value = [
      { id: 1, name: 'Gominolas', price: 1.50, image: 'https://via.placeholder.com/150?text=Gominolas' },
      { id: 2, name: 'Chocolate', price: 2.00, image: 'https://via.placeholder.com/150?text=Chocolate' }
    ]
  }

  // Añadir al carrito (o incrementar cantidad)
  const addToCart = (product: Product) => {
    const existingItem = cart.value.find(item => item.product.id === product.id)
    if (existingItem) {
      existingItem.quantity++
    } else {
      cart.value.push({ product, quantity: 1 })
    }
  }

  // Eliminar TODAS las unidades de un producto
  const removeFromCart = (productId: number) => {
    cart.value = cart.value.filter(item => item.product.id !== productId)
  }

  // Modificar cantidad (sumar/restar)
  const updateQuantity = (productId: number, newQuantity: number) => {
    const item = cart.value.find(item => item.product.id === productId)
    if (item) {
      if (newQuantity < 1) {
        removeFromCart(productId)
      } else {
        item.quantity = newQuantity
      }
    }
  }

  // Vaciar carrito después de compra
  const clearCart = () => {
    cart.value = []
  }

  return { 
    products, 
    cart, 
    fetchProducts, 
    addToCart, 
    removeFromCart, 
    updateQuantity,
    clearCart
  }
})