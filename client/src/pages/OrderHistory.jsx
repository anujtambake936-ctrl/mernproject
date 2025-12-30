import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'

const OrderHistory = () => {
  const user = useSelector((state) => state.auth.user)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'
      const response = await fetch(`${serverUrl}/api/orders`, {
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
        setOrders(data.orders)
      }
    } catch (error) {
      toast.error("Network error. Please check if the server is running.")
      console.error("Fetch orders error:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!user) {
    return (
      <div className='min-h-screen flex items-center justify-center px-4'>
        <div className='p-8 rounded-2xl shadow-xl text-center max-w-md mx-4'>
          <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg className='w-8 h-8 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
            </svg>
          </div>
          <h3 className='text-xl font-semibold text-gray-900 mb-2'>Authentication Required</h3>
          <p className='text-gray-600 mb-4'>Please log in to view your order history.</p>
          <Link
            to="/login"
            className='inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200'
          >
            Login
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className='min-h-screen pt-20 pb-10 px-4'>
      <div className='container mx-auto max-w-6xl'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold mb-2'>Order History</h1>
          <p className='text-gray-600'>View all your past orders</p>
        </div>

        {orders.length === 0 ? (
          <div className='text-center py-16'>
            <div className='w-32 h-32 mx-auto mb-6 opacity-50'>
              <img
                src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-7359557-6024626.png?f=webp"
                alt="No orders"
                className='w-full h-full object-contain'
              />
            </div>
            <h3 className='text-2xl font-bold mb-2'>No Orders Yet</h3>
            <p className='text-gray-600 mb-6'>You haven't placed any orders yet.</p>
            <Link
              to="/products"
              className='inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl'
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className='space-y-6'>
            {orders.map((order) => (
              <div key={order._id} className='bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden'>
                <div className='p-6 border-b border-gray-200 bg-gray-50'>
                  <div className='flex flex-wrap justify-between items-start gap-4'>
                    <div>
                      <p className='text-sm text-gray-500'>Order ID</p>
                      <p className='font-mono text-sm font-semibold'>{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-500'>Order Date</p>
                      <p className='font-semibold'>{formatDate(order.orderDate)}</p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-500'>Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className='text-right'>
                      <p className='text-sm text-gray-500'>Total Amount</p>
                      <p className='text-2xl font-bold text-green-600'>${order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className='p-6'>
                  <h3 className='text-lg font-semibold mb-4'>Order Items ({order.items.length})</h3>
                  <div className='space-y-4'>
                    {order.items.map((item, index) => (
                      <div key={index} className='flex items-center gap-4 p-4 bg-gray-50 rounded-xl'>
                        <img
                          src={item.image}
                          alt={item.title}
                          className='w-20 h-20 object-contain rounded-lg bg-white p-2'
                        />
                        <div className='flex-1'>
                          <h4 className='font-semibold text-lg'>{item.title}</h4>
                          <p className='text-sm text-gray-600'>{item.category}</p>
                        </div>
                        <div className='text-right'>
                          <p className='text-sm text-gray-500'>Quantity: {item.quantity}</p>
                          <p className='font-semibold text-lg'>${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderHistory

