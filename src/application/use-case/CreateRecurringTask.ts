import { v4 as uuid } from 'uuid'
import { User } from '../../domain/User'
import { UserRepository } from '../repository/UserRepository'
import { RecurringTask } from '../../domain/RecurringTask'

interface CreateRecurringTaskRequest {
  userId: User['userId']
}

export class CreateRecurringTask {
  constructor(private readonly userRepository: UserRepository) {}

  public async invoke(request: CreateRecurringTaskRequest): Promise<RecurringTask> {
    const toolConfig = new RecurringTask(uuid(), {}, false, new Date().toISOString())
    const user = await this.userRepository.getById(request.userId)

    await this.userRepository.update(request.userId, {
      ...user,
      toolConfigs: [...user.toolConfigs, toolConfig],
    })

    return toolConfig
  }
}
