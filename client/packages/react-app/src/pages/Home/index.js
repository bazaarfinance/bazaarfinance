import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import bazaar from '../../assets/img/bazaar.png'

import { Jumbotron, JumbotronColumn, MainHeader } from '../../theme'

const StyledLink = styled(Link)`
  background: ${({ theme }) => theme.buttonBlue}; 
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Open Sans; 
  font-weight: 600;
  letter-spacing: 0.8px;
  text-decoration: none;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 7px;
  color: white;
  width: 100%;
  height: 100%;
  font-size: 0.9em;
  margin-left: 1rem;
  margin-right: 1rem;
`

const ButtonsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 50%;
  height: 7%;
  margin-top: 1.5rem;
`

const Image = styled.img`
  width: 35vw;
  height: 50vh;
`

const OneLiner = styled.span`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.primaryGreen};
  margin-bottom: 1rem;
`

export function Home() {
  return (
    <>
      <Jumbotron>
        <JumbotronColumn>
          <MainHeader>Bazaar.Finance</MainHeader>
          <OneLiner>Scalable Continuous Financing for Open Source Projects via Altruistic Yield stable coins</OneLiner>
          <OneLiner>Allocate a fixed portion of monthly interest on your savings, earn on the rest</OneLiner>
          <ButtonsRow>
            <StyledLink to={"/projects"}>Enter App</StyledLink>
            <StyledLink to={"/projects"}>Read More</StyledLink>
          </ButtonsRow>
        </JumbotronColumn>
        <JumbotronColumn>
          <Image src={bazaar} alt="bazaar"></Image>
        </JumbotronColumn>
      </Jumbotron>
    </>
  )
}