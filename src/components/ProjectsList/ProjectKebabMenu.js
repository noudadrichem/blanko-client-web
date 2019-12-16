import React, { useState, useEffect } from 'react'
import { CSSTransition } from 'react-transition-group'
import './ProjectKebabMenu.scss'
import { DELETE_PROJECT } from '../../contstants/actionTypes'


function ProjectKebabMenu(props) {
  const { toggleModal, updateProject, projectId } = props
  const [isShown, setIsShown] = useState(false)
  let container

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  })

   const handleClickOutside = e => {
    if (container && !container.contains(e.target)) {
      setIsShown(false)
    }
  }

  return (
    <div className="project-kebab-menu" ref={n => container = n}>
      <div className="project-kebab-menu-trigger" onClick={() => setIsShown(!isShown)}>
        <img src={require('../../assets/icons/kebab-menu.svg')} alt="Kebab menu trigger" />
      </div>

      <CSSTransition
        in={isShown}
        timeout={200}
        classNames="fadeInUp"
        unmountOnExit
      >
        <div className="project-kebab-menu-content" onClick={() => setIsShown(false)}>
          <div onClick={() => updateProject(projectId) }>Favorite</div>
          <div className="delete" onClick={() => toggleModal('isVerificationShown', true, DELETE_PROJECT) }>Delete</div>
        </div>
      </CSSTransition>
    </div>
  )
}

export default ProjectKebabMenu
