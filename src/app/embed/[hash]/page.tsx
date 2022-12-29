import { DatabaseVisualizationComponent } from '../../../infrastructure/components/database-visualization'
import { getEmbeddedData } from './data'

export default async function Embedded(props: { params: { hash: string } }) {
  const embeddedData = await getEmbeddedData(props.params.hash)

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <style>{`header { display: none !important; }`}</style>
      {embeddedData ? (
        <DatabaseVisualizationComponent
          databaseVisualization={{
            id: embeddedData.databaseVisualization.id,
            settings: embeddedData.databaseVisualization.settings,
          }}
          pages={embeddedData.pages}
          width="100%"
          height="100%"
        />
      ) : (
        <div>---</div>
      )}
    </div>
  )
}
