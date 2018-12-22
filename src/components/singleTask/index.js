import React from 'react'
import './singleTaskStyle.scss'

const SingleTask = ({ task }) => (
	<div className="single-task">

		{ task.title }
	</div>
)

export default SingleTask
