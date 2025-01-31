import { ReactElement, ReactNode, useMemo } from 'react'

import { initializeConnector, Web3ReactHooks, Web3ReactProvider } from '@web3-react/core'
import { Connector } from '@web3-react/types'

import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { render } from '@testing-library/react'
import { en } from 'make-plural/plurals'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components/macro'

import Web3Provider from 'legacy/components/Web3Provider'
import { DEFAULT_LOCALE } from 'legacy/constants/locales'
import store from 'legacy/state'
import { useIsDarkMode } from 'legacy/state/user/hooks'
import { theme } from 'legacy/theme'

import catalog from './locales/en-US'

i18n.load({
  [DEFAULT_LOCALE]: catalog.messages,
})
i18n.loadLocaleData({
  [DEFAULT_LOCALE]: { plurals: en },
})
i18n.activate(DEFAULT_LOCALE)

const MockedI18nProvider = ({ children }: any) => <I18nProvider i18n={i18n}>{children}</I18nProvider>

const MockThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const darkMode = useIsDarkMode()

  const themeObject = useMemo(() => theme(darkMode), [darkMode])

  return <StyledComponentsThemeProvider theme={themeObject}>{children}</StyledComponentsThemeProvider>
}

const WithProviders = ({ children }: { children?: ReactNode }) => {
  return (
    <MockedI18nProvider>
      <Provider store={store}>
        <Web3Provider>
          <MockThemeProvider>{children}</MockThemeProvider>
        </Web3Provider>
      </Provider>
    </MockedI18nProvider>
  )
}

const customRender = (ui: ReactElement) => render(ui, { wrapper: WithProviders })

export * from '@testing-library/react'
export { customRender as render }

class MockedConnector extends Connector {
  activate(): Promise<void> {
    return Promise.resolve()
  }

  getActions() {
    return this.actions
  }
}

export const [mockedConnector, mockedConnectorHooks] = initializeConnector<MockedConnector>(
  (actions) => new MockedConnector(actions)
)

export function WithMockedWeb3({ children }: { children?: ReactNode }) {
  const connectors: [Connector, Web3ReactHooks][] = [[mockedConnector, mockedConnectorHooks]]

  return (
    <HashRouter>
      <Provider store={store}>
        <Web3ReactProvider connectors={connectors}>{children}</Web3ReactProvider>
      </Provider>
    </HashRouter>
  )
}
