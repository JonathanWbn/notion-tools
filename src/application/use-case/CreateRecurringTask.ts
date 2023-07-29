import { RecurringTask } from '../../domain/RecurringTask'
import { User } from '../../domain/User'
import { UserRepository } from '../repository/UserRepository'
import { v4 as uuid } from 'uuid'

interface CreateRecurringTaskRequest {
  userId: User['userId']
}

export class CreateRecurringTask {
  constructor(private readonly userRepository: UserRepository) {}

  public async invoke(request: CreateRecurringTaskRequest): Promise<RecurringTask> {
    const recurringTask: RecurringTask = {
      id: uuid(),
      settings: {},
      isActive: false,
      createdAt: new Date().toISOString(),
    }
    const user = await this.userRepository.getById(request.userId)

    await this.userRepository.update(request.userId, {
      ...user,
      recurringTasks: [...user.recurringTasks, recurringTask],
    })

    return recurringTask
  }
}
