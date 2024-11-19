'use client';

import { formattedDate } from '@/utils/dateFormatter';
import Image from 'next/image';

export default function ContestBanner({
  title,
  startDate,
  endDate,
}: {
  title: string;
  startDate: string;
  endDate: string;
}) {
  return (
    <section className="w-screen h-44 bg-gradient-to-r from-[#9face6] to-[#74ebd5]  ">
      <div className="w-screen px-[10%] lg:px-[20%] h-44">
        <div className="flex items-center justify-between h-44">
          <div
            className="flex flex-col gap-1 text-2xl text-white "
            style={{ textShadow: '1px 2px 3px rgba(0, 0, 0, 0.5)' }}
          >
            <span>🏆 {title}</span>
            <span>
              ⏱️ {formattedDate(startDate)} ~ {formattedDate(endDate)}
            </span>
          </div>
          <div className="w-[50%] h-[90%] relative">
            <Image
              src={'/banner/contestBanner.png'}
              layout="fill"
              objectFit="contain"
              alt="banner1"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
