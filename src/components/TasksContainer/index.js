import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group'
import { connect } from 'react-redux'
import { fetchTasks, getSingleProject } from '../../actions'

// Components
import Task from '../Task'
import AddTask from '../AddTask'
import FilterBar from '../FilterBar'

// Styles
import './TasksContainer.scss'

class TasksContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isFilterBarSticky: false,
      searchQuery: '',
      filterStatus: 'ALL'
    }

    this.filterBar = React.createRef()
    this.tasksContainerTitle = React.createRef()
  }

  componentDidMount() {
    const hasSelectedProject = window.localStorage.getItem('PROJ_ID')
    const { getSingleProject, fetchTasks } = this.props

    if (hasSelectedProject) {
      getSingleProject(hasSelectedProject)
      fetchTasks(hasSelectedProject)
    }

    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = () => {
    const scrollOffset = this.tasksContainerTitle.current.clientHeight
    const outerHeights = 64

    if (window.scrollY < scrollOffset + outerHeights) {
      this.setState({
        isFilterBarSticky: false
      })
    } else if (window.scrollY > 146) {
      this.setState({
        isFilterBarSticky: true
      })
    }
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

  // filterByQuery = (task) => {
  //   const { title, subTitle, status } = task
  //   const { searchQuery, filterStatus } = this.state

  //   return (
  //     title.toLowerCase().includes(searchQuery) || subTitle.toLowerCase().includes(searchQuery)
  //   ) && (filterStatus !== 'ALL' && status === filterStatus)
  // }

  filterByQuery = (task) => {
    const { title, subTitle, status } = task
    const { searchQuery, filterStatus } = this.state

    const showAllTasks = status === 'ALL'
    if(showAllTasks && searchQuery !== '') {
      return (title.toLowerCase().includes(searchQuery) || subTitle.toLowerCase().includes(searchQuery))
    } else {
      return status === filterStatus && (title.toLowerCase().includes(searchQuery) || subTitle.toLowerCase().includes(searchQuery))
    }
  }

  render() {
    const {
      projectTitle,
      projectDescription,
      activeTask,
      tasks
    } = this.props

    const { isFilterBarSticky, filterStatus } = this.state

    const isThereAnActiveTask = activeTask !== undefined

    return (
      <div className={`tasks-container ${isThereAnActiveTask ? 'task-active' : ''}`}>
        <div className="tasks-container-title" ref={this.tasksContainerTitle}>
          <h1>{projectTitle}</h1>
          <p>{projectDescription}</p>
        </div>

        <FilterBar
          isSticky={isFilterBarSticky}
          handleTaskSearch={this.handleTaskSearch}
          handleTaskStatusFilter={this.handleTaskStatusFilter}
          filterStatus={filterStatus}
        />

        <TransitionGroup className={`tasks-list ${isFilterBarSticky ? 'sticky' : ''}`}>
          {
            tasks !== undefined && (
              tasks
                .filter(this.filterByQuery)
                .map(task => (
                  <CSSTransition
                    key={task._id}
                    timeout={250}
                    classNames="fade"
                  >
                    <Task task={task} />
                  </CSSTransition>
                ))
            )
          }
        </TransitionGroup>

        {projectTitle !== undefined && <AddTask />}
      </div>
    )
  }
}

TasksContainer.propTypes = {
  tasks: PropTypes.instanceOf(Array),
  projectTitle: PropTypes.string,
  projectDescription: PropTypes.string,
  getSingleProject: PropTypes.func,
  fetchTasks: PropTypes.func,
  activeTask: PropTypes.instanceOf(Object)
}

const mapStateToProps = ({ projectReducer }) => ({
  tasks: projectReducer.tasks,
  projectTitle: projectReducer.activeProject.projectTitle,
  projectDescription: projectReducer.activeProject.projectDescription,
  activeTask: projectReducer.activeTask
})

export default connect(mapStateToProps, { fetchTasks, getSingleProject })(TasksContainer)
