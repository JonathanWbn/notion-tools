import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/router'
import { FunctionComponent } from 'react'
import { mutate } from 'swr'
import {
  deleteDatabaseVisualization,
  updateDatabaseVisualization,
  useDatabaseQuery,
  useUser,
} from '../../../infrastructure/api-client'
import { Spinner } from '../../../infrastructure/components/icons'
import { DatabaseVisualizationForm } from '../../../infrastructure/components/database-visualization-form'
import { Button } from '../../../infrastructure/components/button'
import { IDatabaseVisualization } from '../../../domain/DatabaseVisualization'
import { CartesianGrid, LineChart, XAxis, Line, YAxis, Tooltip } from 'recharts'
import { DatePropertyValue, NumberPropertyValue } from '@notionhq/client/build/src/api-types'
import { format } from 'date-fns'

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

  async function handleDelete(): Promise<void> {
    if (!databaseVisualization) return
    await deleteDatabaseVisualization(databaseVisualization.id)
    await mutate('/api/users/me')
    router.push('/user')
  }

  if (!databaseVisualization) {
    return null
  }

  const data = (pages || [])
    .map((page) => ({
      x: new Date(
        (
          Object.values(page.properties).find(
            (prop) => prop.id === databaseVisualization.settings.xAxis
          ) as DatePropertyValue
        )?.date.start
      ),
      y: (
        Object.values(page.properties).find(
          (prop) => prop.id === databaseVisualization.settings.yAxis
        ) as NumberPropertyValue | undefined
      )?.number,
    }))
    .sort((a, b) => +a.x - +b.x)
    .map((el) => ({
      x: format(el.x, 'PP'),
      y: el.y,
    }))

  const yValues = data.map((el) => el.y).filter((el): el is number => typeof el === 'number')

  return (
    <div className="px-10 flex flex-col items-center">
      <div className="max-w-4xl w-full flex flex-col">
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
        <div className="w-full border-b border-opacity-80 my-5" />
        {databaseVisualization && (
          <LineChart width={896} height={400} data={data}>
            <XAxis dataKey="x" />
            <YAxis
              type="number"
              domain={[Math.floor(Math.min(...yValues)), Math.ceil(Math.max(...yValues))]}
            />
            <Tooltip />
            <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" />
            <Line type="monotone" dataKey="y" stroke="#ff7300" connectNulls />
          </LineChart>
        )}
        <div className="w-full border-b border-opacity-80 my-5" />
        <Button color="red" onClick={handleDelete} className="self-start">
          Delete
        </Button>
      </div>
    </div>
  )
}

export const getServerSideProps = withPageAuthRequired()

export default DatabaseVisualization
