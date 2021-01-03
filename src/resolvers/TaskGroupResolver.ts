import {Arg, Authorized, Ctx, Mutation, Resolver} from 'type-graphql'
import {storeTaskGroup, updateTaskGroup} from '../mappers/TaskGroupMapper'
import {TaskGroupSchema} from '../schemas/TaskSchema'
import {AuthorizedAppContext} from '../services/apollo'

@Resolver()
class TaskGroupResolver {
  @Authorized()
  @Mutation(() => TaskGroupSchema)
  async addTaskGroup(
    @Arg('id') id: string,
    @Arg('name') name: string,
    @Ctx() context: AuthorizedAppContext,
  ): Promise<TaskGroupSchema> {
    return await storeTaskGroup({
      userId: context.idToken.sub,
      taskGroupId: id,
      name: name,
    })
  }

  @Authorized()
  @Mutation(() => TaskGroupSchema)
  async updateTaskGroup(
    @Arg('id') id: string,
    @Arg('name') name: string,
    @Ctx() context: AuthorizedAppContext,
  ): Promise<TaskGroupSchema> {
    return await updateTaskGroup({
      userId: context.idToken.sub,
      taskGroupId: id,
      name: name,
    })
  }
}

export default TaskGroupResolver
