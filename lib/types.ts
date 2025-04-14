export type TransactionType = "income" | "expense";
export type Timeframe = "year" | "month" | "week" | "day";
export type Period = {
    year: number;
    month?: number;
    week?: number;
    day?: number;
  };