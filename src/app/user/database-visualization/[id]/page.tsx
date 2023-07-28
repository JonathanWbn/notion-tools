import { redirect } from 'next/navigation'
import React, { Suspense } from 'react'
import { Button } from '../../../../components/button'
import { DatabaseVisualizationForm } from '../../../../components/database-visualization-form'
import { DeleteDatabaseVisualization } from '../../../../application/use-case/DeleteDatabaseVisualization'
import { DynamoUserRepository } from '../../../../infrastructure/repository/DynamoUserRepository'
import { getDatabases, getUser } from '../../actions'
import { encrypt } from '../../../../application/crypto'
import { DatabaseVisualizationComponent } from '../../../../components/database-visualization'
import { Spinner } from '../../../../components/icons'

const userRepository = new DynamoUserRepository()
const deleteDatabaseVisualizationAction = new DeleteDatabaseVisualization(userRepository)

const DatabaseVisualizationPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params
  const user = await getUser()

  if (!user || !user.notionAccess) {
    redirect('/')
  }

  const key = encrypt(JSON.stringify({ userId: user.userId, visualizationId: id }))
  const databaseVisualization = user.databaseVisualizations.find((config) => config.id === id)

  if (!databaseVisualization) {
    redirect('/user')
  }

  const databases = (await getDatabases(user.notionAccess.access_token)) || []

  async function deleteDatabaseVisualization() {
    'use server'
    if (!databaseVisualization || !user) return
    await deleteDatabaseVisualizationAction.invoke({
      userId: user.userId,
      databaseVisualizationId: databaseVisualization.id,
    })
    redirect('/user')
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
        <DatabaseVisualizationForm
          id={databaseVisualization.id}
          initialValues={databaseVisualization.settings}
          databases={databases}
        />
        <div className="w-full border-b border-opacity-80 my-5" />
        {databaseVisualization.settings.databaseId && databaseVisualization.settings.xAxis && (
          <>
            <Suspense
              fallback={
                <div className="flex justify-center">
                  <Spinner className="animate-spin" />
                </div>
              }
            >
              <DatabaseVisualizationComponent
                user={user}
                databaseVisualization={databaseVisualization}
                width={896}
                height={400}
              />
            </Suspense>
            <div className="w-full border-b border-opacity-80 my-5" />
          </>
        )}
        <form action={deleteDatabaseVisualization}>
          <Button color="red" className="self-start" type="submit">
            Delete
          </Button>
        </form>
      </div>
    </div>
  )
}

export default DatabaseVisualizationPage
