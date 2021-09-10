import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/router'
import { FunctionComponent } from 'react'
import { mutate } from 'swr'
import {
  updateDatabaseVisualization,
  useDatabaseQuery,
  useUser,
} from '../../../infrastructure/api-client'
import { Spinner } from '../../../infrastructure/components/icons'
import { DatabaseVisualizationForm } from '../../../infrastructure/components/database-visualization-form'
import { IDatabaseVisualization } from '../../../domain/DatabaseVisualization'
import { CartesianGrid, LineChart, XAxis, Line, YAxis, Tooltip } from 'recharts'
import { DatePropertyValue, NumberPropertyValue } from '@notionhq/client/build/src/api-types'

const DatabaseVisualization: FunctionComponent = () => {
  const router = useRouter()
  const { id } = router.query
  const { user } = useUser()

  const databaseVisualization = user?.databaseVisualizations.find((config) => config.id === id)

  const { pages } = useDatabaseQuery(databaseVisualization?.settings.databaseId || '')

  async function handleSubmit(settings: IDatabaseVisualization['settings']): Promise<void> {
    if (!databaseVisualization) return
    await updateDatabaseVisualization(databaseVisualization.id, { settings })
    await mutate('/api/users/me')
  }

  if (!databaseVisualization) {
    return null
  }

  const data = (pages || [])
    .map((page) => ({
      x: (
        Object.values(page.properties).find(
          (prop) => prop.id === databaseVisualization.settings.xAxis
        ) as DatePropertyValue
      )?.date.start,
      y: (
        Object.values(page.properties).find(
          (prop) => prop.id === databaseVisualization.settings.yAxis
        ) as NumberPropertyValue | undefined
      )?.number,
    }))
    .sort((a, b) => +new Date(a.x) - +new Date(b.x))

  return (
    <div className="px-10 flex flex-col items-center">
      <div className="max-w-2xl w-full flex flex-col">
        <h1 className="text-4xl font-bold">Database visualization</h1>
        <div className="w-full border-b border-opacity-80 my-5" />
        {databaseVisualization ? (
          <DatabaseVisualizationForm
            initialValues={databaseVisualization.settings}
            onAutoSave={handleSubmit}
          />
        ) : (
          <Spinner className="animate-spin mx-auto" />
        )}
        {databaseVisualization && (
          <LineChart width={672} height={400} data={data}>
            <XAxis dataKey="x" />
            <YAxis type="number" tickCount={10} domain={[80, 90]} />
            <Tooltip />
            <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" />
            <Line type="monotone" dataKey="y" stroke="#ff7300" />
          </LineChart>
        )}
      </div>
    </div>
  )
}

export const getServerSideProps = withPageAuthRequired()

export default DatabaseVisualization
