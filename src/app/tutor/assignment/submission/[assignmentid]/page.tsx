'use client';

import { Select } from 'antd';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getProblemsAssignment } from '@/services/assignmentAdmin/getProblemsAssignment';

const { Option } = Select;

export default function ProblemList({
  params,
}: {
  params: { assignmentid: string };
}) {
  const router = useRouter();
  const assignmentId = parseInt(params.assignmentid);
  const { data: problmeListData } = useQuery({
    queryKey: ['problemListData', assignmentId],
    queryFn: () => getProblemsAssignment(assignmentId),
  });

  const problemList = problmeListData?.data?.data || [];
  const handleSelectChange = (value: number) => {
    router.push(`/tutor/assignment/submission/${assignmentId}/${value}?page=1`);
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
