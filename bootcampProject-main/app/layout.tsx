import "./globals.css";
import Navbar from "./components/Navbar";
import Login from "./login/page";
import { LoginProvider } from "./context/loginContext";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LoginProvider>
          <Navbar/>
          {children}
        </LoginProvider>
          
      </body>
    </html>
  );
}
