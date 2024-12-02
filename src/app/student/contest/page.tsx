'use client';

import Link from 'next/link';
import { HiOutlineComputerDesktop } from 'react-icons/hi2';
import { useQuery } from '@tanstack/react-query';
import { getContestListUser } from '@/services/contestUser/getContestListUser';
import { formattedDate } from '@/utils/dateFormatter';
import Skeleton from '@mui/material/Skeleton';

export default function ContestSelect() {
  const { data: contestListData, isLoading } = useQuery({
    queryKey: ['contestListData'],
    queryFn: () => getContestListUser(),
  });

  const contestList = contestListData?.data?.data || [];

  // 상태별 대회 분류
  const notStartedContests = contestList.filter(
    (contest: any) => contest.contest?.status === '1',
  );
  const ongoingContests = contestList.filter(
    (contest: any) => contest.contest?.status === '0',
  );
  const finishedContests = contestList.filter(
    (contest: any) => contest.contest?.status === '-1',
  );

  return (
    <div className="bg-[#f0f4fc] min-h-screen flex justify-center items-center px-5 py-10">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-lg space-y-10">
        {/* 대회 목록 */}
        {isLoading ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white shadow rounded-md px-4 py-3 border-l-[4px] transition-all border-gray-300"
              >
                <div className="flex space-x-3 w-full">
                  <div className="flex items-center space-x-2">
                    <Skeleton variant="circular" width={24} height={24} />
                    <Skeleton variant="text" width={50} />
                  </div>
                  <div className="flex-1">
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" />
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <Skeleton variant="text" width={80} />
                  <Skeleton variant="text" width={80} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* 진행 중 대회 */}
            {ongoingContests.length > 0 && (
              <div>
                <div className="p-5 border-b border-gray-200">
                  <h1 className="text-lg font-bold text-gray-700">
                    진행 중 대회
                  </h1>
                </div>
                <div className="p-5 space-y-3">
                  {ongoingContests.map((contest: any) => (
                    <div
                      key={contest.contest?.id}
                      className="flex items-center justify-between bg-white shadow rounded-md px-4 py-3 border-l-[4px] transition-all border-blue-400 hover:shadow-lg"
                    >
                      <div>
                        <div className="text-base font-semibold text-gray-600">
                          {contest.contest?.title}
                        </div>
                        <div className="text-xs text-gray-400">
                          {contest.contest?.description}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex flex-col mr-2">
                          <div className="text-xs text-gray-600">
                            {formattedDate(contest.contest?.start_time)}
                          </div>
                          <div className="text-xs text-gray-600">
                            ~{formattedDate(contest.contest?.end_time)}
                          </div>
                        </div>

                        <button className="px-4 py-2 text-sm  text-white bg-blue-500 rounded-md hover:bg-blue-600">
                          시작
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 시작 전 대회 */}
            {notStartedContests.length > 0 && (
              <div>
                <div className="p-5 border-b border-gray-200">
                  <h1 className="text-lg font-bold text-gray-700">
                    시작 전 대회
                  </h1>
                </div>
                <div className="p-5 space-y-3">
                  {notStartedContests.map((contest: any) => (
                    <div className="flex items-center justify-between bg-white shadow rounded-md px-4 py-3 border-l-[4px] transition-all border-yellow-400 hover:shadow-lg">
                      <div>
                        <div className="text-base font-semibold text-gray-600">
                          {contest.contest?.title}
                        </div>
                        <div className="text-xs text-gray-400">
                          {contest.contest?.description}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">
                          {formattedDate(contest.contest?.start_time)}
                        </div>
                        <div className="text-xs text-gray-600">
                          ~{formattedDate(contest.contest?.end_time)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 종료된 대회 */}
            {finishedContests.length > 0 && (
              <div>
                <div className="p-5 border-b border-gray-200">
                  <h1 className="text-lg font-bold text-gray-700">
                    종료된 대회
                  </h1>
                </div>
                <div className="p-5 space-y-3">
                  {finishedContests.map((contest: any) => (
                    <div className="flex items-center justify-between bg-white shadow rounded-md px-4 py-3 border-l-[4px] transition-all border-gray-400 hover:shadow-lg">
                      <div>
                        <div className="text-base font-semibold text-gray-600">
                          {contest.contest?.title}
                        </div>
                        <div className="text-xs text-gray-400">
                          {contest.contest?.description}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">
                          {formattedDate(contest.contest?.start_time)}
                        </div>
                        <div className="text-xs text-gray-600">
                          ~{formattedDate(contest.contest?.end_time)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
