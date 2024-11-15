'use client';

import { postClass } from '@/services/classProfessor/postClass';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { Select } from 'antd';

const { Option } = Select;

export default function PostClass() {
  const router = useRouter();
  const validationSchema = Yup.object().shape({
    group_name: Yup.string().required('분반 이름을 입력해주세요.'),
    description: Yup.string().required('분반 정보를 입력해주세요.'),
    short_description: Yup.string().required('분반 설명을 입력해주세요.'),
    course: Yup.number().required('과목코드를 입력해주세요.'),
    year: Yup.number().required('개설년도를 입력해주세요.'),
    quarter: Yup.string().required('학기를 선택해주세요.'),
    language: Yup.string().required('분반에 사용될 언어를 선택해주세요.'),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const mutation = useMutation({
    mutationFn: (data) => postClass(data),
    onSuccess: () => {
      alert('분반 개설이 완료되었습니다.');
      router.push('/professor/class/list');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message;
      if (message === '로그인이 필요합니다.') {
        alert(message);
        router.push('/');
      } else {
        alert(message || '오류가 발생했습니다.');
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
            <h1 className="text-lg">분반 개설</h1>
          </section>
          <hr className="mt-5 border-t-2 border-gray-200" />
          {/* 분반 정보 입력 */}
          <section className="flex flex-col text-sm ">
            {/* 분반 이름 */}
            <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200 ">
              <div className="flex items-center">
                <label htmlFor="class-name">분반 이름:</label>
                <input
                  {...register('group_name')}
                  className="ml-3 w-[60%] sm:w-[20%] h-8 rounded-lg  border-[1px] border-gray-200 font-norm pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
                  id="class-name"
                  type="text"
                  placeholder="분반 이름을 입력해주세요"
                />
              </div>
              {errors.group_name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.group_name.message}
                </p>
              )}
            </div>

            {/* 분반 정보 */}
            <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200">
              <div className="flex items-center">
                <label htmlFor="class-description">분반 정보:</label>
                <input
                  {...register('description')}
                  className="ml-3 w-[60%] sm:w-[20%] h-8 rounded-lg border-[1px] border-gray-200 font-norm pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
                  id="class-description"
                  type="text"
                  placeholder="분반 정보를 입력해주세요"
                />
              </div>
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
            {/* 분반 설명 */}
            <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200">
              <div className="flex items-center">
                <label htmlFor="class-short-description">분반 설명:</label>
                <input
                  {...register('short_description')}
                  className="ml-3 w-[60%] sm:w-[20%] h-8 rounded-lg border-[1px] border-gray-200 font-norm pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
                  id="class-short-description"
                  type="text"
                  placeholder="분반 설명을 입력해주세요"
                />
              </div>
              {errors.short_description && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.short_description.message}
                </p>
              )}
            </div>
            {/* 과목 코드 */}
            <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200">
              <div className="flex items-center">
                <label htmlFor="course-code">과목 코드:</label>
                <input
                  {...register('course')}
                  className="ml-3 w-[60%] sm:w-[20%] h-8 rounded-lg border-[1px] border-gray-200 font-norm pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
                  id="course-code"
                  type="number"
                  placeholder="과목 코드를 입력해주세요"
                  style={{
                    MozAppearance: 'textfield',
                  }}
                />
              </div>
              {errors.course && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.course.message}
                </p>
              )}
            </div>

            {/* 강의 코드 */}
            <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200">
              <div className="flex items-center">
                <label htmlFor="course-year">개설년도:</label>
                <input
                  {...register('year')}
                  className="ml-3 w-[60%] sm:w-[20%] h-8 rounded-lg border-[1px] border-gray-200 font-norm pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
                  id="course-year"
                  type="number"
                  placeholder="개설년도를 입력해주세요"
                  style={{
                    MozAppearance: 'textfield',
                  }}
                />
              </div>
              {errors.year && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.year.message}
                </p>
              )}
            </div>
            {/* 학기 선택 */}
            <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200">
              <div className="flex items-center">
                <label htmlFor="quarter">학기:</label>
                <Select
                  {...register('quarter')}
                  className="ml-3 w-[60%] sm:w-[30%] "
                  placeholder="학기를 선택해주세요"
                  onChange={(value) => setValue('quarter', value)}
                >
                  <Option value="1학기">1학기</Option>
                  <Option value="2학기">2학기</Option>
                  <Option value="동계계절학기">동계계절학기</Option>
                  <Option value="하계계절학기">하계계절학기</Option>
                </Select>
              </div>
              {errors.quarter && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.quarter.message}
                </p>
              )}
            </div>

            {/* 언어 선택 */}
            <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200">
              <div className="flex items-center">
                <label htmlFor="language">언어:</label>
                <Select
                  {...register('language')}
                  className="ml-3 w-[60%] sm:w-[30%] "
                  placeholder="언어를 선택해주세요"
                  onChange={(value) => setValue('language', value)}
                >
                  <Option value="C">C</Option>
                  <Option value="C++">C++</Option>
                  <Option value="Java">Java</Option>
                  <Option value="Python">Python</Option>
                </Select>
              </div>
              {errors.language && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.language.message}
                </p>
              )}
            </div>
          </section>

          <div className="flex justify-end w-full px-10 mt-8">
            <button
              className="px-4 py-2 text-base font-normal text-white bg-primary rounded-xl hover:bg-primaryButtonHover"
              type="submit"
            >
              분반 개설
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
