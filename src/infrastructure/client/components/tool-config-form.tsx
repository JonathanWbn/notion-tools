import { Property } from '@notionhq/client/build/src/api-types'
import { PropsWithChildren, ReactElement, useState } from 'react'
import { RecurringFrequency, TimeOfDay, ToolConfig, Weekday } from '../../../domain/User'
import { useDatabases } from '../api-client'

interface Props {
  initialValues: ToolConfig
  onSubmit: (values: ToolConfig) => Promise<void>
}

export function ToolConfigForm({ initialValues, onSubmit }: Props): ReactElement {
  const [values, setValues] = useState<ToolConfig>(initialValues)
  const { databases } = useDatabases()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    onSubmit(values)
  }

  const selectedDatabase = databases?.find((db) => db.id === values?.config.databaseId)
  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
      <Checkbox value={values.isActive} onChange={(v) => setValues({ ...values, isActive: v })}>
        Enabled
      </Checkbox>
      <h2>Config</h2>
      <Select
        value={values.config.databaseId}
        onChange={(v) => setValues({ ...values, config: { ...values.config, databaseId: v } })}
        options={(databases || []).map((database) => ({
          value: database.id,
          label: database.title[0].plain_text,
        }))}
      >
        Database
      </Select>
      <Select
        value={values.config.frequency}
        onChange={(v) =>
          setValues({ ...values, config: { ...values.config, frequency: v as RecurringFrequency } })
        }
        options={[
          { value: 'daily', label: 'Daily' },
          { value: 'weekly', label: 'Weekly' },
        ]}
      >
        Frequency
      </Select>
      {values.config.frequency === 'weekly' && (
        <Select
          value={values.config.weekday}
          onChange={(v) =>
            setValues({
              ...values,
              config: { ...values.config, weekday: v as Weekday },
            })
          }
          options={[
            { value: 'mon', label: 'Monday' },
            { value: 'tues', label: 'Tuesday' },
            { value: 'wed', label: 'Wednesday' },
            { value: 'thu', label: 'Thursday' },
            { value: 'fri', label: 'Friday' },
            { value: 'sat', label: 'Saturday' },
            { value: 'sun', label: 'Sunday' },
          ]}
        >
          Day of week
        </Select>
      )}
      <label>
        Time of taks creation (UTC)
        <input
          value={values.config.timeOfDay || ''}
          type="time"
          min="00:00"
          max="24:00"
          onChange={(e) =>
            setValues({
              ...values,
              config: { ...values.config, timeOfDay: e.target.value as TimeOfDay },
            })
          }
        ></input>
      </label>
      {selectedDatabase && (
        <>
          <h2>Create page with properties</h2>
          {Object.entries(selectedDatabase.properties).map(([name, property]) => (
            <PropertyInput
              key={property.id}
              name={name}
              property={property}
              value={values.config.properties?.[property.id]}
              onChange={(v) =>
                setValues({
                  ...values,
                  config: {
                    ...values.config,
                    properties: { ...values.config.properties, [property.id]: v },
                  },
                })
              }
            />
          ))}
        </>
      )}
      <button>Save</button>
    </form>
  )
}

interface CheckboxProps {
  value: boolean
  onChange: (val: boolean) => void
}

function Checkbox({ value, onChange, children }: PropsWithChildren<CheckboxProps>): ReactElement {
  return (
    <label>
      {children}
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)}></input>
    </label>
  )
}

interface SelectProps {
  value: string | undefined
  onChange: (val: string) => void
  options: { value: string; label: string }[]
}

function Select({
  value,
  onChange,
  options,
  children,
}: PropsWithChildren<SelectProps>): ReactElement {
  return (
    <label>
      {children}
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">---</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

interface PropertyInputProps {
  property: Property
  name: string
  value: string
  onChange: (val: string) => void
}

function PropertyInput({ property, value, onChange, name }: PropertyInputProps): ReactElement {
  if (property.type === 'select') {
    return (
      <label key={property.id}>
        {name}
        <select value={value} onChange={(e) => onChange(e.target.value)}>
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
        <input value={value} onChange={(e) => onChange(e.target.value)}></input>
      </label>
    )
  } else if (property.type === 'date') {
    return (
      <label key={property.id}>
        {name}
        <input type="date" value={value} onChange={(e) => onChange(e.target.value)}></input>
      </label>
    )
  }

  return <></>
}
