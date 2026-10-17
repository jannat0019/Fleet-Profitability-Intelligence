
import type { VehicleStatus } from '@/lib/profitability';

type StatusBadgeProps = {
  status: VehicleStatus;
};

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  const symbol =
    status === 'Profitable'
      ? '✓'
      : status === 'Review'
        ? '!'
        : '−';

  return (
    <span className={`status-badge status-${status.toLowerCase()}`}>
      <span aria-hidden="true">{symbol}</span>
      {status}
    </span>
  );
}
