import {Arg, Ctx, Mutation, Query, Resolver} from 'type-graphql'
import {Context} from '../apollo'
import {CognitoJWTSet, SignInOption, CodeSwapInput} from '../schemas/AuthSchema'
import {providers} from '../utils/cognito/providers'
import {swapCodeForTokens} from '../utils/cognito/tokenSwap'
import {IS_LOCAL} from '../config'

@Resolver()
class AuthResolver {
  @Query(() => [SignInOption])
  async getSignInOptions(): Promise<SignInOption[]> {
    return providers
  }

  @Mutation(() => CognitoJWTSet)
  async swapCodeForTokens(@Arg('payload') {code, clientId}: CodeSwapInput): Promise<CognitoJWTSet> {
    const tokenPayload = await swapCodeForTokens(code, clientId)

    return {
      idToken: tokenPayload.idToken,
      accessToken: tokenPayload.accessToken,
    }
  }

  @Mutation(() => Boolean)
  async swapCodeForTokensCookie(
    @Ctx() context: Context,
    @Arg('payload') {code, clientId}: CodeSwapInput,
  ): Promise<boolean> {
    const tokenPayload = await swapCodeForTokens(code, clientId)

    context.res.cookie('id', tokenPayload.accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days (token expires earlier but can be refreshed)
      sameSite: 'strict',
      secure: !IS_LOCAL,
    })

    return true
  }
}

export default AuthResolver
