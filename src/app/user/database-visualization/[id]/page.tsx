'use client'

import { useRouter } from 'next/navigation'
import React, { FunctionComponent } from 'react'
import { mutate } from 'swr'
import {
  deleteDatabaseVisualization,
  updateDatabaseVisualization,
  useDatabaseQuery,
  useDatabaseVisualization,
  useUser,
} from '../../../../infrastructure/api-client'
import { Button } from '../../../../infrastructure/components/button'
import { DatabaseVisualizationComponent } from '../../../../infrastructure/components/database-visualization'
import { DatabaseVisualizationForm } from '../../../../infrastructure/components/database-visualization-form'
import { IDatabaseVisualization } from '../../../../domain/DatabaseVisualization'

const DatabaseVisualizationPage: FunctionComponent<{ params: { id: string } }> = ({ params }) => {
  const router = useRouter()
  const { id } = params
  const { user } = useUser()

  const { key } = useDatabaseVisualization(id as string)

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

  return (
    <div className="px-10 flex flex-col items-center">
      <div className="max-w-4xl w-full flex flex-col">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Database visualization</h1>
          <a href={`https://notion-tools.io/embed/${key}`} target="_blank" rel="noreferrer">
            Embeddable Link
          </a>
        </div>

        <div className="w-full border-b border-opacity-80 my-5" />
        {databaseVisualization && (
          <DatabaseVisualizationForm
            initialValues={databaseVisualization.settings}
            onAutoSave={handleSubmit}
          />
        )}
        <div className="w-full border-b border-opacity-80 my-5" />
        {databaseVisualization.settings.databaseId &&
          databaseVisualization.settings.xAxis &&
          pages && (
            <>
              <DatabaseVisualizationComponent
                databaseVisualization={databaseVisualization}
                pages={pages}
                width={896}
                height={400}
              />
              <div className="w-full border-b border-opacity-80 my-5" />
            </>
          )}
        <Button color="red" onClick={handleDelete} className="self-start">
          Delete
        </Button>
      </div>
    </div>
  )
}

export default DatabaseVisualizationPage