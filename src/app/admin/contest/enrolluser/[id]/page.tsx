'use client';

import { Upload, Button, message, Checkbox, Modal } from 'antd';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as XLSX from 'xlsx';
import * as Yup from 'yup';
import { UploadOutlined } from '@ant-design/icons';
import { PiExclamationMarkFill } from 'react-icons/pi';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IoSearchSharp } from 'react-icons/io5';
import { getAllUser } from '@/services/accountAdmin/getAllUser';

import Skeleton from '@mui/material/Skeleton';

import { getUsersContest } from '@/services/contestAdmin/getUsersContest';
import { deleteUsersContest } from '@/services/contestAdmin/deleteUsersContest';
import { enrollUsersContest } from '@/services/contestAdmin/enrollUsersContest copy';

interface FormData {
  student_number: string;
  name: string;
}

export default function UserEnroll() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isStudentModalOpen, setIsStudentModalOpen] = useState<boolean>(false);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [deleteSelectedStudents, setDeleteSelectedStudents] = useState<
    Student[]
  >([]);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const contestId = Number(pathname.split('/').pop());
  const initialPage = Number(searchParams.get('page')) || 1;
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const pagesPerBlock = 5;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = Number(urlParams.get('page')) || 1;
    setCurrentPage(page);
  }, []);

  // 모달이 처음 열릴 때 쿼리 실행
  useEffect(() => {
    if (isStudentModalOpen) {
      refetch();
    }
  }, [isStudentModalOpen]);

  const {
    data: userListData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['userListData', currentPage],
    queryFn: () => getAllUser(currentPage),
  });

  const updateUrlAndPage = (page: number) => {
    window.history.pushState(
      null,
      '',
      `/admin/contest/enrolluser/${contestId}?page=${page}`,
    );
    setCurrentPage(page);
  };

  const students = userListData?.data?.data || [];
  const totalPages = userListData?.data?.total_count
    ? Math.ceil(userListData.data.total_count / 15)
    : 1;

  const currentBlock = Math.ceil(currentPage / pagesPerBlock);
  const startPage = (currentBlock - 1) * pagesPerBlock + 1;
  const endPage = Math.min(startPage + pagesPerBlock - 1, totalPages);

  const changePage = (page: number) => {
    updateUrlAndPage(page);
  };

  const changePageBlock = (isNext: boolean) => {
    const newPage = isNext
      ? Math.min(endPage + 1, totalPages)
      : Math.max(startPage - pagesPerBlock, 1);
    changePage(newPage);
  };

  const validationSchema = Yup.object().shape({
    student_number: Yup.string()
      .min(8, '학번은 최소 8자 이상이어야 합니다.')
      .required('학번을 입력해주세요.'),
    name: Yup.string().required('이름을 입력해주세요.'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });

  const handleExcelUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const binaryStr = event.target?.result as string;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const UserData = data.slice(1).map((row: any) => ({
          student_number: String(row[0]),
          name: String(row[1]),
        }));
        setSelectedStudents((prev) => [...prev, ...UserData]);
        message.success('엑셀 파일이 성공적으로 업로드되었습니다.');
      } catch (error) {
        message.error('엑셀 파일 처리 중 오류가 발생했습니다.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleCustomRequest = (options: any) => {
    const { file, onSuccess } = options;
    handleExcelUpload(file);
    onSuccess('ok');
  };

  const handleUserAdd: SubmitHandler<FormData> = (data) => {
    const newUser: Student = {
      student_number: data.student_number,
      name: data.name,
    };
    setSelectedStudents((prev) => [...prev, newUser]);
    reset();
  };

  const mutation = useMutation({
    mutationFn: () => {
      const payload = {
        data: selectedStudents.map((student) => [
          student.name,
          student.student_number,
        ]),
      };
      return enrollUsersContest(contestId, payload);
    },

    onSuccess: () => {
      message.success('유저 등록이 완료되었습니다.');
      setSelectedStudents([]);
      queryClient.invalidateQueries({
        queryKey: ['contestUsersListData', contestId],
      });
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

  const onSubmit = () => {
    mutation.mutate();
  };

  const handleStudentSelection = (student: {
    name: string;
    student_number: string;
  }) => {
    setSelectedStudents(
      (prev: any) =>
        prev.some(
          (s: { student_number: string }) =>
            s.student_number === student.student_number,
        )
          ? prev.filter(
              (s: { student_number: string }) =>
                s.student_number !== student.student_number,
            ) // 선택 해제
          : [...prev, student], // 선택 추가
    );
  };

  const { data: enrolledStudentsData, isLoading: enrolledStudentsIsLoading } =
    useQuery({
      queryKey: ['contestUsersListData', contestId],
      queryFn: () => getUsersContest(contestId),
    });
  const enrolledStudents = enrolledStudentsData?.data || [];
  const handleUserDeleteSelection = (student: Student) => {
    setDeleteSelectedStudents((prev) =>
      prev.some((s) => s.student_number === student.student_number)
        ? prev.filter((s) => s.student_number !== student.student_number)
        : [...prev, student],
    );
  };

  const deleteMutation = useMutation({
    mutationFn: (ids: number[]) => {
      const payload = { ids };
      return deleteUsersContest(contestId, payload);
    },
    onSuccess: () => {
      setDeleteSelectedStudents([]); // 선택된 유저 초기화
      queryClient.invalidateQueries({
        queryKey: ['contestUsersListData', contestId],
      });
      message.success('유저 삭제가 완료되었습니다.');
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

  const handleDeleteSubmit = () => {
    const idsToDelete = deleteSelectedStudents.map((user) => user.id);

    // 삭제 확인 모달
    Modal.confirm({
      title: '정말 삭제하시겠습니까?',
      content: `선택된 ${idsToDelete.length}명의 유저를 삭제합니다. 이 작업은 되돌릴 수 없습니다.`,
      okText: '삭제',
      okType: 'danger',
      cancelText: '취소',
      onOk: async () => {
        try {
          await deleteMutation.mutateAsync(idsToDelete); // 삭제 실행
        } catch (error: any) {
          message.error(
            error.response?.data?.message || '오류가 발생했습니다.',
          );
        }
      },
    });
  };

  return (
    <div className="flex flex-col min-h-screen p-8 space-y-8">
      <div className="w-full h-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary">
        <section className="flex flex-col sm:flex-row items-center justify-between px-16">
          <h1 className="text-lg">대회 유저 관리</h1>

          <div className="space-x-2 flex items-center">
            <button
              onClick={() => setIsStudentModalOpen(true)}
              className="py-1.5 w-36 text-sm font-normal text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all"
            >
              학생 검색 및 목록
            </button>
            <Upload
              accept=".xlsx, .xls"
              showUploadList={false}
              customRequest={handleCustomRequest}
            >
              <Button icon={<UploadOutlined />}>엑셀 파일 업로드</Button>
            </Upload>
          </div>
        </section>
        <hr className="mt-5 border-t-2 border-gray-200" />

        <form
          onSubmit={handleSubmit(handleUserAdd)}
          className="flex flex-col text-sm"
        >
          <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200 space-y-3">
            <span className="flex items-center mt-3 text-xs font-normal text-gray-400">
              <PiExclamationMarkFill className="text-lg" />
              <span>
                &nbsp; 엑셀 파일 업로드 시 다음과 같은 형식으로 입력해주세요.
              </span>
            </span>
            <Image
              src="/professor/userEnrollExample_professor.png"
              alt="userEnrollExample"
              width={200}
              height={100}
            />
          </div>

          <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200">
            <div className="flex items-center">
              <label htmlFor="student_number">학번:</label>
              <input
                {...register('student_number')}
                className="ml-3 w-[60%] sm:w-[20%] h-8 rounded-lg border-[1px] border-gray-200 pl-4 placeholder:text-sm placeholder:font-normal  focus:ring-1 focus:ring-gray-200 focus:outline-none"
                type="text"
                placeholder="학번을 입력해주세요"
              />
            </div>
            {errors.student_number && (
              <p className="text-xs text-red-500 mt-1">
                {errors.student_number.message}
              </p>
            )}
          </div>

          <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200">
            <div className="flex items-center">
              <label htmlFor="name">이름:</label>
              <input
                {...register('name')}
                className="ml-3 w-[60%] sm:w-[20%] h-8 rounded-lg border-[1px] border-gray-200 pl-4 placeholder:text-sm placeholder:font-normal  focus:ring-1 focus:ring-gray-200 focus:outline-none"
                type="text"
                placeholder="이름을 입력해주세요"
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="flex justify-end px-10 mt-4">
            <button
              type="submit"
              className="px-4 py-2 text-base font-normal text-white bg-primary rounded-xl hover:bg-primaryButtonHover"
            >
              유저 추가
            </button>
          </div>
        </form>

        <hr className="mt-5 border-t-2 border-gray-200" />

        {selectedStudents.length > 0 && (
          <div className="px-10 mt-4">
            <h3 className="mb-2 text-sm">선택된 유저(등록):</h3>
            <div className="flex flex-wrap gap-2 overflow-y-auto max-h-80">
              {selectedStudents.map((user) => (
                <div
                  key={user.student_number}
                  className="flex items-center px-3 py-1 text-sm bg-gray-200 rounded-full"
                >
                  <span className="mr-2">
                    {user.student_number} - {user.name}
                  </span>
                  <button
                    className="text-red-500"
                    onClick={() =>
                      setSelectedStudents((prev) =>
                        prev.filter(
                          (s) => s.student_number !== user.student_number,
                        ),
                      )
                    }
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end w-full px-10 mt-8 space-x-3">
          <span className="flex items-center text-xs font-normal text-gray-400">
            <PiExclamationMarkFill className="text-lg" />
            <span>&nbsp; 유저 추가 후 등록 버튼을 눌러주세요.</span>
          </span>
          <button
            onClick={() => onSubmit()}
            className={`px-4 py-2 text-base font-normal text-white rounded-xl ${
              selectedStudents.length > 0
                ? 'bg-primary hover:bg-primaryButtonHover'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            disabled={selectedStudents.length === 0}
          >
            유저 등록
          </button>
        </div>
      </div>

      <div className="w-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary">
        <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200">
          <span className="text-lg px-6">등록된 유저 목록</span>
          <div className="overflow-auto max-h-80 border my-5">
            <table className="table-auto w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 border-b">ID</th>
                  <th className="px-4 py-2 border-b">학번</th>
                  <th className="px-4 py-2 border-b">이름</th>
                  <th className="px-4 py-2 border-b"></th>
                </tr>
              </thead>
              <tbody>
                {enrolledStudentsIsLoading ? (
                  Array.from({ length: 4 }).map((_, rowIndex) => (
                    <tr key={rowIndex}>
                      {Array.from({ length: 3 }).map((_, colIndex) => (
                        <td key={colIndex} className="p-4">
                          <Skeleton animation="wave" width="100%" height={20} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (enrolledStudents?.length || 0) === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-500 py-4">
                      등록된 유저가 없습니다.
                    </td>
                  </tr>
                ) : (
                  enrolledStudents.map((student: any) => (
                    <tr
                      key={student.user.id}
                      className="hover:bg-gray-50"
                      onClick={() => handleUserDeleteSelection(student.user)}
                    >
                      <td className="px-4 py-2 border-b">{student.user.id}</td>
                      <td className="px-4 py-2 border-b">
                        {student.user.student_number}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {student.user.name}
                      </td>
                      <td className="px-4 py-2 border-b text-center">
                        <Checkbox
                          checked={deleteSelectedStudents.some(
                            (s) =>
                              s.student_number === student.user.student_number,
                          )}
                          onChange={() =>
                            handleUserDeleteSelection(student.user)
                          }
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {deleteSelectedStudents.length > 0 && (
          <div className="px-10 mt-4">
            <h3 className="mb-2 text-sm">선택된 유저(삭제):</h3>
            <div className="flex flex-wrap gap-2 overflow-y-auto max-h-80">
              {deleteSelectedStudents.map((user) => (
                <div
                  key={user.student_number}
                  className="flex items-center px-3 py-1 text-sm bg-gray-200 rounded-full"
                >
                  <span className="mr-2">
                    {user.student_number} - {user.name}
                  </span>
                  <button
                    className="text-red-500"
                    onClick={() =>
                      setDeleteSelectedStudents((prev) =>
                        prev.filter(
                          (s) => s.student_number !== user.student_number,
                        ),
                      )
                    }
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end w-full px-10 mt-8">
          <button
            onClick={handleDeleteSubmit}
            className={`px-4 py-2 text-base font-normal text-white rounded-xl ${
              deleteSelectedStudents.length > 0
                ? 'bg-primary hover:bg-primaryButtonHover'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            disabled={deleteSelectedStudents.length === 0}
          >
            유저 삭제
          </button>
        </div>
      </div>

      {isStudentModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-semibold text-gray-700"
          onClick={() => setIsStudentModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg w-[80%] sm:w-[50%] h-[90vh] p-8 overflow-hidden flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg mb-4">학생 검색 및 목록</h2>
            <button
              className="absolute right-10 top-7 text-xl"
              onClick={() => setIsStudentModalOpen(false)}
            >
              x
            </button>
            <div className="flex items-center mb-4 border-[1px] border-gray-300 rounded-lg px-3 py-2 w-full bg-white shadow-sm">
              <IoSearchSharp className="mr-2 text-lg text-gray-500" />
              <input
                className="w-full text-sm text-secondary placeholder:text-sm focus:outline-none"
                type="text"
                placeholder="학번으로 검색해보세요"
              />
            </div>

            <div className="flex-1 overflow-y-auto border-t mt-2">
              {isLoading ? (
                <table className="w-full text-sm text-left border-b-2 table-auto">
                  <thead>
                    <tr>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <th key={index} className="p-4">
                          <Skeleton animation="wave" width="100%" height={30} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 15 }).map((_, rowIndex) => (
                      <tr key={rowIndex}>
                        {Array.from({ length: 5 }).map((_, colIndex) => (
                          <td key={colIndex} className="p-4">
                            <Skeleton
                              animation="wave"
                              width="100%"
                              height={20}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : students.length === 0 ? (
                <p className="text-center mt-4">검색 결과가 없습니다.</p>
              ) : (
                students.map((student: any) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-2 border-b cursor-pointer hover:bg-gray-50"
                    onClick={() =>
                      handleStudentSelection({
                        student_number: student.student_number,
                        name: student.name,
                      })
                    }
                  >
                    <span className="text-sm">{student.name}</span>
                    <span className="text-xs text-gray-500">
                      {student.student_number}
                    </span>
                    <Checkbox
                      checked={selectedStudents.some(
                        (s) => s.student_number === student.student_number,
                      )}
                      onChange={() =>
                        handleStudentSelection({
                          student_number: student.student_number,
                          name: student.name,
                        })
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-center items-center mt-4 space-x-2">
              <button
                onClick={() => changePageBlock(false)}
                disabled={currentBlock === 1}
                className={`px-3 py-1 rounded-xl ${currentBlock === 1 ? 'bg-gray-200 opacity-50' : 'bg-gray-200 hover:bg-gray-300'}`}
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
                  className={`px-3 py-1 rounded-xl ${page === currentPage ? 'bg-primary text-white hover:bg-primaryButtonHover' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => changePageBlock(true)}
                disabled={endPage === totalPages}
                className={`px-3 py-1 rounded-xl ${endPage === totalPages ? 'bg-gray-200 opacity-50' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        input[type='number']::-webkit-outer-spin-button,
        input[type='number']::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
