import api from './axios';

// Get All Coupons (Admin)
export const getAllCoupons = async (token: string) => {
    const response = await api.get('/coupons', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Create Coupon (Admin)
export const createCoupon = async (couponData: any, token: string) => {
    const response = await api.post('/coupons', couponData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Delete Coupon (Admin)
export const deleteCoupon = async (id: string, token: string) => {
    const response = await api.delete(`/coupons/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Toggle Coupon Status (Admin)
export const toggleCouponStatus = async (id: string, token: string) => {
    const response = await api.put(`/coupons/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Validate Coupon (User)
export const validateCoupon = async (code: string, orderTotal: number, token: string) => {
    const response = await api.post('/coupons/validate', { code, orderTotal }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};
