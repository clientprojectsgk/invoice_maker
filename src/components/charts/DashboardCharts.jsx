import Chart from 'react-apexcharts';

const CHART_BLUE = '#1e6fd9';
const CHART_GRAY = '#9ca3af';

const baseOptions = {
  chart: { toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
  grid: { borderColor: '#f3f4f6', strokeDashArray: 0 },
  tooltip: { theme: 'light' },
};

export function SalesChart({ data }) {
  const options = {
    ...baseOptions,
    chart: { ...baseOptions.chart, type: 'area' },
    colors: [CHART_BLUE, CHART_GRAY],
    stroke: { curve: 'smooth', width: 2 },
    fill: { type: 'solid', opacity: [0.08, 0.05] },
    xaxis: { categories: data.map((d) => d.month), labels: { style: { colors: '#9ca3af', fontSize: '12px' } }, axisBorder: { show: false } },
    yaxis: { labels: { style: { colors: '#9ca3af', fontSize: '12px' }, formatter: (v) => `₹${(v / 1000).toFixed(0)}K` } },
    legend: { position: 'top', horizontalAlign: 'right', fontSize: '12px' },
    dataLabels: { enabled: false },
  };

  return <Chart options={options} series={[{ name: 'Sales', data: data.map((d) => d.sales) }, { name: 'Purchase', data: data.map((d) => d.purchase) }]} type="area" height={300} />;
}

export function InvoiceStatusChart({ invoices }) {
  const statusCounts = {};
  invoices.forEach((inv) => { statusCounts[inv.status] = (statusCounts[inv.status] || 0) + 1; });

  const options = {
    ...baseOptions,
    chart: { ...baseOptions.chart, type: 'donut' },
    colors: ['#9ca3af', CHART_BLUE, '#22c55e', '#eab308', '#ef4444'],
    labels: Object.keys(statusCounts).map((s) => s.charAt(0).toUpperCase() + s.slice(1)),
    legend: { position: 'bottom', fontSize: '12px' },
    plotOptions: { pie: { donut: { size: '65%' } } },
    dataLabels: { enabled: false },
  };

  return <Chart options={options} series={Object.values(statusCounts)} type="donut" height={260} />;
}

export function ProductSalesChart({ data }) {
  const options = {
    ...baseOptions,
    chart: { ...baseOptions.chart, type: 'bar' },
    colors: [CHART_BLUE],
    plotOptions: { bar: { borderRadius: 4, horizontal: true, barHeight: '55%' } },
    xaxis: { categories: data.map((d) => d.name), labels: { style: { colors: '#9ca3af', fontSize: '11px' } } },
    yaxis: { labels: { formatter: (v) => `₹${(v / 1000).toFixed(0)}K`, style: { colors: '#9ca3af', fontSize: '12px' } } },
    dataLabels: { enabled: false },
  };

  return <Chart options={options} series={[{ name: 'Sales', data: data.map((d) => d.sales) }]} type="bar" height={300} />;
}

export function RevenueChart({ data }) {
  const options = {
    ...baseOptions,
    chart: { ...baseOptions.chart, type: 'line' },
    colors: [CHART_BLUE],
    stroke: { curve: 'smooth', width: 2 },
    xaxis: { categories: data.map((d) => d.month), labels: { style: { colors: '#9ca3af' } }, axisBorder: { show: false } },
    yaxis: { labels: { formatter: (v) => `₹${(v / 1000).toFixed(0)}K`, style: { colors: '#9ca3af' } } },
    markers: { size: 3 },
    dataLabels: { enabled: false },
  };

  return <Chart options={options} series={[{ name: 'Revenue', data: data.map((d) => d.sales) }]} type="line" height={260} />;
}
