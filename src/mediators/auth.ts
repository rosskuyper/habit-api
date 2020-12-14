import {storeUser} from '../mappers/AuthMapper'
import UserModel from '../models/UserModel'
import {firebase} from '../services/firebase'

export const processLoginPayload = async (idToken: firebase.auth.DecodedIdToken): Promise<UserModel> => {
  const user = await storeUser({
    subId: idToken.sub,
    email: idToken.email || '',
    first: '',
    last: '',
  })

  return user
}
