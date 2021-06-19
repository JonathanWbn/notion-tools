import { ToolConfig, User } from '../../domain/User'
import { Authorization } from '../authorization'
import { UserRepository } from '../repository/UserRepository'

interface CreateUserRequest {
  userId: User['id']
  config: ToolConfig['config']
}

export class AddToolConfig {
  constructor(
    private readonly authorization: Authorization,
    private readonly userRepository: UserRepository
  ) {}

  public async invoke(request: CreateUserRequest): Promise<User> {
    await this.authorization.assertIsAllowedToUpdateUser(request.userId)

    const user = await this.userRepository.addToolConfig(request.userId, request.config)

    return user
  }
}
