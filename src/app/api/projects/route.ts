import { getFeaturedProjects } from "@/actions/project.actions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const projects = await getFeaturedProjects();
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
