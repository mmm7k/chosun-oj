'use client';

import { Suspense } from 'react';
import ContestProblemList from '@/components/student/contest/ContestProblemList';
import ContestBanner from '@/components/student/contest/ContestBanner';
import ContestAnnouncement from '@/components/student/contest/ContestAnnouncement';
import { useQuery } from '@tanstack/react-query';
import { getContestDetailUser } from '@/services/contestUser/getContestDetailUser';

export default function Contest({ params }: { params: { contestid: string } }) {
  const contestId = parseInt(params.contestid);

  const { data: contestData } = useQuery({
    queryKey: ['contestData'],
    queryFn: () => getContestDetailUser(contestId),
  });

  const contest = contestData?.data || {};
  return (
    <>
      <Suspense>
        <ContestBanner
          title={contest.title}
          startDate={contest.start_time}
          endDate={contest.end_time}
        />
      </Suspense>
      <div className="bg-[#f0f4fc] w-full flex items-center justify-center">
        <div className="w-[90%] lg:w-[62%] pt-12 mb-44">
          <ContestAnnouncement contestId={contestId} />
          <ContestProblemList contestId={contestId} />
        </div>
      </div>
    </>
  );
}
