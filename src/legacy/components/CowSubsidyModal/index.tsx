import { useCallback } from 'react'

import { CurrencyAmount, Currency } from '@uniswap/sdk-core'

import { Text } from 'rebass'

import { AutoColumn } from 'legacy/components/Column'
import { ExternalLink } from 'legacy/components/Link'
import Row from 'legacy/components/Row'
import { ConfirmationModalProps } from 'legacy/components/TransactionConfirmationModal'
import {
  LegacyConfirmationModalContent,
  ConfirmationModalContentProps,
} from 'legacy/components/TransactionConfirmationModal/LegacyConfirmationModalContent'
import useCowBalanceAndSubsidy from 'legacy/hooks/useCowBalanceAndSubsidy'

import { useWalletInfo } from 'modules/wallet'

import { GpModal } from 'common/pure/Modal'

import { SUBSIDY_INFO_MESSAGE } from './constants'
import SubsidyTable from './SubsidyTable'

import CowBalance from '../CowBalance'

export type CowSubsidy = { tier: number; discount: number }
export interface CowSubsidyInfoProps {
  account?: string
  balance?: CurrencyAmount<Currency>
  subsidy: CowSubsidy
}

const CowSubsidyInfo = ({ account, balance, subsidy }: CowSubsidyInfoProps) => (
  <AutoColumn style={{ marginTop: 32 }} gap="18px" justify="center">
    <Text fontWeight={400} fontSize={15} style={{ textAlign: 'center', width: '100%', wordBreak: 'break-word' }}>
      {SUBSIDY_INFO_MESSAGE}
    </Text>
    {/* VCOW LOGO */}
    {account && <CowBalance account={account} balance={balance} />}
    <SubsidyTable {...subsidy} />
  </AutoColumn>
)

export default function CowSubsidyModal({
  isOpen,
  onDismiss,
  ...restProps
}: Pick<ConfirmationModalProps, 'isOpen'> & Omit<ConfirmationModalContentProps, 'title' | 'topContent'>) {
  const { account, chainId } = useWalletInfo()

  const { subsidy, balance } = useCowBalanceAndSubsidy()

  const TopContent = useCallback(
    () => <CowSubsidyInfo account={account ?? undefined} balance={balance} subsidy={subsidy} />,
    [account, balance, subsidy]
  )

  const BottomContent = useCallback(
    () => (
      <Row style={{ justifyContent: 'center' }}>
        <ExternalLink href="https://medium.com/@cow-protocol/cow-token-is-moving-forward-at-full-speed-d9f047a23b57">
          Read more about the tokenomics
        </ExternalLink>
      </Row>
    ),
    []
  )

  if (!chainId) return null

  // TODO: use TradeConfirmModal
  return (
    <GpModal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90} maxWidth={500} padding={'12px 0 18px'}>
      <LegacyConfirmationModalContent
        {...restProps}
        title="CoWmunity fees discount"
        titleSize={21}
        styles={{ textAlign: 'center', width: '100%' }}
        onDismiss={onDismiss}
        topContent={TopContent}
        bottomContent={BottomContent}
      />
    </GpModal>
  )
}
