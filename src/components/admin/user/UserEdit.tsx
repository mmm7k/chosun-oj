'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getModifyUser } from '@/services/accountAdmin/getModifyUser';
import { editUsers } from '@/services/accountAdmin/editUser';

export default function UserEdit() {
  const router = useRouter();
  const pathname = usePathname();
  const userId = Number(pathname.split('/').pop());

  const { data: userModifyInformation } = useQuery({
    queryKey: ['userModifyInformation', userId],
    queryFn: () => getModifyUser(userId),
    enabled: !!userId,
  });

  const validationSchema = Yup.object().shape({
    userId: Yup.string()
      .max(32, '아이디는 최대 32자 입니다.')
      .required('아이디를 입력해주세요.'),
    userPassword: Yup.string()
      .min(6, '비밀번호는 최소 6자 이상이어야 합니다.')
      .required('비밀번호를 입력해주세요.'),
    userNumber: Yup.string()
      .min(8, '학번은 최소 8자 이상이어야 합니다.')
      .max(12, '학번은 최대 12자 입니다.')
      .required('학번을 입력해주세요.'),
    userEmail: Yup.string()
      .max(64, '이메일은 최대 64자 입니다.')
      .email('유효한 이메일 주소를 입력해주세요.')
      .required('이메일을 입력해주세요.'),
    userName: Yup.string().required('이름을 입력해주세요.'),
    school: Yup.string().nullable(),
    major: Yup.string().nullable(),
    isDisabled: Yup.string().required('계정 활성화 여부를 선택해주세요.'),
    adminType: Yup.string().required('관리자 유형을 선택해주세요.'),
    problemPermission: Yup.string().required('문제 권한을 선택해주세요.'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (userModifyInformation) {
      reset({
        userId: userModifyInformation.data.user.username,
        userPassword: userModifyInformation.data.user.password,
        userEmail: userModifyInformation.data.user.email,
        userName: userModifyInformation.data.user.name,
        userNumber: userModifyInformation.data.user.student_number,
        school: userModifyInformation.data.school || '',
        major: userModifyInformation.data.major || '',
        isDisabled: userModifyInformation.data.user.is_disabled
          ? 'true'
          : 'false',
        adminType: userModifyInformation.data.user.admin_type,
        problemPermission: userModifyInformation.data.user.problem_permission,
      });
    }
  }, [userModifyInformation, reset]);

  const mutation = useMutation({
    mutationFn: (data: any) =>
      editUsers(userId, {
        user: {
          username: data.userId,
          password: data.userPassword,
          email: data.userEmail,
          admin_type: data.adminType,
          name: data.userName,
          student_number: data.userNumber,
          problem_permission: data.problemPermission,
          is_disabled: data.isDisabled,
        },
        school: data.school || null, // 비어 있을 때 null로 전송
        major: data.major || null, // 비어 있을 때 null로 전송
      }),
    onSuccess: () => {
      alert('유저 수정이 완료되었습니다.');
      router.push('/admin/user/list');
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
    const formattedData = {
      ...data,
      isDisabled: data.isDisabled === 'true', // 비활성화 여부를 boolean으로 변환
    };
    mutation.mutate(formattedData);
  };
  return (
    <div className="flex min-h-screen p-8">
      <div className="w-full h-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary">
        <section className="flex px-16">
          <h1 className="text-lg">유저 정보 수정</h1>
        </section>
        <hr className="mt-5 border-t-2 border-gray-200" />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col text-sm"
        >
          {/* 아이디 */}
          <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200 ">
            <div className="flex items-center space-x-2">
              <label htmlFor="userId">아이디:</label>
              <input
                {...register('userId')}
                className="ml-3 w-[60%] sm:w-[20%] h-8 rounded-lg border-[1px] border-gray-200 pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
                type="text"
                placeholder="아이디를 입력해주세요"
              />
            </div>
            {errors.userId && (
              <p className="text-xs text-red-500 mt-1">
                {errors.userId.message}
              </p>
            )}
          </div>

          {/* 관리자 유형 */}
          <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200 ">
            <div className="flex items-center space-x-2">
              <label>관리자 유형:</label>
              <div className="ml-3 space-x-2 flex ">
                <label>
                  <input
                    {...register('adminType')}
                    type="radio"
                    value="Regular User"
                    className="mr-1"
                  />
                  학생
                </label>
                <label>
                  <input
                    {...register('adminType')}
                    type="radio"
                    value="Professor"
                    className="mr-1"
                  />
                  교수
                </label>
                <label>
                  <input
                    {...register('adminType')}
                    type="radio"
                    value="Super Admin"
                    className="mr-1"
                  />
                  관리자
                </label>
              </div>
            </div>
            {errors.adminType && (
              <p className="text-xs text-red-500 mt-1">
                {errors.adminType.message}
              </p>
            )}
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200 ">
            <div className="flex items-center space-x-2">
              <label htmlFor="userPassword">비밀번호:</label>
              <input
                {...register('userPassword')}
                className="ml-3 w-[60%] sm:w-[20%] h-8 rounded-lg border-[1px] border-gray-200 pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
                type="password"
                placeholder="비밀번호를 입력해주세요"
              />
            </div>
            {errors.userPassword && (
              <p className="text-xs text-red-500 mt-1">
                {errors.userPassword.message}
              </p>
            )}
          </div>

          {/* 학번 */}
          <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200 ">
            <div className="flex items-center space-x-2">
              <label htmlFor="userNumber">학번:</label>
              <input
                {...register('userNumber')}
                className="ml-3 w-[60%] sm:w-[20%] h-8 rounded-lg border-[1px] border-gray-200 pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
                type="number"
                placeholder="학번을 입력해주세요"
                style={{
                  MozAppearance: 'textfield',
                }}
              />
            </div>
            {errors.userNumber && (
              <p className="text-xs text-red-500 mt-1">
                {errors.userNumber.message}
              </p>
            )}
          </div>

          {/* 이메일 */}
          <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200 ">
            <div className="flex items-center space-x-2">
              <label htmlFor="userEmail">이메일:</label>
              <input
                {...register('userEmail')}
                className="ml-3 w-[60%] sm:w-[20%] h-8 rounded-lg border-[1px] border-gray-200 pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
                type="email"
                placeholder="이메일을 입력해주세요"
              />
            </div>
            {errors.userEmail && (
              <p className="text-xs text-red-500 mt-1">
                {errors.userEmail.message}
              </p>
            )}
          </div>

          {/* 이름 */}
          <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200 ">
            <div className="flex items-center space-x-2">
              <label htmlFor="userName">이름:</label>
              <input
                {...register('userName')}
                className="ml-3 w-[60%] sm:w-[20%] h-8 rounded-lg border-[1px] border-gray-200 pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
                type="text"
                placeholder="이름을 입력해주세요"
              />
            </div>
            {errors.userName && (
              <p className="text-xs text-red-500 mt-1">
                {errors.userName.message}
              </p>
            )}
          </div>

          {/* 학교 */}
          <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200 ">
            <div className="flex items-center space-x-2">
              <label htmlFor="school">소속 대학:</label>
              <input
                {...register('school')}
                className="ml-3 w-[60%] sm:w-[20%] h-8 rounded-lg border-[1px] border-gray-200 pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
                type="text"
                placeholder="소속 대학을 입력해주세요"
              />
            </div>
            {errors.school && (
              <p className="text-xs text-red-500 mt-1">
                {errors.school.message}
              </p>
            )}
          </div>

          {/* 전공 */}
          <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200 ">
            <div className="flex items-center space-x-2">
              <label htmlFor="major">전공:</label>
              <input
                {...register('major')}
                className="ml-3 w-[60%] sm:w-[20%] h-8 rounded-lg border-[1px] border-gray-200 pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
                type="text"
                placeholder="전공을 입력해주세요"
              />
            </div>
            {errors.major && (
              <p className="text-xs text-red-500 mt-1">
                {errors.major.message}
              </p>
            )}
          </div>

          {/* 문제 접근권한 */}
          <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200 ">
            <div className="flex items-center space-x-2">
              <label>문제 접근 권한:</label>
              <div className="ml-3 space-x-2">
                <label>
                  <input
                    {...register('problemPermission')}
                    type="radio"
                    value="All"
                    className="mr-1"
                  />
                  All
                </label>
                <label>
                  <input
                    {...register('problemPermission')}
                    type="radio"
                    value="None"
                    className="mr-1"
                  />
                  None
                </label>
                <label>
                  <input
                    {...register('problemPermission')}
                    type="radio"
                    value="Own"
                    className="mr-1"
                  />
                  Own
                </label>
              </div>
            </div>
            {errors.isDisabled && (
              <p className="text-xs text-red-500 mt-1">
                {errors.isDisabled.message}
              </p>
            )}
          </div>

          {/* 계정 비활성화 여부 */}
          <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200 ">
            <div className="flex items-center space-x-2">
              <label>계정 비활성화 여부:</label>
              <div className="ml-3 space-x-2">
                <label>
                  <input
                    {...register('isDisabled')}
                    type="radio"
                    value="true"
                    className="mr-1"
                  />
                  비활성화
                </label>
                <label>
                  <input
                    {...register('isDisabled')}
                    type="radio"
                    value="false"
                    className="mr-1"
                  />
                  활성화
                </label>
              </div>
            </div>
            {errors.isDisabled && (
              <p className="text-xs text-red-500 mt-1">
                {errors.isDisabled.message}
              </p>
            )}
          </div>

          <div className="flex justify-end w-full px-10 mt-8 space-x-3">
            <button
              type="submit"
              className="px-4 py-2 text-base font-normal text-white rounded-xl bg-primary hover:bg-primaryButtonHover"
            >
              유저 수정
            </button>
          </div>
        </form>
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
