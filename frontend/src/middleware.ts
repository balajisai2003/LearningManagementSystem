import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const cookieStore = cookies();
    const url = req.nextUrl;
    const role = (await cookieStore).get("role")?.value;

    if (url.pathname === '/') {
        return NextResponse.next();
    }

    if (!role) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    // Handle /l&d routes - only Admins can access
    if (url.pathname.startsWith('/l&d') && role !== "Admin") {
        return NextResponse.redirect(new URL('/', req.url));
    }

    // Handle /employee routes - both Admin and User can access
    if (url.pathname.startsWith('/employee') && (role !== "Admin" && role !== "user")) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/l&d/:path*', '/employee/:path*'],
};
