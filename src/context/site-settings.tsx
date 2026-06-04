"use client";

import React, { createContext, useContext } from "react";
import type { JamboapiSettings } from "@/lib/jamboapi";

// Create context with null default so we can detect misuse
const SiteSettingsContext = createContext<JamboapiSettings | null>(null);

interface ProviderProps {
	settings: JamboapiSettings;
	children: React.ReactNode;
}

export function SiteSettingsProvider({ settings, children }: ProviderProps) {
	return (
		<SiteSettingsContext.Provider value={settings}>
			{children}
		</SiteSettingsContext.Provider>
	);
}

export function useSiteSettings(): JamboapiSettings {
	const ctx = useContext(SiteSettingsContext);
	if (!ctx) {
		throw new Error("useSiteSettings must be used within a SiteSettingsProvider");
	}
	return ctx;
} 