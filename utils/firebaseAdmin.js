import admin from "firebase-admin";

if (!admin.apps.length) {
  const requiredVars = {
    FIREBASE_TYPE: process.env.FIREBASE_TYPE,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  };

  const missingVars = Object.entries(requiredVars).filter(([key, value]) => !value || value.trim() === '');
  if (missingVars.length > 0) {
    const missingList = missingVars.map(([key]) => key).join(', ');
    throw new Error(`Firebase initialization failed: Missing required env vars: ${missingList}. Ensure dotenv.config() runs early and .env is set correctly.`);
  }

  let serviceAccount;
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      console.log("Using FIREBASE_SERVICE_ACCOUNT JSON (separate vars ignored).");
    } catch (parseErr) {
      throw new Error(`Invalid FIREBASE_SERVICE_ACCOUNT JSON: ${parseErr.message}`);
    }
  } else {
    serviceAccount = {
      type: requiredVars.FIREBASE_TYPE,
      project_id: requiredVars.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || '',
      private_key: (requiredVars.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, "\n"),
      client_email: requiredVars.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID || '',
      auth_uri: process.env.FIREBASE_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
      token_uri: process.env.FIREBASE_TOKEN_URI || 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL || 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL || '',
      universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN || 'googleapis.com',
    };
  }

  console.log("Firebase config loaded:", {
    type: serviceAccount.type,
    project_id: serviceAccount.project_id,
    client_email: serviceAccount.client_email,
    private_key_preview: serviceAccount.private_key ? `${serviceAccount.private_key.substring(0, 50)}...` : 'MISSING',
  });

  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin initialized successfully!");
  } catch (initErr) {
    console.error("Firebase init error:", initErr);
    throw initErr;
  }
}

export default admin;