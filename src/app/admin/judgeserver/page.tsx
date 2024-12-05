'use client';

import { deleteJudgeServer } from '@/services/judgeserverAdmin/deleteJudgeServer';
import { getJudgeServer } from '@/services/judgeserverAdmin/getJudgeServer';
import { patchJudgeServer } from '@/services/judgeserverAdmin/patchJudgeServer';
import { useMutation, useQuery } from '@tanstack/react-query';
import { message, Switch } from 'antd';
import { useRouter } from 'next/navigation';
import { FiTrash } from 'react-icons/fi';

export default function JudgeServer() {
  const router = useRouter();
  const { data: judgeServerData, refetch } = useQuery({
    queryKey: ['judgeServerData'],
    queryFn: () => getJudgeServer(),
  });

  const judgeServer = judgeServerData?.data || [];

  const patchMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { is_disabled: boolean };
    }) => patchJudgeServer(id, data),
    onSuccess: () => {
      message.success('성공적으로 수정되었습니다.');
      refetch();
    },
    onError: (error: any) => {
      if (error.response?.data?.message === '로그인이 필요합니다.') {
        message.error('로그인이 필요합니다.');
        router.push('/');
      } else {
        message.error(error.response?.data?.message || '오류가 발생했습니다.');
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteJudgeServer(id),
    onSuccess: () => {
      message.success('성공적으로 삭제되었습니다.');
      refetch();
    },
    onError: (error: any) => {
      if (error.response?.data?.message === '로그인이 필요합니다.') {
        message.error('로그인이 필요합니다.');
        router.push('/');
      } else {
        message.error(error.response?.data?.message || '오류가 발생했습니다.');
      }
    },
  });

  const handleToggleDisabled = (id: number, isDisabled: boolean) => {
    const formattedData = { is_disabled: !isDisabled };
    patchMutation.mutate({ id, data: formattedData });
  };

  const handleDeleteServer = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="flex min-h-screen p-4 sm:p-8">
      <div className="w-full h-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary px-6 sm:px-16">
        <h1 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
          Judge Servers
        </h1>

        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm sm:text-base ">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2 sm:p-4">Hostname</th>
                <th className="p-2 sm:p-4">Status</th>
                <th className="p-2 sm:p-4">CPU (Cores)</th>
                <th className="p-2 sm:p-4">CPU Usage (%)</th>
                <th className="p-2 sm:p-4">Memory Usage (%)</th>
                <th className="p-2 sm:p-4">Active</th>
                <th className="p-2 sm:p-4">Delete</th>
              </tr>
            </thead>
            <tbody>
              {judgeServer.map((server: JudgeServerData) => (
                <tr key={server.id} className="hover:bg-gray-100">
                  <td className="p-2 sm:p-4">{server.hostname}</td>
                  <td className="p-2 sm:p-4">
                    <span
                      className={`inline-block w-3 h-3 rounded-full ${
                        server.status === 'normal'
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      }`}
                    ></span>
                  </td>
                  <td className="p-2 sm:p-4">{server.cpu_core}</td>
                  <td className="p-2 sm:p-4">{server.cpu_usage.toFixed(2)}</td>
                  <td className="p-2 sm:p-4">
                    {server.memory_usage.toFixed(2)}
                  </td>
                  <td className="p-2 sm:p-4">
                    <Switch
                      checked={!server.is_disabled}
                      onChange={() =>
                        handleToggleDisabled(server.id, server.is_disabled)
                      }
                    />
                  </td>
                  <td className="p-2 sm:p-4">
                    <FiTrash
                      onClick={() => handleDeleteServer(server.id)}
                      className="text-xl cursor-pointer text-red-500 hover:text-red-700 transition-all"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
