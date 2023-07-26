'use client'

import { User } from '../../domain/User'
import { Button } from './button'
import axios from 'axios'

export const DeleteAccountButton = () => {
  return (
    <Button
      color="red"
      onClick={async () => {
        const confirm = window.confirm(
          'Do you really want to delete your account? This action cannot be undone.'
        )
        if (confirm) {
          await axios.delete('/api/users/me')
          location.href = 'https://notion-tools.io/api/auth/logout'
        }
      }}
    >
      Delete account
    </Button>
  )
}
