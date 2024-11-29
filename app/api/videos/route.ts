import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
    try {
        const videos = await prisma.video.findMany({
            orderBy: { createdAt: "desc" }
        })
        return NextResponse.json(videos)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return NextResponse.json({ error: "Error fetching videos" }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }

}