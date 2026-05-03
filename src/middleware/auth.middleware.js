import jwt from 'jsonwebtoken';
import { publicKey } from '../config/keys.config.js';

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    } catch (err) {
        return null;
    }
};