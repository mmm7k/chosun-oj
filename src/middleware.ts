import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  // console.log('미들웨어 실행');

  // // 쿠키에서 csrftoken과 sessionid 추출
  // const csrftoken = req.cookies.get('csrftoken')?.value;
  // const sessionid = req.cookies.get('sessionid')?.value;

  // try {
  //   const response = await fetch(
  //     'http://chosuncnl.shop:8000/api/v1/account/profile/',
  //     {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         // 쿠키를 헤더에 명시적으로 추가
  //         Cookie: `csrftoken=${csrftoken}; sessionid=${sessionid}`,
  //       },
  //     },
  //   );

  //   if (!response.ok) {
  //     console.log(`유저 검증 실패: 상태 코드 ${response.status}`);
  //     return NextResponse.redirect('http://chosuncnl.shop:4000');
  //   }

  //   const userData = await response.json();
  //   const role = userData.data.admin_type;
  //   console.log('유저 정보:', userData);
  //   console.log('유저 권한:', role);

  //   // 요청 경로에 따른 접근 제어
  //   const pathname = req.nextUrl.pathname;

  //   if (pathname.startsWith('/admin') && role !== 'Super Admin') {
  //     return NextResponse.redirect('http://chosuncnl.shop:4000');
  //   }
  //   if (
  //     pathname.startsWith('/professor') &&
  //     !['Professor', 'Super Admin'].includes(role)
  //   ) {
  //     return NextResponse.redirect('http://chosuncnl.shop:4000');
  //   }
  //   if (
  //     pathname.startsWith('/student') &&
  //     !['Regular User', 'Professor', 'Super Admin'].includes(role)
  //   ) {
  //     return NextResponse.redirect('http://chosuncnl.shop:4000');
  //   }

  //   console.log('유저 검증 성공');
  // } catch (error) {
  //   console.error('API 요청 실패:', error);
  //   return NextResponse.redirect('http://chosuncnl.shop:4000');
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/student/:path*', '/professor/:path*', '/admin/:path*'],
};
