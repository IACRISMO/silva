import { useState } from 'react'
import ImageZoom from './ImageZoom'

export default function ProductImageGallery({ images = [], productName }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Asegurar que siempre haya al menos una imagen
  const productImages = images && images.length > 0 
    ? images 
    : ['https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400&h=400&fit=crop']

  return (
    <div className="space-y-3">
      {/* Imagen Principal con Zoom */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <ImageZoom
          src={productImages[currentImageIndex]}
          alt={`${productName} - Imagen ${currentImageIndex + 1}`}
          className="w-full h-full"
        />
        
        {/* Indicador de imagen actual */}
        {productImages.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {productImages.length}
          </div>
        )}
      </div>

      {/* Miniaturas */}
      {productImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {productImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                currentImageIndex === index
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <img
                src={image}
                alt={`Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
