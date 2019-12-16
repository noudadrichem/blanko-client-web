import React from 'react'
import { time } from '../../utils/'
const { secondsToHourMinuteSecond } = time

const SingleMeasurment = ({ total }) => (
  <div className="single-measurement">
    <span>Measurement:</span>
    <span className="mono">{ secondsToHourMinuteSecond(total / 1000) }</span>
  </div>
)

export default SingleMeasurment
