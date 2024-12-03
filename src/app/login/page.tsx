'use client';

import React, { useEffect } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { login } from '@/services/accountUser/login';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import useUserStore from '@/store/userstore';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { admin_type, fetchUser } = useUserStore();

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('아이디를 입력해주세요'),
    password: Yup.string()
      .min(6, '비밀번호는 최소 6자 이상이어야 합니다.')
      .required('비밀번호를 입력해주세요'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const adminPath = (type: string | null | undefined): string => {
    switch (type) {
      case 'Professor':
        return '/professor';
      case 'Super Admin':
        return '/admin';
      default:
        return '/student';
    }
  };

  const onSubmit = async (data: { username: string; password: string }) => {
    const { username, password } = data;
    setIsLoading(true);
    try {
      const user = await login(username, password);
      await fetchUser();
      const userType = user?.data?.admin_type;
      router.push(adminPath(userType));
    } catch (error: any) {
      alert(error.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="w-screen h-[100dvh] flex">
        {/* left */}
        <section className="items-center justify-center flex-1 hidden lg:flex bg-primary">
          <div className="relative w-1/3 h-2/5">
            <Image
              src="/commons/logo.png"
              alt="logo"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </section>

        {/* right */}
        <section className="flex items-center justify-center flex-1 ">
          <div className="w-[70%] h-[70%] lg:w-1/2 lg:h-1/2  space-y-4 rounded-sm border-solid border-[1px] border-slate-200 shadow-xl flex flex-col justify-center items-center">
            <div className="mb-4 font-bold ">
              {/* <span className="text-2xl text-primary sm:text-3xl md:text-4xl lg:text-2xl">
                Chosun &nbsp;
              </span>
              <span className="text-2xl text-secondary sm:text-3xl md:text-4xl lg:text-2xl">
                Online Judge
              </span> */}
              <span className="text-2xl text-primary sm:text-3xl md:text-4xl lg:text-2xl">
                Felis
              </span>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col items-center w-full space-y-4"
            >
              <div className="w-3/4">
                <input
                  {...register('username')}
                  className="w-full h-10  rounded-md   border border-gray-300 pl-4  placeholder:text-sm md:placeholder:text-lg lg:placeholder:text-sm text-sm focus:ring-1 focus:ring-gray-400 focus:outline-none"
                  type="text"
                  placeholder="아이디를 입력해주세요"
                />
                {errors.username && (
                  <p className="text-xs text-red-500 pl-2">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div className="w-3/4">
                <input
                  {...register('password')}
                  className="w-full h-10   rounded-md border border-gray-300 pl-4 placeholder:text-sm md:placeholder:text-lg lg:placeholder:text-sm text-sm focus:ring-1 focus:ring-gray-400 focus:outline-none"
                  type="password"
                  placeholder="비밀번호를 입력해주세요"
                />
                {errors.password && (
                  <p className="text-xs text-red-500 pl-2">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="flex items-center justify-center w-3/4 py-2 text-white transition-all rounded-md cursor-pointer md:py-5 lg:py-2 bg-primary hover:bg-primaryButtonHover"
              >
                로그인
              </button>
            </form>
            <Link
              href="/signup"
              className="w-3/4 py-2  md:py-5 lg:py-2  rounded-md bg-slate-200 border-[1px] border-secondaryButtonBorder text-secondary flex items-center justify-center cursor-pointer hover:bg-slate-300 transition-all"
            >
              회원가입
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
