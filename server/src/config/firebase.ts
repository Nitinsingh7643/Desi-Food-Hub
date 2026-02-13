import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Construct service account from environment variables
// This avoids needing the actual JSON file on the server
const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : undefined,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

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
