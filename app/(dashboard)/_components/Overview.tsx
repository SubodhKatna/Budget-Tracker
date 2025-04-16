'use client';

import { DateRangePicker } from '@/components/ui/date-range-picker';
import { MAX_DATE_RANGE_DAYS } from '@/lib/constant';
import { UserSettings } from '@prisma/client';
import { differenceInDays, startOfMonth } from 'date-fns';
import React, { useState } from 'react';
import { toast } from 'sonner';
import StatsCards from '@/app/(dashboard)/_components/StatsCards'; // Adjust the path as needed
import CategoriesStats from './CategoriesStats';

function Overview({ userSettings }: { userSettings: UserSettings }) {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  return (
    <>
      <div className="w-full flex flex-wrap justify-between items-end gap-4 px-15 py-3">
        <h2 className="text-3xl font-bold">Overview</h2>
        <div className="flex items-center gap-1">
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            showCompare={false}
            onUpdate={(values) => {
              const { from, to } = values.range;

              if (!from || !to) return;
              if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                toast.error(
                  `the selected date range is too big. Maz allowed range is ${MAX_DATE_RANGE_DAYS} days!`
                );
                return;
              }
              setDateRange({ from, to });
            }}
          />
        </div>
      </div>
      <div className=" flex w-full flex-col gap-2 py-2">
        <StatsCards userSettings={userSettings} from={dateRange.from} to={dateRange.to} />

        <CategoriesStats userSettings={userSettings} from={dateRange.from} to={dateRange.to} />
      </div>
    </>
  );
}

export default Overview;
