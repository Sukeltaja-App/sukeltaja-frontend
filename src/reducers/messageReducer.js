import messageService from '../services/messages'
import { standardQueuing } from '../utils/offlineThunkHandler'
import { messageToID } from '../utils/utilityFunctions'

// Messages are forwarded by the server to the receivers through the websocket.
// Each Message has attribute string called type that signals its function.
// Messages also carry a data object.
// Message types that exist:
// - 'invitation_participant'
// - 'invitation_admin'

export const messageReducer = (state = [], action) => {
  switch(action.type) {
    case 'NEW_MESSAGE':
      return [ ...state, action.message ]
    case 'REMOVE_MESSAGE':
      return state.filter(message => messageToID(message) !== action.id)
    case 'SET_MESSAGES':
      return action.messages
    default:
      return state
  }
}

// Does not do anything yet, could be used if client needs to store
// the fact that a message was sent.
export const sentMessageReducer = (state = [], action) => {
  switch(action.type) {
    case 'SEND_MESSAGE':
      return state //replace with below line to use.
      //return [ ...state, action.message ]
    case 'SET_SENT_MESSAGES':
      return action.messages
    default:
      return state
  }
}

export const getMessages = () => {
  async function thunk (dispatch) {
    const messages = await messageService.getAll()

    dispatch ({
      type: 'SET_MESSAGES',
      messages
    })
  }

  return standardQueuing(thunk)
}

export const checkMessage = (message, status) => {
  async function thunk (dispatch) {
    await messageService.checkMessage(messageToID(message), status)

    dispatch ({
      type: 'REMOVE_MESSAGE',
      id: messageToID(message),
      meta: {
        retry: true
      }
    })
  }

  return standardQueuing(thunk)
}

export const sendMessage = (type, data, sender, receivers) => {
  if (!type || !data || !sender || !receivers || receivers.length === 0) return

  const received = Array(receivers.length).fill('pending')

  let message = {
    created: new Date(),
    sender,
    receivers,
    received,
    type,
    data
  }

  async function thunk (dispatch) {
    message = await messageService.create(message)

    dispatch ({
      type: 'SEND_MESSAGE',
      message,
      meta: {
        retry: true
      }
    })
  }

  return standardQueuing(thunk)
}

export const receiveMessage = (message) => {
  return (dispatch) => {
    dispatch({
      type: 'NEW_MESSAGE',
      message
    })
  }
}
