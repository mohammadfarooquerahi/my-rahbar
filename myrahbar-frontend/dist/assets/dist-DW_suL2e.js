import{r as e}from"./jsx-runtime-DGeXAQPT.js";import{i as t,t as n}from"./createLucideIcon-CWIwxG8h.js";var r=n(`award`,[[`path`,{d:`m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526`,key:`1yiouv`}],[`circle`,{cx:`12`,cy:`8`,r:`6`,key:`1vp47v`}]]),i=n(`globe`,[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`path`,{d:`M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20`,key:`13o1zl`}],[`path`,{d:`M2 12h20`,key:`9i4pu4`}]]),a=e(t(),1),o={data:``},s=e=>{if(typeof window==`object`){let t=(e?e.querySelector(`#_goober`):window._goober)||Object.assign(document.createElement(`style`),{innerHTML:` `,id:`_goober`});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||o},c=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,l=/\/\*[^]*?\*\/|  +/g,u=/\n+/g,d=(e,t)=>{let n=``,r=``,i=``;for(let a in e){let o=e[a];a[0]==`@`?a[1]==`i`?n=a+` `+o+`;`:r+=a[1]==`f`?d(o,a):a+`{`+d(o,a[1]==`k`?``:t)+`}`:typeof o==`object`?r+=d(o,t?t.replace(/([^,])+/g,e=>a.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+` `+t:t)):a):o!=null&&(a=a[1]==`-`?a:a.replace(/[A-Z]/g,`-$&`).toLowerCase(),i+=d.p?d.p(a,o):a+`:`+o+`;`)}return n+(t&&i?t+`{`+i+`}`:i)+r},f={},p=e=>{if(typeof e==`object`){let t=``;for(let n in e)t+=n+p(e[n]);return t}return e},m=(e,t,n,r,i)=>{let a=p(e),o=f[a]||(f[a]=(e=>{let t=0,n=11;for(;t<e.length;)n=101*n+e.charCodeAt(t++)>>>0;return`go`+n})(a));if(!f[o]){let t=a===e?(e=>{let t,n,r=[{}];for(;t=c.exec(e.replace(l,``));)t[4]?r.shift():t[3]?(n=t[3].replace(u,` `).trim(),r.unshift(r[0][n]=r[0][n]||{})):r[0][t[1]]=t[2].replace(u,` `).trim();return r[0]})(e):e;f[o]=d(i?{[`@keyframes `+o]:t}:t,n?``:`.`+o)}let s=n&&f.g;return n&&(f.g=f[o]),((e,t,n,r)=>{r?t.data=t.data.replace(r,e):t.data.indexOf(e)===-1&&(t.data=n?e+t.data:t.data+e)})(f[o],t,r,s),o},h=(e,t,n)=>e.reduce((e,r,i)=>{let a=t[i];if(a&&a.call){let e=a(n),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;a=t?`.`+t:e&&typeof e==`object`?e.props?``:d(e,``):!1===e?``:e}return e+r+(a??``)},``);function g(e){let t=this||{},n=e.call?e(t.p):e;return m(n.unshift?n.raw?h(n,[].slice.call(arguments,1),t.p):n.reduce((e,n)=>Object.assign(e,n&&n.call?n(t.p):n),{}):n,s(t.target),t.g,t.o,t.k)}var _,v,y;g.bind({g:1});var b=g.bind({k:1});function x(e,t,n,r){d.p=t,_=e,v=n,y=r}function S(e,t){let n=this||{};return function(){let r=arguments;function i(a,o){let s=Object.assign({},a),c=s.className||i.className;n.p=Object.assign({theme:v&&v()},s),n.o=/go\d/.test(c),s.className=g.apply(n,r)+(c?` `+c:``),t&&(s.ref=o);let l=e;return e[0]&&(l=s.as||e,delete s.as),y&&l[0]&&y(s),_(l,s)}return t?t(i):i}}var C=e=>typeof e==`function`,w=(e,t)=>C(e)?e(t):e,T=(()=>{let e=0;return()=>(++e).toString()})(),E=(()=>{let e;return()=>{if(e===void 0&&typeof window<`u`){let t=matchMedia(`(prefers-reduced-motion: reduce)`);e=!t||t.matches}return e}})(),D=20,O=`default`,k=(e,t)=>{let{toastLimit:n}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,n)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return k(e,{type:+!!e.toasts.find(e=>e.id===r.id),toast:r});case 3:let{toastId:i}=t;return{...e,toasts:e.toasts.map(e=>e.id===i||i===void 0?{...e,dismissed:!0,visible:!1}:e)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let a=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+a}))}}},A=[],j={toasts:[],pausedAt:void 0,settings:{toastLimit:D}},M={},N=(e,t=O)=>{M[t]=k(M[t]||j,e),A.forEach(([e,n])=>{e===t&&n(M[t])})},P=e=>Object.keys(M).forEach(t=>N(e,t)),F=e=>Object.keys(M).find(t=>M[t].toasts.some(t=>t.id===e)),I=(e=O)=>t=>{N(t,e)},L=(e,t=`blank`,n)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:`status`,"aria-live":`polite`},message:e,pauseDuration:0,...n,id:n?.id||T()}),R=e=>(t,n)=>{let r=L(t,e,n);return I(r.toasterId||F(r.id))({type:2,toast:r}),r.id},z=(e,t)=>R(`blank`)(e,t);z.error=R(`error`),z.success=R(`success`),z.loading=R(`loading`),z.custom=R(`custom`),z.dismiss=(e,t)=>{let n={type:3,toastId:e};t?I(t)(n):P(n)},z.dismissAll=e=>z.dismiss(void 0,e),z.remove=(e,t)=>{let n={type:4,toastId:e};t?I(t)(n):P(n)},z.removeAll=e=>z.remove(void 0,e),z.promise=(e,t,n)=>{let r=z.loading(t.loading,{...n,...n?.loading});return typeof e==`function`&&(e=e()),e.then(e=>{let i=t.success?w(t.success,e):void 0;return i?z.success(i,{id:r,...n,...n?.success}):z.dismiss(r),e}).catch(e=>{let i=t.error?w(t.error,e):void 0;i?z.error(i,{id:r,...n,...n?.error}):z.dismiss(r)}),e};var B=b`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,V=b`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,H=b`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,U=S(`div`)`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||`#ff4b4b`};
  position: relative;
  transform: rotate(45deg);

  animation: ${B} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${V} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||`#fff`};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${H} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,W=b`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,G=S(`div`)`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||`#e0e0e0`};
  border-right-color: ${e=>e.primary||`#616161`};
  animation: ${W} 1s linear infinite;
