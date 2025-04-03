import React, { ReactNode } from 'react'
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';

function SkeletonWrapper({
    children,
    isLoading,
    fullwidth = true,
} : {
    children: ReactNode;
    isLoading: boolean;
    fullwidth?: boolean;
}) {
    if(!isLoading) return children;
  return (
    <Skeleton className ={cn(fullwidth && "w-full")}>
        <div className="opacity-0">{children}</div>
    </Skeleton>
  )
}

export default SkeletonWrapper
