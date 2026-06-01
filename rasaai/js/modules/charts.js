/*
 * Filename: charts.js
 * Path: /js/modules/charts.js
 * Project: RASAAI - Auto Rickshaw Advertising Network
 * Description: Canvas API chart rendering - Bar, Line, Pie, Doughnut charts
 * Type: Module JavaScript
 */

// ============================================
// CHART STATE
// ============================================

const ChartState = {
    charts: {},
    colors: CHART_COLORS.PALETTE,
    lightColors: CHART_COLORS.PALETTE_LIGHT
};

// ============================================
// CANVAS CHART CLASS
// ============================================

class CanvasChart {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`Canvas not found: ${canvasId}`);
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        this.options = {
            padding: 40,
            fontFamily: 'Inter, sans-serif',
            fontSize: 11,
            titleFontSize: 14,
            ...options
        };
        this.width = this.canvas.width || this.canvas.offsetWidth;
        this.height = this.canvas.height || this.canvas.offsetHeight;
        
        // Store reference
        ChartState.charts[canvasId] = this;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    drawTitle(title) {
        this.ctx.fillStyle = '#221F60';
        this.ctx.font = `bold ${this.options.titleFontSize}px ${this.options.fontFamily}`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(title, this.width / 2, 25);
    }

    drawNoData(message = 'No data available') {
        this.ctx.fillStyle = '#ADB5BD';
        this.ctx.font = `14px ${this.options.fontFamily}`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(message, this.width / 2, this.height / 2);
    }
}

// ============================================
// BAR CHART
// ============================================

class BarChart extends CanvasChart {
    draw(data, title = '') {
        this.clear();
        if (!data || data.labels.length === 0) {
            this.drawNoData();
            return;
        }

        if (title) this.drawTitle(title);

        const { labels, values, colors } = data;
        const padding = this.options.padding;
        const chartWidth = this.width - (padding * 2);
        const chartHeight = this.height - (padding * 2) - 30;
        const maxValue = Math.max(...values, 1);
        const barWidth = Math.min((chartWidth / labels.length) * 0.7, 60);
        const gap = (chartWidth - (barWidth * labels.length)) / (labels.length + 1);

        let x = padding + gap;

        // Draw bars
        labels.forEach((label, i) => {
            const barHeight = (values[i] / maxValue) * chartHeight;
            const y = padding + chartHeight - barHeight;

            // Bar gradient
            const gradient = this.ctx.createLinearGradient(x, y, x, padding + chartHeight);
            gradient.addColorStop(0, colors[i] || this.colors[i % this.colors.length]);
            gradient.addColorStop(1, this.lightColors[i % this.lightColors.length]);
            this.ctx.fillStyle = gradient;

            // Rounded top corners
            const radius = Math.min(6, barWidth / 2);
            this.roundRect(x, y, barWidth, barHeight, { upperLeft: radius, upperRight: radius });
            this.ctx.fill();

            // Value on top
            this.ctx.fillStyle = '#221F60';
            this.ctx.font = `bold 10px ${this.options.fontFamily}`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(formatCompactNumber(values[i]), x + barWidth / 2, y - 8);

            // Label below
            this.ctx.fillStyle = '#6C757D';
            this.ctx.font = `${this.options.fontSize}px ${this.options.fontFamily}`;
            this.ctx.fillText(label, x + barWidth / 2, padding + chartHeight + 18);

            x += barWidth + gap;
        });

        // Baseline
        this.ctx.strokeStyle = '#E9ECEF';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(padding, padding + chartHeight);
        this.ctx.lineTo(this.width - padding, padding + chartHeight);
        this.ctx.stroke();
    }

