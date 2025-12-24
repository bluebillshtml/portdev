// Username validation
export function isValidUsername(username: string): boolean {
  if (username.length < 3 || username.length > 30) return false
  return /^[a-z0-9_-]+$/.test(username)
}

// URL validation
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return url.startsWith('http://') || url.startsWith('https://')
  } catch {
    return false
  }
}
