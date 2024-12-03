'use client';

import { Select } from 'antd';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getNonPageAllAssignment } from '@/services/submissionAdmin/getNonPageAllAssignment';

const { Option } = Select;

export default function ClassList() {
  const router = useRouter();
  const { data: assignmentListData } = useQuery({
    queryKey: ['assignmentListData'],
    queryFn: () => getNonPageAllAssignment(),
  });

  const assignmentList = assignmentListData?.data?.data || [];

  const handleSelectChange = (value: number) => {
    router.push(`/tutor/assignment/submission/${value}`);
  };

  return (
    <div className="flex min-h-screen p-8">
      <div className="w-full h-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary">
        <div className="flex flex-col items-center justify-center h-full space-y-6">
          <h1 className="text-xl">💡 퀴즈를 선택하세요</h1>
          <Select
            placeholder="퀴즈를 선택하세요."
            className="w-64"
            onChange={handleSelectChange}
          >
            {assignmentList.map((item: AssignmentList) => (
              <Option key={item.id} value={item.id}>
                {item.title} - {item?.group?.group_name}
              </Option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}
