import React, { Component } from 'react'
import PropTypes from 'prop-types'

// Components
import Button from '../Button'
import Input from '../Input'

// Styles
import './FilterBar.scss'

function FilterBar(props) {
  const { handleTaskSearch, } = props

  return (
    <div>
      { window.innerWidth > 400 && <Input placeholder="Search" icon="glass" onChange={handleTaskSearch} /> }
     </div>
  )
}

FilterBar.propTypes = {
  isSticky: PropTypes.bool,
  handleTaskSearch: PropTypes.func,
  handleTaskStatusFilter: PropTypes.func,
  filterStatus: PropTypes.string
}

export default FilterBar
