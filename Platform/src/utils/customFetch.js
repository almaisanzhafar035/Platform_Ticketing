const BASE_URL = 'http://192.168.1.15:8081/api';

export async function customFetch(endpoint, options = {}) {
    const token = localStorage.getItem('token');

    const isFormData = options.body instanceof FormData;

    const defaultHeaders = {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);

        if (!response.ok) {
            let errorMessage = 'Terjadi kesalahan pada server';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch {
                errorMessage = `Error ${response.status}: ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (err) {
        if (err.message === 'Failed to fetch') {
            throw new Error('Server to connect, invalid URL or server is down');
        }
        throw err;
    }
}