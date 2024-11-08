'use client';

import { Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from 'chart.js';
import { FaCodeBranch } from 'react-icons/fa';
import { PiRanking } from 'react-icons/pi';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import '@/app/styles/heatmap.css';
import { BiSolidAward } from 'react-icons/bi';
import { useEffect, useMemo, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';
import { FaUserGraduate } from 'react-icons/fa6';
import { RiEdit2Line } from 'react-icons/ri';
import Link from 'next/link';
import { getMyInformation, getMyProfile } from '@/services/account/profile';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

ChartJS.register(
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
);

interface ProfileData {
  accepted_number: number;
  id: number;
  major: string;
  school: string;
  submission_number: number;
  total_score: number;
  user: {
    username: string;
    student_number: string;
    name: string;
  };
}

export default function StudentMain() {
  const [rank, setRank] = useState<string>('');

  const { data: profile } = useQuery({
    queryKey: ['profileData'],
    queryFn: getMyProfile,
  });
  const profileData: ProfileData | null = profile?.data;

  useEffect(() => {
    if (profileData) {
      const calculateRank = () => {
        const totalScore = profileData.total_score;
        if (totalScore >= 150) return 'Challenger';
        if (totalScore >= 125) return 'Grandmaster';
        if (totalScore >= 100)
          return `Diamond ${Math.ceil((125 - totalScore) / 5)}`;
        if (totalScore >= 75)
          return `Platinum ${Math.ceil((100 - totalScore) / 5)}`;
        if (totalScore >= 50) return `Gold ${Math.ceil((75 - totalScore) / 5)}`;
        if (totalScore >= 25)
          return `Silver ${Math.ceil((50 - totalScore) / 5)}`;
        return `Bronze ${Math.ceil((25 - totalScore) / 5)}`;
      };
      setRank(calculateRank());
    }
  }, [profileData]);

  const rankColor = useMemo(() => {
    if (rank.startsWith('Challenger')) return '#ff0000';
    if (rank.startsWith('Grandmaster')) return '#ff4500';
    if (rank.startsWith('Diamond')) return '#00ffff';
    if (rank.startsWith('Platinum')) return '#00d9ff';
    if (rank.startsWith('Gold')) return '#FFD700';
    if (rank.startsWith('Silver')) return '#C0C0C0';
    return '#cd7f32';
  }, [rank]);

  // 배너 캐러셀 세팅
  const bannerSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: false,
    fade: true,
    waitForAnimate: false,
  };

  // 공지 캐러셀 세팅
  const noticeSettings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: false,
    fade: true,
    waitForAnimate: false,
  };
  // 오늘 날짜 가져오기
  const today = new Date();

  // 90일 전 날짜를 시작점으로 설정
  const startDate = new Date();
  startDate.setDate(today.getDate() - 90);

  // heatmapData를 90일 전부터 오늘까지 생성
  const heatmapData = Array.from({ length: 90 }, (_, i) => {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i); // startDate에서 i일 추가
    return {
      date: currentDate.toISOString().split('T')[0], // YYYY-MM-DD 형식으로 변환
      count: Math.floor(Math.random() * 5), // 0에서 4 사이의 랜덤 값 생성
    };
  });

  //도넛 차트 데이터
  const donutData = {
    labels: ['Lv.1', 'Lv.2', 'Lv.3'],
    datasets: [
      {
        label: '학생 수',
        data: [17, 5, 13],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  // 도넛 차트 옵션
  const donutOptions = {
    maintainAspectRatio: false,
    responsive: true,
  };

  // 전체 합계 계산
  const total = donutData.datasets[0].data.reduce(
    (acc, value) => acc + value,
    0,
  );

  // 퍼센트 계산 함수
  const calculatePercentage = (value: number) => {
    return ((value / total) * 100).toFixed(1); // 소수점 1자리까지 계산
  };

  // 레이다 차트 데이터
  const radarData = {
    labels: [
      'implementation',
      'greedy',
      'string',
      'data_structures',
      'graphs',
      'dp',
    ],
    datasets: [
      {
        data: [15, 18, 4, 7, 8, 17],
        fill: true,
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        pointBackgroundColor: 'rgba(255,99,132,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255,99,132,1)',
      },
    ],
  };
  // 레이다 차트 옵션
  const radarOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      r: {
        angleLines: {
          display: false,
        },
        suggestedMin: 0,
        suggestedMax: 20,
        ticks: {
          display: false,
        },
      },
    },
  };

  // 전체 합계 계산
  const totalTag = radarData.datasets[0].data.reduce(
    (acc, value) => acc + value,
    0,
  );

  // 상위 3개의 태그와 데이터 가져오기
  const topTags = useMemo(() => {
    const tagData = radarData.labels.map((label, index) => ({
      label,
      count: radarData.datasets[0].data[index],
    }));

    // 데이터 값을 기준으로 정렬하여 상위 3개 추출
    return tagData.sort((a, b) => b.count - a.count).slice(0, 3);
  }, [radarData]);

  // 퍼센트 계산 함수
  const calculateTagPercentage = (value: number) => {
    return ((value / totalTag) * 100).toFixed(1); // 소수점 1자리까지 계산
  };

  const highestLevel = useMemo(() => {
    const maxIndex = donutData.datasets[0].data.indexOf(
      Math.max(...donutData.datasets[0].data),
    );
    return donutData.labels[maxIndex];
  }, [donutData]);

  const mostSolvedTag = useMemo(() => {
    const maxIndex = radarData.datasets[0].data.indexOf(
      Math.max(...radarData.datasets[0].data),
    );
    return radarData.labels[maxIndex];
  }, [radarData]);

  return (
    <div className="flex flex-col items-center justify-center w-full gap-12 mb-36">
      {/* 배너 캐러셀 */}
      <section className="w-screen bg-black h-96">
        <Slider {...bannerSettings} className="w-full h-full text-white">
          <div className="bg-black  w-screen px-[10%] lg:px-[20%] h-96 ">
            <div className="flex items-center justify-between h-96">
              <div className="flex flex-col gap-3">
                <span className="">예시 타이틀1</span>
                <span className="text-3xl">
                  조선대학교는 학생들의
                  <br />
                  성장을 응원합니다
                </span>
                <span className="text-gray-500">
                  1700개 기업의 채용 평가 데이터를
                  <br />
                  집중 분석한 문제풀이 플랫폼
                </span>
              </div>
              <div className="h-full w-[50%] relative">
                <Image
                  src={'/banner/banner1.png'}
                  layout="fill"
                  objectFit="contain"
                  alt="banner1"
                />
              </div>
            </div>
          </div>
          <div className="bg-black  w-screen  px-[10%] lg:px-[20%] h-96 ">
            <div className="flex items-center justify-between h-96">
              <div className="flex flex-col gap-3">
                <span className="">예시 타이틀2</span>
                <span className="text-3xl">
                  조선대학교는 학생들의
                  <br />
                  성장을 응원합니다
                </span>
                <span className="text-gray-500">
                  1700개 기업의 채용 평가 데이터를
                  <br />
                  집중 분석한 문제풀이 플랫폼
                </span>
              </div>
              <div className="h-full w-[50%] relative">
                <Image
                  src={'/banner/banner2.png'}
                  layout="fill"
                  objectFit="contain"
                  alt="banner2"
                />
              </div>
            </div>
          </div>
          <div className="bg-black  w-screen  px-[10%] lg:px-[20%] h-96 ">
            <div className="flex items-center justify-between h-96">
              <div className="flex flex-col gap-3">
                <span className="">예시 타이틀3</span>
                <span className="text-3xl">
                  조선대학교는 학생들의
                  <br />
                  성장을 응원합니다
                </span>
                <span className="text-gray-500">
                  1700개 기업의 채용 평가 데이터를
                  <br />
                  집중 분석한 문제풀이 플랫폼
                </span>
              </div>
              <div className="h-full w-[50%]  relative">
                <Image
                  src={'/banner/banner3.png'}
                  layout="fill"
                  objectFit="contain"
                  alt="banner3"
                />
              </div>
            </div>
          </div>
        </Slider>
      </section>
      {/* 공지사항 */}
      <section className="w-[90%] lg:w-[62%] p-2 border border-gray-300 rounded-lg">
        <Slider {...noticeSettings} className="w-full h-full text-gray-700">
          <span>
            📢 터미널 접속 시 간헐적으로 연결이 끊기는 문제를 해결했습니다.
          </span>
          <span>📢 서비스 이용 중 문의 사항은 Q&A 게시판을 이용해주세요.</span>
          <span>📢 자세한 공지사항은 공지사항 게시판을 이용해주세요.</span>
        </Slider>
      </section>
      <section className="w-[90%] lg:w-[62%] flex flex-col sm:flex-row space-x-0 sm:space-x-12 space-y-12 sm:space-y-0">
        {/* 왼쪽 섹션 유저 프로필 */}
        <div className="w-[100%] sm:w-[25%] flex flex-col justify-center items-center py-10 px-10 border border-gray-300 rounded-xl space-y-1  text-gray-700 relative">
          <Link href="/student/editaccount">
            <RiEdit2Line className="absolute right-4 top-4 text-2xl cursor-pointer" />
          </Link>
          <FaUserGraduate className="text-primary text-[4rem] mb-2" />
          <span className="text-xl font-semibold">
            {profileData?.user?.name}
          </span>
          <span className="text-lg ">Developer</span>
          <div>
            <span className="font-semibold">Major : </span>
            {profileData?.major ?? 'Computer Science'}
          </div>
          <div>
            <span className="font-semibold">ID : </span>
            {profileData?.user?.student_number}
          </div>
        </div>
        {/* 오른쪽 섹션 랭크,잔디 */}
        <div className="flex flex-col items-center justify-between flex-1 px-10 py-10 border border-gray-300 sm:flex-row sm:px-1 md:px-10 lg:px-1 2xl:px-10 rounded-xl">
          {/* 랭크와 스텟 */}
          <div className="flex flex-col items-center flex-1 sm:flex-row ">
            <BiSolidAward
              className={`text-[11rem] sm:text-[8rem]  lg:text-[9rem] xl:text-[10rem] 2xl:text-[11rem] animate-pulse mb-5 sm:mb-0`}
              style={{ color: rankColor }}
            />
            <div className="flex flex-col items-start justify-center mb-5 ml-0 space-y-3 text-gray-600 sm:ml-0 lg:ml-3 sm:mb-0">
              <span className="font-semibold lg:text-lg 2xl:text-xl">
                <span>Rank : </span>
                <span className="text-gray-900 ">{rank}</span>
              </span>
              <div className="text-xs lg:text-base">
                <span> 🏃‍♀️ Total Score: </span>
                <span className="font-semibold text-gray-900">
                  {profileData?.total_score}
                </span>
              </div>
              <div className="text-xs lg:text-base">
                <span> ⭐ Most Solved Level: </span>
                <span className="font-semibold text-gray-900">
                  {highestLevel}
                </span>
              </div>
              <div className="text-xs lg:text-base">
                <span>🏷️ Most Solved Tag: </span>
                <span className="font-semibold text-gray-900">
                  {mostSolvedTag}
                </span>
              </div>
            </div>
          </div>

          {/* 잔디심기 */}
          <div className="w-[50%] sm:w-[33%] lg:w-[35%] mr-1 relative">
            <CalendarHeatmap
              startDate={
                new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate() - 90,
                )
              }
              endDate={today}
              values={heatmapData}
              classForValue={(value: any) => {
                if (!value) {
                  return 'color-empty';
                }
                return `color-scale-${Math.min(value.count, 4)}`;
              }}
              showWeekdayLabels
              gutterSize={1.5}
            />
            <div className="absolute bottom-0 right-0 flex items-center space-x-2 font-light text-gray-500 ">
              <span className="text-xs 2xl:text-sm">Less</span>
              <div className="rounded-[0.27rem] bg-[#ebedf0] w-[0.9rem] h-[0.9rem]" />
              <div className="rounded-[0.27rem] bg-[#9be9a8] w-[0.9rem] h-[0.9rem]" />
              <div className="rounded-[0.27rem] bg-[#40c463] w-[0.9rem] h-[0.9rem]" />
              <div className="rounded-[0.27rem] bg-[#30a14e] w-[0.9rem] h-[0.9rem]" />
              <div className="rounded-[0.27rem] bg-[#216e39] w-[0.9rem] h-[0.9rem]" />
              <span className="text-xs 2xl:text-sm ">More</span>
            </div>
          </div>
        </div>
      </section>
      <section className="border border-gray-300 rounded-xl w-[90%] lg:w-[62%] py-10 flex-col">
        <p className="flex items-center text-lg font-semibold text-secondary pl-9 mb-7">
          <PiRanking className="text-2xl mr-1 mt-[0.18rem] " />

          <span>난이도 분포</span>
        </p>
        <div className="flex flex-col sm:flex-row justify-between items-center w-[90%]  mx-auto">
          {/* 도넛 차트 */}
          <div className="w-[80%] mb-14 sm:mb-0 sm:w-[40%] lg:w-[25%] h-48">
            <Doughnut data={donutData} options={donutOptions} />
          </div>

          {/* 오른쪽 레이블 표시 */}
          <div className="w-[80%] sm:w-[50%] lg:w-[60%] flex flex-col">
            <div className="flex justify-between font-semibold pl-[20%] pr-[25%]">
              <span>레벨</span>
              <span>문제</span>
            </div>
            <hr className="w-full my-2 border-gray-300 border-b-1" />

            {/* Lv.1 */}
            <div className="flex justify-between pl-[5%] pr-[25%] relative">
              <span className="text-[#FF6384] font-semibold">Lv.1</span>
              <span>{donutData.datasets[0].data[0]}</span>
              <span className="absolute right-0 text-gray-400">
                {calculatePercentage(donutData.datasets[0].data[0])}%
              </span>
            </div>
            <hr className="w-full my-2 border-gray-300 border-b-1" />

            {/* Lv.2 */}
            <div className="flex justify-between pl-[5%] pr-[25%] relative">
              <span className="text-[#36A2EB] font-semibold">Lv.2</span>
              <span>{donutData.datasets[0].data[1]}</span>
              <span className="absolute right-0 text-gray-400">
                {calculatePercentage(donutData.datasets[0].data[1])}%
              </span>
            </div>
            <hr className="w-full my-2 border-gray-300 border-b-1" />

            {/* Lv.3 */}
            <div className="flex justify-between pl-[5%] pr-[25%] relative">
              <span className="text-[#FFCE56] font-semibold">Lv.3</span>
              <span>{donutData.datasets[0].data[2]}</span>
              <span className="absolute right-0 text-gray-400">
                {calculatePercentage(donutData.datasets[0].data[2])}%
              </span>
            </div>
            <hr className="w-full my-2 border-gray-300 border-b-1" />
          </div>
        </div>
      </section>
      <section className="border border-gray-300 rounded-xl w-[90%] lg:w-[62%] py-10 flex-col">
        <p className="flex items-center text-lg font-semibold text-secondary pl-9 mb-7">
          <FaCodeBranch className="text-xl mr-1 mt-[0.18rem]" />
          <span>알고리즘 분포</span>
        </p>
        <div className="flex flex-col sm:flex-row justify-between items-center w-[90%]  mx-auto">
          {/* Radar 차트 */}
          <div className="w-[80%] mb-14 sm:mb-0 sm:w-[40%] lg:w-[28%] h-64">
            <Radar data={radarData} options={radarOptions} />
          </div>

          {/* 오른쪽 레이블 표시 */}
          <div className="w-[80%] sm:w-[50%] lg:w-[60%] flex flex-col">
            <div className="flex justify-between font-semibold pl-[20%] pr-[25%]">
              <span>태그</span>
              <span>문제</span>
            </div>
            <hr className="w-full my-2 border-gray-300 border-b-1" />

            {/* 가장 많이 푼 #1 태그 */}
            <div className="flex justify-between pl-[5%] pr-[25%] relative">
              <span className="text-secondary">#{topTags[0].label}</span>
              <span>{topTags[0].count}</span>
              <span className="absolute right-0 text-gray-400">
                {calculateTagPercentage(topTags[0].count)}%
              </span>
            </div>
            <hr className="w-full my-2 border-gray-300 border-b-1" />

            {/* 가장 많이 푼 #2 태그 */}
            <div className="flex justify-between pl-[5%] pr-[25%] relative">
              <span className="text-secondary">#{topTags[1].label}</span>
              <span>{topTags[1].count}</span>
              <span className="absolute right-0 text-gray-400">
                {calculateTagPercentage(topTags[1].count)}%
              </span>
            </div>
            <hr className="w-full my-2 border-gray-300 border-b-1" />
            {/* 가장 많이 푼 #3 태그 */}
            <div className="flex justify-between pl-[5%] pr-[25%] relative">
              <span className="text-secondary">#{topTags[2].label}</span>
              <span>{topTags[2].count}</span>
              <span className="absolute right-0 text-gray-400">
                {calculateTagPercentage(topTags[2].count)}%
              </span>
            </div>
            <hr className="w-full my-2 border-gray-300 border-b-1" />
          </div>
        </div>
      </section>
    </div>
  );
}
