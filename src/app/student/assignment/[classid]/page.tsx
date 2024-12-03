'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getAssignmentUser } from '@/services/assignmentUser/getAssignmentUser';
import { FaQuestionCircle, FaClipboardList } from 'react-icons/fa';
import { formattedDate } from '@/utils/dateFormatter';
import Skeleton from '@mui/material/Skeleton';

export default function Assignment({
  params,
}: {
  params: { classid: string };
}) {
  const classId = parseInt(params.classid);

  const { data: assignmentData, isLoading } = useQuery({
    queryKey: ['assignmentData', classId],
    queryFn: () => getAssignmentUser(classId),
  });

  const assignments = assignmentData?.data || [];

  // 상태별로 분류
  const notStartedAssignments = assignments.filter(
    (assignment: any) => assignment.status === '1',
  );
  const ongoingAssignments = assignments.filter(
    (assignment: any) => assignment.status === '0',
  );
  const finishedAssignments = assignments.filter(
    (assignment: any) => assignment.status === '-1',
  );

  return (
    <div className="bg-[#f0f4fc] min-h-screen flex justify-center items-center px-5 py-10">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-lg space-y-10">
        {/* 과제 섹션 */}
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
            {/* 진행 중 */}
            <div>
              <div className="p-5 border-b border-gray-200">
                <h1 className="text-lg font-bold text-gray-700">
                  진행 중 과제
                </h1>
              </div>
              <div className="p-5 space-y-3">
                {ongoingAssignments.length > 0 ? (
                  ongoingAssignments.map((assignment: any) => (
                    <Link
                      key={assignment.id}
                      href={`/student/assignment/${classId}/${assignment.id}?page=1`}
                      className="block"
                    >
                      <div
                        className={`flex items-center justify-between bg-white shadow rounded-md px-4 py-3 border-l-[4px] transition-all ${
                          assignment.type === 'Quiz'
                            ? 'border-blue-400 hover:shadow-lg'
                            : 'border-green-400 hover:shadow-lg'
                        }`}
                      >
                        <div className="flex space-x-3">
                          {/* 아이콘 */}
                          <div className="flex items-center space-x-2">
                            {assignment.type === 'Quiz' ? (
                              <div className="flex items-center space-x-2 text-blue-600">
                                <FaQuestionCircle className="text-lg" />
                                <span className="text-sm font-semibold">
                                  퀴즈
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2 text-green-600">
                                <FaClipboardList className="text-lg" />
                                <span className="text-sm font-semibold">
                                  과제
                                </span>
                              </div>
                            )}
                          </div>

                          {/* 제목 및 설명 */}
                          <div>
                            <div className="text-base font-semibold text-gray-600">
                              {assignment.title}
                            </div>
                            <div className="text-xs text-gray-400">
                              {assignment.description}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">
                            {formattedDate(assignment.start_time)}
                          </div>
                          <div className="text-xs text-gray-600">
                            ~{formattedDate(assignment.end_time)}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center font-semibold text-gray-500">
                    진행 중인 과제가 없습니다.
                  </div>
                )}
              </div>
            </div>

            {/* 시작 전 */}
            <div>
              <div className="p-5 border-b border-gray-200">
                <h1 className="text-lg font-bold text-gray-700">
                  시작 전 과제
                </h1>
              </div>
              <div className="p-5 space-y-3">
                {notStartedAssignments.length > 0 ? (
                  notStartedAssignments.map((assignment: any) => (
                    <div
                      key={assignment.id}
                      className={`flex items-center justify-between bg-white shadow rounded-md px-4 py-3 border-l-[4px] transition-all ${
                        assignment.type === 'Quiz'
                          ? 'border-blue-400 hover:shadow-lg'
                          : 'border-green-400 hover:shadow-lg'
                      }`}
                    >
                      <div className="flex space-x-3">
                        {/* 아이콘 */}
                        <div className="flex items-center space-x-2">
                          {assignment.type === 'Quiz' ? (
                            <div className="flex items-center space-x-2 text-blue-600">
                              <FaQuestionCircle className="text-lg" />
                              <span className="text-sm font-semibold">
                                퀴즈
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2 text-green-600">
                              <FaClipboardList className="text-lg" />
                              <span className="text-sm font-semibold">
                                과제
                              </span>
                            </div>
                          )}
                        </div>

                        {/* 제목 및 설명 */}
                        <div>
                          <div className="text-base font-semibold text-gray-600">
                            {assignment.title}
                          </div>
                          <div className="text-xs text-gray-400">
                            {assignment.description}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">
                          {formattedDate(assignment.start_time)}
                        </div>
                        <div className="text-xs text-gray-600">
                          ~{formattedDate(assignment.end_time)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center font-semibold text-gray-500">
                    시작 전 과제가 없습니다.
                  </div>
                )}
              </div>
            </div>

            {/* 종료됨 */}
            <div>
              <div className="p-5 border-b border-gray-200">
                <h1 className="text-lg font-bold text-gray-700">종료된 과제</h1>
              </div>
              <div className="p-5 space-y-3">
                {finishedAssignments.length > 0 ? (
                  finishedAssignments.map((assignment: any) => (
                    <div
                      key={assignment.id}
                      className={`flex items-center justify-between bg-white shadow rounded-md px-4 py-3 border-l-[4px] transition-all ${
                        assignment.type === 'Quiz'
                          ? 'border-blue-400 hover:shadow-lg'
                          : 'border-green-400 hover:shadow-lg'
                      }`}
                    >
                      <div className="flex space-x-3">
                        {/* 아이콘 */}
                        <div className="flex items-center space-x-2">
                          {assignment.type === 'Quiz' ? (
                            <div className="flex items-center space-x-2 text-blue-600">
                              <FaQuestionCircle className="text-lg" />
                              <span className="text-sm font-semibold">
                                퀴즈
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2 text-green-600">
                              <FaClipboardList className="text-lg" />
                              <span className="text-sm font-semibold">
                                과제
                              </span>
                            </div>
                          )}
                        </div>

                        {/* 제목 및 설명 */}
                        <div>
                          <div className="text-base font-semibold text-gray-600">
                            {assignment.title}
                          </div>
                          <div className="text-xs text-gray-400">
                            {assignment.description}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">
                          {formattedDate(assignment.start_time)}
                        </div>
                        <div className="text-xs text-gray-600">
                          ~{formattedDate(assignment.end_time)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center font-semibold text-gray-500">
                    종료된 과제가 없습니다.
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
