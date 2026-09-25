// RideSense Bus Interior Blueprint & Section Crowd Heatmap
const RideSenseBlueprint = {
  containerId: "busBlueprintContainer",
  activeBus: null,
  activePriorityFilter: "general",

  init: function(bus) {
    this.activeBus = bus;
    this.render();
  },

  setBus: function(bus) {
    this.activeBus = bus;
    this.render();
  },

  setPriorityFilter: function(category) {
    this.activePriorityFilter = category;
    this.render();
  },

  render: function() {
    const container = document.getElementById(this.containerId);
    if (!container || !this.activeBus) return;

    const bus = this.activeBus;
    const seats = RideSenseData.createSeatLayout(bus);

    // Section Heatmaps (Front %, Middle %, Rear %) as required in Section 6
    const sec = bus.sectionCrowd || { front: 55, middle: 88, rear: 72 };
    const getSecClass = val => {
      if (val <= 60) return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      if (val <= 75) return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      if (val <= 90) return "bg-orange-500/20 text-orange-300 border-orange-500/40";
      return "bg-red-500/20 text-red-300 border-red-500/40 animate-pulse";
    };

    // Door Statuses (Front, Middle, Rear) as required in Section 7
    const doors = bus.doorStatus || {
      frontDoorCrowd: 40,
      middleDoorCrowd: 85,
      rearDoorCrowd: 50,
      isSafeToDepart: true,
      warningMessage: "Doors clear."
    };

    const getDoorBadge = val => {
      if (val <= 45) return `<span class="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">Low (${val}%)</span>`;
      if (val <= 75) return `<span class="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">Medium (${val}%)</span>`;
      return `<span class="px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-black animate-pulse">High (${val}%)</span>`;
    };

    // Calculate section standing density
    const totalStanding = bus.standing;
    const frontStanding = Math.round(totalStanding * 0.25);
    const midStanding = Math.round(totalStanding * 0.50);
    const rearStanding = Math.max(0, totalStanding - frontStanding - midStanding);

    let html = `
      <div class="blueprint-card space-y-3">
        
        <!-- Header & Stats Summary -->
        <div class="blueprint-header flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-700/60">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">
                TOP-VIEW SCHEMATIC
              </span>
              <span class="text-xs text-slate-400 font-mono">Reg: <strong class="text-slate-200">${bus.regNo}</strong></span>
            </div>
            <h4 class="text-sm md:text-base font-bold text-white flex items-center gap-2 mt-1">
              <i class="fa-solid fa-bus text-emerald-400"></i> Bus ${bus.routeNo} — Interior Layout & Sensors
            </h4>
          </div>

          <!-- Dynamic Numbers Bar -->
          <div class="flex flex-wrap items-center gap-1.5 text-xs">
            <span class="stat-pill bg-slate-800/80 border border-slate-700 px-2.5 py-1 rounded-md text-slate-300">
              Capacity: <strong class="text-white">${bus.capacity}</strong>
            </span>
            <span class="stat-pill bg-slate-800/80 border border-slate-700 px-2.5 py-1 rounded-md text-slate-300">
              Total: <strong class="text-white">${bus.currentPassengers}</strong>
            </span>
            <span class="stat-pill bg-blue-500/10 border border-blue-500/30 px-2.5 py-1 rounded-md text-blue-400">
              Seated: <strong>${bus.seated} / ${bus.seatingCapacity}</strong>
            </span>
            <span class="stat-pill bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-md text-amber-400">
              Standing: <strong>${bus.standing}</strong>
            </span>
            <span class="stat-pill ${bus.availableSeats > 0 ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-red-500/20 border-red-500/40 text-red-300'} px-2.5 py-1 rounded-md border font-bold">
              Available: <strong>${bus.availableSeats}</strong>
            </span>
          </div>
        </div>

        <!-- 3-Section Crowd Heatmap Bar (Section 6) -->
        <div class="grid grid-cols-3 gap-2">
          <div class="p-2 rounded-xl border text-center ${getSecClass(sec.front)}">
            <div class="text-[10px] uppercase font-bold text-slate-400">Front Section</div>
            <div class="text-lg font-black mt-0.5">${sec.front}%</div>
            <div class="text-[9px] text-slate-300">Cabin & Doors</div>
          </div>
          <div class="p-2 rounded-xl border text-center ${getSecClass(sec.middle)}">
            <div class="text-[10px] uppercase font-bold text-slate-400">Middle Section</div>
            <div class="text-lg font-black mt-0.5">${sec.middle}%</div>
            <div class="text-[9px] text-slate-300">Central Aisle Density</div>
          </div>
          <div class="p-2 rounded-xl border text-center ${getSecClass(sec.rear)}">
            <div class="text-[10px] uppercase font-bold text-slate-400">Rear Section</div>
            <div class="text-lg font-black mt-0.5">${sec.rear}%</div>
            <div class="text-[9px] text-slate-300">Exit & Access Bay</div>
          </div>
        </div>

        <!-- 3-Door Crowd Monitor (Section 7) -->
        <div class="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div class="flex items-center gap-1.5 font-bold text-slate-300">
            <i class="fa-solid fa-door-open text-blue-400"></i> Door Monitors:
          </div>
          <div class="flex items-center gap-3">
            <div>Front Door: ${getDoorBadge(doors.frontDoorCrowd)}</div>
            <div>Middle Door: ${getDoorBadge(doors.middleDoorCrowd)}</div>
            <div>Rear Door: ${getDoorBadge(doors.rearDoorCrowd)}</div>
          </div>
          ${doors.middleDoorCrowd > 75 || doors.rearDoorCrowd > 75 || doors.frontDoorCrowd > 75 ? `
            <div class="w-full text-[11px] text-red-300 font-bold bg-red-950/60 p-1.5 rounded border border-red-500/40 flex items-center gap-1.5 mt-1">
              <i class="fa-solid fa-triangle-exclamation text-amber-400 animate-pulse"></i>
              <span>Door Crowd Warning: Avoid doorway boarding. Move along aisle.</span>
            </div>
          ` : ''}
        </div>

        <!-- Interactive Bus Chassis Schematic -->
        <div class="bus-outer-frame relative bg-slate-950 rounded-2xl border-2 border-slate-700 shadow-2xl p-3 overflow-x-auto">
          
          <!-- Direction Indicator -->
          <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-800 text-slate-300 px-3 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-widest border border-slate-600 shadow flex items-center gap-1.5 z-10">
            <i class="fa-solid fa-arrow-left text-emerald-400"></i> FRONT / DIRECTION OF TRAVEL
          </div>

          <!-- Chassis Layout -->
          <div class="bus-interior-chassis min-w-[620px] flex items-stretch gap-2 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-3 rounded-xl border border-slate-800 mt-2">
            
            <!-- FRONT CABIN: Driver, Entrance Door, Conductor -->
            <div class="cabin-section w-32 flex flex-col justify-between border-r-2 border-dashed border-slate-700/80 pr-2">
              <div class="driver-booth bg-slate-800/90 border border-slate-600 rounded-lg p-2 text-center shadow">
                <div class="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                  <i class="fa-solid fa-dharmachakra"></i> Driver
                </div>
                <div class="w-8 h-8 mx-auto bg-amber-500/20 border border-amber-500/40 rounded-full flex items-center justify-center text-amber-300 text-xs">
                  <i class="fa-solid fa-user-tie"></i>
                </div>
                <div class="text-[9px] text-slate-300 mt-1 truncate" title="${bus.driverName}">${bus.driverName}</div>
              </div>

              <div class="front-door-area my-2 p-1.5 rounded-md bg-emerald-950/40 border border-emerald-500/30 text-center">
                <div class="text-[9px] font-bold text-emerald-400 uppercase flex items-center justify-center gap-1">
                  <i class="fa-solid fa-door-open"></i> Front Door
                </div>
                <div class="text-[8px] text-slate-300 mt-0.5">${doors.frontDoorCrowd}% crowd</div>
              </div>

              <div class="conductor-booth bg-slate-800/70 border border-slate-700 rounded-lg p-1.5 text-center">
                <div class="text-[9px] font-bold text-sky-400 uppercase">Conductor</div>
                <div class="w-6 h-6 mx-auto bg-sky-500/20 border border-sky-500/30 rounded-full flex items-center justify-center text-sky-300 text-[10px] mt-1">
                  <i class="fa-solid fa-id-badge"></i>
                </div>
                <div class="text-[8px] text-slate-400 mt-0.5 truncate">${bus.conductorName}</div>
              </div>
            </div>

            <!-- PASSENGER SEATING & CENTRAL AISLE (Rows 1 to 8) -->
            <div class="seating-deck flex-1 flex flex-col justify-between py-1">
              
              <!-- Left Side Seats -->
              <div class="seats-row flex items-center justify-between gap-1">
                ${this.renderSeatBlock(seats, [1, 5, 9, 13, 17, 21, 25, 29])}
              </div>
              <div class="seats-row flex items-center justify-between gap-1 mt-1">
                ${this.renderSeatBlock(seats, [2, 6, 10, 14, 18, 22, 26, 30])}
              </div>

              <!-- Central Aisle with Section Heatmap & Standing Dots -->
              <div class="central-aisle my-3 relative py-2 rounded-lg bg-slate-800/40 border border-slate-700/60 flex items-center justify-between px-3">
                <div class="absolute left-2 top-0.5 text-[8px] font-mono tracking-widest text-slate-400 uppercase">
                  Central Standing Aisle
                </div>

                <div class="aisle-zone flex-1 flex items-center justify-center gap-1.5 px-2 border-r border-slate-700/50">
                  <div class="zone-tag text-[8px] text-slate-400">Front</div>
                  <div class="standing-dots-cluster flex items-center gap-1 flex-wrap max-w-[80px]">
                    ${this.renderStandingDots(frontStanding)}
                  </div>
                  <span class="text-[9px] font-bold px-1 rounded bg-slate-800 text-slate-200">
                    ${frontStanding} st.
                  </span>
                </div>

                <div class="aisle-zone flex-1 flex items-center justify-center gap-1.5 px-2 border-r border-slate-700/50">
                  <div class="zone-tag text-[8px] text-slate-400">Middle</div>
                  <div class="standing-dots-cluster flex items-center gap-1 flex-wrap max-w-[90px]">
                    ${this.renderStandingDots(midStanding)}
                  </div>
                  <span class="text-[9px] font-bold px-1 rounded bg-slate-800 text-slate-200">
                    ${midStanding} st.
                  </span>
                </div>

                <div class="aisle-zone flex-1 flex items-center justify-center gap-1.5 px-2">
                  <div class="zone-tag text-[8px] text-slate-400">Rear</div>
                  <div class="standing-dots-cluster flex items-center gap-1 flex-wrap max-w-[80px]">
                    ${this.renderStandingDots(rearStanding)}
                  </div>
                  <span class="text-[9px] font-bold px-1 rounded bg-slate-800 text-slate-200">
                    ${rearStanding} st.
                  </span>
                </div>
              </div>

              <!-- Right Side Seats -->
              <div class="seats-row flex items-center justify-between gap-1 mb-1">
                ${this.renderSeatBlock(seats, [3, 7, 11, 15, 19, 23, 27, 31])}
              </div>
              <div class="seats-row flex items-center justify-between gap-1">
                ${this.renderSeatBlock(seats, [4, 8, 12, 16, 20, 24, 28, 32])}
              </div>

            </div>

            <!-- REAR CABIN: Wheelchair Bay, Middle/Rear Door, Emergency Exit -->
            <div class="rear-section w-32 flex flex-col justify-between border-l-2 border-dashed border-slate-700/80 pl-2">
              <div class="wheelchair-bay bg-blue-950/40 border border-blue-500/40 rounded-lg p-1.5 text-center">
                <div class="text-[9px] font-bold text-blue-400 uppercase flex items-center justify-center gap-1">
                  <i class="fa-solid fa-wheelchair"></i> Bay W1
                </div>
                <div class="text-[8px] text-blue-300 mt-0.5">Pram / Ramp Access</div>
              </div>

              <div class="rear-door-area my-2 p-1.5 rounded-md bg-amber-950/40 border border-amber-500/30 text-center">
                <div class="text-[9px] font-bold text-amber-400 uppercase flex items-center justify-center gap-1">
                  <i class="fa-solid fa-door-open"></i> Rear Exit Door
                </div>
                <div class="text-[8px] text-slate-300 mt-0.5">${doors.rearDoorCrowd}% crowd</div>
              </div>

              <div class="emergency-exit bg-red-950/30 border border-red-500/30 rounded-lg p-1 text-center">
                <div class="text-[8px] font-bold text-red-400 uppercase">Emergency Exit</div>
                <div class="text-[7px] text-slate-400">Safety Hammer</div>
              </div>
            </div>

          </div>
        </div>

        <!-- Legend / Key Bar -->
        <div class="blueprint-legend pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[10px]">
          <div class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded bg-emerald-500 inline-block"></span><span class="text-slate-300">Available</span></div>
          <div class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded bg-rose-600 inline-block"></span><span class="text-slate-300">Occupied</span></div>
          <div class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded bg-pink-500 inline-block"></span><span class="text-slate-300">Pregnant</span></div>
          <div class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded bg-amber-500 inline-block"></span><span class="text-slate-300">Senior</span></div>
          <div class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded bg-purple-500 inline-block"></span><span class="text-slate-300">Women</span></div>
          <div class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded bg-sky-500 inline-block"></span><span class="text-slate-300">Disabled</span></div>
          <div class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block"></span><span class="text-slate-300">Standing Dot</span></div>
        </div>

      </div>
    `;

    container.innerHTML = html;
  },

  renderSeatBlock: function(seats, seatNumbers) {
    return seatNumbers.map(num => {
      const seat = seats.find(s => s.number === num);
      if (!seat) return '';

      const isHighlight = this.isSeatHighlighted(seat);
      const bgClass = this.getSeatColorClass(seat);

      return `
        <button 
          type="button" 
          onclick="RideSenseBlueprint.showSeatDetails(${seat.number})"
          class="seat-btn relative w-9 h-8 rounded flex flex-col items-center justify-center transition-all transform hover:scale-105 active:scale-95 shadow-sm border ${bgClass} ${isHighlight ? 'ring-2 ring-yellow-300 animate-pulse' : ''}"
          title="Seat S${seat.number} - ${seat.label} (${seat.occupied ? 'Occupied' : 'Available'})"
        >
          <span class="text-[8px] font-bold leading-none">${seat.id}</span>
          <i class="fa-solid ${seat.icon} text-[9px] mt-0.5 opacity-90"></i>
          ${isHighlight ? '<span class="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-yellow-400"></span>' : ''}
        </button>
      `;
    }).join('');
  },

  getSeatColorClass: function(seat) {
    if (seat.occupied) {
      return "bg-rose-700/80 border-rose-500/80 text-rose-100 hover:bg-rose-600";
    }

    switch (seat.type) {
      case "pregnant":
        return "bg-pink-600/90 border-pink-400 text-white font-bold hover:bg-pink-500";
      case "elderly":
        return "bg-amber-600/90 border-amber-400 text-white font-bold hover:bg-amber-500";
      case "women":
        return "bg-purple-600/80 border-purple-400 text-white hover:bg-purple-500";
      case "disabled":
        return "bg-sky-600/90 border-sky-400 text-white font-bold hover:bg-sky-500";
      default:
        return "bg-emerald-600/90 border-emerald-400 text-white hover:bg-emerald-500";
    }
  },

  isSeatHighlighted: function(seat) {
    if (seat.occupied) return false;
    if (this.activePriorityFilter === "pregnant" && seat.type === "pregnant") return true;
    if (this.activePriorityFilter === "elderly" && seat.type === "elderly") return true;
    if (this.activePriorityFilter === "disabled" && (seat.type === "disabled" || seat.type === "elderly")) return true;
    if (this.activePriorityFilter === "need_seat" && !seat.occupied) return true;
    return false;
  },

  renderStandingDots: function(count) {
    let dots = '';
    const safeCount = Math.min(count, 10);
    for (let i = 0; i < safeCount; i++) {
      dots += `<span class="w-1.5 h-1.5 rounded-full bg-amber-400/90 inline-block" title="Standing Passenger"></span>`;
    }
    return dots;
  },

  showSeatDetails: function(seatNumber) {
    if (!this.activeBus) return;
    const seats = RideSenseData.createSeatLayout(this.activeBus);
    const seat = seats.find(s => s.number === seatNumber);
    if (!seat) return;

    const modal = document.getElementById("seatDetailModal");
    const content = document.getElementById("seatDetailContent");
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="text-center p-4">
        <div class="w-12 h-12 mx-auto rounded-full flex items-center justify-center text-xl ${seat.occupied ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'}">
          <i class="fa-solid ${seat.icon}"></i>
        </div>
        <h3 class="text-base font-bold text-white mt-2">Seat ${seat.id} (${seat.label})</h3>

        <div class="mt-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-left text-xs space-y-1.5">
          <div class="flex justify-between"><span class="text-slate-400">Status:</span> <strong class="${seat.occupied ? 'text-rose-400' : 'text-emerald-400'}">${seat.occupied ? 'Occupied' : 'Available'}</strong></div>
          <div class="flex justify-between"><span class="text-slate-400">Category:</span> <span class="text-slate-200 capitalize">${seat.type}</span></div>
          <div class="flex justify-between"><span class="text-slate-400">Sensor:</span> <span class="text-slate-200 font-mono text-[11px]">${seat.occupied ? 'Pressure Active' : 'Sensor Clear'}</span></div>
        </div>

        <div class="mt-4 flex gap-2">
          ${!seat.occupied ? `
            <button onclick="RideSenseApp.showToast('Seat ${seat.id} claimed for boarding!', 'success'); RideSenseBlueprint.closeSeatDetails();" class="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition">
              Board for this Seat
            </button>
          ` : ''}
          <button onclick="RideSenseBlueprint.closeSeatDetails()" class="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition border border-slate-700">
            Close
          </button>
        </div>
      </div>
    `;

    modal.classList.remove("hidden");
  },

  closeSeatDetails: function() {
    const modal = document.getElementById("seatDetailModal");
    if (modal) modal.classList.add("hidden");
  }
};

window.RideSenseBlueprint = RideSenseBlueprint;
