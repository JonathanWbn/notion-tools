import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { FunctionComponent } from 'react'

const DatabaseVisualization: FunctionComponent = () => {
  return <h1>TODO</h1>
}

export const getServerSideProps = withPageAuthRequired()

export default DatabaseVisualization
