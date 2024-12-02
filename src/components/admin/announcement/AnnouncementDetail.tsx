'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getAnnouncement } from '@/services/announcementAdmin/getAnnouncement';
import { formattedDate } from '@/utils/dateFormatter';
import { TbEdit } from 'react-icons/tb';
import { FiTrash2 } from 'react-icons/fi';
import { deleteAnnouncement } from '@/services/announcementAdmin/deleteAnnouncement';
import { message, Modal } from 'antd';

export default function AnnouncementDetail() {
  const pathname = usePathname();
  const router = useRouter();
  // URL의 마지막 숫자 추출
  const announcementId = Number(pathname.split('/').pop());

  const { data: announcementInformation } = useQuery({
    queryKey: ['announcementInformation', announcementId],
    queryFn: () => getAnnouncement(announcementId),
    enabled: !!announcementId, // announcementId가 존재할 때만 쿼리 실행
  });

  const announcementData: AnnouncementData =
    announcementInformation?.data || ({} as AnnouncementData);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteAnnouncement(id),
    onSuccess: () => {
      message.success('공지가 성공적으로 삭제되었습니다.');
      router.push('/admin/announcement/list?page=1');
    },
    onError: (error: any) => {
      if (error.response?.data?.message === '로그인이 필요합니다.') {
        message.error('로그인이 필요합니다.');
        router.push('/');
      } else {
        message.error(
          error.response?.data?.message || '삭제 중 오류가 발생했습니다.',
        );
      }
    },
  });

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '정말 삭제하시겠습니까?',
      content: '이 작업은 되돌릴 수 없습니다.',
      okText: '삭제',
      okType: 'danger',
      cancelText: '취소',
      onOk: () => {
        deleteMutation.mutate(id); // 삭제 뮤테이션 호출
      },
    });
  };

  return (
    <div className="flex min-h-screen p-8">
      <div className="w-full h-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary">
        <div className="flex justify-between items-center  px-16 ">
          <section className="flex">
            <h1 className="text-lg">공지 정보</h1>
          </section>
          <div className="flex items-center gap-2">
            <TbEdit
              className="text-lg cursor-pointer lg:text-2xl hover:text-gray-500"
              onClick={() => {
                router.push(`/admin/announcement/edit/${announcementId}`);
              }}
            />
            <FiTrash2
              className="text-lg cursor-pointer lg:text-2xl hover:text-gray-500"
              onClick={() => {
                handleDelete(announcementId);
              }}
            />
          </div>
        </div>
        <hr className="mt-5 border-t-2 border-gray-200" />

        {/* 사용자 정보 표시 */}
        <div className="flex flex-col  text-sm">
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>ID:</span>
            <span>{announcementData.id}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10  ">
            <span>공지 제목:</span>
            <span>{announcementData.title}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10 ">
            <span>공지 내용:</span>
            <span>{announcementData.content}</span>
          </div>

          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>생성 시간:</span>
            <span>{formattedDate(announcementData.create_time)}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>마지막 수정 시간:</span>
            <span>{formattedDate(announcementData.last_update_time)}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>공개 여부:</span>
            <span>{announcementData.visible ? '공개' : '비공개'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
