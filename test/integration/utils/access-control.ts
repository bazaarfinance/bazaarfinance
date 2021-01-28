
// how to get access roles:
//   const tokenFactory = await hre.ethers.getContractFactory("BazrToken");
//   const btokenDepoymentTx = await tokenFactory.deploy();
//   const btoken = await btokenDepoymentTx.deployed();
//
//   const defaultAdminRole = await btoken.DEFAULT_ADMIN_ROLE();
//   const minterRole = await btoken.MINTER_ROLE();
//   const pauserRole = await btoken.PAUSER_ROLE();
//
// lots of awaits though, so just hard-coding them here, so they don't need to be fetched

enum RoleTypes {
    DEFAULT_ADMIN_ROLE,
    MINTER_ROLE,
    PAUSER_ROLE
  };
  
type RoleMappings = {
    [key in keyof typeof RoleTypes]: string;
}

export const Roles: RoleMappings = {
    DEFAULT_ADMIN_ROLE: "0x0000000000000000000000000000000000000000000000000000000000000000",
    MINTER_ROLE: "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
    PAUSER_ROLE: "0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a"
};