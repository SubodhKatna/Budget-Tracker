'use client';

import React, { useMemo, useState } from 'react';
import { UserSettings } from '@prisma/client';
import { Period, Timeframe } from '@/lib/types';
import { GetFormatterForCurrency } from '@/lib/helper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import HistoryPeriodSelector from './HistoryPeriodSelector';
import { useQuery } from '@tanstack/react-query';
import SkeletonWrapper from '@/components/SkeletonWrapper';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { cn } from '@/lib/utils';

interface HistoryDataItem {
  income: number;
  expense: number;
  year: number;
  month: number;
  day?: number;
  date?: string;
}

function History({ userSettings }: { userSettings: UserSettings }) {
  const [timeframe, setTimeframe] = useState<Timeframe>('month');
  const [period, setPeriod] = useState<Period>({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const { data, isLoading, isError } = useQuery<HistoryDataItem[]>({
    queryKey: ['overview', 'history', timeframe, period],
    queryFn: async () => {
      const response = await fetch(
        `/api/history-data?timeframe=${timeframe}&year=${period.year}&month=${period.month}`
      );
      if (!response.ok) throw new Error('Failed to fetch history data');
      return response.json();
    },
  });

  const chartData = useMemo(() => {
    if (!data) return [];
    return data.map((item) => ({
      ...item,
      income: item.income || 0,
      expense: item.expense || 0,
      date: item.date || new Date(item.year, item.month, item.day || 1).toISOString(),
    }));
  }, [data]);

  const dataAvailable = chartData && chartData.length > 0;

  if (isError) return <div>Error loading data</div>;

  return (
    <div className="w-full px-6">
      <h2 className="mt-12 px-6 text-3xl font-bold">History</h2>
      <Card className="col-span-12 mt-2 w-full">
        <CardHeader className="gap-2">
          <CardTitle className="grid grid-flow-row justify-between gap-2 md:grid-flow-col">
            <HistoryPeriodSelector
              period={period}
              setPeriod={setPeriod}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
            />
            <div className="flex h-10 gap-2">
              <Badge variant="outline" className="flex items-center gap-2 text-sm">
                <div className="h-4 w-4 rounded-full bg-emerald-500" />
                Income
              </Badge>
              <Badge variant="outline" className="flex items-center gap-2 text-sm">
                <div className="h-4 w-4 rounded-full bg-red-500" />
                Expense
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SkeletonWrapper isLoading={isLoading}>
            {dataAvailable ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} vertical={false} />
                  <XAxis
                    dataKey={(data) => {
                      const date = new Date(data.date ?? new Date());
                      if (timeframe === 'year') {
                        return date.toLocaleDateString('default', { month: 'short' });
                      }
                      return date.toLocaleDateString('default', { day: 'numeric' });
                    }}
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    content={<CustomTooltip formatter={formatter} timeframe={timeframe} />}
                    cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                  />
                  <Bar dataKey="income" name="Income" fill="#10b981" radius={4} />
                  <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] flex-col items-center justify-center">
                <p>No data available for the selected period</p>
                <p className="text-sm text-muted-foreground">
                  Try selecting a different period or adding new transactions.
                </p>
              </div>
            )}
          </SkeletonWrapper>
        </CardContent>
      </Card>
    </div>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    payload: HistoryDataItem;
  }[];
  formatter: Intl.NumberFormat;
  timeframe: Timeframe;
}

function CustomTooltip({ active, payload, formatter, timeframe }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  const hasTransactions = data.income > 0 || data.expense > 0;
  const date = new Date(data.date ?? new Date());

  let periodName = '';
  if (timeframe === 'year') {
    periodName = `${date.toLocaleDateString('default', { month: 'long' })} ${date.getFullYear()}`;
  } else {
    periodName = date.toLocaleDateString('default', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  return (
    <div className="rounded-lg border bg-white p-6 shadow-xl dark:bg-gray-800 min-w-[350px]">
      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">{periodName}</h3>
      {hasTransactions ? (
        <div className="space-y-3">
          <TooltipRow
            label="Income"
            value={data.income}
            color="text-emerald-500"
            formatter={formatter}
          />
          <TooltipRow
            label="Expense"
            value={data.expense}
            color="text-red-500"
            formatter={formatter}
          />
          <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Net Total
              </span>
              <span
                className={cn(
                  'text-sm font-bold',
                  data.income - data.expense >= 0 ? 'text-emerald-500' : 'text-red-500'
                )}
              >
                {formatter.format(data.income - data.expense)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          No transactions in this period
        </div>
      )}
    </div>
  );
}

interface TooltipRowProps {
  label: string;
  value: number;
  color: string;
  formatter: Intl.NumberFormat;
}

function TooltipRow({ label, value, color, formatter }: TooltipRowProps) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2">
        <div className={cn('h-4 w-4 rounded-full', color.replace('text', 'bg'))} />
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
      </div>
      <span className={cn('text-sm font-bold', color)}>{formatter.format(value)}</span>
    </div>
  );
}

export default History;
