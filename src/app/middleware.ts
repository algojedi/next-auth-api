import { NextRequest, NextResponse } from "next/server";
import { getUser } from "./middleware/requireUser";

export async function middleware(req: NextRequest) {

	// filter responses based on request route
	if (req.nextUrl.pathname === "/api/me") {
		return getUser(req)
	}
	if (req.nextUrl.pathname === "/api/home") {
		return NextResponse.redirect(new URL('/', req.nextUrl))
	}
}

// Apply middleware to specific routes
export const config = {
  matcher: ['/api/me', '/api/home'], // Add all protected routes here
};
