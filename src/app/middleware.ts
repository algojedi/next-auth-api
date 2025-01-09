import { NextRequest } from "next/server";
import { getUser } from "./middleware/requireUser";

export async function middleware(req: NextRequest) {

	// filter responses based on request route
	if (req.nextUrl.pathname === "/api/me") {
		return getUser(req)
	}
}

// Apply middleware to specific routes
export const config = {
  matcher: ['/api/me'], // Add all protected routes here
};
