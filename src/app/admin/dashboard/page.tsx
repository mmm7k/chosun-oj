'use client';

import { LiaChalkboardTeacherSolid } from 'react-icons/lia';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import useUserStore from '@/store/userstore';
import { useEffect } from 'react';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

// 좌측 도넛 차트 데이터
const donutData = {
  labels: [
    // '알고리즘 01 분반',
    // '알고리즘 02 분반',
    // '네트워크 보안 01 분반',
    // '네트워크 보안 02 분반',
  ],
  datasets: [
    {
      label: '학생 수',
      data: [50, 40, 30, 20],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
    },
  ],
};

// 도넛 차트 옵션
const donutOptions = {
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        boxWidth: 12,
        padding: 12,
      },
    },
  },
  layout: {
    padding: {
      top: 10,
      bottom: 0,
    },
  },
};

// 우측 성적 분포 바 차트 데이터
const barData = {
  labels: [
    '0-10',
    '10-20',
    '20-30',
    '30-40',
    '40-50',
    '50-60',
    '60-70',
    '70-80',
    '80-90',
    '90-100',
  ],
  datasets: [
    {
      // label: '알고리즘 01 분반',
      data: [5, 10, 15, 20, 15, 10, 10, 10, 3, 2], // 각 구간에 학생 수 분포
      backgroundColor: '#FF6384', // 도넛 차트와 동일한 색상
    },
    {
      // label: '알고리즘 02 분반',
      data: [8, 12, 15, 17, 14, 10, 10, 8, 4, 2],
      backgroundColor: '#36A2EB', // 도넛 차트와 동일한 색상
    },
    {
      // label: '네트워크 보안 01 분반',
      data: [7, 13, 17, 15, 13, 12, 10, 8, 3, 2],
      backgroundColor: '#FFCE56', // 도넛 차트와 동일한 색상
    },
    {
      // label: '네트워크 보안 02 분반',
      data: [6, 14, 16, 18, 12, 10, 12, 6, 4, 2],
      backgroundColor: '#4BC0C0', // 도넛 차트와 동일한 색상
    },
  ],
};

// 바 그래프 옵션
const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
    tooltip: {
      enabled: true,
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: '점수 범위',
      },
    },
    y: {
      title: {
        display: true,
        text: '학생 수',
      },
      beginAtZero: true,
      max: 25,
    },
  },
};

export default function Dashboard() {
  const { username, admin_type, fetchUser } = useUserStore();

  useEffect(() => {
    if (!username || !admin_type) {
      fetchUser(); // 상태가 없으면 API 호출
    }
  }, [username, admin_type, fetchUser]);

  console.log('username:', username);
  return (
    <div className="flex flex-col min-h-screen p-8 md:flex-row">
      <div className="flex flex-col flex-1 gap-4 md:flex-row">
        {/* 좌측 영역 */}
        <div className="flex flex-col w-full gap-4 md:w-1/3">
          {/* 좌측 프로필 영역 */}
          <div className="flex flex-col h-auto p-6 bg-white shadow-lg rounded-3xl md:h-1/2">
            <section className="flex flex-col items-center">
              <div className="w-24 h-24 mb-4 bg-gray-200 rounded-full"></div>
              <div className="flex items-center text-xl font-bold text-primary">
                <LiaChalkboardTeacherSolid className="mr-2 text-3xl" />
                <span>{username}</span>
              </div>
            </section>
            <hr className="w-full my-4 " />
            <ul className="mt-2 space-y-3"></ul>
          </div>

          {/* 좌측 하단 도넛 그래프 영역 */}
          <div className="flex-grow p-6 bg-white shadow-lg rounded-3xl">
            {/* <span className="font-bold">💡 학생 분포도</span> */}
            <hr className="w-full my-4 " />
            <div className="flex items-center justify-center h-72">
              {/* <Doughnut data={donutData} options={donutOptions} /> */}
            </div>
          </div>
        </div>

        {/* 우측 영역 */}
        <div className="flex flex-col w-full gap-4 md:w-2/3">
          {/* 상단 3개의 작은 카드 영역 */}
          <div className="flex flex-col gap-4 text-sm md:flex-row">
            <div className="flex-grow h-32 p-6 bg-white shadow-lg rounded-3xl">
              {/* <span className="font-bold">📝 할 일 목록</span> */}
              <hr className="w-full my-2 " />
              <ul className="mt-2 space-y-1 ">
                {/* <li>• 코딩 과제</li> */}
                {/* <li>• 강의 준비</li> */}
              </ul>
            </div>
            <div className="flex-grow h-32 p-6 bg-white shadow-lg rounded-3xl">
              {/* <span className="font-bold">📢 공지사항</span> */}
              <hr className="w-full my-2 " />
              <ul className="mt-2 space-y-1">
                {/* <li>• 다음 주 휴강 안내</li> */}
                {/* <li>• 새 과제 업데이트</li> */}
              </ul>
            </div>
            <div className="flex-grow h-32 p-6 bg-white shadow-lg rounded-3xl">
              {/* <span className="font-bold">🗒 메모</span> */}
              <hr className="w-full my-2 " />
              {/* <p className="mt-2">오늘 할 일 완료</p> */}
            </div>
          </div>

          {/* 우측 메인 그래프 영역 */}
          <div className="flex-grow p-6 bg-white shadow-lg rounded-3xl">
            {/* <h2 className="text-lg font-bold">📊 분반별 성적 비교</h2> */}
            <hr className="w-full my-6 " />
            <div className="h-[35rem]">
              {/* <Bar data={barData} options={barOptions} /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
