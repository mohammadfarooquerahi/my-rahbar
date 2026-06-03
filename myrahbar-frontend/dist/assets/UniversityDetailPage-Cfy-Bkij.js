import{r as e,t}from"./jsx-runtime-DGeXAQPT.js";import{i as n,n as r,t as i}from"./createLucideIcon-CWIwxG8h.js";import{t as a}from"./bell-DxHYUSIG.js";import{t as o}from"./chart-no-axes-column-B4gj9xkE.js";import{t as s}from"./chevron-right-DqvQOicy.js";import{t as c}from"./circle-alert-DTWjY4xn.js";import{t as l}from"./circle-check-big-D5SnDJT3.js";import{n as u,t as ee}from"./loader-Mzak_3rh.js";import{t as te}from"./eye-BQrNTh_V.js";import{t as d}from"./map-pin-PzVRRzol.js";import{t as ne}from"./phone-CydwZbwo.js";import{t as f}from"./star-C7jffNBf.js";import{t as re}from"./trending-up-DCj1-E4n.js";import{c as p,f as m,g as h,h as g,i as ie,r as ae,u as _,v as oe}from"./index-Dv3a0s8a.js";import{i as v,n as se,r as ce}from"./merit-CaI7sJ8-.js";var le=i(`award`,[[`path`,{d:`m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526`,key:`1yiouv`}],[`circle`,{cx:`12`,cy:`8`,r:`6`,key:`1vp47v`}]]),ue=i(`globe`,[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`path`,{d:`M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20`,key:`13o1zl`}],[`path`,{d:`M2 12h20`,key:`9i4pu4`}]]),y=e(n(),1),b={data:``},x=e=>{if(typeof window==`object`){let t=(e?e.querySelector(`#_goober`):window._goober)||Object.assign(document.createElement(`style`),{innerHTML:` `,id:`_goober`});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||b},S=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,C=/\/\*[^]*?\*\/|  +/g,w=/\n+/g,T=(e,t)=>{let n=``,r=``,i=``;for(let a in e){let o=e[a];a[0]==`@`?a[1]==`i`?n=a+` `+o+`;`:r+=a[1]==`f`?T(o,a):a+`{`+T(o,a[1]==`k`?``:t)+`}`:typeof o==`object`?r+=T(o,t?t.replace(/([^,])+/g,e=>a.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+` `+t:t)):a):o!=null&&(a=a[1]==`-`?a:a.replace(/[A-Z]/g,`-$&`).toLowerCase(),i+=T.p?T.p(a,o):a+`:`+o+`;`)}return n+(t&&i?t+`{`+i+`}`:i)+r},E={},D=e=>{if(typeof e==`object`){let t=``;for(let n in e)t+=n+D(e[n]);return t}return e},O=(e,t,n,r,i)=>{let a=D(e),o=E[a]||(E[a]=(e=>{let t=0,n=11;for(;t<e.length;)n=101*n+e.charCodeAt(t++)>>>0;return`go`+n})(a));if(!E[o]){let t=a===e?(e=>{let t,n,r=[{}];for(;t=S.exec(e.replace(C,``));)t[4]?r.shift():t[3]?(n=t[3].replace(w,` `).trim(),r.unshift(r[0][n]=r[0][n]||{})):r[0][t[1]]=t[2].replace(w,` `).trim();return r[0]})(e):e;E[o]=T(i?{[`@keyframes `+o]:t}:t,n?``:`.`+o)}let s=n&&E.g;return n&&(E.g=E[o]),((e,t,n,r)=>{r?t.data=t.data.replace(r,e):t.data.indexOf(e)===-1&&(t.data=n?e+t.data:t.data+e)})(E[o],t,r,s),o},k=(e,t,n)=>e.reduce((e,r,i)=>{let a=t[i];if(a&&a.call){let e=a(n),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;a=t?`.`+t:e&&typeof e==`object`?e.props?``:T(e,``):!1===e?``:e}return e+r+(a??``)},``);function A(e){let t=this||{},n=e.call?e(t.p):e;return O(n.unshift?n.raw?k(n,[].slice.call(arguments,1),t.p):n.reduce((e,n)=>Object.assign(e,n&&n.call?n(t.p):n),{}):n,x(t.target),t.g,t.o,t.k)}var j,M,N;A.bind({g:1});var P=A.bind({k:1});function F(e,t,n,r){T.p=t,j=e,M=n,N=r}function I(e,t){let n=this||{};return function(){let r=arguments;function i(a,o){let s=Object.assign({},a),c=s.className||i.className;n.p=Object.assign({theme:M&&M()},s),n.o=/go\d/.test(c),s.className=A.apply(n,r)+(c?` `+c:``),t&&(s.ref=o);let l=e;return e[0]&&(l=s.as||e,delete s.as),N&&l[0]&&N(s),j(l,s)}return t?t(i):i}}var L=e=>typeof e==`function`,R=(e,t)=>L(e)?e(t):e,z=(()=>{let e=0;return()=>(++e).toString()})(),B=(()=>{let e;return()=>{if(e===void 0&&typeof window<`u`){let t=matchMedia(`(prefers-reduced-motion: reduce)`);e=!t||t.matches}return e}})(),V=20,H=`default`,U=(e,t)=>{let{toastLimit:n}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,n)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return U(e,{type:+!!e.toasts.find(e=>e.id===r.id),toast:r});case 3:let{toastId:i}=t;return{...e,toasts:e.toasts.map(e=>e.id===i||i===void 0?{...e,dismissed:!0,visible:!1}:e)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let a=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+a}))}}},W=[],de={toasts:[],pausedAt:void 0,settings:{toastLimit:V}},G={},K=(e,t=H)=>{G[t]=U(G[t]||de,e),W.forEach(([e,n])=>{e===t&&n(G[t])})},q=e=>Object.keys(G).forEach(t=>K(e,t)),fe=e=>Object.keys(G).find(t=>G[t].toasts.some(t=>t.id===e)),J=(e=H)=>t=>{K(t,e)},pe=(e,t=`blank`,n)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:`status`,"aria-live":`polite`},message:e,pauseDuration:0,...n,id:n?.id||z()}),Y=e=>(t,n)=>{let r=pe(t,e,n);return J(r.toasterId||fe(r.id))({type:2,toast:r}),r.id},X=(e,t)=>Y(`blank`)(e,t);X.error=Y(`error`),X.success=Y(`success`),X.loading=Y(`loading`),X.custom=Y(`custom`),X.dismiss=(e,t)=>{let n={type:3,toastId:e};t?J(t)(n):q(n)},X.dismissAll=e=>X.dismiss(void 0,e),X.remove=(e,t)=>{let n={type:4,toastId:e};t?J(t)(n):q(n)},X.removeAll=e=>X.remove(void 0,e),X.promise=(e,t,n)=>{let r=X.loading(t.loading,{...n,...n?.loading});return typeof e==`function`&&(e=e()),e.then(e=>{let i=t.success?R(t.success,e):void 0;return i?X.success(i,{id:r,...n,...n?.success}):X.dismiss(r),e}).catch(e=>{let i=t.error?R(t.error,e):void 0;i?X.error(i,{id:r,...n,...n?.error}):X.dismiss(r)}),e};var me=P`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,he=P`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,ge=P`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,_e=I(`div`)`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||`#ff4b4b`};
  position: relative;
  transform: rotate(45deg);

  animation: ${me} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${he} 0.15s ease-out forwards;
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
    animation: ${ge} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,ve=P`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,ye=I(`div`)`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||`#e0e0e0`};
  border-right-color: ${e=>e.primary||`#616161`};
  animation: ${ve} 1s linear infinite;
