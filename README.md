# RideSense — Intelligent Bus Crowd, Tourist Assistance & Smart Travel Platform

> **"Smart Travel. Smarter Buses. Better Journeys."**  
> Comprehensive Smart Public Transportation & Tourist Assistance Web Application for College Project Expos, Smart City Demonstrations, and Transport Hackathons.

---

## 🌟 Executive Summary

**RideSense** is an intelligent public transit guidance platform that bridges passenger information gaps, mitigates dangerous bus overcrowding, and empowers tourists to effortlessly navigate coastal and urban transit networks without prior knowledge of local bus numbers.

### Core Intelligent Flow
$$\text{DETECT} \longrightarrow \text{VISUALIZE} \longrightarrow \text{PREDICT} \longrightarrow \text{COMPARE} \longrightarrow \text{RECOMMEND} \longrightarrow \text{ASSIST} \longrightarrow \text{MONITOR} \longrightarrow \text{ANALYZE}$$

---

## 🚀 Key Feature Matrix

| Category | Features & Specifications |
| :--- | :--- |
| **Branding & Identity** | • Name: **RideSense**<br>• Tagline: *"Smart Travel. Smarter Buses. Better Journeys."* |
| **Real Browser Geolocation** | • Real `navigator.geolocation.getCurrentPosition()` and `watchPosition()`<br>• Visual device marker with pulsing accuracy radius circle<br>• Map is **never empty**: Generates realistic nearby transit hubs, hospitals, and colleges around user coordinates with clear `Demo / Simulated Nearby Place Data` badges |
| **📍 Around Me Radar** | • Radius selector: **500m**, **1km (Default)**, **2km**, **5km**<br>• Category filters: All, Buses, Bus Stops, Tourist Places, Hospitals, Colleges, Stations, Landmarks, Shopping<br>• "What's Near Me?" sorted list with distance in meters/kilometers, clickable to zoom on map |
| **🌴 Explore Kanyakumari** | • **10 Demo Tourist Buses**: `1A` (Tourist Loop), `1B` (Nagercoil Express), `1C` (Direct), `2A` (Suchindram Heritage), `2B` (Vattakottai Fort), `2C` (Padmanabhapuram Palace), `3A` (Tourist Circular), `3B` (Station Feeder), `4A` (Ferry Shuttle), `4B` (Sunset Point Express)<br>• **13 Iconic Attractions**: Vivekananda Rock Memorial, Thiruvalluvar Statue, Beach, Sunset Point, Sunrise Point, Bhagavathi Amman Temple, Gandhi Mandapam, Suchindram Temple, Vattakottai Fort, Padmanabhapuram Palace, Mathur Aqueduct, Station, Central Bus Stand<br>• **"How Do I Reach?"** guide with nearest stop, recommended bus, walking distance, journey time, and one-click [SmartChoice], [Track Bus], and [Voice Guide] |
| **Step 1–5 Passenger Flow** | • **Step 1**: From → To search with auto-complete<br>• **Step 2**: Matching scheduled buses with ETA, Crowd %, Seats, Fare, Journey time<br>• **Step 3 & 4**: **SmartChoice** card & **Boarding Score (0–100)** with transparent "Why?" pros & cons<br>• **Step 5**: Onboard tracking mode with stops remaining, route progress, and destination wake-up alarm |
| **Passenger Type Intelligence** | • Options: General, Need a Seat, Elderly, Pregnant, Person with Disability, Travelling with Child, Family Tourist<br>• Dynamically alters SmartChoice scoring: prioritizes open seats, low crowd, accessibility ramp, and minimal walking |
| **4-Scale Crowd Levels** | • **0–60% Comfortable (🟢)**<br>• **61–75% Moderate (🟡)**<br>• **76–90% Crowded (🟠)**<br>• **91–100% Overcrowded (🔴)**<br>• Progress bar: `████████░░ 86%` with transparent recommendations |
| **Bus Interior & Heatmaps** | • Top-view 32-Seat Numbered Blueprint (`S1` to `S32`) with driver cabin, conductor booth, wheelchair bay, doors, and aisle standing dots<br>• **3-Section Heatmap**: Front Section (%), Middle Section (%), Rear Section (%)<br>• **3-Door Crowd Monitor**: Front Door, Middle Door, Rear Door (Low, Medium, High) with departure clearance warning |
| **Multilingual Engine** | • **100% Complete UI & Voice Localization**: English, Tamil (தமிழ்), Hindi (हिन्दी)<br>• No mixed-language text or hardcoded english buttons<br>• Language choice persisted in `localStorage` |
| **Voice Guidance** | • Web Speech API speech synthesis mapped to `en-IN`, `ta-IN`, and `hi-IN`<br>• Speaks bus arrival, SmartChoice rationale, tourist guide, and destination get-off alarm<br>• Graceful localized fallback when voice engine is missing<br>• Auto-Voice Guidance toggle option |
| **Driver Cockpit** | • Real-time passenger count, occupancy gauge, seated vs standing<br>• Large Warning: `⚠️ HIGH CROWD – CHECK DOOR AREA BEFORE DEPARTURE`<br>• 3-Door Safety Check modal with `SAFE TO DEPART` vs `HAZARD`<br>• Boarding lock toggle and departure buzzer |
| **Admin Fleet Hub** | • Fleet occupancy matrix, overcrowded buses count, maintenance breakdown flags<br>• **Crowd Hotspots Radar** highlighting high passenger density zones<br>• Telemetry overrides (+10%, -10%, breakdown toggle, `+20% Rush Hour Injector`) |
| **Shared Simulation State** | • Real-time demo simulation engine that updates bus movement, passenger exchanges, crowd %, seats, and door sensors in sync across all portals without page reload |
| **Extra Travel Utilities** | • **Lost & Found** portal<br>• **Demo SOS** emergency safety interface with 112 hotline<br>• **Low-Network Mode (2G)** toggle<br>• **Favourite Routes** (localStorage)<br>• **Recent Trips**<br>• **Rate Your Journey** & **Crowd Complaints** |

