import { useCallback, useEffect } from 'react'

import useParseReferralQueryParam from 'legacy/hooks/useParseReferralQueryParam'
import { dismissNotification, updateReferralAddress } from 'legacy/state/affiliate/actions'
import { useReferralAddress } from 'legacy/state/affiliate/hooks'
import { useAppDispatch } from 'legacy/state/hooks'

import { AffiliateState } from './reducer'

export function ReferralLinkUpdater() {
  const dispatch = useAppDispatch()
  const referralAddressParam = useParseReferralQueryParam()
  const referralAddress = useReferralAddress()

  useEffect(() => {
    if (!referralAddressParam && !referralAddress?.isValid) {
      dispatch(updateReferralAddress(null))
    } else if (referralAddressParam) {
      dispatch(updateReferralAddress(referralAddressParam))
    }
  }, [referralAddressParam, referralAddress?.isValid, dispatch])

  return null
}

const AFFILIATE_LS_KEY = 'redux_localstorage_simple_affiliate'

// This handles cross tab state sync so the Affiliate banner is shown/hidden
export function StorageUpdater() {
  const dispatch = useAppDispatch()

  const handler = useCallback(
    (e: StorageEvent) => {
      if (e.key === AFFILIATE_LS_KEY && e.newValue) {
        const parsed = JSON.parse(e.newValue) as AffiliateState
        for (const id in parsed.isNotificationClosed) {
          dispatch(dismissNotification(id))
        }

        if (parsed.referralAddress) {
          dispatch(updateReferralAddress(parsed.referralAddress))
        }
      }
    },
    [dispatch]
  )

  useEffect(() => {
    window.addEventListener('storage', handler)

    return () => window.removeEventListener('storage', handler)
  }, [handler])

  return null
}

export default function AffiliateUpdaters() {
  return (
    <>
      <ReferralLinkUpdater />
      <StorageUpdater />
    </>
  )
}
