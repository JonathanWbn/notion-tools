import { DatabaseVisualization } from '../../domain/DatabaseVisualization'
import { User } from '../../domain/User'
import { UserRepository } from '../repository/UserRepository'
import { v4 as uuid } from 'uuid'

interface CreateDatabaseVisualizationRequest {
  userId: User['userId']
}

export class CreateDatabaseVisualization {
  constructor(private readonly userRepository: UserRepository) {}

  public async invoke(request: CreateDatabaseVisualizationRequest): Promise<DatabaseVisualization> {
    const databaseVisualization: DatabaseVisualization = { id: uuid(), settings: { type: 'line' } }
    const user = await this.userRepository.getById(request.userId)

    await this.userRepository.update(request.userId, {
      ...user,
      databaseVisualizations: [...user.databaseVisualizations, databaseVisualization],
    })

    return databaseVisualization
  }
}
