import styled from 'styled-components'

export const Jumbotron = styled.div`
    position: relative;
    font-family: Ubuntu;
    display: flex;
    flex-direction: row;
    width: 100vw;
    height: 80vh;
    background: #F9F8EB;
`

export const JumbotronColumn = styled.div`
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50%;
`

export const MainHeader = styled.h1`
    color: ${({ theme }) => theme.primaryRed};  
    font-family: Ubuntu;
    font-weight: 600;
    font-size: 2.5rem;
    letter-spacing: 1px
`

export const HeaderNavigationLink = styled.div`
    text-decoration: none;
    cursor: pointer;
    color: ${({ theme }) => theme.primaryRed};
    :focus {
        outline: none;
        text-decoration: underline;
    }
    :active {
        text-decoration: none;
    }
`

export const BorderlessInput = styled.input`
    color: ${({ theme }) => theme.textColor};
    font-size: 1rem;
    outline: none;
    border: none;
    flex: 1 1 auto;
    width: 0;
    background-color: ${({ theme }) => theme.inputBackground};
    [type='number'] {
        -moz-appearance: textfield;
    }
    ::-webkit-outer-spin-button,
    ::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    ::placeholder {
        color: ${({ theme }) => theme.chaliceGray};
    }
`

export const Button = styled.button`
    background: ${({ theme }) => (theme.primaryRed)};
    color: ${({ theme }) => (theme.white)};
    font-family: Ubuntu; 
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 7px;
    color: white;
    width: 70%;
    height: 2rem;
    font-size: 0.8rem;
    margin-right: 5%;
    :hover {
        background: ${({ theme }) => theme.secondaryRed};
        cursor: pointer; 
        box-shadow: 0px 7px 7px rgba(0, 0, 0, 0.25);
        border: 1px solid #7c1818;
    }
`