import { getVisibleSkills } from "@/actions/skill.actions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const skills = await getVisibleSkills();
    return NextResponse.json({ success: true, data: skills });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
