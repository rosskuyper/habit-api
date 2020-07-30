import {Arg, Authorized, Ctx, Mutation, Query, Resolver} from 'type-graphql'
import {AppContext, AuthorizedAppContext} from '../services/apollo'
import {setCookieConfig} from '../config/cookies'
import {providers} from '../config/identityProviders'
import {processLoginPayload} from '../mediators/auth'
import {CodeSwapInput, SignInOption, AuthTokenSet} from '../schemas/AuthSchema'
import {MeSchema} from '../schemas/UserSchema'
import {getUserBySubId} from '../mappers/AuthMapper'

@Resolver()
class AuthResolver {
  @Query(() => [SignInOption])
  async getSignInOptions(): Promise<SignInOption[]> {
    return Object.values(providers)
  }

  @Authorized()
  @Query(() => MeSchema)
  async me(@Ctx() context: AuthorizedAppContext): Promise<MeSchema> {
    const user = await getUserBySubId(context.accessToken.sub)

    return {
      user: {
        sub: user.id,
        email: user.email,
        first: user.first,
        last: user.last,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt,
      },
    }
  }

  @Mutation(() => AuthTokenSet)
  async swapCodeForTokens(
    @Ctx() context: AppContext,
    @Arg('payload') {code, clientId}: CodeSwapInput,
  ): Promise<AuthTokenSet> {
    const {tokenSet} = await processLoginPayload(code, clientId)

    return {
      accessToken: tokenSet.original.accessToken,
    }
  }

  @Mutation(() => Boolean)
  async swapCodeForTokensCookie(
    @Ctx() context: AppContext,
    @Arg('payload') {code, clientId}: CodeSwapInput,
  ): Promise<boolean> {
    const {tokenSet} = await processLoginPayload(code, clientId)

    context.res.cookie('access', tokenSet.original.accessToken, setCookieConfig())

    return true
  }
}

export default AuthResolver
