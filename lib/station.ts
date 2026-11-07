export type Day={date:string;gens:number;fuel:number;pv:number;mv:number};
export const FULL=["January","February","March","April","May","June","July","August","September","October","November","December"];
export const calc=(d:{gens:number;fuel:number;pv:number;mv:number})=>{const tot=d.gens+d.pv;return{tot,share:tot?d.pv/tot:0,sfc:d.fuel?d.gens/d.fuel:0,loss:tot-d.mv,lossPct:tot?(tot-d.mv)/tot:0}};
