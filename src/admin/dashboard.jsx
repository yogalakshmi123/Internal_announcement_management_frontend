import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { LogOut, User, Megaphone, Menu, X, Plus, Edit2, Trash2, Calendar, UserPlus } from "lucide-react"
import axios from "axios"
import CreateAdminModal from "./createmodel"


function AdminDashboard() {
    const [user, setUser] = useState(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [announcements, setAnnouncements] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [currentAnnouncementId, setCurrentAnnouncementId] = useState(null)
    const [showAdminModal, setShowAdminModal] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        expiryDate: ''
    })
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')

        if (!token || !userData) {
            navigate('/login')
            return
        }

        const parsedUser = JSON.parse(userData)
        if (parsedUser.role !== 'admin') {
            navigate('/dashboard')
            return
        }

        setUser(parsedUser)
        fetchAnnouncements()
    }, [navigate])

    const fetchAnnouncements = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await axios.get('http://localhost:3000/api/announcements/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            setAnnouncements(response.data.announcements)
        } catch (error) {
            console.error('Fetch Error:', error)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/Admin')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem('token')
            
            if (editMode) {
                await axios.put(
                    `http://localhost:3000/api/announcements/${currentAnnouncementId}`,
                    formData,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                )
                alert('Announcement updated successfully!')
            } else {
                await axios.post(
                    'http://localhost:3000/api/announcements',
                    formData,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                )
                alert('Announcement created successfully!')
            }
            
            setShowModal(false)
            setFormData({ title: '', content: '', expiryDate: '' })
            setEditMode(false)
            setCurrentAnnouncementId(null)
            fetchAnnouncements()
            
        } catch (error) {
            console.error('Submit Error:', error)
            alert(error.response?.data?.message || 'An error occurred')
        }
    }

    const handleEdit = (announcement) => {
        setFormData({
            title: announcement.title,
            content: announcement.content,
            expiryDate: new Date(announcement.expiryDate).toISOString().slice(0, 16)
        })
        setCurrentAnnouncementId(announcement._id)
        setEditMode(true)
        setShowModal(true)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this announcement?')) return
        
        try {
            const token = localStorage.getItem('token')
            await axios.delete(`http://localhost:3000/api/announcements/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            alert('Announcement deleted successfully!')
            fetchAnnouncements()
        } catch (error) {
            console.error('Delete Error:', error)
            alert('Failed to delete announcement')
        }
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const isExpired = (date) => {
        return new Date(date) < new Date()
    }

    if (!user) return null

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-full flex flex-col">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">Admin Menu</h2>
                            <button 
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden text-gray-600 hover:text-gray-800"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <nav className="flex-1 p-4 space-y-2">
                        <button className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                            <Megaphone className="w-5 h-5" />
                            <span className="font-medium">Announcements</span>
                        </button>
                        
                        <button 
                            onClick={() => setShowAdminModal(true)}
                            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                        >
                            <UserPlus className="w-5 h-5" />
                            <span className="font-medium">Create Admin</span>
                        </button>
                    </nav>
                </div>
            </aside>

            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Navbar */}
                <nav className="bg-white shadow-md sticky top-0 z-30">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center space-x-3">
                                <button 
                                    onClick={() => setSidebarOpen(true)}
                                    className="lg:hidden text-gray-600 hover:text-gray-800"
                                >
                                    <Menu className="w-6 h-6" />
                                </button>
                                
                                <div className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
                                    <p className="text-xs text-gray-500">{user.username}</p>
                                </div>
                            </div>
                            <button 
                                onClick={handleLogout}
                                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Header with Add Button */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Announcements</h2>
                            <button 
                                onClick={() => {
                                    setShowModal(true)
                                    setEditMode(false)
                                    setFormData({ title: '', content: '', expiryDate: '' })
                                }}
                                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                            >
                                <Plus className="w-5 h-5" />
                                <span>New Announcement</span>
                            </button>
                        </div>

                        {/* Announcements List */}
                        <div className="space-y-4">
                            {announcements.length === 0 ? (
                                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                    <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No announcements yet</p>
                                </div>
                            ) : (
                                announcements.map((announcement) => (
                                    <div 
                                        key={announcement._id} 
                                        className={`bg-white rounded-lg shadow-md p-6 ${
                                            isExpired(announcement.expiryDate) ? 'opacity-60 border-2 border-red-200' : ''
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                                    {announcement.title}
                                                    {isExpired(announcement.expiryDate) && (
                                                        <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                                                            Expired
                                                        </span>
                                                    )}
                                                </h3>
                                                <p className="text-gray-600 whitespace-pre-wrap">{announcement.content}</p>
                                            </div>
                                            <div className="flex space-x-2 ml-4">
                                                <button 
                                                    onClick={() => handleEdit(announcement)}
                                                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(announcement._id)}
                                                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 border-t pt-4">
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>Posted: {formatDate(announcement.postDate)}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>Expires: {formatDate(announcement.expiryDate)}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <User className="w-4 h-4" />
                                                <span>By: {announcement.postedBy?.username}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Announcement Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">
                            {editMode ? 'Edit Announcement' : 'New Announcement'}
                        </h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title
                                </label>
                                <input 
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Content
                                </label>
                                <textarea 
                                    value={formData.content}
                                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none h-32"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Expiry Date & Time
                                </label>
                                <input 
                                    type="datetime-local"
                                    value={formData.expiryDate}
                                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    required
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button 
                                    type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
                                >
                                    {editMode ? 'Update' : 'Create'}
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false)
                                        setEditMode(false)
                                        setFormData({ title: '', content: '', expiryDate: '' })
                                    }}
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

          
            <CreateAdminModal
                isOpen={showAdminModal}
                onClose={() => setShowAdminModal(false)}
                onSuccess={() => {
                    
                    console.log('Admin created successfully')
                }}
            />
        </div>
    )
}

export default AdminDashboard