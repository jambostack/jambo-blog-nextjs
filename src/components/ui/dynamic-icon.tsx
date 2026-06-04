"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

// Convert kebab-case icon names coming from CMS to PascalCase names exported by lucide-react
function toPascalCase(kebab: string): string {
    return kebab
        .split("-")
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");
}

export interface DynamicIconProps extends ComponentProps<"svg"> {
    /** Icon name as stored in CMS, e.g. "monitor-smartphone" */
    name: string;
}

export default function DynamicIcon({ name, ...rest }: DynamicIconProps) {
    const Icon = dynamic(async () => {
        const lib = await import("lucide-react");
        // Attempt to find by PascalCase key; default to HelpCircle if not found
        const key = toPascalCase(name);
        return (lib as any)[key] || (lib as any)["HelpCircle"];
    }, { ssr: false });

    return <Icon {...rest} />;
} 