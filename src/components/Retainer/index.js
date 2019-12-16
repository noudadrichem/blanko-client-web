import React from 'react'
import {time} from '../../utils'
import './Retainer.scss'
function Retainer(props) {
  const { accumulatedTime } = props
  return (
    (accumulatedTime > 0) &&
    <div className="retainer-container">
      <div>
        { (accumulatedTime !== undefined) && time.secondsToHourMinuteSecond(accumulatedTime / 1000) }
      </div>
    </div>
  )
}

export default Retainer
