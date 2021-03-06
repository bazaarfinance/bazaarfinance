
import React from 'react'
import styled from 'styled-components'
import { ImTwitter, ImGithub} from 'react-icons/im';


const FooterFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100vw;
  height: 10vh;
  background: ${({ theme }) => theme.headerFooterRed};
`

const IconTwitter = styled(ImTwitter)`
  margin-left: 0.5rem;
`

const IconGithub = styled(ImGithub)`
  margin-left: 0.5rem;
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
  `

const FooterElement = styled.div`
  margin: 1.25rem;
  display: flex;
  justify-content: space-between;
  min-width: 0;
  display: flex;
  align-items: center;
`

const Title = styled.div`
  display: flex;
  flex-direction: row;
  font-family: Open Sans;
  justify-content: space-between;
  color: ${({ theme }) => theme.lightText};
  :hover {
    cursor: pointer;
  }
  #link {
    text-decoration-color: ${({ theme }) => theme.lightText};
  }
  #title {
    display: inline;
    font-size: 0.9rem;
    font-weight: 400;
    margin-right: 12px;
    color: ${({ theme }) => theme.lightText};
    :hover {
      color: ${({ theme }) => theme.secondaryRed};
    }
  }
`

export default function Footer() {

  return (
    <FooterFrame>
      <FooterElement>
        <Title>
          <ExternalLink id="link" href="https://github.com/bazaarfinance/bazaarfinance/blob/master/README.md">
            <h1 id="title">About</h1>
          </ExternalLink>
          <ExternalLink id="link" href="https://github.com/bazaarfinance/bazaarfinance">
            <h1 id="title">Code <IconGithub/> </h1>
          </ExternalLink>
          <ExternalLink id="link" href="https://twitter.com">
            <h1 id="title">Twitter <IconTwitter/></h1>
          </ExternalLink>
        </Title>
      </FooterElement>
      <FooterElement>
        <Title>
          <ExternalLink id="link" href="https://mm.ethglobal.co/">
            <h1 id="title"><span role="img" aria-label="heart">Made with ❤️ at MarketMake Hackathon</span></h1>
          </ExternalLink>
        </Title>
        </FooterElement>
    </FooterFrame>
  )

}
