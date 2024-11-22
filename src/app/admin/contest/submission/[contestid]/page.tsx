'use client';

import { Select } from 'antd';
import { useRouter } from 'next/navigation';

import 'highlight.js/styles/github.css';
import { useQuery } from '@tanstack/react-query';
import { getProblemsContest } from '@/services/contestAdmin/getProblemsContest';

const { Option } = Select;

export default function ProblemList({
  params,
}: {
  params: { contestid: string };
}) {
  const router = useRouter();
  const contestId = parseInt(params.contestid);
  const { data: problmeListData } = useQuery({
    queryKey: ['problemListData', contestId],
    queryFn: () => getProblemsContest(contestId),
  });

  const problemList = problmeListData?.data?.data || [];
  const handleSelectChange = (value: number) => {
    router.push(`/admin/contest/submission/${contestId}/${value}?page=1`);
  };

  return (
    <div className="flex min-h-screen p-8">
      <div className="w-full h-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary">
        <div className="flex flex-col items-center justify-center h-full space-y-6">
          <h1 className="text-xl">✅ 문제를 선택하세요</h1>
          <Select
            placeholder="문제를 선택하세요."
            className="w-64"
            onChange={handleSelectChange}
          >
            {problemList.map(
              (item: {
                id: number;
                title: string;
                problem: { title: string; id: number };
              }) => (
                <Option key={item.id} value={item?.problem?.id}>
                  {item?.problem?.title}
                </Option>
              ),
            )}
          </Select>
        </div>
      </div>
    </div>
  );
}
