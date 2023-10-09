import Footer from '@/components/partials/footer';
import Nav from '@/components/partials/nav';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen h-full w-full flex flex-col">
      <Nav />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
