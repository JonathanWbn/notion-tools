import { DatabaseVisualization } from '../../domain/DatabaseVisualization'
import { User } from '../../domain/User'
import { UserRepository } from '../repository/UserRepository'

interface UpdateDatabaseVisualizationRequest {
  userId: User['userId']
  databaseVisualizationId: DatabaseVisualization['id']
  databaseVisualization: Partial<DatabaseVisualization>
}

export class UpdateDatabaseVisualization {
  constructor(private readonly userRepository: UserRepository) {}

  public async invoke(request: UpdateDatabaseVisualizationRequest): Promise<User> {
    const user = await this.userRepository.getById(request.userId)

    return await this.userRepository.update(request.userId, {
      ...user,
      databaseVisualizations: user.databaseVisualizations.map((tc) =>
        tc.id === request.databaseVisualizationId ? tc.copyWith(request.databaseVisualization) : tc
      ),
    })
  }
}
