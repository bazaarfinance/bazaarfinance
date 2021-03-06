import React, { useRef, useState } from 'react'
import { ethers } from 'ethers'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { addresses } from "@project/contracts";

import { useVaultContract, useProjects, useERC20Contract } from '../../hooks'
import { Jumbotron, JumbotronColumn, MainHeader, Button } from '../../theme'

import aaveLogo from '../../assets/img/logo_aave.png'
import aDaiLogo from '../../assets/img/logo_adai.png'
import hardhat from '../../assets/img/hardhat.png'
import ProjectDetailsModal from '../../components/ProjectDetailsModal'


const ProjectTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 1.4rem;
  font-weight: 900;
  align-self: left;
`

const ProjectTitle = styled.h1`
  font-size: 1.4rem;
  font-weight: 900;
  align-self: left;
  margin-bottom: 0;
`

const Icon = styled.img`
  width: 30px;
  height: 30px;
  align-self: right;
  margin: 0.5rem 0 0 0.5rem;
`

const Logo = styled.img`
  width: 50%;
  height: 100%;
  align-self: center;
`

const Info = styled.p`
  font-size: 0.8rem;
  font-weight: 500;
  line-height: 0.7rem;
  margin-top: 5px;
`

const CardRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-bottom: 1rem;
  border: 1px solid black;
  width: 70%;
  height: 40%;
  #projectStatus {
    padding-left: 8%;
  }
`

const CardColumn = styled.div`
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  width: 50%;
  padding: 1rem 1rem 1rem 1rem;
`

export function Projects() {

  const headingRef = useRef(null)

  const { account } = useWeb3React()

  const projects = useProjects(addresses.vaultFactory)
  // console.log(projects)

  const vault = useVaultContract(addresses.vault)
  const dai = useERC20Contract(addresses.dai)
  const aDai = useERC20Contract(addresses.aDai)
  const bToken = useERC20Contract(addresses.bToken)

  const [projectDetailsModalIsOpen, setProjectDetailsModalIsOpen] = useState(false)
  const [selectedProjectSalary, setSelectedProjectSalary] = useState(0)
  const [selectedProjectBTokenBalance, setSelectedProjectBTokenBalance] = useState(0)
  const [selectedProjectRecipientReserve, setSelectedProjectRecipientReserve] = useState(0)
  const [selectedProjectPrincipal, setSelectedProjectPrincipal] = useState(0)
  const [selectedProjectValueLocked, setSelectedProjectValueLocked] = useState(0)
  const [daiAllowance, setDaiAllowance] = useState(0)
  const [daiBalanceDepositor, setDaiBalanceDepositor] = useState(0)
  const [bTokenAllowance, setBTokenAllowance] = useState(0)
  const [selectedProjectDepositorBalance, setSelectedProjectDepositorBalance] = useState(0)
  const [selectedProjectRecipientAddress, setSelectedProjectRecipientAddress] = useState('')
        
  return (
    <>
      <Jumbotron ref={headingRef}>
        <JumbotronColumn>
            <MainHeader>Discover Projects</MainHeader>
        </JumbotronColumn>
        <JumbotronColumn>
        <CardRow>
        <CardColumn>
              <Logo src={hardhat} alt="hardhat"/>
          </CardColumn>
        <CardColumn>
          <ProjectTitleWrapper><ProjectTitle>Hardhat</ProjectTitle>
            <Icon src={aDaiLogo} alt="aDai"/>
            <Icon src={aaveLogo} alt="aave"/>
          </ProjectTitleWrapper>
              <Info>Ethereum development environment for professionals</Info>
              <Button onClick={async () => {
                const salary = await vault.salary();
                const bTokenBalance = await bToken.balanceOf(account);
                const principal = await vault.depositorToPrincipal(account);
                const recipientReserve = await vault.recipientReserve();
                const valueLocked = await aDai.balanceOf(addresses.vault);
                const daiAllowance = await dai.allowance(account, addresses.vault);
                const daiBalanceDepositor = await dai.balanceOf(account);
                const bTokenAllowance = await bToken.allowance(account, addresses.vault);
                const depositorBalance = await vault.totalBalanceOf(account);
                const recipientAddress = await vault.recipient();
                setSelectedProjectSalary(salary);
                setSelectedProjectBTokenBalance(bTokenBalance);
                setSelectedProjectPrincipal(principal);
                setSelectedProjectValueLocked(valueLocked);
                setSelectedProjectRecipientReserve(recipientReserve);
                setSelectedProjectDepositorBalance(depositorBalance);
                setSelectedProjectRecipientAddress(recipientAddress);
                setDaiAllowance(daiAllowance);
                setDaiBalanceDepositor(daiBalanceDepositor);
                setBTokenAllowance(bTokenAllowance);
                setProjectDetailsModalIsOpen(true);
            }}>View</Button>
          </CardColumn>
        </CardRow>
        {projectDetailsModalIsOpen ?
              <ProjectDetailsModal 
              bTokenBalance={ethers.utils.formatEther(selectedProjectBTokenBalance)}
              salary={ethers.utils.formatEther(selectedProjectSalary)}
              recipientReserve={ethers.utils.formatEther(selectedProjectRecipientReserve)}
              principal={ethers.utils.formatEther(selectedProjectPrincipal)}
              valueLocked={ethers.utils.formatEther(selectedProjectValueLocked)}
              depositorBalance={ethers.utils.formatEther(selectedProjectDepositorBalance)}
              isOpen={projectDetailsModalIsOpen}
              daiAllowance={daiAllowance.toString()}
              daiBalanceDepositor={ethers.utils.formatEther(daiBalanceDepositor)}
              bTokenAllowance={bTokenAllowance.toString()}
              recipientAddress={selectedProjectRecipientAddress}
              onDismiss={() => setProjectDetailsModalIsOpen(false)} />
            : null }
        </JumbotronColumn>
      </Jumbotron>
    </>
  )
}