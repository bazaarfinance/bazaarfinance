import { useState, useEffect, useMemo } from 'react'
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { getVaultContract, getERC20Contract, getProjects } from '../utils'
import { injected } from '../connectors'

export function useWeb3React() {
    const context = useWeb3ReactCore()
    const contextNetwork = useWeb3ReactCore('NETWORK')
    return context.active ? context : contextNetwork
}

export function useEagerConnect() {
    const { activate, active } = useWeb3ReactCore()

    const [tried, setTried] = useState(false)

    useEffect(() => {
        injected.isAuthorized().then(isAuthorized => {
        if (isAuthorized) {
            activate(injected, undefined, true).catch(() => {
            setTried(true)
            })
        } else {
            setTried(true)
        }
        })
    }, [activate])

    useEffect(() => {
        if (active) {
        setTried(true)
        }
    }, [active])

    return tried
}

export function useInactiveListener(suppress = false) {
    const { active, error, activate } = useWeb3ReactCore()

    useEffect(() => {
        const { ethereum } = window

        if (ethereum && ethereum.on && !active && !error && !suppress) {
        const handleNetworkChanged = () => {
            activate(injected, undefined, true).catch(() => {})
        }

        const handleAccountsChanged = accounts => {
            if (accounts.length > 0) {
            activate(injected, undefined, true).catch(() => {})
            }
        }

        ethereum.on('networkChanged', handleNetworkChanged)
        ethereum.on('accountsChanged', handleAccountsChanged)

        return () => {
            ethereum.removeListener('networkChanged', handleNetworkChanged)
            ethereum.removeListener('accountsChanged', handleAccountsChanged)
        }
    }

    return () => {}
    }, [active, error, suppress, activate])
}

export function useVaultContract(address, withSignerIfPossible = true) {
    const { library, account } = useWeb3React()

    return useMemo(() => {
        try {
        return getVaultContract(address, library, withSignerIfPossible ? account : undefined)
        } catch {
        return null
        }
    }, [address, library, withSignerIfPossible, account])
}

export function useERC20Contract(address, withSignerIfPossible = true) {
    const { library, account } = useWeb3React()

    return useMemo(() => {
        try {
        return getERC20Contract(address, library, withSignerIfPossible ? account : undefined)
        } catch {
        return null
        }
    }, [address, library, withSignerIfPossible, account])
}


export function useProjects(address, withSignerIfPossible = true) {
    const { library, account } = useWeb3React()

    return useMemo(() => {
        try {
            return getProjects(address, library, withSignerIfPossible ? account : undefined)
        } catch {
            return null
        }
    }, [address, library, withSignerIfPossible, account])
}