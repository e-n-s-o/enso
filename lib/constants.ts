// Admin users who can access /admin routes
export const ADMIN_EMAILS = [
  'sarmanpreets.it.22@nitj.ac.in',
]

export function isAdminEmail(email: string | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}
