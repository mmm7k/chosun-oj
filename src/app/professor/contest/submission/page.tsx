'use client';

import { Select } from 'antd';
import { useRouter } from 'next/navigation';
import 'highlight.js/styles/github.css';
import { useQuery } from '@tanstack/react-query';
import { getNonPageAllContest } from '@/services/submissionAdmin/getNonPageAllContest';

const { Option } = Select;

export default function ContestList() {
  const router = useRouter();
  const { data: contestListData } = useQuery({
    queryKey: ['contestListData'],
    queryFn: () => getNonPageAllContest(),
  });

  const contestList = contestListData?.data?.data || [];

  const handleSelectChange = (value: number) => {
    router.push(`/professor/contest/submission/${value}`);
  };

  return (
    <div className="flex min-h-screen p-8">
      <div className="w-full h-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary">
        <div className="flex flex-col items-center justify-center h-full space-y-6">
          <h1 className="text-xl">💡 대회를 선택하세요</h1>
          <Select
            placeholder="대회를 선택하세요."
            className="w-64"
            onChange={handleSelectChange}
          >
            {contestList.map((item: { id: number; title: string }) => (
              <Option key={item.id} value={item.id}>
                {item.title}
              </Option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}
