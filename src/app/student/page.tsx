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
import {
  getMyProfile,
  getSolveGrass,
  getSolveLevel,
  getSolveTag,
} from '@/services/accountUser/profile';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { rankColor } from '@/utils/rankColor';

ChartJS.register(
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
);

export default function StudentMain() {
  const { data: profileData } = useQuery({
    queryKey: ['profileData'],
    queryFn: getMyProfile,
  });
  const profile: ProfileData | null = profileData?.data;
  const userType = profile?.user.admin_type;
  const matchingRole: { [key: string]: string } = {
    'Regular User': '학생',
    Professor: '교수',
    'Super Admin': '관리자',
  };
  const role = matchingRole[(userType as string) ?? ''];

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

  //잔디
  const { data: solveGrassData } = useQuery({
    queryKey: ['solveGrassData'],
    queryFn: getSolveGrass,
  });

  const solveGrass = solveGrassData?.data || [];

  // 오늘 날짜 가져오기
  const today = new Date();

  // 90일 전 날짜를 시작점으로 설정
  const startDate = new Date();
  startDate.setDate(today.getDate() - 90);

  const solveGrassaMap = solveGrass.reduce(
    (
      map: { [x: string]: any },
      item: { create_time: string | number; count: any },
    ) => {
      map[item.create_time] = item.count; // 날짜를 키로, count를 값으로 매핑
      return map;
    },
    {} as Record<string, number>,
  );

  // 90일 데이터를 포함한 heatmapData 생성
  const heatmapData = Array.from({ length: 90 }, (_, i) => {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i + 1); // startDate에서 i일 추가
    const formattedDate = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환

    return {
      date: formattedDate,
      count: solveGrassaMap[formattedDate] || 0, // API 데이터가 없으면 0으로 설정
    };
  });

  //문제 해결 레벨
  const { data: solveLevelData } = useQuery({
    queryKey: ['solveLevelData'],
    queryFn: getSolveLevel,
  });

  const levelData = solveLevelData?.data?.levels || { Low: 0, Mid: 0, High: 0 };

  // 도넛 차트 데이터 생성
  const donutData = useMemo(() => {
    const data = [levelData.Low ?? 0, levelData.Mid ?? 0, levelData.High ?? 0];

    // 모든 데이터가 0인지 확인
    const isAllZero = data.every((value) => value === 0);

    // 데이터가 모두 0인 경우 최소값 추가
    const adjustedData = isAllZero ? data.map(() => 0.01) : data;

    return {
      labels: ['Lv.1', 'Lv.2', 'Lv.3'], // 항상 동일한 레이블 사용
      datasets: [
        {
          label: '학생 수',
          data: adjustedData, // 최소값이 적용된 데이터 사용
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        },
      ],
    };
  }, [levelData]);

  // 도넛 차트 옵션
  const donutOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          // 툴팁에서 값이 0.01일 경우 "0"으로 표시
          label: (tooltipItem: any) => {
            const value = tooltipItem.raw;
            return `${tooltipItem.label}: ${value <= 0.01 ? 0 : value}`;
          },
        },
      },
    },
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

  // 가장 많이 푼 레벨
  const highestLevel = useMemo(() => {
    const maxIndex = donutData.datasets[0].data.indexOf(
      Math.max(...donutData.datasets[0].data),
    );
    return donutData.labels[maxIndex];
  }, [donutData]);

  // solveTagData를 기반으로 레이다 차트 데이터 생성
  const { data: solveTagData } = useQuery({
    queryKey: ['solveTagData'],
    queryFn: getSolveTag,
  });

  // 전체 태그 리스트
  const allTags = [
    '변수',
    '데이터 타입',
    '연산자',
    '조건문',
    '반복문',
    '배열',
    '함수',
    '포인터',
    '문자열',
    '구조체',
    '버퍼',
    '파일',
    '클래스',
    '정렬 알고리즘',
    '탐색 알고리즘',
    '동적 프로그래밍',
    '탐욕 알고리즘',
    '순회 알고리즘',
    '분할 정복 알고리즘',
    '백트래킹 알고리즘',
  ];

  // 태그 데이터를 매핑하고 기본값 처리
  const tagDataMap = solveTagData?.data?.tags || {}; // 정확한 데이터 참조

  // 모든 태그 데이터를 기반으로 기본값 포함 데이터 생성
  const allTagData = allTags.map((tag) => ({
    label: tag,
    count: Number(tagDataMap[tag]) || 0, // 데이터가 없으면 0으로 처리
  }));

  // 상위 6개의 태그 데이터 추출
  const top6Tags = useMemo(() => {
    // 데이터 값을 기준으로 정렬하여 상위 6개 추출
    return allTagData.sort((a, b) => b.count - a.count).slice(0, 6);
  }, [allTagData]);

  // 상위 3개의 태그 데이터 추출
  const top3Tags = useMemo(() => top6Tags.slice(0, 3), [top6Tags]);

  // 레이다 차트 데이터 생성
  const radarData = useMemo(() => {
    return {
      labels: top6Tags.map((tag) => tag.label), // 상위 6개 태그의 이름만 추출
      datasets: [
        {
          label: '알고리즘 분포',
          data: top6Tags.map((tag) => tag.count), // 상위 6개 태그의 데이터만 추출
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
  }, [top6Tags]);

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
        suggestedMax: Math.max(...(radarData.datasets[0]?.data || []), 10),
        ticks: {
          display: false,
        },
      },
    },
  };

  // 퍼센트 계산 함수
  const calculateTagPercentage = (value: number) => {
    const total =
      radarData.datasets[0]?.data.reduce((acc, val) => acc + val, 0) || 0;
    return total === 0 ? '0.0' : ((value / total) * 100).toFixed(1); // 소수점 1자리까지 계산
  };

  // 가장 많이 해결한 태그
  const mostSolvedTag = useMemo(() => {
    const maxIndex = radarData.datasets[0]?.data.indexOf(
      Math.max(...(radarData.datasets[0]?.data || [])),
    );
    return radarData.labels[maxIndex] || 'N/A'; // 데이터가 없을 경우 기본값 반환
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
          <span>📢 서비스 이용 중 문의 사항은 Q&A 게시판을 이용해주세요.</span>
          <span>📢 자세한 공지사항은 공지사항 게시판을 이용해주세요.</span>
          <span>📢 많은 이용 부탁드립니다. 감사합니다.</span>
        </Slider>
      </section>
      <section className="w-[90%] lg:w-[62%] flex flex-col sm:flex-row space-x-0 sm:space-x-12 space-y-12 sm:space-y-0">
        {/* 왼쪽 섹션 유저 프로필 */}
        <div className="w-[100%] sm:w-[25%] flex flex-col justify-center items-center py-10 px-10 border border-gray-300 rounded-xl space-y-1  text-gray-700 relative">
          <Link href="/student/editaccount">
            <RiEdit2Line className="absolute right-4 top-4 text-2xl cursor-pointer" />
          </Link>
          <FaUserGraduate className="text-primary text-[4rem] mb-2" />
          <span className="text-xl font-semibold">{profile?.user?.name}</span>
          <span className="text-lg ">{role}</span>
          <div>
            <span className="font-semibold">Major : </span>
            {profile?.major ?? ''}
          </div>
          <div>
            <span className="font-semibold">학번 : </span>
            {profile?.user?.student_number}
          </div>
        </div>
        {/* 오른쪽 섹션 랭크,잔디 */}
        <div className="flex flex-col items-center justify-between flex-1 px-10 py-10 border border-gray-300 sm:flex-row sm:px-1 md:px-10 lg:px-1 2xl:px-10 rounded-xl">
          {/* 랭크와 스텟 */}
          <div className="flex flex-col items-center flex-1 sm:flex-row ">
            {profile?.rank && (
              <BiSolidAward
                className={`text-[11rem] sm:text-[8rem]  lg:text-[9rem] xl:text-[10rem] 2xl:text-[11rem] animate-pulse mb-5 sm:mb-0`}
                style={{ color: rankColor(profile.rank) }}
              />
            )}
            <div className="flex flex-col items-start justify-center mb-5 ml-0 space-y-3 text-gray-600 sm:ml-0 lg:ml-3 sm:mb-0">
              <span className="font-semibold lg:text-lg 2xl:text-xl">
                <span>Rank : </span>
                <span className="text-gray-900 ">{profile?.rank}</span>
              </span>
              <div className="text-xs lg:text-base">
                <span> 🏃‍♀️ Total Score: </span>
                <span className="font-semibold text-gray-900">
                  {profile?.total_score}
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
              <div className="rounded-[0.27rem] bg-[#ebedf0] w-[0.7rem] h-[0.7rem]" />
              <div className="rounded-[0.27rem] bg-[#9be9a8] w-[0.7rem] h-[0.7rem]" />
              <div className="rounded-[0.27rem] bg-[#40c463] w-[0.7rem] h-[0.7rem]" />
              <div className="rounded-[0.27rem] bg-[#30a14e] w-[0.7rem] h-[0.7rem]" />
              <div className="rounded-[0.27rem] bg-[#216e39] w-[0.7rem] h-[0.7rem]" />
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
              <span>
                {donutData.datasets[0].data[0] <= 0.01
                  ? 0
                  : donutData.datasets[0].data[0]}
              </span>
              <span className="absolute right-0 text-gray-400">
                {donutData.datasets[0].data[0] <= 0.01
                  ? '0.0'
                  : calculatePercentage(donutData.datasets[0].data[0])}
                %
              </span>
            </div>
            <hr className="w-full my-2 border-gray-300 border-b-1" />

            {/* Lv.2 */}
            <div className="flex justify-between pl-[5%] pr-[25%] relative">
              <span className="text-[#36A2EB] font-semibold">Lv.2</span>
              <span>
                {donutData.datasets[0].data[1] <= 0.01
                  ? 0
                  : donutData.datasets[0].data[1]}
              </span>
              <span className="absolute right-0 text-gray-400">
                {donutData.datasets[0].data[1] <= 0.01
                  ? '0.0'
                  : calculatePercentage(donutData.datasets[0].data[1])}
                %
              </span>
            </div>
            <hr className="w-full my-2 border-gray-300 border-b-1" />

            {/* Lv.3 */}
            <div className="flex justify-between pl-[5%] pr-[25%] relative">
              <span className="text-[#FFCE56] font-semibold">Lv.3</span>
              <span>
                {donutData.datasets[0].data[2] <= 0.01
                  ? 0
                  : donutData.datasets[0].data[2]}
              </span>
              <span className="absolute right-0 text-gray-400">
                {donutData.datasets[0].data[2] <= 0.01
                  ? '0.0'
                  : calculatePercentage(donutData.datasets[0].data[2])}
                %
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
              <span className="text-secondary">#{top3Tags[0].label}</span>
              <span>{top3Tags[0].count}</span>
              <span className="absolute right-0 text-gray-400">
                {calculateTagPercentage(top3Tags[0].count)}%
              </span>
            </div>
            <hr className="w-full my-2 border-gray-300 border-b-1" />

            {/* 가장 많이 푼 #2 태그 */}
            <div className="flex justify-between pl-[5%] pr-[25%] relative">
              <span className="text-secondary">#{top3Tags[1].label}</span>
              <span>{top3Tags[1].count}</span>
              <span className="absolute right-0 text-gray-400">
                {calculateTagPercentage(top3Tags[1].count)}%
              </span>
            </div>
            <hr className="w-full my-2 border-gray-300 border-b-1" />
            {/* 가장 많이 푼 #3 태그 */}
            <div className="flex justify-between pl-[5%] pr-[25%] relative">
              <span className="text-secondary">#{top3Tags[2].label}</span>
              <span>{top3Tags[2].count}</span>
              <span className="absolute right-0 text-gray-400">
                {calculateTagPercentage(top3Tags[2].count)}%
              </span>
            </div>
            <hr className="w-full my-2 border-gray-300 border-b-1" />
          </div>
        </div>
      </section>
    </div>
  );
}
