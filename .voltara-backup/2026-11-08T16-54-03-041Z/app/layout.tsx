import "./globals.css";import {ThemeProvider} from "next-themes";
export const metadata={title:"Load Profile Manager",description:"Analyze, store and compare electricity load profiles for all your clients."};
export default function L({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><body><ThemeProvider attribute="class" defaultTheme="system" enableSystem>{children}</ThemeProvider></body></html>}
