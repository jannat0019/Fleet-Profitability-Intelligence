
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Wrench,
} from 'lucide-react';

import type { VehicleMetrics } from '@/lib/profitability';
import { money, percent } from '@/lib/formatters';

import StatusBadge from './StatusBadge';

type VehicleDetailsProps = {
  vehicle: VehicleMetrics;
};

export default function VehicleDetails({
  vehicle,
}: VehicleDetailsProps) {
  const expenses = [
    {
      label: 'Maintenance',
      value: vehicle.maintenanceCost,
      color: 'expense-blue',
    },
    {
      label: 'Insurance',
      value: vehicle.insuranceCost,
      color: 'expense-purple',
    },
    {
      label: 'Cleaning',
      value: vehicle.cleaningCost,
      color: 'expense-teal',
    },
    {
      label: 'Other expenses',
      value: vehicle.otherCosts,
      color: 'expense-orange',
    },
  ];

  const suggestion =
    vehicle.status === 'Loss'
      ? 'Start with maintenance and other expenses. Check whether recent repairs are recurring and whether the vehicle is priced appropriately for its usage.'
      : vehicle.status === 'Review'
        ? 'Review utilization and controllable expenses. Compare the vehicle with similar models before making pricing or operating changes.'
        : 'This vehicle is performing well in the demo period. Monitor its expense mix and use it as a comparison point for similar vehicles.';

  return (
    <section
      className="panel details-panel"
      id="vehicle-details"
      aria-labelledby="details-heading"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">VEHICLE BREAKDOWN</p>
          <h2 id="details-heading">Selected vehicle</h2>
        </div>

        <span className="detail-icon">
          <Activity size={18} />
        </span>
      </div>

      <div className="vehicle-identity">
        <div className="vehicle-avatar">
          {vehicle.make.slice(0, 1)}
          <span>{vehicle.model.slice(0, 1)}</span>
        </div>

        <div className="identity-copy">
          <h3>{vehicle.name}</h3>
          <p>
            {vehicle.year} · {vehicle.id}
          </p>
        </div>

        <StatusBadge status={vehicle.status} />
      </div>

      <div className="detail-kpis">
        <div>
          <span>Net profit</span>
          <strong
            className={
              vehicle.netProfit < 0
                ? 'text-negative'
                : 'text-positive'
            }
          >
            {money(vehicle.netProfit)}
          </strong>
        </div>

        <div>
          <span>Profit margin</span>
          <strong>{percent(vehicle.profitMargin)}</strong>
        </div>

        <div>
          <span>Utilization</span>
          <strong>{percent(vehicle.utilization)}</strong>
        </div>
      </div>

      <div className="expense-section">
        <div className="subsection-title">
          <h3>Operating expenses</h3>
          <span>{money(vehicle.operatingCosts)} total</span>
        </div>

        {expenses.map((expense) => (
          <div className="expense-row" key={expense.label}>
            <div className="expense-label">
              <span className={`expense-dot ${expense.color}`} />
              {expense.label}
            </div>

            <strong>{money(expense.value)}</strong>

            <div className="expense-track">
              <span
                className={expense.color}
                style={{
                  width: `${
                    vehicle.operatingCosts > 0
                      ? Math.max(
                          0,
                          Math.min(
                            100,
                            (expense.value / vehicle.operatingCosts) * 100,
                          ),
                        )
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="revenue-cost-row">
        <div>
          <span>Rental revenue</span>
          <strong className="text-positive">
            <ArrowUpRight size={15} />
            {money(vehicle.revenue)}
          </strong>
        </div>

        <div>
          <span>Operating costs</span>
          <strong className="text-negative">
            <ArrowDownRight size={15} />
            {money(vehicle.operatingCosts)}
          </strong>
        </div>
      </div>

      <div className="recommendation">
        <div className="recommendation-heading">
          <Wrench size={16} />
          <strong>What to investigate</strong>
        </div>

        <p>{suggestion}</p>

        <small>
          Suggestions are based on the figures shown, not guaranteed
          financial outcomes.
        </small>
      </div>
    </section>
  );
}
