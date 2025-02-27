import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  console.log('미들웨어 실행');

  const pathname = req.nextUrl.pathname;

  // 쿠키에서 csrftoken과 sessionid 추출
  const csrftoken = req.cookies.get('csrftoken')?.value;
  const sessionid = req.cookies.get('sessionid')?.value;

  try {
    const response = await fetch(
      'http://chosuncnl.shop:8000/api/v1/account/user/type',

      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `csrftoken=${csrftoken}; sessionid=${sessionid}`,
        },
      },
    );

    if (!response.ok) {
      console.log(`유저 검증 실패: 상태 코드 ${response.status}`);
      // 유저 인증 실패 시 로그인 페이지 유지
      if (pathname === '/login' || pathname === '/signup') {
        console.log('로그인 페이지에서 인증 실패: 페이지 유지');
        return NextResponse.next();
      }
      // 다른 페이지로 접근 시 로그인 페이지로 리다이렉트
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const userData = await response.json();
    const role = userData.data;

    console.log('유저 권한:', role);

    // /login 또는 /signup 접근 시, 로그인된 유저는 /student로 리다이렉트
    if (
      ['/login', '/signup'].includes(pathname) &&
      ['Regular User', 'Professor', 'Super Admin'].includes(role)
    ) {
      console.log(
        '/login 또는 /signup 접근 시 권한 있는 유저는 /student로 리다이렉트',
      );
      return NextResponse.redirect(new URL('/student', req.url));
    }

    // 요청 경로에 따른 접근 제어
    if (pathname.startsWith('/admin') && role !== 'Super Admin') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    if (
      pathname.startsWith('/professor') &&
      !['Professor', 'Super Admin'].includes(role)
    ) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    if (
      pathname.startsWith('/tutor') &&
      !['Professor', 'Super Admin', 'Tutor'].includes(role)
    ) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    if (
      pathname.startsWith('/student') &&
      !['Regular User', 'Professor', 'Super Admin', 'Tutor'].includes(role)
    ) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    console.log('유저 검증 성공');
  } catch (error) {
    console.error('API 요청 실패:', error);
    // API 요청 실패 시 로그인 페이지로 리다이렉트
    if (pathname === '/login' || pathname === '/signup') {
      console.log('로그인 페이지에서 API 요청 실패: 페이지 유지');
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/student/:path*',
    '/professor/:path*',
    '/admin/:path*',
    '/tutor/:path*',
    '/login',
    '/signup',
  ],
};
