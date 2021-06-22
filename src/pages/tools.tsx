import { FunctionComponent } from 'react'
import axios from 'axios'
import useSWR from 'swr'
import { Tool } from '../domain/Tool'

const fetcher = (url: string): Promise<Tool[]> => axios.get(url).then((res) => res.data)

const Tools: FunctionComponent = () => {
  const { data: tools, error } = useSWR('/api/tools', fetcher)

  if (error) return <h1>failed to load</h1>
  if (!tools) return <h1>loading...</h1>

  return (
    <ul>
      {tools.map((tool) => (
        <li key={tool.id}>
          {tool.name} - {tool.description}
        </li>
      ))}
    </ul>
  )
}

export default Tools
