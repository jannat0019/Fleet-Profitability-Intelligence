'use client';

import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowDown,
  ArrowDownUp,
  ArrowUp,
  Bell,
  CarFront,
  ChevronDown,
  CircleDollarSign,
  Download,
  LayoutDashboard,
  Menu,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
  Wallet,
  Wrench,
  X,
} from 'lucide-react';
import MetricCard from '@/components/MetricCard';
import StatusBadge from '@/components/StatusBadge';
import VehicleDetails from '@/components/VehicleDetails';
import FleetInsights from '@/components/FleetInsights';
import { vehicles } from '@/lib/mock-data';
import {
  calculateFleet,
  type VehicleMetrics,
  type VehicleStatus,
} from '@/lib/profitability';
import {
  generateFleetInsights,
  type FleetInsight,
} from '@/lib/insights';
import { money, percent } from '@/lib/formatters';

type SortKey = 'netProfit' | 'revenue' | 'profitMargin';

export default function Home() {
  const fleet = useMemo(() => calculateFleet(vehicles), []);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | VehicleStatus>('All');
  const [sortKey, setSortKey] = useState<SortKey>('netProfit');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedId, setSelectedId] = useState(fleet.vehicles[0]?.id ?? '');
  const [insights, setInsights] = useState<FleetInsight[] | null>(null);
  const [insightsGenerated, setInsightsGenerated] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const filteredVehicles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return fleet.vehicles
      .filter((vehicle) => {
        const matchesSearch =
          !query ||
          [vehicle.name, vehicle.make, vehicle.model, vehicle.id].some((field) =>
            field.toLowerCase().includes(query),
          );

        const matchesStatus =
          statusFilter === 'All' || vehicle.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const aValue = a[sortKey] ?? Number.NEGATIVE_INFINITY;
        const bValue = b[sortKey] ?? Number.NEGATIVE_INFINITY;
        const direction = sortDirection === 'asc' ? 1 : -1;

        return (aValue - bValue) * direction;
      });
  }, [fleet.vehicles, search, statusFilter, sortKey, sortDirection]);

  const selectedVehicle =
    fleet.vehicles.find((vehicle) => vehicle.id === selectedId) ??
    filteredVehicles[0] ??
    fleet.vehicles[0];

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((direction) => (direction === 'desc' ? 'asc' : 'desc'));
      return;
    }

    setSortKey(key);
    setSortDirection('desc');
  }

  function navigateTo(id: string) {
    setMobileNavOpen(false);
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  function generateInsights() {
    setInsights(generateFleetInsights(fleet.vehicles));
    setInsightsGenerated(true);
    navigateTo('insights');
  }

  function exportCsv() {
    const headers = [
      'Vehicle',
      'Identifier',
      'Revenue USD',
      'Operating Costs USD',
      'Net Profit USD',
      'Profit Margin',
      'Utilization',
      'Status',
    ];

    const rows = filteredVehicles.map((vehicle) => [
      vehicle.name,
      vehicle.id,
      vehicle.revenue,
      vehicle.operatingCosts,
      vehicle.netProfit,
      vehicle.profitMargin === null
        ? 'N/A'
        : `${vehicle.profitMargin.toFixed(1)}%`,
      vehicle.utilization === null
        ? 'N/A'
        : `${vehicle.utilization.toFixed(1)}%`,
      vehicle.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(','),
      )
      .join('\n');

    const url = URL.createObjectURL(
      new Blob([csv], { type: 'text/csv;charset=utf-8;' }),
    );
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = 'fleet-profitability-demo.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNavOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">
            <CarFront size={22} />
          </div>
          <div>
            <strong>fleetwise</strong>
            <span>FLEET OPERATIONS</span>
          </div>
          <button
            className="mobile-close icon-button"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <div className="workspace-label">WORKSPACE</div>
        <div className="workspace-switch">
          <div className="workspace-avatar">NF</div>
          <div>
            <strong>Northstar Fleet</strong>
            <span>Fleet management</span>
          </div>
          <ChevronDown size={15} />
        </div>

        <div className="nav-label">ANALYTICS</div>
        <nav className="main-nav" aria-label="Main navigation">
          <button className="nav-item active" onClick={() => navigateTo('overview')}>
            <LayoutDashboard size={18} />
            Overview
          </button>
          <button className="nav-item" onClick={() => navigateTo('vehicles')}>
            <CarFront size={18} />
            Vehicles
            <span className="nav-count">{vehicles.length}</span>
          </button>
          <button className="nav-item" onClick={() => navigateTo('insights')}>
            <Activity size={18} />
            Insights
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">
              <ShieldCheck size={17} />
            </div>
            <strong>Demo workspace</strong>
            <p>Sample figures only. No live fleet data is connected.</p>
            <span className="online-dot" /> Local demo mode
          </div>
          <div className="user-profile">
            <div className="user-avatar">JN</div>
            <div>
              <strong>Jannat Nasir</strong>
              <span>Fleet manager</span>
            </div>
            <ChevronDown size={15} />
          </div>
        </div>
      </aside>

      {mobileNavOpen && (
        <button
          className="mobile-backdrop"
          aria-label="Close navigation overlay"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <main className="main-content">
        <header className="topbar">
          <button
            className="mobile-menu icon-button"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
          <div className="breadcrumbs">
            Analytics <span>/</span> <strong>Profitability</strong>
          </div>
          <div className="topbar-actions">
            <span className="period-chip">
              <span className="period-dot" /> Demo reporting period
            </span>
            <button
              className="icon-button notification-button"
              aria-label="Notifications are not available in this demo"
              title="Notifications are not available in this demo"
            >
              <Bell size={18} />
              <i />
            </button>
            <div className="top-avatar">JN</div>
          </div>
        </header>

        <div className="page-container">
          <section id="overview" className="page-intro">
            <div>
              <div className="page-kicker">
                <span className="kicker-line" /> FLEET PERFORMANCE
              </div>
              <h1>Fleet profitability</h1>
              <p className="page-subtitle">
                A clearer view of what your vehicles earn, what they cost, and where to focus next.
              </p>
            </div>
            <div className="intro-actions">
              <span className="demo-label">
                <span /> Demo data
              </span>
              <button className="button button-secondary" onClick={exportCsv}>
                <Download size={16} />
                Export CSV
              </button>
              <button className="button button-primary" onClick={generateInsights}>
                <Activity size={16} />
                Generate insights
              </button>
            </div>
          </section>

          <div className="demo-notice">
            <div className="notice-icon">
              <ShieldCheck size={17} />
            </div>
            <div>
              <strong>Sample data is not connected to a live fleet</strong>
              <span>Illustrative figures for a single reporting period. All values are in USD.</span>
            </div>
            <span className="notice-period">DEMO PERIOD</span>
          </div>

          <section className="metrics-grid" aria-label="Fleet summary metrics">
            <MetricCard
              label="Rental revenue"
              value={money(fleet.revenue)}
              note="Across all vehicles"
              icon={<Wallet size={19} />}
            />
            <MetricCard
              label="Operating costs"
              value={money(fleet.operatingCosts)}
              note="All operating expenses"
              icon={<Wrench size={19} />}
            />
            <MetricCard
              label="Net fleet profit"
              value={money(fleet.netProfit)}
              note="Revenue minus costs"
              icon={<CircleDollarSign size={19} />}
              tone={fleet.netProfit >= 0 ? 'positive' : 'negative'}
            />
            <MetricCard
              label="Profit margin"
              value={percent(fleet.profitMargin)}
              note="Net profit / revenue"
              icon={<TrendingUp size={19} />}
              tone="positive"
            />
            <MetricCard
              label="Vehicles at a loss"
              value={String(fleet.lossCount)}
              note={`Out of ${fleet.vehicles.length} vehicles`}
              icon={<TrendingDown size={19} />}
              tone={fleet.lossCount > 0 ? 'negative' : 'positive'}
            />
          </section>

          <section id="vehicles" className="panel vehicles-panel">
            <div className="section-heading table-heading">
              <div>
                <p className="eyebrow">FLEET BREAKDOWN</p>
                <h2>
                  Vehicle performance{' '}
                  <span className="heading-count">{filteredVehicles.length}</span>
                </h2>
                <p className="section-description">
                  Compare revenue, costs, and profitability for every vehicle.
                </p>
              </div>
              <button
                className="button button-quiet filter-button"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('All');
                  setSortKey('netProfit');
                  setSortDirection('desc');
                }}
              >
                <SlidersHorizontal size={15} />
                Reset filters
              </button>
            </div>

            <div className="table-controls">
              <label className="search-box">
                <Search size={17} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search vehicle or ID..."
                  aria-label="Search vehicles by name, make, model, or identifier"
                />
                <kbd
                  className="search-shortcut"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    minWidth: 'max-content',
                    lineHeight: 1,
                  }}
                >
                  ⌘ K
                </kbd>
              </label>
              <div className="filter-tabs" role="group" aria-label="Filter by vehicle status">
                {(['All', 'Profitable', 'Review', 'Loss'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={statusFilter === status ? 'filter-tab selected' : 'filter-tab'}
                    aria-pressed={statusFilter === status}
                  >
                    {status}
                    {status === 'All' && <span>{fleet.vehicles.length}</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>VEHICLE</th>
                    <th>IDENTIFIER</th>
                    <th>
                      <button className="sort-button" onClick={() => toggleSort('revenue')}>
                        REVENUE{' '}
                        {sortKey === 'revenue' ? (
                          sortDirection === 'desc' ? <ArrowDown size={12} /> : <ArrowUp size={12} />
                        ) : (
                          <ArrowDownUp size={12} />
                        )}
                      </button>
                    </th>
                    <th>OPERATING COSTS</th>
                    <th>
                      <button className="sort-button" onClick={() => toggleSort('netProfit')}>
                        NET PROFIT{' '}
                        {sortKey === 'netProfit' ? (
                          sortDirection === 'desc' ? <ArrowDown size={12} /> : <ArrowUp size={12} />
                        ) : (
                          <ArrowDownUp size={12} />
                        )}
                      </button>
                    </th>
                    <th>
                      <button className="sort-button" onClick={() => toggleSort('profitMargin')}>
                        MARGIN{' '}
                        {sortKey === 'profitMargin' ? (
                          sortDirection === 'desc' ? <ArrowDown size={12} /> : <ArrowUp size={12} />
                        ) : (
                          <ArrowDownUp size={12} />
                        )}
                      </button>
                    </th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVehicles.map((vehicle) => (
                    <tr
                      key={vehicle.id}
                      onClick={() => setSelectedId(vehicle.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          setSelectedId(vehicle.id);
                        }
                      }}
                      tabIndex={0}
                      aria-selected={selectedVehicle?.id === vehicle.id}
                      className={selectedVehicle?.id === vehicle.id ? 'selected-row' : ''}
                    >
                      <td>
                        <div className="table-vehicle">
                          <div className={`car-icon car-${vehicle.status.toLowerCase()}`}>
                            <CarFront size={18} />
                          </div>
                          <div>
                            <strong>{vehicle.name}</strong>
                            <span>
                              {vehicle.year} · {vehicle.make}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="vehicle-id">{vehicle.id}</span>
                      </td>
                      <td className="numeric-cell">{money(vehicle.revenue)}</td>
                      <td className="numeric-cell">{money(vehicle.operatingCosts)}</td>
                      <td
                        className={`numeric-cell profit-cell ${
                          vehicle.netProfit < 0 ? 'text-negative' : 'text-positive'
                        }`}
                      >
                        {vehicle.netProfit < 0 ? '−' : '+'}
                        {money(Math.abs(vehicle.netProfit))}
                      </td>
                      <td className="numeric-cell margin-cell">
                        {percent(vehicle.profitMargin)}
                      </td>
                      <td>
                        <StatusBadge status={vehicle.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredVehicles.length === 0 && (
                <div className="empty-state">
                  <div>
                    <Search size={21} />
                  </div>
                  <strong>No vehicles found</strong>
                  <p>Try another search term or change the status filter.</p>
                  <button
                    className="button button-secondary"
                    onClick={() => {
                      setSearch('');
                      setStatusFilter('All');
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            <div className="table-footer">
              <span>
                Showing <strong>{filteredVehicles.length}</strong> of{' '}
                <strong>{fleet.vehicles.length}</strong> vehicles
              </span>
              <span className="table-footnote">
                <span /> Values calculated from demo records
              </span>
            </div>
          </section>

          <div className="bottom-grid">
            <VehicleDetails vehicle={selectedVehicle as VehicleMetrics} />
            <FleetInsights insights={insights} generated={insightsGenerated} />
          </div>

          <footer className="page-footer">
            <span>© 2026 Fleetwise Demo</span>
            <span>
              <span className="footer-dot" /> Demo environment{' '}
              <span className="footer-divider">·</span> USD currency
            </span>
            <span>Profitability rules are illustrative, not financial advice.</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
