import { NextRequest, NextResponse } from "next/server";
import { cognito } from "@/helper/cognito";
import { ChangePasswordCommand } from "@aws-sdk/client-cognito-identity-provider";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const { previousPassword, proposedPassword } = await req.json();

    if (!previousPassword || !proposedPassword) {
      return NextResponse.json(
        { message: "Both current and new password are required." },
        { status: 400 }
      );
    }

    const session = await auth();
    const accessToken = session?.accessToken;

    if (!accessToken) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in again." },
        { status: 401 }
      );
    }

    const command = new ChangePasswordCommand({
      PreviousPassword: previousPassword,
      ProposedPassword: proposedPassword,
      AccessToken: accessToken,
    });

    await cognito.send(command);

    return NextResponse.json({ message: "Password changed successfully." });
  } catch (error: unknown) {
    console.error("Change password error:", error);
    const authError = error as { name?: string; message?: string };

    const message =
      authError.name === "NotAuthorizedException"
        ? "Current password is incorrect."
        : authError.name === "InvalidPasswordException"
        ? "New password does not meet requirements."
        : authError.name === "LimitExceededException"
        ? "Too many attempts. Please try again later."
        : authError.message || "Failed to change password.";

    return NextResponse.json({ message }, { status: 400 });
  }
}
