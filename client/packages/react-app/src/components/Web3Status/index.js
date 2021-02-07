import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import truncate from 'truncate-middle';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { Activity } from 'react-feather'
import { injected } from '../../connectors'
import { useEagerConnect, useInactiveListener } from '../../hooks'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

const Web3StatusGeneric = styled.button`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  font-size: 0.3rem;
  align-items: center;
  padding: 0.5rem;
  border-radius: 1.2rem;
  box-sizing: border-box;
  cursor: pointer;
  user-select: none;
  :focus {
    outline: none;
  }
`
const Web3StatusError = styled(Web3StatusGeneric)`
  background-color: ${({ theme }) => theme.secondaryRed};
  color: ${({ theme }) => theme.black};
  font-weight: 500;
  :hover,
  :focus {
    background-color: ${({ theme }) => theme.walletStatusOrange};
  }
`

const Web3StatusConnect = styled(Web3StatusGeneric)`
  background-color: ${({ theme }) => theme.walletStatusOrange};
  color: ${({ theme }) => theme.black};
  font-weight: 500;
  :hover,
  :focus {
    background-color: ${({ theme }) => theme.secondaryRed};
  }
`

const Web3StatusConnected = styled(Web3StatusGeneric)`
  background-color: ${({ theme }) => theme.walletStatusOrange};
  color: ${({ theme }) => theme.black};
  font-weight: 500;
  :hover {
    background-color: ${({ theme }) => theme.secondaryRed};
  }
  :focus {
    border: 1px solid
    ${({ theme }) => theme.primaryRed};
  }
`

const Text = styled.p`
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0.5rem 0 0.25rem;
  font-size: 1rem;
  font-weight: 700;
  font-family: Open Sans;
  color: ${({ theme }) => theme.lightText};
`

const NetworkIcon = styled(Activity)`
  margin-left: 0.25rem;
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
`

export default function Web3Status() {
  const context = useWeb3React();
  const {
    connector,
    account,
    error,
    activate,
    active
  } = context;
  const contextNetwork = useWeb3React('NETWORK')

  const [activatingConnector, setActivatingConnector] = useState({});
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager || !!activatingConnector);

  function getStatusIcon() {
    if (connector === injected) {
      return <Jazzicon diameter={30} seed={jsNumberForAddress(account)}></Jazzicon>
    }
  }

  function getWeb3Status() {
    if (account) {
      return (
        <Web3StatusConnected>
          <Text>{truncate(account, 4, 4, '...')}</Text>
          {getStatusIcon()}
        </Web3StatusConnected>
      )
    } else if (error) {
      return (
        <Web3StatusError onClick={() => {
          setActivatingConnector(injected)
          activate(injected) }}>
          <NetworkIcon />
          <Text>{error instanceof UnsupportedChainIdError ? 'Wrong Network: Please switch to Kovan' : 'Error'}</Text>
        </Web3StatusError>
      )
    } else {
      return (
        <Web3StatusConnect onClick={() => {
          setActivatingConnector(injected)
          activate(injected) }}>
          <Text>{'Connect Wallet'}</Text>
        </Web3StatusConnect>
      )
    }
  }

  if (!contextNetwork.active && !active) {
    return null
  }

  return (
    <>
      {getWeb3Status()}
    </>
  )
}