// RideSense Main Application Orchestrator
// "Smart Travel. Smarter Buses. Better Journeys."
const RideSenseApp = {
  activeBus: null,
activePortal: "home", // "home" | "passenger" | "tourist" | "driver" | "admin"  activeCorridor: "all",
  activePassengerType: "general",
  selectedOrigin: "Kanyakumari Bus Stand",
  selectedDestination: "Vivekananda Ferry Area",
  onboardBus: null, // Set when passenger clicks "Board Now"
  activeGetOffStop: null,
  lowNetworkMode: false,
  favourites: JSON.parse(localStorage.getItem("ridesense_favourites") || "[]"),

  notifications: [
    { id: 1, type: "critical", title: "Tourist Surge Alert", msg: "Bus 4A has reached 92% occupancy near Vivekananda Ferry jetty.", time: "1 min ago", icon: "fa-ban", color: "text-red-400" },
    { id: 2, type: "info", title: "Seat Availability", msg: "Bus 1A currently has 12 available seats on Tourist Loop.", time: "3 min ago", icon: "fa-chair", color: "text-emerald-400" },
    { id: 3, type: "warning", title: "Crowd Increasing", msg: "Heavy boarding surge expected at Suchindram Temple (+8 boarders).", time: "5 min ago", icon: "fa-arrow-trend-up", color: "text-amber-400" },
    { id: 4, type: "purple", title: "Priority Recommendation", msg: "Elderly & Family tourists are advised to take Bus 2A with open seating.", time: "7 min ago", icon: "fa-person-cane", color: "text-purple-400" },
    { id: 5, type: "warning", title: "Route Diversion", msg: "Bus 19B diverted via Swami Sannathi street due to festival queue.", time: "10 min ago", icon: "fa-diamond-turn-right", color: "text-amber-400" }
  ],

  init: function() {
    this.activeBus = RideSenseData.buses[0];

    const storedLang = localStorage.getItem("ridesense_lang") || "en";
    RideSenseI18n.currentLang = storedLang;

    this.renderHeaderClock();
    setInterval(() => this.renderHeaderClock(), 1000);

    this.renderCorridorFilters();
    this.renderBusList();
    this.renderActiveBusDetails();
    this.renderLEDMarquee();
    this.renderAroundMeList();
    this.renderTouristDashboard();
    this.renderSearchJourneySection();
    this.updateNotificationsUI();

    setTimeout(() => {
      RideSenseMap.init(this.activeBus);
      RideSenseBlueprint.init(this.activeBus);
      RideSenseCharts.init(this.activeBus);
      RideSenseDriver.init(this.activeBus);
      RideSenseAdmin.init();
      RideSenseI18n.applyToDOM();
    }, 150);

    window.addEventListener("ridesense_lang_changed", () => {
      this.renderLEDMarquee();
      this.renderActiveBusDetails();
      this.renderBusList();
      this.renderCorridorFilters();
      this.renderTouristDashboard();
      this.renderSearchJourneySection();
    });
  },

  // Portal Navigation
  switchPortal: function(portal) {
    this.activePortal = portal;
    
    const homeView = document.getElementById("homePageView"); 
    const passengerView = document.getElementById("passengerPortalView");
    const touristView = document.getElementById("touristPortalView");
    const driverView = document.getElementById("driverPortalView");
    const adminView = document.getElementById("adminPortalView");

    const tabPassenger = document.getElementById("tabBtnPassenger");
    const tabTourist = document.getElementById("tabBtnTourist");
    const tabDriver = document.getElementById("tabBtnDriver");
    const tabAdmin = document.getElementById("tabBtnAdmin");

    [homeView, passengerView, touristView, driverView, adminView].forEach(el => el && el.classList.add("hidden"));;
    [tabPassenger, tabTourist, tabDriver, tabAdmin].forEach(el => {
      if (el) {
        el.classList.remove("bg-blue-600", "text-white", "shadow-lg");
        el.classList.add("text-slate-300", "hover:bg-slate-800");
      }
    });

    if (portal === "passenger" && passengerView && tabPassenger) {
      passengerView.classList.remove("hidden");
      tabPassenger.classList.add("bg-blue-600", "text-white", "shadow-lg");
      tabPassenger.classList.remove("text-slate-300", "hover:bg-slate-800");
      setTimeout(() => { if (RideSenseMap.map) RideSenseMap.map.invalidateSize(); }, 200);
    } else if (portal === "tourist" && touristView && tabTourist) {
      touristView.classList.remove("hidden");
      tabTourist.classList.add("bg-blue-600", "text-white", "shadow-lg");
      tabTourist.classList.remove("text-slate-300", "hover:bg-slate-800");
      this.renderTouristDashboard();
    } else if (portal === "driver" && driverView && tabDriver) {
      driverView.classList.remove("hidden");
      tabDriver.classList.add("bg-blue-600", "text-white", "shadow-lg");
      tabDriver.classList.remove("text-slate-300", "hover:bg-slate-800");
      RideSenseDriver.render();
    } else if (portal === "admin" && adminView && tabAdmin) {
      adminView.classList.remove("hidden");
      tabAdmin.classList.add("bg-blue-600", "text-white", "shadow-lg");
      tabAdmin.classList.remove("text-slate-300", "hover:bg-slate-800");
      RideSenseAdmin.render();
    } else if (portal === "home" && homeView) {
      homeView.classList.remove("hidden");
    }
    
  },

  selectBus: function(busId) {
    const bus = RideSenseData.buses.find(b => b.id === busId);
    if (!bus) return;

    this.activeBus = bus;
    this.refreshActiveBusViews();
    this.renderBusList();

    if (this.activePortal !== "passenger") {
      this.switchPortal("passenger");
    }

    const target = document.getElementById("activeBusCardSection");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    this.showToast(`Selected Bus ${bus.routeNo} (${bus.routeName})`, "info");
  },

  refreshActiveBusViews: function() {
    if (!this.activeBus) return;
    this.renderActiveBusDetails();
    this.renderLEDMarquee();
    this.renderSearchJourneySection();
    RideSenseMap.setBus(this.activeBus);
    RideSenseBlueprint.setBus(this.activeBus);
    RideSenseCharts.updateCharts(this.activeBus);
    RideSenseDriver.setBus(this.activeBus);
  },

  setPassengerType: function(type) {
    this.activePassengerType = type;
    RideSenseBlueprint.setPriorityFilter(type);
    this.renderActiveBusDetails();
    this.renderSearchJourneySection();
    this.showToast(`Passenger type set to: ${RideSenseI18n.t("pt" + type.charAt(0).toUpperCase() + type.slice(1)) || type}`, "info");
  },

  renderHeaderClock: function() {
    const clockEl = document.getElementById("headerLiveClock");
    if (!clockEl) return;
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
    const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
    clockEl.innerHTML = `<i class="fa-regular fa-clock text-blue-400 mr-1.5"></i> ${dateStr} • <span class="font-mono text-white">${timeStr}</span>`;
  },

  renderLEDMarquee: function() {
    const marquee = document.getElementById("inBusLedMarquee");
    if (!marquee || !this.activeBus) return;
    const bus = this.activeBus;

    marquee.innerHTML = `
      <div class="flex items-center gap-4 whitespace-nowrap overflow-hidden">
        <div class="flex items-center gap-1.5 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          NEXT STOP / அடுத்த நிறுத்தம் / अगला स्टॉप:
        </div>
        <div class="text-xs md:text-sm font-mono font-bold text-amber-300 tracking-wider">
          ${bus.nextStop.toUpperCase()} • ETA: ${bus.etaMinutes} MINS • CROWD: ${bus.crowdPercentage}% (${bus.crowdLevel.toUpperCase()}) • SEATS VACANT: ${bus.availableSeats} • SPEED: ${bus.currentSpeed} KM/H
        </div>
      </div>
    `;
  },

  // Core Passenger Flow: Step 1 to Step 5 (Section 2)
  renderSearchJourneySection: function() {
    const container = document.getElementById("searchJourneyContainer");
    if (!container) return;

    const stops = RideSenseData.stops;

    container.innerHTML = `
      <div class="p-4 md:p-5 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div>
            <h2 class="text-base font-bold text-white flex items-center gap-2">
              <i class="fa-solid fa-magnifying-glass-location text-blue-400"></i> ${RideSenseI18n.t("journeyTitle")}
            </h2>
            <p class="text-xs text-slate-400 mt-0.5">Select origin and destination to calculate real-time SmartChoice recommendations</p>
          </div>
          <span class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono">STEP 1 ➔ 2 ➔ 3 ➔ 4 ➔ 5</span>
        </div>

        <!-- Step 1: From -> To Inputs -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div class="md:col-span-4">
            <label class="block text-xs font-bold text-slate-300 mb-1">${RideSenseI18n.t("searchFrom")}</label>
            <div class="relative">
              <i class="fa-solid fa-location-dot absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400"></i>
              <select id="journeyFromSelect" onchange="RideSenseApp.onJourneyInputChanged()" class="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-blue-500">
                ${stops.map(s => `<option value="${s.name}" ${s.name === this.selectedOrigin ? 'selected' : ''}>${s.name}</option>`).join('')}
              </select>
            </div>
          </div>

          <div class="md:col-span-4">
            <label class="block text-xs font-bold text-slate-300 mb-1">${RideSenseI18n.t("searchTo")}</label>
            <div class="relative">
              <i class="fa-solid fa-flag-checkered absolute left-3 top-1/2 -translate-y-1/2 text-rose-400"></i>
              <select id="journeyToSelect" onchange="RideSenseApp.onJourneyInputChanged()" class="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-blue-500">
                ${stops.map(s => `<option value="${s.name}" ${s.name === this.selectedDestination ? 'selected' : ''}>${s.name}</option>`).join('')}
              </select>
            </div>
          </div>

          <div class="md:col-span-4 flex gap-2">
            <button onclick="RideSenseApp.executeJourneySearch()" class="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition shadow flex items-center justify-center gap-1.5">
              <i class="fa-solid fa-route"></i> ${RideSenseI18n.t("searchBusesBtn")}
            </button>
            <button onclick="RideSenseApp.swapJourneyInputs()" class="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition" title="Swap From and To">
              <i class="fa-solid fa-arrow-right-arrow-left"></i>
            </button>
          </div>
        </div>

        <!-- Step 3 & 4: SmartChoice & Boarding Score Card -->
        <div id="smartChoiceCardBox" class="mt-3">
          ${this.renderSmartChoiceInlineCard()}
        </div>

        <!-- Step 5: Onboard Tracking Banner (if boarded) -->
        ${this.onboardBus ? `
          <div class="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div class="flex items-center gap-2.5">
              <span class="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
              <div>
                <strong class="text-emerald-300 block">${RideSenseI18n.t("onboardTrackingTitle")} — Onboard Bus ${this.onboardBus.routeNo}</strong>
                <span class="text-slate-300 text-[11px]">Destination: <strong class="text-white">${this.selectedDestination}</strong> • Stops Left: <strong class="text-amber-400">1 stop (~4 mins)</strong></span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="RideSenseVoice.announceGetOffAlert('${this.selectedDestination}')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold">
                <i class="fa-solid fa-bell mr-1"></i> Destination Alert
              </button>
              <button onclick="RideSenseApp.leaveOnboard()" class="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700">
                End Trip
              </button>
            </div>
          </div>
        ` : ''}

      </div>
    `;
  },

  onJourneyInputChanged: function() {
    const fromEl = document.getElementById("journeyFromSelect");
    const toEl = document.getElementById("journeyToSelect");
    if (fromEl) this.selectedOrigin = fromEl.value;
    if (toEl) this.selectedDestination = toEl.value;
    this.executeJourneySearch();
  },

  swapJourneyInputs: function() {
    const tmp = this.selectedOrigin;
    this.selectedOrigin = this.selectedDestination;
    this.selectedDestination = tmp;
    this.renderSearchJourneySection();
    this.executeJourneySearch();
  },

  selectOriginStop: function(stopName) {
    this.selectedOrigin = stopName;
    this.renderSearchJourneySection();
    this.executeJourneySearch();
    this.showToast(`Starting from: ${stopName}`, "info");
  },

  selectDestinationStop: function(stopName) {
    this.selectedDestination = stopName;
    this.renderSearchJourneySection();
    this.executeJourneySearch();
    this.showToast(`Destination set to: ${stopName}`, "info");
  },

  executeJourneySearch: function() {
    this.renderBusList();
    const box = document.getElementById("smartChoiceCardBox");
    if (box) {
      box.innerHTML = this.renderSmartChoiceInlineCard();
    }
  },

  // SmartChoice Calculation & Boarding Score Algorithm (Section 11, 12, 59, 60)
  calculateBoardingScore: function(bus, passengerType) {
    let score = 100;
    const whyPros = [];
    const whyCons = [];

    // 1. Crowd deduction
    if (bus.crowdPercentage > 90) {
      score -= 35;
      whyCons.push("Heavy passenger overcrowding (-35)");
    } else if (bus.crowdPercentage > 75) {
      score -= 20;
      whyCons.push("High standing crowd (-20)");
    } else if (bus.crowdPercentage <= 50) {
      score += 10;
      whyPros.push("Comfortable spacious seating (+10)");
    }

    // 2. Seats available
    if (bus.availableSeats === 0) {
      score -= 25;
      whyCons.push("Zero seats available (-25)");
    } else if (bus.availableSeats >= 10) {
      score += 15;
      whyPros.push(`Plenty of empty seats (${bus.availableSeats} available) (+15)`);
    }

    // 3. ETA penalty
    if (bus.etaMinutes <= 3) {
      score += 10;
      whyPros.push("Bus arriving immediately (+10)");
    } else if (bus.etaMinutes > 15) {
      score -= 15;
      whyCons.push("Long wait time (+15m)");
    }

    // 4. Passenger Type Modifiers (Section 13 & 59)
    if (passengerType === "elderly" || passengerType === "pregnant" || passengerType === "disabled") {
      if (bus.availableSeats === 0) {
        score -= 25;
        whyCons.push("Crucial: Priority passenger requires a seat (-25)");
      }
      if (bus.wheelchairAccessible) {
        score += 10;
        whyPros.push("Low-floor accessible ramp equipped (+10)");
      }
    } else if (passengerType === "need_seat") {
      if (bus.availableSeats === 0) {
        score -= 20;
        whyCons.push("No seats currently open for boarding (-20)");
      }
    }

    score = Math.max(15, Math.min(99, score));
    return { score, whyPros, whyCons };
  },

  renderSmartChoiceInlineCard: function() {
    const bus = this.activeBus;
    if (!bus) return '';

    // Find best alternative on the network
    const alternatives = RideSenseData.buses.filter(b => b.id !== bus.id && b.crowdPercentage < bus.crowdPercentage);
    const altBus = alternatives.length > 0 ? alternatives[0] : null;

    const currentAnalysis = this.calculateBoardingScore(bus, this.activePassengerType);
    const altAnalysis = altBus ? this.calculateBoardingScore(altBus, this.activePassengerType) : null;

    // Decision: Board vs Wait
    const shouldBoard = currentAnalysis.score >= 60 || !altBus || (bus.etaMinutes <= 3 && bus.crowdPercentage < 85);

    return `
      <div class="p-4 rounded-xl border ${shouldBoard ? 'bg-emerald-950/40 border-emerald-500/50' : 'bg-amber-950/50 border-amber-500/60'}">
        <div class="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-700/60 text-xs">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold uppercase text-[10px]">SMARTCHOICE</span>
            <span class="font-bold text-white">${RideSenseI18n.t("shouldIBoard")}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-slate-400">Boarding Score:</span>
            <span class="text-base font-black font-mono ${currentAnalysis.score >= 70 ? 'text-emerald-400' : (currentAnalysis.score >= 50 ? 'text-amber-400' : 'text-red-400')}">
              ${currentAnalysis.score}/100
            </span>
          </div>
        </div>

        <div class="mt-3 flex flex-col md:flex-row items-start justify-between gap-4">
          <div class="flex-1 space-y-1">
            <div class="text-lg font-black ${shouldBoard ? 'text-emerald-400' : 'text-amber-400'}">
              ${shouldBoard ? RideSenseI18n.t("recommendationBoard") : RideSenseI18n.t("recommendationWait")}
            </div>
            
            <p class="text-xs text-slate-200">
              ${shouldBoard 
                ? `Bus ${bus.routeNo} is arriving in ${bus.etaMinutes} mins with manageable crowd (${bus.crowdPercentage}%). Board now to reach on schedule.`
                : `Current Bus ${bus.routeNo} is crowded (${bus.crowdPercentage}%) with ${bus.availableSeats} seats. We recommend waiting ${altBus ? altBus.etaMinutes : 6} mins for Bus ${altBus ? altBus.routeNo : 'next'} which has ${altBus ? altBus.availableSeats : 12} empty seats!`}
            </p>

            <!-- Visible "Why?" explanation factors (Section 60) -->
            <div class="pt-2 text-[11px] space-y-1">
              <span class="font-bold text-slate-300 block">${RideSenseI18n.t("whyScore")}</span>
              ${currentAnalysis.whyPros.map(p => `<div class="text-emerald-400 flex items-center gap-1.5"><i class="fa-solid fa-check text-[10px]"></i> <span>${p}</span></div>`).join('')}
              ${currentAnalysis.whyCons.map(c => `<div class="text-red-400 flex items-center gap-1.5"><i class="fa-solid fa-xmark text-[10px]"></i> <span>${c}</span></div>`).join('')}
            </div>
          </div>

          <!-- Action Buttons (Section 2 Step 4) -->
          <div class="flex flex-wrap md:flex-col gap-2 shrink-0">
            <button onclick="RideSenseApp.boardActiveBus()" class="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5">
              <i class="fa-solid fa-person-walking-arrow-right"></i> ${RideSenseI18n.t("btnBoardNow")}
            </button>
            ${altBus ? `
              <button onclick="RideSenseApp.selectBus('${altBus.id}')" class="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-600 transition flex items-center justify-center gap-1.5">
                <i class="fa-solid fa-clock"></i> Wait for Bus ${altBus.routeNo} (${altBus.availableSeats} seats)
              </button>
            ` : ''}
            <button onclick="RideSenseVoice.announceSmartChoice('${shouldBoard ? 'board' : 'wait'}', '${bus.routeNo}', '${altBus ? altBus.routeNo : ''}')" class="py-2 px-3 bg-indigo-600/80 hover:bg-indigo-600 text-white font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5">
              <i class="fa-solid fa-volume-high"></i> Voice Rationale
            </button>
          </div>
        </div>
      </div>
    `;
  },

  boardActiveBus: function() {
    this.onboardBus = this.activeBus;
    this.renderSearchJourneySection();
    this.showToast(`Boarded Bus ${this.onboardBus.routeNo}! Live onboard tracking started.`, "success");
    RideSenseVoice.announceBus(this.onboardBus);
  },

  leaveOnboard: function() {
    this.onboardBus = null;
    this.renderSearchJourneySection();
    this.showToast("Trip completed. Thank you for travelling with RideSense!", "info");
  },

  checkDestinationAlarm: function(currentStopName) {
    if (!this.selectedDestination) return;
    if (currentStopName.toLowerCase().includes(this.selectedDestination.toLowerCase()) || 
        this.selectedDestination.toLowerCase().includes(currentStopName.toLowerCase())) {
      RideSenseVoice.announceGetOffAlert(this.selectedDestination);
      alert(`🔔 GET READY TO GET DOWN!\n\nYour bus has reached "${this.selectedDestination}". Please prepare to alight.`);
    }
  },

  // Around Me Radar Section (Section 16 & 17)
  renderAroundMeList: function() {
    const container = document.getElementById("aroundMeListContainer");
    if (!container) return;

    let items = [];

    // Add Bus Stops
    RideSenseData.stops.forEach(s => {
      items.push({
        name: s.name,
        category: "Bus Stops",
        distance: "400 m",
        icon: "fa-bus",
        lat: s.lat,
        lng: s.lng,
        action: () => RideSenseMap.map.setView([s.lat, s.lng], 16)
      });
    });

    // Add Tourist Places
    RideSenseData.touristPlaces.forEach(p => {
      items.push({
        name: p.name,
        category: "Tourist Places",
        distance: p.walkingDistance || "600 m",
        icon: "fa-landmark",
        lat: p.lat,
        lng: p.lng,
        action: () => RideSenseMap.map.setView([p.lat, p.lng], 16)
      });
    });

    // Add Simulated POIs around user location if present
    if (RideSenseMap.userLocation) {
      const userPois = RideSenseData.generateNearbyPoisForUser(RideSenseMap.userLocation.lat, RideSenseMap.userLocation.lng);
      userPois.forEach(poi => {
        items.push({
          name: poi.name,
          category: poi.category,
          distance: poi.distance,
          icon: poi.icon,
          lat: poi.lat,
          lng: poi.lng,
          action: () => RideSenseMap.map.setView([poi.lat, poi.lng], 16)
        });
      });
    }

    // Filter by active category
    if (this.activeAroundMeCategory && this.activeAroundMeCategory !== "All") {
      items = items.filter(i => i.category.toLowerCase().includes(this.activeAroundMeCategory.toLowerCase()));
    }

    container.innerHTML = `
      <div class="space-y-2">
        <div class="flex items-center justify-between text-xs pb-1 border-b border-slate-700">
          <span class="font-bold text-slate-300">Nearby Transit & Landmarks (${items.length})</span>
          <span class="text-emerald-400 font-mono text-[11px]">Radius: ${RideSenseMap.activeRadiusMeters}m</span>
        </div>
        <div class="space-y-1.5 max-h-64 overflow-y-auto pr-1">
          ${items.map(item => `
            <div onclick="RideSenseMap.map.setView([${item.lat}, ${item.lng}], 16)" class="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 cursor-pointer flex items-center justify-between transition text-xs">
              <div class="flex items-center gap-2">
                <i class="fa-solid ${item.icon} text-blue-400 text-sm w-4 text-center"></i>
                <div>
                  <div class="font-bold text-white text-xs truncate max-w-[180px]">${item.name}</div>
                  <div class="text-[10px] text-slate-400">${item.category}</div>
                </div>
              </div>
              <span class="text-emerald-400 font-mono text-[11px] font-bold">${item.distance}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  filterAroundMe: function(category) {
    this.activeAroundMeCategory = category;
    this.renderAroundMeList();
  },

  // Tourist Mode Dashboard (Section 21 to 28)
  renderTouristDashboard: function() {
    const container = document.getElementById("touristPlacesGrid");
    if (!container) return;

    const places = RideSenseData.touristPlaces;

    container.innerHTML = places.map(place => `
      <div class="tourist-card p-4 rounded-2xl bg-slate-900 border border-slate-700/80 hover:border-slate-600 transition shadow-xl flex flex-col justify-between space-y-3">
        <div>
          <div class="flex items-center justify-between text-xs text-slate-400">
            <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px] uppercase">
              ${place.category}
            </span>
            <span class="text-slate-400"><i class="fa-solid fa-person-walking mr-1"></i> ${place.walkingDistance} walk</span>
          </div>

          <h3 class="text-base font-bold text-white mt-2">${RideSenseI18n.currentLang === 'ta' ? place.nameTa : (RideSenseI18n.currentLang === 'hi' ? place.nameHi : place.name)}</h3>
          <p class="text-xs text-slate-400 mt-1 line-clamp-2">${RideSenseI18n.currentLang === 'ta' ? place.descriptionTa : (RideSenseI18n.currentLang === 'hi' ? place.descriptionHi : place.description)}</p>

          <div class="mt-3 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs space-y-1">
            <div class="flex justify-between">
              <span class="text-slate-400">Nearest Bus Stop:</span>
              <strong class="text-slate-200">${place.nearestStopName}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Recommended Demo Bus:</span>
              <strong class="text-blue-400 font-bold">Bus ${place.recommendedBusId}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Estimated Journey:</span>
              <span class="text-amber-400 font-mono font-bold">${place.journeyTime}</span>
            </div>
          </div>
        </div>

        <div class="flex gap-2 pt-2 border-t border-slate-800 text-xs font-bold">
          <button onclick="RideSenseApp.openHowToReachModal('${place.id}')" class="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition">
            How to Reach
          </button>
          <button onclick="RideSenseVoice.announceTouristPlace(RideSenseData.touristPlaces.find(p=>p.id==='${place.id}'))" class="py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition" title="Listen Audio Guide">
            <i class="fa-solid fa-volume-high"></i>
          </button>
        </div>
      </div>
    `).join('');
  },

  openHowToReachModal: function(placeId) {
    const place = RideSenseData.touristPlaces.find(p => p.id === placeId);
    if (!place) return;

    const bus = RideSenseData.buses.find(b => b.routeNo === place.recommendedBusId) || RideSenseData.buses[0];

    const modal = document.getElementById("howToReachModal");
    const content = document.getElementById("howToReachModalContent");
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="p-4 text-left space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-700">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <i class="fa-solid fa-location-dot"></i>
            </div>
            <div>
              <h3 class="text-base font-bold text-white">${place.name}</h3>
              <span class="text-xs text-slate-400">How Do I Reach Guide</span>
            </div>
          </div>
          <button onclick="RideSenseApp.closeModal('howToReachModal')" class="text-slate-400 hover:text-white text-lg">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2 text-xs">
          <div class="flex justify-between"><span class="text-slate-400">Destination:</span> <strong class="text-white">${place.name}</strong></div>
          <div class="flex justify-between"><span class="text-slate-400">Nearest Bus Stop:</span> <strong class="text-emerald-400">${place.nearestStopName}</strong></div>
          <div class="flex justify-between"><span class="text-slate-400">Walking from Stop:</span> <strong class="text-white">${place.walkingDistance}</strong></div>
          <div class="flex justify-between"><span class="text-slate-400">Approximate Travel:</span> <span class="text-amber-400 font-mono font-bold">${place.journeyTime}</span></div>
          <div class="flex justify-between"><span class="text-slate-400">Typical Visit Time:</span> <span class="text-slate-300">${place.approxVisitTime}</span></div>
        </div>

        <!-- Recommended Demo Bus Card -->
        <div class="p-3.5 rounded-xl bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-500/40 space-y-2 text-xs">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold text-blue-300 uppercase">Recommended Demo Bus</span>
            <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">⭐ Tourist Friendly</span>
          </div>
          <div class="text-sm font-bold text-white">Bus ${bus.routeNo} (${bus.routeName})</div>
          <div class="grid grid-cols-3 gap-2 text-center pt-1">
            <div class="p-1.5 rounded bg-slate-800/80"><span class="text-slate-400 text-[10px] block">ETA</span><strong class="text-amber-400">${bus.etaMinutes}m</strong></div>
            <div class="p-1.5 rounded bg-slate-800/80"><span class="text-slate-400 text-[10px] block">Crowd</span><strong class="text-emerald-400">${bus.crowdPercentage}%</strong></div>
            <div class="p-1.5 rounded bg-slate-800/80"><span class="text-slate-400 text-[10px] block">Seats</span><strong class="text-emerald-400">${bus.availableSeats}</strong></div>
          </div>
        </div>

        <div class="flex flex-wrap gap-2 text-xs font-bold">
          <button onclick="RideSenseApp.selectBus('${bus.id}'); RideSenseApp.closeModal('howToReachModal');" class="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow transition">
            <i class="fa-solid fa-map-pin mr-1"></i> Track This Bus
          </button>
          <button onclick="RideSenseVoice.announceTouristPlace(RideSenseData.touristPlaces.find(p=>p.id==='${place.id}'))" class="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition">
            <i class="fa-solid fa-volume-high mr-1"></i> Voice Guide
          </button>
        </div>
      </div>
    `;

    modal.classList.remove("hidden");
  },

  // Corridor Filters
  renderCorridorFilters: function() {
    const container = document.getElementById("corridorTabsContainer");
    if (!container) return;

    const corridors = RideSenseData.corridors;
    container.innerHTML = corridors.map(c => `
      <button 
        onclick="RideSenseApp.filterCorridor('${c.id}')"
        class="corridor-tab px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition border ${this.activeCorridor === c.id ? 'bg-blue-600 text-white border-blue-500 shadow-md' : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'}"
      >
        ${RideSenseI18n.currentLang === 'ta' && c.nameTa ? c.nameTa : (RideSenseI18n.currentLang === 'hi' && c.nameHi ? c.nameHi : c.name)}
      </button>
    `).join('');
  },

  filterCorridor: function(corridorId) {
    this.activeCorridor = corridorId;
    this.renderCorridorFilters();
    this.renderBusList();
  },

  // Bus List Cards
  renderBusList: function() {
    const container = document.getElementById("busListContainer");
    if (!container) return;

    let buses = RideSenseData.buses;

    if (this.activeCorridor !== "all") {
      buses = buses.filter(b => b.corridorId === this.activeCorridor);
    }

    const searchInput = document.getElementById("busSearchInput");
    if (searchInput && searchInput.value.trim() !== "") {
      const q = searchInput.value.toLowerCase().trim();
      buses = buses.filter(b => 
        b.routeNo.toLowerCase().includes(q) ||
        b.routeName.toLowerCase().includes(q) ||
        b.origin.toLowerCase().includes(q) ||
        b.destination.toLowerCase().includes(q)
      );
    }

    if (buses.length === 0) {
      container.innerHTML = `
        <div class="col-span-full p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400">
          <i class="fa-solid fa-bus text-3xl mb-2 text-slate-500"></i>
          <p class="text-sm font-semibold">${RideSenseI18n.t("noBusesFound")}</p>
        </div>
      `;
      return;
    }

    container.innerHTML = buses.map(bus => {
      const isSelected = this.activeBus && this.activeBus.id === bus.id;
      const crowdCfg = RideSenseData.crowdConfig[bus.crowdLevel] || RideSenseData.crowdConfig.comfortable;
      const isFav = this.favourites.includes(bus.routeNo);

      return `
        <div class="bus-card relative p-4 rounded-2xl transition-all cursor-pointer border ${isSelected ? 'bg-slate-800/95 border-blue-500 shadow-2xl ring-2 ring-blue-500/50' : 'bg-slate-900/80 border-slate-700/80 hover:bg-slate-800/70 hover:border-slate-600'}" onclick="RideSenseApp.selectBus('${bus.id}')">
          
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <span class="text-lg font-black text-white font-mono">Bus ${bus.routeNo}</span>
              ${bus.isTouristFriendly ? `
                <span class="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  ⭐ Tourist
                </span>
              ` : ''}
              ${bus.acBus ? `
                <span class="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
                  AC
                </span>
              ` : ''}
            </div>

            <div class="flex items-center gap-1.5">
              <button onclick="event.stopPropagation(); RideSenseApp.toggleFavourite('${bus.routeNo}')" class="text-sm ${isFav ? 'text-rose-500' : 'text-slate-500 hover:text-rose-400'}">
                <i class="fa-solid fa-heart"></i>
              </button>
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold" style="background-color: ${crowdCfg.color}25; color: ${crowdCfg.color}; border: 1px solid ${crowdCfg.color}50;">
                ${bus.crowdPercentage}%
              </span>
            </div>
          </div>

          <div class="mt-2 text-xs font-semibold text-slate-200 truncate">
            ${RideSenseI18n.currentLang === 'ta' && bus.routeNameTa ? bus.routeNameTa : (RideSenseI18n.currentLang === 'hi' && bus.routeNameHi ? bus.routeNameHi : bus.routeName)}
          </div>
          <div class="text-[11px] text-slate-400 flex items-center justify-between mt-1">
            <span>Next: <strong class="text-slate-300">${bus.nextStop}</strong></span>
            <span class="text-amber-400 font-mono font-bold">ETA: ${bus.etaMinutes}m</span>
          </div>

          <div class="mt-3">
            <div class="flex justify-between text-[10px] text-slate-400 mb-1">
              <span>Occupancy</span>
              <span><strong>${bus.currentPassengers}</strong> / ${bus.capacity}</span>
            </div>
            <div class="w-full bg-slate-700/80 h-2 rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all duration-500" style="width: ${bus.crowdPercentage}%; background-color: ${crowdCfg.color};"></div>
            </div>
          </div>

          <div class="mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
            <div class="${bus.availableSeats > 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}">
              <i class="fa-solid fa-chair mr-1"></i> ${bus.availableSeats} seats empty
            </div>
            <div class="text-slate-300 font-mono font-bold">
              ₹${bus.baseFare}
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  toggleFavourite: function(busNo) {
    if (this.favourites.includes(busNo)) {
      this.favourites = this.favourites.filter(f => f !== busNo);
      this.showToast(`Removed Bus ${busNo} from favourites`, "info");
    } else {
      this.favourites.push(busNo);
      this.showToast(`Added Bus ${busNo} to favourites ❤️`, "success");
    }
    localStorage.setItem("ridesense_favourites", JSON.stringify(this.favourites));
    this.renderBusList();
  },

  // Active Bus Detail Hero Section
  renderActiveBusDetails: function() {
    const container = document.getElementById("activeBusCardSection");
    if (!container || !this.activeBus) return;

    const bus = this.activeBus;
    const crowdCfg = RideSenseData.crowdConfig[bus.crowdLevel] || RideSenseData.crowdConfig.comfortable;

    const totalBlocks = 10;
    const filledBlocks = Math.round((bus.crowdPercentage / 100) * totalBlocks);
    const emptyBlocks = totalBlocks - filledBlocks;
    const visualProgressBar = "█".repeat(filledBlocks) + "░".repeat(emptyBlocks);

    let html = `
      <div class="active-bus-hero bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 md:p-6 shadow-2xl space-y-4">
        
        <div class="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-700/70">
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-2xl md:text-3xl font-black text-white font-mono">Bus ${bus.routeNo}</span>
              <span class="text-xs px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono font-semibold">
                ${bus.regNo}
              </span>
              <span class="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                ${bus.platformBay}
              </span>
              ${bus.isTouristFriendly ? `
                <span class="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                  ⭐ Tourist Friendly
                </span>
              ` : ''}
            </div>
            <h3 class="text-sm md:text-base font-bold text-slate-200 mt-1.5 flex items-center gap-2">
              <i class="fa-solid fa-route text-blue-400"></i> ${bus.routeName}
            </h3>
            <div class="text-xs text-slate-400 mt-0.5 flex flex-wrap items-center gap-3">
              <span>Service: <strong>${bus.serviceType}</strong></span>
              <span>Driver: <strong>${bus.driverName} (★ ${bus.driverRating})</strong></span>
              <span>Speed: <strong>${bus.currentSpeed} km/h</strong></span>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button onclick="RideSenseVoice.announceBus(RideSenseApp.activeBus)" class="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow transition flex items-center gap-1.5">
              <i class="fa-solid fa-volume-high"></i> Voice Info
            </button>
            <button onclick="RideSenseApp.openTripShareModal()" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-600 transition flex items-center gap-1.5">
              <i class="fa-solid fa-share-nodes text-emerald-400"></i> Share Trip
            </button>
          </div>
        </div>

        <!-- 4-Level Crowd Progress & Visual Meter (Section 3) -->
        <div class="p-4 rounded-xl border ${bus.crowdPercentage > 90 ? 'bg-red-950/30 border-red-500/40' : (bus.crowdPercentage > 75 ? 'bg-orange-950/30 border-orange-500/40' : (bus.crowdPercentage > 60 ? 'bg-amber-950/20 border-amber-500/40' : 'bg-emerald-950/30 border-emerald-500/40'))} flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div class="flex-1 space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-xs uppercase font-bold tracking-wider text-slate-400">PRE-BOARDING CROWD STATUS</span>
              <span class="px-2 py-0.5 rounded text-[11px] font-black uppercase flex items-center gap-1" style="background-color: ${crowdCfg.color}20; color: ${crowdCfg.color}; border: 1px solid ${crowdCfg.color}40;">
                <i class="fa-solid ${crowdCfg.icon}"></i> ${crowdCfg.label}
              </span>
            </div>
            
            <div class="text-3xl md:text-4xl font-black font-mono text-white flex items-baseline gap-2">
              <span>${bus.crowdPercentage}%</span>
              <span class="text-sm font-sans font-normal text-slate-300">Occupancy</span>
            </div>

            <div class="font-mono text-base tracking-widest font-black" style="color: ${crowdCfg.color}">
              ${visualProgressBar} <span class="text-xs text-slate-300 ml-1">(${bus.crowdPercentage}%)</span>
            </div>

            <p class="text-xs font-medium text-slate-300 pt-1">
              👉 <strong>Recommendation:</strong> ${crowdCfg.advice}
            </p>
          </div>

          <div class="bg-slate-900/80 border border-slate-700/80 p-3 rounded-xl grid grid-cols-2 gap-2 text-center text-xs min-w-[220px]">
            <div class="p-2 rounded bg-slate-800/80">
              <span class="text-slate-400 text-[10px] block">Available Seats</span>
              <span class="text-lg font-black ${bus.availableSeats > 0 ? 'text-emerald-400' : 'text-rose-400'}">${bus.availableSeats}</span>
            </div>
            <div class="p-2 rounded bg-slate-800/80">
              <span class="text-slate-400 text-[10px] block">Seated Pass.</span>
              <span class="text-lg font-black text-blue-400">${bus.seated}</span>
            </div>
            <div class="p-2 rounded bg-slate-800/80">
              <span class="text-slate-400 text-[10px] block">Standing Pass.</span>
              <span class="text-lg font-black text-amber-400">${bus.standing}</span>
            </div>
            <div class="p-2 rounded bg-slate-800/80">
              <span class="text-slate-400 text-[10px] block">Total on Board</span>
              <span class="text-lg font-black text-white">${bus.currentPassengers} / ${bus.capacity}</span>
            </div>
          </div>
        </div>

        <!-- Passenger Type Selector (Section 13) -->
        <div class="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span class="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <i class="fa-solid fa-users text-pink-400"></i> ${RideSenseI18n.t("passengerTypePrompt")}
            </span>
            <span class="text-[11px] text-slate-400">Modifies SmartChoice algorithm & priority seating</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            ${[
              { id: "general", label: "General", icon: "fa-user" },
              { id: "need_seat", label: "Need a Seat", icon: "fa-chair" },
              { id: "elderly", label: "Elderly", icon: "fa-person-cane" },
              { id: "pregnant", label: "Pregnant", icon: "fa-baby" },
              { id: "disabled", label: "Disability", icon: "fa-wheelchair" },
              { id: "child", label: "With Child", icon: "fa-children" },
              { id: "family_tourist", label: "Family Tourist", icon: "fa-camera" }
            ].map(cat => `
              <button 
                onclick="RideSenseApp.setPassengerType('${cat.id}')"
                class="py-2 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 border ${this.activePassengerType === cat.id ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'}"
              >
                <i class="fa-solid ${cat.icon}"></i>
                <span class="truncate">${cat.label}</span>
              </button>
            `).join('')}
          </div>
        </div>

      </div>
    `;

    container.innerHTML = html;
  },

  // Modal handlers
  openTripShareModal: function() {
    const modal = document.getElementById("tripShareModal");
    const content = document.getElementById("tripShareModalContent");
    if (!modal || !content || !this.activeBus) return;
    const bus = this.activeBus;
    const shareUrl = `${window.location.origin}${window.location.pathname}?bus=${bus.routeNo}&token=RIDESENSE72`;

    content.innerHTML = `
      <div class="p-4 text-left space-y-3 text-xs">
        <div class="flex items-center justify-between pb-2 border-b border-slate-700">
          <h3 class="text-base font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-share-nodes text-emerald-400"></i> Share Live Bus Journey
          </h3>
          <button onclick="RideSenseApp.closeModal('tripShareModal')" class="text-slate-400 hover:text-white text-lg">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <p class="text-slate-300">Share your live bus location and crowd safety status with family:</p>
        <div class="p-2.5 rounded-lg bg-slate-800 border border-slate-700">
          <div class="font-bold text-white">Bus ${bus.routeNo} — ${bus.routeName}</div>
          <div class="text-slate-400 mt-0.5">ETA: ${bus.etaMinutes}m • Crowd: ${bus.crowdPercentage}%</div>
        </div>
        <div class="flex gap-2">
          <input type="text" readonly value="${shareUrl}" class="flex-1 bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-2 font-mono">
          <button onclick="navigator.clipboard.writeText('${shareUrl}'); RideSenseApp.showToast('Link copied to clipboard!', 'success');" class="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold">Copy</button>
        </div>
        <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(`I am travelling on RideSense Bus ${bus.routeNo} to ${bus.destination}. Track live: ${shareUrl}`)}" target="_blank" class="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 transition shadow">
          <i class="fa-brands fa-whatsapp text-lg"></i> Share on WhatsApp
        </a>
      </div>
    `;
    modal.classList.remove("hidden");
  },

  openSosModal: function() {
    const modal = document.getElementById("sosModal");
    const content = document.getElementById("sosModalContent");
    if (!modal || !content) return;
    const bus = this.activeBus;

    content.innerHTML = `
      <div class="p-4 text-center space-y-3">
        <div class="w-14 h-14 mx-auto rounded-full bg-red-600/20 border-2 border-red-500 flex items-center justify-center text-red-500 text-2xl animate-ping">
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <h3 class="text-lg font-black text-red-400">EMERGENCY ASSISTANCE (DEMO SOS)</h3>
        <p class="text-xs text-slate-300">Simulated emergency alert broadcast to TNSTC Transit Police & Control Room.</p>
        <div class="p-3 rounded-xl bg-slate-800/90 border border-slate-700 text-left text-xs space-y-1">
          <div>Bus: <strong class="text-white">${bus ? bus.routeNo : 'N/A'}</strong></div>
          <div>Location: <strong class="text-emerald-400 font-mono">${bus ? bus.currentLocation.lat.toFixed(4) + '°N, ' + bus.currentLocation.lng.toFixed(4) + '°E' : 'Live GPS'}</strong></div>
          <div>Status: <span class="text-amber-400 font-bold">DISPATCHING NEAREST PATROL</span></div>
        </div>
        <div class="grid grid-cols-2 gap-2 text-xs font-bold pt-2">
          <a href="tel:112" class="py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg flex items-center justify-center gap-1.5"><i class="fa-solid fa-phone"></i> Call 112</a>
          <a href="tel:1091" class="py-2.5 bg-pink-600 hover:bg-pink-500 text-white rounded-lg flex items-center justify-center gap-1.5"><i class="fa-solid fa-phone"></i> Women 1091</a>
        </div>
        <button onclick="RideSenseApp.closeModal('sosModal')" class="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold">Dismiss</button>
      </div>
    `;
    modal.classList.remove("hidden");
  },

  openLostFoundModal: function() {
    const modal = document.getElementById("lostFoundModal");
    const content = document.getElementById("lostFoundModalContent");
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="p-4 text-left space-y-3 text-xs">
        <div class="flex items-center justify-between pb-2 border-b border-slate-700">
          <h3 class="text-base font-bold text-white flex items-center gap-2"><i class="fa-solid fa-box-archive text-amber-400"></i> Lost & Found Desk</h3>
          <button onclick="RideSenseApp.closeModal('lostFoundModal')" class="text-slate-400 hover:text-white"><i class="fa-solid fa-xmark text-lg"></i></button>
        </div>
        <div class="space-y-2">
          ${RideSenseData.lostAndFoundItems.map(item => `
            <div class="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 flex items-start gap-2">
              <i class="fa-solid fa-bag-shopping text-blue-400 text-sm mt-0.5"></i>
              <div class="flex-1">
                <div class="flex justify-between font-bold text-white"><span>${item.item}</span> <span class="text-slate-400 text-[10px]">Bus ${item.bus}</span></div>
                <div class="text-slate-400 text-[11px] mt-0.5">${item.location} • ${item.date}</div>
                <div class="text-[10px] text-emerald-400 mt-1">Contact: ${item.contact}</div>
              </div>
            </div>
          `).join('')}
        </div>
        <button onclick="RideSenseApp.showToast('Lost item submission recorded (Demo).', 'success'); RideSenseApp.closeModal('lostFoundModal');" class="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg mt-2">
          Report New Lost Item
        </button>
      </div>
    `;
    modal.classList.remove("hidden");
  },

  openFeedbackModal: function() {
    const modal = document.getElementById("feedbackModal");
    const content = document.getElementById("feedbackModalContent");
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="p-4 text-left space-y-3 text-xs">
        <div class="flex items-center justify-between pb-2 border-b border-slate-700">
          <h3 class="text-base font-bold text-white flex items-center gap-2"><i class="fa-solid fa-star text-amber-400"></i> Rate Your Journey</h3>
          <button onclick="RideSenseApp.closeModal('feedbackModal')" class="text-slate-400 hover:text-white"><i class="fa-solid fa-xmark text-lg"></i></button>
        </div>
        <p class="text-slate-300">Help transit authorities improve your daily commute:</p>
        <div class="space-y-2">
          <div><label class="block text-slate-400 mb-1">Bus Number:</label><input type="text" value="Bus ${this.activeBus ? this.activeBus.routeNo : '1A'}" class="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs"></div>
          <div><label class="block text-slate-400 mb-1">Crowd Comfort:</label><select class="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs"><option>5 Stars - Very Spacious</option><option>4 Stars - Comfortable</option><option>3 Stars - Moderate</option><option>2 Stars - Heavy Rush</option><option>1 Star - Dangerous Overcrowding</option></select></div>
        </div>
        <button onclick="RideSenseApp.showToast('Thank you! Feedback logged for admin review.', 'success'); RideSenseApp.closeModal('feedbackModal');" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg mt-2">
          Submit Rating
        </button>
      </div>
    `;
    modal.classList.remove("hidden");
  },

  toggleLowNetworkMode: function() {
    this.lowNetworkMode = !this.lowNetworkMode;
    const msg = this.lowNetworkMode ? "Low-Network Mode: Enabled (Reduced map tiles, optimized data)" : "Low-Network Mode: Disabled";
    this.showToast(msg, "info");
    const btn = document.getElementById("lowNetworkToggleBtn");
    if (btn) {
      btn.classList.toggle("bg-amber-600", this.lowNetworkMode);
      btn.classList.toggle("bg-slate-900", !this.lowNetworkMode);
    }
  },

  toggleNotifications: function() {
    const drawer = document.getElementById("notificationsDrawer");
    if (drawer) drawer.classList.toggle("hidden");
  },

  updateNotificationsUI: function() {
    const badge = document.getElementById("notificationBadge");
    const container = document.getElementById("notificationsListContainer");
    if (badge) badge.textContent = this.notifications.length;
    if (!container) return;

    container.innerHTML = this.notifications.map(n => `
      <div class="p-2.5 rounded-lg bg-slate-800/90 border border-slate-700 flex items-start gap-2.5">
        <i class="fa-solid ${n.icon} ${n.color} text-sm mt-0.5 shrink-0"></i>
        <div class="flex-1">
          <div class="flex items-center justify-between">
            <span class="font-bold text-white text-xs">${n.title}</span>
            <span class="text-[10px] text-slate-400">${n.time}</span>
          </div>
          <p class="text-[11px] text-slate-300 mt-0.5">${n.msg}</p>
        </div>
      </div>
    `).join('');
  },

  showToast: function(message, type = "info") {
    const toast = document.getElementById("globalToast");
    const toastMsg = document.getElementById("globalToastMessage");
    const toastIcon = document.getElementById("globalToastIcon");
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;

    if (toastIcon) {
      if (type === "warning") toastIcon.className = "fa-solid fa-triangle-exclamation text-amber-400";
      else if (type === "success") toastIcon.className = "fa-solid fa-circle-check text-emerald-400";
      else toastIcon.className = "fa-solid fa-circle-info text-blue-400";
    }

    toast.classList.remove("hidden", "translate-y-12", "opacity-0");
    toast.classList.add("translate-y-0", "opacity-100");

    setTimeout(() => {
      toast.classList.remove("translate-y-0", "opacity-100");
      toast.classList.add("translate-y-12", "opacity-0");
      setTimeout(() => toast.classList.add("hidden"), 300);
    }, 3500);
  },

  closeModal: function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add("hidden");
  }
};

window.RideSenseApp = RideSenseApp;

document.addEventListener("DOMContentLoaded", () => {
  RideSenseApp.init();
  document.addEventListener("DOMContentLoaded", () => {
  RideSenseApp.init();
  RideSenseApp.switchPortal("home");
});
