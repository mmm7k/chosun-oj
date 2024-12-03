'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Checkbox, message } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import 'react-datepicker/dist/react-datepicker.css';
import { getContest } from '@/services/contestAdmin/getContest';
import { editContest } from '@/services/contestAdmin/editContest';

export default function ContestEdit() {
  const pathname = usePathname();
  const router = useRouter();
  // URL의 마지막 숫자 추출
  const contestId = Number(pathname.split('/').pop());

  const { data: contestInformation, refetch } = useQuery({
    queryKey: ['contestInformation', contestId],
    queryFn: () => getContest(contestId),
    enabled: !!contestId,
  });

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
    // password: Yup.string()
    //   .max(32, '비밀번호는 최대 32자까지 가능합니다.')
    //   .nullable(),
    isVisible: Yup.boolean(),
    allowedIpRanges: Yup.string(),
  });

  const [startDateTime, setStartDateTime] = useState<Date | null>(new Date());
  const [endDateTime, setEndDateTime] = useState<Date | null>(new Date());
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [allowedIpRanges, setAllowedIpRanges] = useState<string>('');
  const [ipList, setIpList] = useState<string[]>([]); // 추가된 IP 목록

  // const [password, setPassword] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      startDateTime,
      endDateTime,
      isVisible,
      allowedIpRanges,
      // password,
    },
  });

  useEffect(() => {
    if (contestInformation) {
      setStartDateTime(new Date(contestInformation.data.start_time));
      setEndDateTime(new Date(contestInformation.data.end_time));
      setAllowedIpRanges(contestInformation.data.allowed_ip_ranges[0]);
      setIpList(contestInformation.data.allowed_ip_ranges || []);
      reset({
        title: contestInformation.data.title,
        description: contestInformation.data.description,
        startDateTime: new Date(contestInformation.data.start_time),
        endDateTime: new Date(contestInformation.data.end_time),
        // password: contestInformation.data.password,
        isVisible: contestInformation.data.visible,
        allowedIpRanges: contestInformation.data.allowed_ip_ranges[0],
      });
    }
  }, [contestInformation, reset]);

  const mutation = useMutation({
    mutationFn: (data) => editContest(contestId, data),
    onSuccess: () => {
      message.success('대회가 성공적으로 수정되었습니다.');
      refetch();
      router.push('/professor/contest/list');
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
      // password: data.password,
      password: '',
      visible: isVisible,
      // allowed_ip_ranges: [allowedIpRanges],
      allowed_ip_ranges: ipList.length > 0 ? ipList : ['0.0.0.0/0'],
    };
    mutation.mutate(formattedData);
  };

  const handleAddIp = () => {
    if (allowedIpRanges.trim() && !ipList.includes(allowedIpRanges.trim())) {
      setIpList((prev) => [...prev, allowedIpRanges.trim()]);
      setAllowedIpRanges(''); // 입력 필드 초기화
    }
  };

  const handleRemoveIp = (ip: string) => {
    setIpList((prev) => prev.filter((item) => item !== ip));
  };

  return (
    <div className="flex min-h-screen p-8">
      <div className="w-full h-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary">
        <form onSubmit={handleSubmit(onSubmit)}>
          <section className="flex items-center justify-between px-16">
            <h1 className="text-lg">대회 수정</h1>
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
                  className="cursor-pointer ml-3 w-full h-8 rounded-lg border-[1px] border-gray-200 pl-4 focus:ring-1 focus:ring-gray-200 focus:outline-none"
                />
              </div>
              {errors.endDateTime && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.endDateTime.message}
                </p>
              )}
            </div>

            {/* <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200">
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
            </div> */}

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

            {/* <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200">
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
            </div> */}
            <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200">
              <div className="flex items-center">
                <label htmlFor="ip-ranges">허용 아이피 범위:</label>
                <input
                  id="ip-ranges"
                  value={allowedIpRanges}
                  onChange={(e) => setAllowedIpRanges(e.target.value)}
                  className="ml-3 w-[40%] sm:w-[30%] h-8 rounded-lg border-[1px] border-gray-200 pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
                  placeholder="192.168.1.0/24"
                />
                <button
                  type="button"
                  onClick={handleAddIp}
                  className="ml-2 px-2 py-2 text-sm font-normal text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                  추가
                </button>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-sm">추가된 IP 목록:</h3>
                <ul className="mt-2 space-x-1 flex flex-wrap gap-2">
                  {ipList.map((ip, index) => (
                    <li
                      key={index}
                      className="flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      <span>{ip}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveIp(ip)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ✖
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <div className="flex justify-end w-full px-10 mt-8">
            <button
              className="px-4 py-2 text-base font-normal text-white bg-primary rounded-xl hover:bg-primaryButtonHover"
              type="submit"
            >
              대회 수정
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
