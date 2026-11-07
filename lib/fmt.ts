export const P=(w:number)=>Math.abs(w)>=1e6?(w/1e6).toFixed(2)+" MW":(w/1e3).toFixed(1)+" kW";
export const E=(w:number)=>Math.abs(w)>=1e6?(w/1e6).toFixed(2)+" MWh":(w/1e3).toFixed(1)+" kWh";
export const MN=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
