'use client';

import LandingPage from './landing/page';
import SigninPage from './signin/page';
import SignupPage from './signup/page';
import { usePathname } from 'next/navigation';

const Page = () => {
  const pathname = usePathname();
    if (pathname == '/signup') {
      return <LandingPage />;
    }
    if (pathname == '/signin') {
      return <SigninPage />;
    }
  
    return <SignupPage />;
   
};

export default Page;
