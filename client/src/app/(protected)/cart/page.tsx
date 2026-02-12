"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, Tag, MapPin, Loader2, Wallet, CreditCard, Banknote } from "lucide-react";
import { motion } from "framer-motion";
import { createOrder, createPaymentOrder, verifyPayment } from "@/lib/api/auth";
import { validateCoupon } from "@/lib/api/coupons";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    // State for Coupons
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
    const [couponError, setCouponError] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Online'>('COD');

    // Load Razorpay Script
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    // Load address from user profile
    React.useEffect(() => {
        if (user?.address) {
            setDeliveryAddress(user.address);
        }
    }, [user]);

    // Calculate Fees
    const deliveryFee = cartTotal > 499 ? 0 : 40;
    const platformFee = 5;
    const taxes = Math.round(cartTotal * 0.05);
    const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;

    // Ensure total doesn't go below zero
    const finalTotal = Math.max(0, cartTotal + deliveryFee + platformFee + taxes - discountAmount);


    const handleCheckout = async () => {
        if (!isAuthenticated) {
            router.push(`/login?redirect=/cart`);
            return;
        }

        if (deliveryAddress.length < 10) return;

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("No token found");

            let orderData: any = {
                orderItems: cart.map(item => ({
                    product: item.product._id,
                    name: item.product.name,
                    quantity: item.quantity,
                    price: item.product.price,
                    image: item.product.image
                })),
                shippingAddress: deliveryAddress,
                paymentMethod: paymentMethod,
                totalPrice: finalTotal
            };

            // Handle Online Payment (Razorpay)
            if (paymentMethod === 'Online') {
                const order = await createPaymentOrder(finalTotal, token);

                const options = {
                    key: "rzp_test_YourKeyHere", // Replace with your actual Test Key ID
                    amount: order.order.amount,
                    currency: "INR",
                    name: "Desi Food Hub",
                    description: "Order Payment",
                    order_id: order.order.id, // Generate Order ID first
                    handler: async function (response: any) {
                        // Verify Signature
                        const verification = await verifyPayment(response, token);
                        if (verification.success) {
                            // Place Order as Paid
                            orderData.isPaid = true;
                            orderData.paymentResult = {
                                id: response.razorpay_payment_id,
                                status: 'success',
                                email_address: user?.email
                            };

                            const finalResponse = await createOrder(orderData, token);
                            if (finalResponse.success) {
                                clearCart();
                                router.push(`/orders/success?id=${finalResponse.data._id}`);
                            }
                        } else {
                            alert("Payment verification failed");
                        }
                    },
                    prefill: {
                        name: user?.name,
                        email: user?.email,
                        contact: user?.phone
                    },
                    theme: {
                        color: "#E23744"
                    }
                };

                const isLoaded = await loadRazorpay();
                if (!isLoaded) {
                    alert('Failed to load payment gateway');
                    setIsSubmitting(false);
                    return;
                }

                const rzp1 = new (window as any).Razorpay(options);
                rzp1.open();
                setIsSubmitting(false); // Stop loading to let user interact with modal
                return; // Stop here, wait for callback
            }

            // Handle COD
            const response = await createOrder(orderData, token);
            if (response.success) {
                const orderId = response.data._id;
                clearCart();
                router.push(`/orders/success?id=${orderId}`);
            }
        } catch (error) {
            console.error("Checkout Failed", error);
            alert("Failed to place order. Please try again.");
        } finally {
            if (paymentMethod !== 'Online') {
                setIsSubmitting(false);
            }
        }
    };

    // Handle Promo Code
    const handleApplyCoupon = async () => {
        setCouponError("");
        if (!couponCode.trim()) return;

        if (!isAuthenticated) {
            setCouponError("Please login to apply coupons");
            return;
        }

        setIsValidating(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("No token");

            const res = await validateCoupon(couponCode, cartTotal, token);

            if (res.success) {
                setAppliedCoupon({
                    code: res.data.code,
                    discount: res.data.discount
                });
                setCouponCode("");
            }
        } catch (error: any) {
            console.error("Coupon validation failed", error);
            setCouponError(error.response?.data?.message || "Invalid coupon code");
            setAppliedCoupon(null);
        } finally {
            setIsValidating(false);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponError("");
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-black text-white pt-24 pb-12 flex flex-col items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-6"
                >
                    <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">🛒</span>
                    </div>
                    <h2 className="text-2xl font-bold">Your Cart is Empty</h2>
                    <p className="text-zinc-400 max-w-md mx-auto">
                        Looks like you haven't added anything to your cart yet.
                        Explore our menu to find something delicious!
                    </p>
                    <Link href="/">
                        <Button className="mt-4 bg-primary hover:bg-orange-600 text-white rounded-xl px-8">
                            Browse Menu
                        </Button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12">
            <div className="container mx-auto px-4 md:px-6">
                <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items List */}
                    <div className="flex-1 space-y-4">
                        {cart.map((item) => (
                            <motion.div
                                key={item.product._id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4 flex gap-4 items-center"
                            >
                                <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-800">
                                    <img
                                        src={item.product.image}
                                        alt={item.product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-semibold text-lg truncate pr-4">{item.product.name}</h3>
                                        <button
                                            onClick={() => removeFromCart(item.product._id)}
                                            className="text-zinc-500 hover:text-red-500 transition-colors p-1"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <p className="text-zinc-400 text-sm mb-3">₹{item.product.price}</p>

                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center bg-zinc-800 rounded-lg p-1">
                                            <button
                                                onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-zinc-700 rounded-md transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-zinc-700 rounded-md transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <div className="ml-auto font-bold text-lg">
                                            ₹{item.product.price * item.quantity}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        <div className="flex justify-between mt-4">
                            <Link href="/" className="text-primary hover:underline flex items-center gap-2 text-sm">
                                <ArrowLeft size={16} /> Continue Shopping
                            </Link>
                            <button onClick={clearCart} className="text-red-500 hover:text-red-400 text-sm font-medium">
                                Clear Cart
                            </button>
                        </div>
                    </div>

                    {/* Cart Items List - (No changes here, keeping structure) */}
                    {/* ... */}

                    {/* Right Column: Address & Summary */}
                    <div className="w-full lg:w-96 space-y-6">

                        {/* Delivery Address Section */}
                        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <MapPin className="text-primary" /> Delivery Details
                            </h2>

                            {!isAuthenticated && (
                                <div className="text-sm text-zinc-400 mb-4 bg-zinc-800/50 p-4 rounded-xl border border-zinc-700">
                                    <p className="mb-2">Please login to save your address.</p>
                                    <Link href="/login" className="text-primary hover:underline">Login Now</Link>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Address</label>
                                <textarea
                                    value={deliveryAddress}
                                    onChange={(e) => setDeliveryAddress(e.target.value)}
                                    placeholder="Enter your full delivery address..."
                                    className="w-full min-h-[100px] bg-zinc-800 border-zinc-700 rounded-xl p-3 text-sm focus:ring-primary/50 text-white resize-none"
                                />
                                {deliveryAddress.length < 5 && deliveryAddress.length > 0 && (
                                    <p className="text-xs text-red-500">Please enter a valid address.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Payment Method Selection */}
                    <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Wallet className="text-primary" /> Payment Method
                        </h2>

                        <div className="space-y-3">
                            <div
                                onClick={() => setPaymentMethod('COD')}
                                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-primary bg-primary/10' : 'border-zinc-700 hover:border-zinc-500'}`}
                            >
                                <Banknote className={paymentMethod === 'COD' ? "text-primary" : "text-zinc-500"} />
                                <div className="flex-1">
                                    <p className={`font-medium ${paymentMethod === 'COD' ? "text-primary" : "text-white"}`}>Cash / Pay on Delivery</p>
                                    <p className="text-xs text-zinc-500">Pay cash or UPI upon delivery</p>
                                </div>
                                {paymentMethod === 'COD' && <div className="w-4 h-4 rounded-full bg-primary" />}
                            </div>

                            <div
                                onClick={() => setPaymentMethod('Online')}
                                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'Online' ? 'border-primary bg-primary/10' : 'border-zinc-700 hover:border-zinc-500'}`}
                            >
                                <CreditCard className={paymentMethod === 'Online' ? "text-primary" : "text-zinc-500"} />
                                <div className="flex-1">
                                    <p className={`font-medium ${paymentMethod === 'Online' ? "text-primary" : "text-white"}`}>UPI / Cards / NetBanking</p>
                                    <p className="text-xs text-zinc-500">Secure online payment (Razorpay)</p>
                                </div>
                                {paymentMethod === 'Online' && <div className="w-4 h-4 rounded-full bg-primary" />}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 sticky top-24">
                        <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                        {/* Bill Details */}
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-zinc-400">
                                <span>Item Total</span>
                                <span>₹{cartTotal}</span>
                            </div>
                            <div className="flex justify-between text-zinc-400">
                                <span>Delivery Fee {cartTotal >= 500 && <span className="text-xs text-green-500 ml-1">(Free over ₹500)</span>}</span>
                                <span>{deliveryFee === 0 ? <span className="text-green-500">Free</span> : `₹${deliveryFee}`}</span>
                            </div>
                            <div className="flex justify-between text-zinc-400">
                                <span>Platform Fee</span>
                                <span>₹{platformFee}</span>
                            </div>
                            <div className="flex justify-between text-zinc-400">
                                <span>GST & Charges (5%)</span>
                                <span>₹{taxes}</span>
                            </div>

                            {appliedCoupon && (
                                <div className="flex justify-between text-green-500 font-medium bg-green-500/10 p-2 rounded-lg">
                                    <span className="flex items-center gap-1"><Tag size={14} /> Coupon ({appliedCoupon.code})</span>
                                    <span>- ₹{discountAmount}</span>
                                </div>
                            )}
                        </div>

                        {/* Coupon Input */}
                        <div className="mb-6">
                            {!appliedCoupon ? (
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Promo Code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        className="bg-zinc-800 border-zinc-700 focus:ring-primary/50"
                                    />
                                    <Button onClick={handleApplyCoupon} variant="outline" className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white">
                                        Apply
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex justify-between items-center bg-zinc-800 p-3 rounded-xl border border-dashed border-zinc-600">
                                    <span className="text-sm text-zinc-300">Code <b>{appliedCoupon.code}</b> applied</span>
                                    <button onClick={removeCoupon} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                                </div>
                            )}
                            {couponError && <p className="text-xs text-red-500 mt-2">{couponError}</p>}
                        </div>

                        <div className="border-t border-white/10 pt-4 mb-6">
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span>To Pay</span>
                                <span className="text-primary">₹{finalTotal}</span>
                            </div>
                        </div>

                        <Button
                            disabled={deliveryAddress.length < 10 || isSubmitting}
                            onClick={handleCheckout}
                            className="w-full h-12 bg-primary hover:bg-orange-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <><Loader2 className="animate-spin mr-2" /> Processing...</>
                            ) : (
                                <>{deliveryAddress.length < 10 ? "Enter Address" : "Checkout"} <ArrowRight size={20} className="ml-2" /></>
                            )}
                        </Button>

                        <p className="text-xs text-zinc-500 text-center mt-4">
                            Review your order carefully before payment.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
