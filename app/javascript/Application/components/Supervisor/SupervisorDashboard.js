import React from 'react'
import SubordinateCard from './SubordinateCard'
import SubordinateLoadingBoundary from './SubordinateLoadingBoundary'

const SupervisorDashboard = () => (
  <SubordinateLoadingBoundary>
    <SubordinateCard />
  </SubordinateLoadingBoundary>
)

export default SupervisorDashboard
