import { type PropsWithChildren } from 'react'
import { ThemeProvider } from 'next-themes'

export function ClientProviders({ children }: PropsWithChildren) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			{children}
		</ThemeProvider>
	)
}
