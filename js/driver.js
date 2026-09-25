// RideSense Driver Cockpit & Door Safety Inspection Monitor
const RideSenseDriver = {
  activeBus: null,
  doorBoardingLocked: false,
  doorsClosed: false,

  init: function(bus) {
    this.activeBus = bus || RideSenseData.buses[0];
    this.render();
  },

  setBus: function(bus) {
    this.activeBus = bus;
    this.render();
  },

  render: function() {
    const container = document.getElementById("driverPortalContent");
    if (!container || !this.activeBus) return;
    const bus = this.activeBus;

    const doors = bus.doorStatus || {
      frontDoorCrowd: 30,
      middleDoorCrowd: 40,
      rearDoorCrowd: 35,
      isSafeToDepart: true,
      warningMessage: "Doors clear."
    };

    const isHazard = bus.crowdPercentage >= 90 || doors.frontDoorCrowd >= 80 || doors.middleDoorCrowd >= 80 || doors.rearDoorCrowd >= 80;

    let html = `
      <div class="driver-cockpit bg-slate-900 border border-slate-700/80 rounded-2xl p-4 md:p-6 shadow-2xl space-y-4">
        
        <!-- Header -->
        <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-700">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-2xl">
              <i class="fa-solid fa-gauge-high"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-xs border border-emerald-500/30">
                  RIDESENSE DRIVER CONSOLE
                </span>
                <span class="text-xs text-slate-400 font-mono">${bus.regNo}</span>
              </div>
              <h2 class="text-lg md:text-xl font-bold text-white mt-1">Bus ${bus.routeNo} — ${bus.routeName}</h2>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="text-right">
              <div class="text-xs text-slate-400">Driver on Duty</div>
              <div class="text-sm font-bold text-white flex items-center gap-1.5 justify-end">
                <i class="fa-solid fa-circle-user text-emerald-400"></i> ${bus.driverName}
              </div>
            </div>
            <select onchange="RideSenseDriver.onBusSelect(this.value)" class="bg-slate-800 border border-slate-600 text-white text-xs rounded-lg px-2.5 py-2">
              ${RideSenseData.buses.map(b => `<option value="${b.id}" ${b.id === bus.id ? 'selected' : ''}>Bus ${b.routeNo} (${b.crowdPercentage}%)</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- Overcrowding / Door Hazard Warning Banner -->
        ${isHazard ? `
          <div class="p-4 rounded-xl bg-red-950/70 border-2 border-red-500/80 flex items-start gap-3 animate-pulse">
            <i class="fa-solid fa-triangle-exclamation text-2xl text-red-400 shrink-0 mt-0.5"></i>
            <div class="flex-1">
              <h3 class="text-sm font-black text-red-300 uppercase tracking-wider">
                ⚠️ HIGH CROWD — CHECK DOOR AREA BEFORE DEPARTURE
              </h3>
              <p class="text-xs text-red-200 mt-1">
                ${doors.warningMessage} High passenger concentration on doors. Boarding lock recommended.
              </p>
            </div>
            <button onclick="RideSenseDriver.openDoorSafetyModal()" class="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg shadow-lg">
              Door Safety Check
            </button>
          </div>
        ` : `
          <div class="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 flex items-center justify-between text-xs">
            <div class="flex items-center gap-2 text-emerald-300">
              <i class="fa-solid fa-circle-check text-emerald-400 text-base"></i>
              <span>Door clearance normal. Proceed with scheduled stops.</span>
            </div>
            <button onclick="RideSenseDriver.openDoorSafetyModal()" class="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded border border-slate-600">
              Inspect 3 Doors
            </button>
          </div>
        `}

        <!-- Real-Time Metrics Cockpit Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="bg-slate-800/80 border border-slate-700 p-3 rounded-xl text-center">
            <div class="text-[11px] text-slate-400">Total Passengers</div>
            <div class="text-2xl font-black text-white mt-1">${bus.currentPassengers} <span class="text-xs font-normal text-slate-400">/ ${bus.capacity}</span></div>
            <div class="text-[10px] text-slate-400 mt-0.5">Max capacity: ${bus.capacity}</div>
          </div>

          <div class="bg-slate-800/80 border border-slate-700 p-3 rounded-xl text-center">
            <div class="text-[11px] text-slate-400">Occupancy Level</div>
            <div class="text-2xl font-black ${bus.crowdPercentage > 85 ? 'text-red-400' : 'text-emerald-400'} mt-1">
              ${bus.crowdPercentage}%
            </div>
            <div class="text-[10px] uppercase font-bold text-slate-300 mt-0.5">
              ${bus.crowdLevel}
            </div>
          </div>

          <div class="bg-slate-800/80 border border-slate-700 p-3 rounded-xl text-center">
            <div class="text-[11px] text-slate-400">Seated vs Standing</div>
            <div class="text-xl font-bold text-white mt-1">
              <span class="text-blue-400">${bus.seated}</span> / <span class="text-amber-400">${bus.standing}</span>
            </div>
            <div class="text-[10px] text-slate-400 mt-0.5">${bus.availableSeats} seats empty</div>
          </div>

          <div class="bg-slate-800/80 border border-slate-700 p-3 rounded-xl text-center">
            <div class="text-[11px] text-slate-400">Speed / Schedule</div>
            <div class="text-2xl font-black text-white mt-1">${bus.currentSpeed} <span class="text-xs font-normal text-slate-400">km/h</span></div>
            <div class="text-[10px] ${bus.delayMinutes > 0 ? 'text-amber-400 font-semibold' : 'text-emerald-400'} mt-0.5">
              ${bus.delayMinutes > 0 ? `+${bus.delayMinutes}m delay` : 'On Time'}
            </div>
          </div>
        </div>

        <!-- Stop Progress & Cockpit Actions -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-slate-800/50 border border-slate-700/80 p-4 rounded-xl space-y-2 text-xs">
            <h4 class="font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <i class="fa-solid fa-location-dot text-blue-400"></i> Route Progress
            </h4>
            <div class="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-700">
              <span class="text-slate-400">Current Station:</span>
              <strong class="text-white">${bus.currentStop}</strong>
            </div>
            <div class="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-amber-500/30">
              <span class="text-slate-400">Next Scheduled Stop:</span>
              <strong class="text-amber-400">${bus.nextStop} (${bus.etaMinutes} min)</strong>
            </div>
            <div class="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-700">
              <span class="text-slate-400">Final Destination:</span>
              <strong class="text-slate-300">${bus.destination}</strong>
            </div>
          </div>

          <div class="bg-slate-800/50 border border-slate-700/80 p-4 rounded-xl flex flex-col justify-between">
            <h4 class="font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5 text-xs">
              <i class="fa-solid fa-sliders text-amber-400"></i> Cockpit Controls
            </h4>
            
            <div class="grid grid-cols-2 gap-2 my-auto">
              <button onclick="RideSenseDriver.openDoorSafetyModal()" class="p-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow">
                <i class="fa-solid fa-shield-halved"></i> Door Safety Check
              </button>
              
              <button onclick="RideSenseDriver.toggleBoardingLock()" class="p-2.5 rounded-lg ${this.doorBoardingLocked ? 'bg-red-600 hover:bg-red-500' : 'bg-slate-700 hover:bg-slate-600'} text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow">
                <i class="fa-solid ${this.doorBoardingLocked ? 'fa-lock' : 'fa-lock-open'}"></i>
                <span>${this.doorBoardingLocked ? 'Boarding LOCKED' : 'Lock Boarding'}</span>
              </button>

              <button onclick="RideSenseVoice.announceBus(RideSenseDriver.activeBus)" class="p-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow">
                <i class="fa-solid fa-bullhorn"></i> Voice Broadcast
              </button>

              <button onclick="RideSenseDriver.triggerDepartureBuzzer()" class="p-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow">
                <i class="fa-solid fa-volume-high"></i> Departure Buzzer
              </button>
            </div>
          </div>
        </div>

      </div>
    `;

    container.innerHTML = html;
  },

  onBusSelect: function(busId) {
    const bus = RideSenseData.buses.find(b => b.id === busId);
    if (bus) {
      this.activeBus = bus;
      this.render();
    }
  },

  openDoorSafetyModal: function() {
    const modal = document.getElementById("doorSafetyModal");
    const content = document.getElementById("doorSafetyModalContent");
    if (!modal || !content || !this.activeBus) return;

    const bus = this.activeBus;
    const doors = bus.doorStatus || { frontDoorCrowd: 30, middleDoorCrowd: 40, rearDoorCrowd: 35, isSafeToDepart: true };
    const isSafe = doors.isSafeToDepart && !this.doorBoardingLocked;

    content.innerHTML = `
      <div class="p-4 text-left">
        <div class="flex items-center justify-between pb-3 border-b border-slate-700">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full ${isSafe ? 'bg-emerald-500' : 'bg-red-500 animate-ping'}"></span>
            <h3 class="text-base font-bold text-white">3-Door Safety & Footboard Inspection</h3>
          </div>
          <button onclick="RideSenseDriver.closeDoorSafetyModal()" class="text-slate-400 hover:text-white text-lg">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4 text-xs">
          <!-- Front Door -->
          <div class="p-2.5 rounded-xl bg-slate-800/80 border ${doors.frontDoorCrowd > 75 ? 'border-red-500/60 bg-red-950/20' : 'border-emerald-500/40 bg-emerald-950/20'}">
            <div class="font-bold text-slate-300">Front Door</div>
            <div class="text-xl font-black text-white mt-1">${doors.frontDoorCrowd}%</div>
            <div class="text-[10px] text-slate-400 mt-1">IR Step Sensor Active</div>
          </div>

          <!-- Middle Door -->
          <div class="p-2.5 rounded-xl bg-slate-800/80 border ${doors.middleDoorCrowd > 75 ? 'border-red-500/60 bg-red-950/20' : 'border-emerald-500/40 bg-emerald-950/20'}">
            <div class="font-bold text-slate-300">Middle Door</div>
            <div class="text-xl font-black text-white mt-1">${doors.middleDoorCrowd}%</div>
            <div class="text-[10px] text-slate-400 mt-1">Optical Clearance Sensor</div>
          </div>

          <!-- Rear Door -->
          <div class="p-2.5 rounded-xl bg-slate-800/80 border ${doors.rearDoorCrowd > 75 ? 'border-red-500/60 bg-red-950/20' : 'border-emerald-500/40 bg-emerald-950/20'}">
            <div class="font-bold text-slate-300">Rear Door</div>
            <div class="text-xl font-black text-white mt-1">${doors.rearDoorCrowd}%</div>
            <div class="text-[10px] text-slate-400 mt-1">Footboard Pressure Mat</div>
          </div>
        </div>

        <div class="mt-4 p-4 rounded-xl text-center ${isSafe ? 'bg-emerald-950/40 border border-emerald-500/50' : 'bg-red-950/50 border border-red-500/60'}">
          <div class="text-xs uppercase font-bold text-slate-400">Departure Safety Status</div>
          <div class="text-xl font-black mt-1 ${isSafe ? 'text-emerald-400' : 'text-red-400 animate-pulse'}">
            ${isSafe ? '✅ SAFE TO CLOSE DOORS & DEPART' : '⛔ HAZARD – DO NOT CLOSE DOORS OR MOVE BUS'}
          </div>
          <p class="text-xs text-slate-300 mt-1">
            ${isSafe ? 'All door steps are clear. Passenger movement safe.' : doors.warningMessage}
          </p>
        </div>

        <div class="flex flex-wrap gap-2 mt-4 text-xs font-bold">
          <button onclick="RideSenseDriver.toggleDoors()" class="flex-1 py-2.5 rounded-lg ${this.doorsClosed ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'} text-white transition">
            ${this.doorsClosed ? 'Open Doors' : 'Simulate Close Doors'}
          </button>
          <button onclick="RideSenseDriver.closeDoorSafetyModal()" class="py-2.5 px-4 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
            Close Panel
          </button>
        </div>
      </div>
    `;

    modal.classList.remove("hidden");
  },

  closeDoorSafetyModal: function() {
    const modal = document.getElementById("doorSafetyModal");
    if (modal) modal.classList.add("hidden");
  },

  toggleBoardingLock: function() {
    this.doorBoardingLocked = !this.doorBoardingLocked;
    const msg = this.doorBoardingLocked ? "Boarding locked! Door indicator turned RED." : "Boarding unlocked. Passenger flow permitted.";
    RideSenseApp.showToast(msg, this.doorBoardingLocked ? "warning" : "info");
    this.render();
  },

  toggleDoors: function() {
    this.doorsClosed = !this.doorsClosed;
    const msg = this.doorsClosed ? "Bus doors closed safely. Ready to proceed." : "Bus doors opened for passenger exchange.";
    RideSenseApp.showToast(msg, "info");
    this.openDoorSafetyModal();
  },

  triggerDepartureBuzzer: function() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.setValueAtTime(350, audioCtx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.55);
    } catch(e) {}
    RideSenseApp.showToast("Departure buzzer sounded to passengers at stop", "info");
  }
};

window.RideSenseDriver = RideSenseDriver;
