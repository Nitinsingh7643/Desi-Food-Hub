import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Construct service account from environment variables
// This avoids needing the actual JSON file on the server
let serviceAccount: any = {};

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
        let jsonStr = process.env.FIREBASE_SERVICE_ACCOUNT;
        // Handle dotenv parsing quirks
        if (jsonStr.startsWith("'") && jsonStr.endsWith("'")) {
            jsonStr = jsonStr.slice(1, -1);
        }
        jsonStr = jsonStr.replace(/\\"/g, '"').replace(/\\n/g, '\\n');
        serviceAccount = JSON.parse(jsonStr);
    } catch (e) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT", e);
    }
} else {
    serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY
            ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
            : undefined,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };
}

try {
    if (!serviceAccount.projectId || !serviceAccount.privateKey || !serviceAccount.clientEmail) {
        console.warn('Firebase Admin SDK Environment Variables might be missing.');
        // Fallback or error handling if needed, but for now just warn
    }

    if (!admin.apps.length) { // Check if already initialized
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log("Firebase Admin Initialized Successfully");
    }
} catch (error) {
    console.error("Firebase Admin Initialization Error:", error);
}

export default admin;
