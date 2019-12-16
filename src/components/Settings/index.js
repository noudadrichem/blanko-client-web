import React from 'react'
import './Settings.scss'

import http from '../../utils/http'
import config from '../../utils/config'

function Settings(props) {
  function getshared() {
    http.get(`${config.apiUrl}/projects/shared`)
      .then(res => {
        console.log('shared...', res)
      })
  }

  return (
    <div className="home-container settings-container">
      Settings
    </div>
  )
}


export default Settings
