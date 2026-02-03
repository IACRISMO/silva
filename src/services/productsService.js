import { supabase } from '../lib/supabase'

// Obtener todos los productos
export async function getProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching products:', error)
    return { data: null, error }
  }
}

// Obtener un producto por ID
export async function getProductById(id) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching product:', error)
    return { data: null, error }
  }
}

// Obtener URL pública de imagen desde Supabase Storage
export function getImageUrl(imagePath) {
  if (!imagePath) return null
  
  // Si ya es una URL completa, retornarla
  if (imagePath.startsWith('http')) {
    return imagePath
  }

  // Obtener URL pública desde Supabase Storage
  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(imagePath)

  return data.publicUrl
}

// Subir imagen a Supabase Storage
export async function uploadProductImage(file, productId) {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${productId}-${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    return { filePath, error: null }
  } catch (error) {
    console.error('Error uploading image:', error)
    return { filePath: null, error }
  }
}

// Crear un nuevo producto (solo admin)
export async function createProduct(productData) {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error creating product:', error)
    return { data: null, error }
  }
}

// Actualizar un producto (solo admin)
export async function updateProduct(id, productData) {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error updating product:', error)
    return { data: null, error }
  }
}

// Eliminar un producto (solo admin)
export async function deleteProduct(id) {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Error deleting product:', error)
    return { error }
  }
}


