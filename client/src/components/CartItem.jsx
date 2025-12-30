import React from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { decrementQuantity, incrementQuantity, removeFromCart } from '../app/slices/cartSlice'
import { Trash } from 'lucide-react'


const CartItem = ({ item }) => {
    const dispatch = useDispatch()
    const handleRemoveFromCart = async () => {
        try {
            const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'
            const response = await fetch(`${serverUrl}/api/cart/remove/${item.id}`, {
                method: "DELETE",
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
                dispatch(removeFromCart(item.id))
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error("Network error. Please check if the server is running.")
            console.error("Remove from cart error:", error)
        }
    }
    const handleIncrement = async () => {
        try {
            const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'
            const response = await fetch(`${serverUrl}/api/cart/increment/${item.id}`, {
                method: "POST",
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
                toast.success(data.message)
                dispatch(incrementQuantity(item.id))
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error("Network error. Please check if the server is running.")
            console.error("Increment error:", error)
        }
    }
    const handleDecrement = async () => {
        try {
            const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'
            const response = await fetch(`${serverUrl}/api/cart/decrement/${item.id}`, {
                method: "POST",
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
                toast.success(data.message)
                dispatch(decrementQuantity(item.id))
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error("Network error. Please check if the server is running.")
            console.error("Decrement error:", error)
        }
    }
    console.log(item)

    return (


        <div className="flex items-center gap-3 lg:p-5 p-3 my-2 rounded-lg relative  border cursor-pointer">

            <img src={item.image} alt={item.title} width={100} />

            <div className="flex flex-col items-start gap-3">
                <button className='bg-red-500 text-white  px-2    py-2 rounded-lg absolute right-2 top-2' onClick={handleRemoveFromCart}>
                    <Trash size={16}/>
                </button>
                <h2 className="text-lg font-medium ">
                    {item.title}
                </h2>

                <div className='flex justify-between  items-center  gap-5 '>
                    <p className='text-lg font-semibold'>$ {item.price * item.quantity}</p>

                </div>
                <div className='flex items-center gap-3'>
                    <button className='text-2xl px-2  bg-red-500 text-white rounded-lg' onClick={handleDecrement}>-</button>

                    <span className='text-lg'>{item?.quantity}</span>


                    <button className='text-2xl px-2 bg-green-500 text-white rounded-lg' onClick={handleIncrement}>+</button>
                </div>

            </div>
        </div>

    )
}

export default CartItem
