import {ObjectType, Field, ID} from 'type-graphql'

@ObjectType()
export class TaskSchema {
  @Field(() => ID)
  id!: string

  @Field()
  text!: string

  @Field()
  checkedAt?: Date

  @Field()
  createdAt!: Date
}

@ObjectType()
export class TaskGroupSchema {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string

  @Field(() => [TaskSchema])
  tasks!: TaskSchema[]

  @Field()
  createdAt!: Date

  @Field()
  updatedAt!: Date
}
