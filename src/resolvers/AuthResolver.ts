import {Authorized, Ctx, Query, Resolver} from 'type-graphql'
import {MeSchema} from '../schemas/UserSchema'
import {AuthorizedAppContext} from '../services/apollo'

@Resolver()
export class AuthResolver {
  @Authorized()
  @Query(() => MeSchema)
  async me(@Ctx() context: AuthorizedAppContext): Promise<MeSchema> {
    return {
      user: {
        sub: context.idToken.sub,
        email: context.idToken.email,
        name: context.idToken.name,
        iat: context.idToken.updatedAt,
        exp: context.idToken.createdAt,
      },
    }
  }
}
