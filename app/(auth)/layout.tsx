import Logo from '@/components/Logo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  // const notUsing = 1;
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center">
      <Logo />
      <div className="mt-12">{children}</div>
    </div>
  );
}
