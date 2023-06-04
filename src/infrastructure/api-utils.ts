import { getSession } from '@auth0/nextjs-auth0'
import type { UserProfile as _UserProfile } from '@auth0/nextjs-auth0/client'
import { NextApiRequest, NextApiResponse } from 'next'

interface UserProfile extends _UserProfile {
  sub: string
}

export const getUserFromSession = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<UserProfile> => {
  const { user } = (await getSession(req, res)) || {}

  if (!user) {
    throw new Error('No user found in session.')
  }

  return user as UserProfile
}
