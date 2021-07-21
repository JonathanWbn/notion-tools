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

    if (!toolConfig) {
      throw new Error('No config found')
    }
    if (!toolConfig.isExecutable) {
      throw new Error('Incomplete config.')
    }
    if (!user.notionAccess) {
      throw new Error('No access to Notion.')
    }

    const notion = new Client({ auth: user.notionAccess.access_token })
    await notion.pages.create({
      parent: { database_id: toolConfig.settings.databaseId as string },
      properties: toolConfig.settings.properties!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    })

    await this.userRepository.updateToolConfig(
      user.auth0UserId,
      toolConfig.copyWith({ lastExecutedAt: new Date().toISOString() })
    )
  }
}
