export function getByPath(obj: any, path: string) {
  if (typeof path !== 'string') return undefined
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}
