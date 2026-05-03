import jwt from 'jsonwebtoken';
import { privateKey } from '../config/keys.config.js';

export const handleLogin = (req, res) => {
    const { username, password } = req.body;
    
    if (username === 'admin' && password === '123') {
        const token = jwt.sign({ sub: username }, privateKey, { algorithm: 'RS256' });
        return res.json({ token });
    }
    res.status(401).json({ error: 'Invalid credentials' });
};