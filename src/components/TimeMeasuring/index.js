import React from 'react'
import { connect } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import './timeMeasuringStyle.scss'

import {
  startTimeMeasurement,
  stopTimeMeasurement
} from '../../actions'

import SingleMeasurement from './SingleMeasurement'
import Button from '../Button'
import NewMeasurement from './NewMeasurement'
import {
  time
} from './../../utils'
const { secondsToHourMinuteSecond, totalInSeconds} = time

class TimeMeasuring extends React.Component {
	state = {
		isMeasuring: false,
		currenTime: null,
		startTime: null,
    endTime: null,
    isAddNewMeasurementShown: false
	}

  currenTime = () => new Date().getTime()

	startMeasurement = taskId => {
		this.setState({
			isMeasuring: true,
			startTime: this.currenTime()
		}, () => {
			this.setSpendedTimeValue()
			const inititalMeasurement = {
        projectId: this.props.activeProjectId,
				startTime: this.state.startTime,
      }
      this.props.startTimeMeasurement(taskId, inititalMeasurement)
		})
	}

	setSpendedTimeValue = () => {
		this.setState({
			currenTime: this.currenTime()
		})
		this.interval = setInterval(() => {
			this.setState({
				currenTime: this.currenTime()
			})
    }, 500)
	}

	stopMeasurement = projectId => {
		this.setState({
      isMeasuring: false,
      startTime: this.currenTime(),
      currenTime: this.currenTime()
		}, () => {
			const putMeasurement = {
				endTime: this.currenTime(),
				isFinished: true
			}
      this.props.stopTimeMeasurement(projectId, this.props.activeMeasurementId , putMeasurement)
    clearInterval(this.interval)
		})
  }

  toggleIsAddNewMeasurementShown = () => {
    this.setState(({ isAddNewMeasurementShown }) => ({
      isAddNewMeasurementShown: !isAddNewMeasurementShown
    }))
  }

	render() {
    const { activeTaskId, activeProjectId, measurements } = this.props
    const { startTime, currenTime, isMeasuring, isAddNewMeasurementShown} = this.state
    const totalMeasuredTime = measurements.filter(m => m.isFinished).reduce((zero, { total }) => zero + total, 0)

		return (
			<div className="time-measurements">
        <div className="new-measurement">
          <CSSTransition
            in={isAddNewMeasurementShown}
            timeout={200}
            classNames="fadeInUp"
            unmountOnExit
          >
            <NewMeasurement toggleIsAddNewMeasurementShown={this.toggleIsAddNewMeasurementShown} />
          </CSSTransition>
        </div>

				<div className="current-measurement">
          {
            isMeasuring
              ? <Button onClick={() => this.stopMeasurement(activeProjectId)} text="Stop" variant="danger" />
              : (
                <div className="plus-measurement">
                  <span onClick={this.toggleIsAddNewMeasurementShown} className="plus-measurement-btn">
                    <img src={require('../../assets/icons/plus.svg')} />
                  </span>
                  <Button onClick={() => this.startMeasurement(activeTaskId)} text="Start" variant="primary" />
                </div>
              )
          }
					<div className="numbers mono">
					{
						secondsToHourMinuteSecond(
							totalInSeconds(currenTime, startTime)
						)
					}
					</div>
				</div>

        { measurements.length > 0 &&
          <>
            <div className="total-measured mono">
              <span className="label">Total measured time:</span>
              <span className="mono">{ totalMeasuredTime !== isNaN &&  secondsToHourMinuteSecond(totalMeasuredTime / 1000) }</span>
            </div>

            <div>
              <span className="label">All measurements:</span>
              {
                measurements
                  .filter(m => m.isFinished)
                  .map((measurement, idx) => <SingleMeasurement {...measurement} key={idx}/>)
              }
            </div>
          </>
        }
			</div>
		)
	}
}

function mapStateToProps({ projectReducer }) {
  return {
    activeTaskId: projectReducer.activeTask._id,
    activeProjectId: projectReducer.activeProject._id,
    measurements: projectReducer.measurements,
    activeMeasurementId: projectReducer.activeMeasurementId,
    activeProjectId: projectReducer.activeProject._id
  }
}

export default connect(mapStateToProps, { startTimeMeasurement, stopTimeMeasurement })(TimeMeasuring)
