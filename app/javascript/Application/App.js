import React, { Fragment } from 'react'
import { PageHeader } from 'react-wood-duck'
import Header from './components/Header'
import { BrowserRouter } from 'react-router-dom'
import 'react-widgets/dist/css/react-widgets.css'
import { GlobalAlert } from './components/common'
import Sticker from 'react-stickyfill'

import './style.sass'
import { Routes } from './routes'
import TimeoutWarning from './components/common/TimeoutWarning'

const App = () => {
  const basePath = process.env.CANS_BASE_PATH || '/cans'
  return (
    <BrowserRouter basename={basePath}>
      <Fragment>
        <Header />
        <Sticker>
          <div role="contentinfo" className="sticky page-header-container">
            <PageHeader pageTitle="CANS Assessment Application" button={null}>
              <GlobalAlert />
            </PageHeader>
          </div>
        </Sticker>
        <TimeoutWarning />
        <Routes />
      </Fragment>
    </BrowserRouter>
  )
}

export default App
