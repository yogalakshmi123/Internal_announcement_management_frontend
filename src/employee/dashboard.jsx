import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { LogOut, User, Megaphone, Menu, X, Calendar, Clock } from "lucide-react"
import axios from "axios"

function Dashboard() {
    const [user, setUser] = useState(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [announcements, setAnnouncements] = useState([])
    const [activeView, setActiveView] = useState('dashboard')
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')

        if (!token || !userData) {
            navigate('/login')
            return
        }

        setUser(JSON.parse(userData))
    }, [navigate])

    useEffect(() => {
        if (user && activeView === 'announcements') {
            fetchAnnouncements()
        }
    }, [activeView, user])

    const fetchAnnouncements = async () => {
        try {
            const token = localStorage.getItem('token')
            console.log('Fetching announcements...')
            
            const response = await axios.get('http://localhost:3000/api/announcements', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            
            console.log('Announcements received:', response.data)
            setAnnouncements(response.data.announcements || [])
        } catch (error) {
            console.error('Fetch Error:', error)
            console.error('Error details:', error.response?.data)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = "/"
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

    const getTimeRemaining = (expiryDate) => {
        const now = new Date()
        const expiry = new Date(expiryDate)
        const diff = expiry - now

        if (diff <= 0) return 'Expired'

        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} remaining`
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} remaining`
        return 'Expiring soon'
    }

    if (!user) return null

    return (
            <>

        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-full flex flex-col">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">Menu</h2>
                            <button 
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden text-gray-600 hover:text-gray-800"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <nav className="flex-1 p-4 space-y-2">
                        <button 
                            onClick={() => setActiveView('dashboard')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-50 transition ${
                                activeView === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                            }`}
                        >
                            <User className="w-5 h-5" />
                            <span className="font-medium">Dashboard</span>
                        </button>

                        <button 
                            onClick={() => setActiveView('announcements')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-50 transition ${
                                activeView === 'announcements' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                            }`}
                        >
                            <Megaphone className="w-5 h-5" />
                            <span className="font-medium">Announcements</span>
                            {announcements.length > 0 && (
                                <span className="ml-auto bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {announcements.length}
                                </span>
                            )}
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

          
            <div className="flex-1 flex flex-col min-h-screen">
               
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
                                <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
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

              
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {activeView === 'dashboard' && (
                            <>
                                
                                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                        Welcome, {user.username}!
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Employee ID</p>
                                            <p className="text-xl font-bold text-blue-600">{user.employeeId}</p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Role</p>
                                            <p className="text-xl font-bold text-green-600 capitalize">{user.role}</p>
                                        </div>
                                    </div>
                                </div>

                               
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white rounded-lg shadow-md p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-600 text-sm">Total Tasks</p>
                                                <p className="text-3xl font-bold text-gray-800 mt-2">0</p>
                                            </div>
                                            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center">
                                                <User className="w-6 h-6 text-blue-600" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg shadow-md p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-600 text-sm">Pending</p>
                                                <p className="text-3xl font-bold text-gray-800 mt-2">0</p>
                                            </div>
                                            <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center">
                                                <User className="w-6 h-6 text-yellow-600" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg shadow-md p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-600 text-sm">Completed</p>
                                                <p className="text-3xl font-bold text-gray-800 mt-2">0</p>
                                            </div>
                                            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">
                                                <User className="w-6 h-6 text-green-600" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeView === 'announcements' && (
                            <>
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">Announcements</h2>
                                    <p className="text-gray-500 mt-1">Stay updated with latest company news</p>
                                </div>

                                <div className="space-y-4">
                                    {announcements.length === 0 ? (
                                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                            <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <p className="text-gray-500">No announcements available</p>
                                        </div>
                                    ) : (
                                        announcements.map((announcement) => (
                                            <div 
                                                key={announcement._id} 
                                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                                            >
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                                                            {announcement.title}
                                                        </h3>
                                                        <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                                                            {announcement.content}
                                                        </p>
                                                    </div>
                                                    <div className="ml-4 bg-blue-100 p-3 rounded-lg">
                                                        <Megaphone className="w-6 h-6 text-blue-600" />
                                                    </div>
                                                </div>
                                                
                                                <div className="flex flex-wrap gap-4 text-sm border-t pt-4">
                                                    <div className="flex items-center space-x-2 text-gray-600">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>Posted: {formatDate(announcement.postDate)}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-gray-600">
                                                        <Clock className="w-4 h-4" />
                                                        <span className={`font-medium ${
                                                            getTimeRemaining(announcement.expiryDate) === 'Expiring soon' 
                                                                ? 'text-orange-600' 
                                                                : 'text-gray-600'
                                                        }`}>
                                                            {getTimeRemaining(announcement.expiryDate)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-gray-600">
                                                        <User className="w-4 h-4" />
                                                        <span>By: {announcement.postedBy?.username || 'Admin'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
        </>
    )
}

export default Dashboard