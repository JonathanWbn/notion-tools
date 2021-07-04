import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/router'
import { ChangeEvent, FunctionComponent, useEffect, useState } from 'react'
import { mutate } from 'swr'
import { ToolConfig, RecurringFrequency, TimeOfDay, Weekday } from '../../../domain/User'
import {
  updateToolConfig,
  useDatabases,
  useTools,
  useUser,
} from '../../../infrastructure/client/api-client'

const User: FunctionComponent = () => {
  const router = useRouter()
  const { id } = router.query
  const { tools } = useTools()
  const { user } = useUser()
  const { databases } = useDatabases()
  const [formState, setFormState] = useState<ToolConfig>()

  useEffect(() => {
    if (user) {
      const toolConfig = user.toolConfigs.find((config) => config.id === id)
      if (toolConfig) setFormState(toolConfig)
    }
  }, [user])

  if (!tools || !user) return <h1>loading...</h1>

  const toolConfig = user.toolConfigs.find((config) => config.id === id)
  if (!toolConfig) {
    return <h1>No config found.</h1>
  }
  const tool = tools.find((tool) => tool.id === toolConfig.toolId)
  if (!tool) {
    return <h1>No tool found.</h1>
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!toolConfig || !formState) {
      throw 'Cannot disable tool'
    }
    await updateToolConfig(toolConfig.id, formState)
    mutate('/api/users/me')
  }

  const selectedDatabase = databases?.find((db) => db.id === formState?.config.databaseId)

  return (
    <>
      <h1>Tool: {tool.name}</h1>
      <p>ToolConfig: {JSON.stringify(toolConfig)}</p>
      <p>FormState: {JSON.stringify(formState)}</p>
      {formState && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <label>
            Enabled
            <input
              type="checkbox"
              checked={formState.isActive}
              onChange={(e) => setFormState({ ...formState, isActive: e.target.checked })}
            ></input>
          </label>
          <h2>Config</h2>
          <label>
            Database
            <select
              value={formState.config.databaseId}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  config: { ...formState.config, databaseId: e.target.value },
                })
              }
            >
              <option value="">---</option>
              {databases?.map((database) => (
                <option key={database.id} value={database.id}>
                  {database.title[0].plain_text}
                </option>
              ))}
            </select>
          </label>
          <label>
            Frequency
            <select
              value={formState.config.frequency}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  config: { ...formState.config, frequency: e.target.value as RecurringFrequency },
                })
              }
            >
              <option value="">---</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </label>
          {formState.config.frequency === 'weekly' && (
            <label>
              Day of week
              <select
                value={formState.config.weekday}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    config: { ...formState.config, weekday: e.target.value as Weekday },
                  })
                }
              >
                <option value="">---</option>
                <option value="mon">Monday</option>
                <option value="tues">Tuesday</option>
                <option value="wed">Wednesday</option>
                <option value="thu">Thursday</option>
                <option value="fri">Friday</option>
                <option value="sat">Saturday</option>
                <option value="sun">Sunday</option>
              </select>
            </label>
          )}
          <label>
            Time of taks creation (UTC)
            <input
              value={formState.config.timeOfDay || ''}
              type="time"
              min="00:00"
              max="24:00"
              onChange={(e) =>
                setFormState({
                  ...formState,
                  config: { ...formState.config, timeOfDay: e.target.value as TimeOfDay },
                })
              }
            ></input>
          </label>
          {selectedDatabase && (
            <>
              <h2>Create page with properties</h2>
              {Object.entries(selectedDatabase.properties).map(([name, property]) => {
                const handleChange = (
                  e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
                ) => {
                  setFormState({
                    ...formState,
                    config: {
                      ...formState.config,
                      properties: {
                        ...formState.config.properties,
                        [property.id]: e.target.value,
                      },
                    },
                  })
                }
                if (property.type === 'select') {
                  return (
                    <label key={property.id}>
                      {name}
                      <select
                        value={formState.config.properties?.[property.id]}
                        onChange={handleChange}
                      >
                        <option value="">---</option>
                        {property.select.options.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  )
                } else if (property.type === 'title') {
                  return (
                    <label key={property.id}>
                      {name}
                      <input
                        value={formState.config.properties?.[property.id]}
                        onChange={handleChange}
                      ></input>
                    </label>
                  )
                } else if (property.type === 'date') {
                  return (
                    <label key={property.id}>
                      {name}
                      <input
                        type="date"
                        value={formState.config.properties?.[property.id]}
                        onChange={handleChange}
                      ></input>
                    </label>
                  )
                }
                return null
              })}
            </>
          )}
          <button>Save</button>
        </form>
      )}
    </>
  )
}

export const getServerSideProps = withPageAuthRequired()

export default User
