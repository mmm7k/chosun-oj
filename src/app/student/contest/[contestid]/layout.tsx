'use client';
import { getContestCheckUser } from '@/services/contestUser/getContestCheckUser';
import { postContestJoinUser } from '@/services/contestUser/postContestJoinUser';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ReactNode } from 'react';

export default function ContestLayout({
  params,
  children,
}: {
  params: { contestid: string };
  children: ReactNode;
}) {
  const contestId = parseInt(params.contestid);
  const router = useRouter();
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log(params.contestid);
    const validateUser = async () => {
      try {
        await postContestJoinUser(contestId);
        setIsValid(true);
      } catch (error: any) {
        alert(error.response?.data?.message || '접근이 허용되지 않습니다.');
        router.push('/student');
      } finally {
        setIsLoading(false);
      }
    };
    validateUser();
  }, [contestId, router]);

  if (isLoading || !isValid) {
    return null;
  }

  return <div>{children}</div>;
}