    roundRect(x, y, w, h, radii = {}) {
        const r = {
            upperLeft: radii.upperLeft || 0,
            upperRight: radii.upperRight || 0,
            lowerLeft: radii.lowerLeft || 0,
            lowerRight: radii.lowerRight || 0
        };

        this.ctx.beginPath();
        this.ctx.moveTo(x + r.upperLeft, y);
        this.ctx.lineTo(x + w - r.upperRight, y);
        this.ctx.quadraticCurveTo(x + w, y, x + w, y + r.upperRight);
        this.ctx.lineTo(x + w, y + h - r.lowerRight);
        this.ctx.quadraticCurveTo(x + w, y + h, x + w - r.lowerRight, y + h);
        this.ctx.lineTo(x + r.lowerLeft, y + h);
        this.ctx.quadraticCurveTo(x, y + h, x, y + h - r.lowerLeft);
        this.ctx.lineTo(x, y + r.upperLeft);
        this.ctx.quadraticCurveTo(x, y, x + r.upperLeft, y);
        this.ctx.closePath();
    }
}

// ============================================
// LINE CHART
// ============================================

class LineChart extends CanvasChart {
    draw(data, title = '') {
        this.clear();
        if (!data || data.labels.length === 0) {
            this.drawNoData();
            return;
        }

        if (title) this.drawTitle(title);

        const { labels, values, color = this.colors[0] } = data;
        const padding = this.options.padding;
        const chartWidth = this.width - (padding * 2);
        const chartHeight = this.height - (padding * 2) - 30;
        const maxValue = Math.max(...values, 1);
        const pointGap = chartWidth / (labels.length - 1 || 1);

        const points = values.map((value, i) => ({
            x: padding + (i * pointGap),
            y: padding + chartHeight - ((value / maxValue) * chartHeight)
        }));

        // Draw grid lines
        this.ctx.strokeStyle = '#E9ECEF';
        this.ctx.lineWidth = 0.5;
        for (let i = 0; i < 5; i++) {
            const y = padding + (chartHeight * i / 4);
            this.ctx.beginPath();
            this.ctx.moveTo(padding, y);
            this.ctx.lineTo(this.width - padding, y);
            this.ctx.stroke();

            // Grid label
            this.ctx.fillStyle = '#ADB5BD';
            this.ctx.font = `9px ${this.options.fontFamily}`;
            this.ctx.textAlign = 'right';
            this.ctx.fillText(formatCompactNumber(maxValue * (4 - i) / 4), padding - 5, y + 4);
        }

        // Draw line
        if (points.length > 1) {
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 2.5;
            this.ctx.lineJoin = 'round';
            this.ctx.beginPath();
            this.ctx.moveTo(points[0].x, points[0].y);
            
            for (let i = 1; i < points.length; i++) {
                this.ctx.lineTo(points[i].x, points[i].y);
            }
            this.ctx.stroke();

            // Fill area under line
            this.ctx.lineTo(points[points.length - 1].x, padding + chartHeight);
            this.ctx.lineTo(points[0].x, padding + chartHeight);
            this.ctx.closePath();
            
            const gradient = this.ctx.createLinearGradient(0, padding, 0, padding + chartHeight);
            gradient.addColorStop(0, color + '40');
            gradient.addColorStop(1, color + '05');
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        }

        // Draw points
        points.forEach(point => {
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // X-axis labels
        this.ctx.fillStyle = '#6C757D';
        this.ctx.font = `9px ${this.options.fontFamily}`;
        this.ctx.textAlign = 'center';
        
        const step = Math.ceil(labels.length / 12);
        labels.forEach((label, i) => {
            if (i % step === 0) {
                this.ctx.fillText(label, padding + (i * pointGap), padding + chartHeight + 18);
            }
        });
    }
}

// ============================================
// PIE / DOUGHNUT CHART
// ============================================

class PieChart extends CanvasChart {
    draw(data, title = '', isDoughnut = false) {
        this.clear();
        if (!data || data.labels.length === 0) {
            this.drawNoData();
            return;
        }

        if (title) this.drawTitle(title);

        const { labels, values, colors } = data;
        const total = values.reduce((sum, v) => sum + v, 0);
        if (total === 0) {
            this.drawNoData();
            return;
        }

        const centerX = this.width / 2;
        const centerY = this.height / 2 + 10;
        const radius = Math.min(this.width, this.height) / 2 - 60;
        const innerRadius = isDoughnut ? radius * 0.55 : 0;

        let startAngle = -Math.PI / 2;

        // Draw slices
        values.forEach((value, i) => {
            const sliceAngle = (value / total) * Math.PI * 2;
            const endAngle = startAngle + sliceAngle;

            this.ctx.fillStyle = colors[i] || this.colors[i % this.colors.length];
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            this.ctx.closePath();
            this.ctx.fill();

            // Slice border
            this.ctx.strokeStyle = '#FFFFFF';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            // Percentage label
            const percent = Math.round((value / total) * 100);
            if (percent > 5) {
                const midAngle = startAngle + sliceAngle / 2;
                const labelRadius = radius * 0.7;
                const lx = centerX + Math.cos(midAngle) * labelRadius;
                const ly = centerY + Math.sin(midAngle) * labelRadius;

                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.font = `bold 11px ${this.options.fontFamily}`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(percent + '%', lx, ly);
            }

            startAngle = endAngle;
        });

        // Inner circle for doughnut
        if (isDoughnut && innerRadius > 0) {
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // Legend
        this.drawLegend(labels, colors, 30, this.height - 30);
    }

    drawLegend(labels, colors, startY, maxY) {
        const itemsPerRow = Math.floor(this.width / 150);
        const itemWidth = this.width / itemsPerRow;
        
        labels.forEach((label, i) => {
            const col = i % itemsPerRow;
            const row = Math.floor(i / itemsPerRow);
            const x = col * itemWidth + 20;
            const y = startY + row * 22;
            
            if (y < maxY) {
                // Color box
                this.ctx.fillStyle = colors[i] || this.colors[i % this.colors.length];
                this.ctx.fillRect(x, y, 10, 10);
                
                // Label
                this.ctx.fillStyle = '#495057';
                this.ctx.font = `10px ${this.options.fontFamily}`;
                this.ctx.textAlign = 'left';
                this.ctx.fillText(label + ' (' + formatCompactNumber(data?.values?.[i] || 0) + ')', x + 16, y + 9);
            }
        });
    }
}

// ============================================
// HORIZONTAL BAR CHART
// ============================================

class HorizontalBarChart extends CanvasChart {
    draw(data, title = '') {
        this.clear();
        if (!data || data.labels.length === 0) {
            this.drawNoData();
            return;
        }

        if (title) this.drawTitle(title);

        const { labels, values, colors } = data;
        const padding = this.options.padding;
        const chartWidth = this.width - (padding * 2);
        const chartHeight = this.height - (padding * 2) - 30;
        const maxValue = Math.max(...values, 1);
        const barHeight = Math.min((chartHeight / labels.length) * 0.7, 35);
        const gap = (chartHeight - (barHeight * labels.length)) / (labels.length + 1);

        let y = padding + gap;

        labels.forEach((label, i) => {
            const barWidth = (values[i] / maxValue) * chartWidth;

            // Bar
            const gradient = this.ctx.createLinearGradient(0, y, barWidth, y);
            gradient.addColorStop(0, colors[i] || this.colors[i % this.colors.length]);
            gradient.addColorStop(1, this.lightColors[i % this.lightColors.length]);
            this.ctx.fillStyle = gradient;

            const radius = Math.min(6, barHeight / 2);
            this.roundRect(padding, y, barWidth, barHeight, { upperRight: radius, lowerRight: radius });
            this.ctx.fill();

            // Value
            this.ctx.fillStyle = '#221F60';
            this.ctx.font = `bold 10px ${this.options.fontFamily}`;
            this.ctx.textAlign = 'left';
            this.ctx.fillText(formatCompactNumber(values[i]), padding + barWidth + 8, y + barHeight / 2 + 4);

            // Label
            this.ctx.fillStyle = '#495057';
            this.ctx.font = `11px ${this.options.fontFamily}`;
            this.ctx.textAlign = 'right';
            this.ctx.fillText(label, padding - 10, y + barHeight / 2 + 4);

            y += barHeight + gap;
        });
    }
}

// ============================================
// CHART FACTORY FUNCTIONS
// ============================================

function createBarChart(canvasId, data, title = '') {
    const chart = new BarChart(canvasId);
    chart.draw(data, title);
    return chart;
}

function createLineChart(canvasId, data, title = '') {
    const chart = new LineChart(canvasId);
    chart.draw(data, title);
    return chart;
}

function createPieChart(canvasId, data, title = '') {
    const chart = new PieChart(canvasId);
    chart.draw(data, title, false);
    return chart;
}

function createDoughnutChart(canvasId, data, title = '') {
    const chart = new PieChart(canvasId);
    chart.draw(data, title, true);
    return chart;
}

function createHorizontalBarChart(canvasId, data, title = '') {
    const chart = new HorizontalBarChart(canvasId);
    chart.draw(data, title);
    return chart;
}

// ============================================
// PRE-BUILT CHART DATA GENERATORS
// ============================================

function getRevenueChartData() {
    const revenue = getRevenueData();
    const months = Object.keys(revenue.monthly).sort().slice(-6);
    const values = months.map(m => revenue.monthly[m] || 0);

    return {
        labels: months.map(m => formatDate(m + '-01', 'MMM YYYY')),
        values: values,
        colors: [CHART_COLORS.PRIMARY]
    };
}

function getZoneChartData() {
    const campaigns = getCampaignAnalytics();
    const zones = Object.entries(campaigns.byZone)
        .sort((a, b) => b[1].spend - a[1].spend);

    return {
        labels: zones.map(([name]) => name),
        values: zones.map(([, data]) => data.spend),
        colors: zones.map((_, i) => CHART_COLORS.PALETTE[i % CHART_COLORS.PALETTE.length])
    };
}

function getCampaignTypeChartData() {
    const campaigns = getCampaignAnalytics();
    const types = Object.entries(campaigns.byType);

    return {
        labels: types.map(([type]) => formatCampaignType(type)),
        values: types.map(([, data]) => data.count),
        colors: ['#221F60', '#FF5A00', '#FFB800']
    };
}

function getScanChartData() {
    const passengers = getPassengerAnalytics();
    const days = Object.keys(passengers.byDay).sort().slice(-14);
    const values = days.map(d => passengers.byDay[d] || 0);

    return {
        labels: days.map(d => formatDate(d, 'DD MMM')),
        values: values,
        colors: [CHART_COLORS.SUCCESS]
    };
}

// ============================================
// AUTO-RENDER CHARTS
// ============================================

function renderRevenueChart() {
    const canvas = document.getElementById('revenue-chart');
    if (!canvas) return;
    createLineChart('revenue-chart', getRevenueChartData(), 'Revenue Trend');
}

function renderZoneChart() {
    const canvas = document.getElementById('zone-chart');
    if (!canvas) return;
    createBarChart('zone-chart', getZoneChartData(), 'Campaigns by Zone');
}

function renderCampaignTypeChart() {
    const canvas = document.getElementById('campaign-type-chart');
    if (!canvas) return;
    createDoughnutChart('campaign-type-chart', getCampaignTypeChartData(), 'Campaign Types');
}

function renderScanChart() {
    const canvas = document.getElementById('scan-chart');
    if (!canvas) return;
    createLineChart('scan-chart', getScanChartData(), 'QR Scans Trend');
}

function renderAllCharts() {
    renderRevenueChart();
    renderZoneChart();
    renderCampaignTypeChart();
    renderScanChart();
}

// ============================================
// INITIALIZATION
// ============================================

function initCharts() {
    console.log('📊 Charts Module Loaded');
    
    // Auto-render if canvas elements exist
    setTimeout(renderAllCharts, 500);
}

document.addEventListener('DOMContentLoaded', initCharts);

console.log('✅ Charts Module Ready');
