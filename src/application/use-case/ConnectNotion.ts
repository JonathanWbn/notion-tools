import { NotionAccess, User } from '../../domain/User'
import { UserRepository } from '../repository/UserRepository'

interface ConnectNotionRequest {
  auth0UserId: User['auth0UserId']
  notionAccess: NotionAccess
}

export class ConnectNotion {
  constructor(private readonly userRepository: UserRepository) {}

  public async invoke(request: ConnectNotionRequest): Promise<User> {
    return await this.userRepository.updateNotionAccess(request.auth0UserId, request.notionAccess)
  }
}
