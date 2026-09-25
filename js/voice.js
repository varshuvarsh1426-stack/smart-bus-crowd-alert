// RideSense Web Speech API Voice Guidance Engine
// 100% Multilingual Voice Guidance (en-IN, ta-IN, hi-IN) with graceful localized fallback
const RideSenseVoice = {
  synth: window.speechSynthesis || null,
  autoVoiceEnabled: false,

  playChime: function() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      console.warn("AudioContext chime not available", e);
    }
  },

  toggleAutoVoice: function() {
    this.autoVoiceEnabled = !this.autoVoiceEnabled;
    const msg = this.autoVoiceEnabled ? "🔊 Auto Voice Guidance: ON" : "🔇 Auto Voice Guidance: OFF";
    RideSenseApp.showToast(msg, "info");
    const btn = document.getElementById("autoVoiceToggleBtn");
    if (btn) {
      btn.classList.toggle("bg-indigo-600", this.autoVoiceEnabled);
      btn.classList.toggle("bg-slate-800", !this.autoVoiceEnabled);
    }
  },

  announceBus: function(bus) {
    this.playChime();
    const lang = RideSenseI18n.currentLang;
    let text = "";

    if (lang === "ta") {
      text = `கவனிக்கவும். பேருந்து எண் ${bus.routeNo}. செல்லும் இடம் ${bus.destination}. வருகை நேரம் ${bus.etaMinutes} நிமிடங்கள். கூட்டம் ${bus.crowdPercentage} சதவீதம். காலியான இருக்கைகள் ${bus.availableSeats}.`;
    } else if (lang === "hi") {
      text = `कृपया ध्यान दें। बस नंबर ${bus.routeNo}। गंतव्य ${bus.destination}। आगमन समय ${bus.etaMinutes} मिनट। भीड़ ${bus.crowdPercentage} प्रतिशत। उपलब्ध सीटें ${bus.availableSeats}।`;
    } else {
      text = `Attention passengers. Bus number ${bus.routeNo}, bound for ${bus.destination}, arrives in ${bus.etaMinutes} minutes. Current occupancy is ${bus.crowdPercentage} percent with ${bus.availableSeats} available seats.`;
    }

    setTimeout(() => {
      this.speakText(text, lang);
    }, 400);
  },

  announceSmartChoice: function(recommendation, busNo, altBusNo) {
    this.playChime();
    const lang = RideSenseI18n.currentLang;
    let text = "";

    if (lang === "ta") {
      if (recommendation === "board") {
        text = `ஸ்மார்ட்சாய்ஸ் பரிந்துரை: பேருந்து எண் ${busNo}-ல் இப்போது ஏறலாம். நேரடி வழித்தடம் மற்றும் குறைந்த கூட்டம்.`;
      } else {
        text = `ஸ்மார்ட்சாய்ஸ் பரிந்துரை: தயவுசெய்து அடுத்த பேருந்து ${altBusNo}-க்காக காத்திருங்கள். இதில் காலியான இருக்கைகள் அதிகம்.`;
      }
    } else if (lang === "hi") {
      if (recommendation === "board") {
        text = `स्मार्टचॉइस सलाह: बस नंबर ${busNo} में अभी चढ़ें। सीधा मार्ग और पर्याप्त स्थान।`;
      } else {
        text = `स्मार्टचॉइस सलाह: कृपया अगली बस ${altBusNo} की प्रतीक्षा करें। इसमें खाली सीटें अधिक हैं।`;
      }
    } else {
      if (recommendation === "board") {
        text = `SmartChoice Recommendation: Board now on Bus ${busNo}. Direct route with manageable crowd.`;
      } else {
        text = `SmartChoice Recommendation: Wait for next Bus ${altBusNo}. It offers significantly more open seats and comfort.`;
      }
    }

    setTimeout(() => {
      this.speakText(text, lang);
    }, 400);
  },

  announceTouristPlace: function(place) {
    this.playChime();
    const lang = RideSenseI18n.currentLang;
    let text = "";

    if (lang === "ta") {
      text = `${place.nameTa}. செல்ல வேண்டிய பரிந்துரை பேருந்து ${place.recommendedBusId}. இறங்கும் நிறுத்தம் ${place.nearestStopName}. நடக்கும் தூரம் ${place.walkingDistance}.`;
    } else if (lang === "hi") {
      text = `${place.nameHi}। अनुशंसित बस ${place.recommendedBusId}। निकटतम स्टॉप ${place.nearestStopName}। पैदल दूरी ${place.walkingDistance}।`;
    } else {
      text = `${place.name}. Recommended bus is ${place.recommendedBusId}. Alight at ${place.nearestStopName}. Walking distance is ${place.walkingDistance}.`;
    }

    setTimeout(() => {
      this.speakText(text, lang);
    }, 400);
  },

  announceGetOffAlert: function(stopName) {
    this.playChime();
    const lang = RideSenseI18n.currentLang;
    let text = "";

    if (lang === "ta") {
      text = `விழிப்புணர்வு எச்சரிக்கை! நீங்கள் சேர வேண்டிய நிறுத்தம் ${stopName} 500 மீட்டரில் நெருங்குகிறது. தயவுசெய்து இறங்கத் தயாராகுங்கள்!`;
    } else if (lang === "hi") {
      text = `सावधान! आपका गंतव्य स्टॉप ${stopName} 500 मीटर में आने वाला है। कृपया उतरने की तैयारी करें!`;
    } else {
      text = `Wake up alert! Your destination stop ${stopName} is approaching in less than 500 meters. Please prepare to get down!`;
    }

    setTimeout(() => {
      this.speakText(text, lang);
    }, 400);
  },

  speakText: function(text, langCode) {
    if (!this.synth) {
      this.showVoiceFallbackNotification();
      return;
    }

    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    let targetBCP = "en-IN";
    if (langCode === "ta") targetBCP = "ta-IN";
    else if (langCode === "hi") targetBCP = "hi-IN";

    utterance.lang = targetBCP;

    const voices = this.synth.getVoices();
    const matchedVoice = voices.find(v => v.lang.startsWith(targetBCP.split("-")[0]));

    if (matchedVoice) {
      utterance.voice = matchedVoice;
      this.synth.speak(utterance);
    } else {
      // Voice for target language not installed on device
      // As explicitly required in Section 52: Do NOT silently switch to English! Show friendly message in selected language.
      if (langCode !== "en") {
        this.showVoiceFallbackNotification();
      } else {
        this.synth.speak(utterance);
      }
    }
  },

  showVoiceFallbackNotification: function() {
    const lang = RideSenseI18n.currentLang;
    const msg = RideSenseI18n.t("voiceFallbackMsg");
    RideSenseApp.showToast(msg, "warning");
  }
};

window.RideSenseVoice = RideSenseVoice;
