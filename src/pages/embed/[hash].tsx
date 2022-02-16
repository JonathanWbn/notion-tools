import { useRouter } from 'next/router'
import { FunctionComponent } from 'react'
import { useEmbeddedDatabaseVisualization } from '../../infrastructure/api-client'
import { DatabaseVisualizationComponent } from '../../infrastructure/components/database-visualization'

const EmbeddedGraph: FunctionComponent = () => {
  const router = useRouter()
  const { hash } = router.query

  const { databaseVisualization } = useEmbeddedDatabaseVisualization(hash as string)

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <style>{`header { display: none !important; }`}</style>
      <DatabaseVisualizationComponent
        databaseVisualization={databaseVisualization}
        width="100%"
        height="100%"
      />
    </div>
  )
}

export default EmbeddedGraph
