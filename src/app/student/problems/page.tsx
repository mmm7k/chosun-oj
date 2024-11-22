import ProblemList from '@/components/student/problems/ProblemList';
import ProblemsBanner from '@/components/student/problems/ProblemsBanner';
import { Suspense } from 'react';

export default function Problems() {
  return (
    <>
      <ProblemsBanner />
      <main className="bg-[#f0f4fc] min-h-screen w-full flex  justify-center">
        <div className="w-[90%] lg:w-[62%] pt-12 mb-44">
          <Suspense>
            <ProblemList />
          </Suspense>
        </div>
      </main>
    </>
  );
}
