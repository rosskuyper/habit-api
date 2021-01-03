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
    const taskGroup = await storeTaskGroup({
      userId: context.idToken.sub,
      taskGroupId: id,
      name: name,
    })

    return {
      id: taskGroup.id,
      name: taskGroup.name,
      tasks: taskGroup.tasks,
      createdAt: taskGroup.createdAt,
      updatedAt: taskGroup.updatedAt,
    }
  }

  @Authorized()
  @Mutation(() => TaskGroupSchema)
  async updateTaskGroup(
    @Arg('id') id: string,
    @Arg('name') name: string,
    @Ctx() context: AuthorizedAppContext,
  ): Promise<TaskGroupSchema> {
    const taskGroup = await updateTaskGroup({
      userId: context.idToken.sub,
      taskGroupId: id,
      name: name,
    })

    return {
      id: taskGroup.id,
      name: taskGroup.name,
      tasks: taskGroup.tasks,
      createdAt: taskGroup.createdAt,
      updatedAt: taskGroup.updatedAt,
    }
  }
}

export default TaskGroupResolver
