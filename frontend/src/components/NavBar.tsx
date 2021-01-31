import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import truncate from 'truncate-middle';

import { CurrentAddressContext, ProviderContext } from 'hardhat/SymfoniContext';

const Container = styled.div`
  background-color: grey;
  position: relative;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  padding: 0 5%;
  max-height: 10vh;
`;
const InnerContainer = styled.div`
  position: relative;
  display: flex;
  height: 70px;
  align-items: center;
  justify-content: space-between;
  .title-container {
    font-size: 40px;
  }
`;
const EthereumDetail = styled.div`
  display: flex;
  width: 25%;
  justify-content: space-between;
  height: 100%;
  align-items: center;
  .address-container {
    display: flex;
    align-items: center;
  }
  .address-string {
    margin-left: 10px;
  }
`;
function NavBar() {
  const [provider, _setProvider] = useContext(ProviderContext);
  const [address, _setAddress] = useContext(CurrentAddressContext);

  const [network, setNetwork] = useState<string>('');

  useEffect(() => {
    const doAsync = async () => {
      if (provider) {
        const network = await provider.getNetwork();
        setNetwork(network.name);
      }
    };
    doAsync();
  });

  return (
    <Container>
      <InnerContainer>
        <div className="title-container">Bazaar Finance</div>
        <EthereumDetail>
          <div>Network: {network.toUpperCase()}</div>
          <div className="address-container">
            <Jazzicon diameter={30} seed={jsNumberForAddress(address)}></Jazzicon>
            <div className="address-string">Address: {truncate(address, 4, 4, '...')}</div>
          </div>
        </EthereumDetail>
      </InnerContainer>
    </Container>
  );
}

export default NavBar;
