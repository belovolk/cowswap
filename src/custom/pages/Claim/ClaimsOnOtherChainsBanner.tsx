import { useMemo, Fragment } from 'react'
import styled from 'styled-components/macro'
import { NETWORK_LABELS, SupportedChainId } from 'constants/chains'
import { useClaimState } from 'state/claim/hooks'
import useChangeNetworks from 'hooks/useChangeNetworks'
import { useActiveWeb3React } from 'hooks/web3'
import NotificationBanner from '@src/custom/components/NotificationBanner'
import { AlertTriangle } from 'react-feather'

const ChainSpan = styled.span``
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  flex-flow: row wrap;

  > svg {
    margin-right: 5px;
  }

  > div {
    flex: 1 1 auto;

    &:last-child {
      > span {
        margin-left: 4px;
        font-weight: 600;
        white-space: nowrap;
        cursor: pointer;
        text-decoration: underline;

        &:last-child {
          &:after {
            content: '!';
          }
        }

        &:not(:last-child) {
          &:after {
            content: ',';
          }
        }
      }
    }
  }
`

function ClaimsOnOtherChainsBanner({ className }: { className?: string }) {
  const { account, library, chainId } = useActiveWeb3React()
  const { callback } = useChangeNetworks({ account, library, chainId })

  const { hasClaimsOnOtherChains } = useClaimState()
  const chainsWithClaims: SupportedChainId[] = useMemo(
    () =>
      Object.keys(hasClaimsOnOtherChains).reduce((acc, chain) => {
        const checkedChain = chain as unknown as SupportedChainId
        const chainHasClaim = hasClaimsOnOtherChains[checkedChain]
        if (!chainHasClaim || checkedChain == chainId) return acc

        acc.push(checkedChain)
        return acc
      }, [] as SupportedChainId[]),
    [chainId, hasClaimsOnOtherChains]
  )

  if (chainsWithClaims.length === 0) {
    return null
  }

  return (
    <NotificationBanner className={className} isVisible id={account ?? undefined} level="info">
      <Wrapper>
        <AlertTriangle />
        <div>This account has available claims on</div>
        <div>
          {chainsWithClaims.map((chainId, index, array) => {
            const changeNetworksCallback = () => callback(chainId)
            const isLastInMultiple = index === array.length - 1 && array.length > 1
            return (
              <Fragment key={chainId}>
                {isLastInMultiple && ' and'}
                <ChainSpan onClick={changeNetworksCallback}>{NETWORK_LABELS[chainId]}</ChainSpan>
              </Fragment>
            )
          })}
        </div>
      </Wrapper>
    </NotificationBanner>
  )
}

export default styled(ClaimsOnOtherChainsBanner)``
