export function getI18nByCode(i18n, code) {
  const codeDot = `${code}.`
  const codeDotLength = codeDot.length
  const result = {}
  Object.keys(i18n)
    .filter(key => key.startsWith(codeDot))
    .forEach(key => {
      const newKey = key.substring(codeDotLength)
      result[newKey] = i18n[key]
    })
  return result
}

export function getI18nValuesByPrefix(i18n, prefix) {
  const results = []
  Object.keys(i18n)
    .filter(key => key.startsWith(prefix))
    .forEach(key => {
      results.push(i18n[key])
    })
  return results
}
