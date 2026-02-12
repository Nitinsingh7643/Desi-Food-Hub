import api from './axios';

// Register User
export const registerUser = async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

// Login User
export const loginUser = async (userData: any) => {
    const response = await api.post('/auth/login', userData);
    return response.data;
};

// Get Current User
export const getMe = async (token: string) => {
    const response = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Update User Details
export const updateUserDetails = async (userData: any, token: string) => {
    const response = await api.put('/auth/updatedetails', userData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Update Password
export const updateUserPassword = async (passwordData: any, token: string) => {
    const response = await api.put('/auth/updatepassword', passwordData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Get Products (Menu)
export const getProducts = async () => {
    const response = await api.get('/products');
    return response.data;
};

// Create Product (Admin)
export const createProduct = async (productData: any, token: string) => {
    const response = await api.post('/products', productData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Update Product (Admin)
export const updateProduct = async (id: string, productData: any, token: string) => {
    const response = await api.put(`/products/${id}`, productData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Delete Product (Admin)
export const deleteProduct = async (id: string, token: string) => {
    const response = await api.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Google Login Exchange
export const googleLogin = async (firebaseToken: string) => {
    const response = await api.post('/auth/google', { token: firebaseToken });
    return response.data;
};

// AI Chat
export const chatWithAi = async (message: string, language: string = 'English') => {
    const response = await api.post('/ai/chat', { message, language });
    return response.data;
};

// Create Order
export const createOrder = async (orderData: any, token: string) => {
    const response = await api.post('/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Get My Orders
export const getMyOrders = async (token: string) => {
    const response = await api.get('/orders/myorders', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Create Razorpay Order
export const createPaymentOrder = async (amount: number, token: string) => {
    const response = await api.post('/payment/create-order', { amount }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Verify Payment
export const verifyPayment = async (data: any, token: string) => {
    const response = await api.post('/payment/verify', data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// --- Admin APIs ---

// Get All Orders
export const getAllOrders = async (token: string) => {
    const response = await api.get('/orders', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Update Order Status
export const updateOrderStatus = async (id: string, status: string, token: string) => {
    const response = await api.put(`/orders/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Get Admin Stats
export const getAdminStats = async (token: string) => {
    const response = await api.get('/orders/stats', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// --- Admin User Management ---

export const getAllUsers = async (token: string) => {
    const response = await api.get('/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const createUser = async (userData: any, token: string) => {
    const response = await api.post('/auth/users', userData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const updateUser = async (id: string, userData: any, token: string) => {
    const response = await api.put(`/auth/users/${id}`, userData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const deleteUser = async (id: string, token: string) => {
    const response = await api.delete(`/auth/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};