`,K=b`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,q=b`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,J=S(`div`)`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||`#61d345`};
  position: relative;
  transform: rotate(45deg);

  animation: ${K} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${q} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||`#fff`};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,Y=S(`div`)`
  position: absolute;
`,X=S(`div`)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,Z=b`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Q=S(`div`)`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Z} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,$=({toast:e})=>{let{icon:t,type:n,iconTheme:r}=e;return t===void 0?n===`blank`?null:a.createElement(X,null,a.createElement(G,{...r}),n!==`loading`&&a.createElement(Y,null,n===`error`?a.createElement(U,{...r}):a.createElement(J,{...r}))):typeof t==`string`?a.createElement(Q,null,t):t},ee=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,te=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,ne=`0%{opacity:0;} 100%{opacity:1;}`,re=`0%{opacity:1;} 100%{opacity:0;}`,ie=S(`div`)`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,ae=S(`div`)`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,oe=(e,t)=>{let n=e.includes(`top`)?1:-1,[r,i]=E()?[ne,re]:[ee(n),te(n)];return{animation:t?`${b(r)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${b(i)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}};a.memo(({toast:e,position:t,style:n,children:r})=>{let i=e.height?oe(e.position||t||`top-center`,e.visible):{opacity:0},o=a.createElement($,{toast:e}),s=a.createElement(ae,{...e.ariaProps},w(e.message,e));return a.createElement(ie,{className:e.className,style:{...i,...n,...e.style}},typeof r==`function`?r({icon:o,message:s}):a.createElement(a.Fragment,null,o,s))}),x(a.createElement),g`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;var se=z;export{i as n,r,se as t};