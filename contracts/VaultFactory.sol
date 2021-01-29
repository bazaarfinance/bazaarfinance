// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./lib/ProxyFactory.sol";
import "./interface/IBazrToken.sol";

contract VaultFactory is ProxyFactory, AccessControl {

  bytes32 public constant ADMIN = keccak256("ADMIN_ROLE");
  
  uint256 private _nextProjectId;

  address public vaultImplementation;
  address public bTokenImplementation;
  address public aavePool;

  mapping (uint256 => address) public projectIdToBToken;
  mapping (address => address) public bTokenToVault;
  
  event VaultCreated(address indexed vaultAddress, address indexed recipient);
  event BTokenCreated(address indexed bTokenAddress);

    /// @dev Contructor sets the initial implementation contract's address
    /// @param _aavePool address of Aave's LendingPool contract
    /// @param _vaultImplementation The address of the Vault proxy
    /// @param _bTokenImplementation The address of the bToken proxy
    constructor(address _aavePool, address _vaultImplementation, address _bTokenImplementation) public {
      aavePool = _aavePool;
      vaultImplementation = _vaultImplementation;
      bTokenImplementation = _bTokenImplementation;
      // first project added has id 0
      _nextProjectId = 0;
      // set up permissions
      _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
      _setupRole(ADMIN, msg.sender);
    }

    /// @dev Creates Vault for a new project
    /// @param recipient address of the beneficiary
    /// @param salary desired recipient payout for a given time period
    /// @return address of the new Vault
    function createVault(address recipient, address token, uint256 salary, address bToken, address aToken) public returns (address) {

      require(hasRole(ADMIN, msg.sender), "Only callable by admin");

      bytes memory _payload = abi.encodeWithSignature(
          "initialize(address,address,address,uint256,address,address,address)",
          recipient,
          token,
          aavePool,
          salary,
          bToken,
          aToken,
          msg.sender
      );
      
      address vault = deployMinimal(vaultImplementation, _payload);

      bTokenToVault[bToken] = vault;

      IBazrToken _bToken = IBazrToken(bToken);
      _bToken.setVaultAddress(vault);

      emit VaultCreated(vault, recipient);

      return vault;
    }

    /// @dev Creates new bToken contract for a specific project
    /// @param name name of bToken
    /// @param symbol symbol of bToken
    /// @return address of the new bToken
    function createBazrToken(string memory name, string memory symbol) public returns (address) {

      require(hasRole(ADMIN, msg.sender), "Only callable by admin");

      bytes memory _payload = abi.encodeWithSignature(
          "initialize(string,string)",
          name,
          symbol
      );
      
      address bToken = deployMinimal(bTokenImplementation, _payload);

      projectIdToBToken[_nextProjectId] = bToken;
      _nextProjectId++;

      emit BTokenCreated(bToken);

      return bToken;
    }
}