'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RiArrowDropDownLine, RiArrowDropUpLine } from 'react-icons/ri';
import { useState } from 'react';
import { PiBookOpenTextLight, PiStudent } from 'react-icons/pi';
import { LuLayoutDashboard } from 'react-icons/lu';
import { HiOutlinePencilSquare } from 'react-icons/hi2';
import { MdLogout } from 'react-icons/md';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoMegaphoneOutline } from 'react-icons/io5';
import { GoTrophy } from 'react-icons/go';
import { logout } from '@/services/accountUser/login';
import { useRouter } from 'next/navigation';
import { FiHome } from 'react-icons/fi';
import useUserStore from '@/store/userstore';
export default function SideNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false);
  const [isProblemsDropdownOpen, setIsProblemsDropdownOpen] = useState(false);
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);
  const [isAnnouncementDropdownOpen, setIsAnnouncementDropdownOpen] =
    useState(false);
  const [isContestDropdownOpen, setIsContestDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // 햄버거 메뉴 상태
  const { clearUser } = useUserStore();

  const closeAllDropdowns = () => {
    setIsStudentDropdownOpen(false);
    setIsProblemsDropdownOpen(false);
    setIsCourseDropdownOpen(false);
    setIsAnnouncementDropdownOpen(false);
    setIsContestDropdownOpen(false);
    setMenuOpen(false);
  };

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
    // <nav className="flex justify-center w-screen h-20 text-sm font-semibold shadow-xl bg-primary md:w-52 md:min-h-screen md:fixed md:left-0 md:top-0 text-secondary">
    <nav className="flex justify-center max-w-[100vw] h-16 text-sm font-semibold shadow-xl bg-primary  text-secondary">
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
              src="/commons/whiteSymbol.png"
              alt="logo"
              layout="fill"
              objectFit="contain"
            />
          </Link>
        </div>

        {/* 햄버거 메뉴 버튼 (2XL 이하에서만 보임) */}
        <div className="text-white md:hidden">
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
            <Link
              href="/admin/dashboard"
              //  onClick={closeAllDropdowns}
            >
              <div
                className={`flex justify-between items-center  ${
                  pathname === '/admin/dashboard'
                    ? 'text-white border-b-[2px]  border-white'
                    : 'text-white'
                }`}
              >
                {/* <div className="flex items-center transition"> */}

                <div className="flex items-center transition flex-shrink-0  ">
                  <LuLayoutDashboard className="mr-2 text-lg" />
                  <span className="text-base"> 대시보드</span>
                </div>
              </div>
            </Link>

            {/* 강의 드롭다운 */}
            <div>
              <div
                className={`flex justify-between cursor-pointer items-center ${
                  pathname.startsWith('/admin/course')
                    ? 'text-white border-b-[2px]  border-white'
                    : 'text-white'
                }`}
                // onClick={() => setIsCourseDropdownOpen(!isCourseDropdownOpen)}
              >
                <Link
                  href="/admin/course/list?page=1"
                  // onClick={closeAllDropdowns}
                >
                  <div className="flex items-center transition ">
                    <PiBookOpenTextLight className="mr-2 text-xl" />
                    <span className="text-base">강의</span>
                  </div>
                </Link>
                {/* {isCourseDropdownOpen ? (
                  <RiArrowDropUpLine className="text-3xl" />
                ) : (
                  <RiArrowDropDownLine className="text-3xl" />
                )} */}
              </div>
              {/* <ul
                className={`list-disc overflow-hidden transition-all duration-500 ease-in-out pl-8 space-y-4 ${
                  isCourseDropdownOpen ? 'max-h-40' : 'max-h-0'
                }`}
              >
                <li
                  className={`transition mt-5 ${
                    pathname === '/admin/course/list'
                      ? 'text-white underline decoration-dotted'
                      : 'text-white'
                  }`}
                >
                  <Link
                    href="/admin/course/list?page=1"
                    onClick={closeAllDropdowns}
                  >
                    강의 목록
                  </Link>
                </li>
                <li
                  className={`transition mt-5 ${
                    pathname === '/admin/course/post'
                      ? 'text-white underline decoration-dotted'
                      : 'text-white'
                  }`}
                >
                  <Link href="/admin/course/post" onClick={closeAllDropdowns}>
                    강의 개설
                  </Link>
                </li>
              </ul> */}
            </div>

            {/* 유저 드롭다운 */}
            <div>
              <div
                className={`flex justify-between cursor-pointer items-center ${
                  pathname.startsWith('/admin/user')
                    ? 'text-white border-b-[2px]  border-white'
                    : 'text-white'
                }`}
                // onClick={() => setIsStudentDropdownOpen(!isStudentDropdownOpen)}
              >
                <Link
                  href="/admin/user/list?page=1"
                  // onClick={closeAllDropdowns}
                >
                  <div className="flex items-center transition">
                    <PiStudent className="mr-2 text-xl" />
                    <span className="text-base">유저</span>
                  </div>
                </Link>
                {/* {isStudentDropdownOpen ? (
                  <RiArrowDropUpLine className="text-3xl" />
                ) : (
                  <RiArrowDropDownLine className="text-3xl" />
                )} */}
              </div>
              {/* <ul
                className={`list-disc overflow-hidden transition-all duration-500 ease-in-out pl-8 space-y-4 ${
                  isStudentDropdownOpen ? 'max-h-40' : 'max-h-0'
                }`}
              >
                <li
                  className={`transition mt-5 ${
                    pathname === '/admin/user/list'
                      ? 'text-white underline decoration-dotted'
                      : 'text-white'
                  }`}
                >
                  <Link
                    href="/admin/user/list?page=1"
                    onClick={closeAllDropdowns}
                  >
                    유저 목록
                  </Link>
                </li>
                <li
                  className={`transition mt-5 ${
                    pathname === '/admin/user/enroll'
                      ? 'text-white underline decoration-dotted'
                      : 'text-white'
                  }`}
                >
                  <Link href="/admin/user/enroll" onClick={closeAllDropdowns}>
                    유저 등록
                  </Link>
                </li>
              </ul> */}
            </div>
            {/* 문제 드롭다운 */}
            <div>
              <div
                className={`flex justify-between cursor-pointer items-center ${
                  pathname.startsWith('/admin/problems')
                    ? 'text-white border-b-[2px]  border-white'
                    : 'text-white'
                }`}
                // onClick={() =>
                //   setIsProblemsDropdownOpen(!isProblemsDropdownOpen)
                // }
              >
                <Link
                  href="/admin/problems/list?page=1"
                  // onClick={closeAllDropdowns}
                >
                  <div className="flex items-center transition">
                    <HiOutlinePencilSquare className="mr-2 text-xl" />
                    <span className="text-base">문제</span>
                  </div>
                </Link>
                {/* {isProblemsDropdownOpen ? (
                  <RiArrowDropUpLine className="text-3xl" />
                ) : (
                  <RiArrowDropDownLine className="text-3xl" />
                )} */}
              </div>
              {/* <ul
                className={`list-disc overflow-hidden transition-all duration-500 ease-in-out pl-8 space-y-4 ${
                  isProblemsDropdownOpen ? 'max-h-40' : 'max-h-0'
                }`}
              >
                <Link
                  href="/admin/problems/list?page=1"
                  onClick={closeAllDropdowns}
                >
                  <li
                    className={`transition mt-5 ${
                      pathname === '/admin/problems/list'
                        ? 'text-white underline decoration-dotted'
                        : 'text-white'
                    }`}
                  >
                    문제 목록
                  </li>
                </Link>
                <li
                  className={`transition ${
                    pathname === '/admin/problems/post'
                      ? 'text-white underline decoration-dotted'
                      : 'text-white'
                  }`}
                >
                  <Link href="/admin/problems/post" onClick={closeAllDropdowns}>
                    문제 등록
                  </Link>
                </li>
              </ul> */}
            </div>

            {/* 대회 드롭다운 */}
            <div>
              <div
                className={`flex justify-between cursor-pointer items-center ${
                  pathname.startsWith('/admin/contest')
                    ? 'text-white border-b-[2px]  border-white'
                    : 'text-white'
                }`}
                // onClick={() => setIsContestDropdownOpen(!isContestDropdownOpen)}
              >
                <Link
                  href="/admin/contest/list?page=1"
                  // onClick={closeAllDropdowns}
                >
                  {' '}
                  <div className="flex items-center transition">
                    <GoTrophy className="mr-2 text-xl" />
                    <span className="text-base">대회</span>
                  </div>
                </Link>
                {/* 
                {isContestDropdownOpen ? (
                  <RiArrowDropUpLine className="text-3xl" />
                ) : (
                  <RiArrowDropDownLine className="text-3xl" />
                )} */}
              </div>
              {/* <ul
                className={`list-disc overflow-hidden transition-all duration-500 ease-in-out pl-8 space-y-4 ${
                  isContestDropdownOpen ? 'max-h-40' : 'max-h-0'
                }`}
              >
                <li
                  className={`transition mt-5 ${
                    pathname === '/admin/contest/list'
                      ? 'text-white underline decoration-dotted'
                      : 'text-white'
                  }`}
                >
                  <Link
                    href="/admin/contest/list?page=1"
                    onClick={closeAllDropdowns}
                  >
                    대회 목록
                  </Link>
                </li>
                <li
                  className={`transition ${
                    pathname === '/admin/contest/post'
                      ? 'text-white underline decoration-dotted'
                      : 'text-white'
                  }`}
                >
                  <Link href="/admin/contest/post" onClick={closeAllDropdowns}>
                    대회 등록
                  </Link>
                </li>

                <li
                  className={`transition ${
                    pathname === '/admin/contest/submission'
                      ? 'text-white underline decoration-dotted'
                      : 'text-white'
                  }`}
                >
                  <Link
                    href="/admin/contest/submission"
                    onClick={closeAllDropdowns}
                  >
                    제출 확인
                  </Link>
                </li>
              </ul> */}
            </div>
            {/* 공지 드롭다운 */}
            <div>
              <div
                className={`flex justify-between cursor-pointer items-center ${
                  pathname.startsWith('/admin/announcement')
                    ? 'text-white border-b-[2px]  border-white'
                    : 'text-white'
                }`}
                // onClick={() =>
                //   setIsAnnouncementDropdownOpen(!isAnnouncementDropdownOpen)
                // }
              >
                <Link
                  href="/admin/announcement/list?page=1"
                  // onClick={closeAllDropdowns}
                >
                  <div className="flex items-center transition">
                    <IoMegaphoneOutline className="mr-2 text-xl" />
                    <span className="text-base">공지</span>
                  </div>
                </Link>
                {/* {isAnnouncementDropdownOpen ? (
                  <RiArrowDropUpLine className="text-3xl" />
                ) : (
                  <RiArrowDropDownLine className="text-3xl" />
                )} */}
              </div>
              {/* <ul
                className={`list-disc overflow-hidden transition-all duration-500 ease-in-out pl-8 space-y-4 ${
                  isAnnouncementDropdownOpen ? 'max-h-40' : 'max-h-0'
                }`}
              >
                <li
                  className={`transition mt-5 ${
                    pathname === '/admin/announcement/list'
                      ? 'text-white underline decoration-dotted'
                      : 'text-white'
                  }`}
                >
                  <Link
                    href="/admin/announcement/list?page=1"
                    onClick={closeAllDropdowns}
                  >
                    공지 목록
                  </Link>
                </li>
                <li
                  className={`transition ${
                    pathname === '/admin/announcement/post'
                      ? 'text-white underline decoration-dotted'
                      : 'text-white'
                  }`}
                >
                  <Link
                    href="/admin/announcement/post"
                    onClick={closeAllDropdowns}
                  >
                    공지 등록
                  </Link>
                </li>
              </ul> */}
            </div>
          </section>
          {/* <section className="space-y-4"> */}
          <section className="flex justify-end space-x-5 flex-shrink-0">
            <Link
              href={'/student'}
              className="flex items-center text-white transition cursor-pointer hover:text-secondaryHover"
            >
              <FiHome className=" mr-2 text-xl " />
              <span className="text-base">메인페이지</span>
            </Link>

            {/* 로그아웃 */}

            <div
              className="flex items-center text-white transition cursor-pointer hover:text-secondaryHover "
              onClick={onClickLogout}
            >
              <MdLogout className="mr-2 text-xl" />
              <span className="text-base">로그아웃</span>
            </div>
          </section>
          {/* </Link> */}
        </div>
        {/* md 이하 메뉴 (햄버거 메뉴 클릭 시 열림) */}
        <div
          className={`absolute top-16 left-0 w-screen  bg-white shadow-md flex flex-col justify-center items-center space-y-4 md:hidden z-50 overflow-hidden transition-all duration-[360ms] ease-in-out ${
            menuOpen
              ? 'max-h-auto opacity-100 visible'
              : 'max-h-0 opacity-0 invisible'
          }`}
        >
          <Link
            href="/admin/dashboard"
            className="flex items-center justify-center w-full py-4 hover:bg-gray-100"
            onClick={() => {
              setMenuOpen(!menuOpen);
              // closeAllDropdowns();
            }}
          >
            <span
              className={`${
                pathname === '/admin/dashboard' && 'text-primary font-semibold'
              }`}
            >
              대시보드
            </span>
          </Link>

          {/* 강의 드롭다운 */}
          <div className="w-full">
            <div
              className={`flex justify-center cursor-pointer items-center px-5 py-3 hover:bg-gray-100 ${
                pathname.startsWith('/admin/course') &&
                'text-primary font-semibold'
              }`}
              // onClick={() => setIsCourseDropdownOpen(!isCourseDropdownOpen)}
            >
              <Link
                href="/admin/course/list?page=1"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <span className="flex items-center">
                  <PiBookOpenTextLight className="mr-2 text-xl" />
                  강의
                </span>
              </Link>
              {/* {isCourseDropdownOpen ? (
                <RiArrowDropUpLine className="text-3xl" />
              ) : (
                <RiArrowDropDownLine className="text-3xl" />
              )} */}
            </div>
            {/* {isCourseDropdownOpen && (
              <ul className="w-full space-y-2 bg-white">
                <Link
                  href="/admin/course/list?page=1"
                  onClick={() => {
                    setMenuOpen(!menuOpen);
                    closeAllDropdowns();
                  }}
                >
                  <li
                    className={`w-full flex justify-center items-center py-2 hover:bg-gray-100 ${
                      pathname === '/admin/course/list' &&
                      'text-primary font-semibold'
                    }`}
                  >
                    강의 목록
                  </li>
                </Link>
                <Link
                  href="/admin/course/post"
                  onClick={() => {
                    setMenuOpen(!menuOpen);
                    closeAllDropdowns();
                  }}
                >
                  <li
                    className={`w-full flex justify-center items-center py-2 hover:bg-gray-100 ${
                      pathname === '/admin/course/post' &&
                      'text-primary font-semibold'
                    }`}
                  >
                    강의 개설
                  </li>
                </Link>
              </ul>
            )} */}
          </div>

          {/* 유저 드롭다운 */}
          <div className="w-full">
            <div
              className={`flex justify-center cursor-pointer items-center px-5 py-3 hover:bg-gray-100 ${
                pathname.startsWith('/admin/user') &&
                'text-primary font-semibold'
              }`}
              // onClick={() => setIsStudentDropdownOpen(!isStudentDropdownOpen)}
            >
              <Link
                href="/admin/user/list?page=1"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <span className="flex items-center">
                  <PiStudent className="mr-2 text-xl" />
                  유저
                </span>
              </Link>
              {/* {isStudentDropdownOpen ? (
                <RiArrowDropUpLine className="text-3xl" />
              ) : (
                <RiArrowDropDownLine className="text-3xl" />
              )} */}
            </div>
            {/* {isStudentDropdownOpen && (
              <ul className="w-full space-y-2 bg-white">
                <Link
                  href="/admin/user/list?page=1"
                  onClick={() => {
                    setMenuOpen(!menuOpen);
                    closeAllDropdowns();
                  }}
                >
                  <li
                    className={`w-full flex justify-center items-center py-2 hover:bg-gray-100 ${
                      pathname === '/admin/user/list' &&
                      'text-primary font-semibold'
                    }`}
                  >
                    유저 목록
                  </li>
                </Link>
                <Link
                  href="/admin/user/enroll"
                  onClick={() => {
                    setMenuOpen(!menuOpen);
                    closeAllDropdowns();
                  }}
                >
                  <li
                    className={`w-full flex justify-center items-center py-2 hover:bg-gray-100 ${
                      pathname === '/admin/user/enroll' &&
                      'text-primary font-semibold'
                    }`}
                  >
                    유저 등록
                  </li>
                </Link>
              </ul>
            )} */}
          </div>

          {/* 문제 드롭다운 */}
          <div className="w-full">
            <div
              className={`flex justify-center cursor-pointer items-center px-5 py-3 hover:bg-gray-100 ${
                pathname.startsWith('/admin/problems') &&
                'text-primary font-semibold'
              }`}
              // onClick={() => setIsProblemsDropdownOpen(!isProblemsDropdownOpen)}
            >
              <Link
                href="/admin/problems/list?page=1"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <span className="flex items-center">
                  <HiOutlinePencilSquare className="mr-2 text-xl" />
                  문제
                </span>
              </Link>
              {/* {isProblemsDropdownOpen ? (
                <RiArrowDropUpLine className="text-3xl" />
              ) : (
                <RiArrowDropDownLine className="text-3xl" />
              )} */}
            </div>
            {/* {isProblemsDropdownOpen && (
              <ul className="w-full py-2 space-y-2 bg-white">
                <Link
                  href="/admin/problems/list?page=1"
                  onClick={() => {
                    setMenuOpen(!menuOpen);
                    closeAllDropdowns();
                  }}
                >
                  <li
                    className={`w-full flex justify-center items-center py-2 hover:bg-gray-100 ${
                      pathname === '/admin/problems/list' &&
                      'text-primary font-semibold'
                    }`}
                  >
                    문제 목록
                  </li>
                </Link>

                <Link
                  href="/admin/problems/post"
                  onClick={() => {
                    setMenuOpen(!menuOpen);
                    closeAllDropdowns();
                  }}
                >
                  <li
                    className={`w-full flex justify-center items-center py-2 hover:bg-gray-100 ${
                      pathname === '/admin/problems/post' &&
                      'text-primary font-semibold'
                    }`}
                  >
                    문제 등록
                  </li>
                </Link>
              </ul>
            )} */}
          </div>

          {/* 대회 드롭다운 */}
          <div className="w-full">
            <div
              className={`flex justify-center cursor-pointer items-center px-5 py-3 hover:bg-gray-100 ${
                pathname.startsWith('/admin/contest') &&
                'text-primary font-semibold'
              }`}
              // onClick={() => setIsContestDropdownOpen(!isContestDropdownOpen)}
            >
              <Link
                href="/admin/contest/list?page=1"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <span className="flex items-center">
                  <GoTrophy className="mr-2 text-xl" />
                  대회
                </span>
              </Link>
              {/* {isContestDropdownOpen ? (
                <RiArrowDropUpLine className="text-3xl" />
              ) : (
                <RiArrowDropDownLine className="text-3xl" />
              )} */}
            </div>
            {/* {isContestDropdownOpen && (
              <ul className="w-full py-2 space-y-2 bg-white">
                <Link
                  href="/admin/contest/list?page=1"
                  onClick={() => {
                    setMenuOpen(!menuOpen);
                    closeAllDropdowns();
                  }}
                >
                  <li
                    className={`w-full flex justify-center items-center py-2 hover:bg-gray-100 ${
                      pathname === '/admin/contest/list' &&
                      'text-primary font-semibold'
                    }`}
                  >
                    대회 목록
                  </li>
                </Link>
                <Link
                  href="/admin/contest/post"
                  onClick={() => {
                    setMenuOpen(!menuOpen);
                    closeAllDropdowns();
                  }}
                >
                  <li
                    className={`w-full flex justify-center items-center py-2 hover:bg-gray-100 ${
                      pathname === '/admin/contest/post' &&
                      'text-primary font-semibold'
                    }`}
                  >
                    대회 등록
                  </li>
                </Link>

                <Link
                  href="/admin/contest/submission"
                  onClick={() => {
                    setMenuOpen(!menuOpen);
                    closeAllDropdowns();
                  }}
                >
                  <li
                    className={`w-full flex justify-center items-center py-2 hover:bg-gray-100 ${
                      pathname === '/admin/contest/submission' &&
                      'text-primary font-semibold'
                    }`}
                  >
                    제출 확인
                  </li>
                </Link>
              </ul>
            )} */}
          </div>

          {/* 공지 드롭다운 */}
          <div className="w-full">
            <div
              className={`flex justify-center cursor-pointer items-center px-5 py-3 hover:bg-gray-100 ${
                pathname.startsWith('/admin/announcement') &&
                'text-primary font-semibold'
              }`}
              // onClick={() =>
              //   setIsAnnouncementDropdownOpen(!isAnnouncementDropdownOpen)
              // }
            >
              <Link
                href="/admin/announcement/list?page=1"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <span className="flex items-center">
                  <IoMegaphoneOutline className="mr-2 text-xl" />
                  공지
                </span>
              </Link>
              {/* {isAnnouncementDropdownOpen ? (
                <RiArrowDropUpLine className="text-3xl" />
              ) : (
                <RiArrowDropDownLine className="text-3xl" />
              )} */}
            </div>
            {/* {isAnnouncementDropdownOpen && (
              <ul className="w-full py-2 space-y-2 bg-white">
                <Link
                  href="/admin/announcement/list?page=1"
                  onClick={() => {
                    setMenuOpen(!menuOpen);
                    closeAllDropdowns();
                  }}
                >
                  <li
                    className={`w-full flex justify-center items-center py-2 hover:bg-gray-100 ${
                      pathname === '/admin/announcement/list' &&
                      'text-primary font-semibold'
                    }`}
                  >
                    공지 목록
                  </li>
                </Link>
                <Link
                  href="/admin/announcement/post"
                  onClick={() => {
                    setMenuOpen(!menuOpen);
                    closeAllDropdowns();
                  }}
                >
                  <li
                    className={`w-full flex justify-center items-center py-2 hover:bg-gray-100 ${
                      pathname === '/admin/announcement/post' &&
                      'text-primary font-semibold'
                    }`}
                  >
                    공지 등록
                  </li>
                </Link>
              </ul>
            )} */}
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
            <div className="flex items-center cursor-pointer">
              <MdLogout className="mr-2 text-lg " />
              <span>로그아웃</span>{' '}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
