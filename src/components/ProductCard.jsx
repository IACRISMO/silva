import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import ProductImageGallery from './ProductImageGallery'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert('Por favor inicia sesión para agregar productos al carrito')
      return
    }
    addToCart(product)
    alert('Producto agregado al carrito')
  }

  // Usar images array o image single como fallback
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : (product.image ? [product.image] : [])

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className="p-3 pb-0">
        <ProductImageGallery 
          images={productImages} 
          productName={product.name}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">
            ${product.price.toLocaleString()}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  )
}


