import crypto from 'crypto';

const SECRET_KEY = '4c0b569e4c96df157eee1b65dd0e4d41';
const NULL_IV = Buffer.alloc(16, 0);

export interface GuacamoleConnection {
    protocol: string;
    parameters: Record<string, string>;
    id?: string;
}

export interface GuacamoleAuthData {
    username: string;
    expires: number;
    connections: Record<string, GuacamoleConnection>;
}

export function encryptGuacamoleData(data: GuacamoleAuthData): string {
    const jsonData = JSON.stringify(data);
    
    // Create HMAC signature
    const hmac = crypto.createHmac('sha256', Buffer.from(SECRET_KEY, 'hex'));
    const signature = hmac.update(jsonData).digest();
    
    // Combine signature and data
    const combined = Buffer.concat([signature, Buffer.from(jsonData)]);
    
    // Encrypt with AES-128-CBC
    const cipher = crypto.createCipheriv(
        'aes-128-cbc',
        Buffer.from(SECRET_KEY, 'hex'),
        NULL_IV
    );
    
    let encrypted = cipher.update(combined);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    // Base64 encode the result
    return encrypted.toString('base64');
}