'use client';

import { getAnnouncementUser } from '@/services/announcementUser/getAnnouncementUser';

import { getClassAnnouncementUser } from '@/services/announcementUser/getClassAnnouncementUser';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IoChevronDown, IoChevronUp, IoSearchSharp } from 'react-icons/io5';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { formattedDate } from '@/utils/dateFormatter';
import Skeleton from '@mui/material/Skeleton';
import { getClassListUser } from '@/services/classUser/getClassListUser';

export default function Announcement({
  params,
}: {
  params: { classid: string };
}) {
  const classId = params.classid;
  const decodedClass = decodeURIComponent(classId);
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const searchParams = useSearchParams();

  // 초기 페이지 설정
  const initialPage = Number(searchParams.get('page')) || 1;
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const pagesPerBlock = 5;

  // 클래스 리스트 데이터 가져오기
  const { data: classListData } = useQuery({
    queryKey: ['classListData'],
    queryFn: () => getClassListUser(),
  });
  const classList = classListData?.data?.data;
  const classItem = classList?.find(
    (item: any) => item.id === parseInt(classId),
  );

  // 공지사항 데이터 가져오기
  const fetchAnnouncementData = () => {
    if (classId === 'common') {
      return getAnnouncementUser(currentPage);
    } else {
      return getClassAnnouncementUser(currentPage, parseInt(classId));
    }
  };

  const {
    data: announcementData,
    refetch: announcementRefetch,
    isLoading,
  } = useQuery({
    queryKey: ['announcementData', classId, currentPage],
    queryFn: fetchAnnouncementData,
  });

  useEffect(() => {
    const newPath =
      classId === 'common'
        ? `/student/announcement/common?page=${currentPage}`
        : `/student/announcement/${classId}?page=${currentPage}`;
    router.push(newPath);
    announcementRefetch();
  }, [currentPage, router, announcementRefetch, classId]);

  const announcementList = announcementData?.data?.data || [];
  const totalPages = announcementData?.data?.total_count
    ? Math.ceil(announcementData.data.total_count / 15)
    : 1;

  // 페이지네이션 블록 계산
  const currentBlock = Math.ceil(currentPage / pagesPerBlock);
  const startPage = (currentBlock - 1) * pagesPerBlock + 1;
  const endPage = Math.min(startPage + pagesPerBlock - 1, totalPages);

  const changePage = (page: number) => {
    setCurrentPage(page);
  };

  const changePageBlock = (isNext: boolean) => {
    const newPage = isNext
      ? Math.min(endPage + 1, totalPages)
      : Math.max(startPage - pagesPerBlock, 1);
    changePage(newPage);
  };

  const toggleContent = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      {/* 모바일 카테고리 메뉴 */}
      <div className="block w-full bg-white lg:hidden">
        <div
          className="flex items-center justify-center py-4 border-b border-gray-200 cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="mr-2 font-semibold text-secondary">카테고리</span>
          {isMenuOpen ? (
            <IoChevronUp className="text-xl text-gray-500" />
          ) : (
            <IoChevronDown className="text-xl text-gray-500" />
          )}
        </div>
        <div
          className={`overflow-hidden ${isMenuOpen ? 'h-auto py-3' : 'max-h-0'}`}
        >
          <ul className="space-y-4 text-gray-500">
            <Link href="/student/announcement/common?page=1">
              <li
                className={`pl-[5%] py-2 ${
                  classId === 'common'
                    ? 'text-primary font-semibold hover:text-primaryHover'
                    : 'hover:text-gray-700'
                }`}
              >
                공통 공지사항
              </li>
            </Link>
            {classList?.map((item: any) => (
              <Link
                href={`/student/announcement/${item.id}?page=1`}
                key={item.id}
              >
                <li
                  className={`pl-[5%] py-2 ${
                    parseInt(classId) === item.id
                      ? 'text-primary font-semibold hover:text-primaryHover'
                      : 'hover:text-gray-700'
                  }`}
                >
                  {item.course?.title} {item.group_name}
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </div>

      {/* 배너 */}
      <section className="w-screen h-44 bg-gradient-to-r from-[#9face6] to-[#74ebd5]">
        <div className="w-screen px-[10%] lg:px-[20%] h-44">
          <div className="flex items-center justify-between h-44">
            <div
              className="flex flex-col gap-1 text-2xl text-white"
              style={{ textShadow: '1px 2px 3px rgba(0, 0, 0, 0.5)' }}
            >
              <span>
                📢{' '}
                {decodedClass === 'common'
                  ? '공통 공지사항'
                  : `${classItem?.course?.title} ${classItem?.group_name}`}
              </span>
            </div>
            <div className="h-full w-[50%] relative">
              <Image
                src="/banner/announcementBanner.png"
                layout="fill"
                objectFit="contain"
                alt="banner"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 메인 공지사항 */}
      <div className="bg-[#f0f4fc] min-h-screen  w-full flex flex-col lg:flex-row items-center lg:items-start justify-start lg:justify-center text-secondary">
        <div className="w-[90%] lg:w-[62%] flex gap-0 lg:gap-12 pt-12 items-start mb-44">
          {/* 공지사항 목록 */}
          <main className="w-full lg:w-[75%]">
            {/* <div className="flex items-center px-4 bg-white shadow-md rounded-xl">
              <IoSearchSharp className="text-lg text-gray-400" />
              <input
                type="text"
                className="w-full py-3 pl-3 text-sm focus:outline-none placeholder:text-sm"
                placeholder="공지 제목을 입력하세요."
              />
            </div> */}
            <div className="mt-5 text-sm text-gray-500 bg-white border shadow-md rounded-2xl">
              <div className="flex items-center px-5 py-2 text-gray-800 bg-white border-b rounded-t-2xl">
                <span className="ml-[30%]">공지 제목</span>
                <span className="ml-auto mr-[25%]">시간</span>
              </div>
              {isLoading ? (
                <div className="p-5 space-y-5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      animation="wave"
                      width="100%"
                      height={30}
                    />
                  ))}
                </div>
              ) : announcementList.length > 0 ? (
                announcementList.map((item: any) => (
                  <div key={item.id}>
                    <div
                      className="flex items-center text-sm p-5 border-b border-gray-200 hover:bg-[#eeeff3] cursor-pointer"
                      onClick={() => toggleContent(item.id)}
                    >
                      <span className="w-[60%] ml-[5%]">{item.title}</span>
                      <span className="ml-auto w-[20%]">
                        {formattedDate(item.create_time)}
                      </span>
                      <span className="ml-auto text-xl mr-[2%]">
                        {expandedId === item.id ? (
                          <IoChevronUp />
                        ) : (
                          <IoChevronDown />
                        )}
                      </span>
                    </div>
                    {expandedId === item.id && (
                      <div className="p-7 border-b border-gray-200">
                        <p>{item.content || '공지사항 내용이 없습니다.'}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-5 text-center text-gray-500">
                  공지가 없습니다.
                </div>
              )}
            </div>

            {/* 페이지네이션 */}
            <div className="flex items-center justify-center mt-16 space-x-1">
              <button
                onClick={() => changePageBlock(false)}
                disabled={currentBlock === 1}
                className={`px-3 py-1 bg-white rounded-2xl shadow-md hover:bg-[#eeeff3] ${
                  currentBlock === 1 ? 'opacity-70' : ''
                }`}
              >
                &lt;
              </button>
              {Array.from(
                { length: endPage - startPage + 1 },
                (_, i) => startPage + i,
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => changePage(page)}
                  className={`px-3 py-1 rounded-xl transition-all ${
                    page === currentPage
                      ? 'bg-primary text-white'
                      : ' bg-white border hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => changePageBlock(true)}
                disabled={endPage === totalPages}
                className={`px-3 py-1 bg-white rounded-2xl shadow-md hover:bg-[#eeeff3] 
            ${currentBlock === 1 ? 'opacity-70' : ''}
            `}
              >
                &gt;
              </button>
            </div>
          </main>
          {/* right 카테고리*/}
          <aside className="flex-1 hidden p-8 text-sm bg-white shadow-md lg:block rounded-2xl">
            <div className="flex flex-col w-full h-full space-y-7">
              <h1 className="mb-2 font-semibold text-secondary">카테고리</h1>
              <Link href="/student/announcement/common?page=1">
                <li
                  className={`${
                    classId === 'common'
                      ? 'text-primary hover:text-primaryHover font-semibold  transition cursor-pointer flex justify-between items-center'
                      : 'hover:text-gray-900  transition cursor-pointer flex justify-between items-center'
                  }`}
                >
                  공통 공지사항
                </li>
              </Link>

              {classList?.map((item: any) => (
                <Link
                  href={`/student/announcement/${item.id}?page=1`}
                  key={item.id}
                >
                  <li
                    className={`${
                      parseInt(classId) === item.id
                        ? 'text-primary hover:text-primaryHover font-semibold  transition cursor-pointer flex justify-between items-center '
                        : 'hover:text-gray-900  transition cursor-pointer flex justify-between items-center'
                    }`}
                  >
                    {item.course?.title}&nbsp;{item.group_name}
                  </li>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
