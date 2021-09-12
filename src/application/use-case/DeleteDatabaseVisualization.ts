import { DatabaseVisualization } from '../../domain/DatabaseVisualization'
import { User } from '../../domain/User'
import { UserRepository } from '../repository/UserRepository'

interface DeleteDatabaseVisualizationRequest {
  userId: User['userId']
  databaseVisualizationId: DatabaseVisualization['id']
}

export class DeleteDatabaseVisualization {
  constructor(private readonly userRepository: UserRepository) {}

  public async invoke(request: DeleteDatabaseVisualizationRequest): Promise<void> {
    const user = await this.userRepository.getById(request.userId)

    await this.userRepository.update(request.userId, {
      ...user,
      databaseVisualizations: user.databaseVisualizations.filter(
        (tc) => tc.id !== request.databaseVisualizationId
      ),
    })
  }
}
