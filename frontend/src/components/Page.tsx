import React from 'react';
import styled from 'styled-components';

import Navbar from './NavBar';

interface PageProps {
  children?: JSX.Element | JSX.Element[];
}

const PageContainer = styled.div`
  background-color: white;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
`;

function Page({ children }: PageProps) {
  return (
    <PageContainer>
      <Navbar />
      {children}
    </PageContainer>
  );
}

export default Page;
