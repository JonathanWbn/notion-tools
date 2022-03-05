import { RecurringTask } from '../../domain/RecurringTask'
import { User } from '../../domain/User'
import { UserRepository } from '../repository/UserRepository'

interface DeleteRecurringTaskRequest {
  userId: User['userId']
  recurringTaskId: RecurringTask['id']
}

export class DeleteRecurringTask {
  constructor(private readonly userRepository: UserRepository) {}

  public async invoke(request: DeleteRecurringTaskRequest): Promise<User> {
    const user = await this.userRepository.getById(request.userId)

    return await this.userRepository.update(request.userId, {
      ...user,
      recurringTasks: user.recurringTasks.filter((tc) => tc.id !== request.recurringTaskId),
    })
  }
}
