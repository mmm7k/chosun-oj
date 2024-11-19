'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Checkbox, message, Select } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import 'react-datepicker/dist/react-datepicker.css';
import { getClassList } from '@/services/assignmentAdmin/getClassList';
import { postAssignment } from '@/services/assignmentAdmin/postAssignment';
const { Option } = Select;

export default function PostAssignment() {
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('과제명을 입력해주세요.'),
    description: Yup.string().required('과제 설명을 입력해주세요.'),
    startDateTime: Yup.date()
      .required('시작 날짜 시간을 선택해주세요.')
      .nullable(),
    endDateTime: Yup.date()
      .min(Yup.ref('startDateTime'), '종료 날짜는 시작 날짜 이후여야 합니다.')
      .required('종료 날짜 시간을 선택해주세요.')
      .nullable(),
    isVisible: Yup.boolean(),
    tag: Yup.number().required('과제를 등록하실 주차를 선택해주세요.'),
    group: Yup.number().required('과제를 등록하실 분반을 선택해주세요.'),
    type: Yup.string().required('과제 유형을 선택해주세요.'),
  });

  const [startDateTime, setStartDateTime] = useState<Date | null>(new Date());
  const [endDateTime, setEndDateTime] = useState<Date | null>(new Date());
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const { data: classListData } = useQuery({
    queryKey: ['classListData'],
    queryFn: () => getClassList(),
  });

  const classList = classListData?.data?.results || [];
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      startDateTime,
      endDateTime,
      isVisible,
    },
  });

  const mutation = useMutation({
    mutationFn: (data) => postAssignment(data),
    onSuccess: () => {
      message.success('과제가 성공적으로 등록되었습니다.');
      router.push('/professor/assignment/list');
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

  const onSubmit = (data: any) => {
    const formattedData: any = {
      title: data.title,
      description: data.description,
      start_time: startDateTime?.toISOString(),
      end_time: endDateTime?.toISOString(),
      visible: isVisible,
      tag: data.tag,
      group: data.group,
      type: data.type,
    };
    mutation.mutate(formattedData);
  };

  return (
    <div className="flex min-h-screen p-8">
      <div className="w-full h-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary">
        <form onSubmit={handleSubmit(onSubmit)}>
          <section className="flex items-center justify-between px-16">
            <h1 className="text-lg">과제 등록</h1>
          </section>
          <hr className="mt-5 border-t-2 border-gray-200" />

          <section className="flex flex-col text-sm">
            <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200">
              <div className="flex items-center">
                <label htmlFor="contest-name">과제 이름:</label>
                <input
                  {...register('title')}
                  className="ml-3 w-[60%] sm:w-[20%] h-8 rounded-lg border-[1px] border-gray-200 font-norm pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
                  type="text"
                  placeholder="과제 이름을 입력해주세요"
                />
              </div>
              {errors.title && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200">
              <div className="flex items-center">
                <label htmlFor="contest-description">과제 설명:</label>
                <input
                  {...register('description')}
                  className="ml-3 w-[60%] sm:w-[20%] h-8 rounded-lg border-[1px] border-gray-200 font-norm pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
                  type="text"
                  placeholder="과제 설명을 입력해주세요"
                />
              </div>
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200">
              <div className="flex items-center">
                <label htmlFor="start-date-time">시작 날짜 시간:</label>
                <DatePicker
                  selected={startDateTime}
                  onChange={(date) => {
                    setStartDateTime(date);
                    setValue('startDateTime', date);
                  }}
                  showTimeSelect
                  dateFormat="Pp"
                  timeIntervals={1}
                  minDate={new Date()}
                  className="cursor-pointer ml-3 w-full h-8 rounded-lg border-[1px] border-gray-200 pl-4 focus:ring-1 focus:ring-gray-200 focus:outline-none"
                />
              </div>
              {errors.startDateTime && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.startDateTime.message}
                </p>
              )}
            </div>

            <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200">
              <div className="flex items-center">
                <label htmlFor="end-date-time">종료 날짜 시간:</label>
                <DatePicker
                  selected={endDateTime}
                  onChange={(date) => {
                    setEndDateTime(date);
                    setValue('endDateTime', date);
                  }}
                  showTimeSelect
                  dateFormat="Pp"
                  timeIntervals={1}
                  minDate={startDateTime || new Date()}
                  className="cursor-pointer ml-3 w-full h-8 rounded-lg border-[1px] border-gray-200 pl-4 focus:ring-1 focus:ring-gray-200 focus:outline-none"
                />
              </div>
              {errors.endDateTime && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.endDateTime.message}
                </p>
              )}
            </div>

            <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200">
              <div className="flex items-center">
                <label htmlFor="visibility-checkbox">공개 여부:</label>
                <Checkbox
                  checked={isVisible}
                  onChange={(e) => {
                    setIsVisible(e.target.checked);
                    setValue('isVisible', e.target.checked);
                  }}
                  className="ml-3"
                />
              </div>
            </div>

            {/* 태그 */}
            <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200 ">
              <div className="flex items-center">
                <label htmlFor="assignment-tag" className="mr-3">
                  과제 등록 주차:
                </label>
                <Controller
                  name="tag"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="문제 난이도를 선택하세요."
                      className="w-[60%] sm:w-[20%] h-8"
                    >
                      {Array.from({ length: 20 }, (_, i) => (
                        <Option key={i} value={i + 1}>
                          {i + 1}주차
                        </Option>
                      ))}
                    </Select>
                  )}
                />
              </div>
              {errors.tag && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.tag.message}
                </p>
              )}
            </div>

            {/* 분반 */}
            <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200 ">
              <div className="flex items-center">
                <label htmlFor="assignment-class" className="mr-3">
                  과제 등록 분반:
                </label>
                <Controller
                  name="group"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="과제를 등록하실 분반 선택하세요."
                      className="w-[60%] sm:w-[20%] h-8"
                    >
                      {classList.map(
                        (classData: {
                          id: number;
                          group_name: string;
                          quarter: string;
                        }) => (
                          <Option key={classData.id} value={classData.id}>
                            {classData.group_name} - {classData.quarter}
                          </Option>
                        ),
                      )}
                    </Select>
                  )}
                />
              </div>
              {errors.group && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.group.message}
                </p>
              )}
            </div>

            {/* 과제 유형*/}
            <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200 ">
              <div className="flex items-center">
                <label htmlFor="assignment-type" className="mr-3">
                  과제 유형:
                </label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="과제 유형을 선택하세요."
                      className="w-[60%] sm:w-[20%] h-8"
                    >
                      <Option value="Assignment">과제</Option>
                      <Option value="Quiz">퀴즈</Option>
                    </Select>
                  )}
                />
              </div>
              {errors.type && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.type.message}
                </p>
              )}
            </div>
          </section>

          <div className="flex justify-end w-full px-10 mt-8">
            <button
              className="px-4 py-2 text-base font-normal text-white bg-primary rounded-xl hover:bg-primaryButtonHover"
              type="submit"
            >
              과제 등록
            </button>
          </div>
        </form>
      </div>

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
