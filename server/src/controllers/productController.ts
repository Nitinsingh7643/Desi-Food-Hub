import { Request, Response } from 'express';
import Product from '../models/Product';

/*
    @desc    Get all products
    @route   GET /api/products
    @access  Public
*/
export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/*
    @desc    Get single product
    @route   GET /api/products/:id
    @access  Public
*/
export const getProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({ success: true, data: product });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/*
    @desc    Create new product
    @route   POST /api/products
    @access  Private (Admin/Restaurant)
*/
export const createProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, data: product });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
};

/*
    @desc    Update product
    @route   PUT /api/products/:id
    @access  Private (Admin)
*/
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({ success: true, data: product });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/*
    @desc    Delete product
    @route   DELETE /api/products/:id
    @access  Private (Admin)
*/
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};
