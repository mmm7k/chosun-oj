import SideNav from '@/components/layout/tutor/SideNav';
import ReactQueryProvider from '@/lib/ReactQueryProvider';

export default function ProfessorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryProvider>
      {/* <div className="bg-[#f0f4fc] flex flex-col md:flex-row min-w-screen md:min-h-screen"> */}
      <div className="bg-[#f0f4fc] flex flex-col min-w-screen ">
        <SideNav />
        {/* <main className="w-full md:pl-52">{children}</main> */}
        <main className="w-full">{children}</main>
      </div>
    </ReactQueryProvider>
  );
}
