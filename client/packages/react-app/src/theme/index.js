
import React from 'react'
import { ThemeProvider as StyledComponentsThemeProvider, css } from 'styled-components'

export * from './components'

const MEDIA_WIDTHS = {
    upToSmall: 600,
    upToMedium: 960,
    upToLarge: 1280
}

const mediaWidthTemplates = Object.keys(MEDIA_WIDTHS).reduce((accumulator, size) => {
    accumulator[size] = (...args) => css`
        @media (max-width: ${MEDIA_WIDTHS[size]}px) {
        ${css(...args)}
        }
    `
    return accumulator
}, {})

const flexColumnNoWrap = css`
    display: flex;
    flex-flow: column nowrap;
`

const flexRowNoWrap = css`
    display: flex;
    flex-flow: row nowrap;
`

const white = '#FFFFFF'
const black = '#000000'

export default function ThemeProvider({ children }) {
    return <StyledComponentsThemeProvider theme={theme()}>{children}</StyledComponentsThemeProvider>
}

const theme = () => ({
    white,
    black,
    inputBackground: white,
    placeholderGray: '#E1E1E1',
    shadowColor: '#2F80ED',

    // pink
    pink: '#DC6BE5',
    // reds
    primaryRed: '#9b3f3f',
    secondaryRed: '#d38f8f',
    walletStatusOrange: '#F7C28E',

    // blues
    buttonBlue: '#414BB2',

    lightText: "#F9F8EB",

    // media queries
    mediaWidth: mediaWidthTemplates,

    // css snippets
    flexColumnNoWrap,
    flexRowNoWrap
})