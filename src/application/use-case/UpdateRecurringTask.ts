import { RecurringTask } from '../../domain/RecurringTask'
import { User } from '../../domain/User'
import { UserRepository } from '../repository/UserRepository'

interface UpdateRecurringTaskRequest {
  userId: User['userId']
  recurringTaskId: RecurringTask['id']
  recurringTask: Partial<RecurringTask>
}

export class UpdateRecurringTask {
  constructor(private readonly userRepository: UserRepository) {}

  public async invoke(request: UpdateRecurringTaskRequest): Promise<User> {
    const user = await this.userRepository.getById(request.userId)

    return await this.userRepository.update(request.userId, {
      ...user,
      recurringTasks: user.recurringTasks.map((tc) =>
        tc.id === request.recurringTaskId
          ? {
              ...tc,
              ...request.recurringTask,
              isActive:
                request.recurringTask.isActive !== undefined
                  ? request.recurringTask.isActive
                  : tc.isActive,
            }
          : tc
      ),
    })
  }
}
