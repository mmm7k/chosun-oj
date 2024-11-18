'use client';

import { editAnnouncement } from '@/services/announcementAdmin/editAnnouncement';
import { getAnnouncement } from '@/services/announcementAdmin/getAnnouncement';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Checkbox, message } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

export default function AnnouncementEdit() {
  const pathname = usePathname();
  const router = useRouter();
  // URL의 마지막 숫자 추출
  const announcementId = Number(pathname.split('/').pop());

  const { data: announcementInformation, refetch } = useQuery({
    queryKey: ['announcementInformation', announcementId],
    queryFn: () => getAnnouncement(announcementId),
    enabled: !!announcementId, // announcementId가 존재할 때만 쿼리 실행
  });

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('공지 제목을 입력해주세요.'),
    content: Yup.string().required('공지 내용을 입력해주세요.'),
    visible: Yup.boolean(),
  });
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      visible: isVisible,
    },
  });

  useEffect(() => {
    if (announcementInformation) {
      reset({
        title: announcementInformation.data.title,
        content: announcementInformation.data.content,
        visible: announcementInformation.data.visible,
      });
    }
  }, [announcementInformation, reset]);

  const mutation = useMutation({
    mutationFn: (data: any) => editAnnouncement(announcementId, data),
    onSuccess: () => {
      message.success('공지가 성공적으로 수정되었습니다.');
      refetch();
      router.push('/admin/announcement/list');
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
      content: data.content,
      visible: isVisible,
    };
    mutation.mutate(formattedData);
  };

  return (
    <div className="flex min-h-screen p-8">
      <div className="w-full h-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary">
        <form onSubmit={handleSubmit(onSubmit)}>
          <section className="flex items-center justify-between px-16">
            <h1 className="text-lg">공지 수정</h1>
          </section>
          <hr className="mt-5 border-t-2 border-gray-200" />
          <section className="flex flex-col text-sm">
            <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200">
              <div className="flex items-center">
                <label htmlFor="visibility-checkbox">공개 여부:</label>
                <Checkbox
                  checked={isVisible}
                  onChange={(e) => {
                    setIsVisible(e.target.checked);
                    setValue('visible', e.target.checked);
                  }}
                  className="ml-3"
                />
              </div>
            </div>

            <div className="px-10 py-4 border-b-[1.5px] border-gray-200">
              <input
                className="w-full h-10   rounded-lg border-[1px] border-gray-200 pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
                type="text"
                {...register('title')}
                placeholder="공지 제목을 입력하세요."
              />
              {errors.title && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div className="px-10 py-4 border-b-[1.5px] border-gray-200">
              <textarea
                rows={6}
                className="w-full h-[30dvh] rounded-lg border-[1px] border-gray-200 p-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none resize-none"
                {...register('content')}
                placeholder="공지 내용을 입력하세요."
              />
              {errors.content && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.content.message}
                </p>
              )}
            </div>
          </section>
          <div className="flex justify-end px-10 mt-8">
            <button
              className="px-4 py-2 text-base font-normal text-white bg-primary rounded-xl hover:bg-primaryButtonHover"
              type="submit"
            >
              공지 등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
