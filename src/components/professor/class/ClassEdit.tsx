'use client';

import { editClass } from '@/services/classProfessor/editClass';
import { getClass } from '@/services/classProfessor/getClass';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { Select } from 'antd';

const { Option } = Select;

export default function ClassEdit() {
  const pathname = usePathname();
  const router = useRouter();
  // URL의 마지막 숫자 추출
  const classId = Number(pathname.split('/').pop());

  const { data: classModifyInformation } = useQuery({
    queryKey: ['classModifyInformation', classId],
    queryFn: () => getClass(classId),
    enabled: !!classId, // classId가 존재할 때만 쿼리 실행
  });

  const validationSchema = Yup.object().shape({
    group_name: Yup.string().required('분반 이름을 입력해주세요.'),
    description: Yup.string().required('분반 정보를 입력해주세요.'),
    short_description: Yup.string().required('분반 설명을 입력해주세요.'),
    course: Yup.number().required('강의 코드를 입력해주세요.'),
    year: Yup.number().required('개설년도를 입력해주세요.'),
    quarter: Yup.string().required('학기를 선택해주세요.'),
    language: Yup.string().required('분반에 사용될 언어를 선택해주세요.'),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (classModifyInformation) {
      reset({
        group_name: classModifyInformation.data.group_name,
        description: classModifyInformation.data.description,
        short_description: classModifyInformation.data.short_description,
        course: classModifyInformation.data.course?.code,
        year: classModifyInformation.data.year,
        quarter: classModifyInformation.data.quarter,
        language: classModifyInformation.data.language,
      });
    }
  }, [classModifyInformation, reset]);

  const mutation = useMutation({
    mutationFn: (data: any) => editClass(classId, data),
    onSuccess: () => {
      alert('분반 수정이 완료되었습니다.');
      router.push('/professor/class/list');
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
            <h1 className="text-lg">분반 수정</h1>
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
                  placeholder="분반 정보 입력해주세요"
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
                  placeholder="분반 정보 입력해주세요"
                />
              </div>
              {errors.short_description && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.short_description.message}
                </p>
              )}
            </div>

            {/* 강의 코드 */}
            <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200">
              <div className="flex items-center">
                <label htmlFor="course-code">강의 코드:</label>
                <input
                  {...register('course')}
                  className="ml-3 w-[60%] sm:w-[20%] h-8 rounded-lg border-[1px] border-gray-200 font-norm pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
                  id="course-code"
                  type="number"
                  placeholder="강의 코드를 입력해주세요"
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

            {/* 개설년도 */}
            <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200">
              <div className="flex items-center">
                <label htmlFor="class-year">개설년도:</label>
                <input
                  {...register('year')}
                  className="ml-3 w-[60%] sm:w-[20%] h-8 rounded-lg border-[1px] border-gray-200 font-norm pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
                  id="class-year"
                  type="number"
                  placeholder="개설년도를 입력해주세요"
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

            {/* 학기 선택 */}
            <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200">
              <div className="flex items-center">
                <label htmlFor="quarter">학기:</label>
                <Select
                  {...register('quarter')}
                  className="ml-3 w-[60%] sm:w-[30%] "
                  placeholder="학기를 선택해주세요"
                  value={classModifyInformation?.data.quarter}
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
                  value={classModifyInformation?.data.language}
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
              분반 수정
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
