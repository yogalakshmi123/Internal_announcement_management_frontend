import { useState } from "react"
import axios from "axios"

function CreateAdminModal({ isOpen, onClose, onSuccess }) {
    const [adminFormData, setAdminFormData] = useState({
        employeeId: '',
        username: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        
        try {
            const token = localStorage.getItem('token')
            await axios.post(
                'http://localhost:3000/api/admin/create',
                { ...adminFormData, role: 'admin' },
                { headers: { 'Authorization': `Bearer ${token}` } }
            )
            
            alert('Admin created successfully!')
            setAdminFormData({ employeeId: '', username: '', password: '' })
            onSuccess() 
            onClose()
            
        } catch (error) {
            console.error('Create Admin Error:', error)
            alert(error.response?.data?.message || 'Failed to create admin')
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setAdminFormData({ employeeId: '', username: '', password: '' })
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Create New Admin</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Employee ID
                        </label>
                        <input 
                            type="text"
                            value={adminFormData.employeeId}
                            onChange={(e) => setAdminFormData({...adminFormData, employeeId: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                        </label>
                        <input 
                            type="text"
                            value={adminFormData.username}
                            onChange={(e) => setAdminFormData({...adminFormData, username: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input 
                            type="password"
                            value={adminFormData.password}
                            onChange={(e) => setAdminFormData({...adminFormData, password: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <button 
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating...' : 'Create Admin'}
                        </button>
                        <button 
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg transition disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateAdminModal