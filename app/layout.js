import '../styles/globals.css'

export const metadata = {
  title: 'Virtual Surprise Party Room',
  description: 'Create unforgettable moments with friends and family, no matter the distance.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />
      </head>
      <body>{children}</body>
    </html>
  )
}
