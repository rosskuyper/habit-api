import * as admin from 'firebase-admin'
import {FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL} from '../config/env'

const credential = admin.credential.cert({
  projectId: FIREBASE_PROJECT_ID,
  privateKey: FIREBASE_PRIVATE_KEY,
  clientEmail: FIREBASE_CLIENT_EMAIL,
})

admin.initializeApp({
  credential,
})

export const verifyBearerHeader = async (header: string): Promise<admin.auth.DecodedIdToken> => {
  const parts = header.split(' ').map((item) => item.trim())

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new Error('Malformed authorization header')
  }

  return admin.auth().verifyIdToken(parts[1])
}

export {admin as firebase}
