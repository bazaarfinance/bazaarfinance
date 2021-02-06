import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { Jumbotron, JumbotronColumn, MainHeader } from '../../theme'

const StyledLink = styled(Link)`
  background: ${({ theme }) => theme.primaryRed}; 
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Ubuntu; 
  text-decoration: none;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 7px;
  color: white;
  width: 40%;
  height: 10%;
  font-size: 1.2rem;
`

export function Home() {
  return (
    <>
      <Jumbotron>
        <JumbotronColumn>
          <MainHeader>Bazaar Finance</MainHeader>
        </JumbotronColumn>
        <JumbotronColumn>
          <StyledLink to={"/projects"}>Discover Projects</StyledLink>
        </JumbotronColumn>
      </Jumbotron>
    </>
  )
}