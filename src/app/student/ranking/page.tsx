'use client';

import { getRank } from '@/services/rankingUser/getRank';
import { rankColor } from '@/utils/rankColor';
import { useQuery } from '@tanstack/react-query';
import { BiSolidAward } from 'react-icons/bi';

export default function Ranking() {
  const { data: rankData } = useQuery({
    queryKey: ['rankData'],
    queryFn: () => getRank(),
  });

  const ranking = rankData?.data || [];
  return (
    <>
      <section className="w-screen h-44 bg-gradient-to-r from-[#9face6] to-[#74ebd5]">
        <div className="w-screen px-[10%] lg:px-[20%] h-44">
          <div className="flex items-center justify-between h-44">
            <div
              className="flex flex-col gap-1 text-2xl text-white"
              style={{ textShadow: '1px 2px 3px rgba(0, 0, 0, 0.5)' }}
            >
              <span>🎉 빛나는 노력의 과정을 확인하세요</span>
            </div>
            <div className="w-[50%] h-[100%] relative">
              <img
                src={'/banner/rankingBanner.png'}
                alt="banner1"
                className="object-contain w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>
      <div className="bg-[#f0f4fc] min-h-screen w-full flex r justify-center">
        <div className="w-[90%] lg:w-[62%] pt-12 mb-44">
          <div className="flex w-full mb-3 space-x-5 overflow-x-auto overflow-y-hidden text-sm text-gray-500">
            <div className="flex items-center">
              <BiSolidAward className="text-[1.5rem] text-[#FF1D74]" />
              <span>Ruby 3600+</span>
            </div>
            <div className="flex items-center">
              <BiSolidAward className="text-[1.5rem] text-[#21BEFC]" />
              <span>Diamond 3000+</span>
            </div>
            <div className="flex items-center">
              <BiSolidAward className="text-[1.5rem] text-[#36E3AA]" />
              <span>Platinum 2400+</span>
            </div>
            <div className="flex items-center">
              <BiSolidAward className="text-[1.5rem] text-[#FFD700]" />
              <span>Gold 2000+</span>
            </div>
            <div className="flex items-center">
              <BiSolidAward className="text-[1.5rem] text-[#C0C0C0]" />
              <span>Silver 1200+</span>
            </div>
            <div className="flex items-center">
              <BiSolidAward className="text-[1.5rem] text-[#AD5600]" />
              <span>Bronze 600+</span>
            </div>
            <div className="flex items-center">
              <BiSolidAward className="text-[1.5rem] text-[#2D2D2D]" />
              <span>Unranked</span>
            </div>
          </div>
          <table
            className="w-full text-sm text-center bg-white border-separate shadow-md table-auto"
            style={{ borderSpacing: '0 1px' }}
          >
            <thead className="font-semibold text-gray-700">
              <tr>
                <th className="p-4 border-b-[1px] border-t-[1px] border-gray-200">
                  Rank
                </th>
                <th className="p-4 border-b-[1px] border-t-[1px] border-gray-200">
                  Tier
                </th>
                <th className="p-4 border-b-[1px] border-t-[1px] border-gray-200">
                  User
                </th>
                <th className="p-4 border-b-[1px] border-t-[1px] border-gray-200">
                  Points
                </th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {ranking.map((user: RankingUser, index: number) => (
                <tr key={user.username} className="shadow-sm hover:bg-gray-50">
                  <td
                    className="p-4 border-l-[5px] "
                    style={{ borderColor: rankColor(user.rank) }}
                  >
                    {index + 1}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <BiSolidAward
                        className="text-[2rem]"
                        style={{ color: rankColor(user.rank) }}
                      />
                      <span>{user.rank}</span>
                    </div>
                  </td>
                  <td className="p-4">{user.username}</td>
                  <td className="p-4">{user.total_score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
