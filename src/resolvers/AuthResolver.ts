import {Authorized, Ctx, Query, Resolver} from 'type-graphql'
import {MeSchema} from '../schemas/UserSchema'
import {AuthorizedAppContext} from '../services/apollo'

@Resolver()
class AuthResolver {
  @Authorized()
  @Query(() => MeSchema)
  async me(@Ctx() context: AuthorizedAppContext): Promise<MeSchema> {
    return {
      user: {
        sub: context.accessToken.sub,
        email: context.accessToken.email,
        name: context.accessToken.name,
        iat: context.accessToken.updatedAt,
        exp: context.accessToken.createdAt,
      },
    }
  }
}

export default AuthResolver
