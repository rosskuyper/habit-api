import {Arg, Authorized, Ctx, Mutation, Resolver} from 'type-graphql'
import {deleteTask, setTaskCompleted, storeTask} from '../mappers/TaskGroupMapper'
import {TaskGroupSchema, TaskSchema} from '../schemas/TaskSchema'
import {AuthorizedAppContext} from '../services/apollo'

@Resolver()
export class TaskResolver {
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

  @Authorized()
  @Mutation(() => TaskSchema)
  async setTaskCompleted(
    @Ctx() context: AuthorizedAppContext,
    @Arg('taskGroupId') taskGroupId: string,
    @Arg('taskId') taskId: string,
    @Arg('completedAt', {nullable: true}) completedAt?: Date,
  ): Promise<TaskSchema> {
    return await setTaskCompleted({
      taskGroup: {
        userId: context.idToken.sub,
        taskGroupId,
      },
      task: {
        taskId,
        completedAt,
      },
    })
  }

  @Authorized()
  @Mutation(() => TaskGroupSchema)
  async deleteTask(
    @Ctx() context: AuthorizedAppContext,
    @Arg('taskGroupId') taskGroupId: string,
    @Arg('taskId') taskId: string,
  ): Promise<TaskGroupSchema> {
    return await deleteTask({
      taskGroup: {
        userId: context.idToken.sub,
        taskGroupId,
      },
      task: {
        taskId,
      },
    })
  }
}
