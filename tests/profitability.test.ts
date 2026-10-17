import { describe, expect, it } from 'vitest';
import { calculateFleet, calculateVehicle } from '../lib/profitability';
import { generateFleetInsights } from '../lib/insights';
import type { Vehicle } from '../lib/mock-data';

const baseVehicle = (overrides: Partial<Vehicle> = {}): Vehicle => ({
  id: 'TEST-1', name: 'Test Vehicle', make: 'Test', model: 'Model', year: 2024,
  revenue: 2000, maintenanceCost: 500, insuranceCost: 250, cleaningCost: 100, otherCosts: 150,
  rentalDays: 20, availableDays: 30, ...overrides,
});

describe('vehicle profitability calculations', () => {
  it('calculates $1,000 profit and 50% margin for $2,000 revenue and $1,000 costs', () => {
    const result = calculateVehicle(baseVehicle());
    expect(result.operatingCosts).toBe(1000);
    expect(result.netProfit).toBe(1000);
    expect(result.profitMargin).toBe(50);
    expect(result.status).toBe('Profitable');
  });
  it('calculates a $200 loss and -20% margin', () => {
    const result = calculateVehicle(baseVehicle({ revenue: 1000, maintenanceCost: 700, insuranceCost: 200, cleaningCost: 100, otherCosts: 200 }));
    expect(result.netProfit).toBe(-200);
    expect(result.profitMargin).toBe(-20);
    expect(result.status).toBe('Loss');
  });
  it('handles zero revenue without NaN or Infinity and classifies non-loss as Review', () => {
    const result = calculateVehicle(baseVehicle({ revenue: 0, maintenanceCost: 0, insuranceCost: 0, cleaningCost: 0, otherCosts: 0 }));
    expect(result.profitMargin).toBeNull();
    expect(result.status).toBe('Review');
    expect(Number.isFinite(result.netProfit)).toBe(true);
  });
  it('classifies non-negative profit below 20% margin as Review', () => {
    expect(calculateVehicle(baseVehicle({ revenue: 2000, maintenanceCost: 1000, insuranceCost: 300, cleaningCost: 100, otherCosts: 300 })).status).toBe('Review');
  });
  it('classifies margin of exactly 20% as Profitable', () => {
    expect(calculateVehicle(baseVehicle({ revenue: 2000, maintenanceCost: 900, insuranceCost: 300, cleaningCost: 100, otherCosts: 300 })).status).toBe('Profitable');
  });
  it('returns null utilization when available days is zero', () => {
    expect(calculateVehicle(baseVehicle({ availableDays: 0 })).utilization).toBeNull();
  });
  it('fleet totals equal the sum of individual vehicle metrics', () => {
    const data = [baseVehicle(), baseVehicle({ id: 'TEST-2', revenue: 1000, maintenanceCost: 900 })];
    const result = calculateFleet(data);
    expect(result.revenue).toBe(result.vehicles.reduce((sum, v) => sum + v.revenue, 0));
    expect(result.operatingCosts).toBe(result.vehicles.reduce((sum, v) => sum + v.operatingCosts, 0));
    expect(result.netProfit).toBe(result.revenue - result.operatingCosts);
    expect(result.lossCount).toBe(result.vehicles.filter((v) => v.netProfit < 0).length);
  });
  it('does not invent a loss when all vehicles are profitable', () => {
    const result = calculateFleet([baseVehicle()]);
    const insights = generateFleetInsights(result.vehicles);
    expect(insights[0].title).toBe('No loss-making vehicles');
  });
  it('handles an empty insight dataset', () => {
    expect(generateFleetInsights([])[0].title).toBe('No vehicle data');
  });
});

  it('includes calculated evidence and largest expense category for a loss', () => {
    const vehicle = calculateVehicle(baseVehicle({ name: 'Loss Van', revenue: 1000, maintenanceCost: 700, insuranceCost: 200, cleaningCost: 100, otherCosts: 200 }));
    const insight = generateFleetInsights([vehicle])[0];
    expect(insight.evidence).toContain('Revenue: $1,000');
    expect(insight.evidence).toContain('Operating costs: $1,200');
    expect(insight.evidence).toContain('Net loss: -$200');
    expect(insight.evidence.some((item) => item.includes('maintenance at $700'))).toBe(true);
  });


