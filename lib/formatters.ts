export const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
export const percent = (value: number | null) => value === null || !Number.isFinite(value) ? 'N/A' : `${value.toFixed(1)}%`;
