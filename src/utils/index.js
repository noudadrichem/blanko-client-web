import http from './http'
import config from './config'
import * as time from './time'

function isDarkTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

export {
  http,
  config,
  time,
  isDarkTheme
}
