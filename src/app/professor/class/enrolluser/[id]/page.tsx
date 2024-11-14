'use client';

import { Upload, Button, message } from 'antd';
import { set, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as XLSX from 'xlsx';
import * as Yup from 'yup';
import { UploadOutlined } from '@ant-design/icons';
import { PiExclamationMarkFill } from 'react-icons/pi';
import { enrollUsers } from '@/services/accountAdmin/enrollUser';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

export default function UserEnroll() {
  const router = useRouter();
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

  const validationSchema = Yup.object().shape({
    userId: Yup.string().required('아이디를 입력해주세요.'),
    userPassword: Yup.string()
      .min(6, '비밀번호는 최소 6자 이상이어야 합니다.')
      .required('비밀번호를 입력해주세요.'),
    userNumber: Yup.string()
      .min(8, '학번은 최소 8자 이상이어야 합니다.')
      .required('학번을 입력해주세요.'),
    userEmail: Yup.string()
      .email('유효한 이메일 주소를 입력해주세요.')
      .required('이메일을 입력해주세요.'),
    userName: Yup.string().required('이름을 입력해주세요.'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleExcelUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const binaryStr = event.target?.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const UserData = data.slice(1).map((row: any) => ({
          userId: String(row[0]),
          userPassword: String(row[1]),
          userEmail: String(row[2]),
          userNumber: String(row[3]),
          userName: String(row[4]),
        }));
        setSelectedUsers((prev) => [...prev, ...UserData]);
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

  const handleUserAdd = (data: any) => {
    const newUser = {
      userId: data.userId,
      userPassword: data.userPassword,
      userName: data.userName,
      userNumber: data.userNumber,
      userEmail: data.userEmail,
    };
    setSelectedUsers((prev) => [...prev, newUser]);
    reset();
  };

  const mutation = useMutation({
    mutationFn: () => enrollUsers(selectedUsers),
    onSuccess: () => {
      alert('유저 등록이 완료되었습니다.');
      setSelectedUsers([]); // 등록 후 초기화
    },
    onError: (error: any) => {
      if (error.response?.data?.message === '로그인이 필요합니다.') {
        alert(error.response?.data?.message);
        router.push('/');
      } else {
        alert(error.response?.data?.message);
      }
    },
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen p-8">
      <div className="w-full h-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary">
        <section className="flex items-center justify-between px-16">
          <h1 className="text-lg">분반 유저 등록</h1>
          <Upload
            accept=".xlsx, .xls"
            showUploadList={false}
            customRequest={handleCustomRequest}
          >
            <Button icon={<UploadOutlined />}>엑셀 파일 업로드</Button>
          </Upload>
        </section>
        <hr className="mt-5 border-t-2 border-gray-200" />

        {/* 유저 정보 입력 */}
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
            <div
              className="relative w-full max-w-md"
              style={{ aspectRatio: '5 / 1' }}
            >
              <Image
                src="/admin/userEnrollExample.png"
                alt="userEnrollExample"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>

          {/* 아이디 */}
          <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200 ">
            <div>
              <label htmlFor="userId">아이디:</label>
              <input
                {...register('userId')}
                className="ml-3 w-[60%] sm:w-[20%] h-8 rounded-lg  border-[1px] border-gray-200 font-norm pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
                type="text"
                placeholder="아이디를 입력해주세요"
              />
              {errors.userId && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.userId.message}
                </p>
              )}
            </div>
          </div>
          {/* 비밀번호 */}
          <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200 ">
            <div>
              <label htmlFor="userPassword">비밀번호:</label>
              <input
                {...register('userPassword')}
                className="ml-3 w-[60%] sm:w-[20%] h-8 rounded-lg  border-[1px] border-gray-200 font-norm pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
                type="password"
                placeholder="비밀번호를 입력해주세요"
              />
              {errors.userPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.userPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* 학번 */}
          <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200 ">
            <div>
              <label htmlFor="userNumber">학번:</label>
              <input
                {...register('userNumber')}
                className="ml-3 w-[60%] sm:w-[20%] h-8 rounded-lg border-[1px] border-gray-200 font-norm pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
                type="number"
                placeholder="학번을 입력해주세요"
                style={{
                  MozAppearance: 'textfield',
                }}
              />
              {errors.userNumber && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.userNumber.message}
                </p>
              )}
            </div>
          </div>

          {/* 이메일 */}
          <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200  ">
            <div>
              <label htmlFor="userEmail">이메일:</label>
              <input
                {...register('userEmail')}
                className="ml-3 w-[60%] sm:w-[20%] h-8 rounded-lg border-[1px] border-gray-200 font-norm pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
                type="email"
                placeholder="이메일을 입력해주세요"
              />
              {errors.userEmail && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.userEmail.message}
                </p>
              )}
            </div>
          </div>

          {/* 이름 */}
          <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200 ">
            <div>
              <label htmlFor="userName">이름:</label>
              <input
                {...register('userName')}
                className="ml-3 w-[60%] sm:w-[20%] h-8 rounded-lg border-[1px] border-gray-200 font-norm pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
                type="text"
                placeholder="이름을 입력해주세요"
              />
              {errors.userName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.userName.message}
                </p>
              )}
            </div>
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

        {/* 등록된 유저 목록 */}
        {selectedUsers.length > 0 && (
          <div className="px-10 mt-4">
            <h3 className="mb-2 text-sm">등록된 유저:</h3>
            <div className="flex flex-wrap gap-2 overflow-y-auto max-h-80">
              {selectedUsers.map((User) => (
                <div
                  key={User.userNumber}
                  className="flex items-center px-3 py-1 text-sm bg-gray-200 rounded-full"
                >
                  <span className="mr-2">
                    {User.userNumber} - {User.userName}
                  </span>
                  <button
                    className="text-red-500"
                    onClick={() =>
                      setSelectedUsers((prev) =>
                        prev.filter((s) => s.userNumber !== User.userNumber),
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
            onClick={onSubmit}
            className={`px-4 py-2 text-base font-normal text-white rounded-xl  ${
              selectedUsers.length > 0
                ? 'bg-primary hover:bg-primaryButtonHover'
                : 'bg-gray-300 cursor-not-allowed '
            }`}
            disabled={selectedUsers.length === 0}
          >
            유저 등록
          </button>
        </div>
      </div>

      <style jsx>{`
        /* Chrome, Edge, Safari - 스피너 제거 */
        input[type='number']::-webkit-outer-spin-button,
        input[type='number']::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
