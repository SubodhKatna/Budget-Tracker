import { PiggyBank } from 'lucide-react';
import React from 'react';

function Logo() {
  return (
    <a href="/" className="flex items-center gap-2">
      <PiggyBank className="stroke h-11 w-11 stroke-amber-500 stroke-1.5" />
      <p className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-3xl font-bold leading-tight tracking-tight text-transparent">
        Track my Cash
      </p>
    </a>
  );
}

export function LogoMobile() {
  return (
    <a href="/" className="flex items-center gap-2">
      <p
        className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent font-bold leading-tight tracking-tight 
                 text-xl sm:text-2xl md:text-3xl lg:text-4xl"
      >
        Track my Cash
      </p>
    </a>
  );
}

export default Logo;
