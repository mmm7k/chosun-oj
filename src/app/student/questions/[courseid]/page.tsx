'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Avatar, message, Modal } from 'antd';
import { BsSendCheck } from 'react-icons/bs';
import { IoChevronDown, IoChevronUp, IoSearchSharp } from 'react-icons/io5';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
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
import { TbEdit } from 'react-icons/tb';
import { FiTrash2 } from 'react-icons/fi';
import { deleteQuestionUser } from '@/services/questionUser/deleteQuestionUser';
import { deleteQuestionAdmin } from '@/services/questionUser/deleteQuestionAdmin';
import { patchEditQuestion } from '@/services/questionUser/patchEditQuestion';
import { patchEditQuestionUser } from '@/services/questionUser/patchEditQuestionUser';
import { getAnswerUser } from '@/services/questionUser/getAnswerUser';
import { patchEditAnswer } from '@/services/questionUser/patchEditAnswer';
import { deleteAnswerAdmin } from '@/services/questionUser/deleteAnswerAdmin';
import { deleteAnswerUser } from '@/services/questionUser/deleteAnswerUser';
import { postAnswer } from '@/services/questionUser/postAnswer';
import { getMyCourseListUser } from '@/services/courseUser/getMyCourseListUser';

export default function Questions({
  params,
}: {
  params: { courseid: string };
}) {
  const { username, admin_type, fetchUser } = useUserStore();

  useEffect(() => {
    if (!username || !admin_type) {
      fetchUser(); // 상태가 없으면 API 호출
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

  const answerValidationSchema = Yup.object().shape({
    content: Yup.string().required('답변 내용을 입력해주세요.'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const {
    register: editRegister,
    handleSubmit: handleEditSubmit,
    reset: resetEditForm,
    formState: { errors: editErrors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const {
    register: editAnswerRegister,
    handleSubmit: handleEditAnswerSubmit,
    reset: resetEditAnswerForm,
    formState: { errors: editAnswerErrors },
  } = useForm({
    resolver: yupResolver(answerValidationSchema),
  });

  const {
    register: answerRegister,
    handleSubmit: handleAnswerSubmit,
    reset: resetAnswerForm,
    formState: { errors: answerErrors },
  } = useForm({
    resolver: yupResolver(answerValidationSchema),
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
      questionRefetch();
      reset();
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
    queryFn: () => getMyCourseListUser(),
  });
  const courseList = courseListData?.data?.data;
  const courseItem = courseList?.find(
    (item: any) => item.id === parseInt(courseId),
  );

  //검색
  const searchInputRef = useRef<HTMLInputElement>(null);
  const initialSearch = searchParams.get('search') || null;
  const [selectedSearch, setSelectedSearch] = useState<string | null>(
    initialSearch,
  );

  const handleFilterChange = (key: 'search', value: string | null) => {
    if (key === 'search') setSelectedSearch(value);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    const searchValue = searchInputRef.current?.value || '';
    handleFilterChange('search', searchValue);
  };

  // Q&A 데이터 가져오기
  const fetchQuestionData = () => {
    if (courseId === 'common') {
      return getQuestionUser(currentPage, selectedSearch || undefined);
    } else {
      return getCourseQuestionUser(
        currentPage,
        parseInt(courseId),
        selectedSearch || undefined,
      );
    }
  };

  const {
    data: questionData,
    refetch: questionRefetch,
    isLoading,
  } = useQuery({
    queryKey: ['questionData', courseId, currentPage, selectedSearch],
    queryFn: fetchQuestionData,
  });

  useEffect(() => {
    const query = new URLSearchParams();
    query.set('page', currentPage.toString());

    if (selectedSearch) {
      query.set('search', selectedSearch);
    }

    const newPath =
      courseId === 'common'
        ? `/student/questions/common?${query.toString()}`
        : `/student/questions/${courseId}?${query.toString()}`;
    router.push(newPath);
    questionRefetch();
  }, [currentPage, router, questionRefetch, courseId, selectedSearch]);

  const questionList = questionData?.data?.data || [];
  const totalPages = questionData?.data?.total_count
    ? Math.ceil(questionData.data.total_count / 15)
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

  const deleteQuestionMutation = useMutation({
    mutationFn:
      admin_type === 'Super Admin'
        ? (id: number) => deleteQuestionAdmin(id)
        : (id: number) => deleteQuestionUser(id),
    onSuccess: () => {
      message.success('질문이 성공적으로 삭제되었습니다.');
      questionRefetch();
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

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '정말 삭제하시겠습니까?',
      content: '이 작업은 되돌릴 수 없습니다.',
      okText: '삭제',
      okType: 'danger',
      cancelText: '취소',
      onOk: () => {
        deleteQuestionMutation.mutate(id);
      },
    });
  };

  // 질문수정
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(
    null,
  );
  const handleEditClick = (item: {
    id: number;
    title: string;
    content: string;
  }) => {
    setEditingQuestionId(item.id);
    resetEditForm({
      title: item.title,
      content: item.content,
    });
  };

  const handleCancelEdit = () => {
    setEditingQuestionId(null); // 수정 상태 초기화
    resetEditForm(); // 수정 폼 초기화
  };

  const updateMutation = useMutation({
    mutationFn:
      admin_type === 'Super Admin'
        ? ({
            id,
            data,
          }: {
            id: number;
            data: { title: string; content: string };
          }) => patchEditQuestion(id, data)
        : ({
            id,
            data,
          }: {
            id: number;
            data: { title: string; content: string };
          }) => patchEditQuestionUser(id, data),
    onSuccess: () => {
      message.success('질문이 수정되었습니다.');
      setEditingQuestionId(null);
      questionRefetch();
    },
    onError: () => {
      message.error('질문 수정에 실패했습니다.');
    },
  });

  const onUpdate = (id: number, data: { title: string; content: string }) => {
    updateMutation.mutate({ id, data });
  };

  const [questionId, setQuestionId] = useState<number | null>(null);

  // 댓글 리스트 데이터 가져오기
  const { data: answerListData, refetch: answerRefetch } = useQuery({
    queryKey: ['answerListData', questionId],
    queryFn: () => {
      if (!questionId) return Promise.resolve([]);
      return getAnswerUser(questionId);
    },
    enabled: !!questionId, // questionId가 있을 때만 쿼리 실행
  });
  const answerList = answerListData?.data?.data || [];

  const toggleComments = (id: number) => {
    if (questionId === id) {
      // 동일한 질문을 다시 클릭하면 닫기
      setQuestionId(null);
    } else {
      // 다른 질문 클릭 시 해당 ID 설정 후 쿼리 실행
      setQuestionId(id);
      answerRefetch();
    }
  };
  // 댓글 수정

  const [editingAnswerId, setEditingAnswerId] = useState<number | null>(null);
  const handleEditAnswerClick = (item: {
    id: number;

    content: string;
  }) => {
    setEditingAnswerId(item.id);
    resetEditAnswerForm({
      content: item.content,
    });
  };

  const handleCancelEditAnswer = () => {
    setEditingAnswerId(null); // 수정 상태 초기화
    resetEditAnswerForm(); // 수정 폼 초기화
  };

  const updateAnswerMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { content: string } }) =>
      patchEditAnswer(id, data),
    onSuccess: () => {
      message.success('답변이 성공적으로 수정되었습니다.');
      setEditingAnswerId(null);
      answerRefetch();
    },
    onError: () => {
      message.error('답변 수정에 실패했습니다.');
    },
  });

  const onUpdateAnswer = (id: number, data: { content: string }) => {
    updateAnswerMutation.mutate({ id, data });
  };

  // 답변 삭제

  const deleteAnswerMutation = useMutation({
    mutationFn:
      admin_type === 'Super Admin'
        ? (id: number) => deleteAnswerAdmin(id)
        : (id: number) => deleteAnswerUser(id),
    onSuccess: () => {
      message.success('답변이 성공적으로 삭제되었습니다.');
      answerRefetch();
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

  const handleDeleteAnswer = (id: number) => {
    Modal.confirm({
      title: '정말 삭제하시겠습니까?',
      content: '이 작업은 되돌릴 수 없습니다.',
      okText: '삭제',
      okType: 'danger',
      cancelText: '취소',
      onOk: () => {
        deleteAnswerMutation.mutate(id);
      },
    });
  };

  // 답변 생성
  const postAnswerMutation = useMutation({
    mutationFn: (data: { questionId: number; content: string }) =>
      postAnswer(data.questionId, { content: data.content }),
    onSuccess: () => {
      message.success('답변이 성공적으로 등록되었습니다.');
      resetAnswerForm();
      answerRefetch(); // 답변 리스트를 다시 가져옴
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

  const onSubmitAnswer = (data: { questionId: number; content: string }) => {
    postAnswerMutation.mutate({ ...data });
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
            <div className="flex items-center w-full px-4 bg-white shadow-md mb-7 rounded-xl">
              <IoSearchSharp
                className="text-lg text-gray-400 cursor-pointer"
                onClick={() => handleSearch()}
              />
              <input
                type="text"
                className="w-full py-3 pl-3 text-sm focus:outline-none placeholder:text-sm"
                placeholder="키워드를 입력하세요."
                ref={searchInputRef}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleFilterChange('search', e.currentTarget.value);
                  }
                }}
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
                  className={`flex items-center px-6 py-3  bg-slate-100  rounded-lg text-sm
                  ${errors.title ? 'mb-2' : 'mb-4'}
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
                  className={`flex items-center px-6 py-4   bg-slate-100  rounded-lg text-sm
                  ${errors.content ? 'mb-2' : 'mb-6'}
                  `}
                >
                  <textarea
                    placeholder="질문을 입력해 주세요"
                    className="w-full overflow-hidden text-gray-600 bg-transparent outline-none resize-none"
                    rows={3}
                    {...register('content')}
                    onInput={(e: any) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                  ></textarea>
                </div>
                {errors.content && (
                  <p className="text-xs text-red-500 ">
                    {errors.content && errors.content.message}
                  </p>
                )}

                {/* Buttons Section */}
                <div className="flex justify-end ">
                  {/* 등록 Button */}
                  <button
                    className="flex items-center py-3 space-x-2 text-white transition-all bg-blue-600 rounded-full hover:bg-blue-700 px-5"
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
              questionList.map((item: QuestionList, index: number) => (
                <section className="mt-12" key={index}>
                  {editingQuestionId === item.id ? (
                    <form
                      onSubmit={handleEditSubmit((data) =>
                        onUpdate(item.id, data),
                      )}
                    >
                      <div className="px-12 py-10 bg-white shadow-md rounded-2xl">
                        {/* Title Input */}
                        <h1 className="mb-4 text-lg font-semibold">
                          ✏️ Edit Question
                        </h1>
                        {/* 제목 Box */}
                        <div
                          className={`flex items-center px-6 py-3  bg-slate-100  rounded-lg text-sm
                  ${editErrors.title ? 'mb-2' : 'mb-4'}
                  `}
                        >
                          <textarea
                            placeholder="제목을 입력해 주세요"
                            className="w-full overflow-hidden text-gray-600 bg-transparent outline-none resize-none"
                            rows={1}
                            {...editRegister('title')}
                            onInput={(e: any) => {
                              e.target.style.height = 'auto';
                              e.target.style.height = `${e.target.scrollHeight}px`;
                            }}
                          ></textarea>
                        </div>
                        {editErrors.title && (
                          <p className="text-xs text-red-500 mb-3">
                            {editErrors.title.message}
                          </p>
                        )}

                        {/* Content Input */}
                        <div
                          className={`flex items-center px-6 py-4   bg-slate-100  rounded-lg text-sm
                  ${editErrors.content ? 'mb-2' : 'mb-6'}
                  `}
                        >
                          <textarea
                            placeholder="질문을 입력해 주세요"
                            className="w-full overflow-hidden text-gray-600 bg-transparent outline-none resize-none"
                            rows={3}
                            {...editRegister('content')}
                            onInput={(e: any) => {
                              e.target.style.height = 'auto';
                              e.target.style.height = `${e.target.scrollHeight}px`;
                            }}
                          ></textarea>
                        </div>
                        {editErrors.content && (
                          <p className="text-xs text-red-500 ">
                            {editErrors.content.message}
                          </p>
                        )}

                        {/* Buttons */}
                        <div className="flex justify-end gap-4">
                          <button
                            onClick={handleCancelEdit}
                            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
                          >
                            취소
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                          >
                            수정
                          </button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="px-12 py-10 bg-white shadow-md rounded-2xl">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar
                            style={{
                              backgroundColor:
                                item?.created_by?.admin_type === 'Super Admin'
                                  ? '#262627' // Super Admin이면 검정색
                                  : item?.created_by?.admin_type ===
                                      'Regular User'
                                    ? '#19c402' // Regular User면 연두색
                                    : '#0032A0', // 기본 색상 (Professor일 때)
                            }}
                            icon={<FaUserGraduate />}
                          />
                          <div className="flex flex-col justify-center ml-4">
                            <p className="font-semibold">
                              {item?.created_by?.student_number} -{' '}
                              {item?.created_by?.username}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formattedDate(item.create_time)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center text-gray-700">
                          {(admin_type === 'Super Admin' ||
                            username === item?.created_by?.username) && (
                            <>
                              <TbEdit
                                className="text-lg cursor-pointer lg:text-xl hover:text-gray-500 transition-all"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditClick(item);
                                }}
                              />
                              <FiTrash2
                                className="text-lg cursor-pointer lg:text-xl hover:text-gray-500 transition-all"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(item.id);
                                }}
                              />
                            </>
                          )}
                        </div>
                      </div>
                      {/* Question */}
                      <h1 className="mt-8 font-semibold">{item.title}</h1>
                      <p className="mt-4 text-sm text-gray-700">
                        {item.content}
                      </p>
                      {/* Interaction Buttons */}
                      <div className="mt-8 space-x-6 text-sm">
                        <span
                          className="text-gray-600 hover:text-gray-400 transition-all cursor-pointer "
                          onClick={() => toggleComments(item.id)}
                        >
                          {questionId === item.id
                            ? '답변 닫기'
                            : `답변 등록 및 ${item.answer_count}개 모두 보기`}
                        </span>
                      </div>
                      {/* 댓글 리스트 */}
                      {questionId === item.id && (
                        <div className="mt-4 space-y-4 border-t border-gray-200 pt-4">
                          {answerList.length > 0 ? (
                            answerList.map((answer: any, index: number) => (
                              <div
                                key={answer.id}
                                className="flex gap-4 relative"
                              >
                                <Avatar
                                  style={{
                                    backgroundColor:
                                      answer?.created_by?.admin_type ===
                                      'Super Admin'
                                        ? '#262627' // Super Admin이면 검정색
                                        : answer?.created_by?.admin_type ===
                                            'Regular User'
                                          ? '#19c402' // Regular User면 연두색
                                          : '#0032A0', // 기본 색상 (Professor일 때)
                                  }}
                                  icon={<FaUserGraduate />}
                                />

                                <div className="w-full">
                                  {editingAnswerId === answer.id ? (
                                    <form
                                      onSubmit={handleEditAnswerSubmit(
                                        (data: { content: string }) =>
                                          onUpdateAnswer(answer.id, data),
                                      )}
                                    >
                                      <textarea
                                        {...editAnswerRegister('content')}
                                        defaultValue={answer.content}
                                        className="w-full border-b border-gray-300 focus:border-gray-400 outline-none resize-none text-sm text-gray-700 overflow-hidden"
                                        placeholder="답변을 입력해 주세요"
                                        rows={2}
                                        onInput={(e: any) => {
                                          e.target.style.height = 'auto';
                                          e.target.style.height = `${e.target.scrollHeight}px`;
                                        }}
                                      ></textarea>
                                      {editAnswerErrors.content && (
                                        <p className="text-xs text-red-500">
                                          {editAnswerErrors.content.message}
                                        </p>
                                      )}
                                      <div className="flex justify-end gap-2 mt-2">
                                        <button
                                          type="button"
                                          onClick={handleCancelEditAnswer}
                                          className="px-4 py-2 text-sm text-gray-600 bg-slate-200 rounded-lg hover:bg-slate-300 transition-all"
                                        >
                                          취소
                                        </button>
                                        <button
                                          type="submit"
                                          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
                                        >
                                          수정
                                        </button>
                                      </div>
                                    </form>
                                  ) : (
                                    <>
                                      <p className="text-xs font-semibold">
                                        {answer.created_by.student_number} -{' '}
                                        {answer.created_by.username}
                                      </p>
                                      <p className="text-sm text-gray-700">
                                        {answer.content}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {formattedDate(answer.create_time)}
                                      </p>
                                    </>
                                  )}
                                </div>

                                <div className="absolute right-0 top-1 flex items-center">
                                  {(admin_type === 'Super Admin' ||
                                    username ===
                                      answer?.created_by?.username) &&
                                    editingAnswerId !== answer.id && (
                                      <>
                                        <TbEdit
                                          className="text-sm cursor-pointer lg:text-base hover:text-gray-500 transition-all"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditAnswerClick(answer);
                                          }}
                                        />
                                        <FiTrash2
                                          className="text-sm cursor-pointer lg:text-base hover:text-gray-500 transition-all"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteAnswer(answer.id);
                                          }}
                                        />
                                      </>
                                    )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">
                              답변이 없습니다.
                            </p>
                          )}

                          {/* 답변 생성 기능 */}
                          <form
                            onSubmit={handleAnswerSubmit((data) =>
                              onSubmitAnswer({ questionId: item.id, ...data }),
                            )}
                            className="flex flex-col gap-4 mt-4"
                          >
                            <textarea
                              {...answerRegister('content')}
                              placeholder="답변을 입력해주세요"
                              className="w-full text-sm border border-gray-200 rounded-lg p-3 focus:outline-none resize-none overflow-hidden"
                              rows={2}
                              onInput={(e: any) => {
                                e.target.style.height = 'auto';
                                e.target.style.height = `${e.target.scrollHeight}px`;
                              }}
                            ></textarea>
                            {answerErrors.content && (
                              <p className="text-xs text-red-500">
                                {answerErrors.content.message}
                              </p>
                            )}
                            <div className="flex justify-end">
                              <button
                                type="submit"
                                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
                              >
                                답변 등록
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  )}
                </section>
              ))
            )}

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
