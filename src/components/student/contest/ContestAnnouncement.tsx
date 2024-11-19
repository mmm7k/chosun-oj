'use client';

import { getContestAnnouncementUser } from '@/services/contestUser/getContestAnnouncementUser';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';

export default function ContestAnnouncement({
  contestId,
}: {
  contestId: number;
}) {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const { data: contestAnnouncementData } = useQuery({
    queryKey: ['contestAnnouncementData'],
    queryFn: () => getContestAnnouncementUser(contestId),
  });

  const announcementList = contestAnnouncementData?.data?.data || [];

  const toggleItemExpansion = (id: number) => {
    if (expandedItems.includes(id)) {
      setExpandedItems(expandedItems.filter((itemId) => itemId !== id));
    } else {
      setExpandedItems([...expandedItems, id]);
    }
  };

  return (
    <section className="flex flex-col w-full mb-10 bg-white border border-gray-300 rounded-2xl">
      {/* 공지사항 아코디언 */}
      {announcementList.map((announcement: any) => (
        <div
          key={announcement.id}
          className="border-b border-gray-200 last:border-b-0"
        >
          <div
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#eeeff3] "
            onClick={() => toggleItemExpansion(announcement.id)}
          >
            <span className="text-sm">📢 {announcement.title}</span>
            <span className="text-lg">
              {expandedItems.includes(announcement.id) ? (
                <IoChevronUp />
              ) : (
                <IoChevronDown />
              )}
            </span>
          </div>
          {expandedItems.includes(announcement.id) && (
            <div className="px-10 py-4 text-sm border-t border-gray-300">
              <p>{announcement.content}</p>
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
