import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { getProducts, createProduct, updateProduct, deleteProduct, uploadProductImage, getImageUrl } from '../services/productsService'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [imageFiles, setImageFiles] = useState([]) // Múltiples archivos
  const [imagePreviews, setImagePreviews] = useState([]) // Múltiples previews
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    images: [], // Array de URLs
    stock: 0
  })
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    const { data, error } = await getProducts()
    if (data) {
      setProducts(data)
    }
    setLoading(false)
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5) // Máximo 5 imágenes
    if (files.length > 0) {
      setImageFiles(files)
      
      // Crear previews para todas las imágenes
      const previews = []
      files.forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          previews.push(reader.result)
          if (previews.length === files.length) {
            setImagePreviews(previews)
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })
    setLoading(true)

    try {
      let imageUrls = [...(formData.images || [])] // Mantener imágenes existentes

      // Si hay imágenes nuevas, subirlas
      if (imageFiles.length > 0) {
        const productId = editingProduct?.id || `temp-${Date.now()}`
        const newImageUrls = []
        
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i]
          const { filePath, error: uploadError } = await uploadProductImage(file, `${productId}-${i}-${Date.now()}`)
          
          if (uploadError) {
            console.error('Error al subir imagen:', uploadError)
            continue
          }

          newImageUrls.push(getImageUrl(filePath))
        }

        if (newImageUrls.length === 0 && imageFiles.length > 0) {
          setMessage({ type: 'error', text: 'Error al subir las imágenes' })
          setLoading(false)
          return
        }
        
        // Reemplazar con las nuevas imágenes subidas
        imageUrls = newImageUrls
      }

      // Validar que haya al menos una imagen
      if (!imageUrls || imageUrls.length === 0) {
        setMessage({ type: 'error', text: 'Debes agregar al menos una imagen' })
        setLoading(false)
        return
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        images: imageUrls,
        image: imageUrls[0], // Primera imagen para compatibilidad
        stock: parseInt(formData.stock) || 0
      }

      console.log('Enviando producto:', productData)

      if (editingProduct) {
        // Actualizar producto existente
        console.log('Actualizando producto ID:', editingProduct.id)
        const { error } = await updateProduct(editingProduct.id, productData)
        if (error) {
          console.error('Error al actualizar:', error)
          setMessage({ type: 'error', text: `Error al actualizar producto: ${error.message || 'Error desconocido'}` })
          setLoading(false)
          return
        }
        setMessage({ type: 'success', text: 'Producto actualizado exitosamente' })
      } else {
        // Crear nuevo producto
        console.log('Creando nuevo producto')
        const { error } = await createProduct(productData)
        if (error) {
          console.error('Error al crear:', error)
          setMessage({ type: 'error', text: `Error al crear producto: ${error.message || 'Error desconocido'}` })
          setLoading(false)
          return
        }
        setMessage({ type: 'success', text: 'Producto creado exitosamente' })
      }

      // Resetear formulario y recargar productos
      resetForm()
      await loadProducts()
      setShowForm(false)
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => {
        setMessage({ type: '', text: '' })
      }, 3000)
    } catch (error) {
      console.error('Error en handleSubmit:', error)
      setMessage({ type: 'error', text: `Error al procesar la solicitud: ${error.message || 'Error desconocido'}` })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product) => {
    // Limpiar mensaje anterior
    setMessage({ type: '', text: '' })
    
    setEditingProduct(product)
    const productImages = product.images && product.images.length > 0 
      ? product.images 
      : (product.image ? [product.image] : [])
    
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      images: productImages,
      stock: product.stock || 0
    })
    setImagePreviews(productImages)
    setImageFiles([])
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return

    const { error } = await deleteProduct(id)
    if (error) {
      setMessage({ type: 'error', text: 'Error al eliminar producto' })
      return
    }

    setMessage({ type: 'success', text: 'Producto eliminado exitosamente' })
    loadProducts()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      images: [],
      stock: 0
    })
    setImageFiles([])
    setImagePreviews([])
    setEditingProduct(null)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Productos</h1>
            <p className="text-gray-600 mt-2">Administra el catálogo de productos</p>
          </div>
          <button
            onClick={() => {
              if (showForm) {
                // Si está cerrando el formulario
                resetForm()
                setShowForm(false)
              } else {
                // Si está abriendo el formulario
                resetForm()
                setMessage({ type: '', text: '' })
                setShowForm(true)
              }
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-lg"
          >
            {showForm ? '❌ Cancelar' : '➕ Nuevo Producto'}
          </button>
        </div>

        {message.text && (
          <div
            className={`p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        {showForm && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6">
              {editingProduct ? '✏️ Editar Producto' : '➕ Nuevo Producto'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Nombre del Producto *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Casco Integral Pro"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Categoría *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecciona una categoría</option>
                    <option value="Integral">Integral</option>
                    <option value="Modular">Modular</option>
                    <option value="Abierto">Abierto</option>
                    <option value="Deportivo">Deportivo</option>
                    <option value="Cross">Cross</option>
                    <option value="Urbano">Urbano</option>
                    <option value="Retro">Retro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descripción *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                  placeholder="Describe el producto en detalle..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Precio (CLP) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    step="0.01"
                    placeholder="85000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Stock *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  📸 Imágenes del Producto (hasta 5)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 Puedes seleccionar hasta 5 imágenes. La primera será la imagen principal.
                </p>
                
                {/* Previews de las imágenes */}
                {imagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            Principal
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </span>
                  ) : (
                    editingProduct ? '💾 Actualizar Producto' : '✅ Crear Producto'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetForm()
                    setMessage({ type: '', text: '' })
                    setShowForm(false)
                  }}
                  disabled={loading}
                  className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ❌ Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Lista de Productos ({products.length})</h2>
          {loading ? (
            <p className="text-gray-500">Cargando productos...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold">Imagen</th>
                    <th className="text-left py-4 px-4 font-semibold">Nombre</th>
                    <th className="text-left py-4 px-4 font-semibold">Categoría</th>
                    <th className="text-left py-4 px-4 font-semibold">Precio</th>
                    <th className="text-left py-4 px-4 font-semibold">Stock</th>
                    <th className="text-left py-4 px-4 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const mainImage = product.images && product.images.length > 0 
                      ? product.images[0] 
                      : product.image
                    const imageCount = product.images ? product.images.length : 1
                    
                    return (
                    <tr key={product.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="relative">
                          <img
                            src={mainImage}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg shadow-sm"
                          />
                          {imageCount > 1 && (
                            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                              {imageCount}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium">{product.name}</td>
                      <td className="py-4 px-4">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-blue-600">
                        ${product.price?.toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          product.stock < 5 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {product.stock || 0}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
