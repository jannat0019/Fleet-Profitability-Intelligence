import type { VehicleMetrics } from './profitability';

export type FleetInsight = {
  title: string; finding: string; evidence: string[]; suggestion: string;
  tone: 'positive' | 'warning' | 'negative' | 'neutral';
};
const money = (n: number) => new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', maximumFractionDigits: 0,
}).format(n);
const categories = [
  { name: 'maintenance', get: (v: VehicleMetrics) => v.maintenanceCost },
  { name: 'insurance', get: (v: VehicleMetrics) => v.insuranceCost },
  { name: 'cleaning', get: (v: VehicleMetrics) => v.cleaningCost },
  { name: 'other expenses', get: (v: VehicleMetrics) => v.otherCosts },
];
function largestCategory(v: VehicleMetrics) {
  return categories.map(c => ({ name: c.name, amount: c.get(v) })).sort((a,b) => b.amount-a.amount)[0];
}
export function generateFleetInsights(vehicles: VehicleMetrics[]): FleetInsight[] {
  if (!vehicles.length) return [{
    title: 'No vehicle data', finding: 'There are no vehicle records to analyze.',
    evidence: [], suggestion: 'Add demo vehicle records before generating fleet insights.', tone: 'neutral',
  }];
  const results: FleetInsight[] = [];
  const losses = vehicles.filter(v => v.netProfit < 0).sort((a,b) => a.netProfit-b.netProfit);
  if (!losses.length) {
    results.push({
      title: 'No loss-making vehicles', finding: 'Every vehicle has non-negative net profit in this demo period.',
      evidence: ['Vehicles analyzed: ' + vehicles.length, 'Loss-making vehicles: 0'],
      suggestion: 'Continue monitoring the calculated results in future reporting periods.', tone: 'positive',
    });
  } else {
    const v = losses[0], category = largestCategory(v);
    const share = v.operatingCosts > 0 ? ' (' + (category.amount / v.operatingCosts * 100).toFixed(1) + '% of costs)' : '';
    results.push({
      title: losses.length + ' vehicle' + (losses.length === 1 ? '' : 's') + ' operating at a loss',
      finding: v.name + ' (' + v.id + ') has the largest calculated loss.',
      evidence: ['Revenue: ' + money(v.revenue), 'Operating costs: ' + money(v.operatingCosts),
        'Net loss: ' + money(v.netProfit), 'Largest expense: ' + category.name + ' at ' + money(category.amount) + share],
      suggestion: 'Review the ' + category.name + ' records for this vehicle. This is an investigation prompt, not a proven cause.',
      tone: 'negative',
    });
  }
  const reviews = vehicles.filter(v => v.status === 'Review')
    .sort((a,b) => (a.profitMargin ?? -Infinity) - (b.profitMargin ?? -Infinity));
  if (reviews.length) {
    const v = reviews[0];
    results.push({
      title: reviews.length + ' vehicle' + (reviews.length === 1 ? '' : 's') + ' marked for review',
      finding: v.name + ' (' + v.id + ') has the lowest margin among vehicles in Review.',
      evidence: [v.profitMargin === null ? 'Profit margin: unavailable because revenue is $0' : 'Profit margin: ' + v.profitMargin.toFixed(1) + '%',
        'Net profit: ' + money(v.netProfit), 'Illustrative review threshold: 20%',
        'Utilization: ' + (v.utilization === null ? 'unavailable' : v.utilization.toFixed(1) + '%')],
      suggestion: 'Check the revenue and cost records, then compare utilization with similar vehicles. The 20% threshold is illustrative.',
      tone: 'warning',
    });
  }
  const highest = [...vehicles].sort((a,b) => b.operatingCosts-a.operatingCosts)[0];
  const category = largestCategory(highest);
  const avg = vehicles.reduce((sum,v) => sum+v.operatingCosts,0) / vehicles.length;
  const share = highest.operatingCosts > 0 ? ' (' + (category.amount / highest.operatingCosts * 100).toFixed(1) + '% of this vehicle costs)' : '';
  results.push({
    title: 'Highest operating costs',
    finding: highest.name + ' (' + highest.id + ') has the highest operating costs in this fleet.',
    evidence: ['Operating costs: ' + money(highest.operatingCosts), 'Fleet average: ' + money(avg),
      'Largest category: ' + category.name + ' at ' + money(category.amount) + share],
    suggestion: 'Compare the ' + category.name + ' records with similar vehicles. Higher costs alone do not establish that a charge is abnormal.',
    tone: 'neutral',
  });
  return results;
}
