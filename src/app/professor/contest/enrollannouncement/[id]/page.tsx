'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Checkbox, message, Modal } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { FiTrash2 } from 'react-icons/fi';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { postContestAnnouncement } from '@/services/contestannouncementAdmin/postContestAnnouncement';
import { getAllContestAnnouncement } from '@/services/contestannouncementAdmin/getAllContestAnnouncement';
import Skeleton from '@mui/material/Skeleton';
import { deleteContestAnnouncement } from '@/services/contestannouncementAdmin/deleteContestAnnouncement';
import { TbEdit } from 'react-icons/tb';

export default function EnrollContestAnnouncementPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const contestId = Number(pathname.split('/').pop());

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
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      visible: isVisible,
    },
  });

  const mutation = useMutation({
    mutationFn: (data) => postContestAnnouncement(contestId, data),
    onSuccess: () => {
      message.success('공지가 성공적으로 등록되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['contestAnnouncementsListData', contestId],
      });
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

  const onSubmit = (data: {
    visible?: boolean;
    title: string;
    content: string;
  }) => {
    const formattedData: any = {
      title: data.title,
      content: data.content,
      visible: isVisible,
    };
    mutation.mutate(formattedData);
  };

  const { data: announcementsListData, isLoading: announcementsIsLoading } =
    useQuery({
      queryKey: ['contestAnnouncementsListData', contestId],
      queryFn: () => getAllContestAnnouncement(contestId),
    });

  const announcements = announcementsListData?.data || [];

  const deleteMutation = useMutation({
    mutationFn: (announcementId: number) =>
      deleteContestAnnouncement(contestId, announcementId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['contestAnnouncementsListData', contestId],
      });
      message.success('공지가 성공적으로 삭제되었습니다.');
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

  const handleDelete = (announcementId: number) => {
    Modal.confirm({
      title: '정말 삭제하시겠습니까?',
      content: '이 작업은 되돌릴 수 없습니다.',
      okText: '삭제',
      okType: 'danger',
      cancelText: '취소',
      onOk: () => deleteMutation.mutate(announcementId),
    });
  };
  return (
    <div className="flex flex-col min-h-screen p-8 space-y-8">
      {/* 공지 등록 폼 */}
      <div className="w-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary">
        <form onSubmit={handleSubmit(onSubmit)}>
          <section className="flex items-center px-16">
            <h1 className="mb-3 text-lg md:mb-0">대회 공지 관리</h1>
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
                className="w-full h-10 rounded-lg border-[1px] border-gray-200 pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
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

      {/* 등록된 공지 목록 */}
      <div className="w-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary">
        <div className="flex flex-col justify-center px-10 py-4">
          <h1 className="text-lg px-6">등록된 공지 목록</h1>
          <hr className="mt-5 border-t-2 border-gray-200" />
          <div className="overflow-auto max-h-80 border mt-5">
            <table
              className="table-auto w-full text-left text-sm"
              style={{ tableLayout: 'fixed' }}
            >
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 border-b">제목</th>
                  <th className="px-4 py-2 border-b">내용</th>
                  <th className="px-4 py-2 border-b">공개 여부</th>
                  <th className="px-4 py-2 border-b ">관리</th>
                </tr>
              </thead>
              <tbody>
                {announcementsIsLoading ? (
                  Array.from({ length: 4 }).map((_, rowIndex) => (
                    <tr key={rowIndex}>
                      {Array.from({ length: 4 }).map((_, colIndex) => (
                        <td key={colIndex} className="p-4">
                          <Skeleton animation="wave" width="100%" height={20} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : announcements.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-500 py-4">
                      등록된 공지가 없습니다.
                    </td>
                  </tr>
                ) : (
                  announcements.map((announcement: any) => (
                    <tr
                      key={announcement.id}
                      className="hover:bg-gray-50"
                      onClick={() => {
                        router.push(
                          `/professor/contest/enrollannouncement/${contestId}/${announcement.id}`,
                        );
                      }}
                    >
                      <td className="px-4 py-2 border-b overflow-hidden text-ellipsis whitespace-nowrap">
                        {announcement.title}
                      </td>
                      <td className="px-4 py-2 border-b overflow-hidden text-ellipsis whitespace-nowrap">
                        {announcement.content}
                      </td>
                      <td className="px-4 py-2 border-b overflow-hidden text-ellipsis whitespace-nowrap">
                        {announcement.visible ? '공개' : '비공개'}
                      </td>
                      <td className="px-4 py-2 border-b overflow-hidden text-ellipsis whitespace-nowrap  ">
                        <div className="flex items-center space-x-2">
                          <TbEdit
                            className="text-lg cursor-pointer lg:text-xl hover:text-gray-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(
                                `/professor/contest/enrollannouncement/${contestId}/edit/${announcement.id}`,
                              );
                            }}
                          />

                          <FiTrash2
                            className="text-lg cursor-pointer lg:text-xl hover:text-gray-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(announcement.id);
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
