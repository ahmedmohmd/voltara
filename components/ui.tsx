"use client";
export const Card=({children,className=""}:any)=><div className={"rounded-2xl border border-line bg-card/80 p-5 shadow-sm backdrop-blur transition "+className}>{children}</div>;
export const Btn=({className="",ghost,...p}:any)=><button {...p} className={"rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 "+(ghost?"border border-line hover:border-brand ":"bg-brand text-white hover:opacity-90 ")+className}/>;
export const Modal=({open,onClose,title,children}:any)=>open?<div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={onClose}><div className="w-full max-w-md rounded-2xl border border-line bg-card p-6" onClick={e=>e.stopPropagation()}><h3 className="mb-4 text-lg font-semibold">{title}</h3>{children}</div></div>:null;
export const inp="w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-brand";
