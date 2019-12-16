import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import { reorderTasks } from '../../actions'

import Task from '../Task'
import AddTask from '../AddTask'

const ChevronRight = ({ size = 16, color = "#7A848F", className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`chevron-right ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="square" strokeLinejoin="arcs"><path d="M9 18l6-6-6-6" /></svg>
)

class TaskList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      open: !props.deleted
    }
  }

  filterByQuery = (task) => {
    const { title, subTitle } = task
    const { searchQuery } = this.props

    return (
      title.toLowerCase().includes(searchQuery) ||
      subTitle.toLowerCase().includes(searchQuery)
    )
  }

  reOrderOnDragEnd = (draggingResources) => {
    const { source, destination, reason, draggableId } = draggingResources

    if(!draggingResources.destination) {
      return
    } else if(reason === 'DROP') {
      this.props.reorderTasks(
        this.props.deleted,
        this.props.deleted ? this.props.archivedTasks : this.props.tasks,
        source,
        destination,
        draggableId,
        this.props.projectId
      )
    }
  }

  sortTasksByOrder = (a, b) => a.order - b.order

  toggleHeight = () => {
    const { taskListContainer } = this.refs
    const containerHeight = taskListContainer.clientHeight

    this.setState(({open}) => ({
      open: !open
    }), () => {
        taskListContainer.style.height = this.state.open ? 'auto' : 0;
    })
  }

  render() {
    const {
      projectId,
      deleted,
      label,
      tasks,
      archivedTasks
    } = this.props
    const { open } = this.state

    const taskList = deleted ? archivedTasks : tasks

    return (
      <div className="task-list-container">
        <div className="toggle-height" onClick={this.toggleHeight}>
          <div className="toggle-height-trigger">
            <ChevronRight size={12} className={open ? 'open' : 'closed'} />
          </div>
          <div className="label">{label}</div>
        </div>

        <div className={`task-list ${open ? 'open ' : 'closed'}`} ref="taskListContainer">
          <DragDropContext onDragEnd={this.reOrderOnDragEnd}>
            <Droppable droppableId="droppable-1">
              {
                (provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {
                      taskList !== undefined &&
                      taskList
                        .filter(task => deleted ? task.status === 'DONE' : task.status !== 'DONE')
                        .filter(this.filterByQuery)
                        .sort(this.sortTasksByOrder)
                        .map((task, idx) => (
                          <Draggable key={task._id} draggableId={task._id} index={idx} isDragDisabled={projectId === 'all'}>
                            {(provided, { isDragging }) => (
                              <Task
                                isDragging={isDragging}
                                task={task}
                                provided={provided}
                                archived={deleted}
                              />
                            )}
                          </Draggable>
                        ))
                    }
                    {provided.placeholder}
                  </div>
                )
              }
            </Droppable>

            {!deleted && <AddTask />}
          </DragDropContext>
        </div>
      </div>
    )
  }
}

TaskList.defaultProps = {
  tasks: [],
  archivedTasks: [],
  deleted: false
}

TaskList.propTypes = {
  tasks: PropTypes.instanceOf(Array),
  searchQuery: PropTypes.string,
  filterStatus: PropTypes.string
}


const mapStateToProps = ({ projectReducer }) => ({
  tasks: projectReducer.tasks,
  archivedTasks: projectReducer.archivedTasks,
  projectId: projectReducer.activeProjectId
})

export default connect(mapStateToProps, { reorderTasks })(TaskList)
