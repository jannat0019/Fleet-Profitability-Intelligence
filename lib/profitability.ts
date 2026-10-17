import type { Vehicle } from './mock-data';

export type VehicleStatus = 'Profitable' | 'Review' | 'Loss';
export type VehicleMetrics = Vehicle & {
  operatingCosts: number;
  netProfit: number;
  profitMargin: number | null;
  utilization: number | null;
  status: VehicleStatus;
};

export function calculateVehicle(vehicle: Vehicle, reviewThreshold = 20): VehicleMetrics {
  const costs = [vehicle.maintenanceCost, vehicle.insuranceCost, vehicle.cleaningCost, vehicle.otherCosts]
    .reduce((sum, value) => sum + (Number.isFinite(value) ? value : 0), 0);
  const revenue = Number.isFinite(vehicle.revenue) ? vehicle.revenue : 0;
  const netProfit = revenue - costs;
  const profitMargin = revenue > 0 ? (netProfit / revenue) * 100 : null;
  const utilization = vehicle.availableDays > 0 ? (vehicle.rentalDays / vehicle.availableDays) * 100 : null;
  const status: VehicleStatus = netProfit < 0 ? 'Loss' : profitMargin === null || profitMargin < reviewThreshold ? 'Review' : 'Profitable';
  return { ...vehicle, revenue, operatingCosts: costs, netProfit, profitMargin, utilization, status };
}

export function calculateFleet(vehicles: Vehicle[]) {
  const calculated = vehicles.map((vehicle) => calculateVehicle(vehicle));
  const revenue = calculated.reduce((sum, vehicle) => sum + vehicle.revenue, 0);
  const operatingCosts = calculated.reduce((sum, vehicle) => sum + vehicle.operatingCosts, 0);
  const netProfit = revenue - operatingCosts;
  return {
    vehicles: calculated,
    revenue,
    operatingCosts,
    netProfit,
    profitMargin: revenue > 0 ? (netProfit / revenue) * 100 : null,
    lossCount: calculated.filter((vehicle) => vehicle.netProfit < 0).length,
  };
}
