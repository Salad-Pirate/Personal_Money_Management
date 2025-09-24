import React, { useState, useContext } from 'react';
import { DollarSign, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { PmmContext } from '../../context/PmmContext';

const AuthPage = ({ onLogin }) => {
    const { setUser_id } = useContext(PmmContext)
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!isLogin && !formData.name) {
            newErrors.name = 'Name is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Login
        if (validateForm() && isLogin) {
            try {
                const res = await fetch('http://localhost:8080/auth/login', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "email": formData.email,
                        "password": formData.password
                    }),
                });

                const data = await res.json();

                if (res.ok) {
                    onLogin({
                        id: data.id,
                        name: formData.name
                    })
                    setUser_id(data.id)
                } else {
                    console.log(data);
                }
            } catch (error) {
                console.log(error);
            }
        }

        // Register
        if (validateForm() && !isLogin) {
            try {
                const res = await fetch('http://localhost:8080/auth/register', {
                    method: 'POST',
                    body: JSON.stringify({
                        "email": formData.email,
                        "password": formData.password,
                        "displayName": formData.name
                    }),
                });

                const data = await res.json();

                if (res.ok) {
                    onLogin({
                        id: data.id,
                        name: formData.name
                    })
                    setUser_id(data.id)

                } else {
                    console.log(data);
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                            <DollarSign className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">MoneyTracker</h1>
                        <p className="text-gray-600 mt-2">
                            {isLogin ? 'Welcome back!' : 'Create your account'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter your email"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
                        >
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            {isLogin ? "Don't have an account? " : 'Already have an account? '}
                            <button
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setErrors({});
                                    setFormData({ name: '', email: '', password: '' });
                                }}
                                className="text-emerald-600 hover:text-emerald-700 font-semibold"
                            >
                                {isLogin ? 'Sign up' : 'Sign in'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthPage