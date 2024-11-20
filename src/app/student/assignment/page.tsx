import Link from 'next/link';
import { HiOutlineComputerDesktop } from 'react-icons/hi2';
import { FaCodeBranch } from 'react-icons/fa';
import { AiOutlineCodeSandbox } from 'react-icons/ai';

export default function AssignmentSelectClass() {
  return (
    <div className="bg-[#f0f4fc] min-h-screen  font-semibold flex justify-center items-center py-[10dvh] md:py-[20dvh]  ">
      <section className="flex flex-col md:flex-row justify-center md:space-x-16 space-y-14 md:space-y-0 mb-[4rem]">
        <Link href="/student/assignment/기초 프로그래밍?chapter=1">
          <div className="cursor-pointer bg-white shadow-xl rounded-3xl py-16 md:py-20 px-24 md:px-14 border-[3px] border-transparent hover:border-blue-400 transition-all">
            <div className="flex flex-col items-center">
              <div className="p-6 mb-4 rounded-full bg-gradient-to-t from-blue-100 to-blue-400 md:p-8">
                <HiOutlineComputerDesktop className="text-[5rem] md:text-[6rem] text-white" />
              </div>
              <span className="mt-4 text-xl text-gray-800 md:text-lg">
                기초 프로그래밍
              </span>
              <span className="mt-1 text-lg text-gray-500 md:text-base">
                01분반
              </span>
            </div>
          </div>
        </Link>

        <Link href="/student/assignment/자바 프로그래밍?chapter=1">
          <div className="cursor-pointer bg-white shadow-xl rounded-3xl py-16 md:py-20 px-24 md:px-14 border-[3px] border-transparent hover:border-blue-400 transition-all">
            <div className="flex flex-col items-center">
              <div className="p-6 mb-4 rounded-full bg-gradient-to-t from-blue-100 to-blue-400 md:p-8">
                <FaCodeBranch className="text-[5rem] md:text-[6rem] text-white" />
              </div>
              <span className="mt-4 text-xl text-gray-800 md:text-lg">
                자바 프로그래밍
              </span>
              <span className="mt-1 text-lg text-gray-500 md:text-base">
                01분반
              </span>
            </div>
          </div>
        </Link>

        <Link href="/student/assignment/알고리즘?chapter=1">
          <div className="cursor-pointer bg-white shadow-xl rounded-3xl py-16 md:py-20 px-24 md:px-14 border-[3px] border-transparent hover:border-blue-400 transition-all">
            <div className="flex flex-col items-center">
              <div className="p-6 mb-4 rounded-full bg-gradient-to-t from-blue-100 to-blue-400 md:p-8">
                <AiOutlineCodeSandbox className="text-[5rem] md:text-[6rem] text-white" />
              </div>
              <span className="mt-4 text-xl text-gray-800 md:text-lg">
                알고리즘
              </span>
              <span className="mt-1 text-lg text-gray-500 md:text-base">
                01분반
              </span>
            </div>
          </div>
        </Link>
      </section>
    </div>
  );
}
