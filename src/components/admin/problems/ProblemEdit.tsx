'use client';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Checkbox, message, Select, Spin } from 'antd';
import { Suspense, useEffect, useRef, useState } from 'react';
import { PiExclamationMarkFill } from 'react-icons/pi';
import '@toast-ui/editor/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import { useMutation, useQuery } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { getProblem } from '@/services/problemAdmin/getProblem';
import { editProblem } from '@/services/problemAdmin/editProblem';
import dynamic from 'next/dynamic';
const EditorComponent = dynamic(() => import('@/components/commons/Editor'), {
  ssr: false,
});

const { Option } = Select;

export default function ProblemPost() {
  const pathname = usePathname();
  const router = useRouter();
  // URL의 마지막 숫자 추출
  const problemId = Number(pathname.split('/').pop());
  const { data: problemInformation, refetch } = useQuery({
    queryKey: ['problemInformation', problemId],
    queryFn: () => getProblem(problemId),
    enabled: !!problemId,
  });
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [markdownContent, setMarkdownContent] = useState('');
  const editorRef = useRef<Editor | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEditorChange = () => {
    if (editorRef.current) {
      const content = editorRef.current?.getInstance().getMarkdown();
      setMarkdownContent(content);
    }
  };

  const problemTags = [
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

  const schema = Yup.object().shape({
    _id: Yup.string().required('문제 코드는 필수 입력입니다.'),
    title: Yup.string().required('문제 이름은 필수 입력입니다.'),
    score: Yup.number().required('점수는 필수 입력입니다.'),
    time_limit: Yup.number().required('시간 제한은 필수 입력입니다.'),
    memory_limit: Yup.number().required('메모리 제한은 필수 입력입니다.'),
    languages: Yup.array().min(1, '최소 한 개의 언어를 선택해야 합니다.'),
    is_public: Yup.boolean().required(),
    is_visible: Yup.boolean().required(),
    difficulty: Yup.string().required('난이도를 선택하세요.'),
    tags: Yup.array().min(1, '최소 한 개의 태그를 선택하세요.'),
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      score: 1,
      time_limit: 1000,
      memory_limit: 256,
      languages: [],
      is_public: true,
      is_visible: true,
      difficulty: 'Low',
      tags: [],
    },
  });

  useEffect(() => {
    if (problemInformation?.data) {
      reset({
        _id: problemInformation.data._id,
        title: problemInformation.data.title,
        score: problemInformation.data.test_case_score[0].score,
        time_limit: problemInformation.data.time_limit,
        memory_limit: problemInformation.data.memory_limit,
        languages: problemInformation.data.languages,
        is_public: problemInformation.data.is_public,
        is_visible: problemInformation.data.is_visible,
        difficulty: problemInformation.data.difficulty,
        tags: problemInformation.data.tags,
      });
      setMarkdownContent(problemInformation.data.description || '');
      setIsEditorReady(true);
    }
  }, [problemInformation, reset]);

  const mutation = useMutation({
    mutationFn: (data: any) => editProblem(problemId, data),
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: () => {
      message.success('문제가 성공적으로 수정되었습니다.');
      setIsLoading(false);
      refetch();
      router.push('/admin/problems/list');
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

  const onSubmit = (data: any) => {
    const formattedData = {
      _id: data._id,
      title: data.title,
      description: markdownContent || '내용이 없습니다.',
      // input_description: '',
      // output_description: '',
      // samples: [],
      // test_case_id: 'test',
      test_case_score: [
        {
          score: data.score,
          input_name: '1.in',
          output_name: '1.out',
        },
      ],
      time_limit: data.time_limit,
      memory_limit: data.memory_limit,
      languages: data.languages,
      // template: {},
      // io_mode: {
      // io_mode: 'Standard IO',
      // input: 'input.txt',
      // output: 'output.txt',
      // },
      // spj: false,
      // spj_language: null,
      // spj_code: null,
      // spj_compile_ok: false,
      is_public: data.is_public,
      is_visible: data.is_visible,
      difficulty: data.difficulty,
      tags: data.tags,
      // hint: '',
      // source: '',
      share_submission: false,
    };

    mutation.mutate(formattedData); // Mutation 실행
  };

  if (!isEditorReady) {
    return null;
  }
  return (
    <>
      {/* 뮤테이션 Loading UI */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10">
          <Spin size="large" />
        </div>
      )}
      <div className="flex min-h-screen p-8">
        <div className="w-full h-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary">
          <section className="relative flex items-center justify-between px-16 ">
            <h1 className="text-lg">문제 수정</h1>
          </section>
          <hr className="mt-5 border-t-2 border-gray-200" />

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col text-sm"
          >
            {/* 문제 코드 */}
            <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200 ">
              <div className="flex items-center">
                <label htmlFor="problem-code">문제 코드:</label>
                <input
                  {...register('_id')}
                  className="ml-3 w-[60%] sm:w-[20%] h-8 rounded-lg border-[1px] border-gray-200 font-norm pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
                  id="problem-code"
                  type="text"
                  placeholder="문제코드를 입력해주세요"
                />
              </div>

              {errors._id && (
                <p className="text-xs text-red-500 mt-1">
                  {errors._id.message}
                </p>
              )}
            </div>
            {/* 문제 이름 */}
            <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200 ">
              <div className="flex items-center">
                <label htmlFor="problem-name">문제 이름:</label>
                <input
                  {...register('title')}
                  className="ml-3 w-[60%] sm:w-[20%] h-8 rounded-lg  border-[1px] border-gray-200 font-norm pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
                  id="problem-name"
                  type="text"
                  placeholder="문제이름을 입력해주세요"
                />
              </div>
              <span className="flex items-center mt-3 text-xs font-normal text-gray-400">
                <PiExclamationMarkFill className="text-lg" />
                <span>&nbsp; 문제 목록에 표시된 문제의 이름입니다.</span>
              </span>
              {errors.title && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>
            {/* 마크다운 에디터 */}
            <div className="flex flex-col justify-center px-10 py-7  border-b-[1.5px] border-gray-200 ">
              <div>
                <label htmlFor="markdown-editor">문제 본문: </label>

                <div className="mt-6">
                  {/* <Suspense>
                    <Editor
                      ref={editorRef}
                      initialValue={markdownContent || ' '}
                      previewStyle="vertical"
                      height="25rem"
                      initialEditType="markdown"
                      useCommandShortcut={false}
                      hideModeSwitch={true}
                      onChange={handleEditorChange}
                    />
                  </Suspense> */}
                  <EditorComponent
                    editorRef={editorRef}
                    initialValue={markdownContent || ''}
                    previewStyle="vertical"
                    height="50rem"
                    // initialEditType="markdown"
                    initialEditType="wysiwyg"
                    useCommandShortcut={false}
                    hideModeSwitch={false}
                    onChange={handleEditorChange}
                  />
                </div>
              </div>
            </div>

            {/* 점수 */}
            <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200 ">
              <div className="flex items-center">
                <label htmlFor="score-input">점수: </label>
                <input
                  {...register('score')}
                  id="score-input"
                  className="ml-3 w-[10%] sm:w-[5%] h-8 rounded-lg  border-[1px] border-gray-200 font-norm pl-[0.4rem] sm:pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
                  type="number"
                />
              </div>
              {errors.score && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.score.message}
                </p>
              )}
            </div>
            {/* 시간 제한 */}
            <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200 ">
              <div className="flex items-center">
                <label htmlFor="time-limit-input">시간 제한:</label>
                <input
                  {...register('time_limit')}
                  id="time-limit-input"
                  className="ml-3 w-[10%] sm:w-[5%] h-8 rounded-lg  border-[1px] border-gray-200 font-norm pl-[0.4rem] sm:pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
                  type="number"
                />
              </div>
              <span className="flex items-center mt-3 text-xs font-normal text-gray-400">
                <PiExclamationMarkFill className="text-lg" />
                <span>&nbsp; 이 문제의 시간 제한입니다. 단위는 ms 입니다.</span>
              </span>
              {errors.time_limit && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.time_limit.message}
                </p>
              )}
            </div>
            {/* 메모리 제한 */}
            <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200 ">
              <div className="flex items-center">
                <label htmlFor="memory-limit-input">메모리 제한:</label>
                <input
                  {...register('memory_limit')}
                  id="memory-limit-input"
                  className="ml-3 w-[10%] sm:w-[5%] h-8 rounded-lg  border-[1px] border-gray-200 font-norm pl-4 placeholder:text-sm placeholder:font-normal focus:ring-1 focus:ring-gray-200 focus:outline-none"
                  type="number"
                />
              </div>
              <span className="flex items-center mt-3 text-xs font-normal text-gray-400">
                <PiExclamationMarkFill className="text-lg" />
                <span>
                  &nbsp; 이 문제에 대한 메모리 제한입니다. 단위는 mb 입니다.
                </span>
              </span>
              {errors.memory_limit && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.memory_limit.message}
                </p>
              )}
            </div>
            {/* 언어 */}
            <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200 ">
              <div className="flex items-center">
                <label htmlFor="problem-type-language" className="mr-3">
                  언어:
                </label>
                <Controller
                  name="languages"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center">
                      <Checkbox
                        checked={field.value?.includes('C') || false}
                        onChange={(e) =>
                          field.onChange(
                            e.target.checked
                              ? [...(field.value || []), 'C']
                              : (field.value || []).filter(
                                  (lang: string) => lang !== 'C',
                                ),
                          )
                        }
                      >
                        C
                      </Checkbox>

                      <Checkbox
                        checked={field.value?.includes('C++') || false}
                        onChange={(e) =>
                          field.onChange(
                            e.target.checked
                              ? [...(field.value || []), 'C++']
                              : (field.value || []).filter(
                                  (lang: string) => lang !== 'C++',
                                ),
                          )
                        }
                      >
                        C++
                      </Checkbox>
                      <Checkbox
                        checked={field.value?.includes('Java') || false}
                        onChange={(e) =>
                          field.onChange(
                            e.target.checked
                              ? [...(field.value || []), 'Java']
                              : (field.value || []).filter(
                                  (lang: string) => lang !== 'Java',
                                ),
                          )
                        }
                      >
                        Java
                      </Checkbox>

                      <Checkbox
                        checked={field.value?.includes('Python3') || false}
                        onChange={(e) =>
                          field.onChange(
                            e.target.checked
                              ? [...(field.value || []), 'Python3']
                              : (field.value || []).filter(
                                  (lang: string) => lang !== 'Python3',
                                ),
                          )
                        }
                      >
                        Python3
                      </Checkbox>
                    </div>
                  )}
                />
              </div>
              {errors.languages && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.languages.message}
                </p>
              )}
            </div>

            <div className="flex items-center px-10 py-4 border-b-[1.5px] border-gray-200 ">
              <label htmlFor="problem-type-visible" className="mr-3">
                공개 여부:
              </label>
              <Controller
                name="is_visible"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value || false}
                    onChange={(e) => field.onChange(e.target.checked)}
                  ></Checkbox>
                )}
              />
            </div>

            {/* 대회/과제 여부 */}
            <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200 ">
              <div className="flex items-center">
                <label htmlFor="problem-type-public" className="mr-3">
                  대회/과제 출제 여부:
                </label>
                <Controller
                  name="is_public"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      checked={!field.value || false}
                      onChange={(e) => field.onChange(!e.target.checked)}
                    ></Checkbox>
                  )}
                />
              </div>
              {errors.is_public && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.is_public.message}
                </p>
              )}
              <span className="flex items-center mt-3 text-xs font-normal text-gray-400">
                <PiExclamationMarkFill className="text-lg" />
                <span>
                  &nbsp; 대회 과제로 출제할 경우 체크해주세요. 체크 시 문제는
                  비공개로 설정됩니다.
                </span>
              </span>
            </div>
            {/* 문제 난이도 */}
            <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200 ">
              <div className="flex items-center">
                <label htmlFor="problem-type-select" className="mr-3">
                  문제 난이도:
                </label>
                <Controller
                  name="difficulty"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="문제 난이도를 선택하세요."
                      className="w-[60%] sm:w-[20%] h-8"
                    >
                      <Option value="Low">Lv.1</Option>
                      <Option value="Mid">Lv.2</Option>
                      <Option value="High">Lv.3</Option>
                    </Select>
                  )}
                />
              </div>
              {errors.difficulty && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.difficulty.message}
                </p>
              )}
            </div>
            {/* 문제 태그 */}
            <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200 ">
              <div className="flex items-center">
                <label htmlFor="problem-tag-select" className="mr-3">
                  문제 태그:
                </label>
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      mode="multiple"
                      placeholder="문제 태그를 선택하세요."
                      className="w-[60%] overflow-hidden sm:min-w-[20%] sm:w-auto h-8"
                      allowClear
                    >
                      {problemTags.map((tag) => (
                        <Option key={tag} value={tag}>
                          {tag}
                        </Option>
                      ))}
                    </Select>
                  )}
                />
              </div>
              {errors.tags && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.tags.message}
                </p>
              )}
            </div>
            {/* 수정 버튼 */}
            <div className="flex justify-end w-full px-10 mt-8">
              <button
                className="px-4 py-2 text-base font-normal text-white bg-primary rounded-xl hover:bg-primaryButtonHover"
                type="submit"
              >
                문제 수정
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
