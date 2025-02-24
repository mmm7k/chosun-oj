'use client';

import { postCourse } from '@/services/courseAdmin/postCourse';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

export default function PostCourse() {
  const router = useRouter();
  const validationSchema = Yup.object().shape({
    code: Yup.number().required('강의 코드를 입력해주세요.'),
    title: Yup.string().required('강의명을 입력해주세요.'),
    description: Yup.string().required('강의 설명을 입력해주세요.'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const mutation = useMutation({
    mutationFn: (data) => postCourse(data),
    onSuccess: () => {
      message.success('강의가 성공적으로 등록되었습니다.');
      router.push('/admin/course/list');
    },
    onError: (error: any) => {
      if (error.response?.data?.message === '로그인이 필요합니다.') {
        message.error('로그인이 필요합니다.');
        router.push('/');
      } else {
        message.error(error.response?.data?.message);
      }
    },
  });
  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen p-8">
      <div className="w-full h-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary">
        <form onSubmit={handleSubmit(onSubmit)}>
          <section className="flex items-center justify-between px-16">
            <h1 className="text-lg">강의 개설</h1>
          </section>
          <hr className="mt-5 border-t-2 border-gray-200" />
          {/* 강의 정보 입력 */}
          <section className="flex flex-col text-sm ">
            {/* 강의 이름 */}
            <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200 ">
              <div className="flex items-center">
                <label htmlFor="course-name">강의 이름:</label>
                <input
                  {...register('title')}
                  className="ml-3 w-[60%] sm:w-[20%] h-8 rounded-lg  border-[1px] border-gray-200 font-norm pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
                  id="course-name"
                  type="text"
                  placeholder="강의 이름을 입력해주세요"
                />
              </div>
              {errors.title && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* 강의 설명 */}
            <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200">
              <div className="flex items-center">
                <label htmlFor="course-description">강의 설명:</label>
                <input
                  {...register('description')}
                  className="ml-3 w-[60%] sm:w-[20%] h-8 rounded-lg border-[1px] border-gray-200 font-norm pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
                  id="course-description"
                  type="text"
                  placeholder="강의 설명을 입력해주세요"
                />
              </div>
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
            {/* 강의 코드 */}
            <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200">
              <div className="flex items-center">
                <label htmlFor="course-code">강의 코드:</label>
                <input
                  {...register('code')}
                  className="ml-3 w-[60%] sm:w-[20%] h-8 rounded-lg border-[1px] border-gray-200 font-norm pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
                  id="course-code"
                  type="number"
                  placeholder="강의 코드를 입력해주세요"
                  style={{
                    MozAppearance: 'textfield',
                  }}
                />
              </div>
              {errors.code && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.code.message}
                </p>
              )}
            </div>
          </section>

          <div className="flex justify-end w-full px-10 mt-8">
            <button
              className="px-4 py-2 text-base font-normal text-white bg-primary rounded-xl hover:bg-primaryButtonHover"
              type="submit"
            >
              강의 개설
            </button>
          </div>
        </form>
      </div>

      <style jsx>
        {`
          /* Chrome, Edge, Safari - 스피너 제거 */
          input[type='number']::-webkit-outer-spin-button,
          input[type='number']::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
        `}
      </style>
    </div>
  );
}
