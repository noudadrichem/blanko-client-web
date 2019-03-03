import * as types from '../contstants/actionTypes'
import http from '../utils/http'
import config from '../utils/config'

export const login = userInfo => {
  return dispatch => http.post(`${config.apiUrl}/account/login`, userInfo)
  .then((resolved) => {
    if (resolved.data.success) {
      return dispatch({
        type: types.LOGIN_SUCCESS,
        payload: resolved.data
      })
    }
    return dispatch({
      type: types.LOGIN_ERROR,
      payload: resolved.data
    })
  })
}

export const fetchProjects = () => dispatch => http.get(`${config.apiUrl}/projects`)
  .then((resolved) => {
    dispatch({
      type: types.FETCH_PROJECTS,
      payload: resolved.data
    })
  })

export const setSelectedProject = project => ({
  type: types.SET_PROJECT_DATA,
  payload: project
})

export const fetchTasks = projectID => dispatch => http.get(`${config.apiUrl}/projects/${projectID}/tasks`)
  .then((resolved) => {
    dispatch({
      type: types.FETCH_TASKS,
      payload: {
        data: resolved.data
      }
    })
  })

export const toggleAddProjectModal = () => ({
  type: types.TOGGLE_ADDPROJECT,
})

export const addProject = projectData => dispatch => http.post(`${config.apiUrl}/projects/add/`, projectData)
  .then((resolved) => {
    dispatch({
      type: types.ADD_PROJECT,
      payload: resolved.data
    })
  })

export const getSingleProject = id => dispatch => http.get(`${config.apiUrl}/projects/${id}`)
  .then((resolved) => {
    dispatch({
      type: types.SET_PROJECT_DATA,
      payload: resolved.data
    })
  })

export const addTask = (taskData, activeProjectId) => dispatch => http.post(`${config.apiUrl}/projects/add/${activeProjectId}`, taskData)
  .then((resolved) => {
    dispatch({
      type: types.ADD_TASK,
      payload: resolved.data
    })
  })

export const deleteTask = (projectId, taskId) => dispatch => http.delete(`${config.apiUrl}/tasks/${projectId}/${taskId}`)
  .then((resolved) => {
    dispatch({
      type: types.DELETE_TASK,
      payload: resolved.data
    })
  })

export const setTaskActive = (task) => {
  return (dispatch, getState) => {
    const thereIsNoActiveMeasurement = getState().projectReducer.activeMeasurementId === undefined

    if(thereIsNoActiveMeasurement) {
      if(task !== undefined) {
        http.get(`${config.apiUrl}/timemeasurements/all/${task._id}`)
          .then(resolved => {
            const measurements = resolved.data
            dispatch({
              type: types.SET_TASK_ACTIVE,
              payload: {
                task,
                measurements
              }
            })
          })
      } else {
        dispatch({
          type: types.SET_TASK_NOT_ACTIVE
        })
      }
    }
  }
}

export function updateTaskStatus(taskId, currentStatus) {
  const newStatus = {
    status: currentStatus === 'TODO' ? 'DONE' : 'TODO'
  }
  if(taskId !== undefined) {
    return (dispatch, getState) => http.put(`${config.apiUrl}/tasks/update/${taskId}`, newStatus)
      .then(resolved => {
        const oldTasks = [...getState().projectReducer.tasks]
        console.log(JSON.stringify(oldTasks))
        const newTasks = oldTasks.map((task, idx) => {
          if(task._id === taskId) {
            return {
              ...task,
              status: task.status === 'TODO' ? 'DONE' : 'TODO'
            }
          } else {
            return task
          }
        })

        // const changedTaskIndex = state.tasks.map(t => t._id).indexOf(action.payload.task._id)
        // const newTasks = state.tasks.splice(changedTaskIndex, 1, action.payload.task)

        dispatch({
          type: types.CHANGE_TASK_STATUS,
          payload: {
            newTasks
          }
        })
      })
  }
}

export const startTimeMeasurement = (taskId, startMesObj) => {
  if(taskId !== undefined) {
    return dispatch => http.post(`${config.apiUrl}/timemeasurements/new/${taskId}`, startMesObj)
    .then(resolved => {
      dispatch({
        type: types.START_MES,
        payload: resolved.data
      })
    })
  }
}

export function stopTimeMeasurement(taskId, measurementId, endMesObj) {
  if(taskId !== undefined) {
    return dispatch => http.put(`${config.apiUrl}/timemeasurements/update/${taskId}/${measurementId}`, endMesObj)
      .then(resolved => {
        dispatch({
          type: types.STOP_MES,
          payload: resolved.data
        })
      })
  }
}
