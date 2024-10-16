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
export default function SideNav() {
  const pathname = usePathname();
  const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false);
  const [isProblemsDropdownOpen, setIsProblemsDropdownOpen] = useState(false);
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);
  const [isAnnouncementDropdownOpen, setIsAnnouncementDropdownOpen] =
    useState(false);
  const [isContestDropdownOpen, setIsContestDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // 햄버거 메뉴 상태

  const closeAllDropdowns = () => {
    setIsStudentDropdownOpen(false);
    setIsProblemsDropdownOpen(false);
    setIsCourseDropdownOpen(false);
    setIsAnnouncementDropdownOpen(false);
    setIsContestDropdownOpen(false);
    setMenuOpen(false);
  };

  return (
    <nav className="flex justify-center w-screen h-20 text-sm font-semibold shadow-xl bg-primary 2xl:w-52 2xl:min-h-screen 2xl:fixed 2xl:left-0 2xl:top-0 text-secondary">
      <div className="flex 2xl:flex-col items-center justify-between 2xl:justify-normal w-[100%] px-[5%] 2xl:px-0 2xl:min-h-screen relative">
        {/* 로고 이미지 */}
        <div className="relative min-w-9 2xl:min-w-16 min-h-9 2xl:min-h-16 2xl:mt-11">
          <Link href="/admin/dashboard" onClick={closeAllDropdowns}>
            <Image
              src="/commons/whiteSymbol.png"
              alt="logo"
              layout="fill"
              objectFit="contain"
            />
          </Link>
        </div>

        {/* 햄버거 메뉴 버튼 (2XL 이하에서만 보임) */}
        <div className="text-white 2xl:hidden">
          <GiHamburgerMenu
            className="text-3xl cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          />
        </div>

        {/* 메뉴 (2XL 이상에서 표시) */}
        <div className="hidden 2xl:flex flex-col justify-between w-full px-[15%] mt-12 pb-[10%] h-full overflow-y-auto ">
          <div className="space-y-8">
            <Link href="/admin/dashboard" onClick={closeAllDropdowns}>
              <div
                className={`flex justify-between items-center ${
                  pathname === '/admin/dashboard'
                    ? 'text-white underline decoration-dotted '
                    : 'text-white'
                }`}
              >
                <div className="flex  items-center transition ">
                  <LuLayoutDashboard className="mr-2 text-lg" />
                  <span> 대시보드</span>
                </div>
              </div>
            </Link>

            {/* 강의 드롭다운 */}
            <div>
              <div
                className={`flex justify-between cursor-pointer items-center ${
                  pathname.startsWith('/admin/course')
                    ? 'text-white underline decoration-dotted'
                    : 'text-white'
                }`}
                onClick={() => setIsCourseDropdownOpen(!isCourseDropdownOpen)}
              >
                <div className="flex items-center transition">
                  <PiBookOpenTextLight className="mr-2 text-xl" />
                  <span>강의</span>
                </div>
                {isCourseDropdownOpen ? (
                  <RiArrowDropUpLine className="text-3xl" />
                ) : (
                  <RiArrowDropDownLine className="text-3xl" />
                )}
              </div>
              <ul
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
                  <Link href="/admin/course/list" onClick={closeAllDropdowns}>
                    강의 목록
                  </Link>
                </li>
                <li
                  className={`transition mt-5 ${
                    pathname === '/admin/course/enroll'
                      ? 'text-white underline decoration-dotted'
                      : 'text-white'
                  }`}
                >
                  <Link href="/admin/course/enroll" onClick={closeAllDropdowns}>
                    강의 개설
                  </Link>
                </li>
              </ul>
            </div>

            {/* 학생 드롭다운 */}
            <div>
              <div
                className={`flex justify-between cursor-pointer items-center ${
                  pathname.startsWith('/admin/student')
                    ? 'text-white underline decoration-dotted'
                    : 'text-white'
                }`}
                onClick={() => setIsStudentDropdownOpen(!isStudentDropdownOpen)}
              >
                <div className="flex items-center transition">
                  <PiStudent className="mr-2 text-xl" />
                  <span>학생</span>
                </div>
                {isStudentDropdownOpen ? (
                  <RiArrowDropUpLine className="text-3xl" />
                ) : (
                  <RiArrowDropDownLine className="text-3xl" />
                )}
              </div>
              <ul
                className={`list-disc overflow-hidden transition-all duration-500 ease-in-out pl-8 space-y-4 ${
                  isStudentDropdownOpen ? 'max-h-40' : 'max-h-0'
                }`}
              >
                <li
                  className={`transition mt-5 ${
                    pathname === '/admin/student/list'
                      ? 'text-white underline decoration-dotted'
                      : 'text-white'
                  }`}
                >
                  <Link href="/admin/student/list" onClick={closeAllDropdowns}>
                    학생 목록
                  </Link>
                </li>
                <li
                  className={`transition mt-5 ${
                    pathname === '/admin/student/enroll'
                      ? 'text-white underline decoration-dotted'
                      : 'text-white'
                  }`}
                >
                  <Link
                    href="/admin/student/enroll"
                    onClick={closeAllDropdowns}
                  >
                    학생 등록
                  </Link>
                </li>
              </ul>
            </div>
            {/* 문제 드롭다운 */}
            <div>
              <div
                className={`flex justify-between cursor-pointer items-center ${
                  pathname.startsWith('/admin/problems')
                    ? 'text-white underline decoration-dotted'
                    : 'text-white'
                }`}
                onClick={() =>
                  setIsProblemsDropdownOpen(!isProblemsDropdownOpen)
                }
              >
                <div className="flex items-center transition">
                  <HiOutlinePencilSquare className="mr-2 text-xl" />
                  <span>문제</span>
                </div>
                {isProblemsDropdownOpen ? (
                  <RiArrowDropUpLine className="text-3xl" />
                ) : (
                  <RiArrowDropDownLine className="text-3xl" />
                )}
              </div>
              <ul
                className={`list-disc overflow-hidden transition-all duration-500 ease-in-out pl-8 space-y-4 ${
                  isProblemsDropdownOpen ? 'max-h-40' : 'max-h-0'
                }`}
              >
                <Link href="/admin/problems/list" onClick={closeAllDropdowns}>
                  <li
                    className={`transition mt-5 ${
                      pathname === '/admin/problems/list'
                        ? 'text-white underline decoration-dotted'
                        : 'text-white'
                    }`}
                  >
                    전체 문제 목록
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
              </ul>
            </div>

            {/* 대회 드롭다운 */}
            <div>
              <div
                className={`flex justify-between cursor-pointer items-center ${
                  pathname.startsWith('/admin/contest')
                    ? 'text-white underline decoration-dotted'
                    : 'text-white'
                }`}
                onClick={() => setIsContestDropdownOpen(!isContestDropdownOpen)}
              >
                <div className="flex items-center transition">
                  <GoTrophy className="mr-2 text-xl" />
                  <span>대회</span>
                </div>
                {isContestDropdownOpen ? (
                  <RiArrowDropUpLine className="text-3xl" />
                ) : (
                  <RiArrowDropDownLine className="text-3xl" />
                )}
              </div>
              <ul
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
                  <Link href="/admin/contest/list" onClick={closeAllDropdowns}>
                    대회 목록
                  </Link>
                </li>
                <li
                  className={`transition ${
                    pathname === '/admin/contest/enroll'
                      ? 'text-white underline decoration-dotted'
                      : 'text-white'
                  }`}
                >
                  <Link
                    href="/admin/contest/enroll"
                    onClick={closeAllDropdowns}
                  >
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
              </ul>
            </div>
            {/* 공지 드롭다운 */}
            <div>
              <div
                className={`flex justify-between cursor-pointer items-center ${
                  pathname.startsWith('/admin/announcement')
                    ? 'text-white underline decoration-dotted'
                    : 'text-white'
                }`}
                onClick={() =>
                  setIsAnnouncementDropdownOpen(!isAnnouncementDropdownOpen)
                }
              >
                <div className="flex items-center transition">
                  <IoMegaphoneOutline className="mr-2 text-xl" />
                  <span>공지</span>
                </div>
                {isAnnouncementDropdownOpen ? (
                  <RiArrowDropUpLine className="text-3xl" />
                ) : (
                  <RiArrowDropDownLine className="text-3xl" />
                )}
              </div>
              <ul
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
                    href="/admin/announcement/list"
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
              </ul>
            </div>
          </div>
          {/* 로그아웃 */}
          <Link href="/" className="mt-5">
            <div className="flex items-center text-white transition cursor-pointer hover:text-secondaryHover ">
              <MdLogout className="mr-2 text-xl" />
              <span>로그아웃</span>
            </div>
          </Link>
        </div>
        {/* 2xl 이하 메뉴 (햄버거 메뉴 클릭 시 열림) */}
        <div
          className={`absolute top-20 left-0 w-screen  bg-white shadow-md flex flex-col justify-center items-center space-y-4 2xl:hidden z-50 overflow-hidden transition-all duration-[360ms] ease-in-out ${
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
              closeAllDropdowns();
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
              onClick={() => setIsCourseDropdownOpen(!isCourseDropdownOpen)}
            >
              <span className="flex items-center">
                <PiBookOpenTextLight className="mr-2 text-xl" />
                강의
              </span>
              {isCourseDropdownOpen ? (
                <RiArrowDropUpLine className="text-3xl" />
              ) : (
                <RiArrowDropDownLine className="text-3xl" />
              )}
            </div>
            {isCourseDropdownOpen && (
              <ul className="w-full space-y-2 bg-white">
                <Link
                  href="/admin/course/list"
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
                  href="/admin/course/enroll"
                  onClick={() => {
                    setMenuOpen(!menuOpen);
                    closeAllDropdowns();
                  }}
                >
                  <li
                    className={`w-full flex justify-center items-center py-2 hover:bg-gray-100 ${
                      pathname === '/admin/course/enroll' &&
                      'text-primary font-semibold'
                    }`}
                  >
                    강의 개설
                  </li>
                </Link>
              </ul>
            )}
          </div>

          {/* 학생 드롭다운 */}
          <div className="w-full">
            <div
              className={`flex justify-center cursor-pointer items-center px-5 py-3 hover:bg-gray-100 ${
                pathname.startsWith('/admin/student') &&
                'text-primary font-semibold'
              }`}
              onClick={() => setIsStudentDropdownOpen(!isStudentDropdownOpen)}
            >
              <span className="flex items-center">
                <PiStudent className="mr-2 text-xl" />
                학생
              </span>
              {isStudentDropdownOpen ? (
                <RiArrowDropUpLine className="text-3xl" />
              ) : (
                <RiArrowDropDownLine className="text-3xl" />
              )}
            </div>
            {isStudentDropdownOpen && (
              <ul className="w-full space-y-2 bg-white">
                <Link
                  href="/admin/student/list"
                  onClick={() => {
                    setMenuOpen(!menuOpen);
                    closeAllDropdowns();
                  }}
                >
                  <li
                    className={`w-full flex justify-center items-center py-2 hover:bg-gray-100 ${
                      pathname === '/admin/student/list' &&
                      'text-primary font-semibold'
                    }`}
                  >
                    학생 목록
                  </li>
                </Link>
                <Link
                  href="/admin/student/enroll"
                  onClick={() => {
                    setMenuOpen(!menuOpen);
                    closeAllDropdowns();
                  }}
                >
                  <li
                    className={`w-full flex justify-center items-center py-2 hover:bg-gray-100 ${
                      pathname === '/admin/student/enroll' &&
                      'text-primary font-semibold'
                    }`}
                  >
                    학생 등록
                  </li>
                </Link>
              </ul>
            )}
          </div>

          {/* 문제 드롭다운 */}
          <div className="w-full">
            <div
              className={`flex justify-center cursor-pointer items-center px-5 py-3 hover:bg-gray-100 ${
                pathname.startsWith('/admin/problems') &&
                'text-primary font-semibold'
              }`}
              onClick={() => setIsProblemsDropdownOpen(!isProblemsDropdownOpen)}
            >
              <span className="flex items-center">
                <HiOutlinePencilSquare className="mr-2 text-xl" />
                문제
              </span>
              {isProblemsDropdownOpen ? (
                <RiArrowDropUpLine className="text-3xl" />
              ) : (
                <RiArrowDropDownLine className="text-3xl" />
              )}
            </div>
            {isProblemsDropdownOpen && (
              <ul className="w-full py-2 space-y-2 bg-white">
                <Link
                  href="/admin/problems/list"
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
                    전체 문제 목록
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
            )}
          </div>

          {/* 대회 드롭다운 */}
          <div className="w-full">
            <div
              className={`flex justify-center cursor-pointer items-center px-5 py-3 hover:bg-gray-100 ${
                pathname.startsWith('/admin/contest') &&
                'text-primary font-semibold'
              }`}
              onClick={() => setIsContestDropdownOpen(!isContestDropdownOpen)}
            >
              <span className="flex items-center">
                <GoTrophy className="mr-2 text-xl" />
                대회
              </span>
              {isContestDropdownOpen ? (
                <RiArrowDropUpLine className="text-3xl" />
              ) : (
                <RiArrowDropDownLine className="text-3xl" />
              )}
            </div>
            {isContestDropdownOpen && (
              <ul className="w-full py-2 space-y-2 bg-white">
                <Link
                  href="/admin/contest/list"
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
                  href="/admin/contest/enroll"
                  onClick={() => {
                    setMenuOpen(!menuOpen);
                    closeAllDropdowns();
                  }}
                >
                  <li
                    className={`w-full flex justify-center items-center py-2 hover:bg-gray-100 ${
                      pathname === '/admin/contest/enroll' &&
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
            )}
          </div>

          {/* 공지 드롭다운 */}
          <div className="w-full">
            <div
              className={`flex justify-center cursor-pointer items-center px-5 py-3 hover:bg-gray-100 ${
                pathname.startsWith('/admin/announcement') &&
                'text-primary font-semibold'
              }`}
              onClick={() =>
                setIsAnnouncementDropdownOpen(!isAnnouncementDropdownOpen)
              }
            >
              <span className="flex items-center">
                <IoMegaphoneOutline className="mr-2 text-xl" />
                공지
              </span>
              {isAnnouncementDropdownOpen ? (
                <RiArrowDropUpLine className="text-3xl" />
              ) : (
                <RiArrowDropDownLine className="text-3xl" />
              )}
            </div>
            {isAnnouncementDropdownOpen && (
              <ul className="w-full py-2 space-y-2 bg-white">
                <Link
                  href="/admin/announcement/list"
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
            )}
          </div>
          {/* 로그아웃 */}
          <Link
            href="/"
            className="flex items-center justify-center w-full py-4 hover:bg-gray-100"
          >
            <span className="flex items-center cursor-pointer">
              로그아웃 <MdLogout className="ml-2 text-lg " />
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
