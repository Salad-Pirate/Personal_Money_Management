
import "./globals.css";
import {PmmContextProvider}  from '../app/context/PmmContext'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <PmmContextProvider>
          {children}
        </PmmContextProvider>
        
      </body>
    </html>
  );
}
