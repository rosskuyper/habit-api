import {ObjectType, Field, InputType} from 'type-graphql'

/********************
 * Objects
 ********************/
@ObjectType()
export class SignInOption {
  @Field()
  clientId!: string

  @Field()
  authorizeUri!: string

  @Field()
  responseType!: string

  @Field()
  redirectUri!: string

  @Field()
  scope!: string

  @Field()
  identityProvider!: string
}

@ObjectType()
export class AuthTokenSet {
  @Field()
  accessToken!: string
}

/********************
 * Inputs
 ********************/

@InputType()
export class CodeSwapInput {
  @Field()
  clientId!: string

  @Field()
  code!: string
}
