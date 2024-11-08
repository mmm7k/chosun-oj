import Footer from '@/components/layout/student/Footer';
import HeaderNav from '@/components/layout/student/HeaderNav';
import ScrollToTopButton from '@/components/layout/student/ScrollToTopButton';
import ReactQueryProvider from '@/lib/ReactQueryProvider';

export default function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryProvider>
      <div className="flex flex-col min-w-screen overflow-hidden min-h-[100dvh]">
        <HeaderNav />
        <main className="flex-1">{children}</main>
        <Footer />
        <ScrollToTopButton />
      </div>
    </ReactQueryProvider>
  );
}
