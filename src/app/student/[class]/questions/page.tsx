'use client';

import { Avatar } from 'antd';
import { GrGallery } from 'react-icons/gr';
import { LuTags } from 'react-icons/lu';
import { BsSendCheck } from 'react-icons/bs';
import { IoSearchSharp } from 'react-icons/io5';
import { UserOutlined } from '@ant-design/icons';
export default function Questions() {
  const questionsList: number[] = [1, 2, 3, 4, 5];
  return (
    <div className="w-full flex justify-center text-secondary ">
      <div className="w-[70%] flex gap-12 pt-14 pb-14">
        {/* left */}
        <main className="w-[75%]">
          {/* 검색 */}
          <div className="flex w-full mb-7 items-center bg-white shadow-md rounded-2xl px-4">
            <IoSearchSharp className="text-gray-400 text-lg" />
            <input
              type="text"
              className="w-full py-3 pl-3 focus:outline-none placeholder:text-sm text-sm"
              placeholder="키워드를 입력하세요."
            />
          </div>
          {/* Create Question */}
          <div className="py-10 px-12 bg-white shadow-md rounded-2xl">
            {/* Header */}
            <h1 className="text-lg font-semibold mb-4">💡 Create Question</h1>

            {/* Input Box */}
            <div className="flex items-center bg-gray-100 py-8 px-8 rounded-2xl mb-6">
              <textarea
                placeholder="질문을 입력해 주세요 !"
                className="bg-transparent w-full outline-none text-gray-600 resize-none overflow-hidden"
                rows={1}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto'; // Reset height
                  target.style.height = `${target.scrollHeight}px`; // Set to scrollHeight
                }}
              ></textarea>
            </div>

            {/* Buttons Section */}
            <div className="flex justify-between">
              {/*  Button */}
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 bg-blue-100 hover:bg-blue-200 transition-all text-blue-700 py-3 px-7 rounded-full">
                  <GrGallery />
                  <span className="text-sm">Gallery</span>
                </button>

                {/*Button */}
                <button className="flex items-center space-x-2 bg-red-100 hover:bg-red-200 transition-all text-red-600 py-3 px-7 rounded-full">
                  <LuTags />
                  <span className="text-sm">Tag</span>
                </button>
              </div>
              {/* 등록 Button */}
              <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 transition-all text-white py-3 px-7 rounded-full ">
                <BsSendCheck />
                <span className="text-sm">등록</span>
              </button>
            </div>
          </div>

          {/* Q&A 목록 */}

          {questionsList.map((_, i) => (
            <section className="mt-12" key={i}>
              <div className="py-10 px-12  bg-white shadow-md rounded-2xl">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar
                      style={{ backgroundColor: '#87d068' }}
                      icon={<UserOutlined />}
                    />
                    <div className="flex ml-4 flex-col justify-center">
                      <p className=" font-semibold">20214931 김민수</p>
                      <p className="text-sm text-gray-500">{i}min ago</p>
                    </div>
                  </div>
                  <div className="">
                    <button className="text-gray-500">•&nbsp;•&nbsp;•</button>
                  </div>
                </div>
                {/* Question */}
                <h1 className="mt-8 text-lg font-semibold">
                  피라미드 별 출력하기 질문입니다.
                </h1>
                <p className="mt-4 text-gray-700">
                  C언어를 이용해 피라미드 모양의 별을 출력하려고 합니다.
                  사용자로부터 입력받은 숫자에 따라 피라미드의 층수를 결정하는
                  방법을 알고 싶습니다. 예를 들어, 입력이 5일 경우 아래와 같은
                  출력이 나와야 합니다:
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;***
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*****
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*******
                  <br />
                  &nbsp;&nbsp;&nbsp;*********
                  <br />
                  이를 어떻게 구현할 수 있을까요?
                </p>
                {/* Interaction Buttons */}
                <div className="mt-4 flex items-center space-x-6 ">
                  <span className="text-gray-600">521 Likes</span>

                  <span className="text-gray-600">59 Comments</span>

                  <button className="text-gray-500">Share</button>
                </div>
              </div>
            </section>
          ))}
        </main>
        {/* right */}
        <aside className="flex-1 self-start p-8 text-sm bg-white shadow-md rounded-2xl">
          <h1 className="font-semibold text-secondary mb-8">기초프로그래밍</h1>
          <ul className="space-y-7 text-gray-500">
            <li className="hover:text-gray-700 transition cursor-pointer">
              1. 변수
            </li>
            <li className="hover:text-gray-700 transition cursor-pointer">
              2. 문자열
            </li>
            <li className="text-primary hover:text-primaryHover transition font-semibold cursor-pointer">
              3. 반복문
            </li>
            <li className="hover:text-gray-700 transition cursor-pointer">
              4. 조건문
            </li>
            <li className="hover:text-gray-700 transition cursor-pointer">
              5. 포인터
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
