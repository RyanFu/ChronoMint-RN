import Immutable from 'immutable'
// import { browserHistory, createMemoryHistory } from 'react-router'
import { combineReducers } from 'redux-immutable'
import { createStore, applyMiddleware, compose } from 'redux'
// import { reducer as formReducer } from 'redux-form/immutable'
// import { loadTranslations, setLocale, i18nReducer, I18n } from 'platform/i18n'
// import moment from 'moment'
import { composeWithDevTools } from 'remote-redux-devtools'
import saveAccountMiddleWare from 'redux/session/saveAccountMiddleWare'
import thunk from 'redux-thunk'
// import ls from 'utils/LocalStorage'
// import { globalWatcher } from '@chronobank/mint/src/redux/watcher/actions'
import { SESSION_DESTROY } from 'redux/session/actions'
import * as ducks from './ducks'

const getNestedReducers = (ducks) => {
  let reducers = {}

  Object.keys(ducks).forEach((r) => {
    reducers = { ...reducers, ...(typeof (ducks[r]) === 'function' ? { [r]: ducks[r] } : getNestedReducers(ducks[r])) }
  })

  return reducers
}

// add noised action here
// const IGNORED_ACTIONS = [
//   'market/UPDATE_RATES',
//   'market/UPDATE_LAST_MARKET',
// ]

// let logActions = process.env.NODE_ENV === 'development'
//   ? function (action) {
//     if (IGNORED_ACTIONS.includes(action.type)) {
//       return
//     }
//     // eslint-disable-next-line
//     console.log(`%c ${action.type} `, 'color: #999; background: #333')
//   }
//   : function () {}

const configureStore = () => {
  const initialState = new Immutable.Map()

  const appReducer = combineReducers({
    ...getNestedReducers(ducks),
  })

  const rootReducer = (state, action) => {
    // workaround until fix redux devtool
    // logActions(action)

    if (action.type === SESSION_DESTROY) {
      // const i18nState = state.get('i18n')
      state = new Immutable.Map()
      // state = state.set('i18n', i18nState)
    }

    return appReducer(state, action)
  }

  const composeEnhancers = __DEV__ ? composeWithDevTools({ realtime: true }) : compose
  // const composeEnhancers = composeWithDevTools({ realtime: true })

  // noinspection JSUnresolvedVariable,JSUnresolvedFunction
  const createStoreWithMiddleware = composeEnhancers(
    applyMiddleware(
      thunk,
      // routerMiddleware(historyEngine),
      saveAccountMiddleWare
    )
  )(createStore)

  return createStoreWithMiddleware(
    rootReducer,
    initialState,
  )
}

export const store = configureStore()
// store.dispatch(globalWatcher())

// export const DUCK_I18N = 'i18n'

// syncTranslationWithStore(store) relaced with manual connfiguration in the next 6 lines
// I18n.setTranslationsGetter(() => store.getState().get(DUCK_I18N).translations)
// I18n.setLocaleGetter(() => store.getState().get(DUCK_I18N).locale)

// const locale = ls.getLocale()
// set moment locale
// moment.locale(locale)

// store.dispatch(loadTranslations(require('../i18n/')))

// store.dispatch(setLocale(locale))
/** <<< i18n END */
