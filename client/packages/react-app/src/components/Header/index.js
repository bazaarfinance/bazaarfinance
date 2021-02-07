import React from 'react'
import styled from 'styled-components'
import HeaderNavigation from '../HeaderNavigation'
import Web3Status from '../Web3Status'

const HeaderFrame = styled.div`
  display: flex;
  width: 100vw;
  height: 10vh;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(180deg, #9b3f3f 0%, rgba(255, 255, 255, 0) 100%), #d38f8f;
`

const HeaderElement = styled.div`
  margin: 1.25rem;
  display: flex;
  min-width: 0;
  display: flex;
  align-items: center;
`

const ExternalLink = styled.a.attrs({
    target: '_blank',
    rel: 'noopener noreferrer'
  })`
    text-decoration: none;
    cursor: pointer;
    color: #7c1818;
    padding-left: 10px;
    :focus {
      outline: none;
      text-decoration: underline;
    }
    :active {
      text-decoration: none;
    }
    :hover {
      color: ${({ theme }) => theme.secondaryRed};
    }
  `

const Rotate = styled.span`
  transform: rotate(0deg);
  transition: transform 1s ease-out;
  :hover {
    transform: rotate(360deg);
  }
`

const Title = styled.div`
  display: flex;
  align-items: center;
  :hover {
    cursor: pointer;
  }
  #link {
    text-decoration-color: ${({ theme }) => theme.primaryRed};
  }
  #title {
    display: inline;
    font-size: 1rem;
    font-weight: 600;
    margin-right: 25px;
    font-family: Open Sans;
    color: ${({ theme }) => theme.lightText};
  }
  #navigation {
    display: inline;
    font-size: 1rem;
    font-weight: 500;
    margin-right: 15px;
    color: ${({ theme }) => theme.lightText};
    :hover {
      color: ${({ theme }) => theme.secondaryRed};
    }
  }

`

export default function Header() {  
  return (
    <HeaderFrame>
      <HeaderElement>
        <Title>
          <Rotate>
            <ExternalLink id="link" href="https://github.com/bazaarfinance/bazaarfinance">
              <span role="img" aria-label="alpaca">
                🦙 {'  '}
              </span>
            </ExternalLink>
          </Rotate>
          <ExternalLink id="link" href="https://github.com/bazaarfinance/bazaarfinance">
            <h1 id="title">Bazaar Finance</h1>
          </ExternalLink>
          <HeaderNavigation />
        </Title>
      </HeaderElement>
      <HeaderElement>
        <Web3Status />
      </HeaderElement>
    </HeaderFrame>
  )
}