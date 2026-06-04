import { NextRequest, NextResponse } from 'next/server';
import { cmsConfig } from "@/config/cms";
import axios from "axios";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, comment, post } = body;

        if (!cmsConfig.createKey) {
            console.error("Missing JAMBOAPI_CREATE_KEY env variable for comment submissions");
            return NextResponse.json({ message: "Server misconfiguration" }, { status: 500 });
        }

        const jamboapiRes = await axios.post(
            `${cmsConfig.apiUrl}/comments`,
            { data: { name, email, comment, post } },
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

    } catch (error) {
        console.error('Comment creation error:', error);
        return NextResponse.json({ message: "Unexpected error" }, { status: 500 });
    }
} 