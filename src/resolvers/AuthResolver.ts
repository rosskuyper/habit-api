import {Arg, Authorized, Ctx, Mutation, Query, Resolver} from 'type-graphql'
import {setCookieConfig} from '../config/cookies'
import {providers} from '../config/identityProviders'
import {processLoginPayload} from '../mediators/auth'
import {CodeSwapInput, SignInOption} from '../schemas/AuthSchema'
import {MeSchema} from '../schemas/UserSchema'
import {AppContext, AuthorizedAppContext} from '../utils/apollo'

@Resolver()
class AuthResolver {
  @Query(() => [SignInOption])
  async getSignInOptions(): Promise<SignInOption[]> {
    return Object.values(providers)
  }

  @Authorized()
  @Query(() => MeSchema)
  async me(@Ctx() context: AuthorizedAppContext): Promise<MeSchema> {
    return {
      user: {
        sub: context.accessToken.sub,
        email: '',
        first: '',
        last: '',
        updatedAt: new Date(),
        createdAt: new Date(),
      },
    }
  }

  @Mutation(() => Boolean)
  async swapCodeForTokensCookie(
    @Ctx() context: AppContext,
    @Arg('payload') {code, clientId}: CodeSwapInput,
  ): Promise<boolean> {
    const decodedTokens = await processLoginPayload(code, clientId)

    context.res.cookie('access', decodedTokens.original.accessToken, setCookieConfig())

    return true
  }
}

export default AuthResolver
