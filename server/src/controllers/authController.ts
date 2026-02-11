import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import admin from '../config/firebase';
import { AuthRequest } from '../middlewares/authMiddleware';

// Generate JWT
const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: '30d',
    });
};

/*
    @desc    Register new user
    @route   POST /api/auth/register
    @access  Public
*/
export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        // Check user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'user'
        });

        sendTokenResponse(user, 201, res);

    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/*
    @desc    Login user
    @route   POST /api/auth/login
    @access  Public
*/
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide an email and password' });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);

    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/*
    @desc    Get current logged in user
    @route   GET /api/auth/me
    @access  Private
*/
export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }
        const user = await User.findById(req.user._id);
        res.status(200).json({ success: true, data: user });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/*
    @desc    Update user details
    @route   PUT /api/auth/updatedetails
    @access  Private
*/
export const updateDetails = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        const fieldsToUpdate = {
            name: req.body.name,
            email: req.body.email,
            avatar: req.body.avatar,
            phone: req.body.phone,
            address: req.body.address
        };

        const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/*
    @desc    Update password
    @route   PUT /api/auth/updatepassword
    @access  Private
*/
export const updatePassword = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }
        const user = await User.findById(req.user._id).select('+password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check current password
        if (!(await user.matchPassword(req.body.currentPassword))) {
            return res.status(401).json({ success: false, message: 'Incorrect current password' });
        }

        user.password = req.body.newPassword;
        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/*
    @desc    Get all users (Admin)
    @route   GET /api/auth/users
    @access  Private/Admin
*/
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/*
    @desc    Create user (Admin)
    @route   POST /api/auth/users
    @access  Private/Admin
*/
export const createUser = async (req: Request, res: Response) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({ success: true, data: user });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/*
    @desc    Update user (Admin)
    @route   PUT /api/auth/users/:id
    @access  Private/Admin
*/
export const updateUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/*
    @desc    Delete user (Admin)
    @route   DELETE /api/auth/users/:id
    @access  Private/Admin
*/
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Prevent deleting Super Admin
        if (user.email === 'admin@example.com') {
            return res.status(403).json({ success: false, message: 'Cannot delete Super Admin' });
        }

        await user.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/*
    @desc    Firebase Login (Google / Phone)
    @route   POST /api/auth/firebase
    @access  Public
*/
export const firebaseAuth = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;

        // Verify Firebase Token
        if (!admin.apps.length) {
            return res.status(503).json({ success: false, error: 'Firebase Admin not configured on server' });
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        const { uid, email, name, picture, phone_number } = decodedToken;

        let user;

        if (email) {
            user = await User.findOne({ email });
        } else if (phone_number) {
            user = await User.findOne({ phone: phone_number });
        }

        if (user) {
            // User exists - Login
            sendTokenResponse(user, 200, res);
        } else {
            // User doesn't exist - Register
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

            // Construct payload
            const userData: any = {
                name: name || (phone_number ? 'Mobile User' : 'User'),
                password: randomPassword,
                role: 'user',
                avatar: picture || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
            };

            if (email) {
                userData.email = email;
            } else if (phone_number) {
                userData.phone = phone_number;
                // Generate a dummy email for schema validation if email is missing
                userData.email = `${phone_number.replace(/\+/g, '')}@mobile.desifood`;
            } else {
                userData.email = `${uid}@noemail.desifood`;
            }

            user = await User.create(userData);

            sendTokenResponse(user, 201, res);
        }

    } catch (error: any) {
        console.error('Firebase Auth Error:', error);
        res.status(401).json({ success: false, error: 'Invalid or expired token', details: error.message });
    }
};

// Alias for backward compatibility (route uses this name)
export const googleAuth = firebaseAuth;

// Helper to send token response
const sendTokenResponse = (user: IUser, statusCode: number, res: Response) => {
    const token = generateToken(user._id.toString());

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        httpOnly: true
    };

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
};
