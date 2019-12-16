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
import FilterBar from '../FilterBar'
import TaskList from './TaskList'
import { time } from '../../utils'

// Styles
import './TasksContainer.scss'

const { secondsToHourMinuteSecond, totalInSeconds } = time
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
          secondsToHourMinuteSecond(accumulatedTime / 1000)
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
          : <div>Project does not exist...</div>
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
