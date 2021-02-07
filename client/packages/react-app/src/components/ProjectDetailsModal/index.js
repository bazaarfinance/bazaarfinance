import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { addresses } from "@project/contracts";
import { MaxUint256 } from '@ethersproject/constants'
import BigNumber from 'bignumber.js'
import { useVaultContract, useERC20Contract } from '../../hooks'
import { BorderlessInput, Button } from '../../theme'
import Modal from '../Modal'
import truncate from 'truncate-middle';
import { ReactComponent as Close } from '../../assets/img/x.svg'

import { Line } from 'rc-progress';


import aaveLogo from '../../assets/img/logo_aave.png'
import aDaiLogo from '../../assets/img/logo_adai.png'
import hardhat from '../../assets/img/hardhat.png'

const GAS_MARGIN = ethers.BigNumber.from(1000)
BigNumber.config({ EXPONENTIAL_AT: 30 })

const ModalHeader = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 0.7rem;
  height: 20px;
  color: black;
`

const InputRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: space-between;
  width: 40%;
  padding: 0.5rem 0.5rem 0.5rem 0.75rem;
  margin-left: 2%;
`

const ButtonsRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: space-between;
  margin: 1% 3% 0 3%;
  padding-bottom: 3%;
`

const Input = styled(BorderlessInput)`
  font-size: 1rem;
  padding: 0.5rem;
  color: ${({ error, theme }) => error && theme.pink};
  background-color: ${({ theme }) => theme.placeholderGray};
  -moz-appearance: textfield;
`

const Icon = styled.img`
  width: 30px;
  height: 30px;
`

const Logo = styled.img`
  width: 50%;
  height: 100%;
  margin-top: 2rem;
  align-self: center;
`

const ProgressBar = styled.div`
  width: 80%;
  height: 21%;
  margin-left: 5%;
`

const DetailsModal = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  width: 100%;
`

const DetailsRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-bottom: 1rem;
  #projectStatus {
    padding-left: 8%;
  }
`

const DetailsColumn = styled.div`
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  width: 50%;
  line-height: 1.2rem;
`

const PoweredByContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 80%;
  margin-top: 1.5rem;
  #poweredBy {
    font-weight: 900;
    font-size: 1rem;
    align-self: right;
    padding-left: 3rem;
  }
`

const Info = styled.p`
  text-align: center;
  font-size: 0.9rem;
  font-weight: 500;
  margin: 5px;
  line-height: 0.7rem;
`

const InfoTitle = styled.p`
  text-align: center;
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1rem;
`

const ProjectTitle = styled.h1`
  font-size: 1.4rem;
  font-weight: 900;
  align-self: left;
`

const CloseIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 14px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const CloseColor = styled(Close)`
  path {
    stroke: ${({ theme }) => theme.black};
  }
`

function calculateGasMargin(value) {
  return value.mul(ethers.BigNumber.from(10000).add(ethers.BigNumber.from(1000))).div(ethers.BigNumber.from(10000))
}

export default function ProjectDetailsModal({
    errorMessage,
    isOpen,
    onDismiss,
    bTokenBalance,
    salary,
    recipientReserve,
    principal,
    valueLocked,
    daiAllowance,
    daiBalanceDepositor,
    bTokenAllowance,
    depositorBalance,
    recipientAddress
    }) {

    const inputRef = useRef()

    const [deposit, setDeposit] = useState('')
    const [daiApproved, setDaiApproved] = useState(false)
    const [bTokenApproved, setBTokenApproved] = useState(false)
    
    const { account } = useWeb3React()

    const vault = useVaultContract(addresses.vault)
    const dai = useERC20Contract(addresses.dai)
    const bToken = useERC20Contract(addresses.bToken)

    function clearInputAndDismiss() {
        setDeposit('')
        onDismiss()
    }

    return (
        <Modal
            isOpen={isOpen}
            onDismiss={clearInputAndDismiss}
            minHeight={60}
            initialFocusRef={inputRef}>
        <DetailsModal>
          <ModalHeader>
          <CloseIcon onClick={clearInputAndDismiss}>
              <CloseColor alt={'close icon'} />
          </CloseIcon>
          </ModalHeader>
          <DetailsRow>
          <DetailsColumn>
              <Logo src={hardhat} alt="hardhat"/>
          </DetailsColumn>
            <DetailsColumn>
              <ProjectTitle>Hardhat</ProjectTitle>
              <p>Ethereum development environment for professionals</p>
              <InfoTitle>Recipient Address:</InfoTitle>
              <Info><a href="https://kovan.etherscan.io/address/{recipientAddress}">{truncate(recipientAddress, 6, 4, '...')}</a></Info>
              <PoweredByContainer><Icon src={aDaiLogo} alt="aDai"/>
                <Info id="poweredBy">Powered by</Info><Icon src={aaveLogo} alt="aave"/>
              </PoweredByContainer>
          </DetailsColumn>
          <DetailsColumn>
            <InfoTitle>Your Balance:</InfoTitle>
            <Info>{depositorBalance}</Info>
            <InfoTitle>Principal:</InfoTitle>
            <Info>{principal}</Info>
            <InfoTitle>Interest Earned:</InfoTitle>
            <Info>{depositorBalance - principal}</Info>
          </DetailsColumn>
          </DetailsRow>
          <DetailsRow>
            <DetailsColumn id="projectStatus">
              <InfoTitle>Total Value Locked (aDAI):</InfoTitle>
              <Info>{valueLocked}</Info>
              <InfoTitle>Monthly Income Goal (DAI):</InfoTitle>
              <Info>{salary}</Info>
              <InfoTitle>Total Raised:</InfoTitle>
              <Info>{recipientReserve}</Info>
            </DetailsColumn>
            <DetailsColumn id="projectStatus">
              <DetailsRow><InfoTitle>Raised/Earned Ratio</InfoTitle></DetailsRow>
                <ProgressBar>
                  <Line percent="50" strokeWidth="5" strokeColor="#F9BBBB" /> 
                </ProgressBar>
              <DetailsRow><InfoTitle>Interest Rate: 10% APY</InfoTitle></DetailsRow>
          </DetailsColumn>
          </DetailsRow>         
          { daiAllowance.toString() !== '0' || daiApproved ? <InputRow>
          <DetailsRow>
            <DetailsColumn id="daiBalanceDepositor">
              <InfoTitle>Dai Available to Deposit:</InfoTitle>
              <Info>{daiBalanceDepositor}</Info>
            </DetailsColumn>
          </DetailsRow>           
            <Input
              ref={inputRef}
              type="number"
              min="0"
              error={!!errorMessage}
              placeholder={'Enter deposit amount'}
              step="1"
              onChange={e => setDeposit(e.target.value)}
              onKeyPress={e => {
                const charCode = e.which ? e.which : e.keyCode

                // Prevent 'minus' character
                if (charCode === 45) {
                  e.preventDefault()
                  e.stopPropagation()
                }
              }}
              value={deposit}
            />
          </InputRow> : null}
          <ButtonsRow>
            <Button onClick={async () => {
            const allowance = await dai.allowance(account, addresses.vault);
            try {
              if (allowance.toString() !== '0' || daiApproved) {
                  const depositAmount = ethers.utils.parseEther(deposit)
                  let estimatedGas = await vault.estimateGas.deposit(depositAmount)
                  let depositTx = await vault.deposit(depositAmount, {
                  gasLimit: calculateGasMargin(estimatedGas, GAS_MARGIN)
                  })
                  console.log(depositTx)
                  clearInputAndDismiss()
              } else {
                  let estimatedGas = await dai.estimateGas.approve(addresses.vault, MaxUint256)
                  let approveDaiTx = await dai.approve(addresses.vault, MaxUint256, {
                      gasLimit: calculateGasMargin(estimatedGas, GAS_MARGIN)
                  });
                  console.log(approveDaiTx)
                  setDaiApproved(true)
                  clearInputAndDismiss()
              }
            } catch (err) {
              console.log(err)
            }
          }}>{daiAllowance.toString() !== '0' || daiApproved ? 'Deposit' : 'Approve Token'}</Button>
          { bTokenBalance > 0 ? <Button onClick={async () => {
            try {
              if (bTokenAllowance.toString() !== '0' || bTokenApproved) {
                let estimatedGas = await vault.estimateGas.withdraw()
                let withdrawTx = await vault.withdraw({
                gasLimit: calculateGasMargin(estimatedGas, GAS_MARGIN)
                })
                console.log(withdrawTx)
                clearInputAndDismiss()
              } else {
                let estimatedGas = await bToken.estimateGas.approve(addresses.vault, MaxUint256);
                let approveTx = await bToken.approve(addresses.vault, MaxUint256, {
                gasLimit: calculateGasMargin(estimatedGas, GAS_MARGIN)
                })
                console.log(approveTx)
                setBTokenApproved(true)
                clearInputAndDismiss()
              }
            } catch (err) {
                console.log(err)
            }
          }}>{bTokenAllowance.toString() !== '0' || bTokenApproved ? 'Withdraw All' : 'Approve bToken'}</Button> : null }
        </ButtonsRow>
      </DetailsModal>
    </Modal>
    )
}