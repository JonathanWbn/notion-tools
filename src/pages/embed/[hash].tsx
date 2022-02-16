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
      <DatabaseVisualizationComponent databaseVisualization={databaseVisualization} />
    </div>
  )
}

export default EmbeddedGraph
