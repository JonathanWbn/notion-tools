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
import {
  DatabaseVisualizationForm,
  SupportedDatePropertyValue,
} from '../../../infrastructure/components/database-visualization-form'
import { Button } from '../../../infrastructure/components/button'
import {
  DatabaseVisualizationSettings,
  IDatabaseVisualization,
} from '../../../domain/DatabaseVisualization'
import { CartesianGrid, LineChart, XAxis, Line, YAxis, Tooltip, BarChart, Bar } from 'recharts'
import { NumberPropertyValue, Page } from '@notionhq/client/build/src/api-types'
import { format } from 'date-fns'

const notionColors = ['#5893b3', '#e49759', '#5b9d92', '#ea7271']

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

  const data = pages ? getDataFromSettings(pages, databaseVisualization.settings) : []

  const Chart = databaseVisualization.settings.type === 'bar' ? BarChart : LineChart

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
          <Chart width={896} height={400} data={data}>
            <XAxis dataKey="x" />
            <YAxis type="number" domain={['auto', 'auto']} />
            <Tooltip />
            <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" />
            {databaseVisualization.settings.yAxis?.map((v, i) =>
              databaseVisualization.settings.type === 'bar' ? (
                <Bar key={v} type="monotone" dataKey={v} fill={notionColors[i]} />
              ) : (
                <Line key={v} type="monotone" dataKey={v} stroke={notionColors[i]} connectNulls />
              )
            )}
          </Chart>
        )}
        <div className="w-full border-b border-opacity-80 my-5" />
        <Button color="red" onClick={handleDelete} className="self-start">
          Delete
        </Button>
      </div>
    </div>
  )

  function getDataFromSettings(
    pages: Page[],
    settings: DatabaseVisualizationSettings
  ): Array<Record<string, string>> {
    return pages
      .map((page) => {
        const pageValues = Object.values(page.properties)
        const datePropertyValue = pageValues.find(
          (prop) => prop.id === settings.xAxis
        ) as SupportedDatePropertyValue

        const dateValue =
          datePropertyValue.type === 'created_time'
            ? datePropertyValue.created_time
            : datePropertyValue.type === 'last_edited_time'
            ? datePropertyValue.last_edited_time
            : datePropertyValue.date.start

        return {
          x: dateValue ? new Date(dateValue) : new Date(),
          ...(settings.yAxis || [])
            .map((v): { key: string; value: number | undefined } => {
              const value = pageValues.find((prop) => prop.id === v) as
                | NumberPropertyValue
                | undefined
              return { key: v, value: value?.number }
            })
            .reduce((acc, el) => ({ ...acc, [el.key]: el.value }), {}),
        }
      })
      .sort((a, b) => +a.x - +b.x)
      .filter((el) => {
        const [start, end] = settings.xAxisTimeFrame || []
        return (!start || +el.x > +new Date(start)) && (!end || +el.x < +new Date(end))
      })
      .map((el) => ({ ...el, x: format(el.x, 'PP') }))
  }
}

export const getServerSideProps = withPageAuthRequired()

export default DatabaseVisualization
