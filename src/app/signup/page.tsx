import { Checkbox } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
export default function Home() {
  return (
    <>
      <div className="w-screen h-[100dvh] flex ">
        {/* left */}
        <section className="items-center justify-center flex-1 hidden lg:flex bg-primary">
          <div className="relative w-1/3 h-2/5">
            <Image
              src="/commons/logo.png"
              alt="Chosun Online Judge"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </section>
        {/* right */}
        <section className="flex items-center justify-center flex-1 ">
          <div className="w-[70%] h-[70%] lg:w-1/2 lg:h-1/2  space-y-4 rounded-sm border-solid border-[1px] border-slate-200 shadow-xl flex flex-col justify-center items-center">
            <span className="text-2xl text-secondary sm:text-3xl md:text-4xl lg:text-2xl">
              회원가입
            </span>
            <input
              className="w-3/4 h-8 md:h-16 lg:h-10  rounded-md  border-[1px] border-slate-200 pl-4  placeholder:text-sm md:placeholder:text-lg lg:placeholder:text-sm focus:ring-1 focus:ring-gray-200 focus:outline-none"
              type="text"
              placeholder="학번을 입력해주세요"
            />
            <input
              className="w-3/4 h-8 md:h-16 lg:h-10  rounded-md  border-[1px] border-slate-200 pl-4  placeholder:text-sm md:placeholder:text-lg lg:placeholder:text-sm focus:ring-1 focus:ring-gray-200 focus:outline-none"
              type="password"
              placeholder="비밀번호를 입력해주세요"
            />
            <input
              className="w-3/4 h-8 md:h-16 lg:h-10  rounded-md  border-[1px] border-slate-200 pl-4  placeholder:text-sm md:placeholder:text-lg lg:placeholder:text-sm focus:ring-1 focus:ring-gray-200 focus:outline-none"
              type="password"
              placeholder="다시 한번 비밀번호를 입력해주세요"
            />

            <div className="flex items-center justify-center w-3/4 py-2 text-white transition rounded-md cursor-pointer md:py-5 lg:py-2 bg-primary hover:bg-primaryButtonHover">
              회원가입
            </div>
            <Link
              href="/"
              className="w-3/4 py-2  md:py-5 lg:py-2  rounded-md bg-secondaryButton border-[1px] border-secondaryButtonBorder text-secondary flex items-center justify-center cursor-pointer hover:bg-secondaryButtonHover transition"
            >
              이전으로
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
