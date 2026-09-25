// RideSense Charts for Crowd Prediction & Analytics
const RideSenseCharts = {
  predictionChart: null,
  peakChart: null,
  adminFleetChart: null,

  init: function(bus) {
    if (typeof Chart === "undefined") {
      setTimeout(() => this.init(bus), 300);
      return;
    }
    this.renderPredictionChart(bus);
    this.renderPeakChart(bus);
  },

  updateCharts: function(bus) {
    this.renderPredictionChart(bus);
    this.renderPeakChart(bus);
  },

  renderPredictionChart: function(bus) {
    const canvas = document.getElementById("predictionChartCanvas");
    if (!canvas || !bus) return;

    if (this.predictionChart) {
      this.predictionChart.destroy();
    }

    const predictions = bus.upcomingPredictions || [
      { stop: "Current Stop", current: bus.crowdPercentage, predicted: Math.min(100, bus.crowdPercentage + 5), boarders: 4, alighters: 2 },
      { stop: "Next Stop", current: bus.crowdPercentage + 4, predicted: Math.min(100, bus.crowdPercentage + 8), boarders: 6, alighters: 3 },
      { stop: "Terminus", current: bus.crowdPercentage + 8, predicted: Math.max(30, bus.crowdPercentage - 20), boarders: 2, alighters: 25 }
    ];

    const labels = predictions.map(p => p.stop);
    const currentData = predictions.map(p => p.current);
    const predictedData = predictions.map(p => p.predicted);

    const ctx = canvas.getContext("2d");
    this.predictionChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Recorded Crowd %",
            data: currentData,
            backgroundColor: "rgba(59, 130, 246, 0.7)",
            borderColor: "rgba(59, 130, 246, 1)",
            borderWidth: 1.5,
            borderRadius: 6
          },
          {
            label: "Demo AI Forecast %",
            data: predictedData,
            backgroundColor: "rgba(245, 158, 11, 0.8)",
            borderColor: "rgba(245, 158, 11, 1)",
            borderWidth: 1.5,
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: { color: "#cbd5e1", font: { size: 10, weight: "bold" } }
          }
        },
        scales: {
          y: {
            min: 0,
            max: 100,
            ticks: { color: "#94a3b8", callback: v => v + "%" },
            grid: { color: "rgba(51, 65, 85, 0.4)" }
          },
          x: {
            ticks: { color: "#cbd5e1", font: { size: 10 } },
            grid: { display: false }
          }
        }
      }
    });
  },

  renderPeakChart: function(bus) {
    const canvas = document.getElementById("peakTimeChartCanvas");
    if (!canvas || !bus) return;

    if (this.peakChart) {
      this.peakChart.destroy();
    }

    const hourly = bus.hourlyCrowdTrend || [
      { hour: "6 AM", crowd: 25 }, { hour: "8 AM", crowd: 88 }, { hour: "10 AM", crowd: 65 },
      { hour: "1 PM", crowd: 45 }, { hour: "4 PM", crowd: 62 }, { hour: "6 PM", crowd: 92 },
      { hour: "8 PM", crowd: 70 }, { hour: "10 PM", crowd: 30 }
    ];

    const labels = hourly.map(h => h.hour);
    const data = hourly.map(h => h.crowd);

    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 240);
    gradient.addColorStop(0, "rgba(239, 68, 68, 0.5)");
    gradient.addColorStop(0.5, "rgba(245, 158, 11, 0.3)");
    gradient.addColorStop(1, "rgba(16, 185, 129, 0.05)");

    this.peakChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: `Hourly Crowd Curve (${bus.routeNo})`,
            data: data,
            fill: true,
            backgroundColor: gradient,
            borderColor: "#f59e0b",
            borderWidth: 2,
            tension: 0.35,
            pointBackgroundColor: data.map(v => v >= 85 ? "#ef4444" : (v >= 65 ? "#f59e0b" : "#10b981")),
            pointRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: "#cbd5e1", font: { size: 10 } } }
        },
        scales: {
          y: {
            min: 0,
            max: 100,
            ticks: { color: "#94a3b8", callback: v => v + "%" },
            grid: { color: "rgba(51, 65, 85, 0.4)" }
          },
          x: {
            ticks: { color: "#94a3b8", font: { size: 9 } },
            grid: { display: false }
          }
        }
      }
    });
  },

  renderAdminFleetChart: function() {
    const canvas = document.getElementById("adminFleetChartCanvas");
    if (!canvas) return;

    if (this.adminFleetChart) {
      this.adminFleetChart.destroy();
    }

    const buses = RideSenseData.buses.slice(0, 6);
    const labels = buses.map(b => b.routeNo);
    const crowdData = buses.map(b => b.crowdPercentage);
    const seatData = buses.map(b => b.availableSeats);

    const ctx = canvas.getContext("2d");
    this.adminFleetChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Crowd Occupancy (%)",
            data: crowdData,
            backgroundColor: crowdData.map(c => c > 85 ? "rgba(239, 68, 68, 0.85)" : (c > 65 ? "rgba(245, 158, 11, 0.85)" : "rgba(16, 185, 129, 0.85)")),
            borderRadius: 6,
            yAxisID: "y"
          },
          {
            label: "Available Seats",
            data: seatData,
            type: "line",
            borderColor: "#38bdf8",
            borderWidth: 2,
            pointBackgroundColor: "#38bdf8",
            pointRadius: 5,
            yAxisID: "y1"
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 0,
            max: 100,
            ticks: { color: "#94a3b8", callback: v => v + "%" },
            grid: { color: "rgba(51, 65, 85, 0.4)" }
          },
          y1: {
            min: 0,
            max: 32,
            position: "right",
            ticks: { color: "#38bdf8" },
            grid: { display: false }
          },
          x: {
            ticks: { color: "#cbd5e1" },
            grid: { display: false }
          }
        }
      }
    });
  }
};

window.RideSenseCharts = RideSenseCharts;
