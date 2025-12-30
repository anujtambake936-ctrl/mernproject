import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import Loader from '../components/Loader'

const Success = ({getUser}) => {
  const [loading,setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const sessionId = searchParams.get('session_id')
 
  const clearCart = async() =>{
    try {
      const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'
      
      // Get user's orders to find the most recent pending order
      const ordersResponse = await fetch(`${serverUrl}/api/orders`, {
        credentials: 'include'
      })
      
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json()
        if (ordersData.success && ordersData.orders.length > 0) {
          // Find the most recent pending order
          const pendingOrder = ordersData.orders.find(order => order.status === 'pending')
          if (pendingOrder) {
            // Mark order as completed
            await fetch(`${serverUrl}/api/orders/${pendingOrder._id}/status`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              credentials: 'include',
              body: JSON.stringify({ status: 'completed' })
            })
          }
        }
      }
      
      // Clear cart
      const clearResponse = await fetch(`${serverUrl}/api/cart/clear`,{
        credentials:'include'
      })

      if (!clearResponse.ok) {
        console.error('Failed to clear cart')
        setLoading(false)
        return
      }

      const clearData = await clearResponse.json()
      if(clearData.success){
        getUser()
      }
    } catch (error) {
      console.error('Error clearing cart:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(()=>{
    clearCart()
  },[])
  
  if(loading){
    return <Loader/>
  }
  
  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='text-center max-w-md'>
        <div className='mb-6'>
          <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg className='w-12 h-12 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
            </svg>
          </div>
          <h2 className='text-3xl font-bold text-green-600 mb-2'>Order Successful!</h2>
          <p className='text-gray-600 mb-6'>Thank you for your purchase. Your order has been confirmed.</p>
        </div>
        <div className='space-y-3'>
          <Link 
            to="/orders" 
            className='block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl'
          >
            View Order History
          </Link>
          <Link 
            to="/products" 
            className='block w-full border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:border-blue-500 hover:text-blue-500 transition-all duration-200'
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Success
