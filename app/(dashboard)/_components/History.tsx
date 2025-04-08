"use client";

import React, { useMemo, useState } from 'react';
import { UserSettings } from '@prisma/client';
import { Period, Timeframe } from '@/lib/types';
import { GetFormatterForCurrency } from '@/lib/helper';

function History({userSettings}:{userSettings: UserSettings}) {
    const [timeframe, setTimeframe] = useState<Timeframe>("month");
    const [period, setPeriod] = useState<Period>({
        month: new Date().getMonth(),
        year: new Date().getFullYear()
    });

    const formatter = useMemo(() => {
        return GetFormatterForCurrency(userSettings.currency);
    }, [userSettings.currency])
  return (
    <div className='container'>
        <h2 className='mt-12 text-3xl font-bold'>History</h2>
    </div>
  )
}

export default History