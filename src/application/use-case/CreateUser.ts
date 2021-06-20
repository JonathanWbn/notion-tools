import { User } from '../../domain/User'
import { Authorization } from '../Authorization'
import { UserRepository } from '../repository/UserRepository'

interface CreateUserRequest {
  auth0UserId: User['auth0UserId']
}

export class CreateUser {
  constructor(
    private readonly authorization: Authorization,
    private readonly userRepository: UserRepository
  ) {}

  public async invoke(request: CreateUserRequest): Promise<User> {
    await this.authorization.assertIsAllowedToCreateUsers()

    const user = await this.userRepository.create(request.auth0UserId)

    return user
  }
}
