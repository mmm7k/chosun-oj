'use client';

import Link from 'next/link';
import { HiOutlineComputerDesktop } from 'react-icons/hi2';
import { FaCodeBranch } from 'react-icons/fa';
import { AiOutlineCodeSandbox } from 'react-icons/ai';
import { useQuery } from '@tanstack/react-query';
import { getClassListUser } from '@/services/classUser/getClassListUser';
import CircularProgress from '@mui/material/CircularProgress';

const icons = [
  <HiOutlineComputerDesktop className="text-[5rem] md:text-[6rem] text-white" />,
  <FaCodeBranch className="text-[5rem] md:text-[6rem] text-white" />,
  <AiOutlineCodeSandbox className="text-[5rem] md:text-[6rem] text-white" />,
];

export default function ClassSelect() {
  const { data: classListData, isLoading } = useQuery({
    queryKey: ['classListData'],
    queryFn: () => getClassListUser(),
  });

  const classList = classListData?.data?.data || [];
  return (
    <div className="bg-[#f0f4fc] min-h-screen font-semibold flex justify-center items-center py-[10dvh] md:py-[20dvh]">
      {isLoading ? (
        <CircularProgress />
      ) : classList.length === 0 ? (
        <div className="text-center text-gray-500 text-lg  ">
          참여중인 분반이 없습니다.
        </div>
      ) : (
        <section className="flex flex-col flex-wrap gap-8 md:flex-row justify-center space-y-14 md:space-y-0 mb-[4rem]">
          {classList.map((item: ClassList, index: number) => (
            <Link key={item.id} href={`/student/assignment/${item.id}`}>
              <div className="cursor-pointer bg-white shadow-xl rounded-3xl py-16 md:py-20 px-24 md:px-14 border-[3px] border-transparent hover:border-blue-400 transition-all">
                <div className="flex flex-col items-center">
                  {/* 아이콘 순환적으로 적용 */}
                  <div className="p-6 mb-4 rounded-full bg-gradient-to-t from-blue-100 to-blue-400 md:p-8">
                    {icons[index % icons.length]}
                  </div>
                  <span className="mt-4 text-xl text-gray-800 md:text-lg">
                    {item.course.title}
                  </span>
                  <span className="mt-1 text-lg text-gray-500 md:text-base">
                    {item.group_name}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
