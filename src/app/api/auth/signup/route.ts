import { handleLogin } from '@auth0/nextjs-auth0'
import type { NextRequest } from 'next/server'

export const GET = (req: NextRequest, ctx: { params: {} }) =>
  handleLogin(req, ctx, {
    returnTo: '/user',
    authorizationParams: {
      screen_hint: 'signup',
    },
  })

export const dynamic = 'force-dynamic'
