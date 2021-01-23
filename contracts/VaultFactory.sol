// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

import "./lib/ProxyFactory.sol";

contract VaultFactory is ProxyFactory {

  address public vaultImplementation;
  address public bTokenImplementation;
  address public dai;
  address public aDai;

    /// @dev Contructor sets the initial implementation contract's address
    /// @param _dai address of the DAI stablecoin contract
    /// @param _aDai address of the aDai interest-accruing token contract
    /// @param _vaultImplementation The address of the Vault proxy
    /// @param _bTokenImplementation The address of the bToken proxy
    constructor(address _dai, address _aDai, address _vaultImplementation, address _bTokenImplementation) public {
      dai = _dai;
      aDai = _aDai;
      vaultImplementation = _vaultImplementation;
      bTokenImplementation = _bTokenImplementation;
    }

    /// @dev Creates Vault for a new project
    /// @param recipient address of the beneficiary
    /// @param goalAmount desired recipient payout for a given time period
    /// @return address of the new Vault
    function createVault(address recipient, uint256 goalAmount) public returns (address) {

      /// TODO: Make this function permissioned

      bytes memory _payload = abi.encodeWithSignature(
          "initialize(address,address,address,uint256,address)",
          dai,
          aDai,
          recipient,
          goalAmount,
          msg.sender
      );
      
      address vault = deployMinimal(vaultImplementation, _payload);

      return vault;
    }

    /// @dev Creates new bToken contract for a specific project
    /// @param name name of bToken
    /// @param symbol symbol of bToken
    /// @return address of the new bToken
    function createBazrToken(string memory name, string memory symbol) public returns (address) {

      /// TODO: Make this function permissioned

      bytes memory _payload = abi.encodeWithSignature(
          "initialize(string,string)",
          name,
          symbol
      );
      
      address bToken = deployMinimal(bTokenImplementation, _payload);

      return bToken;
    }
}