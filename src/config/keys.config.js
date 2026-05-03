import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const keysDirectory = path.resolve('./keys');

// 1. Ensure the directory exists
if (!fs.existsSync(keysDirectory)) {
    console.log("📂 Creating /keys directory...");
    fs.mkdirSync(keysDirectory, { recursive: true });
}

const privateKeyPath = path.join(keysDirectory, 'private.pem');
const publicKeyPath = path.join(keysDirectory, 'public.pem');

// 2. Generate keys if they are missing
if (!fs.existsSync(privateKeyPath) || !fs.existsSync(publicKeyPath)) {
    console.log("🔑 Generating new RSA Key Pair...");
    
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });

    fs.writeFileSync(privateKeyPath, privateKey);
    fs.writeFileSync(publicKeyPath, publicKey);
    console.log("✅ New keys generated and saved to /keys");
}

// 3. Load the keys into variables
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

export { privateKey, publicKey };