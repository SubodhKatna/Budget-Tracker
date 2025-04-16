'use client';

import { getCategoriesStatsResponseType } from '@/app/api/stats/categories/route';
import SkeletonWrapper from '@/components/SkeletonWrapper';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DateToUTCDate, GetFormatterForCurrency } from '@/lib/helper';
import { TransactionType } from '@/lib/types';
import { UserSettings } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react';

interface Props {
  userSettings: UserSettings;
  from: Date;
  to: Date;
}

function CategoriesStats({ userSettings, from, to }: Props) {
  const statsQuery = useQuery<getCategoriesStatsResponseType>({
    queryKey: ['overview', 'stats', 'categories', from, to],
    queryFn: () =>
      fetch(`/api/stats/categories?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`).then(
        (res) => res.json()
      ),
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  return (
    <div className="flex w-full flex-col space-y-4 px-4 py-2 md:flex-row md:space-x-4 md:space-y-0">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard formatter={formatter} type="income" data={statsQuery.data || []} />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard formatter={formatter} type="expense" data={statsQuery.data || []} />
      </SkeletonWrapper>
    </div>
  );
}

export default CategoriesStats;

function CategoriesCard({
  data,
  type,
  formatter,
}: {
  type: TransactionType;
  formatter: Intl.NumberFormat;
  data: getCategoriesStatsResponseType;
}) {
  const filteredData = data.filter((el) => el.type === type);
  const total = filteredData.reduce((acc, el) => acc + (el._sum?.amount || 0), 0);

  return (
    <Card className="h-60 w-full bg-muted/50">
      <CardHeader>
        <CardTitle className="text-muted-foreground">
          {type === 'income' ? 'Incomes' : 'Expenses'} by category
        </CardTitle>
      </CardHeader>

      <div className="h-[calc(100%-3.5rem)] px-4 pb-4">
        {filteredData.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-center">
            <p className="text-sm font-medium">No data available</p>
            <p className="text-xs text-muted-foreground">
              Try selecting a different period or add new{' '}
              {type === 'income' ? 'incomes' : 'expenses'}
            </p>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-4 pr-4">
              {filteredData.map((item) => {
                const amount = item._sum.amount || 0;
                const percentage = (amount * 100) / (total || amount);

                return (
                  <div key={item.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        <span className="mr-2">{item.categoryIcon}</span>
                        <span>{item.category}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <span className="text-sm">{formatter.format(amount)}</span>
                    </div>
                    <Progress
                      value={percentage}
                      indicator={type === 'income' ? 'bg-emerald-500' : 'bg-red-500'}
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
}
