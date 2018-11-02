const isUserInfoReady = (userInfo, hasAddSensitivePerson) =>
  userInfo &&
  (hasAddSensitivePerson === true || hasAddSensitivePerson === false)

const areDifferentCounties = (userCounty, clientCounty) =>
  userCounty && clientCounty && userCounty !== clientCounty

const ALLOWED_CLIENT_COUNTIES = 1

export const canUserAddClient = (
  userInfo,
  hasAddSensitivePerson,
  client,
  hasOverride
) => {
  if (hasOverride || !isUserInfoReady(userInfo, hasAddSensitivePerson)) {
    return true
  }

  const { isSensitive, clientCounties } = client

  if (clientCounties.length > ALLOWED_CLIENT_COUNTIES) {
    return true
  }

  const clientCounty = clientCounties[0]
  const { county: userCounty } = userInfo || {}

  return (
    !isSensitive ||
    (hasAddSensitivePerson && !areDifferentCounties(userCounty, clientCounty))
  )
}
