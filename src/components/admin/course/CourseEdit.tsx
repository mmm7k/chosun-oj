'use client';

import { editCourse } from '@/services/courseAdmin/editCourse';
import { getCourse } from '@/services/courseAdmin/getCourse';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

export default function CourseEdit() {
  const pathname = usePathname();
  const router = useRouter();
  // URL의 마지막 숫자 추출
  const courseId = Number(pathname.split('/').pop());

  const { data: courseModifyInformation } = useQuery({
    queryKey: ['courseModifyInformation', courseId],
    queryFn: () => getCourse(courseId),
    enabled: !!courseId, // courseId가 존재할 때만 쿼리 실행
  });

  const validationSchema = Yup.object().shape({
    code: Yup.number().required('과목코드를 입력해주세요.'),
    title: Yup.string().required('강의명을 입력해주세요.'),
    description: Yup.string().required('강의 설명을 입력해주세요.'),
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
    if (courseModifyInformation) {
      reset({
        title: courseModifyInformation.data.title,
        code: courseModifyInformation.data.code,
        description: courseModifyInformation.data.description,
      });
    }
  }, [courseModifyInformation, reset]);

  const mutation = useMutation({
    mutationFn: (data: any) => editCourse(courseId, data),
    onSuccess: () => {
      alert('강의 수정이 완료되었습니다.');
      router.push('/admin/course/list');
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <section className="flex items-center justify-between px-16">
            <h1 className="text-lg">강의 수정</h1>
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
            {/* 과목 코드 */}
            <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200">
              <div className="flex items-center">
                <label htmlFor="course-code">과목 코드:</label>
                <input
                  {...register('code')}
                  className="ml-3 w-[60%] sm:w-[20%] h-8 rounded-lg border-[1px] border-gray-200 font-norm pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
                  id="course-code"
                  type="number"
                  placeholder="과목 코드를 입력해주세요"
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
              강의 수정
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
