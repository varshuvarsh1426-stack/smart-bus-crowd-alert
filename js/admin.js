// RideSense Admin Fleet Operations & Central Incident Command
const RideSenseAdmin = {
  incidentLogs: [
    { time: "10:30 AM", type: "overcrowd", bus: "4A", msg: "High tourist surge near Vivekananda Ferry Jetty. 92% occupancy." },
    { time: "10:15 AM", type: "overcrowd", bus: "27B", msg: "Occupancy crossed 90% threshold near Vannarpettai Checkpost." },
    { time: "09:48 AM", type: "breakdown", bus: "19B", msg: "Radiator check underway near Town Hall. Backup vehicle on standby." },
    { time: "09:20 AM", type: "deviation", bus: "19B", msg: "Temporary diversion via Swami Sannathi street due to festival queue." }
  ],

  init: function() {
    this.render();
  },

  render: function() {
    const container = document.getElementById("adminPortalContent");
    if (!container) return;

    const buses = RideSenseData.buses;
    const totalPassengers = buses.reduce((sum, b) => sum + b.currentPassengers, 0);
    const avgOccupancy = Math.round(buses.reduce((sum, b) => sum + b.crowdPercentage, 0) / buses.length);
    const criticalBuses = buses.filter(b => b.crowdPercentage >= 85);
    const breakdowns = buses.filter(b => b.breakdownReported);

    let html = `
      <div class="admin-portal space-y-6">
        
        <!-- Header -->
        <div class="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-700 shadow-xl">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 text-2xl">
              <i class="fa-solid fa-satellite-dish"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-xs border border-purple-500/30">
                  RIDESENSE FLEET HUB
                </span>
                <span class="text-xs text-slate-400 font-mono">Central Command</span>
              </div>
              <h2 class="text-xl font-bold text-white mt-1">Transit Telemetry & Network Hotspots</h2>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button onclick="RideSenseAdmin.injectRushHour()" class="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg shadow flex items-center gap-1.5 transition">
              <i class="fa-solid fa-users"></i> Inject Peak Rush (+20%)
            </button>
            <button onclick="RideSenseAdmin.resetFleetDefaults()" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-600 transition">
              <i class="fa-solid fa-rotate-left"></i> Reset Defaults
            </button>
          </div>
        </div>

        <!-- Stat Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="p-4 rounded-xl bg-slate-900 border border-slate-700 shadow">
            <div class="text-xs text-slate-400">Total Active Buses</div>
            <div class="text-3xl font-black text-white mt-1">${buses.length}</div>
            <div class="text-[11px] text-emerald-400 mt-1">100% telemetry online</div>
          </div>

          <div class="p-4 rounded-xl bg-slate-900 border border-slate-700 shadow">
            <div class="text-xs text-slate-400">Total Live Passengers</div>
            <div class="text-3xl font-black text-white mt-1">${totalPassengers}</div>
            <div class="text-[11px] text-slate-400 mt-1">Across monitored corridors</div>
          </div>

          <div class="p-4 rounded-xl bg-slate-900 border border-slate-700 shadow">
            <div class="text-xs text-slate-400">Fleet Avg. Occupancy</div>
            <div class="text-3xl font-black ${avgOccupancy > 75 ? 'text-amber-400' : 'text-emerald-400'} mt-1">${avgOccupancy}%</div>
            <div class="text-[11px] text-slate-400 mt-1">${criticalBuses.length} buses overcrowded</div>
          </div>

          <div class="p-4 rounded-xl bg-slate-900 border border-slate-700 shadow">
            <div class="text-xs text-slate-400">Incident Flags</div>
            <div class="text-3xl font-black ${breakdowns.length > 0 ? 'text-red-400' : 'text-emerald-400'} mt-1">
              ${breakdowns.length + criticalBuses.length}
            </div>
            <div class="text-[11px] text-slate-400 mt-1">${breakdowns.length} maintenance alert</div>
          </div>
        </div>

        <!-- Crowd Hotspot Map & Analytics (Section 38) -->
        <div class="p-4 rounded-2xl bg-slate-900 border border-slate-700 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <i class="fa-solid fa-fire text-red-500"></i> High-Density Crowd Hotspots (Demo Radar)
            </h3>
            <span class="text-[10px] text-slate-400">Simulated Transit Congestion Zones</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="p-3 rounded-xl bg-red-950/40 border border-red-500/50">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-white">Vivekananda Ferry Jetty</span>
                <span class="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold text-[10px]">92% HOTSPOT</span>
              </div>
              <p class="text-[11px] text-slate-300 mt-1">Morning tourist ferry rush. Queue extending onto beach road.</p>
              <div class="text-[10px] text-amber-400 mt-2">Action: Extra Shuttle Bus 1A & 3A dispatched.</div>
            </div>

            <div class="p-3 rounded-xl bg-amber-950/40 border border-amber-500/50">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-white">Vannarpettai Checkpost</span>
                <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">88% MODERATE</span>
              </div>
              <p class="text-[11px] text-slate-300 mt-1">Office & college commute corridor bottleneck.</p>
              <div class="text-[10px] text-slate-400 mt-2">Action: Parallel express line active.</div>
            </div>

            <div class="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/50">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-white">Sunset Point Beach Road</span>
                <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">40% NORMAL</span>
              </div>
              <p class="text-[11px] text-slate-300 mt-1">Comfortable traffic. Peak expected at 05:30 PM sunset.</p>
              <div class="text-[10px] text-emerald-400 mt-2">Action: Scheduled cruiser running on time.</div>
            </div>
          </div>
        </div>

        <!-- Fleet Table & Live Overrides -->
        <div class="bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-xl">
          <div class="flex items-center justify-between pb-3 border-b border-slate-700">
            <h3 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <i class="fa-solid fa-list-check text-blue-400"></i> Active Fleet Telemetry
            </h3>
            <span class="text-xs text-slate-400">Adjust crowd or trigger breakdown for demo testing</span>
          </div>

          <div class="overflow-x-auto mt-3">
            <table class="w-full text-left text-xs text-slate-300">
              <thead class="text-[10px] text-slate-400 uppercase bg-slate-800/80 border-b border-slate-700">
                <tr>
                  <th class="py-2.5 px-3">Bus No</th>
                  <th class="py-2.5 px-3">Route</th>
                  <th class="py-2.5 px-3">Crowd %</th>
                  <th class="py-2.5 px-3">Seats</th>
                  <th class="py-2.5 px-3">Speed</th>
                  <th class="py-2.5 px-3">Status</th>
                  <th class="py-2.5 px-3 text-right">Overrides</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800">
                ${buses.slice(0, 8).map(b => `
                  <tr class="hover:bg-slate-800/50 transition">
                    <td class="py-2.5 px-3 font-bold text-white">
                      ${b.routeNo} <span class="text-[9px] text-slate-400 font-normal block">${b.regNo}</span>
                    </td>
                    <td class="py-2.5 px-3 text-slate-300 max-w-xs truncate">
                      ${b.routeName}
                    </td>
                    <td class="py-2.5 px-3">
                      <span class="font-bold ${b.crowdPercentage > 85 ? 'text-red-400' : 'text-emerald-400'}">
                        ${b.crowdPercentage}%
                      </span>
                    </td>
                    <td class="py-2.5 px-3 font-bold ${b.availableSeats > 0 ? 'text-emerald-400' : 'text-red-400'}">
                      ${b.availableSeats}
                    </td>
                    <td class="py-2.5 px-3 font-mono">${b.currentSpeed} km/h</td>
                    <td class="py-2.5 px-3">
                      ${b.breakdownReported ? '<span class="text-red-400 font-bold">Breakdown</span>' : '<span class="text-emerald-400 font-semibold">Active</span>'}
                    </td>
                    <td class="py-2.5 px-3 text-right">
                      <div class="flex items-center justify-end gap-1">
                        <button onclick="RideSenseAdmin.adjustCrowd('${b.id}', 10)" class="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700" title="Increase +10%">+</button>
                        <button onclick="RideSenseAdmin.adjustCrowd('${b.id}', -10)" class="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700" title="Decrease -10%">-</button>
                        <button onclick="RideSenseAdmin.toggleBreakdown('${b.id}')" class="px-2 py-1 rounded ${b.breakdownReported ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300'} text-[10px] border border-slate-700" title="Toggle Breakdown"><i class="fa-solid fa-wrench"></i></button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Fleet Chart Canvas -->
        <div class="p-4 rounded-2xl bg-slate-900 border border-slate-700">
          <h3 class="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Fleet Occupancy Matrix</h3>
          <div class="relative h-56">
            <canvas id="adminFleetChartCanvas"></canvas>
          </div>
        </div>

      </div>
    `;

    container.innerHTML = html;

    setTimeout(() => {
      RideSenseCharts.renderAdminFleetChart();
    }, 100);
  },

  adjustCrowd: function(busId, delta) {
    const bus = RideSenseData.buses.find(b => b.id === busId);
    if (!bus) return;

    let newCrowd = Math.max(10, Math.min(100, bus.crowdPercentage + delta));
    bus.crowdPercentage = newCrowd;
    bus.crowdLevel = RideSenseData.getCrowdLevel(newCrowd);

    bus.currentPassengers = Math.round((newCrowd / 100) * bus.capacity);
    bus.seated = Math.min(bus.seatingCapacity, bus.currentPassengers);
    bus.standing = Math.max(0, bus.currentPassengers - bus.seated);
    bus.availableSeats = Math.max(0, bus.seatingCapacity - bus.seated);

    if (bus.sectionCrowd) {
      bus.sectionCrowd.front = Math.min(100, Math.round(newCrowd * 0.95));
      bus.sectionCrowd.middle = Math.min(100, Math.round(newCrowd * 1.05));
      bus.sectionCrowd.rear = Math.min(100, Math.round(newCrowd * 0.98));
    }

    if (bus.doorStatus) {
      bus.doorStatus.frontDoorCrowd = Math.min(100, Math.round(newCrowd * 0.9));
      bus.doorStatus.middleDoorCrowd = Math.min(100, Math.round(newCrowd * 1.05));
      bus.doorStatus.rearDoorCrowd = Math.min(100, Math.round(newCrowd * 0.95));
      bus.doorStatus.isSafeToDepart = newCrowd < 90;
    }

    this.render();
    if (RideSenseApp.activeBus && RideSenseApp.activeBus.id === bus.id) {
      RideSenseApp.refreshActiveBusViews();
    }

    RideSenseApp.showToast(`Bus ${bus.routeNo} crowd updated to ${newCrowd}%`, "info");
  },

  toggleBreakdown: function(busId) {
    const bus = RideSenseData.buses.find(b => b.id === busId);
    if (!bus) return;

    bus.breakdownReported = !bus.breakdownReported;
    this.render();
    if (RideSenseApp.activeBus && RideSenseApp.activeBus.id === bus.id) {
      RideSenseApp.refreshActiveBusViews();
    }
    const msg = bus.breakdownReported ? `⚠️ Demo service breakdown logged for Bus ${bus.routeNo}` : `Bus ${bus.routeNo} breakdown resolved.`;
    RideSenseApp.showToast(msg, bus.breakdownReported ? "warning" : "success");
  },

  injectRushHour: function() {
    RideSenseData.buses.forEach(b => {
      b.crowdPercentage = Math.min(98, b.crowdPercentage + 20);
      b.crowdLevel = RideSenseData.getCrowdLevel(b.crowdPercentage);
      b.currentPassengers = Math.round((b.crowdPercentage / 100) * b.capacity);
      b.seated = Math.min(b.seatingCapacity, b.currentPassengers);
      b.standing = Math.max(0, b.currentPassengers - b.seated);
      b.availableSeats = Math.max(0, b.seatingCapacity - b.seated);
      if (b.doorStatus) b.doorStatus.isSafeToDepart = b.crowdPercentage < 90;
    });

    RideSenseApp.showToast("Peak hour rush injected (+20% crowd across all corridors)", "warning");
    this.render();
    if (RideSenseApp.activeBus) {
      RideSenseApp.refreshActiveBusViews();
    }
  },

  resetFleetDefaults: function() {
    location.reload();
  }
};

window.RideSenseAdmin = RideSenseAdmin;
