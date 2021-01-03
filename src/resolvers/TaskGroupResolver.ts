import {Arg, Authorized, Ctx, Mutation, Query, Resolver} from 'type-graphql'
import {getTaskGroup, storeTaskGroup, updateTaskGroup} from '../mappers/TaskGroupMapper'
import {TaskGroupSchema} from '../schemas/TaskSchema'
import {AuthorizedAppContext} from '../services/apollo'

@Resolver()
export class TaskGroupResolver {
  @Authorized()
  @Query(() => TaskGroupSchema)
  async taskGroup(
    @Arg('taskGroupId') taskGroupId: string,
    @Ctx() context: AuthorizedAppContext,
  ): Promise<TaskGroupSchema> {
    return await getTaskGroup({
      userId: context.idToken.sub,
      taskGroupId,
    })
  }

  @Authorized()
  @Mutation(() => TaskGroupSchema)
  async addTaskGroup(
    @Arg('taskGroupId') taskGroupId: string,
    @Arg('name') name: string,
    @Ctx() context: AuthorizedAppContext,
  ): Promise<TaskGroupSchema> {
    return await storeTaskGroup({
      userId: context.idToken.sub,
      taskGroupId,
      name,
    })
  }

  @Authorized()
  @Mutation(() => TaskGroupSchema)
  async updateTaskGroup(
    @Arg('taskGroupId') taskGroupId: string,
    @Arg('name') name: string,
    @Ctx() context: AuthorizedAppContext,
  ): Promise<TaskGroupSchema> {
    return await updateTaskGroup({
      userId: context.idToken.sub,
      taskGroupId,
      name,
    })
  }
}
