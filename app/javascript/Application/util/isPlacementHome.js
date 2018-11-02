export const isPlacementHome = address => {
  if (!address) {
    return false
  }
  return (
    address.getIn(['legacy_descriptor', 'legacy_table_name']) === 'PLC_HM_T'
  )
}
