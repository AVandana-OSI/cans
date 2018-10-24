export default function legacySourceFormatter({ legacyTableDescription, legacyUiId }) {
  const legacySourceStringParts = []

  if (legacyTableDescription) {
    legacySourceStringParts.push(legacyTableDescription)
  }

  if (legacyUiId) {
    legacySourceStringParts.push(`ID ${legacyUiId}`)
  }

  if (legacyTableDescription || legacyUiId) {
    legacySourceStringParts.push('in CWS-CMS')
  }

  return legacySourceStringParts.join(' ')
}
