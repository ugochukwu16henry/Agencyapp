import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const protectedRoutes = ["/dashboard/admin", "/api/properties/verify", "/dashboard/crm"];

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const path = request.nextUrl.pathname;
  const isProtected = protectedRoutes.some((route) => path.startsWith(route));
  if (!isProtected) return response;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const allowedAdmin = process.env.ADMIN_EMAIL ?? "admin@agencyapp.sl";

  if (!user || user.email !== allowedAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/admin/:path*", "/api/properties/verify"],
};
