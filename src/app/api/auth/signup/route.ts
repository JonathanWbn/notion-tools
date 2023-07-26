import { handleLogin } from '@auth0/nextjs-auth0'
import type { NextRequest } from 'next/server'

export const GET = async (req: NextRequest, ctx: { params: {} }) => {
  const { method } = req

  try {
    await handleLogin(req, ctx, {
      returnTo: '/user',
      authorizationParams: {
        screen_hint: 'signup',
      },
    })
  } catch (err) {
    console.log('err', err)
    return new Response(undefined, { status: 500 })
  }
}
