import { decrypt } from '../../../application/crypto'
import { DatabaseVisualizationComponent } from '../../../components/database-visualization'
import { DynamoUserRepository } from '../../../infrastructure/repository/DynamoUserRepository'

export default async function Embedded(props: { params: { hash: string } }) {
  const embeddedData = await getEmbeddedData(props.params.hash)

  if (!embeddedData) {
    return null
  }

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <style>{`header { display: none !important; }`}</style>
      <DatabaseVisualizationComponent
        user={embeddedData.user}
        databaseVisualization={{
          id: embeddedData.databaseVisualization.id,
          settings: embeddedData.databaseVisualization.settings,
        }}
        width="100%"
        height="100%"
      />
    </div>
  )
}

const userRepository = new DynamoUserRepository()

async function getEmbeddedData(key: string) {
  try {
    const { userId, visualizationId } = JSON.parse(decrypt(key))

    const user = await userRepository.getById(userId)

    if (!user.notionAccess) {
      return null
    }

    const databaseVisualization = user.databaseVisualizations.find(
      (viz) => viz.id === visualizationId
    )

    if (!databaseVisualization || !databaseVisualization.settings.databaseId) {
      return null
    }

    return {
      databaseVisualization,
      user,
    }
  } catch {
    return null
  }
}
