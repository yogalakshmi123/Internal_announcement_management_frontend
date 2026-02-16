import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

import { User, Lock, Shield } from "lucide-react"

function AdminLogin(){
    const [employeeId, setEmployeeId] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
     const navigate = useNavigate()
   

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const response = await axios.post('http://localhost:3000/api/login', {
                employeeId,
                password
            })
            
          
            if (response.data.user.role !== 'admin') {
                alert('Access denied. Admin credentials required.')
                setLoading(false)
                return
            }

            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data.user))
            
            window.location.href = "Admin/Dashboard"
            
        } catch (error) {
            console.error("Error:", error)
            alert(error.response?.data?.message || "An error occurred")
        } finally {
            setLoading(false)
        }
    }

    return(
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8 text-purple-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">Admin Login</h2>
                    <p className="text-gray-500 mt-2">Access administrative dashboard</p>
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder="Admin Employee ID" 
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        />
                    </div>

                    <button 
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span>Loading...</span>
                        ) : (
                            <>
                                <Shield className="w-5 h-5" />
                                <span>Login as Admin</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="mt-6 text-center">
                    <button 
                        onClick={() => navigate('/')}
                        className="text-purple-600 hover:text-purple-700 font-semibold transition"
                    >
                        ← Back to User Login
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AdminLogin