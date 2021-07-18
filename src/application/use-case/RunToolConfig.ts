import { Client } from '@notionhq/client/build/src'
import { ToolConfig, User } from '../../domain/User'
import { UserRepository } from '../repository/UserRepository'

interface RunToolConfigRequest {
  auth0UserId: User['auth0UserId']
  toolConfigId: ToolConfig['id']
}

export class RunToolConfig {
  constructor(private readonly userRepository: UserRepository) {}

  public async invoke(request: RunToolConfigRequest): Promise<void> {
    const user = await this.userRepository.getById(request.auth0UserId)

    const toolConfig = user.toolConfigs.find((config) => config.id === request.toolConfigId)

    if (!user.notionAccess || !toolConfig || !toolConfig.config.properties) {
      throw new Error('Incomplete config.')
    }

    const notion = new Client({ auth: user.notionAccess.access_token })
    await notion.pages.create({
      parent: { database_id: toolConfig.config.databaseId as string },
      properties: toolConfig.config.properties,
    })

    await this.userRepository.updateToolConfig(user.auth0UserId, {
      ...toolConfig,
      executedAt: [...toolConfig.executedAt, new Date().toISOString()],
    })
  }
}
