import { NextResponse } from "next/server";
import { cmsConfig } from "@/config/cms";
import axios from "axios";

/**
 * POST /api/newsletter
 * Body: { email: string }
 *
 * Creates a new entry in the `newsletter` collection in JamboApi.
 */
export async function POST(request: Request) {
    try {
        const { email } = await request.json();
        if (!email || typeof email !== "string") {
            return NextResponse.json({ message: "Invalid email" }, { status: 400 });
        }

        if (!cmsConfig.createKey) {
            console.error("Missing JAMBOAPI_CREATE_KEY env variable for newsletter submissions");
            return NextResponse.json({ message: "Server misconfiguration" }, { status: 500 });
        }

        const jamboapiRes = await axios.post(
            `${cmsConfig.apiUrl}/newsletter`,
            { data: { "email": email } },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cmsConfig.createKey}`,
                    "project-id": cmsConfig.projectId ?? "",
                },
                validateStatus: () => true, // we want to forward non-2xx too
            },
        );

        return NextResponse.json(jamboapiRes.data, { status: jamboapiRes.status });
    } catch (err) {
        console.error("Newsletter API error", err);
        return NextResponse.json({ message: "Unexpected error" }, { status: 500 });
    }
} 