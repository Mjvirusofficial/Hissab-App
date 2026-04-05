import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, CreditCard, Wallet, Trash2, ShieldAlert, UserPlus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user'
    });
    const [formLoading, setFormLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const [statsRes, usersRes] = await Promise.all([
                axios.get(`${API_URL}/admin/stats`, config),
                axios.get(`${API_URL}/admin/users`, config)
            ]);

            setStats(statsRes.data.data);
            setUsers(usersRes.data.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch admin data or you are not authorized.');
            setLoading(false);
            if (err.response && err.response.status === 403) {
                navigate('/');
            }
        }
    };

    const handleDeleteUser = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete user ${name} and all their expenses?`)) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${API_URL}/admin/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(users.filter(u => u._id !== id));
                // Update stats locally
                setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
            } catch (err) {
                console.error(err);
                alert('Failed to delete user');
            }
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_URL}/admin/users`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUsers([res.data.data, ...users]);
            setStats(prev => ({ ...prev, totalUsers: prev.totalUsers + 1 }));
            setShowCreateForm(false);
            setFormData({ name: '', email: '', password: '', role: 'user' });
            alert('User created successfully!');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to create user');
        } finally {
            setFormLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Loading Admin Dashboard...</div>;
    if (error) return <div className="text-center text-red-500 mt-10"><ShieldAlert className="inline mr-2" />{error}</div>;

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <ShieldAlert className="mr-3 text-indigo-600" size={32} /> Admin Dashboard
                </h1>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all shadow-md"
                >
                    <UserPlus size={20} /> Create User
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Total Users</p>
                        <p className="text-2xl font-bold text-gray-800">{stats?.totalUsers || 0}</p>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Users size={24} /></div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Total Expenses Logged</p>
                        <p className="text-2xl font-bold text-gray-800">{stats?.totalExpenses || 0}</p>
                    </div>
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg"><CreditCard size={24} /></div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Without Amount Logs</p>
                        <p className="text-2xl font-bold text-gray-800">{stats?.totalWithoutAmount || 0}</p>
                    </div>
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Wallet size={24} /></div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Total Tracked Money</p>
                        <p className="text-2xl font-bold text-gray-800">₹{stats?.totalMoney || 0}</p>
                    </div>
                    <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg"><CreditCard size={24} /></div>
                </div>
            </div>

            {/* Create User Form Modal */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-800">Create New User</h2>
                            <button onClick={() => setShowCreateForm(false)} className="text-gray-500 hover:text-gray-800 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text" required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter full name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email" required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="user@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password" required minLength="6"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Min. 6 characters"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                disabled={formLoading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
                            >
                                {formLoading ? 'Creating...' : 'Create User'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Registered Users</h2>
                    <span className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full font-medium">{users.length} Users</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-50 text-xs text-gray-700 uppercase border-b">
                            <tr>
                                <th className="px-6 py-4 font-medium">Name</th>
                                <th className="px-6 py-4 font-medium">Email</th>
                                <th className="px-6 py-4 font-medium">Role</th>
                                <th className="px-6 py-4 font-medium">Tracked</th>
                                <th className="px-6 py-4 font-medium">Daily</th>
                                <th className="px-6 py-4 font-medium">Joined On</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id} className="border-b hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-indigo-600">
                                        {user.expenseCount || 0}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-lime-600">
                                        {user.withoutAmountCount || 0}
                                    </td>
                                    <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDeleteUser(user._id, user.name)}
                                            disabled={user.role === 'admin'}
                                            className={`p-2 rounded-lg transition-colors ${user.role === 'admin' ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:bg-red-50 hover:text-red-600'}`}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No users found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
