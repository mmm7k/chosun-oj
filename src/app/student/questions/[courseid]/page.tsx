'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Avatar, message } from 'antd';
import { BsSendCheck } from 'react-icons/bs';
import { IoChevronDown, IoChevronUp, IoSearchSharp } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getCourseListUser } from '@/services/courseUser/getCourseListUser';
import { getQuestionUser } from '@/services/questionUser/getQuestionUser';
import { getCourseQuestionUser } from '@/services/questionUser/getCourseQuetionUser';
import Link from 'next/link';
import Image from 'next/image';
import { formattedDate } from '@/utils/dateFormatter';
import { postQuestion } from '@/services/questionUser/postQuestion';
import { postCourseQuestion } from '@/services/questionUser/postCourseQuestion';
import Skeleton from '@mui/material/Skeleton';
import { FaUserGraduate } from 'react-icons/fa6';
import useUserStore from '@/store/userstore';
export default function Questions({
  params,
}: {
  params: { courseid: string };
}) {
  const { username, admin_type, fetchUser } = useUserStore();

  useEffect(() => {
    if (!username || !admin_type) {
      fetchUser(); // 상태가 없으면 API 호출
      console.log('유저 정보 없음: API 호출');
    }
  }, [username, admin_type, fetchUser]);

  // 현재 url 파라미터 확인
  const courseId = params.courseid;
  const decodedCourse = decodeURIComponent(courseId);
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchParams = useSearchParams();
  // 초기 페이지 설정
  const initialPage = Number(searchParams.get('page')) || 1;
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const pagesPerBlock = 5;

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('제목을 입력해주세요.'),
    content: Yup.string().required('질문 내용을 입력해주세요.'),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Q&A 생성
  const postQuestionData = (data: { title: string; content: string }) => {
    if (courseId === 'common') {
      return postQuestion(data);
    } else {
      return postCourseQuestion(parseInt(courseId), data);
    }
  };

  const mutation = useMutation({
    mutationFn: (data: { title: string; content: string }) =>
      postQuestionData(data),
    onSuccess: () => {
      message.success('질문이 성공적으로 등록되었습니다.');
      router.push('/admin/contest/list');
    },
    onError: (error: any) => {
      if (error.response?.data?.message === '로그인이 필요합니다.') {
        message.error('로그인이 필요합니다.');
        router.push('/');
      } else {
        message.error(error.response?.data?.message || '오류가 발생했습니다.');
      }
    },
  });

  const onSubmit = (data: { title: string; content: string }) => {
    mutation.mutate(data);
  };

  // 클래스 리스트 데이터 가져오기
  const { data: courseListData } = useQuery({
    queryKey: ['courseListData'],
    queryFn: () => getCourseListUser(),
  });
  const courseList = courseListData?.data?.data;
  const courseItem = courseList?.find(
    (item: any) => item.id === parseInt(courseId),
  );

  // Q&A 데이터 가져오기
  const fetchQuestionData = () => {
    if (courseId === 'common') {
      return getQuestionUser(currentPage);
    } else {
      return getCourseQuestionUser(currentPage, parseInt(courseId));
    }
  };

  const {
    data: questionData,
    refetch: questionRefetch,
    isLoading,
  } = useQuery({
    queryKey: ['questionData', courseId, currentPage],
    queryFn: fetchQuestionData,
  });

  useEffect(() => {
    const newPath =
      courseId === 'common'
        ? `/student/questions/common?page=${currentPage}`
        : `/student/questions/${courseId}?page=${currentPage}`;
    router.push(newPath);
    questionRefetch();
  }, [currentPage, router, questionRefetch, courseId]);

  const questionList = questionData?.data?.data || [];
  const totalPages = questionList?.data?.total_count
    ? Math.ceil(questionList.data.total_count / 15)
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
            <Link href="/student/questions/common?page=1">
              <li
                className={`pl-[5%] py-2 ${
                  courseId === 'common'
                    ? 'text-primary font-semibold hover:text-primaryHover'
                    : 'hover:text-gray-700'
                }`}
              >
                공통 Q&A
              </li>
            </Link>
            {courseList?.map((item: any) => (
              <Link href={`/student/questions/${item.id}?page=1`} key={item.id}>
                <li
                  className={`pl-[5%] py-2 ${
                    parseInt(courseId) === item.id
                      ? 'text-primary font-semibold hover:text-primaryHover'
                      : 'hover:text-gray-700'
                  }`}
                >
                  {item.title}
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
                {decodedCourse === 'common'
                  ? '공통 Q&A'
                  : `${courseItem?.title}`}
              </span>
            </div>
            <div className="h-full w-[50%] relative">
              <Image
                src="/banner/questionsBanner.png"
                layout="fill"
                objectFit="contain"
                alt="banner"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="bg-[#f0f4fc] w-full flex  flex-col lg:flex-row  items-center lg:items-start justify-center ">
        <div className="w-[90%] lg:w-[62%] flex gap-0 pt-12 lg:gap-12 items-start mb-44 ">
          {/* left */}

          <main className="w-full lg:w-[75%]">
            {/* 검색 */}
            <div className="flex items-center w-full px-4 bg-white shadow-md mb-7 rounded-2xl">
              <IoSearchSharp className="text-lg text-gray-400" />
              <input
                type="text"
                className="w-full py-3 pl-3 text-sm focus:outline-none placeholder:text-sm"
                placeholder="키워드를 입력하세요."
              />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Create Question */}
              <div className="px-12 py-10 bg-white shadow-md rounded-2xl">
                {/* Header */}
                <h1 className="mb-4 text-lg font-semibold">
                  💡 Create Question
                </h1>
                {/* 제목 Box */}
                <div
                  className={`flex items-center px-6 py-4  bg-white border-[2px] border-gray-200 rounded-2xl
                  ${errors.title ? 'mb-2' : 'mb-6'}
                  `}
                >
                  <textarea
                    placeholder="제목을 입력해 주세요"
                    className="w-full overflow-hidden text-gray-600 bg-transparent outline-none resize-none"
                    rows={1}
                    {...register('title')}
                    onInput={(e: any) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                  ></textarea>
                </div>
                {errors.title && (
                  <p className="text-xs text-red-500 mb-3">
                    {errors.title.message}
                  </p>
                )}
                <div
                  className={`flex items-center px-6 py-4   bg-white border-[2px]  border-gray-200  rounded-2xl
                  ${errors.content ? 'mb-2' : 'mb-6'}
                  `}
                >
                  <textarea
                    placeholder="질문을 입력해 주세요"
                    className="w-full overflow-hidden text-gray-600 bg-transparent outline-none resize-none"
                    rows={6}
                    {...register('content')}
                    onInput={(e: any) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                  ></textarea>
                </div>
                {errors.content && (
                  <p className="text-xs text-red-500 ">
                    {errors.content.message}
                  </p>
                )}

                {/* Buttons Section */}
                <div className="flex justify-end gap-4">
                  {/*Button */}
                  {/* <button className="flex items-center py-3 space-x-2 text-red-600 transition-all bg-red-100 rounded-full hover:bg-red-200 px-7">
                  <LuTags />
                  <span className="text-sm">Tag</span>
                </button> */}
                  {/* </div> */}
                  {/* 등록 Button */}
                  <button
                    className="flex items-center py-3 space-x-2 text-white transition-all bg-blue-600 rounded-full hover:bg-blue-700 px-7"
                    type="submit"
                  >
                    <BsSendCheck />
                    <span className="text-sm">등록</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Q&A 목록 */}

            {isLoading ? (
              <div className="mt-12">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="px-12 py-10 bg-white shadow-md rounded-2xl mb-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Skeleton variant="circular" width={40} height={40} />
                        <div className="flex flex-col justify-center ml-4">
                          <Skeleton variant="text" width={120} height={20} />
                          <Skeleton variant="text" width={80} height={16} />
                        </div>
                      </div>
                      <Skeleton variant="text" width={30} height={20} />
                    </div>

                    <Skeleton
                      variant="text"
                      width="60%"
                      height={24}
                      style={{ marginTop: '20px' }}
                    />
                    <Skeleton
                      variant="text"
                      width="100%"
                      height={18}
                      style={{ marginTop: '10px' }}
                    />
                    <Skeleton
                      variant="text"
                      width="90%"
                      height={18}
                      style={{ marginTop: '10px' }}
                    />
                    <Skeleton
                      variant="text"
                      width="80%"
                      height={18}
                      style={{ marginTop: '10px' }}
                    />

                    <div className="flex items-center mt-4 space-x-6">
                      <Skeleton variant="text" width={70} height={20} />
                      <Skeleton variant="text" width={90} height={20} />
                      <Skeleton variant="text" width={50} height={20} />
                    </div>
                  </div>
                ))}
              </div>
            ) : questionList.length === 0 ? (
              <div className="px-12 py-10 bg-white shadow-md rounded-2xl mt-12 ">
                등록된 질문이 없습니다.
              </div>
            ) : (
              questionList.map((item: any, index: number) => (
                <section className="mt-12" key={index}>
                  <div className="px-12 py-10 bg-white shadow-md rounded-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar
                          style={{ backgroundColor: '#0032A0' }}
                          icon={<FaUserGraduate />}
                        />
                        <div className="flex flex-col justify-center ml-4">
                          <p className="font-semibold ">
                            {item?.created_by?.student_number}{' '}
                            {item?.created_by?.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formattedDate(item.create_time)}
                          </p>
                        </div>
                      </div>
                      <div className="">
                        <button className="text-gray-500">
                          •&nbsp;•&nbsp;•
                        </button>
                      </div>
                    </div>
                    {/* Question */}
                    <h1 className="mt-8 text-lg font-semibold">{item.title}</h1>
                    <p className="mt-4 text-gray-700">{item.content} </p>
                    {/* Interaction Buttons */}
                    <div className="mt-8 space-x-6 cursor-pointer ">
                      <span className="text-gray-600  hover:text-gray-400 transition-all">
                        댓글 보기
                      </span>
                    </div>
                  </div>
                </section>
              ))
            )}

            {/* 페이지네이션 */}
            <div className="flex items-center justify-center mt-16 space-x-1">
              <button
                onClick={() => changePageBlock(false)}
                disabled={currentBlock === 1}
                className={`px-3 py-1 bg-white rounded-2xl shadow-md hover:bg-[#eeeff3] ${
                  currentBlock === 1 ? 'opacity-40' : ''
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
                  className={`px-3 py-1 rounded-xl ${
                    page === currentPage
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => changePageBlock(true)}
                disabled={endPage === totalPages}
                className={`px-3 py-1 bg-white rounded-2xl shadow-md hover:bg-[#eeeff3]
            ${currentBlock === 1 ? 'opacity-40' : ''}
            `}
              >
                &gt;
              </button>
            </div>
          </main>
          {/* right 카테고리 메뉴 */}
          {/* right 카테고리*/}
          <aside className="flex-1 hidden p-8 text-sm bg-white shadow-md lg:block rounded-2xl">
            <div className="flex flex-col w-full h-full space-y-7">
              <h1 className="mb-2 font-semibold text-secondary">카테고리</h1>
              <Link href="/student/questions/common?page=1">
                <li
                  className={`${
                    courseId === 'common'
                      ? 'text-primary hover:text-primaryHover font-semibold  transition cursor-pointer flex justify-between items-center'
                      : 'hover:text-gray-900  transition cursor-pointer flex justify-between items-center'
                  }`}
                >
                  공통 Q&A
                </li>
              </Link>

              {courseList?.map((item: any) => (
                <Link
                  href={`/student/questions/${item.id}?page=1`}
                  key={item.id}
                >
                  <li
                    className={`${
                      parseInt(courseId) === item.id
                        ? 'text-primary hover:text-primaryHover font-semibold  transition cursor-pointer flex justify-between items-center '
                        : 'hover:text-gray-900  transition cursor-pointer flex justify-between items-center'
                    }`}
                  >
                    {item.title}
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
