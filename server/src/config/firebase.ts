import admin from 'firebase-admin';
import dotenv from 'dotenv';
// Using require for JSON to avoid type checking issues outside rootDir for now, or just import if allowed.
// Let's rely on standard require for the JSON to be safe with directory structure until verified.
const serviceAccount = require('../../service-account.json');

dotenv.config();

try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin Initialized Successfully");
} catch (error) {
    console.error("Firebase Admin Initialization Error:", error);
}

export default admin;
