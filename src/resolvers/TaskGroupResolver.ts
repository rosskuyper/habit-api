import {Arg, Authorized, Ctx, Mutation, Resolver} from 'type-graphql'
import {storeTask, storeTaskGroup, updateTaskGroup} from '../mappers/TaskGroupMapper'
import {TaskGroupSchema, TaskSchema} from '../schemas/TaskSchema'
import {AuthorizedAppContext} from '../services/apollo'

@Resolver()
class TaskGroupResolver {
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

  @Authorized()
  @Mutation(() => TaskSchema)
  async addTask(
    @Arg('taskGroupId') taskGroupId: string,
    @Arg('taskId') taskId: string,
    @Arg('text') text: string,
    @Ctx() context: AuthorizedAppContext,
  ): Promise<TaskSchema> {
    return await storeTask({
      taskGroup: {
        userId: context.idToken.sub,
        taskGroupId,
      },
      task: {
        taskId,
        text,
      },
    })
  }
}

export default TaskGroupResolver
