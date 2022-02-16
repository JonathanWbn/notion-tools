import crypto from 'crypto'

const algorithm = 'aes256'
const key = process.env.CRYPTO_SECRET as string

export const encrypt = (text: string): string => {
  console.log('key', key)
  const cipher = crypto.createCipher(algorithm, key)

  return cipher.update(text, 'utf8', 'hex') + cipher.final('hex')
}

export const decrypt = (encrypted: string): string => {
  const decipher = crypto.createDecipher(algorithm, key)

  return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8')
}
