'use client';

import React from 'react';
import { Modal } from 'antd';
import { useState } from 'react';
import { Checkbox } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Noto_Sans_KR } from 'next/font/google';

const notoSansKr = Noto_Sans_KR({
  weight: ['700'],
  subsets: ['latin'],
});

export default function Home() {
  const router = useRouter();
  const [isStaff, setIsStaff] = useState(false);

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('학번을 입력해주세요'),

    password: Yup.string().required('비밀번호를 입력해주세요'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const error = () => {
    Modal.error({
      title: <span className={notoSansKr.className}>로그인 실패</span>,
      content: (
        <span className={notoSansKr.className}>
          학번 또는 비밀번호가 올바르지 않습니다.
        </span>
      ),
    });
  };
  const onSubmit = (data: { username: string; password: string }) => {
    const { username, password } = data;
    if (username === 'root' && password === 'root') {
      if (isStaff) {
        router.push('/professor/dashboard');
      } else {
        router.push('/student');
      }
    } else {
      error();
    }
  };

  return (
    <>
      <div className="w-screen h-[100dvh] flex">
        {/* left */}
        <section className="hidden flex-1 lg:flex items-center justify-center bg-primary">
          <div className="w-1/3 h-2/5 relative">
            <Image
              src="/commons/logo.png"
              alt="logo"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </section>

        {/* right */}
        <section className="flex-1 flex items-center justify-center ">
          <div className="w-[70%] h-[70%] lg:w-1/2 lg:h-1/2  space-y-4 rounded-sm border-solid border-[1px] border-slate-200 shadow-xl flex flex-col justify-center items-center">
            <div className=" font-bold mb-4  ">
              <span className="text-primary text-2xl sm:text-3xl md:text-4xl lg:text-2xl">
                Chosun{' '}
              </span>
              <span className="text-secondary text-2xl sm:text-3xl md:text-4xl lg:text-2xl">
                Online Judge
              </span>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full flex flex-col items-center space-y-4"
            >
              <input
                {...register('username')}
                className="w-3/4 h-8 md:h-16 lg:h-10  rounded-md  border-[1px] border-slate-200 pl-4  placeholder:text-sm md:placeholder:text-lg lg:placeholder:text-sm focus:ring-1 focus:ring-gray-200 focus:outline-none"
                type="text"
                placeholder="학번을 입력해주세요"
              />
              {errors.username && (
                <p className="text-red-500 text-sm lg:text-xs mt-1 text-left w-3/4 pl-2">
                  {errors.username.message}
                </p>
              )}

              <input
                {...register('password')}
                className="w-3/4 h-8 md:h-16 lg:h-10   rounded-md  border-[1px] border-slate-200 pl-4 placeholder:text-sm md:placeholder:text-lg lg:placeholder:text-sm focus:ring-1 focus:ring-gray-200 focus:outline-none"
                type="password"
                placeholder="비밀번호를 입력해주세요"
              />
              {errors.password && (
                <p className="text-red-500 text-sm lg:text-xs  mt-1 text-left w-3/4 pl-2">
                  {errors.password.message}
                </p>
              )}

              {/* 교직원 로그인 체크박스 */}
              <div className=" w-3/4 flex  text-[#5a5a5a] items-center">
                <Checkbox
                  checked={isStaff}
                  onChange={(e) => setIsStaff(e.target.checked)}
                />
                <span className=" md:text-lg lg:text-sm ml-2">
                  교직원 로그인
                </span>
              </div>

              <button
                type="submit"
                className="w-3/4 py-2 md:py-5 lg:py-2 rounded-md bg-primary text-white flex items-center justify-center cursor-pointer hover:bg-primaryButtonHover transition"
              >
                로그인
              </button>
            </form>
            <Link
              href="/signup"
              className="w-3/4 py-2  md:py-5 lg:py-2  rounded-md bg-secondaryButton border-[1px] border-secondaryButtonBorder text-secondary flex items-center justify-center cursor-pointer hover:bg-secondaryButtonHover transition"
            >
              회원가입
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
