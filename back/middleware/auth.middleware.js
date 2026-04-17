import jwt from "jsonwebtoken";
import UserModel from "../model/user.model.js";
import { sendErrorResponse, sendForbiddenResponse, sendUnauthorizedResponse, sendNotFoundResponse } from '../utils/Response.utils.js';
import { config } from 'dotenv';
config();

export const UserAuth = async (req, res, next) => {
    try {
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not configured');
            return sendErrorResponse(res, 500, 'Server configuration error');
        }

        const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies?.accessToken || req.query.token;

        if (!token) {
            return sendUnauthorizedResponse(res, "Access denied. No token provided.");
        }

        try {
            const decodedObj = jwt.verify(token, process.env.JWT_SECRET);
            const { id, tokenHash } = decodedObj;

            const user = await UserModel.findById(id);
            if (!user) {
                return sendNotFoundResponse(res, "User not found");
            }

            // Remote Logout Check: If the token has a hash, ensure it still exists in the active sessions
            if (tokenHash && user.sessions && user.sessions.length > 0) {
                const isSessionActive = user.sessions.some(s => s.tokenHash === tokenHash);
                if (!isSessionActive) {
                    return sendUnauthorizedResponse(res, "Your session has been terminated from another device. Please login again.");
                }
            }

            console.log('UserAuth - Setting req.user with tokenHash:', tokenHash);
            req.user = { ...user.toObject(), tokenHash };
            next();
        } catch (err) {
            console.error('Token verification error:', err);
            return sendUnauthorizedResponse(res, "Invalid token.");
        }
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

export const OptionalUserAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies?.accessToken || req.query.token;

        if (token) {
            try {
                const decodedObj = jwt.verify(token, process.env.JWT_SECRET);
                const { id, tokenHash } = decodedObj;
                const user = await UserModel.findById(id);
                if (user) {
                    // Check if session is revoked even for optional auth
                    const isSessionActive = !tokenHash || user.sessions.some(s => s.tokenHash === tokenHash);
                    if (isSessionActive) {
                        req.user = user;
                    }
                }
            } catch (err) {
                // Ignore token errors for optional auth
                console.log("Optional Auth Token Error:", err.message);
            }
        }
        next();
    } catch (error) {
        next();
    }
};

export const authorize = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return async (req, res, next) => {
        try {
            if (!req.user) {
                return sendUnauthorizedResponse(res, "Authentication required");
            }

            if (roles.length && !roles.includes(req.user.role)) {
                return sendForbiddenResponse(res, `Access denied. ${roles.join(' or ')} role required.`);
            }

            next();
        } catch (error) {
            return sendErrorResponse(res, 500, error.message);
        }
    };
};

export const adminAuth = authorize('admin');
export const sellerAuth = authorize('seller');
export const sellerAndAdminAuth = authorize(['seller', 'admin']);

export const isAdmin = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return sendForbiddenResponse(res, "Access denied. Admin privileges required.");
        }
        next();
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

export const isSeller = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== "seller") {
            return sendForbiddenResponse(res, "Access denied. Seller privileges required.");
        }
        next();
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

export const isUser = async (req, res, next) => {
    try {
        if (!req.user) {
            return sendUnauthorizedResponse(res, "Authentication required");
        }
        next();
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};