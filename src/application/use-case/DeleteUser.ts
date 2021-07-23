import { User } from '../../domain/User'
import { UserRepository } from '../repository/UserRepository'

interface CreateUserRequest {
  userId: User['userId']
}

export class DeleteUser {
  constructor(private readonly userRepository: UserRepository) {}

  public async invoke(request: CreateUserRequest): Promise<void> {
    await this.userRepository.delete(request.userId)
  }
}
