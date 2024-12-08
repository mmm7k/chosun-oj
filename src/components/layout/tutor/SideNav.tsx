'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { MdLogout, MdOutlineTask } from 'react-icons/md';
import { GiHamburgerMenu } from 'react-icons/gi';
import { logout } from '@/services/accountUser/login';
import { FiHome } from 'react-icons/fi';
import useUserStore from '@/store/userstore';
import { HiOutlinePencilSquare } from 'react-icons/hi2';
export default function SideNav() {
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false); // 햄버거 메뉴 상태
  const { clearUser } = useUserStore();

  const onClickLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error: any) {
      // alert(error.response?.data?.message);
      router.push('/login');
    } finally {
      clearUser();
    }
  };

  return (
    // <nav className="flex justify-center w-screen h-20 text-sm font-semibold bg-white shadow-xl md:w-52 md:min-h-screen md:fixed md:left-0 md:top-0 text-secondary">
    <nav className="flex justify-center max-w-[100vw] h-16 text-sm font-semibold shadow-xl bg-white   text-secondary">
      {/* <div className="flex md:flex-col items-center justify-between md:justify-normal w-[100%] px-[5%] md:px-0 md:min-h-screen relative"> */}
      <div className="flex items-center justify-between w-full px-[5%] relative">
        {/* 로고 이미지 */}
        {/* <div className="relative min-w-9 md:min-w-16 min-h-9 md:min-h-16 md:mt-11"> */}
        <div className="relative min-w-9 min-h-9 ">
          <Link
            href="/student"

            // onClick={closeAllDropdowns}
          >
            <Image
              src="/commons/symbol.png"
              alt="logo"
              layout="fill"
              objectFit="contain"
            />
          </Link>
        </div>

        {/* 햄버거 메뉴 버튼 (2XL 이하에서만 보임) */}
        <div className="md:hidden">
          <GiHamburgerMenu
            className="text-3xl cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          />
        </div>

        {/* 메뉴 (2XL 이상에서 표시) */}
        {/* <div className="hidden md:flex flex-col justify-between w-full px-[15%] mt-12 pb-[10%] h-full overflow-y-auto "> */}
        <div className="hidden md:flex flex-1">
          {/* <section className="space-y-8"> */}
          <section className="w-full flex  items-center text-lg space-x-8 ml-[5%]">
            {/* 문제 드롭다운 */}
            <div>
              <div
                className={`flex justify-between cursor-pointer items-center ${
                  pathname.startsWith('/tutor/problems')
                    ? 'text-primary hover:text-primaryHover'
                    : 'text-secondary hover:text-secondaryHover'
                }`}
              >
                <Link href="/tutor/problems/list?page=1">
                  <div className="flex items-center transition">
                    <HiOutlinePencilSquare className="mr-2 text-xl" />
                    <span className="text-base">문제</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* 퀴즈 드롭다운 */}
            <div>
              <div
                className={`flex justify-between cursor-pointer items-center ${
                  pathname.startsWith('/tutor/assignment')
                    ? 'text-primary hover:text-primaryHover'
                    : 'text-secondary hover:text-secondaryHover'
                }`}
              >
                <Link href="/tutor/assignment/list?page=1">
                  <div className="flex items-center transition">
                    <MdOutlineTask className="mr-2 text-xl" />
                    <span className="text-base">퀴즈</span>
                  </div>
                </Link>
              </div>
            </div>
          </section>

          <section className="flex justify-end space-x-5 flex-shrink-0">
            <Link
              href={'/student'}
              className="flex items-center transition cursor-pointer hover:text-secondaryHover"
            >
              <FiHome className=" mr-2 text-xl " />
              <span className="text-base">메인페이지</span>
            </Link>

            <div
              className="flex items-center transition cursor-pointer hover:text-secondaryHover"
              onClick={onClickLogout}
            >
              <MdLogout className="mr-2 text-xl" />
              <span className="text-base">로그아웃</span>
            </div>
          </section>
        </div>
        {/* md 이하 메뉴 (햄버거 메뉴 클릭 시 열림) */}
        <div
          className={`absolute top-16 left-0 w-screen  bg-white shadow-md flex flex-col justify-center items-center space-y-4 md:hidden z-50 overflow-hidden transition-all duration-[360ms] ease-in-out ${
            menuOpen
              ? 'max-h-auto opacity-100 visible'
              : 'max-h-0 opacity-0 invisible'
          }`}
        >
          {/* 문제 드롭다운 */}
          <div className="w-full">
            <div
              className={`flex justify-center cursor-pointer items-center px-5 py-3 hover:bg-gray-100 ${
                pathname.startsWith('/tutor/problems') &&
                'text-primary font-semibold'
              }`}
            >
              <Link
                href="/tutor/problems/list?page=1"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {' '}
                <span className="flex items-center">
                  <HiOutlinePencilSquare className="mr-2 text-xl" />
                  문제
                </span>
              </Link>
            </div>
          </div>

          {/* 퀴즈 드롭다운 */}
          <div className="w-full">
            <div
              className={`flex justify-center cursor-pointer items-center px-5 py-3 hover:bg-gray-100 ${
                pathname.startsWith('/tutor/assignment') &&
                'text-primary font-semibold'
              }`}
            >
              <Link
                href="/tutor/assignment/list?page=1"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <span className="flex items-center">
                  <MdOutlineTask className="mr-2 text-xl" />
                  퀴즈
                </span>
              </Link>
            </div>
          </div>

          <Link
            href={'/student'}
            className="flex items-center justify-center w-full py-4 hover:bg-gray-100"
          >
            <div className="flex items-center cursor-pointer ">
              <FiHome className=" mr-2 text-lg " />

              <span>메인페이지</span>
            </div>
          </Link>
          {/* 로그아웃 */}
          <div
            onClick={onClickLogout}
            className="flex items-center justify-center w-full py-4 hover:bg-gray-100"
          >
            <span className="flex items-center cursor-pointer">
              <MdLogout className="mr-2 text-lg" />
              로그아웃
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
