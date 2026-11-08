export function Pylon({className=""}:{className?:string}){
  return <svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
    <g fill="#fff"><circle cx="168" cy="26" r="13" fillOpacity=".16"/><circle cx="168" cy="26" r="6" fillOpacity=".22"/><circle cx="26" cy="22" r="1.6" className="animate-pulse"/><circle cx="46" cy="40" r="1.2" className="animate-pulse" style={{animationDelay:".6s"}}/><circle cx="150" cy="60" r="1.4" className="animate-pulse" style={{animationDelay:"1.1s"}}/></g>
    <g stroke="#fff" fill="none" strokeLinecap="round" strokeLinejoin="round"><g strokeWidth="2.2"><path d="M100 16 L84 120 M100 16 L116 120 M91 70 H109 M87 96 H113 M91 70 L113 96 M109 70 L87 96 M100 6 V16 M66 34 H134 M75 54 H125"/></g>
      <g strokeWidth="1.6" strokeOpacity=".85" className="flow"><path d="M66 34 Q33 54 0 38"/><path d="M134 34 Q167 54 200 38"/><path d="M75 54 Q38 76 0 58"/><path d="M125 54 Q162 76 200 58"/></g></g>
    <circle cx="100" cy="6" r="3" fill="#fff" className="animate-pulse"/><path d="M0 120 Q50 98 100 110 T200 102 V120Z" fill="#000" fillOpacity=".22"/></svg>}
