import {Arg, Authorized, Ctx, Mutation, Resolver} from 'type-graphql'
import {storeTaskGroup, updateTaskGroup} from '../mappers/TaskGroupMapper'
import {TaskGroupSchema} from '../schemas/TaskSchema'
import {AuthorizedAppContext} from '../services/apollo'

@Resolver()
export class TaskGroupResolver {
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