`,be=P`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,xe=P`
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
}`,Se=I(`div`)`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||`#61d345`};
  position: relative;
  transform: rotate(45deg);

  animation: ${be} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${xe} 0.2s ease-out forwards;
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
`,Ce=I(`div`)`
  position: absolute;
`,we=I(`div`)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,Z=P`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Te=I(`div`)`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Z} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,Ee=({toast:e})=>{let{icon:t,type:n,iconTheme:r}=e;return t===void 0?n===`blank`?null:y.createElement(we,null,y.createElement(ye,{...r}),n!==`loading`&&y.createElement(Ce,null,n===`error`?y.createElement(_e,{...r}):y.createElement(Se,{...r}))):typeof t==`string`?y.createElement(Te,null,t):t},De=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,Oe=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,ke=`0%{opacity:0;} 100%{opacity:1;}`,Ae=`0%{opacity:1;} 100%{opacity:0;}`,je=I(`div`)`
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
`,Me=I(`div`)`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,Ne=(e,t)=>{let n=e.includes(`top`)?1:-1,[r,i]=B()?[ke,Ae]:[De(n),Oe(n)];return{animation:t?`${P(r)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${P(i)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}};y.memo(({toast:e,position:t,style:n,children:r})=>{let i=e.height?Ne(e.position||t||`top-center`,e.visible):{opacity:0},a=y.createElement(Ee,{toast:e}),o=y.createElement(Me,{...e.ariaProps},R(e.message,e));return y.createElement(je,{className:e.className,style:{...i,...n,...e.style}},typeof r==`function`?r({icon:a,message:o}):y.createElement(y.Fragment,null,a,o))}),F(y.createElement),A`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;var Q=X,$=t(),Pe=[`Overview`,`Admission`,`Fee & Expenses`,`Scholarships`,`Reviews`,`Past Papers`];function Fe(){let{slug:e}=oe(),[t,n]=(0,y.useState)(null),[i,b]=(0,y.useState)(!0),[x,S]=(0,y.useState)(!1),[C,w]=(0,y.useState)(`Overview`),[T,E]=(0,y.useState)(5),[D,O]=(0,y.useState)(``),[k,A]=(0,y.useState)([]),[j,M]=(0,y.useState)(null),{isWatched:N,addUniversity:P,removeUniversity:F}=ae();(0,y.useEffect)(()=>{b(!0),S(!1),n(null),fetch(`/api/universities/`+e).then(e=>e.json()).then(e=>{e.university?n(e.university):S(!0),b(!1)}).catch(()=>{S(!0),b(!1)})},[e]),(0,y.useEffect)(()=>{C!==`Past Papers`||!t||fetch(`/api/pastpapers?universityId=`+t._id).then(e=>e.json()).then(e=>A(Array.isArray(e)?e:[])).catch(()=>A([]))},[C,t]);let I=async()=>{if(!D.trim()){Q.error(`Please write your review first`);return}try{let e=JSON.parse(localStorage.getItem(`rahbar-auth`)||`{}`)?.state?.token;if(!e){Q.error(`Please login to submit a review`);return}let n=await fetch(`/api/universities/`+t._id+`/reviews`,{method:`POST`,headers:{"Content-Type":`application/json`,Authorization:`Bearer `+e},body:JSON.stringify({rating:T,text:D})}),r=await n.json();if(!n.ok)throw Error(r.message);Q.success(`Review submitted for approval!`),O(``)}catch(e){Q.error(e.message)}},L=async()=>{try{let e=JSON.parse(localStorage.getItem(`rahbar-auth`)||`{}`)?.state?.token;if(!e){Q.error(`Please login to set an alert`);return}let n=await fetch(`/api/alerts`,{method:`POST`,headers:{"Content-Type":`application/json`,Authorization:`Bearer `+e},body:JSON.stringify({universityId:t._id,universityName:t.name,deadline:t.admissionDeadline})}),r=await n.json();if(!n.ok)throw Error(r.message);Q.success(r.message)}catch(e){Q.error(e.message)}},R=async e=>{try{await fetch(`/api/pastpapers/`+e._id+`/download`,{method:`POST`})}catch{}window.open(e.fileUrl,`_blank`)};if(i)return(0,$.jsx)(`div`,{className:`flex items-center justify-center min-h-[60vh]`,children:(0,$.jsxs)(`div`,{className:`text-center`,children:[(0,$.jsx)(ee,{size:32,className:`animate-spin text-blue-600 mx-auto mb-3`}),(0,$.jsx)(`p`,{className:`text-slate-500 text-sm`,children:`Loading university details...`})]})});if(x||!t)return(0,$.jsxs)(`div`,{className:`max-w-2xl mx-auto px-4 py-20 text-center`,children:[(0,$.jsx)(g,{size:48,className:`mx-auto mb-4 text-slate-300`}),(0,$.jsx)(`h2`,{className:`text-2xl font-bold text-slate-700 mb-2`,style:{fontFamily:`Sora`},children:`University Not Found`}),(0,$.jsx)(`p`,{className:`text-slate-500 mb-6`,children:`This university does not exist or has not been approved yet.`}),(0,$.jsx)(h,{to:`/search`,className:`text-blue-600 hover:underline`,children:`← Back to Search`})]});let z=t._id||t.id,B=N(z),V=ce(se(t.admissionDeadline)),H=()=>{B?F(z):P({...t,id:z})},U={red:`text-red-600`,orange:`text-orange-500`,yellow:`text-yellow-600`,green:`text-green-600`},W=`https://wa.me/923455589079?text=`+encodeURIComponent(`Hi, I want 10 years past papers for `+t.name);return(0,$.jsxs)($.Fragment,{children:[(0,$.jsxs)(r,{children:[(0,$.jsxs)(`title`,{children:[t.name,` — Admission, Merit, Fee | MyRahbar`]}),(0,$.jsx)(`meta`,{name:`description`,content:t.name+` admission details, merit, fee, scholarships. Updated 2025.`})]}),(0,$.jsx)(`div`,{className:`bg-white border-b border-slate-200`,children:(0,$.jsxs)(`div`,{className:`max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-2 text-xs text-slate-500`,children:[(0,$.jsx)(h,{to:`/`,className:`hover:text-slate-700`,children:`Home`}),(0,$.jsx)(s,{size:12}),(0,$.jsx)(h,{to:`/search`,className:`hover:text-slate-700`,children:`Universities`}),(0,$.jsx)(s,{size:12}),(0,$.jsx)(`span`,{className:`text-slate-700`,children:t.shortName})]})}),(0,$.jsx)(`div`,{className:`max-w-7xl mx-auto px-4 py-6`,children:(0,$.jsxs)(`div`,{className:`flex flex-col lg:flex-row gap-6`,children:[(0,$.jsxs)(`div`,{className:`flex-1 min-w-0`,children:[(0,$.jsxs)(`div`,{className:`bg-white rounded-2xl border border-slate-200 p-6 mb-5`,children:[(0,$.jsxs)(`div`,{className:`flex items-start justify-between gap-4 flex-wrap`,children:[(0,$.jsxs)(`div`,{className:`flex items-start gap-4`,children:[(0,$.jsx)(`div`,{className:`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shrink-0`,style:{background:`var(--navy)`,fontFamily:`Sora`},children:t.shortName?.slice(0,2)}),(0,$.jsxs)(`div`,{children:[(0,$.jsxs)(`div`,{className:`flex flex-wrap gap-2 mb-2`,children:[(0,$.jsx)(`span`,{className:`text-xs font-medium px-2 py-0.5 rounded-full `+(t.type===`government`?`bg-blue-50 text-blue-700`:`bg-purple-50 text-purple-700`),children:t.type===`government`?`Government`:`Private`}),t.admissionOpen?(0,$.jsx)(`span`,{className:`text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700`,children:`Admissions Open`}):(0,$.jsx)(`span`,{className:`text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-700`,children:`Admissions Closed`})]}),(0,$.jsx)(`h1`,{className:`text-2xl font-bold`,style:{fontFamily:`Sora`,color:`var(--navy)`},children:t.name}),(0,$.jsxs)(`div`,{className:`flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500`,children:[(0,$.jsxs)(`span`,{className:`flex items-center gap-1`,children:[(0,$.jsx)(d,{size:13}),t.city]}),(0,$.jsxs)(`span`,{className:`flex items-center gap-1`,children:[(0,$.jsx)(f,{size:13,className:`text-amber-400`,fill:`currentColor`}),t.overallRating,` (`,t.reviewCount,` reviews)`]}),(0,$.jsxs)(`span`,{className:`flex items-center gap-1`,children:[(0,$.jsx)(g,{size:13}),`Est. `,t.established]}),t.website&&(0,$.jsxs)(`a`,{href:t.website,target:`_blank`,rel:`noopener noreferrer`,className:`flex items-center gap-1 text-blue-600 hover:underline`,children:[(0,$.jsx)(ue,{size:13}),`Official Site`]})]})]})]}),(0,$.jsxs)(`button`,{onClick:H,className:`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors `+(B?`bg-red-50 text-red-600 border-red-200`:`bg-white text-slate-600 border-slate-200 hover:border-red-200 hover:text-red-500`),children:[(0,$.jsx)(_,{size:15,fill:B?`currentColor`:`none`}),B?`Saved`:`Save`]})]}),t.campuses?.length>0&&(0,$.jsx)(`div`,{className:`mt-4 flex flex-wrap gap-2`,children:t.campuses.map(e=>(0,$.jsxs)(`span`,{className:`flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full`,children:[(0,$.jsx)(d,{size:10}),e]},e))})]}),(0,$.jsxs)(`div`,{className:`bg-white rounded-2xl border border-slate-200 overflow-hidden`,children:[(0,$.jsx)(`div`,{className:`flex overflow-x-auto border-b border-slate-200`,children:Pe.map(e=>(0,$.jsx)(`button`,{onClick:()=>w(e),className:`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors `+(C===e?`border-blue-600 text-blue-700`:`border-transparent text-slate-500 hover:text-slate-700`),children:e},e))}),(0,$.jsxs)(`div`,{className:`p-6`,children:[C===`Overview`&&(0,$.jsxs)(`div`,{className:`space-y-6`,children:[(0,$.jsx)(`h3`,{className:`font-semibold text-slate-800`,style:{fontFamily:`Sora`},children:`Departments Offered`}),t.departments?.length===0&&(0,$.jsx)(`p`,{className:`text-slate-400 text-sm`,children:`No departments added yet.`}),(0,$.jsx)(`div`,{className:`grid gap-3`,children:t.departments?.map(e=>(0,$.jsxs)(`div`,{className:`flex items-center justify-between bg-slate-50 rounded-xl p-4`,children:[(0,$.jsxs)(`div`,{children:[(0,$.jsx)(`p`,{className:`font-medium text-slate-800 text-sm`,children:e.name}),(0,$.jsxs)(`p`,{className:`text-xs text-slate-500 mt-0.5`,children:[`Merit: `,e.seats?.merit,` | Self-Finance:`,` `,e.seats?.selfFinance]})]}),(0,$.jsxs)(`div`,{className:`text-right`,children:[(0,$.jsxs)(`p`,{className:`text-sm font-semibold`,style:{fontFamily:`DM Mono`,color:`var(--navy)`},children:[v(e.semesterFee),`/sem`]}),e.lastMerit?.[0]&&(0,$.jsxs)(`p`,{className:`text-xs text-slate-500 mt-0.5`,children:[`Last Merit: `,e.lastMerit[0].closing,`%`]})]})]},e.name))})]}),C===`Admission`&&(0,$.jsxs)(`div`,{className:`space-y-6`,children:[(0,$.jsxs)(`div`,{children:[(0,$.jsx)(`h3`,{className:`font-semibold text-slate-800 mb-3`,style:{fontFamily:`Sora`},children:`Aggregate Formula`}),(0,$.jsx)(`div`,{className:`flex flex-wrap gap-3`,children:Object.entries(t.aggregateFormula||{}).map(([e,t])=>(0,$.jsxs)(`div`,{className:`bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-center flex-1`,children:[(0,$.jsx)(`p`,{className:`text-xs text-blue-600 uppercase font-medium`,children:e}),(0,$.jsxs)(`p`,{className:`text-xl font-bold text-blue-800 mt-0.5`,style:{fontFamily:`DM Mono`},children:[(t*100).toFixed(0),`%`]})]},e))}),t.departments?.some(e=>e.lastMerit?.length>0)&&(0,$.jsxs)(`div`,{className:`mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4`,children:[(0,$.jsx)(`h4`,{className:`text-sm font-semibold text-slate-700 mb-3`,children:`Last Closing Merit %`}),(0,$.jsx)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 gap-2`,children:t.departments.map(e=>(0,$.jsxs)(`div`,{className:`flex justify-between text-sm py-1 border-b border-slate-100 last:border-0`,children:[(0,$.jsx)(`span`,{className:`text-slate-600`,children:e.name}),(0,$.jsx)(`span`,{className:`font-semibold`,style:{fontFamily:`DM Mono`,color:`var(--navy)`},children:e.lastMerit?.[0]?.closing?e.lastMerit[0].closing+`%`:`N/A`})]},e.name))})]}),(0,$.jsxs)(`p`,{className:`text-sm text-slate-500 mt-3`,children:[`Test Required:`,` `,(0,$.jsx)(`span`,{className:`font-medium text-slate-700`,children:t.testRequired})]})]}),t.requiredDocuments?.length>0&&(0,$.jsxs)(`div`,{children:[(0,$.jsx)(`h3`,{className:`font-semibold text-slate-800 mb-3`,style:{fontFamily:`Sora`},children:`Required Documents`}),(0,$.jsx)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 gap-2`,children:t.requiredDocuments.map(e=>(0,$.jsxs)(`div`,{className:`flex items-center gap-2 text-sm text-slate-700`,children:[(0,$.jsx)(l,{size:14,className:`text-green-500 shrink-0`}),e]},e))})]}),(0,$.jsx)(`div`,{className:`bg-amber-50 border border-amber-200 rounded-xl p-4`,children:(0,$.jsxs)(`p`,{className:`text-sm font-medium text-amber-800 flex items-center gap-2`,children:[(0,$.jsx)(c,{size:14}),`Admission Fee: `,v(t.admissionFee),` `,`(non-refundable)`]})}),(0,$.jsxs)(h,{to:`/document-tools`,className:`inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800`,children:[(0,$.jsx)(m,{size:14}),`Compress and prepare your documents →`]})]}),C===`Fee & Expenses`&&(0,$.jsxs)(`div`,{className:`space-y-5`,children:[(0,$.jsx)(`h3`,{className:`font-semibold text-slate-800`,style:{fontFamily:`Sora`},children:`Fee by Department`}),(0,$.jsx)(`div`,{className:`overflow-x-auto`,children:(0,$.jsxs)(`table`,{className:`w-full text-sm`,children:[(0,$.jsx)(`thead`,{children:(0,$.jsxs)(`tr`,{className:`bg-slate-50`,children:[(0,$.jsx)(`th`,{className:`text-left px-4 py-3 text-slate-600 font-medium border-b border-slate-200`,children:`Department`}),(0,$.jsx)(`th`,{className:`text-right px-4 py-3 text-slate-600 font-medium border-b border-slate-200`,children:`Per Semester`})]})}),(0,$.jsx)(`tbody`,{children:t.departments?.map(e=>(0,$.jsxs)(`tr`,{className:`border-b border-slate-100 hover:bg-slate-50`,children:[(0,$.jsx)(`td`,{className:`px-4 py-3 text-slate-700`,children:e.name}),(0,$.jsx)(`td`,{className:`px-4 py-3 text-right font-medium`,style:{fontFamily:`DM Mono`,color:`var(--navy)`},children:v(e.semesterFee)})]},e.name))})]})}),(0,$.jsxs)(`div`,{className:`bg-orange-50 border border-orange-200 rounded-xl p-4`,children:[(0,$.jsx)(`p`,{className:`text-sm font-medium text-orange-800`,children:`💡 Hidden Charges Tip`}),(0,$.jsx)(`p`,{className:`text-xs text-orange-700 mt-1`,children:`Students often report extra costs like printing, library card, sports fund. Always ask a current student before applying.`})]})]}),C===`Scholarships`&&(0,$.jsxs)(`div`,{className:`space-y-4`,children:[(0,$.jsx)(`h3`,{className:`font-semibold text-slate-800 mb-4`,style:{fontFamily:`Sora`},children:`Available Scholarships`}),t.scholarships?.length===0&&(0,$.jsx)(`p`,{className:`text-slate-400 text-sm`,children:`No scholarships listed yet.`}),t.scholarships?.map(e=>(0,$.jsxs)(`div`,{className:`flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl p-4`,children:[(0,$.jsx)(le,{size:16,className:`text-green-600 mt-0.5 shrink-0`}),(0,$.jsxs)(`div`,{children:[(0,$.jsx)(`p`,{className:`font-medium text-green-800 text-sm`,children:e}),(0,$.jsx)(`p`,{className:`text-xs text-green-600 mt-0.5`,children:`Check official website for eligibility and deadlines.`})]})]},e)),(0,$.jsxs)(`div`,{className:`bg-blue-50 rounded-xl p-4`,children:[(0,$.jsx)(`p`,{className:`text-sm font-medium text-blue-800 mb-1`,children:`HEC Need-Based Support`}),(0,$.jsx)(`p`,{className:`text-xs text-blue-700`,children:`All government universities qualify. Apply at hec.gov.pk with income certificate.`})]})]}),C===`Reviews`&&(0,$.jsxs)(`div`,{className:`space-y-4`,children:[(0,$.jsxs)(`div`,{className:`flex items-center gap-4 bg-slate-50 rounded-xl p-4`,children:[(0,$.jsxs)(`div`,{className:`text-center`,children:[(0,$.jsx)(`p`,{className:`text-4xl font-bold`,style:{fontFamily:`Sora`,color:`var(--navy)`},children:t.overallRating||0}),(0,$.jsx)(`div`,{className:`flex gap-0.5 mt-1 justify-center`,children:[1,2,3,4,5].map(e=>(0,$.jsx)(f,{size:12,className:e<=Math.round(t.overallRating)?`text-amber-400`:`text-slate-300`,fill:`currentColor`},e))}),(0,$.jsxs)(`p`,{className:`text-xs text-slate-500 mt-0.5`,children:[t.reviewCount,` reviews`]})]}),(0,$.jsx)(`p`,{className:`text-sm text-slate-600 flex-1`,children:`Share your experience to help future students.`})]}),(0,$.jsxs)(`div`,{className:`border border-slate-200 rounded-xl p-4`,children:[(0,$.jsx)(`p`,{className:`text-sm font-medium text-slate-700 mb-3`,children:`Write a Review`}),(0,$.jsx)(`div`,{className:`flex gap-1 mb-3`,children:[1,2,3,4,5].map(e=>(0,$.jsx)(`button`,{onClick:()=>E(e),children:(0,$.jsx)(f,{size:22,className:e<=T?`text-amber-400`:`text-slate-300`,fill:e<=T?`currentColor`:`none`})},e))}),(0,$.jsx)(`textarea`,{value:D,onChange:e=>O(e.target.value),placeholder:`Share your experience about faculty, campus, fees...`,rows:3,className:`w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-blue-400 resize-none`}),(0,$.jsx)(`button`,{onClick:I,className:`mt-2 px-4 py-2 text-sm font-medium text-white rounded-xl`,style:{background:`var(--navy)`},children:`Submit Review`})]})]}),C===`Past Papers`&&(0,$.jsxs)(`div`,{className:`space-y-4`,children:[(0,$.jsxs)(`div`,{className:`flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4`,children:[(0,$.jsx)(l,{size:16,className:`text-green-600 shrink-0`}),(0,$.jsx)(`p`,{className:`text-sm text-green-800`,children:`Free papers available below. For 10 years complete package contact on WhatsApp.`})]}),k.length===0&&(0,$.jsxs)(`div`,{className:`text-center py-8 bg-slate-50 rounded-xl`,children:[(0,$.jsx)(m,{size:32,className:`mx-auto mb-3 text-slate-300`}),(0,$.jsx)(`p`,{className:`text-slate-500 text-sm`,children:`No papers uploaded yet for this university.`}),(0,$.jsxs)(`a`,{href:W,target:`_blank`,rel:`noopener noreferrer`,className:`inline-flex items-center gap-2 mt-3 text-sm font-medium text-white px-4 py-2 rounded-xl`,style:{background:`#25D366`},children:[(0,$.jsx)(p,{size:14}),`Ask on WhatsApp`]})]}),(0,$.jsx)(`div`,{className:`grid gap-3`,children:k.map(e=>(0,$.jsxs)(`div`,{className:`flex items-center justify-between bg-slate-50 rounded-xl p-4`,children:[(0,$.jsxs)(`div`,{children:[(0,$.jsx)(`p`,{className:`font-medium text-slate-700 text-sm`,children:e.subject}),(0,$.jsxs)(`p`,{className:`text-xs text-slate-400 mt-0.5`,children:[e.year,` • `,e.degreeLevel,` •`,` `,e.fileSize]})]}),(0,$.jsxs)(`div`,{className:`flex gap-2`,children:[(0,$.jsxs)(`button`,{onClick:()=>M(e.fileUrl),className:`flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100`,children:[(0,$.jsx)(te,{size:12}),` View`]}),(0,$.jsxs)(`button`,{onClick:()=>R(e),className:`flex items-center gap-1 text-xs font-medium text-white px-3 py-1.5 rounded-lg`,style:{background:`var(--green)`},children:[(0,$.jsx)(u,{size:12}),` Download`]})]})]},e._id))}),(0,$.jsxs)(`a`,{href:W,target:`_blank`,rel:`noopener noreferrer`,className:`flex items-center justify-between bg-slate-900 rounded-xl p-4 text-white hover:bg-slate-800 transition-colors`,children:[(0,$.jsxs)(`div`,{children:[(0,$.jsx)(`p`,{className:`font-semibold text-sm`,children:`Get 10 Years Past Papers`}),(0,$.jsx)(`p`,{className:`text-xs text-slate-400 mt-0.5`,children:`2014–2024 solved papers • Fast delivery via WhatsApp`})]}),(0,$.jsxs)(`div`,{className:`flex items-center gap-2 bg-green-500 text-white text-xs font-bold px-3 py-2 rounded-lg shrink-0`,children:[(0,$.jsx)(p,{size:14}),`Order Now`]})]})]})]})]})]}),(0,$.jsxs)(`div`,{className:`lg:w-72 shrink-0 space-y-4`,children:[(0,$.jsxs)(`div`,{className:`bg-white rounded-2xl border border-slate-200 p-5`,children:[(0,$.jsx)(`p`,{className:`text-xs text-slate-500 uppercase font-medium tracking-wider mb-3`,children:`Admission Deadline`}),(0,$.jsx)(`div`,{className:`text-2xl font-bold mb-1 `+(U[V.color]||`text-slate-600`),style:{fontFamily:`DM Mono`},children:V.text}),(0,$.jsx)(`p`,{className:`text-sm text-slate-500`,children:t.admissionDeadline?new Date(t.admissionDeadline).toLocaleDateString(`en-PK`,{day:`numeric`,month:`long`,year:`numeric`}):`Not set`}),(0,$.jsx)(`a`,{href:t.website||`#`,target:`_blank`,rel:`noopener noreferrer`,className:`mt-4 block w-full py-3 text-white text-sm font-semibold rounded-xl text-center`,style:{background:`var(--green)`},children:`Apply Now →`}),(0,$.jsxs)(`button`,{onClick:L,className:`mt-2 w-full py-2.5 text-sm font-medium rounded-xl border flex items-center justify-center gap-2 bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 transition-colors`,children:[(0,$.jsx)(a,{size:14}),`Set Deadline Alert`]}),(0,$.jsxs)(`button`,{onClick:H,className:`mt-2 w-full py-2.5 text-sm font-medium rounded-xl border transition-colors flex items-center justify-center gap-2 `+(B?`bg-red-50 text-red-600 border-red-200`:`bg-white text-slate-600 border-slate-200 hover:border-slate-300`),children:[(0,$.jsx)(_,{size:14,fill:B?`currentColor`:`none`}),B?`Remove from Watchlist`:`Add to Watchlist`]})]}),(0,$.jsxs)(`div`,{className:`bg-white rounded-2xl border border-slate-200 p-5`,children:[(0,$.jsx)(`p`,{className:`text-sm font-semibold text-slate-700 mb-2`,children:`Compare Universities`}),(0,$.jsxs)(h,{to:`/compare?uni1=`+t.slug,className:`flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800`,children:[(0,$.jsx)(o,{size:14}),`Add to comparison →`]})]}),(0,$.jsxs)(`div`,{className:`bg-blue-50 border border-blue-200 rounded-2xl p-5`,children:[(0,$.jsxs)(`p`,{className:`text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2`,children:[(0,$.jsx)(re,{size:14}),` Check Your Chances`]}),(0,$.jsx)(`p`,{className:`text-xs text-blue-600 mb-3`,children:`Calculate your aggregate and see if you qualify.`}),(0,$.jsx)(h,{to:`/merit-calculator?uni=`+t.slug,className:`block w-full text-center py-2 bg-blue-700 text-white text-sm font-medium rounded-xl hover:bg-blue-800 transition-colors`,children:`Calculate Merit`})]}),(0,$.jsxs)(`div`,{className:`bg-white rounded-2xl border border-slate-200 p-5`,children:[(0,$.jsx)(`p`,{className:`text-sm font-semibold text-slate-700 mb-1`,children:`Need Help Deciding?`}),(0,$.jsx)(`p`,{className:`text-xs text-slate-500 mb-3`,children:`Book a 1-on-1 counseling session with an expert.`}),(0,$.jsxs)(h,{to:`/counseling`,className:`flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800`,children:[(0,$.jsx)(ne,{size:13}),`Book Counseling →`]})]})]})]})}),j&&(0,$.jsx)(`div`,{className:`fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4`,onClick:()=>M(null),children:(0,$.jsxs)(`div`,{className:`bg-white rounded-2xl overflow-hidden w-full max-w-4xl`,style:{height:`88vh`},onClick:e=>e.stopPropagation(),children:[(0,$.jsxs)(`div`,{className:`flex items-center justify-between px-5 py-3 border-b border-slate-200`,children:[(0,$.jsx)(`p`,{className:`font-semibold text-slate-700 text-sm`,children:`Paper Preview`}),(0,$.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,$.jsxs)(`a`,{href:j,download:!0,className:`flex items-center gap-1.5 text-xs font-medium text-white px-3 py-1.5 rounded-lg`,style:{background:`var(--green)`},children:[(0,$.jsx)(u,{size:13}),` Download`]}),(0,$.jsx)(`button`,{onClick:()=>M(null),className:`p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100`,children:(0,$.jsx)(ie,{size:18})})]})]}),(0,$.jsx)(`iframe`,{src:j+`#toolbar=0`,className:`w-full`,style:{height:`calc(100% - 53px)`},title:`Paper Preview`})]})})]})}export{Fe as default};