import React from 'react'

import { Navigate, useLocation, useParams } from 'react-router-dom'

import { WRAPPED_NATIVE_CURRENCY as WETH } from 'legacy/constants/tokens'

import { SwapWidget } from 'modules/swap/containers/SwapWidget'
import { getDefaultTradeRawState } from 'modules/trade/types/TradeRawState'
import { parameterizeTradeRoute } from 'modules/trade/utils/parameterizeTradeRoute'
import { useWalletInfo } from 'modules/wallet'

import { Routes } from 'constants/routes'

export function SwapPage() {
  const params = useParams()

  if (!params.chainId) {
    return <SwapPageRedirect />
  }

  return <SwapWidget />
}

function SwapPageRedirect() {
  const { chainId } = useWalletInfo()
  const location = useLocation()

  if (!chainId) return null

  const defaultState = getDefaultTradeRawState(chainId)
  const searchParams = new URLSearchParams(location.search)
  const inputCurrencyId = searchParams.get('inputCurrency') || defaultState.inputCurrencyId || WETH[chainId]?.symbol
  const outputCurrencyId = searchParams.get('outputCurrency') || defaultState.outputCurrencyId || undefined

  searchParams.delete('inputCurrency')
  searchParams.delete('outputCurrency')
  searchParams.delete('chain')

  const pathname = parameterizeTradeRoute({ chainId: String(chainId), inputCurrencyId, outputCurrencyId }, Routes.SWAP)

  return <Navigate to={{ ...location, pathname, search: searchParams.toString() }} />
}