---

## 💻 How to Run RideSense

### Option 1: Direct Browser Launch
Double-click `index.html` in your file explorer to open it in Google Chrome, Microsoft Edge, or Firefox.

### Option 2: Built-In Python Server
Run the local server:
```powershell
python server.py
```
Or with standard library:
```powershell
python -m http.server 8000
```
Open your browser at:
`http://localhost:8000/index.html`

---

## 🎤 Expo / Demonstration Sequence for Judges

1. **Live Location & Around Me**:
   - Click `📍 Live Location`: Show browser geolocation permission. The map centers on the user with an accuracy ring and generates nearby transit POIs.
   - Click `📍 Around Me`: Change radius from 500m to 1km to 5km; filter by "Tourist Places" or "Buses" and click an item to focus the map.

2. **Tourist Mode (Explore Kanyakumari)**:
   - Switch to **"🌴 Explore Kanyakumari"** in the top navigation.
   - Select **"Vivekananda Rock Memorial"** and click **"How Do I Reach?"**. Show recommended Bus 1A, walking distance (450m), and travel time (12 min).
   - Click **"Voice Guide"** to listen to the audio guide.

3. **Core Journey & SmartChoice**:
   - Go to Passenger Portal. Select From: *Kanyakumari Bus Stand* -> To: *Vivekananda Ferry Area*.
   - Point to the **SmartChoice** card and **Boarding Score (e.g. 78/100)** with the visible "Why?" pros & cons.
   - Switch passenger type to **"Elderly"** or **"Pregnant"**: show how the algorithm dynamically prioritizes open seats and recommends Bus 2A.
   - Click **"Board Now"** to activate the onboard trip tracker.

4. **Bus Interior Blueprint & 3-Door Monitor**:
   - Inspect the top-view blueprint: 32 seats with color-coded categories, driver cabin, conductor booth, and aisle dots.
   - Check the **3-Section Heatmap** (Front %, Middle %, Rear %) and **3-Door Crowd Monitor**.

5. **Driver Cockpit & Safety Clearance**:
   - Switch to **Driver Cockpit**: show live occupancy and click **"Door Safety Check"** to inspect step sensors and departure clearance.

6. **Admin Fleet Hub & Live Demo Simulation**:
   - Switch to **Admin Fleet Hub**: show crowd hotspots and click **"⚡ Inject Peak Rush"**.
   - Click **"▶ Start Live Demo"**: watch the shared simulation synchronize bus movement, crowd %, and seats across all views in real time.

7. **Multilingual Inclusivity**:
   - Switch language to **தமிழ் (Tamil)**: show that the entire application, badges, cards, and voice announcements transition to Tamil without any mixed-language strings.
   - Switch to **हिन्दी (Hindi)**: show the complete Hindi UI.

---

## 🛡️ Prototype & Compliance Notice
- All bus coordinates, passenger headcounts, sensor data, and fares are simulated demo telemetry designed for academic presentation.
- Real browser geolocation is exclusively processed locally on the client device.
