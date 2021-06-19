import { ToolConfig, User } from '../../domain/User'
import { Authorization } from '../Authorization'
import { UserRepository } from '../repository/UserRepository'

interface CreateUserRequest {
  userId: User['id']
  configId: ToolConfig['id']
}

export class DisableToolConfig {
  constructor(
    private readonly authorization: Authorization,
    private readonly userRepository: UserRepository
  ) {}

  public async invoke(request: CreateUserRequest): Promise<User> {
    await this.authorization.assertIsAllowedToUpdateUser(request.userId)

    const user = await this.userRepository.disableToolConfig(request.userId, request.configId)

    return user
  }
}
