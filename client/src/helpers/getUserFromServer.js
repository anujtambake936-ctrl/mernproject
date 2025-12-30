const getUserFromServer = async() =>{
    try {
        const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'
        const response = await fetch(`${serverUrl}/api/auth/user`,{
            credentials:'include'
        })

        // If not authenticated, return success: false
        if (!response.ok) {
            return {
                success: false,
                user: null
            }
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error("Error fetching user:", error)
        return {
            success: false,
            user: null
        }
    }
}

export default getUserFromServer