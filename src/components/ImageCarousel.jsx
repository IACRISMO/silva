import { useState, useEffect } from 'react'

const images = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=1200&h=600&fit=crop&q=80',
    title: 'Cascos de Alta Calidad',
    subtitle: 'Protección y estilo para tu viaje'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&h=600&fit=crop&q=80',
    title: 'Seguridad Garantizada',
    subtitle: 'Certificados y homologados'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?w=1200&h=600&fit=crop&q=80',
    title: 'Diseños Modernos',
    subtitle: 'Combina seguridad con el mejor estilo'
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=1200&h=600&fit=crop&q=80',
    title: 'Para Todos los Estilos',
    subtitle: 'Desde urbano hasta deportivo'
  },
  {
    id: 7,
    url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&h=600&fit=crop&q=80',
    title: 'Envío Gratis',
    subtitle: 'Recibe tu casco en la puerta de tu casa'
  },
  {
    id: 8,
    url: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?w=1200&h=600&fit=crop&q=80',
    title: 'Protege tu Vida',
    subtitle: 'La seguridad es nuestra prioridad'
  }
]

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-gray-800">
      {images.map((image, index) => (
        <div
          key={image.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={image.url}
            alt={image.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/1200x600/1a1a1a/ffffff?text=' + encodeURIComponent(image.title)
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h2 className="text-3xl md:text-5xl font-bold mb-2">
                {image.title}
              </h2>
              <p className="text-lg md:text-xl">{image.subtitle}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Botones de navegación */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 transition-all z-20"
        aria-label="Imagen anterior"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 transition-all z-20"
        aria-label="Siguiente imagen"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-white w-8'
                : 'bg-white bg-opacity-50 w-2'
            }`}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

