import {Arg, Mutation, Query, Resolver, Ctx} from 'type-graphql'
import {CognitoJWTSet, SignInOption} from '../schemas/AuthSchema'
import {swapCodeForTokens} from '../utils/cognito/tokenSwap'
import {providers} from '../utils/cognito/providers'
import {Context} from '../apollo'

@Resolver()
class AuthResolver {
  @Query(() => [SignInOption])
  async getSignInOptions(@Ctx() context: Context): Promise<SignInOption[]> {
    console.log('contextKeys', Object.keys(context))
    console.log('context', context)
    console.log('providers', providers)

    context.additionalResponseHeaders.set('x-yo', 'lo')

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
