import { fail, type Actions } from '@sveltejs/kit';
import { encryptGuacamoleData } from '$lib/utils/guacamole';

export const actions = {
    connect: async ({ request }) => {
        try {
            const guacData = {
                username: 'test',
                expires: Date.now() + 3600000, // 1 hour from now
                connections: {
                    'SSH Connection': {
                        protocol: 'ssh',
                        parameters: {
                            hostname: 'localhost',
                            port: '2222',
                            username: 'root',
                            password: 'password123',
                            'ignore-cert': 'true'
                        }
                    }
                }
            };

            // Encrypt the data
            const encryptedData = encryptGuacamoleData(guacData);

            // Get auth token from Guacamole
            const response = await fetch('http://localhost:8080/guacamole/api/tokens', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `data=${encodeURIComponent(encryptedData)}`
            });

            if (!response.ok) {
                return fail(400, { error: 'Failed to authenticate with Guacamole' });
            }

            const authData = await response.json();
            return { success: true, authToken: authData.authToken };

        } catch (error) {
            return fail(500, { error: 'Failed to connect' });
        }
    }
} satisfies Actions;