import Shell from "@/components/shell";import {MeProvider} from "@/components/me";
export default function L({children}:{children:React.ReactNode}){return <MeProvider><Shell>{children}</Shell></MeProvider>}
