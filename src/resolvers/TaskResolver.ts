import {Arg, Authorized, Ctx, Mutation, Resolver} from 'type-graphql'
import {storeTask} from '../mappers/TaskGroupMapper'
import {TaskSchema} from '../schemas/TaskSchema'
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
}
