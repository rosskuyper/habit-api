import {ObjectType, Field, InputType} from 'type-graphql'

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

@InputType()
export class CodeSwapInput {
  @Field()
  clientId!: string

  @Field()
  code!: string
}

@ObjectType()
export class CognitoJWTSet {
  @Field()
  idToken!: string

  @Field()
  accessToken!: string
}
