import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  fetchTasks,
  getSingleProject,
  showSidebar,
  fetchAccumulatedProjectTime
} from '../../actions'

// Components
import TaskList from './TaskList'
import FilterBar from '../FilterBar'
import Retainer from '../Retainer'
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
    window.addEventListener('scroll', this.handleScroll)
    const {
      getSingleProject,
      fetchTasks,
      fetchAccumulatedProjectTime
    } = this.props
    const { projectId } = this.props.urlParams

    getSingleProject(projectId)
    fetchTasks(projectId)
    fetchAccumulatedProjectTime(projectId)
  }

  componentDidUpdate(prevProps) {
    const { getSingleProject, fetchTasks, fetchAccumulatedProjectTime } = this.props
    if (this.props.urlParams.projectId !== prevProps.urlParams.projectId) {
      const projectId = this.props.urlParams.projectId;
      getSingleProject(projectId)
      fetchTasks(projectId)
      fetchAccumulatedProjectTime(projectId)
      return true
    }
    return false;
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
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
      showSidebar,
      accumulatedTime
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
            <div className="tasks-container-title" ref={this.tasksContainerTitle}>
              <div>
                <h1>{projectTitle}</h1>
                <p>{projectDescription}</p>
              </div>

              <Retainer accumulatedTime={accumulatedTime} />
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
          : <div className="project-not-found">
              <SadFace />
              <h4>Project does not exist...</h4>
            </div>
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
  activeTask: projectReducer.activeTask,
  accumulatedTime: projectReducer.accumulatedTime
})

export default connect(mapStateToProps, { fetchTasks, getSingleProject, showSidebar, fetchAccumulatedProjectTime })(TasksContainer)
