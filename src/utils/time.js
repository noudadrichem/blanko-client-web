export function secondsToHourMinuteSecond(totalSeconds) {
  const hour = Math.floor(totalSeconds / 3600)
  const minute = Math.floor(totalSeconds % 3600 / 60)
  const seconds = Math.floor(totalSeconds % 3600 % 60)

  return `${('0' + hour).slice(-2)}:${('0' + minute).slice(-2)}:${('0' + seconds).slice(-2)}`
}

export function totalInMiliSeconds(endTime, startTime) {
  return Math.floor(endTime - startTime)
}

export function totalInSeconds(endTime, startTime) {
  return Math.floor(totalInMiliSeconds(endTime, startTime) / 1000)
}

export const hoursToSeconds = hours => hours * (60 * 60)
export const minutesToSeconds = minutes => minutes * 60
