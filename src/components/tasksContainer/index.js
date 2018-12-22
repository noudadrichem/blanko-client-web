import React, { Component } from 'react'
import { connect } from 'react-redux'
import './taskContainerStyle.scss'

import SingleTask from '../singleTask'

class TasksContainer extends Component {
	render() {
		const { tasks } = this.props

		return (
			<div className="tasks-container">
				<h1>Project title</h1>

				{
					tasks.map(task =>
						<SingleTask task={task}/>
					)
				}
			</div>
		)
	}
}

const mapStateToProps = state => {
	console.log('taskcontainer', {state})
	return {
		tasks: state.projectReducer.tasks
	}
}

export default connect(mapStateToProps, null)(TasksContainer)
