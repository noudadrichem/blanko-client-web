import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchTasks, getSingleProject, showSidebar } from '../../actions'

// Components
import FilterBar from '../FilterBar'
import TaskList from './TaskList'
import SadFace from '../../assets/sad-face'

// Styles
import './TasksContainer.scss'

class TasksContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isFilterBarSticky: false,
      searchQuery: '',
      filterStatus: 'TODO'
    }

    this.filterBar = React.createRef()
    this.tasksContainerTitle = React.createRef()
    this.tasksContainer = React.createRef()
  }

  componentDidMount() {
    console.log('__________task container mount')
    window.addEventListener('scroll', this.handleScroll)
    const { getSingleProject, fetchTasks } = this.props
    const { projectId } = this.props.urlParams

    // const hasSelectedProject = window.localStorage.getItem('PROJ_ID')
    // if (hasSelectedProject) {
      getSingleProject(projectId)
      fetchTasks(projectId)
    // }
  }

  componentDidUpdate(prevProps) {
    const { getSingleProject, fetchTasks } = this.props
    if (this.props.urlParams.projectId !== prevProps.urlParams.projectId) {
      console.log('IS OTHER PROJECT NEEF')
      getSingleProject(this.props.urlParams.projectId)
      fetchTasks(this.props.urlParams.projectId)
    }
    console.log('task container mount again', {prevProps, props: this.props})
    return true
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = () => {
    // const scrollOffset = this.tasksContainerTitle.current.clientHeight
    // const outerHeights = 64
    // const totalNodeOffset = scrollOffset + outerHeights

    // if (window.scrollY < totalNodeOffset) {
    //   this.setState({
    //     isFilterBarSticky: false
    //   }, () => {
    //     document.body.style.paddingTop = 0
    //   })
    // } else if (window.scrollY > totalNodeOffset) {
    //   this.setState({
    //     isFilterBarSticky: true
    //   }, () => {
    //     document.body.style.paddingTop = outerHeights + 'px'
    //   })
    // }
  }

  handleTaskSearch = (e) => {
    const query = e.target.value.toLowerCase()

    this.setState({
      searchQuery: query
    })
  }

  handleTaskStatusFilter = (e) => {
    const status = e.target.value

    this.setState({
      filterStatus: status
    })
  }

  render() {
    const {
      projectTitle,
      projectDescription,
      activeTask,
      showSidebar
    } = this.props

    const { isFilterBarSticky, filterStatus, searchQuery } = this.state

    const isThereAnActiveTask = activeTask !== undefined

    return (
      <div className={`home-container tasks-container ${isThereAnActiveTask ? 'task-active' : ''}`} ref={this.tasksContainer}>
        {
          window.innerWidth < 400 &&
          <div onClick={showSidebar} className="hamburger-icon-sidebar">
            <img src={require('../../assets/icons/hamburger-icon.svg')} alt="icon to show sidebar" />
          </div>
        }

        {
          projectTitle !== undefined
          ? <>
            <div className="home-container-title" ref={this.tasksContainerTitle}>
              <h1>{projectTitle}</h1>
              <p>{projectDescription}</p>
            </div>

            <FilterBar
              isSticky={isFilterBarSticky}
              handleTaskSearch={this.handleTaskSearch}
              handleTaskStatusFilter={this.handleTaskStatusFilter}
              filterStatus={filterStatus}
            />

            <TaskList
              label="Todo"
              isSticky={isFilterBarSticky}
              searchQuery={searchQuery}
              filterStatus={filterStatus}
            />

            <TaskList
              label="Done"
              isSticky={isFilterBarSticky}
              searchQuery={searchQuery}
              filterStatus={filterStatus}
              deleted
            />
            </>
          : <div></div>
        }
      </div>
    )
  }
}

TasksContainer.propTypes = {
  projectTitle: PropTypes.string,
  projectDescription: PropTypes.string,
  getSingleProject: PropTypes.func,
  fetchTasks: PropTypes.func,
  activeTask: PropTypes.instanceOf(Object)
}

const mapStateToProps = ({ projectReducer }) => ({
  projectTitle: projectReducer.activeProject.projectTitle,
  projectDescription: projectReducer.activeProject.projectDescription,
  activeTask: projectReducer.activeTask
})

export default connect(mapStateToProps, { fetchTasks, getSingleProject, showSidebar })(TasksContainer)
