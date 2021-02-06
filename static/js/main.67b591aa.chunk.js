(this["webpackJsonp@project/react-app"]=this["webpackJsonp@project/react-app"]||[]).push([[0],{110:function(e){e.exports=JSON.parse('[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]')},111:function(e){e.exports=JSON.parse('[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"depositor","type":"address"},{"indexed":true,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"DepositorWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"depositor","type":"address"},{"indexed":true,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"NewDeposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"RecipientWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"aToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"aavePool","outputs":[{"internalType":"contract ILendingPool","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"bToken","outputs":[{"internalType":"contract IBazrToken","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_principal","type":"uint256"},{"internalType":"uint256","name":"_surplus","type":"uint256"},{"internalType":"uint256","name":"_tokenSupply","type":"uint256"},{"internalType":"uint256","name":"btokens","type":"uint256"}],"name":"btokenToToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"depositorReserve","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"depositorToPrincipal","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"contract IVaultFactory","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_recipient","type":"address"},{"internalType":"address","name":"_token","type":"address"},{"internalType":"address","name":"_aavePool","type":"address"},{"internalType":"uint256","name":"_salary","type":"uint256"},{"internalType":"address","name":"_bToken","type":"address"},{"internalType":"address","name":"_aToken","type":"address"},{"internalType":"address","name":"_owner","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"interestEarnedAtLastCheckpoint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"manualTransition","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"nextCheckpoint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"principal","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"recipient","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"recipientReserve","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"recipientWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"salary","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"startedSurplus","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_principal","type":"uint256"},{"internalType":"uint256","name":"_surplus","type":"uint256"},{"internalType":"uint256","name":"_tokenSupply","type":"uint256"},{"internalType":"uint256","name":"token","type":"uint256"}],"name":"tokenToBtoken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"totalBalanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]')},112:function(e){e.exports=JSON.parse('[{"inputs":[{"internalType":"address","name":"_aavePool","type":"address"},{"internalType":"address","name":"_vaultImplementation","type":"address"},{"internalType":"address","name":"_bTokenImplementation","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"bTokenAddress","type":"address"}],"name":"BTokenCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"proxy","type":"address"}],"name":"ProxyCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"vaultAddress","type":"address"},{"indexed":true,"internalType":"address","name":"recipient","type":"address"}],"name":"VaultCreated","type":"event"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"aavePool","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"bTokenImplementation","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"bTokenToVault","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"}],"name":"createBazrToken","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"salary","type":"uint256"},{"internalType":"address","name":"bToken","type":"address"},{"internalType":"address","name":"aToken","type":"address"}],"name":"createVault","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_logic","type":"address"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"deployMinimal","outputs":[{"internalType":"address","name":"proxy","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getRoleMember","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleMemberCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"projectIdToBToken","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"vaultImplementation","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]')},121:function(e,n,t){e.exports=t.p+"static/media/circle.2d975615.svg"},131:function(e,n,t){e.exports=t(175)},137:function(e,n,t){},143:function(e,n){},175:function(e,n,t){"use strict";t.r(n);var a,r,i,o,u,s,c,l,p,d=t(0),m=t.n(d),y=t(72),f=t.n(y),b=t(85),h=t(26),v=t(11),g=t(12),x=g.c.div(a||(a=Object(v.a)(["\n    position: relative;\n    font-family: Ubuntu;\n    display: flex;\n    flex-direction: row;\n    width: 100vw;\n    height: 80vh;\n    background: #F9F8EB;\n"]))),w=g.c.div(r||(r=Object(v.a)(["\n    display:flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n    width: 50%;\n"]))),O=g.c.h1(i||(i=Object(v.a)(["\n    color: ",";  \n    font-family: Ubuntu;\n    font-weight: 600;\n    font-size: 2.5rem;\n    letter-spacing: 1px\n"])),(function(e){return e.theme.primaryRed})),j=g.c.div(o||(o=Object(v.a)(["\n    text-decoration: none;\n    cursor: pointer;\n    color: ",";\n    :focus {\n        outline: none;\n        text-decoration: underline;\n    }\n    :active {\n        text-decoration: none;\n    }\n"])),(function(e){return e.theme.primaryRed})),T=g.c.input(u||(u=Object(v.a)(["\n    color: ",";\n    font-size: 1rem;\n    outline: none;\n    border: none;\n    flex: 1 1 auto;\n    width: 0;\n    background-color: ",";\n    [type='number'] {\n        -moz-appearance: textfield;\n    }\n    ::-webkit-outer-spin-button,\n    ::-webkit-inner-spin-button {\n        -webkit-appearance: none;\n    }\n    ::placeholder {\n        color: ",";\n    }\n"])),(function(e){return e.theme.textColor}),(function(e){return e.theme.inputBackground}),(function(e){return e.theme.chaliceGray})),E=g.c.button(s||(s=Object(v.a)(["\n    background: ",";\n    color: ",";\n    font-family: Ubuntu; \n    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);\n    border-radius: 7px;\n    color: white;\n    width: 70%;\n    height: 2rem;\n    font-size: 0.8rem;\n    margin-right: 5%;\n    :hover {\n        background: ",";\n        cursor: pointer; \n        box-shadow: 0px 7px 7px rgba(0, 0, 0, 0.25);\n        border: 1px solid #7c1818;\n    }\n"])),(function(e){return e.theme.primaryRed}),(function(e){return e.theme.white}),(function(e){return e.theme.secondaryRed})),k={upToSmall:600,upToMedium:960,upToLarge:1280},M=Object.keys(k).reduce((function(e,n){return e[n]=function(){return Object(g.b)(c||(c=Object(v.a)(["\n        @media (max-width: ","px) {\n        ","\n        }\n    "])),k[n],g.b.apply(void 0,arguments))},e}),{}),R=Object(g.b)(l||(l=Object(v.a)(["\n    display: flex;\n    flex-flow: column nowrap;\n"]))),F=Object(g.b)(p||(p=Object(v.a)(["\n    display: flex;\n    flex-flow: row nowrap;\n"])));function C(e){var n=e.children;return m.a.createElement(g.a,{theme:z()},n)}var S,z=function(){return{white:"#FFFFFF",black:"#000000",inputBackground:"#FFFFFF",placeholderGray:"#E1E1E1",shadowColor:"#2F80ED",pink:"#DC6BE5",primaryRed:"#9b3f3f",secondaryRed:"#d38f8f",lightText:"#F9F8EB",mediaWidth:M,flexColumnNoWrap:R,flexRowNoWrap:F}},B=(t(137),t(57)),N=t(21),_=Object(g.c)(B.b)(S||(S=Object(v.a)(["\n  background: ","; \n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-family: Ubuntu; \n  text-decoration: none;\n  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);\n  border-radius: 7px;\n  color: white;\n  width: 40%;\n  height: 10%;\n  font-size: 1.2rem;\n"])),(function(e){return e.theme.primaryRed}));function A(){return m.a.createElement(m.a.Fragment,null,m.a.createElement(x,null,m.a.createElement(w,null,m.a.createElement(O,null,"Bazaar Finance")),m.a.createElement(w,null,m.a.createElement(_,{to:"/projects"},"Discover Projects"))))}var W=t(4),D=t.n(W),I=t(51),L=t(34),P={erc20:t(110),vault:t(111),vaultFactory:t(112)},U={aDAI:"0xdCf0aF9e59C002FA3AA091a46196b37530FD48a8",dai:"0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD",aavePool:"0xE0fBa4Fc209b4948668006B2bE61711b7f465bAe",vaultFactory:"0xa75F7f9EBafF64a94eE777C2893065249376A2aE",bToken:"0xe2749667e4Bdf8B9a944Acd0ec1b7b0Ff08E2428",vault:"0x7654F3998d50D451a7Af65629FEe0369E9Cf6A97"},G=t(55);function H(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";return""!==n?X(e,n):e}function V(e,n,t){return new G.a(e,P.vault,H(n,t))}function J(e,n,t){return new G.a(e,P.vaultFactory,H(n,t))}function K(e,n,t){return new G.a(e,P.erc20,H(n,t))}function X(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";return e.getSigner(n).connectUnchecked()}function Y(e,n){return $.apply(this,arguments)}function $(){return($=Object(I.a)(D.a.mark((function e(n,t){return D.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",n.getLogs(t));case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function q(e,n,t){return Q.apply(this,arguments)}function Q(){return(Q=Object(I.a)(D.a.mark((function e(n,t,a){var r,i;return D.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=J(n,t,a),(i=r.filters.VaultCreated(null,null)).fromBlock=0,i.toBlock="latest",e.abrupt("return",Y(t,i));case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var Z=t(113),ee=t(5),ne=t(6),te=t(8),ae=t(7),re=function(e){Object(te.a)(t,e);var n=Object(ae.a)(t);function t(){return Object(ee.a)(this,t),n.apply(this,arguments)}return Object(ne.a)(t,[{key:"pause",value:function(){this.active&&this.providers[this.currentChainId].stop()}},{key:"resume",value:function(){this.active&&this.providers[this.currentChainId].start()}}]),t}(t(115).a),ie=new Z.a({supportedChainIds:[1,42]}),oe=new re({urls:{1:"https://mainnet.infura.io/v3/60ab76e16df54c808e50a79975b4779f",42:"https://kovan.infura.io/v3/60ab76e16df54c808e50a79975b4779f"},defaultChainId:1,pollingInterval:1e4});function ue(){var e=Object(h.d)(),n=Object(h.d)("NETWORK");return e.active?e:n}function se(){var e=Object(h.d)(),n=e.activate,t=e.active,a=Object(d.useState)(!1),r=Object(L.a)(a,2),i=r[0],o=r[1];return Object(d.useEffect)((function(){ie.isAuthorized().then((function(e){e?n(ie,void 0,!0).catch((function(){o(!0)})):o(!0)}))}),[n]),Object(d.useEffect)((function(){t&&o(!0)}),[t]),i}function ce(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],n=Object(h.d)(),t=n.active,a=n.error,r=n.activate;Object(d.useEffect)((function(){var n=window.ethereum;if(n&&n.on&&!t&&!a&&!e){var i=function(){r(ie,void 0,!0).catch((function(){}))},o=function(e){e.length>0&&r(ie,void 0,!0).catch((function(){}))};return n.on("networkChanged",i),n.on("accountsChanged",o),function(){n.removeListener("networkChanged",i),n.removeListener("accountsChanged",o)}}return function(){}}),[t,a,e,r])}function le(e){var n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],t=ue(),a=t.library,r=t.account;return Object(d.useMemo)((function(){try{return V(e,a,n?r:void 0)}catch(t){return null}}),[e,a,n,r])}function pe(e){var n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],t=ue(),a=t.library,r=t.account;return Object(d.useMemo)((function(){try{return K(e,a,n?r:void 0)}catch(t){return null}}),[e,a,n,r])}var de,me,ye,fe,be,he,ve,ge,xe,we=t(61),Oe=t(116),je=t.n(Oe),Te=t(54),Ee=t(93),ke=t(91),Me=t(90),Re=t(76),Fe=(t(144),Object(ke.a)(Me.b)),Ce=Object(g.c)((function(e){e.suppressClassNameWarning;var n=Object(Ee.a)(e,["suppressClassNameWarning"]);return m.a.createElement(Fe,n)})).attrs({suppressClassNameWarning:!0})(de||(de=Object(v.a)(["\n    &[data-reach-dialog-overlay] {\n        z-index: 2;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        background-color: ",";\n    }\n"])),(function(e){return e.theme.modalBackground})),Se=Object(g.c)((function(e){e.minHeight;var n=Object(Ee.a)(e,["minHeight"]);return m.a.createElement(Me.a,n)}))(me||(me=Object(v.a)(["\n    &[data-reach-dialog-content] {\n        margin: 0 0 2rem 0;\n        border: 1px solid ",";\n        background-color: ",";\n        box-shadow: 0 4px 8px 0 ",";\n        ",";\n        padding: 0px;\n        width: 75vw;\n        max-width: 800px;\n        ","\n        ","\n        max-height: 75vh;\n        ","\n        ","\n        ","\n        display: flex;\n        overflow: scroll;\n        border-radius: 10px;\n        font-family: Ubuntu;\n    }\n"])),(function(e){return e.theme.concreteGray}),(function(e){return e.theme.inputBackground}),(function(e){e.theme;return Object(Re.b)(.95,"#333333")}),(function(e){return e.theme.mediaWidth.upToMedium(ye||(ye=Object(v.a)(["margin: 0;"])))}),(function(e){return e.theme.mediaWidth.upToMedium(fe||(fe=Object(v.a)(["width: 65vw;"])))}),(function(e){return e.theme.mediaWidth.upToSmall(be||(be=Object(v.a)(["width: 85vw;"])))}),(function(e){var n=e.minHeight;return n&&Object(g.b)(he||(he=Object(v.a)(["\n            min-height: ","vh;\n        "])),n)}),(function(e){return e.theme.mediaWidth.upToMedium(ve||(ve=Object(v.a)(["max-height: 65vh;"])))}),(function(e){return e.theme.mediaWidth.upToSmall(ge||(ge=Object(v.a)(["max-height: 80vh;"])))})),ze=g.c.button(xe||(xe=Object(v.a)(["\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: none;\n"])));function Be(e){var n=e.isOpen,t=e.onDismiss,a=e.minHeight,r=void 0!==a&&a,i=e.initialFocusRef,o=e.children;return Object(ke.b)(n,null,{config:{duration:150},from:{opacity:0},enter:{opacity:1},leave:{opacity:0}}).map((function(e){var n=e.item,a=e.key,u=e.props;return n&&m.a.createElement(Ce,{key:a,style:u,onDismiss:t,initialFocusRef:i},m.a.createElement(Se,{"aria-label":"popup-info",hidden:!0,minHeight:r},m.a.createElement(ze,{onClick:t}),o))}))}function Ne(){return(Ne=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var a in t)Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a])}return e}).apply(this,arguments)}function _e(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)t=i[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)t=i[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var Ae,We,De,Ie,Le,Pe,Ue=m.a.createElement("line",{x1:18,y1:6,x2:6,y2:18}),Ge=m.a.createElement("line",{x1:6,y1:6,x2:18,y2:18}),He=function(e){var n=e.svgRef,t=e.title,a=_e(e,["svgRef","title"]);return m.a.createElement("svg",Ne({width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round",className:"feather feather-x",ref:n},a),t?m.a.createElement("title",null,t):null,Ue,Ge)},Ve=m.a.forwardRef((function(e,n){return m.a.createElement(He,Ne({svgRef:n},e))}));t.p,we.a.BigNumber.from(1e3);je.a.config({EXPONENTIAL_AT:30});var Je,Ke=g.c.div(Ae||(Ae=Object(v.a)(["\n  position: relative;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  padding: 0px 0px 0px 1rem;\n  height: 60px;\n  background: ",";\n  color: white};\n"])),(function(e){return e.theme.secondaryRed})),Xe=g.c.div(We||(We=Object(v.a)(["\n  ","\n  align-items: center;\n  justify-content: space-between;\n  padding: 0.25rem 0.85rem 0.75rem;\n  margin: 2% 3% 0 3%;\n"])),(function(e){return e.theme.flexRowNoWrap})),Ye=Object(g.c)(T)(De||(De=Object(v.a)(["\n  font-size: 1rem;\n  padding: 0.2rem;\n  color: ",";\n  background-color: ",";\n  -moz-appearance: textfield;\n"])),(function(e){var n=e.error,t=e.theme;return n&&t.pink}),(function(e){return e.theme.chaliceGray})),$e=g.c.div(Ie||(Ie=Object(v.a)(["\n  position: absolute;\n  right: 1rem;\n  top: 14px;\n  &:hover {\n    cursor: pointer;\n    opacity: 0.6;\n  }\n"]))),qe=g.c.div(Le||(Le=Object(v.a)(["\n  ","\n  width: 100%;\n"])),(function(e){return e.theme.flexColumnNoWrap})),Qe=Object(g.c)(Ve)(Pe||(Pe=Object(v.a)(["\n  path {\n    stroke: ",";\n  }\n"])),(function(e){return e.theme.black}));function Ze(e){return e.mul(we.a.BigNumber.from(1e4).add(we.a.BigNumber.from(1e3))).div(we.a.BigNumber.from(1e4))}function en(e){var n=e.errorMessage,t=e.isOpen,a=e.onDismiss,r=e.recipient,i=e.salary,o=e.startedSurplus,u=e.principal,s=Object(d.useRef)(),c=Object(d.useState)(""),l=Object(L.a)(c,2),p=l[0],y=l[1],f=Object(h.d)().account,b=le(U.vault),v=pe(U.dai),g=pe(U.bToken);function x(){y(""),a()}return m.a.createElement(Be,{isOpen:t,onDismiss:x,minHeight:60,initialFocusRef:s},m.a.createElement(qe,null,m.a.createElement(Ke,null,"Bazaar Finance",m.a.createElement($e,{onClick:x},m.a.createElement(Qe,{alt:"close icon"}))),m.a.createElement("p",null,"Recipient: ",r),m.a.createElement("p",null,"Salary: ",i.toString()),m.a.createElement("p",null,"Principal: ",u.toString()),m.a.createElement("p",null,"Started Surplus? ",o?"Yes!":"No"),m.a.createElement(Xe,null,m.a.createElement(Ye,{ref:s,type:"number",min:"0",error:!!n,placeholder:"Enter deposit amount",step:"1",onChange:function(e){return y(e.target.value)},onKeyPress:function(e){45===(e.which?e.which:e.keyCode)&&(e.preventDefault(),e.stopPropagation())},value:p})),m.a.createElement(Xe,null,m.a.createElement(E,{onClick:Object(I.a)(D.a.mark((function e(){var n,t,a,r,i,o;return D.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,v.allowance(f,U.vault);case 2:if(n=e.sent,t=we.a.BigNumber.from(p),e.prev=4,"0"===n.toString()){e.next=15;break}return e.next=8,b.estimateGas.deposit(t);case 8:return a=e.sent,e.next=11,b.deposit(t,{gasLimit:Ze(a)});case 11:r=e.sent,console.log(r),e.next=22;break;case 15:return e.next=17,v.estimateGas.approve(U.vault,t);case 17:return i=e.sent,e.next=20,v.approve(U.vault,t,{gasLimit:Ze(i)});case 20:o=e.sent,console.log(o);case 22:e.next=27;break;case 24:e.prev=24,e.t0=e.catch(4),console.log(e.t0);case 27:case"end":return e.stop()}}),e,null,[[4,24]])})))},"Deposit"),m.a.createElement(E,{onClick:Object(I.a)(D.a.mark((function e(){var n,t,a,r,i;return D.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,g.allowance(f,U.vault);case 2:if(n=e.sent,e.prev=3,"0"===n.toString()){e.next=14;break}return e.next=7,b.estimateGas.withdraw();case 7:return t=e.sent,e.next=10,b.withdraw({gasLimit:Ze(t)});case 10:a=e.sent,console.log(a),e.next=21;break;case 14:return e.next=16,g.estimateGas.approve(U.vault,Te.a);case 16:return r=e.sent,e.next=19,g.approve(U.vault,Te.a,{gasLimit:Ze(r)});case 19:i=e.sent,console.log(i);case 21:e.next=26;break;case 23:e.prev=23,e.t0=e.catch(3),console.log(e.t0);case 26:case"end":return e.stop()}}),e,null,[[3,23]])})))},"Withdraw"))))}function nn(){var e=Object(d.useRef)(null),n=(function(e){var n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],t=ue(),a=t.library,r=t.account;Object(d.useMemo)((function(){try{return q(e,a,n?r:void 0)}catch(t){return null}}),[e,a,n,r])}(U.vaultFactory),le(U.vault)),t=Object(d.useState)(!1),a=Object(L.a)(t,2),r=a[0],i=a[1],o=Object(d.useState)(0),u=Object(L.a)(o,2),s=u[0],c=u[1],l=Object(d.useState)(""),p=Object(L.a)(l,2),y=p[0],f=p[1],b=Object(d.useState)(!1),h=Object(L.a)(b,2),v=h[0],g=h[1],j=Object(d.useState)(0),T=Object(L.a)(j,2),k=T[0],M=T[1];return m.a.createElement(m.a.Fragment,null,m.a.createElement(x,{ref:e},m.a.createElement(w,null,m.a.createElement(O,null,"Fund Project")),m.a.createElement(w,null,m.a.createElement(E,{onClick:Object(I.a)(D.a.mark((function e(){var t,a,r,o;return D.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,n.salary();case 2:return t=e.sent,c(t),e.next=6,n.recipient();case 6:return a=e.sent,f(a),e.next=10,n.principal();case 10:return r=e.sent,e.next=13,n.startedSurplus();case 13:o=e.sent,M(r),g(o),i(!0);case 17:case"end":return e.stop()}}),e)})))},"View"),r?m.a.createElement(en,{recipient:y,salary:s.toString(),startedSurplus:v,principal:k.toString(),isOpen:r,onDismiss:function(){return i(!1)}}):null)))}var tn=Object(g.c)(B.b)(Je||(Je=Object(v.a)(["\n    display: flex;\n    align-items: center;\n    font-family: Ubuntu;\n    text-decoration: none;\n    font-size: 1rem;\n    :hover {\n        cursor: pointer;\n    }\n    #navigation {\n        display: inline;\n        text-decoration: none;\n        font-size: 1rem;\n        margin-right: 15px;\n        font-weight: 500;\n        color: ",";\n        :hover {\n        color: ",";\n        }\n    }\n"])),(function(e){return e.theme.primaryRed}),(function(e){var n=e.theme;return Object(Re.a)(.2,n.primaryRed)}));var an,rn,on,un,sn,cn,ln,pn,dn,mn,yn,fn,bn=Object(N.e)((function(){var e=Object(h.d)().library;return m.a.createElement(m.a.Fragment,null,m.a.createElement(j,null,m.a.createElement(tn,{to:"/home",id:"navigation"},"Home")),e?m.a.createElement(j,null,m.a.createElement(tn,{to:"/projects",id:"navigation"},"Projects")):null)})),hn=t(181),vn=t(89),gn=t.n(vn),xn=g.c.button(an||(an=Object(v.a)(["\n  display: flex;\n  flex-flow: row nowrap;\n  width: 100%;\n  font-size: 0.3rem;\n  align-items: center;\n  padding: 0.5rem;\n  border-radius: 2rem;\n  box-sizing: border-box;\n  cursor: pointer;\n  user-select: none;\n  :focus {\n    outline: none;\n  }\n"]))),wn=Object(g.c)(xn)(rn||(rn=Object(v.a)(["\n  background-color: #770e17;\n  border: 1px solid ",";\n  color: ",";\n  font-weight: 500;\n  :hover,\n  :focus {\n    background-color: ",";\n  }\n"])),(function(e){return e.theme.primaryRed}),(function(e){return e.theme.lightText}),(function(e){return e.theme.secondaryRed})),On=Object(g.c)(xn)(on||(on=Object(v.a)(["\n  background-color: #770e17;\n  border: 1px solid $",";\n  color: ",";\n  font-weight: 500;\n  :hover,\n  :focus {\n    background-color: ",";\n  }\n"])),(function(e){return e.theme.primaryRed}),(function(e){return e.theme.lightText}),(function(e){return e.theme.secondaryRed})),jn=Object(g.c)(xn)(un||(un=Object(v.a)(["\n  background-color: #770e17;\n  border: 1px solid ",";\n  color: ",";\n  font-weight: 400;\n  :hover {\n    background-color: ",";\n  }\n  :focus {\n    border: 1px solid\n    ",";\n  }\n"])),(function(e){return e.theme.primaryRed}),(function(e){return e.theme.lightText}),(function(e){return e.theme.secondaryRed}),(function(e){return e.theme.primaryRed})),Tn=g.c.p(sn||(sn=Object(v.a)(["\n  flex: 1 1 auto;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  margin: 0 0.5rem 0 0.25rem;\n  font-size: 0.83rem;\n"]))),En=(g.c.div(cn||(cn=Object(v.a)(["\n  height: 1rem;\n  width: 1rem;\n  border-radius: 1.125rem;\n  background-color: ",";\n"])),(function(e){return e.theme.secondaryRed})),Object(g.c)(hn.a)(ln||(ln=Object(v.a)(["\n  margin-left: 0.25rem;\n  margin-right: 0.5rem;\n  width: 16px;\n  height: 16px;\n"]))));function kn(){var e=Object(h.d)(),n=e.connector,t=e.account,a=e.error,r=e.activate,i=e.active,o=Object(h.d)("NETWORK"),u=Object(d.useState)({}),s=Object(L.a)(u,2),c=s[0],l=s[1];return Object(d.useEffect)((function(){c&&c===n&&l(void 0)}),[c,n]),ce(!se()||!!c),o.active||i?m.a.createElement(m.a.Fragment,null,t?m.a.createElement(jn,null,m.a.createElement(Tn,null,t),function(){if(n===ie)return m.a.createElement(gn.a,{diameter:30,seed:Object(vn.jsNumberForAddress)(t)})}()):a?m.a.createElement(wn,{onClick:function(){l(ie),r(ie)}},m.a.createElement(En,null),m.a.createElement(Tn,null,a instanceof h.a?"Wrong Network":"Error")):m.a.createElement(On,{onClick:function(){l(ie),r(ie)}},m.a.createElement(Tn,null,"Connect Wallet"))):null}var Mn,Rn,Fn,Cn,Sn=g.c.div(pn||(pn=Object(v.a)(["\n  display: flex;\n  width: 100vw;\n  height: 10vh;\n  align-items: center;\n  justify-content: space-between;\n  background: linear-gradient(180deg, #9b3f3f 0%, rgba(255, 255, 255, 0) 100%), #d38f8f;\n"]))),zn=g.c.div(dn||(dn=Object(v.a)(["\n  margin: 1.25rem;\n  display: flex;\n  min-width: 0;\n  display: flex;\n  align-items: center;\n"]))),Bn=g.c.a.attrs({target:"_blank",rel:"noopener noreferrer"})(mn||(mn=Object(v.a)(["\n    text-decoration: none;\n    cursor: pointer;\n    color: #7c1818;\n    padding-left: 10px;\n    :focus {\n      outline: none;\n      text-decoration: underline;\n    }\n    :active {\n      text-decoration: none;\n    }\n    :hover {\n      color: ",";\n    }\n  "])),(function(e){return e.theme.secondaryRed})),Nn=g.c.span(yn||(yn=Object(v.a)(["\n  transform: rotate(0deg);\n  transition: transform 1s ease-out;\n  :hover {\n    transform: rotate(360deg);\n  }\n"]))),_n=g.c.div(fn||(fn=Object(v.a)(["\n  display: flex;\n  align-items: center;\n  :hover {\n    cursor: pointer;\n  }\n  #link {\n    text-decoration-color: ",";\n  }\n  #title {\n    display: inline;\n    font-size: 1rem;\n    font-weight: 500;\n    margin-right: 25px;\n    color: ",";\n  }\n  #navigation {\n    display: inline;\n    font-size: 1rem;\n    font-weight: 500;\n    margin-right: 15px;\n    color: ",";\n    :hover {\n      color: ",";\n    }\n  }\n\n"])),(function(e){return e.theme.primaryRed}),(function(e){return e.theme.lightText}),(function(e){return e.theme.lightText}),(function(e){return e.theme.secondaryRed}));function An(){return m.a.createElement(Sn,null,m.a.createElement(zn,null,m.a.createElement(_n,null,m.a.createElement(Nn,null,m.a.createElement(Bn,{id:"link",href:"https://github.com/bazaarfinance/bazaarfinance"},m.a.createElement("span",{role:"img","aria-label":"alpaca"},"\ud83e\udd99 ","  "))),m.a.createElement(Bn,{id:"link",href:"https://github.com/bazaarfinance/bazaarfinance"},m.a.createElement("h1",{id:"title"},"Bazaar Finance")),m.a.createElement(bn,null))),m.a.createElement(zn,null,m.a.createElement(kn,null)))}var Wn=g.c.div(Mn||(Mn=Object(v.a)(["\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  width: 100vw;\n  height: 10vh;\n  background: linear-gradient(180deg, #d38f8f 0%, rgba(255, 255, 255, 0) 100%), #9b3f3f;\n"]))),Dn=g.c.a.attrs({target:"_blank",rel:"noopener noreferrer"})(Rn||(Rn=Object(v.a)(["\n    text-decoration: none;\n    cursor: pointer;\n    color: #7c1818;\n    padding-left: 10px;\n    :focus {\n      outline: none;\n      text-decoration: underline;\n    }\n    :active {\n      text-decoration: none;\n    }\n  "]))),In=g.c.div(Fn||(Fn=Object(v.a)(["\n  margin: 1.25rem;\n  display: flex;\n  justify-content: space-between;\n  min-width: 0;\n  display: flex;\n  align-items: center;\n"]))),Ln=g.c.div(Cn||(Cn=Object(v.a)(["\n  display: flex;\n  flex-direction: row;\n  font-family: Ubuntu;\n  justify-content: space-between;\n  color: ",";\n  :hover {\n    cursor: pointer;\n  }\n  #link {\n    text-decoration-color: ",";\n  }\n  #title {\n    display: inline;\n    font-size: 0.825rem;\n    font-weight: 400;\n    margin-right: 12px;\n    color: ",";\n    :hover {\n      color: ",";\n    }\n  }\n"])),(function(e){return e.theme.lightText}),(function(e){return e.theme.lightText}),(function(e){return e.theme.lightText}),(function(e){return e.theme.secondaryRed}));function Pn(){return m.a.createElement(Wn,null,m.a.createElement(In,null,m.a.createElement(Ln,null,m.a.createElement(Dn,{id:"link",href:"https://github.com/bazaarfinance/bazaarfinance/blob/master/README.md"},m.a.createElement("h1",{id:"title"},"About")),m.a.createElement(Dn,{id:"link",href:"https://github.com/bazaarfinance/bazaarfinance"},m.a.createElement("h1",{id:"title"},"Code")),m.a.createElement(Dn,{id:"link",href:"https://twitter.com"},m.a.createElement("h1",{id:"title"},"Twitter")))),m.a.createElement(In,null,m.a.createElement(Ln,null,m.a.createElement(Dn,{id:"link",href:"https://mm.ethglobal.co/"},m.a.createElement("h1",{id:"title"},m.a.createElement("span",{role:"img","aria-label":"heart"},"Made with \u2764\ufe0f at MarketMake Hackathon"))))))}var Un,Gn,Hn,Vn,Jn,Kn,Xn,Yn,$n,qn=t(121),Qn=t.n(qn),Zn=Object(g.d)(Un||(Un=Object(v.a)(["\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n"]))),et=g.c.img(Gn||(Gn=Object(v.a)(["\n  animation: 2s "," linear infinite;\n  width: 16px;\n  height: 16px;\n"])),Zn),nt=g.c.div(Hn||(Hn=Object(v.a)(["\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 20rem;\n"]))),tt=g.c.h2(Vn||(Vn=Object(v.a)(["\n  color: ",";\n"])),(function(e){return e.theme.primaryRed})),at=Object(g.c)(et)(Jn||(Jn=Object(v.a)(["\n  font-size: 4rem;\n  svg {\n    path {\n      color: ",";\n    }\n  }\n"])),(function(e){return e.theme.primaryRed}));function rt(e){var n=e.children,t=Object(h.d)().active,a=Object(h.d)("NETWORK"),r=a.active,i=a.error,o=a.activate,u=se();Object(d.useEffect)((function(){!u||r||i||t||o(oe)}),[u,r,i,o,t]),Object(d.useEffect)((function(){t&&r&&oe.pause()}),[t,r]),Object(d.useEffect)((function(){!t&&r&&oe.resume()}),[t,r]),ce(!u);var s=Object(d.useState)(!1),c=Object(L.a)(s,2),l=c[0],p=c[1];return Object(d.useEffect)((function(){var e=setTimeout((function(){p(!0)}),600);return function(){clearTimeout(e)}}),[]),u?!t&&i?m.a.createElement(nt,null,m.a.createElement(tt,null,"unknownError")):t||r?n:l?m.a.createElement(nt,null,m.a.createElement(at,{src:Qn.a})):null:null}var it=g.c.div(Kn||(Kn=Object(v.a)(["\n  display: flex;\n  flex-flow: column;\n  align-items: flex-start;\n  height: 100vh;\n"]))),ot=g.c.div(Xn||(Xn=Object(v.a)(["\n  ","\n  width: 100%;\n  justify-content: space-between;\n"])),(function(e){return e.theme.flexRowNoWrap})),ut=g.c.div(Yn||(Yn=Object(v.a)(["\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  justify-content: flex-start;\n  align-items: center;\n  flex: 1;\n  overflow-y: auto;\n  overflow-x: hidden;\n"]))),st=g.c.div($n||($n=Object(v.a)(["\n  width: 100%;\n  min-height: 30px;\n  align-self: flex-end;\n"])));var ct=function(){return m.a.createElement(m.a.Fragment,null,m.a.createElement(d.Suspense,{fallback:null},m.a.createElement(it,null,m.a.createElement(B.a,null,m.a.createElement(ot,null,m.a.createElement(An,null)),m.a.createElement(ut,null,m.a.createElement(rt,null,m.a.createElement(d.Suspense,{fallback:null},m.a.createElement(N.a,{exact:!0,path:"/",component:A}),m.a.createElement(N.a,{path:"/home",component:A}),m.a.createElement(N.a,{path:"/projects",component:nn})))),m.a.createElement(st,null,m.a.createElement(Pn,null))))))},lt=Object(h.c)("NETWORK");function pt(e){var n=new b.a(e);return n.pollingInterval=1e4,n}f.a.render(m.a.createElement(h.b,{getLibrary:pt},m.a.createElement(lt,{getLibrary:pt},m.a.createElement(C,null,m.a.createElement(ct,null)))),document.getElementById("root"))}},[[131,1,2]]]);
//# sourceMappingURL=main.67b591aa.chunk.js.map