import { User } from '../../domain/User'
import { Authorization } from '../Authorization'
import { UserRepository } from '../repository/UserRepository'

interface CreateUserRequest {
  userId: User['userId']
}

export class CreateUser {
  constructor(
    private readonly authorization: Authorization,
    private readonly userRepository: UserRepository
  ) {}

  public async invoke(request: CreateUserRequest): Promise<User> {
    await this.authorization.assertIsAllowedToCreateUsers()

    return await this.userRepository.create(request.userId)
  }
}
