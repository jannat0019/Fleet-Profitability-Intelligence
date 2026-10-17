
import type { ReactNode } from 'react';

type MetricCardProps = {
  label: string;
  value: string;
  note: string;
  icon: ReactNode;
  tone?: 'default' | 'positive' | 'negative';
};

export default function MetricCard({
  label,
  value,
  note,
  icon,
  tone = 'default',
}: MetricCardProps) {
  return (
    <article className="metric-card">
      <div className="metric-top">
        <span className="metric-label">{label}</span>

        <span className={`metric-icon metric-${tone}`}>
          {icon}
        </span>
      </div>

      <div className="metric-value">{value}</div>

      <div className="metric-note">{note}</div>
    </article>
  );
}
