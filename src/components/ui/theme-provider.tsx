"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	const [mounted, setMounted] = React.useState(false);
	React.useEffect(() => setMounted(true), []);
	// Render children directly (without theme) during SSR to avoid
	// localStorage access errors in Next.js 15 + React 19 SSR context.
	if (!mounted) return <>{children}</>;
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}