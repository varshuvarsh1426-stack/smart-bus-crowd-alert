// RideSense Synchronized Demo Simulation Engine
// Shared State Controller for Passenger, Tourist, SmartChoice, Driver & Admin Portals
const RideSenseSimulation = {
  isRunning: false,
  timer: null,
  speedMultiplier: 1,
  tickCount: 0,

  start: function() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.updateControlsUI();
    RideSenseApp.showToast("▶ Live Demo Simulation started. GPS movement & passenger flow synchronized across all portals.", "info");

    this.timer = setInterval(() => {
      this.tick();
    }, 2500 / this.speedMultiplier);
  },

  pause: function() {
    if (!this.isRunning) return;
    this.isRunning = false;
    clearInterval(this.timer);
    this.timer = null;
    this.updateControlsUI();
    RideSenseApp.showToast("⏸ Simulation paused.", "info");
  },

  toggle: function() {
    if (this.isRunning) {
      this.pause();
    } else {
      this.start();
    }
  },

  reset: function() {
    this.pause();
    RideSenseData.buses.forEach(b => {
      b.etaMinutes = Math.floor(Math.random() * 5) + 3;
    });
    RideSenseApp.refreshActiveBusViews();
    RideSenseApp.showToast("Simulation telemetry reset to initial values.", "info");
  },

  setSpeed: function(speed) {
    this.speedMultiplier = speed;
    if (this.isRunning) {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.tick();
      }, 2500 / this.speedMultiplier);
    }
    this.updateControlsUI();
    RideSenseApp.showToast(`Simulation speed set to ${speed}x`, "info");
  },

  tick: function() {
    this.tickCount++;
    const bus = RideSenseApp.activeBus;
    if (!bus) return;

    // 1. Simulate bus GPS progression along coordinates
    const stopsServed = bus.stopsServed || [];
    const stops = RideSenseData.stops.filter(s => stopsServed.includes(s.id));
    
    if (stops.length > 1) {
      const currentStop = stops[bus.currentStopIndex % stops.length];
      const nextStopIndex = (bus.currentStopIndex + 1) % stops.length;
      const nextStop = stops[nextStopIndex];

      const latDelta = (nextStop.lat - currentStop.lat) * 0.08;
      const lngDelta = (nextStop.lng - currentStop.lng) * 0.08;

      bus.currentLocation.lat += latDelta;
      bus.currentLocation.lng += lngDelta;
    }

    // 2. Periodic Passenger Boarding & Alighting at stops
    if (this.tickCount % 4 === 0) {
      bus.currentSpeed = Math.floor(Math.random() * 10);
      bus.etaMinutes = Math.max(1, bus.etaMinutes - 1);

      const boarders = Math.floor(Math.random() * 6) + 1;
      const alighters = Math.floor(Math.random() * 4);
      const netChange = boarders - alighters;

      bus.currentPassengers = Math.max(12, Math.min(bus.capacity, bus.currentPassengers + netChange));
      bus.crowdPercentage = Math.round((bus.currentPassengers / bus.capacity) * 100);
      bus.crowdLevel = RideSenseData.getCrowdLevel(bus.crowdPercentage);

      bus.seated = Math.min(bus.seatingCapacity, bus.currentPassengers);
      bus.standing = Math.max(0, bus.currentPassengers - bus.seated);
      bus.availableSeats = Math.max(0, bus.seatingCapacity - bus.seated);

      // Section Heatmap updates (Section 6)
      if (bus.sectionCrowd) {
        bus.sectionCrowd.front = Math.min(100, Math.round(bus.crowdPercentage * 0.95));
        bus.sectionCrowd.middle = Math.min(100, Math.round(bus.crowdPercentage * 1.05));
        bus.sectionCrowd.rear = Math.min(100, Math.round(bus.crowdPercentage * 0.98));
      }

      // Door Sensor telemetry updates (Section 7)
      if (bus.doorStatus) {
        bus.doorStatus.frontDoorCrowd = Math.min(100, Math.round(bus.crowdPercentage * 0.90));
        bus.doorStatus.middleDoorCrowd = Math.min(100, Math.round(bus.crowdPercentage * 1.05));
        bus.doorStatus.rearDoorCrowd = Math.min(100, Math.round(bus.crowdPercentage * 0.95));
        bus.doorStatus.isSafeToDepart = bus.crowdPercentage < 90;
      }

      // Advance stop
      if (this.tickCount % 12 === 0 && stops.length > 0) {
        bus.currentStopIndex = (bus.currentStopIndex + 1) % stops.length;
        bus.currentStop = stops[bus.currentStopIndex].name;
        const upcomingIndex = (bus.currentStopIndex + 1) % stops.length;
        bus.nextStop = stops[upcomingIndex].name;
        bus.etaMinutes = Math.floor(Math.random() * 4) + 3;

        // Check Onboard Get-Off Alarm
        RideSenseApp.checkDestinationAlarm(bus.currentStop);
      }
    } else {
      bus.currentSpeed = Math.floor(Math.random() * 12) + 28;
    }

    // Refresh all views seamlessly using the shared state
    RideSenseApp.refreshActiveBusViews();
  },

  updateControlsUI: function() {
    const playBtn = document.getElementById("simPlayBtn");
    const playText = document.getElementById("simPlayText");
    const speed1Btn = document.getElementById("simSpeed1Btn");
    const speed2Btn = document.getElementById("simSpeed2Btn");

    if (playBtn && playText) {
      if (this.isRunning) {
        playBtn.classList.remove("bg-emerald-600", "hover:bg-emerald-500");
        playBtn.classList.add("bg-amber-600", "hover:bg-amber-500");
        playText.textContent = "Pause Demo";
        playBtn.querySelector("i").className = "fa-solid fa-pause";
      } else {
        playBtn.classList.remove("bg-amber-600", "hover:bg-amber-500");
        playBtn.classList.add("bg-emerald-600", "hover:bg-emerald-500");
        playText.textContent = "Start Live Demo";
        playBtn.querySelector("i").className = "fa-solid fa-play";
      }
    }

    if (speed1Btn && speed2Btn) {
      speed1Btn.className = `px-2 py-1 text-[11px] rounded ${this.speedMultiplier === 1 ? 'bg-blue-600 text-white font-bold' : 'bg-slate-800 text-slate-300'}`;
      speed2Btn.className = `px-2 py-1 text-[11px] rounded ${this.speedMultiplier === 2 ? 'bg-blue-600 text-white font-bold' : 'bg-slate-800 text-slate-300'}`;
    }
  }
};

window.RideSenseSimulation = RideSenseSimulation;
