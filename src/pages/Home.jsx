import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ImageCarousel from '../components/ImageCarousel'
import { getProducts } from '../services/productsService'

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    const { data } = await getProducts()
    if (data) {
      setFeaturedProducts(data.slice(0, 3))
    }
    setLoading(false)
  }

  return (
    <div>
      <ImageCarousel />
      
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Bienvenido a JASICA
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Encuentra los mejores cascos de moto con la mejor calidad y seguridad.
            Protege tu cabeza con estilo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-semibold mb-2">Seguridad</h3>
            <p className="text-gray-600">
              Todos nuestros cascos están certificados y homologados
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-semibold mb-2">Envío Rápido</h3>
            <p className="text-gray-600">
              Envíos a todo el país con entrega rápida y segura
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-xl font-semibold mb-2">Pago Seguro</h3>
            <p className="text-gray-600">
              Múltiples métodos de pago disponibles
            </p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Productos Destacados
            </h2>
            <Link
              to="/productos"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Ver todos →
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Cargando productos...</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No hay productos disponibles</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative h-48 bg-gray-200">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {product.description.substring(0, 80)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">
                        S/ {product.price?.toLocaleString()}
                      </span>
                      <Link
                        to="/productos"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Ver más
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}


