// RideSense Centralized Multilingual Localization Engine
// 100% Complete UI & Voice Localization (English, Tamil, Hindi)
const RideSenseI18n = {
  currentLang: "en",

  languages: [
    { code: "en", name: "English", native: "English" },
    { code: "ta", name: "Tamil", native: "தமிழ்" },
    { code: "hi", name: "Hindi", native: "हिन्दी" }
  ],

  translations: {
    en: {
      appName: "RideSense",
      tagline: "Smart Travel. Smarter Buses. Better Journeys.",
      demoSimulatedBadge: "DEMO / SIMULATED DATA",
      liveGpsBadge: "LIVE DEVICE LOCATION",
      
      // Navigation & Tabs
      navHome: "Passenger Portal",
      navAroundMe: "Around Me",
      navTourist: "Explore Kanyakumari",
      navDriver: "Driver Cockpit",
      navAdmin: "Admin Fleet Hub",
      navLowNetwork: "Low-Network Mode",
      navLostFound: "Lost & Found",
      navRecentTrips: "Recent Trips",
      navFeedback: "Rate Journey",
      navReportIssue: "Report Crowd",

      // Search Journey
      journeyTitle: "Find Your Bus & Plan Journey",
      searchFrom: "Starting From",
      searchTo: "Going To",
      fromPlaceholder: "Enter boarding stop (e.g. Kanyakumari Bus Stand)...",
      toPlaceholder: "Enter destination (e.g. Vivekananda Rock)...",
      searchBusesBtn: "Search Buses",
      availableBusesHeading: "Matching Scheduled Buses",
      noBusesFound: "No direct buses found for this selection. Try nearby stops or tourist shuttles.",

      // Crowd Scales (Section 3)
      crowdComfortable: "Comfortable (0–60%)",
      crowdModerate: "Moderate (61–75%)",
      crowdCrowded: "Crowded (76–90%)",
      crowdOvercrowded: "Overcrowded (91–100%)",

      // SmartChoice & Boarding Score
      smartChoiceTitle: "SmartChoice AI Advisor",
      shouldIBoard: "Should I Board This Bus?",
      recommendationBoard: "👉 RECOMMENDATION: BOARD NOW",
      recommendationWait: "👉 RECOMMENDATION: WAIT FOR ALTERNATIVE",
      boardingScoreTitle: "Boarding Suitability Score",
      whyScore: "Decision Factors (Why?):",
      directRoute: "Direct route to destination",
      shortEta: "Short arrival wait time",
      lowFare: "Economical fare stage",
      fewSeats: "Very few seats available",
      highCrowd: "Heavy passenger density / standing rush",
      betterAlternativeNear: "Spacious alternative arriving shortly",

      // Actions
      btnBoardNow: "Board Now",
      btnWaitForAlt: "Wait for Next Bus",
      btnTrackBus: "Track Bus",
      btnViewRoute: "View Route",
      btnViewInterior: "View Interior",
      btnVoiceGuide: "Voice Guide",
      btnHowToReach: "How Do I Reach?",
      btnSmartChoice: "SmartChoice",
      btnAroundMe: "📍 Around Me",
      btnLiveLocation: "📍 Live Location",

      // Passenger Types
      passengerTypePrompt: "Who is travelling?",
      ptGeneral: "General Passenger",
      ptNeedSeat: "Need a Seat",
      ptElderly: "Elderly Citizen",
      ptPregnant: "Pregnant / Nursing Mother",
      ptDisability: "Person with Disability",
      ptChild: "Travelling with Child",
      ptFamilyTourist: "Family Tourist",

      // Geolocation & Around Me
      locRequesting: "Requesting browser location permission...",
      locGranted: "Real browser location acquired.",
      locDenied: "Location permission denied. Please allow location access in your browser settings to use Around Me.",
      locFallback: "Geolocation is not supported by your browser.",
      aroundMeTitle: "What's Near Me?",
      radiusSelector: "Search Radius:",
      filterAll: "All",
      filterBuses: "Buses",
      filterStops: "Bus Stops",
      filterTourist: "Tourist Places",
      filterHospitals: "Hospitals",
      filterColleges: "Colleges",
      filterStations: "Stations",
      filterLandmarks: "Landmarks",
      filterShopping: "Shopping",

      // Tourist Mode
      touristHeroTitle: "🌴 Explore Kanyakumari — Smart Tourist Guide",
      touristHeroSub: "Discover iconic seaside landmarks and reach any destination easily without knowing local bus numbers.",
      touristFriendlyBadge: "⭐ Tourist Friendly",
      nearestBusStopLabel: "Nearest Bus Stop:",
      recommendedBusLabel: "Recommended Demo Bus:",
      walkingDistanceLabel: "Walking Distance:",
      estimatedJourneyLabel: "Estimated Journey:",
      approxVisitTime: "Approx. Visit Time:",

      // Onboard Tracking & Get-off alert
      onboardTrackingTitle: "Live Onboard Trip Tracker",
      currentStopLabel: "Current Stop:",
      nextStopLabel: "Next Stop:",
      destinationLabel: "Destination:",
      stopsRemainingLabel: "Stops Remaining:",
      getReadyGetDownTitle: "🔔 GET READY TO GET DOWN!",
      getReadyGetDownMsg: "Your destination is approaching in less than 500 meters. Please move toward the exit door.",

      // Wrong Bus Warning
      wrongBusWarningTitle: "⚠️ WRONG BUS WARNING",
      wrongBusWarningMsg: "This bus does not serve your selected destination! Please board one of the recommended buses below.",

      // Blueprint & Heatmap
      blueprintHeading: "Interactive Bus Interior & Section Crowd Heatmap",
      frontSection: "Front Section",
      middleSection: "Middle Section",
      rearSection: "Rear Section",
      frontDoorLabel: "Front Door",
      middleDoorLabel: "Middle Door",
      rearDoorLabel: "Rear Door",
      doorClear: "Clear",
      doorHighWarning: "⚠️ High Door Crowd",

      // Driver Cockpit
      driverTitle: "Driver Cockpit & Safety Monitor",
      doorSafetyCheck: "Door Safety Check",
      safeToDepart: "✅ SAFE TO DEPART",
      hazardDoNotClose: "⛔ HAZARD – DO NOT CLOSE DOORS",

      // Admin Fleet
      adminTitle: "Central Transit Fleet Operations",
      totalPassengers: "Total Passengers",
      activeBuses: "Active Buses",
      overcrowdedBuses: "Overcrowded Buses",
      crowdHotspotMap: "Crowd Hotspots & Density Map",
      breakdownAlertTitle: "Demo Service / Breakdown Alerts",

      // Extra Features
      sosTitle: "Emergency Assistance (Demo SOS)",
      sosDesc: "Simulated emergency alert broadcast to TNSTC control room & emergency services.",
      lostFoundTitle: "Lost & Found Service",
      reportItemBtn: "Report Lost Item",
      rateJourneyTitle: "Rate Your Journey",
      reportCrowdTitle: "Report Crowd Issue",
      autoVoiceToggle: "🔊 Auto Voice Guidance",
      voiceFallbackMsg: "Voice synthesis in this language is not installed on this device. Please read the on-screen instructions."
    },

    ta: {
      appName: "ரைட்சென்ஸ்",
      tagline: "ஸ்மார்ட் பயணம். சிறந்த பேருந்துகள். இனிமையான அனுபவம்.",
      demoSimulatedBadge: "மாதிரி / டெமோ தரவு",
      liveGpsBadge: "நேரலை கருவி இருப்பிடம்",

      // Navigation & Tabs
      navHome: "பயணிகள் தளம்",
      navAroundMe: "என்னைச் சுற்றி",
      navTourist: "கன்னியாகுமரி சுற்றுலா",
      navDriver: "ஓட்டுநர் அறை",
      navAdmin: "நிர்வாகக் குழு",
      navLowNetwork: "குறைந்த நெட்வொர்க் முறை",
      navLostFound: "தொலைந்தவை மீட்பு",
      navRecentTrips: "சமீபத்திய பயணம்",
      navFeedback: "பயண மதிப்பீடு",
      navReportIssue: "கூட்டப் புகார்",

      // Search Journey
      journeyTitle: "பேருந்தை கண்டறிந்து பயணத்தை திட்டமிடுக",
      searchFrom: "புறப்படும் இடம்",
      searchTo: "சேரும் இடம்",
      fromPlaceholder: "ஏறும் நிறுத்தத்தை உள்ளிடுக (எ.கா: கன்னியாகுமரி பேருந்து நிலையம்)...",
      toPlaceholder: "இறங்கும் இடத்தை உள்ளிடுக (எ.கா: விவேகானந்தர் பாறை)...",
      searchBusesBtn: "பேருந்துகளை தேடுக",
      availableBusesHeading: "பொருத்தமான பேருந்துகள்",
      noBusesFound: "இந்த வழித்தடத்திற்கு நேரடி பேருந்துகள் இல்லை. அருகில் உள்ள நிறுத்தங்களை முயற்சிக்கவும்.",

      // Crowd Scales
      crowdComfortable: "வசதியானது (0–60%)",
      crowdModerate: "மிதமான கூட்டம் (61–75%)",
      crowdCrowded: "அதிக கூட்டம் (76–90%)",
      crowdOvercrowded: "அதிதீவிர நெரிசல் (91–100%)",

      // SmartChoice & Boarding Score
      smartChoiceTitle: "ஸ்மார்ட்சாய்ஸ் AI ஆலோசகர்",
      shouldIBoard: "இந்த பேருந்தில் ஏறலாமா?",
      recommendationBoard: "👉 பரிந்துரை: இப்போது ஏறலாம்",
      recommendationWait: "👉 பரிந்துரை: அடுத்த பேருந்துக்காக காத்திருங்கள்",
      boardingScoreTitle: "பயண தகுதி மதிப்பீடு (Score)",
      whyScore: "பரிந்துரைக்கான காரணங்கள் (Why?):",
      directRoute: "நேரடி வழித்தடம்",
      shortEta: "விரைவில் வந்துவிடும்",
      lowFare: "குறைந்த கட்டணம்",
      fewSeats: "மிகக் குறைந்த இருக்கைகளே உள்ளன",
      highCrowd: "அதிக கூட்டம் / நிற்க இடநெருக்கடி",
      betterAlternativeNear: "இடவசதியுள்ள மாற்று பேருந்து விரைவில் வருகிறது",

      // Actions
      btnBoardNow: "இப்போது ஏறுக",
      btnWaitForAlt: "அடுத்த பேருந்துக்கு காத்திரு",
      btnTrackBus: "பேருந்தை கண்காணி",
      btnViewRoute: "வழித்தடம் காண்க",
      btnViewInterior: "உள்பகுதி பார்வை",
      btnVoiceGuide: "குரல் வழிகாட்டி",
      btnHowToReach: "எப்படி செல்வது?",
      btnSmartChoice: "ஸ்மார்ட்சாய்ஸ்",
      btnAroundMe: "📍 என்னைச் சுற்றி",
      btnLiveLocation: "📍 நேரலை இருப்பிடம்",

      // Passenger Types
      passengerTypePrompt: "பயணம் செய்வது யார்?",
      ptGeneral: "பொதுப் பயணி",
      ptNeedSeat: "இருக்கை தேவைப்படுவோர்",
      ptElderly: "முதியவர்",
      ptPregnant: "கர்ப்பிணிப் பெண் / பாலூட்டும் தாய்",
      ptDisability: "மாற்றுத்திறனாளி",
      ptChild: "குழந்தையுடன் பயணிப்பவர்",
      ptFamilyTourist: "குடும்ப சுற்றுலாப் பயணி",

      // Geolocation & Around Me
      locRequesting: "இருப்பிட அனுமதி கோரப்படுகிறது...",
      locGranted: "உண்மையான பிரவுசர் இருப்பிடம் பெறப்பட்டது.",
      locDenied: "இருப்பிட அனுமதி மறுக்கப்பட்டது. பிரவுசர் அமைப்பில் அனுமதியை இயக்கி மீண்டும் முயற்சிக்கவும்.",
      locFallback: "உங்கள் பிரவுசரில் இருப்பிட வசதி இல்லை.",
      aroundMeTitle: "என்னைச் சுற்றி என்ன உள்ளது?",
      radiusSelector: "தேடல் ஆரம்:",
      filterAll: "அனைத்தும்",
      filterBuses: "பேருந்துகள்",
      filterStops: "பேருந்து நிறுத்தங்கள்",
      filterTourist: "சுற்றுலா இடங்கள்",
      filterHospitals: "மருத்துவமனைகள்",
      filterColleges: "கல்லூரிகள்",
      filterStations: "ரயில் நிலையங்கள்",
      filterLandmarks: "முக்கிய இடங்கள்",
      filterShopping: "வணிக வளாகங்கள்",

      // Tourist Mode
      touristHeroTitle: "🌴 கன்னியாகுமரி சுற்றுலா — ஸ்மார்ட் பயண வழிகாட்டி",
      touristHeroSub: "பேருந்து எண்கள் தெரியாவிட்டாலும் அனைத்து கடலோர சுற்றுலா இடங்களையும் எளிதாக சென்றடையுங்கள்.",
      touristFriendlyBadge: "⭐ சுற்றுலா சிறப்புப் பேருந்து",
      nearestBusStopLabel: "அருகிலுள்ள பேருந்து நிறுத்தம்:",
      recommendedBusLabel: "பரிந்துரைக்கப்படும் பேருந்து:",
      walkingDistanceLabel: "நடக்கும் தூரம்:",
      estimatedJourneyLabel: "பயண நேரம்:",
      approxVisitTime: "பார்வையிட ஆகும் நேரம்:",

      // Onboard Tracking & Get-off alert
      onboardTrackingTitle: "நேரலை பேருந்து பயணக் கண்காணிப்பு",
      currentStopLabel: "தற்போதைய நிறுத்தம்:",
      nextStopLabel: "அடுத்த நிறுத்தம்:",
      destinationLabel: "சேரும் இடம்:",
      stopsRemainingLabel: "மீதமுள்ள நிறுத்தங்கள்:",
      getReadyGetDownTitle: "🔔 இறங்கத் தயாராகுங்கள்!",
      getReadyGetDownMsg: "உங்கள் நிறுத்தம் 500 மீட்டரில் வரவுள்ளது. தயவுசெய்து இறங்கும் கதவு அருகே செல்லுங்கள்.",

      // Wrong Bus Warning
      wrongBusWarningTitle: "⚠️ தவறான பேருந்து எச்சரிக்கை",
      wrongBusWarningMsg: "இந்த பேருந்து நீங்கள் செல்ல வேண்டிய இடத்திற்கு செல்லாது! கீழே உள்ள பரிந்துரைக்கப்பட்ட பேருந்தில் ஏறவும்.",

      // Blueprint & Heatmap
      blueprintHeading: "பேருந்து உள்பகுதி வரைபடம் & பகுதிவாரியான நெரிசல் அனல்வரைபடம் (Heatmap)",
      frontSection: "முன் பகுதி",
      middleSection: "நடுப் பகுதி",
      rearSection: "பின் பகுதி",
      frontDoorLabel: "முன் கதவு",
      middleDoorLabel: "நடுக் கதவு",
      rearDoorLabel: "பின் கதவு",
      doorClear: "பாதுகாப்பானது",
      doorHighWarning: "⚠️ கதவு அருகே கூட்டம் அதிகம்",

      // Driver Cockpit
      driverTitle: "ஓட்டுநர் அறை & பாதுகாப்பு கண்காணிப்பு",
      doorSafetyCheck: "கதவு பாதுகாப்பு சோதனை",
      safeToDepart: "✅ புறப்பட பாதுகாப்பானது",
      hazardDoNotClose: "⛔ ஆபத்து – கதவை மூடாதீர்",

      // Admin Fleet
      adminTitle: "மத்திய போக்குவரத்து கட்டுப்பாட்டு மையம்",
      totalPassengers: "மொத்த பயணிகள்",
      activeBuses: "செயலில் உள்ள பேருந்துகள்",
      overcrowdedBuses: "அதிக நெரிசலான பேருந்துகள்",
      crowdHotspotMap: "நெரிசல் பகுதிகள் வரைபடம்",
      breakdownAlertTitle: "மாதிரி பழுது / சேவை எச்சரிக்கைகள்",

      // Extra Features
      sosTitle: "அவசர உதவி (டெமோ SOS)",
      sosDesc: "போக்குவரத்து கட்டுப்பாட்டு அறைக்கு மாதிரி அவசர எச்சரிக்கை அனுப்பப்பட்டது.",
      lostFoundTitle: "தொலைந்த பொருட்கள் பிரிவு",
      reportItemBtn: "பொருள் தொலைந்ததை பதிவு செய்க",
      rateJourneyTitle: "பயணத்தை மதிப்பிடுங்கள்",
      reportCrowdTitle: "கூட்ட நெரிசல் புகார்",
      autoVoiceToggle: "🔊 தானியங்கி குரல் அறிவிப்பு",
      voiceFallbackMsg: "தமிழ் குரல் வசதி இந்த சாதனத்தில் கிடைக்கவில்லை. திரையில் உள்ள வழிகாட்டலை படித்து பயன்பெறவும்."
    },

    hi: {
      appName: "राइडसेंस",
      tagline: "स्मार्ट यात्रा। बेहतर बसें। सुखद सफर।",
      demoSimulatedBadge: "डेमो / सिम्युलेटेड डेटा",
      liveGpsBadge: "लाइव डिवाइस लोकेशन",

      // Navigation & Tabs
      navHome: "यात्री पोर्टल",
      navAroundMe: "मेरे आस-पास",
      navTourist: "कन्याकुमारी दर्शन",
      navDriver: "चालक डैशबोर्ड",
      navAdmin: "प्रशासक पोर्टल",
      navLowNetwork: "कम नेटवर्क मोड",
      navLostFound: "खोया-पाया",
      navRecentTrips: "हाल की यात्राएं",
      navFeedback: "यात्रा रेटिंग",
      navReportIssue: "भीड़ की शिकायत",

      // Search Journey
      journeyTitle: "अपनी बस खोजें और यात्रा की योजना बनाएं",
      searchFrom: "कहाँ से",
      searchTo: "कहाँ तक",
      fromPlaceholder: "शुरुआती स्टॉप दर्ज करें (उदा. कन्याकुमारी बस स्टैंड)...",
      toPlaceholder: "गंतव्य दर्ज करें (उदा. विवेकानंद रॉक)...",
      searchBusesBtn: "बसें खोजें",
      availableBusesHeading: "उपलब्ध बसें",
      noBusesFound: "इस मार्ग के लिए कोई सीधी बस नहीं मिली। नजदीकी स्टॉप का प्रयास करें।",

      // Crowd Scales
      crowdComfortable: "आरामदायक (0–60%)",
      crowdModerate: "मध्यम भीड़ (61–75%)",
      crowdCrowded: "अधिक भीड़ (76–90%)",
      crowdOvercrowded: "अत्यधिक भीड़ (91–100%)",

      // SmartChoice & Boarding Score
      smartChoiceTitle: "स्मार्टचॉइस AI सलाहकार",
      shouldIBoard: "क्या मुझे इस बस में चढ़ना चाहिए?",
      recommendationBoard: "👉 सलाह: अभी चढ़ें",
      recommendationWait: "👉 सलाह: अगली बस का इंतजार करें",
      boardingScoreTitle: "बोर्डिंग उपयुक्तता स्कोर",
      whyScore: "निर्णय के मुख्य कारण (Why?):",
      directRoute: "गंतव्य तक सीधा मार्ग",
      shortEta: "कम प्रतीक्षा समय",
      lowFare: "किफायती किराया",
      fewSeats: "बहुत कम सीटें उपलब्ध हैं",
      highCrowd: "भारी भीड़ / खड़े होने की जगह कम",
      betterAlternativeNear: "अधिक खाली सीटों वाली वैकल्पिक बस जल्द आ रही है",

      // Actions
      btnBoardNow: "अभी चढ़ें",
      btnWaitForAlt: "अगली बस का इंतजार करें",
      btnTrackBus: "बस ट्रैक करें",
      btnViewRoute: "मार्ग देखें",
      btnViewInterior: "अंदर का दृश्य",
      btnVoiceGuide: "ध्वनि गाइड",
      btnHowToReach: "यहाँ कैसे पहुँचें?",
      btnSmartChoice: "स्मार्टचॉइस",
      btnAroundMe: "📍 मेरे आस-पास",
      btnLiveLocation: "📍 लाइव लोकेशन",

      // Passenger Types
      passengerTypePrompt: "यात्रा कौन कर रहा है?",
      ptGeneral: "सामान्य यात्री",
      ptNeedSeat: "सीट की आवश्यकता",
      ptElderly: "वरिष्ठ नागरिक",
      ptPregnant: "गर्भवती महिला",
      ptDisability: "दिव्यांग यात्री",
      ptChild: "बच्चे के साथ यात्रा",
      ptFamilyTourist: "पारिवारिक पर्यटक",

      // Geolocation & Around Me
      locRequesting: "ब्राउज़र लोकेशन अनुमति का अनुरोध किया जा रहा है...",
      locGranted: "वास्तविक डिवाइस लोकेशन प्राप्त हुई।",
      locDenied: "लोकेशन अनुमति अस्वीकृत। 'मेरे आस-पास' का उपयोग करने हेतु ब्राउज़र सेटिंग्स में लोकेशन सक्षम करें।",
      locFallback: "आपका ब्राउज़र जियोलोकेशन का समर्थन नहीं करता है।",
      aroundMeTitle: "मेरे आस-पास क्या है?",
      radiusSelector: "खोज दायरा:",
      filterAll: "सभी",
      filterBuses: "बसें",
      filterStops: "बस स्टॉप",
      filterTourist: "पर्यटक स्थल",
      filterHospitals: "अस्पताल",
      filterColleges: "कॉलेज",
      filterStations: "रेलवे स्टेशन",
      filterLandmarks: "प्रमुख स्थल",
      filterShopping: "शॉपिंग",

      // Tourist Mode
      touristHeroTitle: "🌴 कन्याकुमारी दर्शन — स्मार्ट पर्यटक गाइड",
      touristHeroSub: "बस नंबर जाने बिना भी समुद्र तटीय सभी दर्शनीय स्थलों तक आसानी से पहुँचें।",
      touristFriendlyBadge: "⭐ पर्यटक अनुकूल बस",
      nearestBusStopLabel: "निकटतम बस स्टॉप:",
      recommendedBusLabel: "अनुशंसित बस:",
      walkingDistanceLabel: "पैदल दूरी:",
      estimatedJourneyLabel: "अनुमानित यात्रा समय:",
      approxVisitTime: "भ्रमण समय:",

      // Onboard Tracking & Get-off alert
      onboardTrackingTitle: "लाइव बस यात्रा ट्रैकिंग",
      currentStopLabel: "वर्तमान स्टॉप:",
      nextStopLabel: "अगला स्टॉप:",
      destinationLabel: "गंतव्य:",
      stopsRemainingLabel: "शेष स्टॉप:",
      getReadyGetDownTitle: "🔔 उतरने की तैयारी करें!",
      getReadyGetDownMsg: "आपका गंतव्य 500 मीटर में आने वाला है। कृपया निकास द्वार की ओर बढ़ें।",

      // Wrong Bus Warning
      wrongBusWarningTitle: "⚠️ गलत बस चेतावनी",
      wrongBusWarningMsg: "यह बस आपके चुने हुए गंतव्य तक नहीं जाती है! कृपया नीचे सुझाई गई बस में चढ़ें।",

      // Blueprint & Heatmap
      blueprintHeading: "बस आंतरिक ब्लूप्रिंट और अनुभाग भीड़ हीटमैप",
      frontSection: "सामने का हिस्सा",
      middleSection: "मध्य हिस्सा",
      rearSection: "पिछला हिस्सा",
      frontDoorLabel: "सामने का दरवाजा",
      middleDoorLabel: "मध्य दरवाजा",
      rearDoorLabel: "पिछला दरवाजा",
      doorClear: "सुरक्षित",
      doorHighWarning: "⚠️ दरवाजे पर भारी भीड़",

      // Driver Cockpit
      driverTitle: "चालक कॉकपिट और सुरक्षा मॉनिटर",
      doorSafetyCheck: "दरवाजा सुरक्षा जांच",
      safeToDepart: "✅ प्रस्थान सुरक्षित है",
      hazardDoNotClose: "⛔ खतरा – दरवाजा बंद न करें",

      // Admin Fleet
      adminTitle: "केंद्रीय परिवहन फ्लीट नियंत्रण",
      totalPassengers: "कुल यात्री",
      activeBuses: "सक्रिय बसें",
      overcrowdedBuses: "अत्यधिक भीड़ वाली बसें",
      crowdHotspotMap: "भीड़ हॉटस्पॉट मानचित्र",
      breakdownAlertTitle: "डेमो सेवा / खराबी चेतावनी",

      // Extra Features
      sosTitle: "आपातकालीन सहायता (डेमो SOS)",
      sosDesc: "परिवहन नियंत्रण कक्ष और आपातकालीन सेवाओं को सिम्युलेटेड अलर्ट भेजा गया।",
      lostFoundTitle: "खोया-पाया सेवा",
      reportItemBtn: "खोई वस्तु दर्ज करें",
      rateJourneyTitle: "यात्रा रेटिंग",
      reportCrowdTitle: "भीड़ की शिकायत",
      autoVoiceToggle: "🔊 ऑटो वॉइस घोषणा",
      voiceFallbackMsg: "इस डिवाइस में हिंदी आवाज उपलब्ध नहीं है। कृपया स्क्रीन पर दिए गए निर्देशों को पढ़ें।"
    }
  },

  t: function(key) {
    const lang = this.currentLang;
    if (this.translations[lang] && this.translations[lang][key]) {
      return this.translations[lang][key];
    }
    return (this.translations.en && this.translations.en[key]) || key;
  },

  setLanguage: function(code) {
    if (!this.translations[code]) return;
    this.currentLang = code;
    localStorage.setItem("ridesense_lang", code);
    this.applyToDOM();
    if (window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent("ridesense_lang_changed", { detail: { lang: code } }));
    }
  },

  applyToDOM: function() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      const translation = this.t(key);
      if (el.tagName === "INPUT" && el.getAttribute("placeholder")) {
        el.setAttribute("placeholder", translation);
      } else {
        el.textContent = translation;
      }
    });

    const currentLangObj = this.languages.find(l => l.code === this.currentLang);
    const activeLabel = document.getElementById("activeLanguageLabel");
    if (activeLabel && currentLangObj) {
      activeLabel.textContent = `${currentLangObj.native} (${currentLangObj.name})`;
    }
  }
};

window.RideSenseI18n = RideSenseI18n;
