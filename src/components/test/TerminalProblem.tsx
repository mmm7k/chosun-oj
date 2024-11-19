'use client';

import { useRef, useState, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import Image from 'next/image';
import Split from 'react-split';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Switch from '@mui/material/Switch';
import io, { Socket } from 'socket.io-client';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useRouter } from 'next/navigation';
import 'highlight.js/styles/github.css';
import { Select } from 'antd';
import axios from 'axios';
import { Buffer } from 'buffer';

const { Option } = Select;

const codeTemplate = {
  c: `#include <stdio.h>\n\nint main() {\n    // Your code here\n    return 0;\n}`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}`,
  python: `def solution():\n    # Your code here\n    pass`,
  java: `public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`,
};

const languageMap = {
  C: 'c',
  'C++': 'cpp',
  Python: 'python',
  Java: 'java',
};

export default function Problem() {
  const [code, setCode] = useState(codeTemplate.c);
  const [output, setOutput] = useState('실행 결과가 표시됩니다.');
  const [isLoading, setIsLoading] = useState(false);
  const [isTerminalMode, setIsTerminalMode] = useState(false); // 터미널 모드 플래그
  const [socket, setSocket] = useState<Socket | null>(null); // Socket.IO 연결 상태 관리
  const [isConnected, setIsConnected] = useState(false); // 연결 상태 플래그
  const terminalRef = useRef<HTMLDivElement>(null); // 터미널 DOM을 참조할 ref
  const term = useRef<Terminal | null>(null); // Xterm.js 터미널 인스턴스
  const fitAddon = useRef(new FitAddon()); // FitAddon 인스턴스
  const [isLeftVisible, setIsLeftVisible] = useState(true);
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitVisible, setIsSubmitVisible] = useState(false);
  // 제출내역
  const [isCodeVisible, setIsCodeVisible] = useState(false);
  const [isCodeVisible2, setIsCodeVisible2] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>('C');
  const languageOptions = ['C', 'C++', 'Java', 'Python'];

  const codeString = `function solution(s) {
let t = s.split(" ");
return Math.min(...t) + " " + Math.max(...t);
}`;

  const runcode = async () => {
    setIsLoading(true);

    let language = '';
    switch (selectedLanguage) {
      case 'C':
        language = '49';
        break;
      case 'C++':
        language = '54';
        break;
      case 'Python':
        language = '71';
        break;
      case 'Java':
        language = '62';
        break;
      default:
        language = '';
    }
    try {
      const encodedSourceCode = Buffer.from(code, 'utf-8').toString('base64');
      const response = await axios.post(
        'http://chosuncnl.shop:2358/submissions?base64_encoded=true&wait=true',
        {
          source_code: encodedSourceCode,
          language_id: language,
          stdin: '',
          compiler_options: '',
          command_line_arguments: '',
          redirect_stderr_to_stdout: true,
        },
      );
      const token = response.data.token;

      // 두 번째 GET 요청으로 실행 결과 받기
      const response2 = await axios.get(
        `http://chosuncnl.shop:2358/submissions/${token}?base64_encoded=true`,
      );
      const result = response2.data;

      // stdout과 compile_output 체크
      let output;
      if (result.stdout) {
        output = Buffer.from(result.stdout, 'base64').toString('utf-8');
      } else if (result.compile_output) {
        output = Buffer.from(result.compile_output, 'base64').toString('utf-8');
      } else {
        output = 'No output available.';
      }

      // 출력 결과 설정
      setOutput(output);
      return output;
    } catch (error) {
      console.error('Execution failed:', error);
      setOutput('Error executing code.');
      return 'Error executing code.';
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    switch (value) {
      case 'C':
        setCode(codeTemplate.c);
        break;
      case 'C++':
        setCode(codeTemplate.cpp);
        break;
      case 'Python':
        setCode(codeTemplate.python);
        break;
      case 'Java':
        setCode(codeTemplate.java);
        break;
      default:
        setCode('');
    }
  };

  // 초기화 버튼 클릭 핸들러 함수
  const handleResetCode = () => {
    switch (selectedLanguage) {
      case 'C':
        setCode(codeTemplate.c);
        break;
      case 'C++':
        setCode(codeTemplate.cpp);
        break;
      case 'Python':
        setCode(codeTemplate.python);
        break;
      case 'Java':
        setCode(codeTemplate.java);
        break;
      default:
        setCode('');
    }
  };

  // 모달 열기/닫기 함수
  const toggleModal = () => {
    setIsModalVisible((prev) => !prev);
  };

  // 뒤로 가기
  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    if (isTerminalMode) {
      connectSocket(); // 터미널 모드일 때 소켓 연결
    } else {
      disconnectSocket(); // 에디터 모드일 때 소켓 연결 해제
    }

    return () => disconnectSocket(); // 컴포넌트 언마운트 시 소켓 해제
  }, [isTerminalMode]);

  // 터미널 초기화 및 소켓 연결
  const connectSocket = () => {
    if (!isConnected && terminalRef.current) {
      term.current = new Terminal({
        cursorBlink: true,
        rows: 24,
        cols: 80,
      });

      term.current.loadAddon(fitAddon.current);
      term.current.open(terminalRef.current);
      fitAddon.current.fit();

      const resizeObserver = new ResizeObserver(() => {
        fitAddon.current.fit();
      });
      resizeObserver.observe(terminalRef.current);

      term.current.writeln('Welcome to the online judge terminal!\r\n');

      let inputBuffer = '';
      let ignoreNextOutput = false;

      console.log('Socket.IO 연결 시도');
      //@ts-ignore
      // const socketConnection = io(process.env.NEXT_PUBLIC_SSH);
      const socketConnection = io(process.env.NEXT_PUBLIC_SSH, {
        transports: ['websocket'],
      });
      setSocket(socketConnection);

      socketConnection.on('connect', () => {
        setIsConnected(true);
        console.log('Socket.IO 연결 성공');

        term.current?.onData((data) => {
          if (data === '\t') {
            socketConnection.emit('autocomplete', inputBuffer);
          } else if (data === '\x03') {
            // 서Ctrl+C 명령 전송
            socketConnection.emit('command', '\x03');
          } else if (data === '\r') {
            // 명령어 입력 후 서버로 전송
            socketConnection.emit('command', inputBuffer);
            inputBuffer = '';
            term.current?.write('\r\n');
            ignoreNextOutput = true;
          } else if (data === '\u007F') {
            // 백스페이스 처리
            if (inputBuffer.length > 0) {
              inputBuffer = inputBuffer.slice(0, inputBuffer.length - 1);
              term.current?.write('\b \b');
            }
          } else {
            inputBuffer += data;
            term.current?.write(data);
          }
        });
      });

      socketConnection.on('output', (data) => {
        if (term.current && !ignoreNextOutput) {
          term.current.write(data);
        } else {
          ignoreNextOutput = false;
        }
      });
    }
  };

  // 소켓 연결 해제
  const disconnectSocket = () => {
    if (socket) {
      console.log('Socket.IO 연결 해제');
      socket.disconnect();
      setIsConnected(false);
      term.current?.dispose(); // 터미널 정리
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col text-gray-800 ">
      {/* 헤더 */}
      <div className="flex items-center h-20 px-4 text-white lg:h-14 bg-darkPrimary sm:px-12">
        <div className="relative mr-3 w-9 h-9">
          <Image
            src={'/commons/whiteSymbol.png'}
            alt="Logo"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <span className="text-lg">Chosun Online Judge</span>
      </div>

      {/* 문제 이름 */}
      <div className="w-full h-14 border-b-[1.5px] bg-white border-gray-300 px-4 sm:px-12 flex justify-between items-center">
        <div className="space-x-2 sm:space-x-4">
          <button
            className={`mt-4  pb-3 ${!isSubmitVisible ? 'text-primary border-primary border-b-[3px] font-semibold ' : 'text-gray-400 border-gray-400'}`}
            onClick={() => setIsSubmitVisible(!isSubmitVisible)}
          >
            피라미드 문제
          </button>

          <button
            className={`mt-4  pb-3 ${isSubmitVisible ? 'text-primary border-primary border-b-[3px] font-semibold ' : 'text-gray-400 border-gray-400'}`}
            onClick={() => setIsSubmitVisible(!isSubmitVisible)}
          >
            제출 내역
          </button>
        </div>
        <div className="flex items-center">
          <div className="sm:hidden">
            {/* sm 이하에서만 보이는 토글 버튼 그룹 */}
            <ToggleButtonGroup
              color="primary"
              value={isLeftVisible ? 'left' : 'right'}
              exclusive
              onChange={(event, newAlignment) => {
                if (newAlignment !== null) {
                  setIsLeftVisible(newAlignment === 'left');
                }
              }}
              aria-label="Section Visibility"
            >
              <ToggleButton value="left" sx={{ fontWeight: 900 }}>
                문제 설명
              </ToggleButton>
              <ToggleButton value="right" sx={{ fontWeight: 900 }}>
                에디터
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
          <Select
            id="language-select"
            placeholder="언어 선택"
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="w-24"
          >
            {languageOptions.map((language) => (
              <Option key={language} value={language}>
                {language}
              </Option>
            ))}
          </Select>
          {/* <Switch
            checked={isTerminalMode}
            onChange={() => setIsTerminalMode((prev) => !prev)}
          />
          <span className="mr-2 text-sm text-gray-700">터미널</span> */}
        </div>
      </div>

      {/* 가변 섹션 */}
      <div className="flex flex-1 min-h-0 bg-white">
        {/* sm 이상에서는 좌/우 분할된 화면 */}
        <div className="hidden w-full sm:flex">
          <Split className="flex flex-1" sizes={[50, 50]} minSize={200}>
            {/* 왼쪽 섹션 */}
            {!isSubmitVisible ? (
              <div className="px-12 py-5 space-y-5 overflow-auto w-[50%]">
                <h1 className="font-semibold">문제 설명</h1>
                <p className="text-sm">
                  정수 num1과 num2가 매개변수로 주어집니다. 두 수가 같으면 1
                  다르면 -1을 return 하도록 solution 함수를 완성해주세요.
                </p>
                <hr className="border-[1px] border-gray-200" />
                <h1 className="font-semibold">제한 사항</h1>
                <p className="text-sm">
                  * num1, num2는 -10,000,000 이상, 10,000,000 이하인 정수입니다.
                  <br /> <br /> * num1, num2는 -10,000,000 이상, 10,000,000
                  이하인 정수입니다.
                </p>
                <hr className="border-[1px] border-gray-200" />
                <h1 className="font-semibold">입출력 예</h1>
                <div className="text-sm">
                  <table className="w-[30%] text-center border-collapse">
                    <thead>
                      <tr>
                        <th className="border border-gray-300">num1</th>
                        <th className="border border-gray-300">num2</th>
                        <th className="border border-gray-300">return</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300">3</td>
                        <td className="border border-gray-300">3</td>
                        <td className="border border-gray-300">1</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300">3</td>
                        <td className="border border-gray-300">4</td>
                        <td className="border border-gray-300">-1</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <hr className="border-[1px] border-gray-200" />
                <h1 className="font-semibold">입출력 예 설명</h1>
                <h2 className="font-semibold">입출력 예 #1</h2>
                <p className="text-sm">
                  정수 num1과 num2가 매개변수로 주어집니다. 두 수가 같으면 1
                  다르면 -1을 return 하도록 solution 함수를 완성해주세요.
                </p>
                <h2 className="font-semibold">입출력 예 #2</h2>
                <p className="text-sm">
                  정수 num1과 num2가 매개변수로 주어집니다. 두 수가 같으면 1
                  다르면 -1을 return 하도록 solution 함수를 완성해주세요.
                </p>
                <h2 className="font-semibold">입출력 예 #3</h2>
                <p className="text-sm">
                  정수 num1과 num2가 매개변수로 주어집니다. 두 수가 같으면 1
                  다르면 -1을 return 하도록 solution 함수를 완성해주세요.
                </p>
              </div>
            ) : (
              <div className="w-full h-full p-3">
                <table className="w-full table-auto text-center border-t">
                  <thead className="border-b-2 text-gray-500 text-xs ">
                    <tr>
                      <th className="py-1 font-normal">제출 일시</th>
                      <th className="py-1 font-normal">언어</th>
                      <th className="py-1 font-normal">채점 내역</th>
                    </tr>
                  </thead>
                  <tbody className="w-full text-gray-600 text-xs">
                    <tr
                      className="hover:bg-gray-50 border-b cursor-pointer"
                      onClick={() => setIsCodeVisible(!isCodeVisible)}
                    >
                      <td className="py-3 font-normal">2022-06-22</td>
                      <td className="py-3 font-normal">Javascript</td>
                      <td className="py-3 font-normal text-green-500">정답</td>
                    </tr>
                    {isCodeVisible && (
                      <tr>
                        <td colSpan={3} className="px-4 py-2 text-left">
                          <pre className="bg-[#1E1E1E] text-[#D4D4D4] p-2">
                            <code>{codeString}</code>
                          </pre>
                        </td>
                      </tr>
                    )}
                    <tr
                      className="hover:bg-gray-50 border-b cursor-pointer"
                      onClick={() => setIsCodeVisible2(!isCodeVisible2)}
                    >
                      <td className="py-3 font-normal">2022-06-22</td>
                      <td className="py-3 font-normal">Javascript</td>
                      <td className="py-3 font-normal text-red-500">오답</td>
                    </tr>
                    {isCodeVisible2 && (
                      <tr>
                        <td colSpan={3} className="px-4 py-2 text-left">
                          <pre className="bg-[#1E1E1E] text-[#D4D4D4] p-2">
                            <code>{codeString}</code>
                          </pre>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* 오른쪽 섹션 */}
            <Split direction="vertical" sizes={[50, 50]} minSize={100}>
              {isTerminalMode ? (
                <div className="h-full overflow-auto ">
                  <div
                    ref={terminalRef}
                    style={{ width: '100%', height: '100%' }}
                  ></div>
                </div>
              ) : (
                <div className="h-full overflow-auto ">
                  <MonacoEditor
                    //@ts-ignore
                    language={languageMap[selectedLanguage]}
                    theme="vs-dark"
                    value={code}
                    onChange={(newCode) => setCode(newCode || '')}
                    options={{
                      suggestOnTriggerCharacters: false,
                      quickSuggestions: false,
                      tabCompletion: 'off',
                    }}
                  />
                </div>
              )}
              <div className="overflow-auto  bg-[#1E1E1E] text-[#D4D4D4]">
                <h1 className="px-5 py-3 font-medium border-b border-[#D4D4D4]">
                  실행 결과
                </h1>
                <div className="px-5 py-3 text-sm">
                  {isLoading ? (
                    <Spin indicator={<LoadingOutlined spin />} size="large" />
                  ) : (
                    <pre>
                      <code>{output}</code>
                    </pre>
                  )}
                </div>
              </div>
            </Split>
          </Split>
        </div>

        {/* sm 이하에서는 좌/우 토글된 화면 */}
        <div className="flex w-screen h-full sm:hidden">
          {isLeftVisible ? (
            !isSubmitVisible ? (
              <div className="w-full px-4 py-5 space-y-5 overflow-auto sm:px-12 ">
                <h1 className="font-semibold">문제 설명</h1>
                <p className="text-sm">
                  정수 num1과 num2가 매개변수로 주어집니다. 두 수가 같으면 1
                  다르면 -1을 return 하도록 solution 함수를 완성해주세요.
                </p>
                <hr className="border-[1px] border-gray-200" />
                <h1 className="font-semibold">제한 사항</h1>
                <p className="text-sm">
                  * num1, num2는 -10,000,000 이상, 10,000,000 이하인 정수입니다.
                  <br /> <br /> * num1, num2는 -10,000,000 이상, 10,000,000
                  이하인 정수입니다.
                </p>
                <hr className="border-[1px] border-gray-200" />
                <h1 className="font-semibold">입출력 예</h1>
                <div className="text-sm">
                  <table className="w-[30%] text-center border-collapse">
                    <thead>
                      <tr>
                        <th className="border border-gray-300">num1</th>
                        <th className="border border-gray-300">num2</th>
                        <th className="border border-gray-300">return</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300">3</td>
                        <td className="border border-gray-300">3</td>
                        <td className="border border-gray-300">1</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300">3</td>
                        <td className="border border-gray-300">4</td>
                        <td className="border border-gray-300">-1</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <hr className="border-[1px] border-gray-200" />
                <h1 className="font-semibold">입출력 예 설명</h1>
                <h2 className="font-semibold">입출력 예 #1</h2>
                <p className="text-sm">
                  정수 num1과 num2가 매개변수로 주어집니다. 두 수가 같으면 1
                  다르면 -1을 return 하도록 solution 함수를 완성해주세요.
                </p>
                <h2 className="font-semibold">입출력 예 #2</h2>
                <p className="text-sm">
                  정수 num1과 num2가 매개변수로 주어집니다. 두 수가 같으면 1
                  다르면 -1을 return 하도록 solution 함수를 완성해주세요.
                </p>
                <h2 className="font-semibold">입출력 예 #3</h2>
                <p className="text-sm">
                  정수 num1과 num2가 매개변수로 주어집니다. 두 수가 같으면 1
                  다르면 -1을 return 하도록 solution 함수를 완성해주세요.
                </p>
              </div>
            ) : (
              <div className="w-full h-full p-3">
                <table className="w-full table-auto text-center border-t">
                  <thead className="border-b-2 text-gray-500 text-xs ">
                    <tr>
                      <th className="py-1 font-normal">제출 일시</th>
                      <th className="py-1 font-normal">언어</th>
                      <th className="py-1 font-normal">채점 내역</th>
                    </tr>
                  </thead>
                  <tbody className="w-full text-gray-600 text-xs">
                    <tr
                      className="hover:bg-gray-50 border-b cursor-pointer"
                      onClick={() => setIsCodeVisible(!isCodeVisible)}
                    >
                      <td className="py-3 font-normal">2022-06-22</td>
                      <td className="py-3 font-normal">Javascript</td>
                      <td className="py-3 font-normal text-green-500">정답</td>
                    </tr>
                    {isCodeVisible && (
                      <tr>
                        <td colSpan={3} className="px-4 py-2 text-left">
                          <pre className="bg-[#1E1E1E] text-[#D4D4D4] p-2 ">
                            <code>{codeString}</code>
                          </pre>
                        </td>
                      </tr>
                    )}
                    <tr
                      className="hover:bg-gray-50 border-b cursor-pointer"
                      onClick={() => setIsCodeVisible2(!isCodeVisible2)}
                    >
                      <td className="py-3 font-normal">2022-06-22</td>
                      <td className="py-3 font-normal">Javascript</td>
                      <td className="py-3 font-normal text-red-500">오답</td>
                    </tr>
                    {isCodeVisible2 && (
                      <tr>
                        <td colSpan={3} className="px-4 py-2 text-left">
                          <pre className="bg-[#1E1E1E] text-[#D4D4D4] p-2">
                            <code>{codeString}</code>
                          </pre>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <Split
              direction="vertical"
              sizes={[50, 50]}
              minSize={100}
              className="w-screen"
            >
              {isTerminalMode ? (
                <div className="h-full overflow-auto ">
                  <div
                    ref={terminalRef}
                    style={{ width: '100%', height: '100%' }}
                  ></div>
                </div>
              ) : (
                <div className="h-full overflow-auto ">
                  <MonacoEditor
                    //@ts-ignore
                    language={languageMap[selectedLanguage]}
                    theme="vs-dark"
                    value={code}
                    onChange={(newCode) => setCode(newCode || '')}
                    options={{
                      suggestOnTriggerCharacters: false,
                      quickSuggestions: false,
                      tabCompletion: 'off',
                    }}
                  />
                </div>
              )}
              <div className="overflow-auto  bg-[#1E1E1E] text-[#D4D4D4]">
                <h1 className="px-5 py-3 font-medium border-b border-[#D4D4D4]">
                  실행 결과
                </h1>
                <div className="px-5 py-3 text-sm">
                  {isLoading ? (
                    <Spin indicator={<LoadingOutlined spin />} size="large" />
                  ) : (
                    <pre>
                      <code>{output}</code>
                    </pre>
                  )}
                </div>
              </div>
            </Split>
          )}
        </div>
      </div>

      {/* 푸터 */}
      <div className="flex items-center justify-between px-4 text-white bg-white border-t border-gray-300 min-h-16 sm:px-12">
        <button
          className="px-4 py-2 text-gray-800 transition bg-gray-200 rounded-md hover:bg-gray-300"
          onClick={handleBack}
        >
          이전으로
        </button>
        <div className="flex space-x-4">
          <button
            className="px-4 py-2 text-gray-800 transition bg-gray-200 rounded-md hover:bg-gray-300"
            onClick={handleResetCode}
          >
            초기화
          </button>
          <button
            className="px-4 py-2 text-gray-800 transition bg-gray-200 rounded-md hover:bg-gray-300"
            onClick={runcode}
          >
            코드 실행
          </button>
          <button
            className="bg-[#002a87] text-white px-4 py-2 rounded-md hover:bg-[#00226e] transition"
            onClick={toggleModal}
          >
            제출 후 채점하기
          </button>
        </div>
      </div>
      {/* 제출 후 결과 모달 */}

      {/* 제출 후 결과 모달 */}
      {isModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 배경 어둡게 만들기 */}
          <div className="fixed inset-0 bg-black opacity-70"></div>
          {/* 모달 */}
          <div className="bg-white p-8 rounded-md shadow-lg z-50 w-[24rem] mx-auto">
            <h1 className="mb-8 text-xl font-semibold ">정답입니다!</h1>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 mt-4 text-white transition bg-gray-300 rounded-md hover:bg-gray-400"
                onClick={toggleModal} // 모달 닫기
              >
                닫기
              </button>
              <button
                className="px-4 py-2 mt-4 text-white transition bg-blue-500 rounded-md hover:bg-blue-600"
                onClick={handleBack} // 뒤로가기
              >
                문제 목록으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
