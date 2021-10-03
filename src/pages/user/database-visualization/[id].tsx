import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/router'
import React, { FunctionComponent } from 'react'
import { mutate } from 'swr'
import {
  deleteDatabaseVisualization,
  updateDatabaseVisualization,
  useDatabase,
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
import { LineChart, XAxis, Line, YAxis, Tooltip, BarChart, Bar, Legend } from 'recharts'
import { NumberPropertyValue, Page } from '@notionhq/client/build/src/api-types'
import { format } from 'date-fns'

const notionColors = ['#5893b3', '#e49759', '#5b9d92', '#ea7271']

const DatabaseVisualization: FunctionComponent = () => {
  const router = useRouter()
  const { id } = router.query
  const { user } = useUser()

  const databaseVisualization = user?.databaseVisualizations.find((config) => config.id === id)

  const { database } = useDatabase(databaseVisualization?.settings.databaseId || '')
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
        {databaseVisualization && (
          <DatabaseVisualizationForm
            initialValues={databaseVisualization.settings}
            onAutoSave={handleSubmit}
          />
        )}
        <div className="w-full border-b border-opacity-80 my-5" />
        {databaseVisualization.settings.databaseId && databaseVisualization.settings.xAxis && (
          <>
            {pages ? (
              <Chart width={896} height={400} data={data}>
                <XAxis dataKey="x" />
                <Tooltip />
                <Legend />
                {databaseVisualization.settings.yAxis?.map((v, i) => (
                  <React.Fragment key={i}>
                    <YAxis
                      yAxisId={v}
                      width={30}
                      type="number"
                      domain={['auto', 'auto']}
                      orientation={i % 2 === 0 ? 'left' : 'right'}
                    />
                    {databaseVisualization.settings.type === 'bar' ? (
                      <Bar
                        yAxisId={v}
                        key={v}
                        dataKey={v}
                        fill={notionColors[i]}
                        name={getPropertyName(v)}
                      />
                    ) : (
                      <Line
                        key={v}
                        yAxisId={v}
                        type="linear"
                        dataKey={v}
                        strokeWidth={2}
                        stroke={notionColors[i]}
                        dot={false}
                        connectNulls
                        name={getPropertyName(v)}
                      />
                    )}
                  </React.Fragment>
                ))}
              </Chart>
            ) : (
              <Spinner className="animate-spin mx-auto" />
            )}
            <div className="w-full border-b border-opacity-80 my-5" />
          </>
        )}
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
        const datePropertyValue = pageValues.find((prop) => prop.id === settings.xAxis) as
          | SupportedDatePropertyValue
          | undefined

        if (!datePropertyValue) {
          return { x: new Date() }
        }

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
      .map((el) => ({ ...el, x: `  ${format(el.x, 'PP')}  ` }))
  }

  function getPropertyName(propertyId: string) {
    return Object.keys(database?.properties || {}).find(
      (el) => database?.properties[el].id === propertyId
    )
  }
}

export const getServerSideProps = withPageAuthRequired()

export default DatabaseVisualization
