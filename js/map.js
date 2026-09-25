// RideSense Interactive Map & Real Browser Geolocation Engine
const RideSenseMap = {
  map: null,
  userMarker: null,
  userAccuracyCircle: null,
  aroundMeCircle: null,
  busMarker: null,
  routePolyline: null,
  deviationPolyline: null,
  stopMarkers: [],
  placeMarkers: [],
  activeBus: null,
  userLocation: null,
  activeRadiusMeters: 1000,
  activeCategoryFilter: "All",

  init: function(bus) {
    this.activeBus = bus;
    const mapElement = document.getElementById("leafletMap");
    if (!mapElement) return;

    if (typeof L === "undefined") {
      setTimeout(() => this.init(bus), 300);
      return;
    }

    if (this.map) {
      this.map.remove();
    }

    // Default center on Kanyakumari Tourist Hub / Bus Stand
    const initialLat = bus ? bus.currentLocation.lat : 8.0880;
    const initialLng = bus ? bus.currentLocation.lng : 77.5450;

    this.map = L.map("leafletMap", {
      zoomControl: true,
      attributionControl: false
    }).setView([initialLat, initialLng], 14);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      subdomains: "abcd"
    }).addTo(this.map);

    this.renderStopsAndPlaces();
    this.renderRoute();
    this.renderBusMarker();
    this.updateGpsTelemetryOverlay();
  },

  setBus: function(bus) {
    this.activeBus = bus;
    if (!this.map) {
      this.init(bus);
      return;
    }
    this.renderRoute();
    this.updateBusMarker();
    this.updateGpsTelemetryOverlay();
  },

  // Real Browser Geolocation API Implementation (Section 14)
  requestRealLocation: function(callback) {
    const statusEl = document.getElementById("liveLocationStatus");
    if (statusEl) {
      statusEl.textContent = RideSenseI18n.t("locRequesting");
      statusEl.className = "text-amber-400 font-bold text-xs";
    }

    if (!navigator.geolocation) {
      const msg = RideSenseI18n.t("locFallback");
      RideSenseApp.showToast(msg, "warning");
      if (statusEl) statusEl.textContent = msg;
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        this.userLocation = { lat, lng, accuracy };

        // Center map on user
        if (this.map) {
          this.map.setView([lat, lng], 15);

          // Remove old user marker
          if (this.userMarker) this.map.removeLayer(this.userMarker);
          if (this.userAccuracyCircle) this.map.removeLayer(this.userAccuracyCircle);

          // Add animated user location pin
          const userIcon = L.divIcon({
            className: "custom-user-marker",
            html: `
              <div class="relative flex items-center justify-center">
                <div class="w-8 h-8 rounded-full bg-blue-500 opacity-40 animate-ping absolute"></div>
                <div class="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-xl relative flex items-center justify-center text-white text-[9px]">
                  <i class="fa-solid fa-person"></i>
                </div>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });

          this.userMarker = L.marker([lat, lng], { icon: userIcon, zIndexOffset: 2000 }).addTo(this.map);
          this.userMarker.bindPopup(`
            <div class="p-1 text-slate-900 font-sans text-xs">
              <strong>Your Live Location</strong><br>
              <span class="text-[10px] text-slate-500">Accuracy: ~${Math.round(accuracy)}m</span>
            </div>
          `).openPopup();

          this.userAccuracyCircle = L.circle([lat, lng], {
            radius: Math.min(accuracy, 200),
            color: "#3b82f6",
            fillColor: "#3b82f6",
            fillOpacity: 0.1,
            weight: 1
          }).addTo(this.map);

          this.renderAroundMeCircle();
        }

        if (statusEl) {
          statusEl.textContent = RideSenseI18n.t("locGranted");
          statusEl.className = "text-emerald-400 font-bold text-xs";
        }

        RideSenseApp.showToast("Real device location acquired!", "success");

        // Re-render stops & places including deterministic POIs so map is NOT empty
        this.renderStopsAndPlaces();
        RideSenseApp.renderAroundMeList();

        if (callback) callback(lat, lng);
      },
      error => {
        console.warn("Geolocation error:", error);
        const msg = RideSenseI18n.t("locDenied");
        RideSenseApp.showToast(msg, "warning");
        if (statusEl) {
          statusEl.textContent = msg;
          statusEl.className = "text-rose-400 font-bold text-xs";
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  },

  renderAroundMeCircle: function() {
    if (!this.map || !this.userLocation) return;
    if (this.aroundMeCircle) this.map.removeLayer(this.aroundMeCircle);

    this.aroundMeCircle = L.circle([this.userLocation.lat, this.userLocation.lng], {
      radius: this.activeRadiusMeters,
      color: "#10b981",
      dashArray: "4, 6",
      fillColor: "#10b981",
      fillOpacity: 0.05,
      weight: 1.5
    }).addTo(this.map);
  },

  setAroundMeRadius: function(meters) {
    this.activeRadiusMeters = meters;
    this.renderAroundMeCircle();
    RideSenseApp.renderAroundMeList();
  },

  renderStopsAndPlaces: function() {
    if (!this.map) return;

    this.stopMarkers.forEach(m => this.map.removeLayer(m));
    this.placeMarkers.forEach(m => this.map.removeLayer(m));
    this.stopMarkers = [];
    this.placeMarkers = [];

    // 1. Render Transit Stops
    RideSenseData.stops.forEach(stop => {
      const stopIcon = L.divIcon({
        className: "custom-stop-marker",
        html: `
          <div class="w-6 h-6 rounded-full bg-slate-900 border-2 border-amber-400 text-amber-400 flex items-center justify-center shadow-lg text-[10px] font-bold">
            🚏
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([stop.lat, stop.lng], { icon: stopIcon }).addTo(this.map);
      marker.bindPopup(`
        <div class="p-2 text-slate-900 font-sans text-xs">
          <div class="font-bold text-sm text-blue-900">${stop.name}</div>
          <div class="text-[11px] text-slate-600">${stop.nameTa || ''}</div>
          <div class="text-[10px] text-slate-500 mt-1">Platform: <strong>${stop.bay}</strong></div>
          <div class="mt-2 pt-1 border-t border-slate-200 flex gap-1">
            <button onclick="RideSenseApp.selectOriginStop('${stop.name}')" class="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-bold">From Here</button>
            <button onclick="RideSenseApp.selectDestinationStop('${stop.name}')" class="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold">To Here</button>
          </div>
        </div>
      `);
      this.stopMarkers.push(marker);
    });

    // 2. Render Kanyakumari Tourist Attractions
    RideSenseData.touristPlaces.forEach(place => {
      const placeIcon = L.divIcon({
        className: "custom-place-marker",
        html: `
          <div class="w-7 h-7 rounded-full bg-emerald-600 border-2 border-white text-white flex items-center justify-center shadow-2xl text-[11px] font-bold">
            <i class="fa-solid ${place.image || 'fa-landmark'}"></i>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([place.lat, place.lng], { icon: placeIcon }).addTo(this.map);
      marker.bindPopup(`
        <div class="p-2 text-slate-900 font-sans text-xs max-w-xs">
          <div class="font-bold text-sm text-emerald-900">${place.name}</div>
          <div class="text-[11px] text-slate-600">${place.nameTa}</div>
          <p class="text-[10px] text-slate-500 mt-1">${place.description}</p>
          <div class="mt-1.5 p-1 rounded bg-slate-100 text-[10px]">
            <div>Nearest Stop: <strong>${place.nearestStopName}</strong></div>
            <div>Demo Bus: <strong class="text-blue-700">${place.recommendedBusId}</strong> (${place.walkingDistance} walk)</div>
          </div>
          <div class="mt-2 pt-1 border-t border-slate-200 flex gap-1">
            <button onclick="RideSenseApp.openHowToReachModal('${place.id}')" class="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold">How to Reach</button>
            <button onclick="RideSenseVoice.announceTouristPlace(RideSenseData.touristPlaces.find(p=>p.id==='${place.id}'))" class="px-2 py-1 bg-indigo-600 text-white rounded text-[10px] font-bold">Voice Guide</button>
          </div>
        </div>
      `);
      this.placeMarkers.push(marker);
    });

    // 3. If User has allowed location, add nearby demo POIs around real location so map is NEVER empty!
    if (this.userLocation) {
      const userPois = RideSenseData.generateNearbyPoisForUser(this.userLocation.lat, this.userLocation.lng);
      userPois.forEach(poi => {
        const poiIcon = L.divIcon({
          className: "custom-poi-marker",
          html: `
            <div class="w-6 h-6 rounded-full bg-purple-600 border border-white text-white flex items-center justify-center shadow-lg text-[10px]">
              <i class="fa-solid ${poi.icon}"></i>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([poi.lat, poi.lng], { icon: poiIcon }).addTo(this.map);
        marker.bindPopup(`
          <div class="p-1 text-slate-900 font-sans text-xs">
            <div class="font-bold text-purple-900">${poi.name}</div>
            <div class="text-[10px] text-slate-500">${poi.category} • ~${poi.distance} away</div>
            <p class="text-[10px] text-slate-600 mt-1">${poi.description}</p>
            <div class="text-[9px] text-slate-400 mt-1">Demo Nearby Place Data</div>
          </div>
        `);
        this.placeMarkers.push(marker);
      });
    }
  },

  renderRoute: function() {
    if (!this.map || !this.activeBus) return;

    if (this.routePolyline) this.map.removeLayer(this.routePolyline);
    if (this.deviationPolyline) this.map.removeLayer(this.deviationPolyline);

    // Get stops coordinates served by this bus
    const stopIds = this.activeBus.stopsServed || [];
    const busStops = RideSenseData.stops.filter(s => stopIds.includes(s.id));
    if (busStops.length > 0) {
      const latlngs = busStops.map(s => [s.lat, s.lng]);
      this.routePolyline = L.polyline(latlngs, {
        color: "#2563eb",
        weight: 5,
        opacity: 0.85
      }).addTo(this.map);
    }
  },

  renderBusMarker: function() {
    if (!this.map || !this.activeBus) return;
    if (this.busMarker) this.map.removeLayer(this.busMarker);

    const bus = this.activeBus;
    const crowdColor = this.getCrowdColor(bus.crowdLevel);

    const busIcon = L.divIcon({
      className: "custom-bus-marker",
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-12 h-12 rounded-full opacity-40 animate-ping" style="background-color: ${crowdColor}"></div>
          <div class="relative w-9 h-9 rounded-full flex items-center justify-center text-white shadow-2xl border-2 border-white" style="background-color: ${crowdColor}">
            <i class="fa-solid fa-bus text-xs"></i>
          </div>
          <div class="absolute -bottom-5 bg-slate-900/90 text-white font-bold text-[9px] px-1.5 py-0.5 rounded shadow whitespace-nowrap border border-slate-700">
            ${bus.routeNo} • ${bus.crowdPercentage}%
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    this.busMarker = L.marker([bus.currentLocation.lat, bus.currentLocation.lng], {
      icon: busIcon,
      zIndexOffset: 1500
    }).addTo(this.map);

    this.busMarker.bindPopup(`
      <div class="p-2 text-slate-900 font-sans text-xs">
        <h4 class="font-bold text-sm text-blue-900">Bus ${bus.routeNo} (${bus.regNo})</h4>
        <p class="text-xs text-slate-600">${bus.routeName}</p>
        <div class="mt-2 text-xs grid grid-cols-2 gap-1 bg-slate-100 p-1.5 rounded">
          <div>Crowd: <strong style="color: ${crowdColor}">${bus.crowdPercentage}%</strong></div>
          <div>Seats: <strong class="text-emerald-700">${bus.availableSeats} empty</strong></div>
          <div>ETA: <strong>${bus.etaMinutes} min</strong></div>
          <div>Fare: <strong>₹${bus.baseFare}</strong></div>
        </div>
        <div class="mt-2 pt-1 border-t border-slate-200 flex gap-1">
          <button onclick="RideSenseApp.openSmartChoiceModal('${bus.id}')" class="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded text-[10px]">SmartChoice</button>
          <button onclick="RideSenseVoice.announceBus(RideSenseData.buses.find(b=>b.id==='${bus.id}'))" class="px-2 py-1 bg-indigo-600 text-white rounded text-[10px]">Voice</button>
        </div>
      </div>
    `);
  },

  updateBusMarker: function() {
    if (!this.busMarker || !this.activeBus) return;
    const bus = this.activeBus;
    this.busMarker.setLatLng([bus.currentLocation.lat, bus.currentLocation.lng]);
  },

  updateGpsTelemetryOverlay: function() {
    const el = document.getElementById("gpsTelemetryOverlay");
    if (!el || !this.activeBus) return;
    const bus = this.activeBus;

    el.innerHTML = `
      <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span class="text-slate-300 font-mono text-[11px]">
            LAT: <strong class="text-white">${bus.currentLocation.lat.toFixed(4)}°N</strong>, 
            LNG: <strong class="text-white">${bus.currentLocation.lng.toFixed(4)}°E</strong>
          </span>
        </div>
        <div class="flex items-center gap-3 text-slate-300 text-[11px]">
          <span>Speed: <strong class="text-emerald-400 font-mono">${bus.currentSpeed} km/h</strong></span>
          <span>ETA: <strong class="text-amber-400 font-mono">${bus.etaMinutes} mins</strong></span>
          <span class="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded border border-blue-500/30 text-[10px]">
            ${this.userLocation ? 'LIVE GPS ACTIVE' : 'SIMULATED DEMO GPS'}
          </span>
        </div>
      </div>
    `;
  },

  getCrowdColor: function(level) {
    switch (level) {
      case "comfortable": return "#10b981";
      case "moderate": return "#f59e0b";
      case "crowded": return "#f97316";
      case "overcrowded": return "#ef4444";
      default: return "#3b82f6";
    }
  },

  centerOnBus: function() {
    if (!this.map || !this.activeBus) return;
    this.map.panTo([this.activeBus.currentLocation.lat, this.activeBus.currentLocation.lng], { animate: true });
  },

  centerOnKanyakumari: function() {
    if (!this.map) return;
    this.map.setView([8.0880, 77.5450], 14, { animate: true });
    RideSenseApp.showToast("Map focused on Kanyakumari Tourist Hub", "info");
  },

  centerOnUser: function() {
    if (!this.map) return;
    if (this.userLocation) {
      this.map.setView([this.userLocation.lat, this.userLocation.lng], 15, { animate: true });
    } else {
      this.requestRealLocation();
    }
  }
};

window.RideSenseMap = RideSenseMap;
