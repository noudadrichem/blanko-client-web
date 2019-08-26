import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { reorderTasks } from '../../actions/'

import Task from '../Task'
import AddTask from '../AddTask'

class TaskList extends React.Component {
  constructor(props) {
    super(props)
  } 

  filterByQuery = (task) => {
    const { title, subTitle, status } = task
    const { searchQuery, filterStatus } = this.props
    const showAllTasks = filterStatus === 'ALL'

    if(showAllTasks) {
      return (title.toLowerCase().includes(searchQuery) || subTitle.toLowerCase().includes(searchQuery))
    } else {
      return status === filterStatus && (title.toLowerCase().includes(searchQuery) || subTitle.toLowerCase().includes(searchQuery))
    }
  }

  reOrderOnDragEnd = (draggingResources) => {
    const { source, destination, reason, draggableId } = draggingResources

    if(!draggingResources.destination) {
      return
    } else if(reason === 'DROP') {
      this.props.reorderTasks(this.props.tasks, source.index, destination.index, draggableId)
    }
  }

  render() {
    const { isFilterBarSticky, tasks } = this.props

    return (
      <DragDropContext onDragEnd={this.reOrderOnDragEnd}>
        <Droppable droppableId="droppable-1">
        { 
          (provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {tasks !== undefined && (
                tasks
                  .filter(this.filterByQuery)
                  .map((task, idx) => (
                      <Draggable key={task._id} draggableId={task._id} index={idx}>
                      {(provided, { isDragging }) => (
                        <Task
                          isDragging={isDragging}
                          task={task}
                          provided={provided}
                        />
                      )}
                      </Draggable>
                  ))
              )}
              {provided.placeholder}
            </div>
          )
        }
        </Droppable>
      <AddTask/>
      </DragDropContext>
    )
  }
}

TaskList.defaultProps = {
  tasks: []
}

TaskList.propTypes = {
  tasks: PropTypes.instanceOf(Array),
  searchQuery: PropTypes.string,
  filterStatus: PropTypes.string
}


const mapStateToProps = ({ projectReducer }) => ({
  tasks: projectReducer.tasks,
})

export default connect(mapStateToProps, { reorderTasks })(TaskList)
