'use server'

import { getSession } from '@auth0/nextjs-auth0'
import { DynamoUserRepository } from '../../infrastructure/repository/DynamoUserRepository'
import { Database } from '@notionhq/client/build/src/api-types'

const userRepository = new DynamoUserRepository()

export async function getUser() {
  const session = await getSession()

  if (!session) {
    return null
  }

  const user = await userRepository.getById(session.user.sub)
  return user
}

export const getDatabases = async (token: string) => {
  const res = await fetch('https://api.notion.com/v1/search', {
    method: 'POST',
    body: JSON.stringify({ filter: { value: 'database', property: 'object' } }),
    headers: {
      'Notion-Version': '2022-06-28',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  const data = await res.json()

  return data.results as Database[]
}
