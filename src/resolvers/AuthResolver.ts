import {Arg, Mutation, Query, Resolver, Ctx} from 'type-graphql'
import {CognitoJWTSet, SignInOption} from '../schemas/AuthSchema'
import {swapCodeForTokens} from '../utils/cognito/tokenSwap'
import {providers} from '../utils/cognito/providers'

@Resolver()
class AuthResolver {
  @Query(() => [SignInOption])
  async getSignInOptions(@Ctx() context: any): Promise<SignInOption[]> {
    console.log('context', Object.keys(context))
    console.log('providers', providers)

    return providers
  }

  @Mutation(() => CognitoJWTSet)
  async swapCodeForTokens(@Arg('code') code: string, @Arg('clientId') clientId: string): Promise<CognitoJWTSet> {
    const tokenPayload = await swapCodeForTokens(code, clientId)

    return {
      idToken: tokenPayload.idToken,
      accessToken: tokenPayload.accessToken,
    }
  }
}

export default AuthResolver
