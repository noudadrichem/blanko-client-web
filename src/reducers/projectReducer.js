import initialState from './initialState'
import * as types from '../contstants/actionTypes'

export default function projectsReducer(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_PROJECTS:
      return {
        ...state,
        projects: action.payload
      }
    case types.SET_PROJECT_DATA:
      window.localStorage.setItem('PROJ_ID', action.payload._id)
      return {
        ...state,
        activeProject: action.payload,
        activeProjectId: action.payload._id
      }
    case types.FETCH_TASKS:
      return {
        ...state,
        tasks: action.payload.data.filter(t => t.status !== 'DONE'),
        archivedTasks: action.payload.data.filter(t => t.status === 'DONE'),
      }
    case types.TOGGLE_ADDPROJECT:
      return {
        ...state,
        isAddProjectShown: !state.isAddProjectShown
      }
    case types.ADD_PROJECT:
      return {
        ...state,
        projects: [...state.projects, action.payload],
        isAddProjectShown: false
      }
    case types.ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, action.payload.body]
      }
    case types.DELETE_TASK:
      const deletedTasks = [...state.tasks].filter(task => task._id !== state.activeTask._id)

      return {
        ...state,
        tasks: deletedTasks,
        activeTask: undefined,
        measurements: undefined
      }
    case types.SET_TASK_ACTIVE:
      return {
        ...state,
        activeTask: action.payload.task,
        measurements: action.payload.measurements
      }

    case types.SET_TASK_NOT_ACTIVE:
      return {
        ...state,
        activeTask: undefined
      }
    case types.CHANGE_TASK_STATUS:
      return {
        ...state,
        tasks: action.payload.tasks,
        archivedTasks: action.payload.archivedTasks
      }
    case types.REORDER_TASKS:
      console.log('REORDER_TASKS...', action.payload)
      return {
        ...state,
        tasks: action.payload.tasks,
        archivedTasks: action.payload.archivedTasks
      }
    case types.START_MES:
      return {
        ...state,
        activeMeasurementId: action.payload.newMeasurement._id
      }
    case types.STOP_MES:
      return {
        ...state,
        activeMeasurementId: undefined,
        measurements: state.measurements.concat(action.payload.measurement)
      }
    case types.TOGGLE_SIDEBAR:
      return {
        ...state,
        isSidebarShown: !state.isSidebarShown,
      }
    case types.DELETE_PROJECT:
      const deletedProjects = [...state.projects].filter(project => project._id !== state.activeProject._id)

      return {
        ...state,
        projects: deletedProjects,
        activeProject: {},
        tasks: undefined,
        activeTask: undefined,
        measurements: undefined
      }
    case types.UPDATE_PROJECT:
      return {
        ...state,
        projects: action.payload.projects
      }
    case types.TOGGLE_MODAL:
      return {
        ...state,
        [action.payload.key]: action.payload.value,
        modalAction: action.payload.followingAction
      }
    case types.RENEW_TASK_ARRAY:
      return {
        ...state,
        tasks: action.payload.newTasks
      }
    case types.NEW_MES:
      return {
        ...state,
        measurements: [...state.measurements, action.payload.newMeasurement]
      }
    case types.ACCUMULATED_PROJECT:
        return {
          ...state,
          accumulatedTime: action.payload.accumulatedTime
        }
    default:
      return state
  }
}
