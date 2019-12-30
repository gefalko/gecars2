function capitalize(s?: string) {
  if (!s) {
    return undefined
  }
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default capitalize
