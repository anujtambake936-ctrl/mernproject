import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Plus, X } from 'lucide-react'

const AddProduct = () => {
  const user = useSelector((state) => state.auth.user)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    thumbnail: '',
    images: [],
    stock: '',
    rating: '',
    brand: ''
  })

  const [newImage, setNewImage] = useState('')

  useEffect(() => {
    if (!user) {
      toast.error('Please login to add products')
      navigate('/login')
      return
    }
    if (!user.isAdmin) {
      toast.error('Access denied. Admin privileges required.')
      navigate('/products')
      return
    }
    fetchCategories()
  }, [user, navigate])

  const fetchCategories = async () => {
    try {
      const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'
      const response = await fetch(`${serverUrl}/api/products/categories`, {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setCategories(data.categories)
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleAddImage = () => {
    if (newImage.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, newImage.trim()]
      })
      setNewImage('')
    }
  }

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.price || !formData.category || !formData.thumbnail) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'
      const response = await fetch(`${serverUrl}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          thumbnail: formData.thumbnail,
          images: formData.images,
          stock: formData.stock ? parseInt(formData.stock) : 0,
          rating: formData.rating ? parseFloat(formData.rating) : 0,
          brand: formData.brand || ''
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = "Something went wrong."
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.message || errorMessage
        } catch {
          errorMessage = `Server error: ${response.status} ${response.statusText}`
        }
        toast.error(errorMessage)
        return
      }

      const data = await response.json()
      if (data.success) {
        toast.success('Product added successfully!')
        setFormData({
          title: '',
          description: '',
          price: '',
          category: '',
          thumbnail: '',
          images: [],
          stock: '',
          rating: '',
          brand: ''
        })
        navigate('/products')
      }
    } catch (error) {
      toast.error('Network error. Please check if the server is running.')
      console.error('Add product error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className='min-h-screen pt-20 pb-10 px-4'>
      <div className='container mx-auto max-w-3xl'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold mb-2'>Add New Product</h1>
          <p className='text-gray-600'>Fill in the details to add a new product to the store</p>
        </div>

        <form onSubmit={handleSubmit} className='bg-white rounded-2xl shadow-lg p-8 space-y-6'>
          {/* Title */}
          <div>
            <label className='block text-sm font-medium mb-2'>Title *</label>
            <input
              type='text'
              name='title'
              value={formData.title}
              onChange={handleChange}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className='block text-sm font-medium mb-2'>Description *</label>
            <textarea
              name='description'
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Price */}
            <div>
              <label className='block text-sm font-medium mb-2'>Price (₹) *</label>
              <input
                type='number'
                name='price'
                value={formData.price}
                onChange={handleChange}
                step='0.01'
                min='0'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className='block text-sm font-medium mb-2'>Category *</label>
              <input
                type='text'
                name='category'
                value={formData.category}
                onChange={handleChange}
                list='categories'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                required
              />
              <datalist id='categories'>
                {categories.map((cat, index) => (
                  <option key={index} value={cat} />
                ))}
              </datalist>
            </div>

            {/* Stock */}
            <div>
              <label className='block text-sm font-medium mb-2'>Stock</label>
              <input
                type='number'
                name='stock'
                value={formData.stock}
                onChange={handleChange}
                min='0'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>

            {/* Rating */}
            <div>
              <label className='block text-sm font-medium mb-2'>Rating (0-5)</label>
              <input
                type='number'
                name='rating'
                value={formData.rating}
                onChange={handleChange}
                min='0'
                max='5'
                step='0.1'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
          </div>

          {/* Brand */}
          <div>
            <label className='block text-sm font-medium mb-2'>Brand</label>
            <input
              type='text'
              name='brand'
              value={formData.brand}
              onChange={handleChange}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label className='block text-sm font-medium mb-2'>Thumbnail Image URL *</label>
            <input
              type='url'
              name='thumbnail'
              value={formData.thumbnail}
              onChange={handleChange}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
            {formData.thumbnail && (
              <img src={formData.thumbnail} alt='Thumbnail preview' className='mt-2 w-32 h-32 object-contain border rounded' />
            )}
          </div>

          {/* Additional Images */}
          <div>
            <label className='block text-sm font-medium mb-2'>Additional Images</label>
            <div className='flex gap-2 mb-2'>
              <input
                type='url'
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                placeholder='Enter image URL'
                className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddImage()
                  }
                }}
              />
              <button
                type='button'
                onClick={handleAddImage}
                className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2'
              >
                <Plus size={20} />
                Add
              </button>
            </div>
            <div className='flex flex-wrap gap-2'>
              {formData.images.map((img, index) => (
                <div key={index} className='relative'>
                  <img src={img} alt={`Product ${index + 1}`} className='w-20 h-20 object-contain border rounded' />
                  <button
                    type='button'
                    onClick={() => handleRemoveImage(index)}
                    className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600'
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className='flex gap-4 pt-4'>
            <button
              type='submit'
              disabled={loading}
              className='flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'
            >
              {loading ? 'Adding Product...' : 'Add Product'}
            </button>
            <button
              type='button'
              onClick={() => navigate('/products')}
              className='px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200'
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProduct

