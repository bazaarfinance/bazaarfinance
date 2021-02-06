import React, { useState, useRef } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { addresses } from "@project/contracts";
import { MaxUint256 } from '@ethersproject/constants'
import { useVaultContract, useERC20Contract } from '../../hooks'
import { BorderlessInput, Button } from '../../theme'
import Modal from '../Modal'
import { ReactComponent as Close } from '../../assets/img/x.svg'

const GAS_MARGIN = ethers.BigNumber.from(1000)
BigNumber.config({ EXPONENTIAL_AT: 30 })

const ModalHeader = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px 0px 0px 1rem;
  height: 60px;
  background: ${({ theme }) => theme.secondaryRed};
  color: white};
`

const InputRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: space-between;
  padding: 0.25rem 0.85rem 0.75rem;
  margin: 2% 3% 0 3%;
`

const Input = styled(BorderlessInput)`
  font-size: 1rem;
  padding: 0.2rem;
  color: ${({ error, theme }) => error && theme.pink};
  background-color: ${({ theme }) => theme.chaliceGray};
  -moz-appearance: textfield;
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
const DetailsModal = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  width: 100%;
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
    recipient,
    salary,
    startedSurplus,
    principal
    }) {

    const inputRef = useRef()

    const [deposit, setDeposit] = useState('')
    
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
                Bazaar Finance
            <CloseIcon onClick={clearInputAndDismiss}>
                <CloseColor alt={'close icon'} />
            </CloseIcon>
            </ModalHeader>
          <p>Recipient: {recipient}</p>
          <p>Salary: {salary.toString()}</p>
          <p>Principal: {principal.toString()}</p>
          <p>Started Surplus? {startedSurplus ? "Yes!" : "No"}</p>
          <InputRow>
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
          </InputRow>
          <InputRow>
            <Button onClick={async () => {
            const allowance = await dai.allowance(account, addresses.vault);
            const depositAmount = ethers.BigNumber.from(deposit)
            try {
              if (allowance.toString() !== '0') {
                  let estimatedGas = await vault.estimateGas.deposit(depositAmount)
                  let depositTx = await vault.deposit(depositAmount, {
                  gasLimit: calculateGasMargin(estimatedGas, GAS_MARGIN)
                  })
                  console.log(depositTx)
              } else {
                  let estimatedGas = await dai.estimateGas.approve(addresses.vault, depositAmount)
                  let approveDaiTx = await dai.approve(addresses.vault, depositAmount, {
                      gasLimit: calculateGasMargin(estimatedGas, GAS_MARGIN)
                  });
                  console.log(approveDaiTx)
              }
            } catch (err) {
              console.log(err)
            }
          }}>Deposit</Button>
          <Button onClick={async () => {
            const allowance = await bToken.allowance(account, addresses.vault);
            try {
              if (allowance.toString() !== '0') {
                let estimatedGas = await vault.estimateGas.withdraw()
                let withdrawTx = await vault.withdraw({
                gasLimit: calculateGasMargin(estimatedGas, GAS_MARGIN)
                })
                console.log(withdrawTx)
              } else {
                let estimatedGas = await bToken.estimateGas.approve(addresses.vault, MaxUint256);
                let approveTx = await bToken.approve(addresses.vault, MaxUint256, {
                gasLimit: calculateGasMargin(estimatedGas, GAS_MARGIN)
                })
                console.log(approveTx)
              }
            } catch (err) {
                console.log(err)
            }
          }}>Withdraw</Button>
        </InputRow>
      </DetailsModal>
    </Modal>
    )
}