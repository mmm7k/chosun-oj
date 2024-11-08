'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { MdLogout } from 'react-icons/md';
import { GiHamburgerMenu } from 'react-icons/gi';
import api from '@/services/account/api';
import { logout } from '@/services/account/login';

export default function HeaderNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  if (
    pathname.includes('/problems/') ||
    pathname.match(/^\/student\/assignment\/[^\/]+\/[^\/]+$/) ||
    pathname.match(/^\/student\/contest\/[^\/]+\/[^\/]+$/)
  ) {
    return null; // 헤더를 렌더링하지 않음
  }

  // const logout = async () => {
  //   try {
  //     const response = await api.get('/account/logout/');
  //     router.push('/'); // 로그아웃 후 리다이렉트
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error during logout:', error);
  //     throw error;
  //   }
  // };

  const onClickLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error: any) {
      alert(error.response?.data?.message);
      router.push('/');
    }
  };

  return (
    <nav className="flex justify-center h-20 border-b border-gray-200 min-w-screen lg:h-16 text-secondary">
      <div className="w-[90%] md:[80%] lg:w-[62%] h-full flex  items-center">
        {/* 로고 */}

        <Link
          href="/student"
          className="flex items-center text-lg font-semibold"
        >
          <div className="relative w-9 h-9">
            <Image
              src={'/commons/symbol.png'}
              alt="Logo"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <span className="text-primary">&nbsp;Chosun&nbsp;</span>
          <span>Online Judge</span>
        </Link>

        {/* 햄버거 메뉴 */}
        <div className="ml-auto sm:hidden">
          <GiHamburgerMenu
            className="text-3xl cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          />
        </div>

        {/* 메뉴 (sm 이상에서만 표시) */}
        <section className="hidden sm:flex ml-[3%] space-x-9">
          <Link href={'/student/problems?category=all'}>
            <span
              className={`cursor-pointer transition ${
                pathname.startsWith('/student/problems')
                  ? 'text-primary border-b-4 border-primary pb-[1.5rem] lg:pb-[1rem] hover:text-primaryHover hover:border-primaryHover'
                  : 'hover:text-secondaryHover'
              }`}
            >
              문제
            </span>
          </Link>

          <Link href={'/student/ranking'}>
            <span
              className={`cursor-pointer transition ${
                pathname.startsWith('/student/ranking')
                  ? 'text-primary border-b-4 border-primary pb-[1.5rem] lg:pb-[1rem] hover:text-primaryHover hover:border-primaryHover'
                  : 'hover:text-secondaryHover'
              }`}
            >
              랭킹
            </span>
          </Link>

          <Link href={'/student/questions/common'}>
            <span
              className={`cursor-pointer transition ${
                pathname.startsWith('/student/questions')
                  ? 'text-primary border-b-4 border-primary  pb-[1.5rem] lg:pb-[1rem] hover:text-primaryHover hover:border-primaryHover'
                  : 'hover:text-secondaryHover'
              }`}
            >
              Q&A
            </span>
          </Link>
          <Link href={'/student/announcement/common'}>
            <span
              className={`cursor-pointer transition ${
                pathname.startsWith('/student/announcement')
                  ? 'text-primary border-b-4 border-primary  pb-[1.5rem] lg:pb-[1rem] hover:text-primaryHover hover:border-primaryHover'
                  : 'hover:text-secondaryHover'
              }`}
            >
              공지
            </span>
          </Link>
          <Link href={'/student/assignment'}>
            <span
              className={`cursor-pointer transition ${
                pathname.startsWith('/student/assignment')
                  ? 'text-primary border-b-4 border-primary  pb-[1.5rem] lg:pb-[1rem] hover:text-primaryHover hover:border-primaryHover'
                  : 'hover:text-secondaryHover'
              }`}
            >
              과제
            </span>
          </Link>
          <Link href={'/student/contest'}>
            <span
              className={`cursor-pointer transition ${
                pathname.startsWith('/student/contest')
                  ? 'text-primary border-b-4 border-primary  pb-[1.5rem] lg:pb-[1rem] hover:text-primaryHover hover:border-primaryHover'
                  : 'hover:text-secondaryHover'
              }`}
            >
              대회
            </span>
          </Link>
        </section>
        {/* )} */}

        {/* 로그아웃 (sm 이상에서만 표시) */}

        <section className="items-center hidden ml-auto sm:flex">
          <div
            onClick={onClickLogout}
            className="flex items-center transition cursor-pointer hover:text-secondaryHover"
          >
            <span>로그아웃</span>
            <MdLogout className="ml-2 text-xl" />
          </div>
        </section>
      </div>
      {/* 모바일 메뉴 (햄버거 메뉴 클릭 시 열림) */}
      <section
        className={`absolute top-20 left-0 w-full bg-white shadow-md flex flex-col items-center space-y-4 sm:hidden z-50 overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen
            ? 'max-h-120 opacity-100 visible'
            : 'max-h-0 opacity-0 invisible'
        }`}
      >
        <Link
          href={'/student/problems?category=all'}
          className={`w-full flex justify-center items-center py-3 hover:bg-gray-100  ${
            pathname.startsWith('/student/problems') && 'text-primary'
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="font-semibold transition cursor-pointer ">문제</span>
        </Link>

        <Link
          href={'/student/ranking'}
          className={`w-full flex justify-center items-center py-3 hover:bg-gray-100  ${
            pathname.startsWith('/student/ranking') && 'text-primary'
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="font-semibold transition cursor-pointer ">랭킹</span>
        </Link>

        <Link
          href={'/student/questions/common'}
          className={`w-full flex justify-center items-center py-3 hover:bg-gray-100  ${
            pathname.startsWith('/student/questions') && 'text-primary   '
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="font-semibold transition cursor-pointer ">Q&A</span>
        </Link>

        <Link
          href={'/student/announcement/common'}
          className={`w-full flex justify-center items-center py-3 hover:bg-gray-100  ${
            pathname.startsWith('/student/announcement') && 'text-primary   '
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="font-semibold transition cursor-pointer ">공지</span>
        </Link>
        <Link
          href={'/student/assignment'}
          className={`w-full flex justify-center items-center py-3 hover:bg-gray-100  ${
            pathname.startsWith('/student/assignment') && 'text-primary   '
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="font-semibold transition cursor-pointer ">과제</span>
        </Link>
        <Link
          href={'/student/contest'}
          className={`w-full flex justify-center items-center py-3 hover:bg-gray-100  ${
            pathname.startsWith('/student/contest') && 'text-primary   '
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="font-semibold transition cursor-pointer ">대회</span>
        </Link>

        <div
          className="flex items-center justify-center w-full py-3 hover:bg-gray-100 "
          onClick={onClickLogout}
        >
          <span className="flex items-center font-semibold transition cursor-pointer">
            로그아웃 <MdLogout className="ml-2 text-lg" />
          </span>
        </div>
      </section>
    </nav>
  );
}
