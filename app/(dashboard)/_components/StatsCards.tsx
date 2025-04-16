'use client';

import { GetBalanceeStatsResponseType } from '@/app/api/stats/balance/route';
import SkeletonWrapper from '@/components/SkeletonWrapper';
import { DateToUTCDate, GetFormatterForCurrency } from '@/lib/helper';
import { UserSettings } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import React, { useMemo, ReactNode, useCallback } from 'react';
import CountUp from 'react-countup';

interface Props {
  from: Date;
  to: Date;
  userSettings: UserSettings;
}

function StatsCards({ from, to, userSettings }: Props) {
  const statsQuery = useQuery<GetBalanceeStatsResponseType>({
    queryKey: ['overview', 'stats', from, to],
    queryFn: () =>
      fetch(
        `/api/stats/balance?from=${DateToUTCDate(
          from
        ).toISOString()}&to=${DateToUTCDate(to).toISOString()}`
      ).then((res) => res.json()),
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expense || 0;
  const balance = income - expense;

  return (
    <div className="relative flex w-full flex-wrap px-4  md:flex-nowrap gap-2">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <div
          className={`w-full rounded-xl transition-colors duration-300 ${
            statsQuery.isFetching ? '' : 'bg-muted/50'
          }`}
        >
          <StatCard
            formatter={formatter}
            value={income}
            title="Income"
            icon={
              <div className="h-12 w-12 !bg-emerald-400/10 !text-emerald-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-12 w-12" />
              </div>
            }
          />
        </div>
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <div
          className={`w-full rounded-xl transition-colors duration-300 ${
            statsQuery.isFetching ? '' : 'bg-muted/50'
          }`}
        >
          <StatCard
            formatter={formatter}
            value={expense}
            title="Expense"
            icon={
              <div className="h-12 w-12 !bg-red-400/10 !text-red-500 rounded-lg flex items-center justify-center">
                <TrendingDown className="h-12 w-12" />
              </div>
            }
          />
        </div>
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <div
          className={`w-full rounded-xl transition-colors duration-300 ${
            statsQuery.isFetching ? '' : 'bg-muted/50'
          }`}
        >
          <StatCard
            formatter={formatter}
            value={balance}
            title="Balance"
            icon={
              <div className="h-12 w-12 !bg-violet-400/10 !text-violet-500 rounded-lg flex items-center justify-center">
                <Wallet className="h-12 w-12" />
              </div>
            }
          />
        </div>
      </SkeletonWrapper>
    </div>
  );
}

export default StatsCards;

function StatCard({
  formatter,
  value,
  title,
  icon,
}: {
  formatter: Intl.NumberFormat;
  icon: ReactNode;
  title: string;
  value: number;
}) {
  const formatFn = useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter]
  );

  return (
    <div className="flex items-start gap-4 w-full p-4">
      <div className="flex items-center justify-center h-12 w-12 rounded-lg">{icon}</div>
      {/* demo comment */}
      <div className="flex flex-col">
        <p className="text-sm text-muted-foreground">{title}</p>
        <CountUp
          preserveValue
          redraw={false}
          end={value}
          decimals={2}
          formattingFn={formatFn}
          className="text-xl font-semibold"
        />
      </div>
    </div>
  );
}
