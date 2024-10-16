'use client';

import { Select } from 'antd';
import { useState } from 'react';

const { Option } = Select;

export default function CoursePost() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [announcementTitle, setAnnouncementTitle] = useState<string>('');
  const [announcementContent, setAnnouncementContent] = useState<string>('');

  const courseOptions = [
    '기초프로그래밍 01분반',
    '심화프로그래밍 01분반',
    '알고리즘 01분반',
  ];

  const handleCourseChange = (value: string) => setSelectedCourse(value);
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setAnnouncementTitle(e.target.value);
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setAnnouncementContent(e.target.value);

  const handlePost = () => {
    if (!selectedCourse || !announcementTitle || !announcementContent) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    console.log('Selected course:', selectedCourse);
    console.log('Announcement title:', announcementTitle);
    console.log('Announcement content:', announcementContent);

    setSelectedCourse(null);
    setAnnouncementTitle('');
    setAnnouncementContent('');
  };

  return (
    <div className="flex min-h-screen p-8">
      <div className="w-full h-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary">
        <section className="flex items-center justify-between px-16">
          <h1 className="mb-3 text-lg md:mb-0">과목 공지 등록</h1>
        </section>
        <hr className="mt-5 border-t-2 border-gray-200" />
        <section className="flex flex-col text-sm">
          <div className="flex flex-col px-10 py-4 border-b-[1.5px] border-gray-200">
            <div className="flex flex-col items-center space-x-0 space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
              <label htmlFor="course-select" className="mr-3">
                과목 선택:
              </label>

              <Select
                id="course-select"
                placeholder="공지를 등록 할 과목을 선택하세요."
                mode="multiple"
                value={selectedCourse}
                onChange={handleCourseChange}
                className="w-full sm:w-1/2"
                allowClear
              >
                {courseOptions.map((course) => (
                  <Option key={course} value={course}>
                    {course}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
          <div className="px-10 py-4 border-b-[1.5px] border-gray-200">
            <input
              className="w-full h-10   rounded-lg border-[1px] border-gray-200 pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
              type="text"
              value={announcementTitle}
              onChange={handleTitleChange}
              placeholder="공지 제목을 입력하세요."
            />
          </div>
          <div className="px-10 py-4 border-b-[1.5px] border-gray-200">
            <textarea
              rows={6}
              className="w-full h-[50dvh] rounded-lg border-[1px] border-gray-200 p-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none resize-none"
              value={announcementContent}
              onChange={handleContentChange}
              placeholder="공지 내용을 입력하세요."
            />
          </div>
        </section>
        <div className="flex justify-end px-10 mt-8">
          <button
            className="px-4 py-2 text-base font-normal text-white bg-primary rounded-xl hover:bg-primaryButtonHover"
            onClick={handlePost}
          >
            공지 등록
          </button>
        </div>
      </div>
    </div>
  );
}
