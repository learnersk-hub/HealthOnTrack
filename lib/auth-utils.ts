import { createHash, randomBytes, pbkdf2Sync } from 'crypto'

export function hashPassword(password: string): string {
  const salt = randomBytes(32).toString('hex')
  const hash = pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  const [salt, hash] = hashedPassword.split(':')
  const verifyHash = pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return hash === verifyHash
}

export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36)
  const random = randomBytes(8).toString('hex')
  return `${prefix}${timestamp}_${random}`
}