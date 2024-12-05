'use client';

import { getScoreBoardContest } from '@/services/contestAdmin/getScoreBoardContest';
import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

export default function ContestScoreBoard() {
  const pathname = usePathname();

  // URL의 마지막 숫자 추출
  const contestId = Number(pathname.split('/').pop());

  const { data: scoreBoardDate } = useQuery({
    queryKey: ['scoreBoardData'],
    queryFn: () => getScoreBoardContest(contestId),
  });

  const scoreboardData = scoreBoardDate?.data || [];

  // 모든 문제 가져오기
  const problems = [
    //@ts-ignore
    ...new Set(
      scoreboardData.map((entry: any) => entry.submission.problem.title),
    ),
  ];

  // 특정 문제에 대한 결과 계산
  const getProblemResult = (userId: number, problemTitle: string) => {
    const submissions = scoreboardData.filter(
      (entry: any) =>
        entry.user.id === userId &&
        entry.submission.problem.title === problemTitle,
    );

    // 결과가 0이 하나라도 있으면 O 반환, 없으면 X 반환
    return submissions.some((entry: any) =>
      entry.submission.info.data.some((testCase: any) => testCase.result === 0),
    )
      ? 'O'
      : 'X';
  };

  return (
    <div className="flex min-h-screen p-4 sm:p-8">
      <div className="w-full h-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary px-6 sm:px-16">
        <h1 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
          Contest ScoreBoard
        </h1>
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-auto">
            <thead>
              <tr className="text-left border-b bg-gray-100">
                <th className="p-2 sm:p-4">Rank</th>
                <th className="p-2 sm:p-4">사용자 이름</th>
                {problems.map((problemTitle, index) => (
                  <th key={index} className="p-2 sm:p-4">
                    {problemTitle}
                  </th>
                ))}
                <th className="p-2 sm:p-4">결과</th>
              </tr>
            </thead>
            <tbody>
              {scoreboardData
                .reduce((users: any[], entry: any) => {
                  if (!users.some((user: any) => user.id === entry.user.id)) {
                    users.push(entry.user);
                  }
                  return users;
                }, [])
                .map((user: any, index: number) => {
                  const oCount = problems.reduce((count, problemTitle) => {
                    const result = getProblemResult(user.id, problemTitle);
                    return result === 'O' ? count + 1 : count;
                  }, 0);

                  return (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-2 sm:p-4">{index + 1}</td>
                      <td className="p-2 sm:p-4">
                        <span className="block font-medium">
                          {user.student_number}
                        </span>
                        <span className="text-gray-500">{user.name}</span>
                      </td>
                      {problems.map((problemTitle, idx) => (
                        <td
                          key={idx}
                          className={`p-2 sm:p-4 font-bold ${
                            getProblemResult(user.id, problemTitle) === 'O'
                              ? 'text-green-500'
                              : 'text-red-500'
                          }`}
                        >
                          {getProblemResult(user.id, problemTitle)}
                        </td>
                      ))}
                      <td className="p-2 sm:p-4 font-bold text-blue-500">
                        {oCount}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
