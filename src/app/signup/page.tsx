'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { useState } from 'react';
import Image from 'next/image';
import {
  checkEmail,
  checkStudentNumber,
  checkUsername,
  registerUser,
} from '@/services/accountUser/signup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { message } from 'antd';

type CheckType = 'username' | 'email' | 'studentNumber';

export default function Signup() {
  const router = useRouter();
  const [isUsernameChecked, setIsUsernameChecked] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState('');

  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');

  const [isStudentNumberChecked, setIsStudentNumberChecked] = useState(false);
  const [studentNumberMessage, setStudentNumberMessage] = useState('');

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('아이디를 입력해주세요.'),
    password: Yup.string()
      .min(6, '비밀번호는 최소 6자 이상이어야 합니다.')
      .required('비밀번호를 입력해주세요.'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), undefined], '비밀번호가 일치하지 않습니다.')
      .required('비밀번호 확인을 입력해주세요.'),
    studentNumber: Yup.string()
      .min(8, '학번은 최소 8자 이상이어야 합니다.')
      .required('학번을 입력해주세요.'),
    email: Yup.string()
      .email('유효한 이메일 주소를 입력해주세요.')
      .required('이메일을 입력해주세요.'),
    name: Yup.string().required('이름을 입력해주세요.'),
  });

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: any) => {
    if (!isUsernameChecked) {
      message.error('아이디 중복확인을 해주세요.');
      return;
    }
    if (!isStudentNumberChecked) {
      message.error('학번 중복확인을 해주세요.');
      return;
    }

    if (!isEmailChecked) {
      message.error('이메일 중복확인을 해주세요.');
      return;
    }

    const { confirmPassword, studentNumber, ...filteredData } = data;
    const payload = {
      ...filteredData,
      student_number: studentNumber,
    };

    try {
      await registerUser(payload);

      message.success('회원가입이 완료되었습니다.');
      router.push('/');
    } catch (error: any) {
      message.error(
        error.response?.data?.message || '회원가입에 실패했습니다.',
      );
    }
  };

  const handleDuplicateCheck = async (type: CheckType) => {
    const value = getValues(type);
    try {
      let response: any;
      if (type === 'username') {
        response = await checkUsername(value);
        setIsUsernameChecked(true);
        setUsernameMessage(response.message || '사용 가능한 아이디입니다.');
      } else if (type === 'email') {
        response = await checkEmail(value);
        setIsEmailChecked(true);
        setEmailMessage(response.message || '사용 가능한 이메일입니다.');
      } else if (type === 'studentNumber') {
        response = await checkStudentNumber(value);
        setIsStudentNumberChecked(true);
        setStudentNumberMessage(response.message || '사용 가능한 학번입니다.');
      }
    } catch (error: any) {
      if (type === 'username') {
        setIsUsernameChecked(false);
        setUsernameMessage(
          error.response?.data?.message || '중복된 아이디입니다.',
        );
      } else if (type === 'email') {
        setIsEmailChecked(false);
        setEmailMessage(
          error.response?.data?.message || '중복된 이메일입니다.',
        );
      } else if (type === 'studentNumber') {
        setIsStudentNumberChecked(false);
        setStudentNumberMessage(
          error.response?.data?.message || '중복된 학번입니다.',
        );
      }
    }
  };
  return (
    <>
      <div className="w-screen h-[100dvh] flex ">
        {/* left */}
        <section className="items-center justify-center flex-1 hidden lg:flex bg-primary">
          <div className="relative w-1/3 h-2/5">
            <Image
              src="/commons/logo.png"
              alt="Chosun Online Judge"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </section>
        {/* right */}
        <section className="flex items-center justify-center flex-1 ">
          <div className="w-[90%] md:w-[70%] lg:w-1/2 py-9 space-y-4 rounded-sm border border-slate-200 shadow-xl flex flex-col justify-center items-center">
            <span className="text-2xl text-secondary sm:text-3xl md:text-4xl lg:text-2xl">
              회원가입
            </span>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full flex flex-col items-center space-y-4"
            >
              {/* 아이디 */}
              <div className="flex flex-col w-3/4">
                <div className="w-full flex justify-between">
                  <input
                    {...register('username')}
                    className="w-[70%] h-10 rounded-md border border-gray-300 pl-4 placeholder:text-sm text-sm focus:ring-1 focus:ring-gray-400 focus:outline-none"
                    type="text"
                    placeholder="아이디를 입력해주세요"
                  />
                  <button
                    type="button"
                    onClick={() => handleDuplicateCheck('username')}
                    className="w-[25%] border rounded-md border-primary text-primary h-10 px-4 text-sm hover:bg-primary hover:text-white transition-all duration-200"
                  >
                    중복확인
                  </button>
                </div>
                {usernameMessage && (
                  <p
                    className={`text-xs pl-2 ${isUsernameChecked ? 'text-blue-500' : 'text-red-500'}`}
                  >
                    {usernameMessage}
                  </p>
                )}
                {errors.username && (
                  <p className="text-xs text-red-500 pl-2">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* 비밀번호 */}
              <div className="w-3/4">
                <input
                  {...register('password')}
                  className="w-full h-10 rounded-md border border-gray-300 pl-4 placeholder:text-sm text-sm focus:ring-1 focus:ring-gray-400 focus:outline-none"
                  type="password"
                  placeholder="비밀번호를 입력해주세요"
                />
                {errors.password && (
                  <p className="text-xs text-red-500 pl-2">
                    {errors.password.message}
                  </p>
                )}
              </div>
              {/* 비밀번호 확인 */}
              <div className="w-3/4">
                <input
                  {...register('confirmPassword')}
                  className="w-full h-10 rounded-md border border-gray-300 pl-4 placeholder:text-sm text-sm focus:ring-1 focus:ring-gray-400 focus:outline-none"
                  type="password"
                  placeholder="다시 한번 비밀번호를 입력해주세요"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 pl-2">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* 학번 */}
              <div className="flex flex-col w-3/4">
                <div className="w-full flex justify-between">
                  <input
                    {...register('studentNumber')}
                    className="w-[70%] h-10 rounded-md border border-gray-300 pl-4 placeholder:text-sm text-sm focus:ring-1 focus:ring-gray-400 focus:outline-none"
                    type="number"
                    placeholder="학번을 입력해주세요"
                    style={{
                      MozAppearance: 'textfield',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleDuplicateCheck('studentNumber')}
                    className="w-[25%] border rounded-md border-primary text-primary h-10 px-4 text-sm hover:bg-primary hover:text-white transition-all duration-200"
                  >
                    중복확인
                  </button>
                </div>
                {studentNumberMessage && (
                  <p
                    className={`text-xs pl-2 ${
                      isStudentNumberChecked ? 'text-blue-500' : 'text-red-500'
                    }`}
                  >
                    {studentNumberMessage}
                  </p>
                )}
                {errors.studentNumber && (
                  <p className="text-xs text-red-500 pl-2">
                    {errors.studentNumber.message}
                  </p>
                )}
              </div>

              {/* 이메일 */}
              <div className="flex flex-col w-3/4">
                <div className="w-full flex justify-between">
                  <input
                    {...register('email')}
                    className="w-[70%] h-10 rounded-md border border-gray-300 pl-4 placeholder:text-sm text-sm focus:ring-1 focus:ring-gray-400 focus:outline-none"
                    type="email"
                    placeholder="이메일을 입력해주세요"
                  />
                  <button
                    type="button"
                    onClick={() => handleDuplicateCheck('email')}
                    className="w-[25%] border rounded-md border-primary text-primary h-10 px-4 text-sm hover:bg-primary hover:text-white transition-all duration-200"
                  >
                    중복확인
                  </button>
                </div>
                {emailMessage && (
                  <p
                    className={`text-xs pl-2 ${
                      isEmailChecked ? 'text-blue-500' : 'text-red-500'
                    }`}
                  >
                    {emailMessage}
                  </p>
                )}
                {errors.email && (
                  <p className="text-xs text-red-500 pl-2">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* 이름 */}
              <div className="w-3/4">
                <input
                  {...register('name')}
                  className="w-full h-10 rounded-md border border-gray-300 pl-4 placeholder:text-sm text-sm focus:ring-1 focus:ring-gray-400 focus:outline-none"
                  type="text"
                  placeholder="이름을 입력해주세요"
                />
                {errors.name && (
                  <p className="text-xs text-red-500 pl-2">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="flex items-center justify-center w-3/4 py-2 text-white transition rounded-md cursor-pointer md:py-5 lg:py-2 bg-primary hover:bg-primaryButtonHover"
              >
                회원가입
              </button>
            </form>
            <Link
              href="/"
              className="w-3/4 py-2 md:py-5 lg:py-2 rounded-md bg-secondaryButton border-[1px] border-secondaryButtonBorder text-secondary flex items-center justify-center cursor-pointer hover:bg-secondaryButtonHover transition"
            >
              이전으로
            </Link>
          </div>
        </section>
      </div>
      <style jsx>{`
        /* Chrome, Edge, Safari - 스피너 제거 */
        input[type='number']::-webkit-outer-spin-button,
        input[type='number']::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
    </>
  );
}
