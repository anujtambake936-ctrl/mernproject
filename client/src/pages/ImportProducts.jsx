import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Download, CheckCircle, XCircle, Loader } from 'lucide-react'

const ImportProducts = () => {
  const user = useSelector((state) => state.auth.user)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleImport = async () => {
    if (!user) {
      toast.error('Please login to import products')
      navigate('/login')
      return
    }

    try {
      setLoading(true)
      setResult(null)
      const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'
      const response = await fetch(`${serverUrl}/api/products/import`, {
        method: 'POST',
        credentials: 'include'
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
        setResult(data)
        toast.success(data.message)
      }
    } catch (error) {
      toast.error('Network error. Please check if the server is running.')
      console.error('Import products error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) {
      toast.error('Please login to import products')
      navigate('/login')
      return
    }
    if (!user.isAdmin) {
      toast.error('Access denied. Admin privileges required.')
      navigate('/products')
      return
    }
  }, [user, navigate])

  if (!user || !user.isAdmin) {
    return (
      <div className='min-h-screen flex items-center justify-center px-4'>
        <div className='p-8 rounded-2xl shadow-xl text-center max-w-md mx-4'>
          <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg className='w-8 h-8 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
            </svg>
          </div>
          <h3 className='text-xl font-semibold text-gray-900 mb-2'>Access Denied</h3>
          <p className='text-gray-600 mb-4'>Admin privileges required to import products.</p>
          <button
            onClick={() => navigate('/products')}
            className='inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200'
          >
            Go to Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen pt-20 pb-10 px-4'>
      <div className='container mx-auto max-w-2xl'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold mb-2'>Import Products</h1>
          <p className='text-gray-600'>Import products from the dummyjson API into your database</p>
        </div>

        <div className='bg-white rounded-2xl shadow-lg p-8'>
          <div className='mb-6'>
            <h2 className='text-xl font-semibold mb-4'>What will happen?</h2>
            <ul className='space-y-2 text-gray-700'>
              <li className='flex items-start gap-2'>
                <CheckCircle className='w-5 h-5 text-green-500 mt-0.5 flex-shrink-0' />
                <span>Products will be fetched from dummyjson API</span>
              </li>
              <li className='flex items-start gap-2'>
                <CheckCircle className='w-5 h-5 text-green-500 mt-0.5 flex-shrink-0' />
                <span>New products will be added to your database</span>
              </li>
              <li className='flex items-start gap-2'>
                <CheckCircle className='w-5 h-5 text-green-500 mt-0.5 flex-shrink-0' />
                <span>Duplicate products (by title) will be skipped</span>
              </li>
              <li className='flex items-start gap-2'>
                <CheckCircle className='w-5 h-5 text-green-500 mt-0.5 flex-shrink-0' />
                <span>Your existing database products will remain untouched</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleImport}
            disabled={loading}
            className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2'
          >
            {loading ? (
              <>
                <Loader className='w-5 h-5 animate-spin' />
                Importing Products...
              </>
            ) : (
              <>
                <Download className='w-5 h-5' />
                Import Products from API
              </>
            )}
          </button>

          {result && (
            <div className='mt-6 p-4 bg-green-50 rounded-lg border border-green-200'>
              <div className='flex items-start gap-3'>
                <CheckCircle className='w-6 h-6 text-green-600 flex-shrink-0 mt-0.5' />
                <div className='flex-1'>
                  <h3 className='font-semibold text-green-800 mb-2'>{result.message}</h3>
                  <div className='space-y-1 text-sm text-green-700'>
                    <p>✅ {result.imported} products imported successfully</p>
                    {result.skipped > 0 && (
                      <p>⏭️ {result.skipped} products skipped (already exist)</p>
                    )}
                  </div>
                  {result.errors && result.errors.length > 0 && (
                    <div className='mt-3 p-2 bg-red-50 rounded border border-red-200'>
                      <p className='text-sm font-semibold text-red-800 mb-1'>Errors:</p>
                      <ul className='text-xs text-red-700 space-y-1'>
                        {result.errors.slice(0, 5).map((error, index) => (
                          <li key={index}>• {error.title}: {error.error}</li>
                        ))}
                        {result.errors.length > 5 && (
                          <li>... and {result.errors.length - 5} more errors</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className='mt-6 pt-6 border-t border-gray-200'>
            <button
              onClick={() => navigate('/products')}
              className='w-full px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200'
            >
              View Products
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImportProducts

