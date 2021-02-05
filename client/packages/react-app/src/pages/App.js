import React, { Suspense } from "react";
import { BrowserRouter, Route } from 'react-router-dom'
import styled from 'styled-components'

import { Home } from './Home'
import { Projects } from './Projects'

import Header from "../components/Header";
import Footer from '../components/Footer';
import Web3ReactManager from '../components/Web3ReactManager'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  height: 100vh;
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
`
const FooterWrapper = styled.div`
  width: 100%;
  min-height: 30px;
  align-self: flex-end;
`

function App() {

  return (
    <>
      <Suspense fallback={null}>
        <AppWrapper>
        <BrowserRouter>
            <HeaderWrapper>
              <Header/>
            </HeaderWrapper>
            <BodyWrapper>
              <Web3ReactManager>
              <Suspense fallback={null}>
                <Route exact path="/" component={Home} />
                <Route path={"/home"} component={Home} />
                <Route path={"/projects"} component={Projects} />
              </Suspense>
            </Web3ReactManager>
            </BodyWrapper>
            <FooterWrapper>
              <Footer />
            </FooterWrapper>
            </BrowserRouter>
        </AppWrapper>
      </Suspense>
    </>
  );
}

export default App;
