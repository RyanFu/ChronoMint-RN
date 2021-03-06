import moment from 'moment'
import { setLocale } from 'platform/i18n'
import ls from 'utils/LocalStorage'
import ipfs from 'utils/IPFS'
import userMonitorService from 'user/monitorService'
import { modalsOpen } from 'redux/modals/actions'
import ConfirmTxDialog from 'components/dialogs/ConfirmTxDialog/ConfirmTxDialog'
import UserActiveDialog from 'components/dialogs/UserActiveDialog/UserActiveDialog'
import { DUCK_WATCHER, WATCHER_TX_SET } from 'redux/watcher/actions'

export const removeWatchersUserMonitor = () => () => {
  userMonitorService
    .removeAllListeners('active')
    .stop()
}

export const watchInitUserMonitor = () => (dispatch) => {
  userMonitorService
    .on('active', () => dispatch(modalsOpen({ component: UserActiveDialog })))
    .start()
}

export const showConfirmTxModal = (estimateGas, localFeeMultiplier) => (dispatch, getState) => new Promise((resolve) => {
  dispatch(modalsOpen({
    component: ConfirmTxDialog,
    props: {
      callback: (isConfirmed, tx) => resolve({ isConfirmed, updatedTx: tx }),
      localFeeMultiplier,
      handleEstimateGas: async (func, args, value, gasPriceMultiplier = 1) => {
        if (!estimateGas) {
          return
        }
        const { gasFee, gasLimit } = await estimateGas(func, args, value)
        let tx = getState().get(DUCK_WATCHER).confirmTx
        tx = tx.setGas(gasFee.mul(gasPriceMultiplier)).gasLimit(gasLimit)
        dispatch({ type: WATCHER_TX_SET, tx })
      },
    },
  }))
}).catch((e) => {
  // eslint-disable-next-line
  console.error('Confirm modal error:', e)
  return { isConfirmed: false }
})

export const changeMomentLocale = (locale, dispatch) => {
  moment.locale(locale)
  ls.setLocale(locale)
  dispatch(setLocale(locale))
}

export const download = (hash, name) => async () => {
  // do nt limit a time to download
  const data = await ipfs.get(hash, 100000)
  const ref = document.createElement('a')
  ref.href = data.content
  if (name) {
    ref.download = name
  }
  document.body.appendChild(ref)
  ref.click()
  document.body.removeChild(ref)
}
