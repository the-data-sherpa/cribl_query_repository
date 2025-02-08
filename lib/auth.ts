export function isValidEmail(email: string): boolean {
  return email.endsWith('@cribl.io')
}

export function getEmailError(email: string): string | null {
  if (!email) return 'Email is required'
  if (!email.includes('@')) return 'Invalid email format'
  if (!isValidEmail(email)) return 'Only @cribl.io email addresses are allowed'
  return null
} 