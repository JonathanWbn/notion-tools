import _ from 'lodash'
import {
  DatePropertyValue,
  InputPropertyValue,
  Property,
  SelectPropertyValue,
  TitlePropertyValue,
} from '@notionhq/client/build/src/api-types'
import { PropsWithChildren, ReactElement, useState } from 'react'
import { RecurringToolSettings, IToolConfig } from '../../../domain/User'
import { useDatabases } from '../api-client'

interface Props {
  initialValues: IToolConfig
  onSubmit: (values: IToolConfig) => Promise<void>
}

export function ToolConfigForm({ initialValues, onSubmit }: Props): ReactElement {
  const [values, setValues] = useState<IToolConfig>(initialValues)
  const { databases } = useDatabases()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    onSubmit(values)
  }

  const selectedDatabase = databases?.find((db) => db.id === values?.settings.databaseId)
  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
      <Checkbox value={values.isActive} onChange={(v) => setValues({ ...values, isActive: v })}>
        Enabled
      </Checkbox>
      <h2>Config</h2>
      <Select
        value={values.settings.databaseId}
        onChange={(v) => setValues({ ...values, settings: { ...values.settings, databaseId: v } })}
        options={(databases || []).map((database) => ({
          value: database.id,
          label: database.title[0].plain_text,
        }))}
      >
        Database
      </Select>
      <Select
        value={values.settings.frequency}
        onChange={(v) =>
          setValues({
            ...values,
            settings: { ...values.settings, frequency: v as RecurringToolSettings['frequency'] },
          })
        }
        options={[
          { value: 'daily', label: 'Daily' },
          { value: 'weekly', label: 'Weekly' },
        ]}
      >
        Frequency
      </Select>
      {values.settings.frequency === 'weekly' && (
        <Select
          value={values.settings.weekday}
          onChange={(v) =>
            setValues({ ...values, settings: { ...values.settings, weekday: v as Weekday } })
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
          value={values.settings.timeOfDay || ''}
          type="time"
          min="00:00"
          max="24:00"
          onChange={(e) =>
            setValues({
              ...values,
              settings: { ...values.settings, timeOfDay: e.target.value as TimeOfDay },
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
              value={values.settings.properties?.[property.id]}
              onChange={(propertyValue) => {
                if (propertyValue) {
                  setValues({
                    ...values,
                    settings: {
                      ...values.settings,
                      properties: {
                        ...values.settings.properties,
                        [property.id]: propertyValue,
                      },
                    },
                  })
                } else {
                  setValues({
                    ...values,
                    settings: {
                      ...values.settings,
                      properties: _.omit(values.settings.properties, property.id),
                    },
                  })
                }
              }}
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
  value: InputPropertyValue | undefined
  onChange: (val: InputPropertyValue | undefined) => void
}

function PropertyInput({ property, value, onChange, name }: PropertyInputProps): ReactElement {
  if (property.type === 'select') {
    value = value as SelectPropertyValue | undefined
    return (
      <label key={property.id}>
        {name}
        <select
          value={value ? value.select.id : ''}
          onChange={(e) => {
            const selectedOption = property.select.options.find((opt) => opt.id === e.target.value)
            if (!selectedOption) {
              onChange(undefined)
              return
            }
            const v: SelectPropertyValue = {
              id: property.id,
              type: 'select',
              select: selectedOption,
            }
            onChange(v)
          }}
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
    value = value as TitlePropertyValue | undefined
    const textValue = value
      ? value.title
          .filter((el) => el.type === 'text')
          .map((el) => el.plain_text)
          .join('')
      : ''
    return (
      <label key={property.id}>
        {name}
        <input
          value={textValue}
          onChange={(e) => {
            const v: TitlePropertyValue = {
              id: property.id,
              type: 'title',
              title: [
                {
                  type: 'text',
                  plain_text: e.target.value,
                  text: { content: e.target.value },
                  annotations: {
                    bold: false,
                    code: false,
                    color: 'default',
                    italic: false,
                    strikethrough: false,
                    underline: false,
                  },
                },
              ],
            }
            onChange(v)
          }}
        ></input>
      </label>
    )
  } else if (property.type === 'date') {
    value = value as DatePropertyValue | undefined
    return (
      <label key={property.id}>
        {name}
        <input
          type="date"
          value={value ? value.date.start : ''}
          onChange={(e) => {
            const v: DatePropertyValue = {
              id: property.id,
              type: 'date',
              date: {
                start: e.target.value,
              },
            }
            onChange(v)
          }}
        ></input>
      </label>
    )
  }

  return <></>
}
