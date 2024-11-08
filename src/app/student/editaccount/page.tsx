'use client';

import { getMyInformation, modifyInfo } from '@/services/account/profile';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface InformationData {
  major: string;
  school: string;
  user: {
    email: string;
  };
}

interface ModifyInfoPayload {
  user: {
    email: string;
  };
  school: string;
  major: string;
}

export default function EditAccount() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: information } = useQuery({
    queryKey: ['informationData'],
    queryFn: getMyInformation,
  });
  const informationData: InformationData | null = information?.data;

  const { register, handleSubmit, reset } = useForm<ModifyInfoPayload>({
    defaultValues: {
      user: {
        email: informationData?.user.email || '',
      },
      school: informationData?.school || '',
      major: informationData?.major || '',
    },
  });

  useEffect(() => {
    if (informationData) {
      reset({
        user: {
          email: informationData.user.email,
        },
        school: informationData.school,
        major: informationData.major,
      });
    }
  }, [informationData, reset]);

  const mutation = useMutation({
    mutationFn: modifyInfo,
    onSuccess: () => {
      router.push('/student');
    },
  });

  const onSubmit = (data: ModifyInfoPayload) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-md mx-auto my-10 p-8 bg-white shadow-lg border border-gray-200 rounded-lg">
      <h2 className="text-xl font-semibold text-center mb-6 text-gray-700">
        회원 정보수정
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            {...register('user.email')}
            type="email"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm placeholder:text-sm text-sm focus:ring-1 focus:ring-gray-400 focus:outline-none"
            placeholder="새로운 이메일을 입력하세요"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">학교</label>
          <input
            {...register('school')}
            type="text"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm placeholder:text-sm text-sm focus:ring-1 focus:ring-gray-400 focus:outline-none"
            placeholder="새로운 학교를 입력하세요"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">전공</label>
          <input
            {...register('major')}
            type="text"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm placeholder:text-sm text-sm focus:ring-1 focus:ring-gray-400 focus:outline-none"
            placeholder="새로운 전공을 입력하세요"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white p-2 rounded-md hover:bg-primaryButtonHover transition-all"
        >
          수정하기
        </button>
      </form>
    </div>
  );
}
