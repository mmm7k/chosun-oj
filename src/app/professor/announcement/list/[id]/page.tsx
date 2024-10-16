'use client';

import { Select } from 'antd';
import { useState } from 'react';

const { Option } = Select;

export default function AnnouncementEdit() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [announcementTitle, setAnnouncementTitle] = useState<string>('');
  const [announcementContent, setAnnouncementContent] = useState<string>('');

  const courseOptions = ['기초프로그래밍', '심화프로그래밍', '알고리즘'];

  const handleCourseChange = (value: string) => setSelectedCourse(value);
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setAnnouncementTitle(e.target.value);
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setAnnouncementContent(e.target.value);

  const handleEdit = () => {
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
        <section className="flex flex-col items-center justify-between px-0 md:flex-row md:px-16">
          <h1 className="mb-3 text-lg md:mb-0">공지 수정</h1>
        </section>

        <hr className="mt-5 border-t-2 border-gray-200" />

        <section className="px-3 mt-5 space-y-4 sm:px-16">
          <Select
            placeholder="과목을 선택하세요."
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

          <input
            className="w-full h-10 rounded-lg border-[1px] border-gray-200 pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
            type="text"
            value={announcementTitle}
            onChange={handleTitleChange}
            placeholder="공지 제목을 입력하세요."
          />

          <textarea
            rows={6}
            className="w-full h-[50dvh] rounded-lg border-[1px] border-gray-200 p-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none resize-none"
            value={announcementContent}
            onChange={handleContentChange}
            placeholder="공지 내용을 입력하세요."
          />

          <div className="flex justify-end">
            <button
              className="px-4 py-2 text-base font-normal text-white bg-primary rounded-xl hover:bg-primaryButtonHover"
              onClick={handleEdit}
            >
              공지 등록
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
