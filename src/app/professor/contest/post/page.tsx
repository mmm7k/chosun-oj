'use client';

import { postContest } from '@/services/contestAdmin/postContest';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { Checkbox, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import 'react-datepicker/dist/react-datepicker.css';

export default function PostContest() {
  const router = useRouter();
  const validationSchema = Yup.object().shape({
    title: Yup.string().required('대회명을 입력해주세요.'),
    description: Yup.string().required('대회 설명을 입력해주세요.'),
    startDateTime: Yup.date()
      .required('시작 날짜 시간을 선택해주세요.')
      .nullable(),
    endDateTime: Yup.date()
      .min(Yup.ref('startDateTime'), '종료 날짜는 시작 날짜 이후여야 합니다.')
      .required('종료 날짜 시간을 선택해주세요.')
      .nullable(),
    password: Yup.string().max(32, '비밀번호는 최대 32자까지 가능합니다.'),
    isVisible: Yup.boolean(),
    allowedIpRanges: Yup.string()
      .matches(
        /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d{1,2})$/,
        '유효한 IP 범위 형식이 아닙니다. 예: 192.168.1.0/24',
      )
      .required('허용 아이피 범위를 입력해주세요.'),
  });

  const [startDateTime, setStartDateTime] = useState<Date | null>(new Date());
  const [endDateTime, setEndDateTime] = useState<Date | null>(new Date());
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [allowedIpRanges, setAllowedIpRanges] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      startDateTime,
      endDateTime,
      isVisible,
      allowedIpRanges,
      password,
    },
  });

  const mutation = useMutation({
    mutationFn: (data) => postContest(data),
    onSuccess: () => {
      message.success('대회가 성공적으로 등록되었습니다.');
      router.push('/professor/contest/list?page=1');
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
    // UTC -> KST 변환
    const convertToKST = (date: Date | null) => {
      if (!date) return null;
      const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000); // 9시간 추가
      return kstDate.toISOString().slice(0, -1); // 'Z' 제거
    };

    const startTimeKST = convertToKST(startDateTime);
    const endTimeKST = convertToKST(endDateTime);

    const formattedData: any = {
      title: data.title,
      description: data.description,
      // start_time: startDateTime?.toISOString(),
      // end_time: endDateTime?.toISOString(),
      start_time: startTimeKST,
      end_time: endTimeKST,
      password: data.password,
      visible: isVisible,
      allowed_ip_ranges: [allowedIpRanges],
    };
    mutation.mutate(formattedData);
  };

  return (
    <div className="flex min-h-screen p-8">
      <div className="w-full h-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary">
        <form onSubmit={handleSubmit(onSubmit)}>
          <section className="flex items-center justify-between px-16">
            <h1 className="text-lg">대회 등록</h1>
          </section>
          <hr className="mt-5 border-t-2 border-gray-200" />

          <section className="flex flex-col text-sm">
            <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200">
              <div className="flex items-center">
                <label htmlFor="contest-name">대회 이름:</label>
                <input
                  {...register('title')}
                  className="ml-3 w-[60%] sm:w-[20%] h-8 rounded-lg border-[1px] border-gray-200 font-norm pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
                  type="text"
                  placeholder="대회 이름을 입력해주세요"
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
                <label htmlFor="contest-description">대회 설명:</label>
                <input
                  {...register('description')}
                  className="ml-3 w-[60%] sm:w-[20%] h-8 rounded-lg border-[1px] border-gray-200 font-norm pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
                  type="text"
                  placeholder="대회 설명을 입력해주세요"
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
                <label htmlFor="password">대회 비밀번호:</label>
                <input
                  {...register('password')}
                  className="ml-3 w-[60%] sm:w-[20%] h-8 rounded-lg border-[1px] border-gray-200 font-norm pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
                  type="password"
                  placeholder="대회 비밀번호를 입력해주세요"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
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

            <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200">
              <div className="flex items-center">
                <label htmlFor="ip-ranges">허용 아이피 범위:</label>
                <input
                  id="ip-ranges"
                  {...register('allowedIpRanges')}
                  value={allowedIpRanges}
                  onChange={(e) => {
                    setAllowedIpRanges(e.target.value);
                    setValue('allowedIpRanges', e.target.value);
                  }}
                  className="ml-3 w-[60%] sm:w-[40%] h-8 rounded-lg border-[1px] border-gray-200 pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
                  placeholder="허용 아이피 범위를 입력하세요 (예: 192.168.1.0/24)"
                />
              </div>
              {errors.allowedIpRanges && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.allowedIpRanges.message}
                </p>
              )}
            </div>
          </section>

          <div className="flex justify-end w-full px-10 mt-8">
            <button
              className="px-4 py-2 text-base font-normal text-white bg-primary rounded-xl hover:bg-primaryButtonHover"
              type="submit"
            >
              대회 등록
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
