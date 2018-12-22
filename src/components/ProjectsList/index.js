import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {fetchTasks} from '../../actions/'

class ProjectList extends React.Component {
	render() {
		const { projects, className, fetchTasks } = this.props

		return (
			projects !== undefined &&
				<ul className={`projects-list ${className}`}>
					{
						projects
							.map((project, idx) => {
								const { _id, projectTitle, favorite } = project

								return (
									<li key={idx} className={'active'} onClick={() => fetchTasks(project._id)}>
										<span title={ projectTitle }>{ projectTitle }</span>
										{/* <ProjectMenu
											iconVisibility={true}
											project={{ favorite: favorite, _id: _id }}
											setProjectFavorite={setProjectFavorite}
											deleteProject={deleteProject}
										/> */}
									</li>
								)

						})
					}
				</ul>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		projects: state.projectReducer.projects
	}
}

export default connect(mapStateToProps, { fetchTasks })(ProjectList)


ProjectList.defaultProps = {
	className: ''
}

ProjectList.PropTypes = {
	projects: PropTypes.array,
	className: PropTypes.string
}
