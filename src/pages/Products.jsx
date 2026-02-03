import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import { getProducts, getImageUrl } from '../services/productsService'
import { products as staticProducts } from '../data/products'

export default function Products() {
  const [products, setProducts] = useState(staticProducts)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const { data, error } = await getProducts()
      if (!error && data && data.length > 0) {
        // Procesar productos y agregar URLs de imágenes
        const processedProducts = data.map(product => ({
          ...product,
          image: product.image_path ? getImageUrl(product.image_path) : product.image
        }))
        setProducts(processedProducts)
      } else {
        // Si hay error o no hay datos, usar productos estáticos
        setProducts(staticProducts)
      }
    } catch (error) {
      console.error('Error cargando productos:', error)
      // Usar productos estáticos como fallback
      setProducts(staticProducts)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))]

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
        Nuestros Cascos
      </h1>

      <div className="mb-8 space-y-4 md:flex md:items-center md:space-y-0 md:space-x-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar cascos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category === 'all' ? 'Todos' : category}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Cargando productos...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            No se encontraron productos que coincidan con tu búsqueda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

