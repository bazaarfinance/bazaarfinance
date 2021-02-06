import React from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Link, withRouter } from 'react-router-dom'
import { darken } from 'polished'
import { HeaderNavigationLink } from '../../theme'

const StyledLink = styled(Link)`
    display: flex;
    align-items: center;
    font-family: Open Sans;
    text-decoration: none;
    font-size: 1rem;
    :hover {
        cursor: pointer;
    }
    #navigation {
        display: inline;
        text-decoration: none;
        font-size: 1rem;
        margin-right: 15px;
        font-weight: 500;
        color: ${({ theme }) => theme.primaryRed};
        :hover {
        color: ${({ theme }) => darken(0.2, theme.primaryRed)};
        }
    }
`

function HeaderNavigation() {

    const { library } = useWeb3React()
    
    return (
        <>
            <HeaderNavigationLink>
            <StyledLink to={"/home"} id="navigation">Home</StyledLink>
            </HeaderNavigationLink>
            {library ? 
            <HeaderNavigationLink>
                <StyledLink to={"/projects"} id="navigation">Projects</StyledLink>
            </HeaderNavigationLink>
            : null}
        </>
    )
}

export default withRouter(HeaderNavigation)