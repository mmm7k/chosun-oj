'use client';

import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getAnnouncement } from '@/services/announcementAdmin/getAnnouncement';

export default function AnnouncementDetail() {
  const pathname = usePathname();

  // URL의 마지막 숫자 추출
  const announcementId = Number(pathname.split('/').pop());

  const { data: announcementInformation } = useQuery({
    queryKey: ['announcementInformation', announcementId],
    queryFn: () => getAnnouncement(announcementId),
    enabled: !!announcementId, // announcementId가 존재할 때만 쿼리 실행
  });

  const announcementData: AnnouncementData =
    announcementInformation?.data || ({} as AnnouncementData);

  const formattedDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  return (
    <div className="flex min-h-screen p-8">
      <div className="w-full h-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary">
        <section className="flex px-16">
          <h1 className="text-lg">공지 정보</h1>
        </section>
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
