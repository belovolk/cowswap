import { Currency, CurrencyAmount, Price } from '@uniswap/sdk-core'

import { Nullish } from 'types'

import { isFractionFalsy } from 'utils/isFractionFalsy'

export function buildPriceFromCurrencyAmounts(
  inputCurrencyAmount: CurrencyAmount<Currency>,
  outputCurrencyAmount: CurrencyAmount<Currency>
): Price<Currency, Currency>
export function buildPriceFromCurrencyAmounts(
  inputCurrencyAmount: Nullish<CurrencyAmount<Currency>>,
  outputCurrencyAmount: Nullish<CurrencyAmount<Currency>>
): Price<Currency, Currency> | null
export function buildPriceFromCurrencyAmounts(
  inputCurrencyAmount: Nullish<CurrencyAmount<Currency>>,
  outputCurrencyAmount: Nullish<CurrencyAmount<Currency>>
): Price<Currency, Currency> | null {
  if (
    !inputCurrencyAmount ||
    !outputCurrencyAmount ||
    isFractionFalsy(inputCurrencyAmount) ||
    isFractionFalsy(outputCurrencyAmount)
  ) {
    return null
  }

  return new Price({ baseAmount: inputCurrencyAmount, quoteAmount: outputCurrencyAmount })
}
