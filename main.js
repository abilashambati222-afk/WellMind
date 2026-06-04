import './style.css';
import Chart from 'chart.js/auto';

if (!window.audioTimers) {
  window.audioTimers = {};
  window.audioData = {};

  // Procedural Noise Generators
  const generateNoise = (ctx, type) => {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'brown') {
            output[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5;
        } else if (type === 'pink') {
            output[i] = white * 0.1; // simplified pink proxy
        }
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;
    return noiseSource;
  };

  // 1. Ocean Waves
  const startOceanWaves = (ctx) => {
    const noise = generateNoise(ctx, 'brown');
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.15; // Slow crashing waves
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 300;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.4;
    noise.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(ctx.destination);
    
    noise.start();
    lfo.start();
    
    return {
        stop: () => {
            noise.stop();
            lfo.stop();
            noise.disconnect();
            masterGain.disconnect();
        }
    };
  };

  // 2. Binaural Drone
  const startBinauralDrone = (ctx) => {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.value = 100; // Left ear base
    osc2.frequency.value = 104; // Right ear (4Hz theta beat)
    
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.3;
    osc1.connect(masterGain);
    osc2.connect(masterGain);
    masterGain.connect(ctx.destination);
    
    osc1.start();
    osc2.start();
    
    return {
        stop: () => {
            osc1.stop();
            osc2.stop();
            osc1.disconnect();
            masterGain.disconnect();
        }
    };
  };

  // 3. Pink Rain
  const startPinkRain = (ctx) => {
    const noise = generateNoise(ctx, 'pink');
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800; // Muffly rain
    
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.8;
    noise.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(ctx.destination);
    
    noise.start();
    
    return {
        stop: () => {
            noise.stop();
            noise.disconnect();
            masterGain.disconnect();
        }
    };
  };

  // 4. Zen Chimes
  const startZenChimes = (ctx) => {
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.15;
    masterGain.connect(ctx.destination);
    
    const oscillators = [];
    const freqs = [396, 417, 528]; // Solfeggio frequencies
    
    freqs.forEach(freq => {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.05 + (Math.random() * 0.1);
        
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.5;
        
        // Tremolo
        const oscGain = ctx.createGain();
        oscGain.gain.value = 0.5;
        
        lfo.connect(lfoGain);
        lfoGain.connect(oscGain.gain);
        
        osc.connect(oscGain);
        oscGain.connect(masterGain);
        
        osc.start();
        lfo.start();
        
        oscillators.push({osc, lfo, oscGain});
    });
    
    return {
        stop: () => {
            oscillators.forEach(n => {
                n.osc.stop();
                n.lfo.stop();
                n.osc.disconnect();
            });
            masterGain.disconnect();
        }
    };
  };

  window.toggleAudio = (btn, progId, timeId) => {
    const isPlaying = btn.innerHTML.includes('STOP');
    
    if (isPlaying) {
      btn.innerHTML = 'START';
      clearInterval(window.audioTimers[progId]);
      
      if (window.audioData[progId] && window.audioData[progId].oscNode) {
        try {
          window.audioData[progId].oscNode.stop();
        } catch(e) {}
        window.audioData[progId].oscNode = null;
      }
    } else {
      btn.innerHTML = 'STOP';
      
      if (!window.audioData[progId]) {
         window.audioData[progId] = { time: 0, maxTime: 45 * 60 };
      }
      
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!window.globalAudioCtx) {
            window.globalAudioCtx = new AudioContext();
        }
        const ctx = window.globalAudioCtx;
        if (ctx.state === 'suspended') { ctx.resume(); }
        
        // Dispatcher logic based on progId
        let engine;
        if (progId.includes('Rain') || progId.includes('Launderette')) {
            engine = startPinkRain(ctx);
        } else if (progId.includes('Focus') || progId.includes('Exam') || progId.includes('Break')) {
            engine = startBinauralDrone(ctx);
        } else if (progId.includes('Melody') || progId.includes('Music') || progId.includes('Coffee')) {
            engine = startZenChimes(ctx);
        } else {
            // Default to Sleep Ocean Waves
             engine = startOceanWaves(ctx);
        }
        
        window.audioData[progId].oscNode = engine;
      } catch(e) {
         console.error('Audio generation failed', e);
      }

      window.audioTimers[progId] = setInterval(() => {
        window.audioData[progId].time += 1;
        let secs = window.audioData[progId].time;
        
        if (secs >= window.audioData[progId].maxTime) {
           clearInterval(window.audioTimers[progId]);
           btn.innerHTML = 'START';
           if (window.audioData[progId].oscNode) {
             try { window.audioData[progId].oscNode.stop(); } catch(e){}
             window.audioData[progId].oscNode = null;
           }
        }
        
        let m = Math.floor(secs / 60);
        let s = secs % 60;
        
        let progBar = document.getElementById(progId);
        let timeLabel = document.getElementById(timeId);
        
        if (progBar && timeLabel) {
           timeLabel.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
           let pct = (secs / window.audioData[progId].maxTime) * 100;
           progBar.style.width = pct + '%';
        }
      }, 1000);
    }
  };
}

window.moodChartInstance = null;
window.moodData = window.moodData || [3, 4, 3, 5, 2, 4, null];

window.setMood = (level, btnElement) => {
  window.moodData[6] = level;
  
  const buttons = document.querySelectorAll('.mood-selector .mood-btn');
  buttons.forEach(btn => {
    btn.style.border = '2px solid transparent';
    btn.style.boxShadow = 'var(--shadow-sm)';
    btn.style.transform = 'translateY(0)';
    // reset inline hover handlers to default so they work properly after being modified by JS
    btn.onmouseover = function() { this.style.transform='translateY(-4px)'; this.style.boxShadow='var(--shadow-md)'; };
    btn.onmouseout = function() { this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-sm)'; };
  });

  if (btnElement) {
    btnElement.style.border = '2px solid var(--color-primary)';
    btnElement.style.boxShadow = 'var(--shadow-md)';
    btnElement.style.transform = 'scale(1.05)';
    btnElement.onmouseover = function() { this.style.transform='scale(1.05) translateY(-4px)'; };
    btnElement.onmouseout = function() { this.style.transform='scale(1.05) translateY(0)'; };
  }

  if (window.moodChartInstance) {
    window.moodChartInstance.data.datasets[0].data = window.moodData;
    window.moodChartInstance.update();
  }

  if (level !== null && level !== undefined && window.renderMoodFollowup) {
    window.renderMoodFollowup(level);
  }
};

window.selectedMoodLevel = null;
window.selectedReason = null;

window.renderMoodFollowup = (level) => {
  window.selectedMoodLevel = level;
  window.selectedReason = null;
  const panel = document.getElementById('mood-followup-panel');
  if (!panel) return;

  const moods = [
    { name: 'Terrible', emoji: '😣', color: '#FAD2E1' },
    { name: 'Bad', emoji: '😕', color: '#FFE5EC' },
    { name: 'Okay', emoji: '😐', color: '#FFF4E6' },
    { name: 'Good', emoji: '🙂', color: '#E8F5E9' },
    { name: 'Great', emoji: '🤩', color: '#E8F8F5' }
  ];
  const m = moods[level - 1];

  panel.style.display = 'block';
  
  // smooth fade in/slide down effect
  setTimeout(() => {
    panel.style.opacity = '1';
    panel.style.transform = 'translateY(0)';
  }, 50);
  
  panel.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
      <h3 style="margin: 0; font-size: 1.35rem; display: flex; align-items: center; gap: 10px;">
        <span>You checked in as feeling</span> 
        <span style="background: ${m.color}; padding: 4px 12px; border-radius: 99px; font-weight: 700; font-size: 1.1rem; border: 1px solid rgba(0,0,0,0.05);">
          ${m.emoji} ${m.name}
        </span>
      </h3>
      <button onclick="document.getElementById('mood-followup-panel').style.display='none'" style="color: var(--color-text-muted); font-size: 1.5rem; line-height: 1; cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='var(--color-text-dark)'" onmouseout="this.style.color='var(--color-text-muted)'">&times;</button>
    </div>

    <p style="margin-bottom: 16px; font-weight: 600; color: var(--color-text-dark); font-size: 1.05rem;">What's contributing to your mood today? (Select one)</p>
    
    <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px;">
      <button class="reason-tag" onclick="window.selectMoodReason('work', this)" style="padding: 10px 18px; background: #F3F4F6; border: 1px solid #E5E7EB; border-radius: 99px; font-weight: 600; transition: all 0.2s; font-size: 0.95rem; color: var(--color-text-dark);">💼 Work & Career</button>
      <button class="reason-tag" onclick="window.selectMoodReason('relationships', this)" style="padding: 10px 18px; background: #F3F4F6; border: 1px solid #E5E7EB; border-radius: 99px; font-weight: 600; transition: all 0.2s; font-size: 0.95rem; color: var(--color-text-dark);">👥 Relationships</button>
      <button class="reason-tag" onclick="window.selectMoodReason('health', this)" style="padding: 10px 18px; background: #F3F4F6; border: 1px solid #E5E7EB; border-radius: 99px; font-weight: 600; transition: all 0.2s; font-size: 0.95rem; color: var(--color-text-dark);">🍎 Health & Wellness</button>
      <button class="reason-tag" onclick="window.selectMoodReason('sleep', this)" style="padding: 10px 18px; background: #F3F4F6; border: 1px solid #E5E7EB; border-radius: 99px; font-weight: 600; transition: all 0.2s; font-size: 0.95rem; color: var(--color-text-dark);">💤 Sleep Quality</button>
      <button class="reason-tag" onclick="window.selectMoodReason('family', this)" style="padding: 10px 18px; background: #F3F4F6; border: 1px solid #E5E7EB; border-radius: 99px; font-weight: 600; transition: all 0.2s; font-size: 0.95rem; color: var(--color-text-dark);">🏠 Family & Home</button>
      <button class="reason-tag" onclick="window.selectMoodReason('general', this)" style="padding: 10px 18px; background: #F3F4F6; border: 1px solid #E5E7EB; border-radius: 99px; font-weight: 600; transition: all 0.2s; font-size: 0.95rem; color: var(--color-text-dark);">🌤️ General/Other</button>
    </div>

    <div style="margin-bottom: 24px;">
      <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--color-text-dark); font-size: 1.05rem;">Want to note down details? (Optional)</label>
      <textarea id="mood-detail-notes" placeholder="How has it been affecting you?..." style="width: 100%; min-height: 80px; padding: 14px; border: 1px solid #E5E7EB; border-radius: 12px; font-family: var(--font-family); font-size: 0.95rem; resize: vertical; outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='var(--color-primary)'" onblur="this.style.borderColor='#E5E7EB'"></textarea>
    </div>

    <button onclick="window.submitMoodFollowup()" class="btn btn-primary" style="width: 100%; border-radius: 12px; padding: 14px; font-size: 1.05rem;">
      Get Wellness Suggestions
    </button>
  `;
};

window.selectMoodReason = (reason, element) => {
  window.selectedReason = reason;
  const tags = document.querySelectorAll('.reason-tag');
  tags.forEach(tag => {
    tag.style.background = '#F3F4F6';
    tag.style.borderColor = '#E5E7EB';
    tag.style.color = 'var(--color-text-dark)';
  });
  if (element) {
    element.style.background = 'var(--color-primary)';
    element.style.borderColor = 'var(--color-primary)';
    element.style.color = 'white';
  }
};

window.submitMoodFollowup = () => {
  const panel = document.getElementById('mood-followup-panel');
  if (!panel) return;

  const notesText = document.getElementById('mood-detail-notes') ? document.getElementById('mood-detail-notes').value.trim() : '';
  const reason = window.selectedReason || 'general';
  const level = window.selectedMoodLevel;

  // Empathy and feedback mapping
  let feedback = '';
  let suggestions = [];

  const moods = ['Terrible', 'Bad', 'Okay', 'Good', 'Great'];
  const moodName = moods[level - 1];

  if (level <= 2) {
    // Negative moods
    if (reason === 'work') {
      feedback = "We hear you. Workplace pressure can feel extremely heavy and lead to mental fatigue. Taking intentional micro-breaks and boundary setting can help protect your energy.";
      suggestions = [
        {
          title: "Article: Stress vs. Burnout",
          desc: "Understand the key difference and learn how to identify warning signs early.",
          link: "#/articles/stress-burnout",
          btnText: "Read Article",
          icon: "🧠"
        },
        {
          title: "Tool: Daily De-stress",
          desc: "A collection of quick exercises to release physical and mental tension.",
          link: "#/stress",
          btnText: "View Tools",
          icon: "😌"
        }
      ];
    } else if (reason === 'relationships') {
      feedback = "Relational stress can be deeply unsettling. Practicing active, non-defensive listening and expressing your needs gently can help resolve friction.";
      suggestions = [
        {
          title: "Article: Better Communication",
          desc: "Learn practical techniques like mirroring to navigate tough conversations.",
          link: "#/articles/better-communication",
          btnText: "Read Article",
          icon: "👥"
        },
        {
          title: "Companion: Chat with Ebb",
          desc: "Talk through what's on your mind with Ebb, your compassionate AI wellness guide.",
          link: "#/ebb-ai",
          btnText: "Chat with Ebb",
          icon: "🤖"
        }
      ];
    } else if (reason === 'health') {
      feedback = "Coping with physical discomfort or low energy is incredibly draining. A gentle grounding session can help activate your body's relaxation response.";
      suggestions = [
        {
          title: "Game: Lotus Pond Grounding",
          desc: "A soothing interactive visual exercise to anchor your senses in the present.",
          link: "#/game/lotus",
          btnText: "Play Lotus Pond",
          icon: "🪷"
        },
        {
          title: "Exercise: 3-Min Breathing",
          desc: "Quick, structured paced breathing to help soothe your nervous system.",
          link: "#/exercise-3min",
          btnText: "Start Breathing",
          icon: "🌬️"
        }
      ];
    } else if (reason === 'sleep') {
      feedback = "Sleep deprivation directly impacts emotional resilience. Relaxing ambient soundscapes can quiet an overactive mind to prepare for rest.";
      suggestions = [
        {
          title: "Article: 5 Reasons You Can't Sleep",
          desc: "Pinpoint common evening disruptors and how to adjust them tonight.",
          link: "#/articles/sleep-reasons",
          btnText: "Read Article",
          icon: "💤"
        },
        {
          title: "Soundscape: Midnight Launderette",
          desc: "Drift off to the rhythmic, comforting hum of spinning dryers.",
          link: "#/sleep/midnight-launderette",
          btnText: "Play Soundscape",
          icon: "🧺"
        }
      ];
    } else if (reason === 'family') {
      feedback = "Family dynamics are complex. Pausing before reacting and inserting space for your own care is essential during busy times.";
      suggestions = [
        {
          title: "Article: Mindful Parenting",
          desc: "Tips on staying present and choosing calm responses during daily chaos.",
          link: "#/articles/mindful-parenting",
          btnText: "Read Article",
          icon: "🏠"
        },
        {
          title: "Game: Breathing Bubbles",
          desc: "Pop virtual bubbles in time with relaxing breaths to ease stress.",
          link: "#/game/bubbles",
          btnText: "Play Game",
          icon: "🫧"
        }
      ];
    } else {
      feedback = "It's completely okay to have difficult days. Remember to be gentle with yourself and allow space to rest and recharge without judgment.";
      suggestions = [
        {
          title: "Exercise: 3-Min Breathing",
          desc: "A simple, guided breathing reset to help you find stability.",
          link: "#/exercise-3min",
          btnText: "Start Breathing",
          icon: "🌬️"
        },
        {
          title: "Soundscape: Ocean Waves",
          desc: "Relax your mind to the calming sound of ocean tides.",
          link: "#/sleep/sleep-music",
          btnText: "Play Soundscape",
          icon: "🌊"
        }
      ];
    }
  } else if (level === 3) {
    // Neutral mood
    feedback = "Checking in on a neutral day is a great practice. It offers a balanced canvas to build healthy habits and enjoy simple presence.";
    suggestions = [
      {
        title: "Meditation: Basics Course",
        desc: "Build a consistent foundation with short 3-5 minute daily mindfulness steps.",
        link: "#/beginning-meditation",
        btnText: "Start Basics",
        icon: "🧘"
      },
      {
        title: "Mindful Game: Zen Sand Garden",
        desc: "Rake virtual sand and place decorative stones to cultivate calm focus.",
        link: "#/game/zensand",
        btnText: "Play Zen Sand",
        icon: "🏜️"
      }
    ];
  } else {
    // Positive moods (Good, Great)
    feedback = "We're so glad you're feeling positive today! Cultivating appreciation for good moments helps strengthen your overall emotional well-being.";
    suggestions = [
      {
        title: "Article: Starting a Daily Habit",
        desc: "Tips on leveraging your good energy to set up a solid daily routine.",
        link: "#/articles/daily-meditation",
        btnText: "Read Article",
        icon: "🌱"
      },
      {
        title: "Exercise: Mindful Walking",
        desc: "Take your positive energy outside for a refreshing, guided mindful stroll.",
        link: "#/focus/walking-breaks",
        btnText: "Start Walk",
        icon: "🚶"
      }
    ];
  }

  // Generate output HTML for suggestions
  let suggestionsHTML = '';
  suggestions.forEach(s => {
    suggestionsHTML += `
      <div style="flex: 1; min-width: 250px; background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 16px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='var(--shadow-sm)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
        <div>
          <div style="font-size: 2.2rem; margin-bottom: 12px;">${s.icon}</div>
          <h4 style="margin: 0 0 8px; font-size: 1.1rem; font-weight: 700; color: var(--color-text-dark);">${s.title}</h4>
          <p style="margin: 0 0 16px; font-size: 0.92rem; color: var(--color-text-muted); line-height: 1.45;">${s.desc}</p>
        </div>
        <a href="${s.link}" class="btn btn-primary" style="padding: 10px 16px; font-size: 0.95rem; border-radius: 8px; text-align: center; text-decoration: none; width: 100%; display: block; margin-top: auto; color: white;">${s.btnText}</a>
      </div>
    `;
  });

  // Optionally mention detail notes if they were entered
  let notesQuote = '';
  if (notesText) {
    notesQuote = `
      <div style="border-left: 3px solid var(--color-primary); padding-left: 12px; margin-bottom: 24px; color: var(--color-text-muted); font-style: italic; font-size: 0.95rem;">
        "${notesText}"
      </div>
    `;
  }

  panel.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
      <h3 style="margin: 0; font-size: 1.35rem; display: flex; align-items: center; gap: 8px;">
        <span>Suggestions for You</span>
      </h3>
      <button onclick="window.renderMoodFollowup(${level})" style="background: none; border: none; color: var(--color-primary); font-weight: 600; font-size: 0.95rem; cursor: pointer;">Edit Info</button>
    </div>

    <p style="color: var(--color-text-dark); font-size: 1.05rem; line-height: 1.5; margin-bottom: 20px;">${feedback}</p>
    ${notesQuote}

    <div style="display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 24px;">
      ${suggestionsHTML}
    </div>

    <div style="text-align: right;">
      <button onclick="document.getElementById('mood-followup-panel').style.display='none'" class="btn btn-outline" style="padding: 10px 20px; font-size: 0.95rem; border-radius: 8px; cursor: pointer; color: var(--color-text-dark);">Dismiss</button>
    </div>
  `;
  
  if (panel.scrollIntoView) {
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
};

window.openTherapyModal = (type) => {
  const overlay = document.getElementById('therapy-modal-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  
  document.getElementById('modal-assessment').style.display = 'none';
  document.getElementById('modal-profile-sarah').style.display = 'none';
  document.getElementById('modal-profile-marcus').style.display = 'none';
  
  if (type === 'assessment') {
    document.getElementById('modal-assessment').style.display = 'block';
    window.assessmentStep = 1;
    window.updateAssessmentUI();
  } else if (type === 'profile-sarah') {
    document.getElementById('modal-profile-sarah').style.display = 'block';
  } else if (type === 'profile-marcus') {
    document.getElementById('modal-profile-marcus').style.display = 'block';
  }
};

window.closeTherapyModal = () => {
  const overlay = document.getElementById('therapy-modal-overlay');
  if (overlay) overlay.style.display = 'none';
};

window.openOrgModal = (type) => {
  const overlay = document.getElementById('org-modal-overlay');
  const content = document.getElementById('org-modal-content');
  if (!overlay || !content) return;

  overlay.style.display = 'flex';
  setTimeout(() => {
    overlay.style.opacity = '1';
    content.style.transform = 'scale(1)';
  }, 10);

  if (type === 'demo') {
    content.innerHTML = `
      <button onclick="window.closeOrgModal()" style="position: absolute; top: 20px; right: 24px; color: var(--color-text-muted); font-size: 1.8rem; cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='var(--color-text-dark)'" onmouseout="this.style.color='var(--color-text-muted)'">&times;</button>
      <h3 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 8px; color: var(--color-text-dark);">Book a Demo</h3>
      <p style="color: var(--color-text-muted); margin-bottom: 24px; font-size: 0.98rem; line-height: 1.5;">See how Well-Mind can transform mental health support at your organization.</p>
      
      <form onsubmit="window.submitOrgDemo(event)">
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-weight: 600; margin-bottom: 6px; font-size: 0.95rem; color: var(--color-text-dark);">Your Name</label>
          <input type="text" required placeholder="Jane Doe" style="width: 100%; padding: 12px 16px; border: 1px solid #E5E7EB; border-radius: 12px; font-family: var(--font-family); font-size: 0.95rem; outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='var(--color-primary)'" onblur="this.style.borderColor='#E5E7EB'">
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-weight: 600; margin-bottom: 6px; font-size: 0.95rem; color: var(--color-text-dark);">Work Email</label>
          <input type="email" required placeholder="jane@company.com" style="width: 100%; padding: 12px 16px; border: 1px solid #E5E7EB; border-radius: 12px; font-family: var(--font-family); font-size: 0.95rem; outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='var(--color-primary)'" onblur="this.style.borderColor='#E5E7EB'">
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-weight: 600; margin-bottom: 6px; font-size: 0.95rem; color: var(--color-text-dark);">Company Name</label>
          <input type="text" required placeholder="Acme Corp" style="width: 100%; padding: 12px 16px; border: 1px solid #E5E7EB; border-radius: 12px; font-family: var(--font-family); font-size: 0.95rem; outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='var(--color-primary)'" onblur="this.style.borderColor='#E5E7EB'">
        </div>
        <div style="margin-bottom: 16px; display: flex; gap: 16px;">
          <div style="flex: 1;">
            <label style="display: block; font-weight: 600; margin-bottom: 6px; font-size: 0.95rem; color: var(--color-text-dark);">Team Size</label>
            <select required style="width: 100%; padding: 12px 16px; border: 1px solid #E5E7EB; border-radius: 12px; font-family: var(--font-family); font-size: 0.95rem; outline: none; transition: border-color 0.2s; background: white;" onfocus="this.style.borderColor='var(--color-primary)'" onblur="this.style.borderColor='#E5E7EB'">
              <option value="1-50">1-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-1000">201-1000 employees</option>
              <option value="1000+">1000+ employees</option>
            </select>
          </div>
          <div style="flex: 1;">
            <label style="display: block; font-weight: 600; margin-bottom: 6px; font-size: 0.95rem; color: var(--color-text-dark);">Primary Need</label>
            <select required style="width: 100%; padding: 12px 16px; border: 1px solid #E5E7EB; border-radius: 12px; font-family: var(--font-family); font-size: 0.95rem; outline: none; transition: border-color 0.2s; background: white;" onfocus="this.style.borderColor='var(--color-primary)'" onblur="this.style.borderColor='#E5E7EB'">
              <option value="coaching">Mental Health Coaching</option>
              <option value="eap">EAP & Therapy</option>
              <option value="mindfulness">Mindfulness Training</option>
              <option value="other">General Wellness Benefits</option>
            </select>
          </div>
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%; border-radius: 12px; padding: 14px; font-size: 1.05rem; margin-top: 8px; color: white;">Submit Demo Request</button>
      </form>
    `;
  } else if (type === 'info') {
    content.innerHTML = `
      <button onclick="window.closeOrgModal()" style="position: absolute; top: 20px; right: 24px; color: var(--color-text-muted); font-size: 1.8rem; cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='var(--color-text-dark)'" onmouseout="this.style.color='var(--color-text-muted)'">&times;</button>
      <h3 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 8px; color: var(--color-text-dark);">Well-Mind for Teams</h3>
      <p style="color: var(--color-text-muted); margin-bottom: 24px; font-size: 0.98rem; line-height: 1.5;">Enable high-impact clinical-grade mental health programs and engagement tools for your workforce.</p>
      
      <div style="display: flex; flex-direction: column; gap: 20px; margin-bottom: 32px;">
        <div style="display: flex; gap: 16px;">
          <div style="font-size: 2rem; line-height: 1;">📊</div>
          <div>
            <h4 style="margin: 0 0 4px; font-size: 1.05rem; font-weight: 700; color: var(--color-text-dark);">Anonymous Usage Dashboards</h4>
            <p style="margin: 0; font-size: 0.92rem; color: var(--color-text-muted); line-height: 1.4;">Track aggregated, completely anonymous engagement, sleep indices, and stress trends over time.</p>
          </div>
        </div>
        <div style="display: flex; gap: 16px;">
          <div style="font-size: 2rem; line-height: 1;">💬</div>
          <div>
            <h4 style="margin: 0 0 4px; font-size: 1.05rem; font-weight: 700; color: var(--color-text-dark);">24/7 Coaching & Counseling</h4>
            <p style="margin: 0; font-size: 0.92rem; color: var(--color-text-muted); line-height: 1.4;">Employees get direct access to licensed clinicians and certified behavioral coaches through text or video.</p>
          </div>
        </div>
        <div style="display: flex; gap: 16px;">
          <div style="font-size: 2rem; line-height: 1;">🎯</div>
          <div>
            <h4 style="margin: 0 0 4px; font-size: 1.05rem; font-weight: 700; color: var(--color-text-dark);">Customized Mental Fitness Plans</h4>
            <p style="margin: 0; font-size: 0.92rem; color: var(--color-text-muted); line-height: 1.4;">Tailored pathing for work focus, sleep enhancement, and anxiety relief designed for workplace productivity.</p>
          </div>
        </div>
      </div>
      
      <button onclick="window.openOrgModal('demo')" class="btn btn-primary" style="width: 100%; border-radius: 12px; padding: 14px; font-size: 1.05rem; color: white;">Book a Free Demo</button>
    `;
  }
};

window.closeOrgModal = () => {
  const overlay = document.getElementById('org-modal-overlay');
  const content = document.getElementById('org-modal-content');
  if (!overlay || !content) return;

  overlay.style.opacity = '0';
  content.style.transform = 'scale(0.9)';
  setTimeout(() => {
    overlay.style.display = 'none';
  }, 300);
};

window.submitOrgDemo = (event) => {
  event.preventDefault();
  const content = document.getElementById('org-modal-content');
  if (!content) return;

  const form = content.querySelector('form');
  const nameVal = form.querySelectorAll('input')[0].value;
  const emailVal = form.querySelectorAll('input')[1].value;
  const companyVal = form.querySelectorAll('input')[2].value;

  content.innerHTML = `
    <button onclick="window.closeOrgModal()" style="position: absolute; top: 20px; right: 24px; color: var(--color-text-muted); font-size: 1.8rem; cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='var(--color-text-dark)'" onmouseout="this.style.color='var(--color-text-muted)'">&times;</button>
    
    <div style="text-align: center; padding: 20px 10px;">
      <div style="width: 72px; height: 72px; background: #E8F5E9; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-size: 2.2rem; color: #4CAF50; border: 2px solid #C8E6C9;">✓</div>
      <h3 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 12px; color: var(--color-text-dark);">Demo Scheduled!</h3>
      <p style="color: var(--color-text-dark); font-size: 1.05rem; line-height: 1.5; margin-bottom: 16px; font-weight: 600;">Thank you, ${nameVal}!</p>
      <p style="color: var(--color-text-muted); font-size: 0.98rem; line-height: 1.5; margin-bottom: 28px;">
        We have received your demo request for <strong>${companyVal}</strong>. One of our organization wellness specialists will email you at <strong>${emailVal}</strong> within 24 hours to coordinate a suitable time.
      </p>
      <button onclick="window.closeOrgModal()" class="btn btn-outline" style="padding: 10px 24px; font-size: 1rem; border-radius: 8px; width: 100%; cursor: pointer; color: var(--color-text-dark);">Close Panel</button>
    </div>
  `;
};

window.assessmentStep = 1;
window.updateAssessmentUI = () => {
  const steps = [1, 2, 3];
  steps.forEach(s => {
    const el = document.getElementById('assess-step-' + s);
    if (el) el.style.display = s === window.assessmentStep ? 'block' : 'none';
  });
};

window.nextAssessmentStep = () => {
  if (window.assessmentStep < 3) {
    window.assessmentStep++;
    window.updateAssessmentUI();
  } else {
    // Finish
    document.getElementById('modal-assessment').innerHTML = `
      <div style="text-align:center; padding: 40px 20px;">
        <div style="font-size: 48px; margin-bottom: 20px;">🎉</div>
        <h3 style="font-size: 1.5rem; margin-bottom: 12px;">You're all set!</h3>
        <p style="color: var(--color-text-muted); margin-bottom: 24px;">We've found 3 great therapists who match your needs. We've sent the details to your email.</p>
        <button class="btn btn-primary" onclick="window.closeTherapyModal()">Close</button>
      </div>
    `;
  }
};

window.bookConsultation = (name) => {
  alert('Success! A consultation request has been sent to ' + name + '. They will reach out shortly.');
  window.closeTherapyModal();
};

// HTML Shell - Navbar and Footer are constant
const shell = `
  <div class="app-layout">
    <!-- Navbar -->
    <header class="navbar">
      <div class="container navbar-container">
        <a href="#/" class="logo">
          <div class="logo-dot"></div> Well-Mind
        </a>
        <nav class="nav-links">
          <a href="#/meditation" class="nav-link" id="nav-meditation">Meditation</a>
          <a href="#/sleep" class="nav-link" id="nav-sleep">Sleep</a>
          <a href="#/focus" class="nav-link" id="nav-focus">Focus</a>
          <a href="#/articles" class="nav-link" id="nav-articles">Articles</a>
          <a href="#/mindful-games" class="nav-link" id="nav-mindful-games">Games</a>
        </nav>
        <div class="nav-actions">
          <button id="request-permissions-btn" class="btn btn-outline btn-small" style="margin-right: 8px;">Allow Permissions</button>
          <a href="#/login" class="nav-link login-link">Log in</a>
          <a href="#/signup" class="btn btn-primary btn-small">Free forever</a>
        </div>
      </div>
    </header>

    <div id="permission-status" style="background: #E4F1FF; color: #0B3C72; padding: 12px 20px; text-align: center; font-weight: 600; display: none;">Permission status will appear here.</div>

    <!-- Dynamic Main Content -->
    <main id="main-content">
      <!-- Pages will be injected here -->
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-col brand-col">
            <a href="#/" class="logo logo-white">
              <div class="logo-dot bg-white"></div> Well-Mind
            </a>
            <p class="footer-desc">Find your focus, sleep better, and stress less.</p>
          </div>
          <div class="footer-col">
            <h4>What we offer</h4>
            <ul>
              <li><a href="#/meditation">Meditation</a></li>
              <li><a href="#/online-therapy">Online therapy</a></li>
              <li><a href="#/mindfulness">Mindfulness</a></li>
              <li><a href="#/sleep">Sleep</a></li>
              <li><a href="#/coaching">Mental health coaching</a></li>
              <li><a href="#/ebb-ai">Ebb AI companion</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>How we help</h4>
            <ul>
              <li><a href="#/anxiety">Anxiety</a></li>
              <li><a href="#/stress">Stress</a></li>
              <li><a href="#/sleep-better">Sleep better</a></li>
              <li><a href="#/mental-health">Mental health</a></li>
              <li><a href="#/mindful-families">Mindful families</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Explore our library</h4>
            <ul>
              <li><a href="#/new-popular">New and popular</a></li>
              <li><a href="#/guided-courses">Guided courses</a></li>
              <li><a href="#/beginning-meditation">Beginning meditation</a></li>
              <li><a href="#/calming-anxiety">Calming everyday anxiety</a></li>
              <li><a href="#/mindful-parenting">Mindful parenting</a></li>
              <li><a href="#/mindfulness-work">Mindfulness at work</a></li>
              <li><a href="#/sleep-music">Sleep music</a></li>
              <li><a href="#/white-noise">Wind & Rain</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#/about">About us</a></li>
              <li><a href="#/careers">Careers</a></li>
              <li><a href="#/press">Press</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 Well-Mind. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
`;

// Inject shell into app
document.querySelector('#app').innerHTML = shell;

const permissionStatus = document.getElementById('permission-status');
const updatePermissionStatus = (message, isError = false) => {
  if (!permissionStatus) return;
  permissionStatus.style.display = 'block';
  permissionStatus.style.color = isError ? '#901C1C' : '#0B3C72';
  permissionStatus.style.background = isError ? '#FDE2E2' : '#E4F1FF';
  permissionStatus.textContent = message;
};

const requestPermissions = async () => {
  try {
    updatePermissionStatus('Requesting camera and microphone access...');

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
       const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
       stream.getTracks().forEach((track) => track.stop());
    }

    updatePermissionStatus('Camera and microphone permissions granted. Requesting location...');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            const city = data.address.city || data.address.town || data.address.village || data.address.county || 'your location';
            updatePermissionStatus(`Location permission granted. You are near ${city}. All permissions allowed.`);
          } catch (e) {
            updatePermissionStatus(`Location permission granted. Coordinates: ${latitude.toFixed(2)}, ${longitude.toFixed(2)}. All permissions allowed.`);
          }
        },
        async (err) => {
          try {
            updatePermissionStatus('Browser location unavailable. Attempting IP fallback...');
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            if (data.city) {
              updatePermissionStatus(`Location determined via IP. You are near ${data.city}. All permissions allowed.`);
            } else {
               updatePermissionStatus(`All permissions granted. Location is hidden for your privacy.`);
            }
          } catch (ipErr) {
             updatePermissionStatus(`All permissions granted. Location is hidden for your privacy.`);
          }
        },
        { timeout: 10000 }
      );
    } else {
        updatePermissionStatus(`All permissions granted. Location is hidden for your privacy.`);
    }
  } catch (error) {
    updatePermissionStatus(`All permissions granted. Location is hidden for your privacy.`);
  }
};

const permissionButton = document.getElementById('request-permissions-btn');
if (permissionButton) {
  permissionButton.addEventListener('click', requestPermissions);
}

// --- Page Components ---

const Home = `
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="container hero-container">
          <div class="hero-content">
            <h1 class="hero-title">What kind of headspace are you looking for?</h1>
            <p class="hero-subtitle">Live a healthier, happier, more well-rested life in just a few minutes a day.</p>
            <div class="hero-pills">
              <a href="#/stress" class="pill-btn"><span class="pill-icon">😌</span> Stress less</a>
              <a href="#/sleep" class="pill-btn"><span class="pill-icon">💤</span> Sleep soundly</a>
              <a href="#/anxiety" class="pill-btn"><span class="pill-icon">🌱</span> Manage anxiety</a>
              <a href="#/articles" class="pill-btn"><span class="pill-icon">🧠</span> Process thoughts</a>
              <a href="#/meditation" class="pill-btn"><span class="pill-icon">🧘</span> Practice meditation</a>
            </div>
          </div>
          <div class="hero-image-wrapper">
            <div class="blob-shape blob-1"></div>
            <div class="blob-shape blob-2"></div>
            <img class="hero-image" src="https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Meditation illustration">
          </div>
        </div>
      </section>

      <!-- Daily Check-in / Mood Logging -->
      <section class="daily-checkin-section" style="padding: 60px 0; background-color: #F8F9FA;">
        <div class="container" style="max-width: 800px; text-align: center;">
          <h2 style="font-size: 2rem; margin-bottom: 12px; font-family: var(--font-family);">How are you feeling today?</h2>
          <p style="color: var(--color-text-muted); margin-bottom: 32px; font-size: 1.1rem;">Take a moment to check in with yourself.</p>
          
          <div class="mood-selector" style="display: flex; justify-content: space-between; gap: 16px; margin-bottom: 40px;">
            <button class="mood-btn" onclick="window.setMood(1, this)" style="flex: 1; padding: 24px 16px; background: white; border: 2px solid transparent; border-radius: 20px; cursor: pointer; transition: all 0.2s ease; box-shadow: var(--shadow-sm);" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='var(--shadow-md)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-sm)';">
              <div style="font-size: 3rem; margin-bottom: 12px;">😣</div>
              <div style="font-weight: 600; color: var(--color-text-dark);">Terrible</div>
            </button>
            <button class="mood-btn" onclick="window.setMood(2, this)" style="flex: 1; padding: 24px 16px; background: white; border: 2px solid transparent; border-radius: 20px; cursor: pointer; transition: all 0.2s ease; box-shadow: var(--shadow-sm);" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='var(--shadow-md)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-sm)';">
              <div style="font-size: 3rem; margin-bottom: 12px;">😕</div>
              <div style="font-weight: 600; color: var(--color-text-dark);">Bad</div>
            </button>
            <button class="mood-btn" onclick="window.setMood(3, this)" style="flex: 1; padding: 24px 16px; background: white; border: 2px solid transparent; border-radius: 20px; cursor: pointer; transition: all 0.2s ease; box-shadow: var(--shadow-sm);" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='var(--shadow-md)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-sm)';">
              <div style="font-size: 3rem; margin-bottom: 12px;">😐</div>
              <div style="font-weight: 600; color: var(--color-text-dark);">Okay</div>
            </button>
            <button class="mood-btn" id="default-mood-btn" onclick="window.setMood(4, this)" style="flex: 1; padding: 24px 16px; background: white; border: 2px solid var(--color-primary); border-radius: 20px; cursor: pointer; transition: all 0.2s ease; box-shadow: var(--shadow-md); transform: scale(1.05);" onmouseover="this.style.transform='scale(1.05) translateY(-4px)';" onmouseout="this.style.transform='scale(1.05) translateY(0)';">
              <div style="font-size: 3rem; margin-bottom: 12px;">🙂</div>
              <div style="font-weight: 600; color: var(--color-text-dark);">Good</div>
            </button>
            <button class="mood-btn" onclick="window.setMood(5, this)" style="flex: 1; padding: 24px 16px; background: white; border: 2px solid transparent; border-radius: 20px; cursor: pointer; transition: all 0.2s ease; box-shadow: var(--shadow-sm);" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='var(--shadow-md)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-sm)';">
              <div style="font-size: 3rem; margin-bottom: 12px;">🤩</div>
              <div style="font-weight: 600; color: var(--color-text-dark);">Great</div>
            </button>
          </div>
          
          <!-- Mood check-in follow-up panel -->
          <div id="mood-followup-panel" style="display: none; margin-top: -16px; margin-bottom: 40px; background: white; border: 1px solid #EAEAEA; border-radius: 24px; padding: 32px; box-shadow: var(--shadow-md); transition: all 0.3s ease; text-align: left;">
          </div>
          
          <div style="margin-top: 40px; margin-bottom: 40px; background: white; padding: 24px; border-radius: 16px; border: 1px solid #EAEAEA; box-shadow: var(--shadow-sm);">
            <h3 style="text-align: left; margin-top: 0; margin-bottom: 16px; font-size: 1.2rem;">Your Mood Trend</h3>
            <div style="position: relative; height: 120px; width: 100%;">
              <canvas id="moodChart"></canvas>
            </div>
          </div>

          <div style="background: white; padding: 24px; border-radius: 16px; border: 1px solid #EAEAEA; text-align: left; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <h4 style="margin: 0 0 8px; font-size: 1.2rem;">Quick Assessment</h4>
              <p style="margin: 0; color: var(--color-text-muted); font-size: 0.95rem;">Take a 2-minute stress check-in to get personalized recommendations.</p>
            </div>
            <button class="btn btn-primary" onclick="window.location.hash='#/assessment'" style="white-space: nowrap;">Start Check-in</button>
          </div>
        </div>
      </section>

      <!-- Features / Library Section -->
      <section class="library-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Explore our library</h2>
            <p class="section-subtitle">Find what you need to feel your best.</p>
          </div>
          <div class="library-grid">
            <a href="#/meditation" class="library-card card-yellow">
              <div class="card-content">
                <h3>New and popular</h3>
                <p>Trending meditations and music.</p>
              </div>
              <div class="card-illustration">✨</div>
            </a>
            <a href="#/meditation" class="library-card card-teal">
              <div class="card-content">
                <h3>Guided courses</h3>
                <p>Step-by-step mental wellness.</p>
              </div>
              <div class="card-illustration">🛤️</div>
            </a>
            <a href="#/sleep" class="library-card card-orange">
              <div class="card-content">
                <h3>Sleep music</h3>
                <p>Drift off to peaceful sounds.</p>
              </div>
              <div class="card-illustration">🎵</div>
            </a>
            <a href="#/articles" class="library-card card-purple">
              <div class="card-content">
                <h3>Mindful parenting</h3>
                <p>Patience and connection.</p>
              </div>
              <div class="card-illustration">👨‍👩‍👧</div>
            </a>
          </div>
          <div class="text-center" style="margin-top: 40px;">
            <a href="#/meditation" class="btn btn-outline">View all categories</a>
          </div>
        </div>
      </section>

      <!-- Organization Section -->
      <section class="org-section">
        <div class="container org-container">
          <h2 class="org-title">Over 4,000 leading organizations choose Well-Mind</h2>
          <p class="org-subtitle">Support your team with mindfulness, coaching, EAP, therapy, and psychiatry.</p>
          <div class="org-actions">
            <button class="btn btn-primary" onclick="window.openOrgModal('demo')">Request a demo</button>
            <button class="btn btn-white" onclick="window.openOrgModal('info')">Learn more</button>
          </div>
        </div>
      </section>

      <!-- Organization Modal Overlay -->
      <div id="org-modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(32, 29, 26, 0.6); backdrop-filter: blur(8px); z-index: 9999; justify-content: center; align-items: center; opacity: 0; transition: opacity 0.3s ease;">
        <div id="org-modal-content" style="background: white; width: 100%; max-width: 550px; border-radius: 28px; padding: 40px; box-shadow: var(--shadow-lg); position: relative; transform: scale(0.9); transition: transform 0.3s ease; max-height: 90vh; overflow-y: auto;">
        </div>
      </div>
`;

const Meditation = `
  <section class="page-hero bg-teal" style="background-color: #E6F7F0; padding: 80px 0;">
    <div class="container text-center">
      <h1 class="hero-title" style="margin-bottom: 20px;">Meditation for everyday life</h1>
      <p class="hero-subtitle" style="margin: 0 auto; max-width: 600px;">Discover hundreds of guided meditations for everything from stress and anxiety to focus and sleep.</p>
    </div>
  </section>
  <section class="library-section">
    <div class="container">
      <h2 class="section-title">Popular Meditations</h2>
      <div class="library-grid" style="margin-bottom: 40px;">
        <div class="library-card card-teal" style="cursor: pointer;" onclick="window.location.hash='#/beginning-meditation'">
          <div class="card-content"><h3>Basics</h3><p>Learn the fundamentals of meditation.</p></div>
          <div class="card-illustration">🧘</div>
        </div>
        <div class="library-card card-teal" style="cursor: pointer;" onclick="window.location.hash='#/calming-anxiety'">
          <div class="card-content"><h3>Managing Anxiety</h3><p>Tools to help you stress less.</p></div>
          <div class="card-illustration">🍃</div>
        </div>
        <div class="library-card card-teal" style="cursor: pointer;" onclick="window.location.hash='#/guided-courses'">
          <div class="card-content"><h3>Navigating Change</h3><p>Find your center when life shifts.</p></div>
          <div class="card-illustration">🧭</div>
        </div>
      </div>
      
      <h2 class="section-title">Beginner Courses</h2>
      <div class="library-grid" style="margin-bottom: 40px;">
        <div class="library-card card-teal" style="cursor: pointer;" onclick="window.location.hash='#/beginning-meditation'">
          <div class="card-content"><h3>Basics 2</h3><p>Deepen your newly acquired skills.</p></div>
          <div class="card-illustration">🌱</div>
        </div>
        <div class="library-card card-teal" style="cursor: pointer;" onclick="window.location.hash='#/beginning-meditation'">
          <div class="card-content"><h3>Basics 3</h3><p>Establish a true daily habit.</p></div>
          <div class="card-illustration">🌳</div>
        </div>
        <div class="library-card card-teal" style="cursor: pointer;" onclick="window.location.hash='#/beginning-meditation'">
          <div class="card-content"><h3>How to Sit</h3><p>Postures for comfortable sessions.</p></div>
          <div class="card-illustration">🪑</div>
        </div>
      </div>

      <h2 class="section-title">Work & Productivity</h2>
      <div class="library-grid">
        <div class="library-card card-teal">
          <div class="card-content"><h3>Presentations</h3><p>Calm nerves before speaking.</p></div>
          <div class="card-illustration">🎤</div>
        </div>
        <div class="library-card card-teal">
          <div class="card-content"><h3>Creative Writing</h3><p>Unlock the flow state.</p></div>
          <div class="card-illustration">✍️</div>
        </div>
        <div class="library-card card-teal">
          <div class="card-content"><h3>End of Day</h3><p>Leave work stress at work.</p></div>
          <div class="card-illustration">🚪</div>
        </div>
      </div>
    </div>
  </section>
`;

const Sleep = `
  <section class="page-hero" style="background-color: #1A1A3A; color: white; padding: 80px 0;">
    <div class="container text-center">
      <h1 class="hero-title" style="margin-bottom: 20px; color: white;">Sleep soundly, wake up rested</h1>
      <p class="hero-subtitle" style="margin: 0 auto; max-width: 600px; color: #A0A0C0;">Create the conditions for a restful night's sleep with sleepcasts, music, and more.</p>
    </div>
  </section>
  <section class="library-section">
    <div class="container">
      <h2 class="section-title">Sleep Library</h2>
      <div class="library-grid" style="margin-bottom: 40px;">
        <div class="library-card" style="cursor: pointer; background-color: #2D2D5E; color: white;" onclick="window.location.hash='#/sleep/sleepcasts'">
          <div class="card-content"><h3>Sleepcasts</h3><p>Stories to dream to.</p></div>
          <div class="card-illustration">🌙</div>
        </div>
        <div class="library-card" style="cursor: pointer; background-color: #2D2D5E; color: white;" onclick="window.location.hash='#/sleep/sleep-music'">
          <div class="card-content"><h3>Sleep Music</h3><p>Drift off to peaceful sounds.</p></div>
          <div class="card-illustration">🎶</div>
        </div>
        <div class="library-card" style="cursor: pointer; background-color: #2D2D5E; color: white;" onclick="window.location.hash='#/sleep/wind-downs'">
          <div class="card-content"><h3>Wind Downs</h3><p>Prepare your mind for rest.</p></div>
          <div class="card-illustration">🕯️</div>
        </div>
      </div>
      
      <h2 class="section-title">Nighttime Stories</h2>
      <div class="library-grid" style="margin-bottom: 40px;">
        <div class="library-card" style="cursor: pointer; background-color: #2D2D5E; color: white;" onclick="window.location.hash='#/sleep/rainday-antiques'">
          <div class="card-content"><h3>Rainday Antiques</h3><p>A wander through a cozy shop.</p></div>
          <div class="card-illustration">🕰️</div>
        </div>
        <div class="library-card" style="cursor: pointer; background-color: #2D2D5E; color: white;" onclick="window.location.hash='#/sleep/midnight-launderette'">
          <div class="card-content"><h3>Midnight Launderette</h3><p>The hum of tumbling clothes.</p></div>
          <div class="card-illustration">🧺</div>
        </div>
        <div class="library-card" style="cursor: pointer; background-color: #2D2D5E; color: white;" onclick="window.location.hash='#/sleep/cat-marina'">
          <div class="card-content"><h3>Cat Marina</h3><p>Boats bobbing and felines sleeping.</p></div>
          <div class="card-illustration">⛵</div>
        </div>
      </div>
      
      <h2 class="section-title">Kids Sleep</h2>
      <div class="library-grid">
        <div class="library-card" style="cursor: pointer; background-color: #2D2D5E; color: white;" onclick="window.location.hash='#/sleep/goodnight-moon'">
          <div class="card-content"><h3>Goodnight Moon</h3><p>Classic tales narrated softly.</p></div>
          <div class="card-illustration">🌜</div>
        </div>
        <div class="library-card" style="cursor: pointer; background-color: #2D2D5E; color: white;" onclick="window.location.hash='#/sleep/breathing-elmo'">
          <div class="card-content"><h3>Breathing with Elmo</h3><p>Fun exercises for little ones.</p></div>
          <div class="card-illustration">🎈</div>
        </div>
        <div class="library-card" style="cursor: pointer; background-color: #2D2D5E; color: white;" onclick="window.location.hash='#/sleep/sleepy-jungle'">
          <div class="card-content"><h3>Sleepy Jungle</h3><p>Animal friends go to rest.</p></div>
          <div class="card-illustration">🐒</div>
        </div>
      </div>
    </div>
  </section>
`;

const Focus = `
  <section class="page-hero" style="background-color: #FFF3E0; padding: 80px 0;">
    <div class="container text-center">
      <h1 class="hero-title" style="margin-bottom: 20px;">Get in the zone</h1>
      <p class="hero-subtitle" style="margin: 0 auto; max-width: 600px;">Music and meditations designed to help you concentrate and do your best work.</p>
    </div>
  </section>
  <section class="library-section">
    <div class="container">
      <h2 class="section-title">Focus Enhancers</h2>
      <div class="library-grid" style="margin-bottom: 40px;">
        <div class="library-card card-orange" style="cursor: pointer;" onclick="window.location.hash='#/focus/focus-music'">
          <div class="card-content"><h3>Focus Music</h3><p>Beats to boost productivity.</p></div>
          <div class="card-illustration">🎧</div>
        </div>
        <div class="library-card card-orange" style="cursor: pointer;" onclick="window.location.hash='#/focus/quick-breaks'">
          <div class="card-content"><h3>Quick Breaks</h3><p>Reset your mind before the next task.</p></div>
          <div class="card-illustration">⏱️</div>
        </div>
        <div class="library-card card-orange" style="cursor: pointer;" onclick="window.location.hash='#/focus/exam-prep'">
          <div class="card-content"><h3>Exam Prep</h3><p>Calm those testing nerves.</p></div>
          <div class="card-illustration">📚</div>
        </div>
      </div>
      
      <h2 class="section-title">Soundscapes</h2>
      <div class="library-grid" style="margin-bottom: 40px;">
        <div class="library-card card-orange" style="cursor: pointer;" onclick="window.location.hash='#/focus/melody-flow'">
          <div class="card-content"><h3>Melody Flow</h3><p>Soft melodic loops for focused calm.</p></div>
          <div class="card-illustration">🎼</div>
        </div>
        <div class="library-card card-orange" style="cursor: pointer;" onclick="window.location.hash='#/focus/coffee-shop'">
          <div class="card-content"><h3>Coffee Shop</h3><p>The hum of a busy café.</p></div>
          <div class="card-illustration">☕</div>
        </div>
        <div class="library-card card-orange" style="cursor: pointer;" onclick="window.location.hash='#/focus/forest-ambience'">
          <div class="card-content"><h3>Forest Ambience</h3><p>Nature sounds to clear the mind.</p></div>
          <div class="card-illustration">🌲</div>
        </div>
      </div>
      
      <h2 class="section-title">Mindful Movement</h2>
      <div class="library-grid">
        <div class="library-card card-orange" style="cursor: pointer;" onclick="window.location.hash='#/focus/desk-stretches'">
          <div class="card-content"><h3>Desk Stretches</h3><p>Relieve neck and shoulder tension.</p></div>
          <div class="card-illustration">💪</div>
        </div>
        <div class="library-card card-orange" style="cursor: pointer;" onclick="window.location.hash='#/focus/walking-breaks'">
          <div class="card-content"><h3>Walking Breaks</h3><p>A guided mind-clearing stroll.</p></div>
          <div class="card-illustration">🚶‍♂️</div>
        </div>
        <div class="library-card card-orange" style="cursor: pointer;" onclick="window.location.hash='#/focus/eye-rest'">
          <div class="card-content"><h3>Eye Rest</h3><p>Exercises for screen fatigue.</p></div>
          <div class="card-illustration">👁️</div>
        </div>
      </div>
    </div>
  </section>
`;

const Articles = `
  <section class="page-hero" style="background-color: #F3E5F5; padding: 80px 0;">
    <div class="container text-center">
      <h1 class="hero-title" style="margin-bottom: 20px;">Mindful living articles</h1>
      <p class="hero-subtitle" style="margin: 0 auto; max-width: 600px;">Read the latest insights and guides on health, happiness, and mindfulness.</p>
    </div>
  </section>
  <section class="library-section">
    <div class="container">
      <h2 class="section-title">Latest & Greatest</h2>
      <div class="library-grid" style="margin-bottom: 40px;">
        <article class="library-card" style="background: white; border: 1px solid #EAEAEA; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='var(--shadow-md)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';" onclick="window.location.hash='#/articles/daily-meditation'">
          <div class="card-content">
            <small style="color: var(--color-primary); font-weight: bold;">MINDFULNESS</small>
            <h3 style="margin-top: 8px;">How to start a daily meditation habit</h3>
            <p style="color: var(--color-text-muted);">A simple guide to building a routine that sticks.</p>
          </div>
        </article>
        <article class="library-card" style="background: white; border: 1px solid #EAEAEA; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='var(--shadow-md)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';" onclick="window.location.hash='#/articles/sleep-reasons'">
          <div class="card-content">
            <small style="color: var(--color-primary); font-weight: bold;">SLEEP</small>
            <h3 style="margin-top: 8px;">5 reasons you can't sleep at night</h3>
            <p style="color: var(--color-text-muted);">And what you can do about it tonight.</p>
          </div>
        </article>
        <article class="library-card" style="background: white; border: 1px solid #EAEAEA; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='var(--shadow-md)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';" onclick="window.location.hash='#/articles/stress-burnout'">
          <div class="card-content">
            <small style="color: var(--color-primary); font-weight: bold;">STRESS</small>
            <h3 style="margin-top: 8px;">The difference between stress and burnout</h3>
            <p style="color: var(--color-text-muted);">Learn how to identify and treat both before they escalate.</p>
          </div>
        </article>
      </div>
      
      <h2 class="section-title">Relationships</h2>
      <div class="library-grid" style="margin-bottom: 40px;">
        <article class="library-card" style="background: white; border: 1px solid #EAEAEA; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='var(--shadow-md)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';" onclick="window.location.hash='#/articles/better-communication'">
          <div class="card-content">
            <small style="color: var(--color-primary); font-weight: bold;">MIND</small>
            <h3 style="margin-top: 8px;">Building better communication</h3>
            <p style="color: var(--color-text-muted);">Active listening techniques for partners.</p>
          </div>
        </article>
        <article class="library-card" style="background: white; border: 1px solid #EAEAEA; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='var(--shadow-md)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';" onclick="window.location.hash='#/articles/mindful-parenting'">
          <div class="card-content">
            <small style="color: var(--color-primary); font-weight: bold;">PARENTING</small>
            <h3 style="margin-top: 8px;">Mindful parenting tips</h3>
            <p style="color: var(--color-text-muted);">Staying patient during the terrible twos.</p>
          </div>
        </article>
        <article class="library-card" style="background: white; border: 1px solid #EAEAEA; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='var(--shadow-md)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';" onclick="window.location.hash='#/articles/difficult-colleagues'">
          <div class="card-content">
            <small style="color: var(--color-primary); font-weight: bold;">WORK</small>
            <h3 style="margin-top: 8px;">Navigating difficult colleagues</h3>
            <p style="color: var(--color-text-muted);">Setting boundaries with empathy.</p>
          </div>
        </article>
      </div>
    </div>
  </section>
`;


const createMediaPage = (category, title, heroColor, icon, description, backLink) => {
  const uid = title.replace(/\s+/g, '');
  return `
  <section class="page-hero" style="background-color: ${heroColor}; padding: 80px 0; min-height: 40vh; display: flex; align-items: center; justify-content: center; text-align: center;">
    <div class="container">
      <small style="display: inline-block; background: rgba(255,255,255,0.6); padding: 6px 12px; border-radius: 20px; font-weight: bold; margin-bottom: 24px; letter-spacing: 1px; color: #111;">${category}</small>
      <div style="font-size: 64px; margin-bottom: 24px;">${icon}</div>
      <h1 class="hero-title" style="margin-bottom: 16px; margin-left: auto; margin-right: auto; max-width: 800px; color: #111;">${title}</h1>
      <p style="font-size: 1.25rem; max-width: 600px; margin: 0 auto; color: #333; opacity: 0.9;">${description}</p>
    </div>
  </section>
  <section style="padding: 80px 0; background: white; min-height: 40vh; display: flex; align-items: flex-start; justify-content: center;">
    <div class="container text-center" style="max-width: 600px;">
      <!-- Premium Media Player UI -->
      <div style="background: white; border-radius: 24px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.08); transform: translateY(-120px);">
        <div style="margin-bottom: 40px;">
          <button id="btn-${uid}" onclick="window.toggleAudio(this, 'prog-${uid}', 'time-${uid}')" style="width: 80px; height: 80px; border-radius: 40px; background: var(--color-brand); color: white; border: none; font-size: 16px; font-weight: bold; letter-spacing: 1px; display: flex; align-items: center; justify-content: center; margin: 0 auto; cursor: pointer; box-shadow: 0 10px 20px rgba(246, 114, 66, 0.3); transition: transform 0.2s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            START
          </button>
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; color: var(--color-text-light); font-size: 0.9rem; font-family: monospace;">
          <span id="time-${uid}">00:00</span>
          <span>45:00</span>
        </div>
        <div style="width: 100%; height: 6px; background: #EAEAEA; border-radius: 3px; cursor: pointer; position: relative;">
          <div id="prog-${uid}" style="position: absolute; left: 0; top: 0; height: 100%; width: 0%; background: var(--color-brand); border-radius: 3px; transition: width 1s linear;"></div>
        </div>
      </div>
      <div style="margin-top: -60px;">
        <a href="${backLink}" class="btn btn-outline" style="border-radius: 100px;">&larr; Back to Library</a>
      </div>
    </div>
  </section>
  `;
};

const createArticlePage = (category, title, heroColor, content) => `
  <section class="page-hero" style="background-color: ${heroColor}; padding: 60px 0;">
    <div class="container">
      <small style="display: inline-block; background: rgba(255,255,255,0.4); padding: 6px 12px; border-radius: 20px; font-weight: bold; margin-bottom: 16px; letter-spacing: 1px; color: #111;">${category}</small>
      <h1 class="hero-title" style="margin-bottom: 12px; max-width: 800px;">${title}</h1>
    </div>
  </section>
  <section style="padding: 60px 0; background: white; min-height: 50vh;">
    <div class="container" style="max-width: 768px;">
      <div style="line-height: 1.8; font-size: 1.15rem; color: var(--color-text-dark);">
        ${content}
      </div>
      <div style="margin-top: 60px; padding-top: 40px; border-top: 1px solid #EAEAEA;">
        <a href="#/articles" class="btn btn-outline" style="border-radius: 100px;">&larr; Back to Articles</a>
      </div>
    </div>
  </section>
`;

const ArticleDailyMeditation = createArticlePage('MINDFULNESS', 'How to start a daily meditation habit', '#E3F2FD', `
  <p style="margin-bottom: 24px; font-size: 1.25rem;">Building a daily meditation habit isn’t about sitting still perfectly for an hour; it’s about consistently showing up, even for just a few minutes.</p>

  <h3 style="font-size: 1.5rem; margin: 32px 0 16px;">1. Start incredibly small</h3>
  <p style="margin-bottom: 24px;">Don't aim for 30 minutes on day one. Start with just 3 to 5 minutes. The goal is to establish the habit of sitting down to meditate, not to achieve enlightenment immediately. When the barrier to entry is extremely low, you’re less likely to skip it.</p>

  <h3 style="font-size: 1.5rem; margin: 32px 0 16px;">2. Anchor it to an existing habit</h3>
  <p style="margin-bottom: 24px;">Habit stacking is one of the most effective behavior change techniques. Tie your new meditation practice to something you already do every day without fail. For example, meditate immediately after brushing your teeth in the morning, or right before your morning coffee.</p>

  <h3 style="font-size: 1.5rem; margin: 32px 0 16px;">3. Find a comfortable, dedicated spot</h3>
  <p style="margin-bottom: 24px;">You don't need a dedicated zafu cushion, but having a consistent location helps signal to your brain that it's time to shift gears. A specific comfortable chair or a quiet corner of your bedroom works perfectly.</p>

  <h3 style="font-size: 1.5rem; margin: 32px 0 16px;">4. Forgive your wandering mind</h3>
  <p style="margin-bottom: 24px;">The most common misconception is that meditation is the act of stopping your thoughts. It’s not. The mind's nature is to think. The practice is noticing when your mind has wandered and gently bringing your focus back to the present (usually your breath). Every time you do this, you are doing a "rep" for your brain.</p>
`);

const ArticleSleepReasons = createArticlePage('SLEEP', '5 reasons you can\'t sleep at night', '#E8EAF6', `
  <p style="margin-bottom: 24px; font-size: 1.25rem;">We've all been there: staring at the ceiling while the hours tick toward morning. While occasional restlessness is normal, chronic sleep issues often stem from hidden lifestyle factors.</p>

  <h3 style="font-size: 1.5rem; margin: 32px 0 16px;">1. The "Second Wind" Effect</h3>
  <p style="margin-bottom: 24px;">If you push past your natural window of sleepiness—often around 10 or 11 PM—your body may interpret this as a need to stay awake for an emergency. It releases a secondary surge of cortisol, giving you a "second wind" that makes it nearly impossible to wind down.</p>

  <h3 style="font-size: 1.5rem; margin: 32px 0 16px;">2. Blue Light Disruption</h3>
  <p style="margin-bottom: 24px;">The screens on our phones and laptops emit blue light, which powerfully suppresses melatonin (the sleep hormone). Staring at a screen before bed effectively tells your brain that the sun is still up.</p>

  <h3 style="font-size: 1.5rem; margin: 32px 0 16px;">3. Ambient Room Temperature</h3>
  <p style="margin-bottom: 24px;">Your core body temperature needs to drop slightly to initiate and maintain deep sleep. A room that is too warm (usually above 68°F or 20°C) can cause you to toss and turn. Try cooling your bedroom to signal to your body that it's time for rest.</p>

  <h3 style="font-size: 1.5rem; margin: 32px 0 16px;">4. The Late-Day Caffeine Trap</h3>
  <p style="margin-bottom: 24px;">Caffeine has a half-life of 5 to 7 hours. A coffee or heavily caffeinated tea consumed at 4 PM can still be keeping your nervous system alert at midnight, even if you feel mentally exhausted.</p>

  <h3 style="font-size: 1.5rem; margin: 32px 0 16px;">5. An Active Mind (The "To-Do" Loop)</h3>
  <p style="margin-bottom: 24px;">When we finally eliminate distractions and lie in the quiet, our brain uses the opportunity to process the day and plan for tomorrow. Keep a notepad by your bed for a "brain dump." Writing down your worries can effectively hit pause on those thoughts until the morning.</p>
`);

const ArticleStressBurnout = createArticlePage('STRESS', 'The difference between stress and burnout', '#FFF3E0', `
  <p style="margin-bottom: 24px; font-size: 1.25rem;">Stress and burnout are often used interchangeably, but they are fundamentally different states of physical and emotional exhaustion. Understanding the distinction is the first step toward effective recovery.</p>

  <h3 style="font-size: 1.5rem; margin: 32px 0 16px;">Stress is "Too Much"</h3>
  <p style="margin-bottom: 24px;">Stress is characterized by over-engagement. When we are stressed, we often feel like there are too many pressures, but we still retain the belief that if we can just get everything under control, we will feel better. It's associated with hyperactive emotions, urgency, and physical anxiety.</p>

  <h3 style="font-size: 1.5rem; margin: 32px 0 16px;">Burnout is "Not Enough"</h3>
  <p style="margin-bottom: 24px;">Burnout is characterized by disengagement and a sense of "not enough." Not enough energy, not enough motivation, and not enough care. While stress feels like drowning in responsibilities, burnout feels like you’ve been completely drained dry. It is accompanied by blunted emotions, cynicism, detachment, and a prevailing sense of hopelessness.</p>

  <h3 style="font-size: 1.5rem; margin: 32px 0 16px;">Why the Difference Matters</h3>
  <p style="margin-bottom: 24px;">Treating burnout with stress-reduction techniques often fails. If you are stressed, you might need rest and a reduction in workload. But if you are burned out, simply resting isn't enough to restore your passion or sense of purpose.</p>

  <p style="margin-bottom: 24px;">Recovering from burnout often requires deep, structural changes to your life, re-evaluating your boundaries, and actively seeking out activities that replenish your sense of self and joy, rather than just waiting to have enough energy to return to the treadmill.</p>
`);

const ArticleBetterCommunication = createArticlePage('MIND', 'Building better communication', '#E8F5E9', `
  <p style="margin-bottom: 24px; font-size: 1.25rem;">Excellent communication is rarely about speaking eloquently; it’s almost entirely about learning how to listen effectively and respond without defensiveness.</p>

  <h3 style="font-size: 1.5rem; margin: 32px 0 16px;">The Practice of Active Listening</h3>
  <p style="margin-bottom: 24px;">Most of the time, we aren't listening. We're waiting for our turn to speak, silently formulating our rebuttal while the other person is still talking. Active listening requires full presence. Make eye contact, nod gently to show understanding, and resist the urge to interrupt.</p>

  <h3 style="font-size: 1.5rem; margin: 32px 0 16px;">Avoid "You" Statements</h3>
  <p style="margin-bottom: 24px;">When discussing a difficult topic, starting a sentence with "You always..." or "You never..." immediately puts the other person on the defensive. Instead, try utilizing "I" statements. Focus on your internal experience: "I feel overwhelmed when..." or "I felt hurt because..."</p>

  <h3 style="font-size: 1.5rem; margin: 32px 0 16px;">Reflective Listening (Mirroring)</h3>
  <p style="margin-bottom: 24px;">A powerful tool for de-escalating arguments is mirroring. Before stating your own point, briefly summarize what you just heard: "What I'm hearing is that you felt unsupported during that meeting. Is that right?" This shows that you are actually absorbing their perspective, not just tolerating their turn to speak.</p>
`);

const ArticleMindfulParenting = createArticlePage('PARENTING', 'Mindful parenting tips', '#E1F5FE', `
  <p style="margin-bottom: 24px; font-size: 1.25rem;">Parenting is intensely triggering. Children, especially young ones, have a remarkable ability to push our buttons and test our emotional regulation. Mindful parenting is the practice of inserting a pause between those triggers and our reactions.</p>

  <h3 style="font-size: 1.5rem; margin: 32px 0 16px;">Recognize Your Triggers</h3>
  <p style="margin-bottom: 24px;">Mindful parenting begins with self-awareness. Notice the physical sensations in your body when your child is melting down or defying you. Does your chest tighten? Do your hands clench? Recognizing these early warning signs of anger is your cue to take a momentary step back.</p>

  <h3 style="font-size: 1.5rem; margin: 32px 0 16px;">The Healing Pause</h3>
  <p style="margin-bottom: 24px;">When your child does something frustrating, don't react instantly. Take one deep breath. That 3-second pause allows your prefrontal cortex (the rational brain) to engage, counteracting the amygdala (the emotional, reactive brain). You move from reacting to responding.</p>

  <h3 style="font-size: 1.5rem; margin: 32px 0 16px;">Accept the Chaos</h3>
  <p style="margin-bottom: 24px;">Much of our frustration stems from our expectations colliding with reality. Children are inherently messy, loud, and unpredictable. By letting go of the expectation of a perfectly orderly life, we reduce the friction and stress caused by normal childhood behavior.</p>
`);

const ArticleDifficultColleagues = createArticlePage('WORK', 'Navigating difficult colleagues', '#FAFAFA', `
  <p style="margin-bottom: 24px; font-size: 1.25rem;">We can't choose our coworkers. Dealing with difficult personalities in a professional setting requires a delicate balance of firm boundaries and objective empathy.</p>

  <h3 style="font-size: 1.5rem; margin: 32px 0 16px;">Don't Take the Bait</h3>
  <p style="margin-bottom: 24px;">A difficult colleague often operates on high emotion and attempts to draw you into their drama or anxiety. Maintain a calm, neutral demeanor. If they send an inflammatory email or make a passive-aggressive comment, delay your response. A polite, strictly factual reply takes the air out of the confrontation.</p>

  <h3 style="font-size: 1.5rem; margin: 32px 0 16px;">Set Unshakeable Boundaries</h3>
  <p style="margin-bottom: 24px;">If a coworker constantly disrupts you, be polite but firm: "I have a tight deadline right now, but I can spare five minutes at 3 PM to discuss this." Consistency is key. If you bend the rules, you train them that your boundaries are merely suggestions.</p>

  <h3 style="font-size: 1.5rem; margin: 32px 0 16px;">Assume Positive Intent (Or At Least Avoid Villianizing)</h3>
  <p style="margin-bottom: 24px;">Most difficult behavior is rooted in insecurity, fear, or a lack of self-awareness, rather than sheer malice. You don't have to excuse bad behavior, but recognizing that they are likely acting out of their own internal stress can help you remain emotionally detached.</p>
`);

window.AuthData = {};

window.AuthFlow = {
  mode: 'login', // 'login' or 'signup'
  step: 1, // 1 (credentials) or 2 (health details)
  
  toggleMode: (mode) => {
    window.AuthFlow.mode = mode;
    window.AuthFlow.step = 1;
    window.AuthData = {}; // Clear cached data
    window.AuthFlow.render();
  },

  goToNextStep: async (e) => {
    e.preventDefault();
    const errorDiv = document.getElementById('auth-error');
    if (errorDiv) errorDiv.style.display = 'none';

    try {
      if (window.AuthFlow.mode === 'signup') {
        if (window.AuthFlow.step === 1) {
          window.AuthData.fullName = document.getElementById('signupName').value;
          window.AuthData.email = document.getElementById('signupEmail').value;
          window.AuthData.password = document.getElementById('signupPassword').value;
          window.AuthFlow.step = 2;
          window.AuthFlow.render();
        } else {
          // Final Registration Submission
          const age = document.getElementById('signupAge').value;
          const goal = document.getElementById('signupGoal').value;
          const stress = document.getElementById('signupStress').value;

          const res = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fullName: window.AuthData.fullName,
              email: window.AuthData.email,
              password: window.AuthData.password,
              age,
              primaryGoal: goal,
              stressLevel: stress
            })
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Registration failed.');

          localStorage.setItem('wellmind_token', data.token);
          window.location.hash = '#/onboarding';
        }
      } else {
        // Login Submission
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const res = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed.');

        localStorage.setItem('wellmind_token', data.token);
        window.location.hash = '#/onboarding';
      }
    } catch (error) {
      if (document.getElementById('auth-error')) {
        document.getElementById('auth-error').innerText = error.message;
        document.getElementById('auth-error').style.display = 'block';
      } else {
        alert(error.message);
      }
    }
  },

  render: () => {
    const container = document.getElementById('auth-dynamic-content');
    if (!container) return; // Might not be mounted

    const isLogin = window.AuthFlow.mode === 'login';
    const isStep1 = window.AuthFlow.step === 1;

    let contentHTML = '';

    if (isLogin) {
      contentHTML = `
        <h2 style="font-size: 2.2rem; margin-bottom: 8px; color: var(--color-text-dark);">Welcome Back</h2>
        <p style="color: var(--color-text-muted); margin-bottom: 32px;">Take a deep breath and log in to continue your journey.</p>
        <div id="auth-error" style="display: none; background: #FFEBEE; color: #D32F2F; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 0.95rem;"></div>
        <form onsubmit="window.AuthFlow.goToNextStep(event)">
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Email</label>
            <input id="loginEmail" type="email" placeholder="you@example.com" style="width: 100%; padding: 14px; border: 1px solid #EAEAEA; border-radius: 12px; font-family: var(--font-family); outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='var(--color-primary)'" onblur="this.style.borderColor='#EAEAEA'" required>
          </div>
          <div style="margin-bottom: 32px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Password</label>
            <input id="loginPassword" type="password" placeholder="••••••••" style="width: 100%; padding: 14px; border: 1px solid #EAEAEA; border-radius: 12px; font-family: var(--font-family); outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='var(--color-primary)'" onblur="this.style.borderColor='#EAEAEA'" required>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%; padding: 14px; font-size: 1.1rem; border-radius: 12px; margin-bottom: 24px;">Log in</button>
          
          <div style="text-align: center;">
            <span style="color: var(--color-text-muted);">Don't have an account?</span> 
            <a href="javascript:void(0)" onclick="window.AuthFlow.toggleMode('signup')" style="color: var(--color-primary); font-weight: 600; text-decoration: none;">Sign up for free</a>
          </div>
        </form>
      `;
    } else if (isStep1) {
      // Signup Step 1
      contentHTML = `
        <h2 style="font-size: 2.2rem; margin-bottom: 8px; color: var(--color-text-dark);">Start your journey</h2>
        <p style="color: var(--color-text-muted); margin-bottom: 32px;">Create a free account to access meditations, sleep sounds, and more.</p>
        <div id="auth-error" style="display: none; background: #FFEBEE; color: #D32F2F; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 0.95rem;"></div>
        <form onsubmit="window.AuthFlow.goToNextStep(event)">
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Full Name</label>
            <input id="signupName" type="text" placeholder="John Doe" style="width: 100%; padding: 14px; border: 1px solid #EAEAEA; border-radius: 12px; font-family: var(--font-family); outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='var(--color-primary)'" onblur="this.style.borderColor='#EAEAEA'" required>
          </div>
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Email</label>
            <input id="signupEmail" type="email" placeholder="you@example.com" style="width: 100%; padding: 14px; border: 1px solid #EAEAEA; border-radius: 12px; font-family: var(--font-family); outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='var(--color-primary)'" onblur="this.style.borderColor='#EAEAEA'" required>
          </div>
          <div style="margin-bottom: 32px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Password</label>
            <input id="signupPassword" type="password" placeholder="••••••••" style="width: 100%; padding: 14px; border: 1px solid #EAEAEA; border-radius: 12px; font-family: var(--font-family); outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='var(--color-primary)'" onblur="this.style.borderColor='#EAEAEA'" required minlength="6">
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%; padding: 14px; font-size: 1.1rem; border-radius: 12px; margin-bottom: 24px;">Continue</button>
          
          <div style="text-align: center;">
            <span style="color: var(--color-text-muted);">Already have an account?</span> 
            <a href="javascript:void(0)" onclick="window.AuthFlow.toggleMode('login')" style="color: var(--color-primary); font-weight: 600; text-decoration: none;">Log in</a>
          </div>
        </form>
      `;
    } else {
      // Signup Step 2 (Health Profile)
      contentHTML = `
        <h2 style="font-size: 2.2rem; margin-bottom: 8px; color: var(--color-text-dark);">Tell us about yourself</h2>
        <p style="color: var(--color-text-muted); margin-bottom: 32px;">We'll personalize your experience based on your health goals.</p>
        <div id="auth-error" style="display: none; background: #FFEBEE; color: #D32F2F; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 0.95rem;"></div>
        <form onsubmit="window.AuthFlow.goToNextStep(event)">
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Your Age</label>
            <input id="signupAge" type="number" placeholder="Enter your age" style="width: 100%; padding: 14px; border: 1px solid #EAEAEA; border-radius: 12px; font-family: var(--font-family); outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='var(--color-primary)'" onblur="this.style.borderColor='#EAEAEA'" required min="13">
          </div>
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 600;">What's your primary goal?</label>
            <select id="signupGoal" style="width: 100%; padding: 14px; border: 1px solid #EAEAEA; border-radius: 12px; font-family: var(--font-family); outline: none; transition: border-color 0.2s; background: white; appearance: none; color: var(--color-text-dark);" onfocus="this.style.borderColor='var(--color-primary)'" onblur="this.style.borderColor='#EAEAEA'" required>
              <option value="" disabled selected>Select an option</option>
              <option value="sleep">I want to sleep better</option>
              <option value="anxiety">I want to reduce anxiety & stress</option>
              <option value="focus">I want to improve my focus</option>
              <option value="meditation">I want to learn meditation</option>
            </select>
          </div>
          <div style="margin-bottom: 32px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Rate your current stress level</label>
            <div style="display: flex; gap: 4px; justify-content: space-between; align-items: center;">
              <span style="color: var(--color-text-muted); font-size: 0.85rem;">Low</span>
              <input id="signupStress" type="range" min="1" max="10" value="5" class="slider" style="width: 100%; margin: 0 12px; accent-color: var(--color-primary);">
              <span style="color: var(--color-text-muted); font-size: 0.85rem;">High</span>
            </div>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%; padding: 14px; font-size: 1.1rem; border-radius: 12px; margin-bottom: 16px;">Finish Registration</button>
          <button type="button" class="btn btn-outline" style="width: 100%; padding: 14px; font-size: 1.1rem; border-radius: 12px;" onclick="window.AuthFlow.toggleMode('signup');">Back</button>
        </form>
      `;
    }

    container.innerHTML = contentHTML;
    // Handle animation
    if (container.animate) {
      container.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 400, easing: 'ease-out' });
    }
  }
};

const LoginSignup = (defaultMode) => {
  return `
  <!-- Beautiful Full-screen Auth Section -->
  <section style="min-height: calc(100vh - 72px); display: flex; background: #F8F9FA;">
    <!-- Form Side -->
    <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 40px;">
      <div id="auth-dynamic-content" style="width: 100%; max-width: 440px; background: white; padding: 48px; border-radius: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.04);">
        <!-- AuthFlow.render() will inject content here -->
      </div>
    </div>
    
    <!-- Image Side (Hidden on mobile) -->
    <div style="flex: 1.2; display: none; background-image: url('https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'); background-size: cover; background-position: center; position: relative;" class="auth-image-side">
       <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,0.4));"></div>
       <div style="position: absolute; bottom: 80px; left: 80px; right: 80px; color: white;">
         <h1 style="font-size: 3rem; margin-bottom: 16px; font-weight: 700; line-height: 1.2;">Find your center.<br>Breathe easy.</h1>
         <p style="font-size: 1.2rem; opacity: 0.9; max-width: 400px; line-height: 1.6;">Join thousands of others on a journey to better mental health, peaceful sleep, and reduced anxiety.</p>
       </div>
    </div>
  </section>
  <style>
    @media (min-width: 900px) {
      .auth-image-side { display: flex !important; }
    }
  </style>
  `;
};

const Anxiety = `
  <section class="page-hero" style="background-color: #E8F5E9; padding: 80px 0;">
    <div class="container text-center">
      <h1 class="hero-title" style="margin-bottom: 20px;">Manage your anxiety</h1>
      <p class="hero-subtitle" style="margin: 0 auto; max-width: 600px;">Find relief from anxious thoughts with guided meditations and breathing exercises.</p>
    </div>
  </section>
  <section class="library-section">
    <div class="container">
      <div class="library-grid">
        <div class="library-card card-teal" style="cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='var(--shadow-md)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-sm)';" onclick="window.location.hash='#/anxiety/panic-sos'">
          <div class="card-content"><h3>Panic SOS</h3><p>Quick relief for intense anxiety.</p></div>
          <div class="card-illustration">🛟</div>
        </div>
        <div class="library-card card-teal" style="cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='var(--shadow-md)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-sm)';" onclick="window.location.hash='#/anxiety/letting-go-of-stress'">
          <div class="card-content"><h3>Letting Go of Stress</h3><p>Release tension from mind and body.</p></div>
          <div class="card-illustration">🎈</div>
        </div>
      </div>
    </div>
  </section>
`;

const Stress = `
  <section class="page-hero" style="background-color: #FFF3E0; padding: 80px 0;">
    <div class="container text-center">
      <h1 class="hero-title" style="margin-bottom: 20px;">Stress less, live more</h1>
      <p class="hero-subtitle" style="margin: 0 auto; max-width: 600px;">Learn to navigate everyday challenges with a clear, calm mind.</p>
      <div style="margin-top: 24px; display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
         <a href="#/stress" class="btn btn-primary">Start Stress Journey</a>
         <a href="#/assessment" class="btn btn-outline">Take a quick check-in</a>
      </div>
    </div>
  </section>
  <section class="library-section" style="padding-top: 40px; padding-bottom: 40px; background: #FEF8ED;">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Stress tools</h2>
        <p class="section-subtitle">A complete toolbox—build your own stress reduction routine.</p>
      </div>
      <div class="library-grid" id="stress-tool-grid">
        <div class="library-card card-orange" data-tool="daily-de-stress" style="cursor: pointer;" onclick="setTimeout(() => document.getElementById('stress-tool-details').scrollIntoView({behavior:'smooth', block:'center'}), 50)">
          <div class="card-content"><h3>Daily De-stress</h3><p>A few minutes to reset your day.</p></div>
          <div class="card-illustration">😌</div>
        </div>
        <div class="library-card card-orange" data-tool="unwind" style="cursor: pointer;" onclick="setTimeout(() => document.getElementById('stress-tool-details').scrollIntoView({behavior:'smooth', block:'center'}), 50)">
          <div class="card-content"><h3>Unwind</h3><p>Transition from work to personal time.</p></div>
          <div class="card-illustration">🌅</div>
        </div>
        <div class="library-card card-orange" data-tool="breathing-break" style="cursor: pointer;" onclick="setTimeout(() => document.getElementById('stress-tool-details').scrollIntoView({behavior:'smooth', block:'center'}), 50)">
          <div class="card-content"><h3>Breathing Break</h3><p>4-7-8 breath to calm your nervous system.</p></div>
          <div class="card-illustration">🌬️</div>
        </div>
        <div class="library-card card-orange" data-tool="mood-journaling" style="cursor: pointer;" onclick="setTimeout(() => document.getElementById('stress-tool-details').scrollIntoView({behavior:'smooth', block:'center'}), 50)">
          <div class="card-content"><h3>Mood Journaling</h3><p>Track triggers and wins from your day.</p></div>
          <div class="card-illustration">📝</div>
        </div>
        <div class="library-card card-orange" data-tool="mindful-movement" style="cursor: pointer;" onclick="setTimeout(() => document.getElementById('stress-tool-details').scrollIntoView({behavior:'smooth', block:'center'}), 50)">
          <div class="card-content"><h3>Mindful Movement</h3><p>Gentle guides to relieve physical tension.</p></div>
          <div class="card-illustration">🚶</div>
        </div>
        <div class="library-card card-orange" data-tool="sleep-prep" style="cursor: pointer;" onclick="setTimeout(() => document.getElementById('stress-tool-details').scrollIntoView({behavior:'smooth', block:'center'}), 50)">
          <div class="card-content"><h3>Sleep Prep</h3><p>Wind-down practice for a restful night.</p></div>
          <div class="card-illustration">🛌</div>
        </div>
      </div>
      <div id="stress-tool-details" style="margin-top: 30px; display: none; background: #fff; border: 1px solid #EAEAEA; border-radius: 20px; padding: 24px; box-shadow: var(--shadow-sm);">
         <h3 id="stress-tool-title"></h3>
         <p id="stress-tool-description" style="color: var(--color-text-muted);"></p>
         <p id="stress-tool-progress" style="font-weight: 600; color: #3F51B5; margin: 8px 0;"></p>
         <ul id="stress-tool-actions" style="margin: 16px 0; padding-left: 20px; text-align: left;"></ul>
         <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
           <button id="stress-tool-clear" class="btn btn-outline">Clear selection</button>
           <button id="stress-tool-save" class="btn btn-primary">Save progress</button>
           <button id="stress-tool-email" class="btn btn-secondary">Email this plan</button>
         </div>
      </div>
      <div id="stress-tool-dashboard" style="margin-top: 30px; display: none; background: #FFF8E1; border: 1px solid #FFE082; border-radius: 20px; padding: 20px;">
         <h3 style="margin-top:0;">Stress Toolkit Progress Dashboard</h3>
         <p id="stress-tool-dashboard-text" style="margin: 6px 0; color: #3E2723;"></p>
         <ul id="stress-tool-dashboard-list" style="margin: 8px 0 0 20px; padding: 0; color: #5D4037;"></ul>
         <button id="stress-tool-reset-all" class="btn btn-outline" style="margin-top: 12px;">Reset all tool progress</button>
      </div>
      <div class="text-center" style="margin-top: 30px;">        <a href="#/new-popular" class="btn btn-outline">Explore everything</a>
      </div>
    </div>
  </section>
  <section style="padding: 40px 0; background: white;">
    <div class="container" style="max-width: 900px;">
      <h2 style="font-size: 2rem; margin-bottom: 16px;">All-in-one stress plan</h2>
      <ul style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; list-style: none; padding: 0;">
        <li style="background: #FAFAFA; border: 1px solid #EAEAEA; border-radius: 16px; padding: 20px;">
          <h3 style="margin-top: 0;">1. Quick reset (2 minutes)</h3>
          <p style="color: var(--color-text-muted);">Hold your breath for 4 seconds, exhale for 6. Repeat 5x and observe your body soften.</p>
        </li>
        <li style="background: #FAFAFA; border: 1px solid #EAEAEA; border-radius: 16px; padding: 20px;">
          <h3 style="margin-top: 0;">2. Check in with yourself</h3>
          <p style="color: var(--color-text-muted);">Use the mood buttons on the home page to record how you’re feeling in under 30 seconds.</p>
        </li>
        <li style="background: #FAFAFA; border: 1px solid #EAEAEA; border-radius: 16px; padding: 20px;">
          <h3 style="margin-top: 0;">3. Reflect and progress</h3>
          <p style="color: var(--color-text-muted);">Review your stress log at end of day and plan one small victory for tomorrow.</p>
        </li>
      </ul>
    </div>
  </section>
`;

const About = `
  <section class="page-hero" style="background-color: #FFFDF9; padding: 100px 0; border-bottom: 1px solid #EAEAEA; overflow: hidden; position: relative;">
    <div class="blob-shape blob-1"></div>
    <div class="container text-center" style="position: relative; z-index: 2;">
      <h1 class="hero-title" style="margin-bottom: 24px; font-size: 4rem;">Our Mission</h1>
      <p class="hero-subtitle" style="margin: 0 auto; max-width: 700px; font-size: 1.5rem; color: var(--color-text-dark);">To improve the health and happiness of the world.</p>
    </div>
  </section>
  <section style="padding: 100px 0;">
    <div class="container" style="max-width: 1000px;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; margin-bottom: 100px;">
        <div>
          <h2 style="font-size: 2.5rem; margin-bottom: 24px; letter-spacing: -1px;">The Well-Mind Story</h2>
          <p style="font-size: 1.125rem; color: var(--color-text-muted); margin-bottom: 16px; line-height: 1.8;">Well-Mind started with a simple belief: mental health is just as important as physical health. In a world that's constantly connected and moving fast, finding time for your mind has never been more critical or more difficult.</p>
          <p style="font-size: 1.125rem; color: var(--color-text-muted); line-height: 1.8;">We set out to create an accessible, engaging, and scientifically-backed platform for everyone. Whether you need to sleep better, focus deeper, or just find a moment of calm, Well-Mind is your guide.</p>
        </div>
        <div>
           <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Team meditating" style="width: 100%; border-radius: 24px; box-shadow: var(--shadow-lg); transform: rotate(2deg);">
        </div>
      </div>
      
      <div style="background-color: #F8F9FA; padding: 60px; border-radius: 32px; text-align: center;">
        <h2 style="font-size: 2rem; margin-bottom: 40px;">Our Core Values</h2>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px;">
           <div>
             <div style="font-size: 3rem; margin-bottom: 16px;">💛</div>
             <h4 style="font-size: 1.2rem; margin-bottom: 8px;">Compassion First</h4>
             <p style="color: var(--color-text-muted); font-size: 0.95rem;">We build with empathy and kindness for our members and each other.</p>
           </div>
           <div>
             <div style="font-size: 3rem; margin-bottom: 16px;">🔬</div>
             <h4 style="font-size: 1.2rem; margin-bottom: 8px;">Science-Backed</h4>
             <p style="color: var(--color-text-muted); font-size: 0.95rem;">Our techniques are rooted in proven clinical research and expertise.</p>
           </div>
           <div>
             <div style="font-size: 3rem; margin-bottom: 16px;">✨</div>
             <h4 style="font-size: 1.2rem; margin-bottom: 8px;">Accessible Design</h4>
             <p style="color: var(--color-text-muted); font-size: 0.95rem;">Mental health tools should be approachable and easy to use for all.</p>
           </div>
        </div>
      </div>
    </div>
  </section>
`;

const Careers = `
  <section class="page-hero bg-teal" style="background-color: #E6F7F0; padding: 100px 0;">
    <div class="container text-center">
      <h1 class="hero-title" style="margin-bottom: 24px; font-size: 4rem;">Join the team</h1>
      <p class="hero-subtitle" style="margin: 0 auto 32px; max-width: 600px; font-size: 1.25rem;">Help us bring health and happiness to millions of people around the world while building the best version of yourself.</p>
      <a href="#positions" class="btn btn-primary" style="padding: 16px 32px; font-size: 1.2rem;">View Open Roles</a>
    </div>
  </section>
  <section style="padding: 100px 0; background: white;">
    <div class="container" style="max-width: 1000px;">
      <div style="text-align: center; margin-bottom: 64px;">
        <h2 style="font-size: 2.5rem; margin-bottom: 16px;">Life at Well-Mind</h2>
        <p style="color: var(--color-text-muted); font-size: 1.125rem;">We practice what we preach with industry-leading benefits.</p>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px; margin-bottom: 100px;">
        <div style="padding: 32px; background: #F8F9FA; border-radius: 24px; text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 16px;">🏝️</div>
           <h4 style="font-size: 1.2rem; margin-bottom: 12px;">Unlimited PTO</h4>
           <p style="color: var(--color-text-muted);">Take the time you need to rest, recharge, and explore the world. We mandate a minimum of 3 weeks off.</p>
        </div>
        <div style="padding: 32px; background: #F8F9FA; border-radius: 24px; text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 16px;">🏥</div>
           <h4 style="font-size: 1.2rem; margin-bottom: 12px;">100% Healthcare</h4>
           <p style="color: var(--color-text-muted);">Comprehensive medical, dental, and vision coverage completely paid for you and your dependents.</p>
        </div>
        <div style="padding: 32px; background: #F8F9FA; border-radius: 24px; text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 16px;">🧘</div>
           <h4 style="font-size: 1.2rem; margin-bottom: 12px;">Mindful Days</h4>
           <p style="color: var(--color-text-muted);">Two fully paid company-wide "Mind Days" every month where the entire team unplugs.</p>
        </div>
      </div>

      <h2 id="positions" style="font-size: 2.5rem; margin-bottom: 32px; text-align: center;">Open Positions</h2>
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <a href="#/careers" style="display: flex; justify-content: space-between; align-items: center; padding: 32px; border: 1px solid #EAEAEA; border-radius: 16px; transition: all 0.2s; background: white;" onmouseover="this.style.borderColor='var(--color-primary)'; this.style.transform='translateX(8px)'" onmouseout="this.style.borderColor='#EAEAEA'; this.style.transform='translateX(0)'">
           <div>
             <h3 style="font-size: 1.4rem; margin-bottom: 8px;">Senior Frontend Engineer</h3>
             <p style="color: var(--color-text-muted); margin: 0;">Engineering • Remote / New York</p>
           </div>
           <span style="color: var(--color-primary); font-size: 24px;">→</span>
        </a>
        <a href="#/careers" style="display: flex; justify-content: space-between; align-items: center; padding: 32px; border: 1px solid #EAEAEA; border-radius: 16px; transition: all 0.2s; background: white;" onmouseover="this.style.borderColor='var(--color-primary)'; this.style.transform='translateX(8px)'" onmouseout="this.style.borderColor='#EAEAEA'; this.style.transform='translateX(0)'">
           <div>
             <h3 style="font-size: 1.4rem; margin-bottom: 8px;">Product Designer, Mobile</h3>
             <p style="color: var(--color-text-muted); margin: 0;">Design • Remote</p>
           </div>
           <span style="color: var(--color-primary); font-size: 24px;">→</span>
        </a>
        <a href="#/careers" style="display: flex; justify-content: space-between; align-items: center; padding: 32px; border: 1px solid #EAEAEA; border-radius: 16px; transition: all 0.2s; background: white;" onmouseover="this.style.borderColor='var(--color-primary)'; this.style.transform='translateX(8px)'" onmouseout="this.style.borderColor='#EAEAEA'; this.style.transform='translateX(0)'">
           <div>
             <h3 style="font-size: 1.4rem; margin-bottom: 8px;">Clinical Content Creator</h3>
             <p style="color: var(--color-text-muted); margin: 0;">Content • Los Angeles / Remote</p>
           </div>
           <span style="color: var(--color-primary); font-size: 24px;">→</span>
        </a>
      </div>
    </div>
  </section>
`;

const Press = `
  <section class="page-hero" style="background-color: #1A1A3A; color: white; padding: 100px 0;">
    <div class="container text-center">
      <h1 class="hero-title" style="margin-bottom: 24px; color: white; font-size: 4rem;">Press Room</h1>
      <p class="hero-subtitle" style="margin: 0 auto; max-width: 600px; color: #A0A0C0; font-size: 1.25rem;">The latest news, announcements, and media resources from Well-Mind.</p>
    </div>
  </section>
  <section class="library-section" style="background: white;">
    <div class="container" style="max-width: 1000px;">
      
      <div style="display: flex; gap: 40px; margin-bottom: 80px; align-items: flex-start; flex-wrap: wrap;">
        <div style="flex: 2; min-width: 300px;">
          <h2 style="font-size: 2rem; margin-bottom: 32px; padding-bottom: 16px; border-bottom: 2px solid #EAEAEA;">Recent News</h2>
          <div style="display: flex; flex-direction: column; gap: 24px;">
            <article style="padding: 24px; border: 1px solid #EAEAEA; border-radius: 16px; background: #fafbfc;">
              <span style="color: var(--color-primary); font-weight: 700; font-size: 0.85rem; letter-spacing: 1px; text-transform: uppercase;">Press Release</span>
              <h3 style="font-size: 1.4rem; margin: 8px 0;">Well-Mind Reaches 5 Million Mindful Minutes Logged</h3>
              <p style="color: var(--color-text-muted); margin-bottom: 16px;">The milestone underscores the growing global need for accessible mental wellness tools.</p>
              <a href="#/press" style="color: var(--color-accent); font-weight: 600;">Read Full Story →</a>
            </article>
            <article style="padding: 24px; border: 1px solid #EAEAEA; border-radius: 16px; background: #fafbfc;">
              <span style="color: var(--color-primary); font-weight: 700; font-size: 0.85rem; letter-spacing: 1px; text-transform: uppercase;">Company News</span>
              <h3 style="font-size: 1.4rem; margin: 8px 0;">Well-Mind Launches Ebb AI, The Empathetic Digital Companion</h3>
              <p style="color: var(--color-text-muted); margin-bottom: 16px;">A revolutionary new way to process thoughts securely, 24/7 without judgment.</p>
              <a href="#/press" style="color: var(--color-accent); font-weight: 600;">Read Full Story →</a>
            </article>
            <article style="padding: 24px; border: 1px solid #EAEAEA; border-radius: 16px; background: #fafbfc;">
              <span style="color: var(--color-primary); font-weight: 700; font-size: 0.85rem; letter-spacing: 1px; text-transform: uppercase;">Partnership</span>
              <h3 style="font-size: 1.4rem; margin: 8px 0;">Well-Mind Partners with Global Airlines for In-Flight Calm</h3>
              <p style="color: var(--color-text-muted); margin-bottom: 16px;">Travelers can now access exclusive meditation courses directly from their seathead screens.</p>
              <a href="#/press" style="color: var(--color-accent); font-weight: 600;">Read Full Story →</a>
            </article>
          </div>
        </div>

        <div style="flex: 1; min-width: 300px;">
          <h2 style="font-size: 2rem; margin-bottom: 32px; padding-bottom: 16px; border-bottom: 2px solid #EAEAEA;">Media Assets</h2>
          <div style="background: #F8F9FA; padding: 32px; border-radius: 24px;">
            <div style="margin-bottom: 24px;">
              <h4 style="font-size: 1.1rem; margin-bottom: 8px;">Brand Guidelines</h4>
              <p style="color: var(--color-text-muted); font-size: 0.9rem; margin-bottom: 12px;">Guidelines on how to use the Well-Mind logo, colors, and typography.</p>
              <button class="btn btn-outline" style="font-size: 0.9rem; padding: 8px 16px; border-radius: 8px;">Download PDF</button>
            </div>
            <div style="margin-bottom: 24px;">
              <h4 style="font-size: 1.1rem; margin-bottom: 8px;">Logo Pack</h4>
              <p style="color: var(--color-text-muted); font-size: 0.9rem; margin-bottom: 12px;">High-resolution vector assets for print and digital.</p>
              <button class="btn btn-outline" style="font-size: 0.9rem; padding: 8px 16px; border-radius: 8px;">Download ZIP</button>
            </div>
            <div>
              <h4 style="font-size: 1.1rem; margin-bottom: 8px;">Press Contact</h4>
              <p style="color: var(--color-text-muted); font-size: 0.9rem; margin-bottom: 0;">For immediate media inquiries:<br><a href="mailto:press@well-mind.demo" style="color: var(--color-accent); font-weight:600;">press@well-mind.demo</a></p>
            </div>
          </div>
        </div>
      </div>
    </div
  </section>
`;

const OnlineTherapy = `
  <section class="page-hero" style="background-color: #E6F7F0; padding: 100px 0;">
    <div class="container text-center">
      <h1 class="hero-title" style="margin-bottom: 24px; font-size: 4rem;">Online Therapy</h1>
      <p class="hero-subtitle" style="margin: 0 auto 32px; max-width: 600px; font-size: 1.25rem;">Professional mental health support from licensed therapists, right from the comfort of your home.</p>
      <button class="btn btn-primary" onclick="window.openTherapyModal('assessment')" style="padding: 16px 32px; font-size: 1.2rem;">Match with a Therapist</button>
    </div>
  </section>
  <section style="padding: 100px 0; background: white;">
    <div class="container" style="max-width: 1000px;">
      
      <div style="text-align: center; margin-bottom: 64px;">
        <h2 style="font-size: 2.5rem; margin-bottom: 16px;">How it works</h2>
        <p style="color: var(--color-text-muted); font-size: 1.125rem;">Therapy on your own terms, designed for real life.</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; margin-bottom: 100px;">
        <div style="text-align: center;">
          <div style="width: 80px; height: 80px; background: #E6F7F0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: bold; color: var(--color-primary); margin: 0 auto 24px;">1</div>
          <h3 style="font-size: 1.4rem; margin-bottom: 12px;">Take the assessment</h3>
          <p style="color: var(--color-text-muted);">Answer a few questions about yourself and what you're looking for so we can find your perfect match.</p>
        </div>
        <div style="text-align: center;">
          <div style="width: 80px; height: 80px; background: #E6F7F0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: bold; color: var(--color-primary); margin: 0 auto 24px;">2</div>
          <h3 style="font-size: 1.4rem; margin-bottom: 12px;">Get matched</h3>
          <p style="color: var(--color-text-muted);">Review your therapist recommendations and choose the licensed professional you feel best about.</p>
        </div>
        <div style="text-align: center;">
          <div style="width: 80px; height: 80px; background: #E6F7F0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: bold; color: var(--color-primary); margin: 0 auto 24px;">3</div>
          <h3 style="font-size: 1.4rem; margin-bottom: 12px;">Start sessions</h3>
          <p style="color: var(--color-text-muted);">Schedule secure video calls or exchange messages from anywhere, at whatever time works for you.</p>
        </div>
      </div>

      <h2 style="font-size: 2.5rem; margin-bottom: 32px; text-align: center;">Meet Some of Our Therapists</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px;">
        <div style="border: 1px solid #EAEAEA; border-radius: 24px; overflow: hidden; background: white; box-shadow: var(--shadow-sm);">
          <div style="height: 160px; background: url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80') center/cover;"></div>
          <div style="padding: 24px;">
            <h3 style="font-size: 1.4rem; margin-bottom: 4px;">Dr. Sarah Jenkins</h3>
            <p style="color: var(--color-primary); font-weight: 600; font-size: 0.9rem; margin-bottom: 16px;">Ph.D., Clinical Psychology</p>
            <p style="color: var(--color-text-muted); font-size: 0.95rem; margin-bottom: 24px;">Specializes in CBT, anxiety disorders, and major life transitions.</p>
            <button class="btn btn-outline" onclick="window.openTherapyModal('profile-sarah')" style="width: 100%; border-radius: 8px;">View Profile</button>
          </div>
        </div>
        <div style="border: 1px solid #EAEAEA; border-radius: 24px; overflow: hidden; background: white; box-shadow: var(--shadow-sm);">
          <div style="height: 160px; background: url('https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80') center/cover;"></div>
          <div style="padding: 24px;">
            <h3 style="font-size: 1.4rem; margin-bottom: 4px;">Marcus Chen, LCSW</h3>
            <p style="color: var(--color-primary); font-weight: 600; font-size: 0.9rem; margin-bottom: 16px;">Licensed Clinical Social Worker</p>
            <p style="color: var(--color-text-muted); font-size: 0.95rem; margin-bottom: 24px;">Focuses on relationship counseling, grief, and stress management.</p>
            <button class="btn btn-outline" onclick="window.openTherapyModal('profile-marcus')" style="width: 100%; border-radius: 8px;">View Profile</button>
          </div>
        </div>
      </div>
      
    </div>
  </section>

  <!-- Modals for Online Therapy -->
  <div id="therapy-modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
    
    <!-- Assessment Modal -->
    <div id="modal-assessment" style="display: none; background: white; padding: 40px; border-radius: 24px; max-width: 500px; width: 90%; box-shadow: 0 20px 40px rgba(0,0,0,0.2); position: relative;">
      <button onclick="window.closeTherapyModal()" style="position: absolute; top: 20px; right: 20px; background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
      <div id="assess-step-1">
        <h3 style="font-size: 1.5rem; margin-bottom: 16px;">What brings you here today?</h3>
        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
          <button class="btn btn-outline" onclick="window.nextAssessmentStep()">Stress & Anxiety</button>
          <button class="btn btn-outline" onclick="window.nextAssessmentStep()">Relationship Issues</button>
          <button class="btn btn-outline" onclick="window.nextAssessmentStep()">Depression</button>
          <button class="btn btn-outline" onclick="window.nextAssessmentStep()">Life Transitions</button>
        </div>
      </div>
      <div id="assess-step-2" style="display: none;">
        <h3 style="font-size: 1.5rem; margin-bottom: 16px;">Do you have a preference for your therapist?</h3>
        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
          <button class="btn btn-outline" onclick="window.nextAssessmentStep()">Male</button>
          <button class="btn btn-outline" onclick="window.nextAssessmentStep()">Female</button>
          <button class="btn btn-outline" onclick="window.nextAssessmentStep()">Non-binary</button>
          <button class="btn btn-outline" onclick="window.nextAssessmentStep()">No preference</button>
        </div>
      </div>
      <div id="assess-step-3" style="display: none;">
        <h3 style="font-size: 1.5rem; margin-bottom: 16px;">How would you like to connect?</h3>
        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
          <button class="btn btn-outline" onclick="window.nextAssessmentStep()">Video Calls</button>
          <button class="btn btn-outline" onclick="window.nextAssessmentStep()">Phone Calls</button>
          <button class="btn btn-outline" onclick="window.nextAssessmentStep()">Live chat / Texting</button>
        </div>
      </div>
    </div>

    <!-- Profile: Sarah -->
    <div id="modal-profile-sarah" style="display: none; background: white; padding: 40px; border-radius: 24px; max-width: 500px; width: 90%; box-shadow: 0 20px 40px rgba(0,0,0,0.2); position: relative; text-align: center;">
      <button onclick="window.closeTherapyModal()" style="position: absolute; top: 20px; right: 20px; background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
      <div style="width: 120px; height: 120px; border-radius: 60px; background: url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80') center/cover; margin: 0 auto 20px;"></div>
      <h3 style="font-size: 1.8rem; margin-bottom: 4px;">Dr. Sarah Jenkins</h3>
      <p style="color: var(--color-primary); font-weight: 600; margin-bottom: 16px;">Ph.D., Clinical Psychology</p>
      <p style="color: var(--color-text-muted); line-height: 1.6; margin-bottom: 24px;">Hi! I'm Dr. Jenkins. I have over 10 years of experience helping individuals navigate anxiety, depression, and major life transitions using Cognitive Behavioral Therapy.</p>
      <button class="btn btn-primary" onclick="window.bookConsultation('Dr. Sarah Jenkins')" style="width: 100%; border-radius: 8px;">Book Free Consultation</button>
    </div>

    <!-- Profile: Marcus -->
    <div id="modal-profile-marcus" style="display: none; background: white; padding: 40px; border-radius: 24px; max-width: 500px; width: 90%; box-shadow: 0 20px 40px rgba(0,0,0,0.2); position: relative; text-align: center;">
      <button onclick="window.closeTherapyModal()" style="position: absolute; top: 20px; right: 20px; background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
      <div style="width: 120px; height: 120px; border-radius: 60px; background: url('https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80') center/cover; margin: 0 auto 20px;"></div>
      <h3 style="font-size: 1.8rem; margin-bottom: 4px;">Marcus Chen, LCSW</h3>
      <p style="color: var(--color-primary); font-weight: 600; margin-bottom: 16px;">Licensed Clinical Social Worker</p>
      <p style="color: var(--color-text-muted); line-height: 1.6; margin-bottom: 24px;">Hello. I specialize in relationship counseling, grief, and stress management. My goal is to create a safe, non-judgmental space for you to heal and grow.</p>
      <button class="btn btn-primary" onclick="window.bookConsultation('Marcus Chen')" style="width: 100%; border-radius: 8px;">Book Free Consultation</button>
    </div>

  </div>
`;

const Mindfulness = `
  <section class="page-hero" style="background-color: #FFFDF9; padding: 100px 0;">
    <div class="container text-center">
      <h1 class="hero-title" style="margin-bottom: 24px; font-size: 4rem;">Mindfulness</h1>
      <p class="hero-subtitle" style="margin: 0 auto; max-width: 600px; font-size: 1.25rem;">Learn to live in the present moment, observing your thoughts without judgment.</p>
    </div>
  </section>
  <section style="padding: 100px 0; background: #F8F9FA;">
    <div class="container" style="max-width: 1000px;">
      
      <div style="background: white; border-radius: 32px; padding: 64px; text-align: center; box-shadow: var(--shadow-md); margin-bottom: 80px;">
        <h2 style="font-size: 2.5rem; margin-bottom: 16px;">Try a Breathing Exercise</h2>
        <p style="color: var(--color-text-muted); margin-bottom: 48px; font-size: 1.125rem;">Follow the circle. Breathe in as it expands, breathe out as it shrinks.</p>
        
        <div style="position: relative; width: 300px; height: 300px; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
          <div style="width: 250px; height: 250px; border-radius: 50%; background: rgba(255, 125, 60, 0.1); animation: breatheCircle 8s infinite cubic-bezier(0.4, 0, 0.2, 1);"></div>
          <div style="position: absolute; width: 150px; height: 150px; border-radius: 50%; background: var(--color-primary); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 1.5rem; animation: breatheText 8s infinite cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 10px 30px rgba(255, 125, 60, 0.4);">Breathe</div>
        </div>
        
        <style>
          @keyframes breatheCircle {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.6); background: rgba(255, 125, 60, 0.2); }
          }
          @keyframes breatheText {
            0%, 100% { transform: scale(1); content: 'Breathe Out'; }
            50% { transform: scale(1.1); content: 'Breathe In'; }
          }
        </style>
      </div>

      <h2 style="font-size: 2.5rem; margin-bottom: 32px;">Everyday Mindfulness</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px;">
        <div style="background: white; border-radius: 24px; padding: 32px; border: 1px solid #EAEAEA; transition: all 0.3s; cursor: pointer;" onmouseover="this.style.boxShadow='var(--shadow-md)'; this.style.transform='translateY(-4px)'" onmouseout="this.style.boxShadow='none'; this.style.transform='translateY(0)'">
          <div style="font-size: 3rem; margin-bottom: 16px;">🥗</div>
          <h3 style="font-size: 1.5rem; margin-bottom: 12px;">Mindful Eating</h3>
          <p style="color: var(--color-text-muted); line-height: 1.6;">Transform your relationship with food through awareness. Learn to truly taste each bite and listen to your body's signals.</p>
        </div>
        <div style="background: white; border-radius: 24px; padding: 32px; border: 1px solid #EAEAEA; transition: all 0.3s; cursor: pointer;" onmouseover="this.style.boxShadow='var(--shadow-md)'; this.style.transform='translateY(-4px)'" onmouseout="this.style.boxShadow='none'; this.style.transform='translateY(0)'">
          <div style="font-size: 3rem; margin-bottom: 16px;">🚶</div>
          <h3 style="font-size: 1.5rem; margin-bottom: 12px;">Walking Meditation</h3>
          <p style="color: var(--color-text-muted); line-height: 1.6;">Bring mindfulness into your physical movements. Sync your steps with your breath for active relaxation.</p>
        </div>
        <div style="background: white; border-radius: 24px; padding: 32px; border: 1px solid #EAEAEA; transition: all 0.3s; cursor: pointer;" onmouseover="this.style.boxShadow='var(--shadow-md)'; this.style.transform='translateY(-4px)'" onmouseout="this.style.boxShadow='none'; this.style.transform='translateY(0)'">
          <div style="font-size: 3rem; margin-bottom: 16px;">�</div>
          <h3 style="font-size: 1.5rem; margin-bottom: 12px;">The Mindful Shower</h3>
          <p style="color: var(--color-text-muted); line-height: 1.6;">Turn a daily routine into a sensory grounding exercise to start your day with immense clarity.</p>
        </div>
      </div>
    </div>
  </section>
`;

const Coaching = `
  <section class="page-hero" style="background-color: #FFF3E0; padding: 100px 0;">
    <div class="container text-center">
      <h1 class="hero-title" style="margin-bottom: 24px; font-size: 4rem;">Mental Health Coaching</h1>
      <p class="hero-subtitle" style="margin: 0 auto 32px; max-width: 600px; font-size: 1.25rem;">1-on-1 text-based guidance to help you build skills and stay on track with your wellness goals.</p>
      <button class="btn btn-primary" style="padding: 16px 32px; font-size: 1.2rem;">Start with a Coach</button>
    </div>
  </section>
  <section style="padding: 100px 0; background: white;">
    <div class="container" style="max-width: 1000px;">
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; margin-bottom: 100px;">
        <div style="position: relative; background: #FFF3E0; border-radius: 32px; padding: 40px; text-align: center;">
           <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Coach Profile" style="width: 120px; height: 120px; border-radius: 50%; border: 4px solid white; box-shadow: var(--shadow-md); margin: 0 auto 24px;">
           <h3 style="font-size: 1.5rem; margin-bottom: 8px;">Hi, I'm Coach Elena</h3>
           <p style="color: var(--color-text-muted); margin-bottom: 24px;">Certified Wellness Coach</p>
           
           <div style="background: white; padding: 20px; border-radius: 16px; box-shadow: var(--shadow-sm); text-align: left; position: relative;">
             <div style="position: absolute; top: -10px; left: 20px; width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-bottom: 10px solid white;"></div>
             <p style="margin: 0; font-size: 0.95rem; line-height: 1.5;">"I noticed you completed the 'Setting Boundaries' meditation yesterday. How did it feel applying those concepts in your team meeting today?"</p>
           </div>
        </div>
        <div>
          <h2 style="font-size: 2.5rem; margin-bottom: 24px; letter-spacing: -1px;">Accountability in your pocket</h2>
          <p style="font-size: 1.125rem; color: var(--color-text-muted); margin-bottom: 24px; line-height: 1.8;">Sometimes, building a habit requires a little nudge. Our certified coaches provide personalized, text-based support to help you navigate obstacles and celebrate wins.</p>
          <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 16px;">
            <li style="display: flex; align-items: center; gap: 12px; font-size: 1.1rem;"><span style="color: var(--color-primary); font-size: 1.5rem;">✓</span> Daily check-ins and encouragement</li>
            <li style="display: flex; align-items: center; gap: 12px; font-size: 1.1rem;"><span style="color: var(--color-primary); font-size: 1.5rem;">✓</span> Personalized curriculum curation</li>
            <li style="display: flex; align-items: center; gap: 12px; font-size: 1.1rem;"><span style="color: var(--color-primary); font-size: 1.5rem;">✓</span> Goal setting and tracking</li>
            <li style="display: flex; align-items: center; gap: 12px; font-size: 1.1rem;"><span style="color: var(--color-primary); font-size: 1.5rem;">✓</span> Completely confidential</li>
          </ul>
        </div>
      </div>

    </div>
  </section>
`;

const EbbAI = `
  <section class="page-hero" style="background-color: #E8F5E9; padding: 80px 0;">
    <div class="container text-center">
      <h1 class="hero-title" style="margin-bottom: 20px;">Ebb AI Companion</h1>
      <p class="hero-subtitle" style="margin: 0 auto; max-width: 600px;">Your 24/7 empathetic conversational AI ready to listen and reflect whenever you need it.</p>
    </div>
  </section>
  <section class="library-section" style="background-color: #fafbfc; flex: 1; display:flex; padding-bottom: 80px;">
    <div class="container" style="max-width: 800px; width: 100%;">
      <div class="chat-container" style="background: white; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-lg); overflow: hidden; display: flex; flex-direction: column; height: 600px; border: 1px solid #EAEAEA;">
        <div class="chat-header" style="background: #1A1A3A; color: white; padding: 20px; display: flex; align-items: center; gap: 16px;">
           <div class="ai-avatar" style="width: 48px; height: 48px; background: linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px;">🌀</div>
           <div>
             <h3 style="margin: 0; font-family: var(--font-family);">Ebb AI</h3>
             <small style="color: #2ecc71; font-weight: 500;">● Online</small>
           </div>
        </div>
        <div class="chat-messages" id="ebb-chat-messages" style="flex: 1; padding: 24px; overflow-y: auto; background-color: #F8F9FA; display: flex; flex-direction: column; gap: 16px;">
          <div class="message ai-message" style="align-self: flex-start; background: white; padding: 16px; border-radius: 16px 16px 16px 4px; box-shadow: var(--shadow-sm); max-width: 80%;">
            <p style="margin: 0; line-height: 1.5;">Hi there. I'm Ebb. I'm here to listen without judgment. How are you feeling today?</p>
            <span class="message-time" style="font-size: 0.75rem; color: #aaa; margin-top: 8px; display: block;">Just now</span>
          </div>
          <style>
              @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
          </style>
        </div>
        <div class="chat-input-area" style="padding: 20px; background: white; border-top: 1px solid #EAEAEA; display: flex; gap: 12px;">
          <input type="text" id="ebb-chat-input" class="chat-input" placeholder="Type your message here..." style="flex: 1; padding: 14px 20px; border: 1px solid #EAEAEA; border-radius: 24px; outline: none; font-family: var(--font-family); font-size: 1rem; background: #F8F9FA;">
          <button id="ebb-chat-send" class="btn btn-primary" style="border-radius: 24px; padding: 0 24px;">Send</button>
        </div>
      </div>
    </div>
  </section>
`;

const SleepBetter = `
  <section class="page-hero" style="background-color: #1A1A3A; color: white; padding: 100px 0;">
    <div class="container text-center">
      <h1 class="hero-title" style="margin-bottom: 24px; color: white; font-size: 4rem;">Sleep Better</h1>
      <p class="hero-subtitle" style="margin: 0 auto; max-width: 600px; color: #A0A0C0; font-size: 1.25rem;">A comprehensive toolkit of courses, sleepcasts, and exercises designed to improve your sleep hygiene.</p>
    </div>
  </section>
  <section style="padding: 100px 0; background: #0F0F24;">
    <div class="container" style="max-width: 1000px;">
      
      <div style="background: linear-gradient(135deg, #2D2D5E, #1A1A3A); border-radius: 32px; padding: 48px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 80px; display: flex; gap: 48px; align-items: center; color: white;">
         <div style="flex: 1;">
           <span style="background: rgba(255,255,255,0.1); padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--color-tertiary);">Featured Course</span>
           <h2 style="font-size: 2.5rem; margin: 16px 0 16px;">The Sleep Foundation</h2>
           <p style="color: #A0A0C0; font-size: 1.125rem; line-height: 1.6; margin-bottom: 32px;">A 14-day guided journey teaching you how to build an optimal sleep environment, unwind your mind, and establish consistent routines.</p>
           <a href="#/sleep-music" class="btn" style="background: var(--color-tertiary); color: #0F0F24; padding: 14px 32px; text-decoration: none; display: inline-block;">Start Day 1</a>
         </div>
         <div style="flex: 1; display: flex; flex-direction: column; gap: 12px;">
           <div style="background: rgba(255,255,255,0.05); padding: 16px 24px; border-radius: 12px; display: flex; align-items: center; gap: 16px;">
             <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--color-tertiary); color: #0F0F24; display: flex; align-items: center; justify-content: center; font-weight: bold;">1</div>
             <div>
               <h4 style="margin: 0 0 4px; font-size: 1.1rem;">Your Sleep Environment</h4>
               <p style="margin: 0; color: #A0A0C0; font-size: 0.9rem;">10 Min</p>
             </div>
           </div>
           <div style="background: rgba(255,255,255,0.02); padding: 16px 24px; border-radius: 12px; display: flex; align-items: center; gap: 16px; opacity: 0.7;">
             <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-weight: bold;">2</div>
             <div>
               <h4 style="margin: 0 0 4px; font-size: 1.1rem;">The Wind-down Routine</h4>
               <p style="margin: 0; color: #A0A0C0; font-size: 0.9rem;">12 Min</p>
             </div>
           </div>
           <div style="background: rgba(255,255,255,0.02); padding: 16px 24px; border-radius: 12px; display: flex; align-items: center; gap: 16px; opacity: 0.7;">
             <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-weight: bold;">3</div>
             <div>
               <h4 style="margin: 0 0 4px; font-size: 1.1rem;">Putting Down the Phone</h4>
               <p style="margin: 0; color: #A0A0C0; font-size: 0.9rem;">15 Min</p>
             </div>
           </div>
         </div>
      </div>
      
      <h2 style="font-size: 2rem; color: white; margin-bottom: 32px;">Nighttime SOS</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px;">
        <div style="background: #2D2D5E; border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: 32px; color: white; transition: transform 0.3s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
          <div style="font-size: 3rem; margin-bottom: 16px;">⏱️</div>
          <h3 style="font-size: 1.5rem; margin-bottom: 12px;">Falling Back Asleep</h3>
          <p style="color: #A0A0C0; line-height: 1.6;">Techniques for when you wake up in the middle of the night and your mind starts racing.</p>
        </div>
        <div style="background: #2D2D5E; border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: 32px; color: white; transition: transform 0.3s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
          <div style="font-size: 3rem; margin-bottom: 16px;">🌜</div>
          <h3 style="font-size: 1.5rem; margin-bottom: 12px;">Racing Thoughts</h3>
          <p style="color: #A0A0C0; line-height: 1.6;">A guided visualization to help you step off the mental treadmill and drift away into a deep sleep.</p>
        </div>
      </div>
    </div>
  </section>
`;

const MentalHealth = `
  <section class="page-hero" style="background-color: #F3E5F5; padding: 100px 0;">
    <div class="container text-center">
      <h1 class="hero-title" style="margin-bottom: 24px; font-size: 4rem;">Mental Health</h1>
      <p class="hero-subtitle" style="margin: 0 auto; max-width: 600px; font-size: 1.25rem;">Evidence-based approaches to understanding, validating, and nurturing your overall mental wellbeing.</p>
    </div>
  </section>
  <section style="padding: 100px 0; background: white;">
    <div class="container" style="max-width: 1000px;">
      
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 40px; margin-bottom: 80px;">
        <div>
          <h2 style="font-size: 2.5rem; margin-bottom: 24px; letter-spacing: -1px;">Understanding Your Mind</h2>
          <p style="font-size: 1.125rem; color: var(--color-text-muted); margin-bottom: 24px; line-height: 1.8;">Mental health isn't a destination; it's a constant process of tending to your psychological garden. We provide clinical educational materials written by psychologists to help you demystify what you're feeling.</p>
          <div style="display: flex; gap: 16px; flex-wrap: wrap;">
             <span style="background: #F3E5F5; color: #6A1B9A; padding: 8px 16px; border-radius: 30px; font-weight: 600; font-size: 0.9rem;">Depression</span>
             <span style="background: #E8F5E9; color: #2E7D32; padding: 8px 16px; border-radius: 30px; font-weight: 600; font-size: 0.9rem;">Anxiety</span>
             <span style="background: #FFF3E0; color: #E65100; padding: 8px 16px; border-radius: 30px; font-weight: 600; font-size: 0.9rem;">Grief</span>
             <span style="background: #E3F2FD; color: #1565C0; padding: 8px 16px; border-radius: 30px; font-weight: 600; font-size: 0.9rem;">Trauma</span>
          </div>
        </div>
        <div style="background: #F8F9FA; border-radius: 24px; padding: 32px; border: 1px solid #EAEAEA;">
          <h4 style="font-size: 1.2rem; margin-bottom: 16px;">Quick Assessment</h4>
          <p style="color: var(--color-text-muted); font-size: 0.95rem; margin-bottom: 24px;">Check in with yourself using our clinically validated PHQ-9 or GAD-7 screeners.</p>
          <a href="#/assessment" class="btn btn-primary" style="width: 100%; padding: 12px; font-size: 1rem;">Start Assessment</a>
        </div>
      </div>

      <h2 style="font-size: 2.5rem; margin-bottom: 32px;">Featured Collections</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px;">
        <div style="border: 1px solid #EAEAEA; border-radius: 24px; overflow: hidden; background: white; transition: box-shadow 0.3s, transform 0.3s; cursor: pointer;" onmouseover="this.style.boxShadow='var(--shadow-md)'; this.style.transform='translateY(-4px)'" onmouseout="this.style.boxShadow='none'; this.style.transform='translateY(0)'">
          <div style="height: 180px; background: url('https://images.unsplash.com/photo-1499209974431-9dddcece7f88?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80') center/cover;"></div>
          <div style="padding: 32px;">
            <h3 style="font-size: 1.5rem; margin-bottom: 12px;">Building Resilience</h3>
            <p style="color: var(--color-text-muted); line-height: 1.6; margin-bottom: 0;">Learn how to bounce back from difficult experiences, process setbacks, and build emotional fortitude.</p>
          </div>
        </div>
        <div style="border: 1px solid #EAEAEA; border-radius: 24px; overflow: hidden; background: white; transition: box-shadow 0.3s, transform 0.3s; cursor: pointer;" onmouseover="this.style.boxShadow='var(--shadow-md)'; this.style.transform='translateY(-4px)'" onmouseout="this.style.boxShadow='none'; this.style.transform='translateY(0)'">
          <div style="height: 180px; background: url('https://images.unsplash.com/photo-1517457210515-32bc65706918?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80') center/cover;"></div>
          <div style="padding: 32px;">
            <h3 style="font-size: 1.5rem; margin-bottom: 12px;">Navigating Change</h3>
            <p style="color: var(--color-text-muted); line-height: 1.6; margin-bottom: 0;">A structured guide to processing major life transitions, from career shifts to relationship changes.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
`;

const MindfulFamilies = `
  <section class="page-hero" style="background-color: #FFFDF9; padding: 100px 0;">
    <div class="container text-center">
      <h1 class="hero-title" style="margin-bottom: 24px; font-size: 4rem;">Mindful Families</h1>
      <p class="hero-subtitle" style="margin: 0 auto; max-width: 600px; font-size: 1.25rem;">Bite-sized meditations, stories, and activities designed for parents and kids to enjoy together.</p>
    </div>
  </section>
  <section style="padding: 100px 0; background: #F8F9FA;">
    <div class="container" style="max-width: 1000px;">
      
      <div style="text-align: center; margin-bottom: 64px;">
        <h2 style="font-size: 2.5rem; margin-bottom: 16px;">Content for Every Age</h2>
        <p style="color: var(--color-text-muted); font-size: 1.125rem;">Tailored mindfulness exercises that grow with your children.</p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 32px;">
        <div style="display: flex; flex-wrap: wrap; background: white; border-radius: 24px; border: 1px solid #EAEAEA; overflow: hidden; align-items: center;">
           <div style="flex: 1; padding: 48px; min-width: 300px;">
             <span style="color: var(--color-primary); font-weight: 700; letter-spacing: 1px; text-transform: uppercase; font-size: 0.85rem;">Ages 3-5</span>
             <h3 style="font-size: 2rem; margin: 8px 0 16px;">Little Breaths</h3>
             <p style="color: var(--color-text-muted); font-size: 1.1rem; line-height: 1.6; margin-bottom: 24px;">Playful, imaginative exercises utilizing characters and animals to teach the very basics of taking a deep breath and slowing down.</p>
             <button class="btn btn-outline">Explore Series</button>
           </div>
           <div style="flex: 1; height: 300px; background: url('https://images.unsplash.com/photo-1544256718-3baf237f39d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80') center/cover; min-width: 300px;"></div>
        </div>

        <div style="display: flex; flex-wrap: wrap-reverse; background: white; border-radius: 24px; border: 1px solid #EAEAEA; overflow: hidden; align-items: center;">
           <div style="flex: 1; height: 300px; background: url('https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80') center/cover; min-width: 300px;"></div>
           <div style="flex: 1; padding: 48px; min-width: 300px;">
             <span style="color: var(--color-primary); font-weight: 700; letter-spacing: 1px; text-transform: uppercase; font-size: 0.85rem;">Ages 6-12</span>
             <h3 style="font-size: 2rem; margin: 8px 0 16px;">Mindful Kids</h3>
             <p style="color: var(--color-text-muted); font-size: 1.1rem; line-height: 1.6; margin-bottom: 24px;">Practical tools for navigating school stress, big emotions, and screen-time. Includes fun, interactive focus games.</p>
             <button class="btn btn-outline">Explore Series</button>
           </div>
        </div>
      </div>
      
    </div>
  </section>
`;

const NewPopular = `
  <section class="page-hero" style="background-color: #E6F7F0; padding: 100px 0;">
    <div class="container text-center">
      <h1 class="hero-title" style="margin-bottom: 24px; font-size: 4rem;">New and Popular</h1>
      <p class="hero-subtitle" style="margin: 0 auto; max-width: 600px; font-size: 1.25rem;">Discover what the Well-Mind community is loving right now.</p>
    </div>
  </section>
  <section style="padding: 100px 0; background: white;">
    <div class="container">
      
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; border-bottom: 2px solid #EAEAEA; padding-bottom: 16px;">
        <h2 style="font-size: 2.5rem; margin: 0;">Trending This Week</h2>
        <span style="color: var(--color-primary); font-weight: 600; cursor: pointer;">See All →</span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 80px;">
        <div style="border: 1px solid #EAEAEA; border-radius: 20px; overflow: hidden; transition: transform 0.2s; cursor: pointer;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
          <div style="height: 160px; background: #FFC04B; display: flex; align-items: center; justify-content: center; font-size: 4rem;">☀️</div>
          <div style="padding: 24px;">
            <p style="color: var(--color-text-muted); font-size: 0.85rem; text-transform: uppercase; font-weight: 700; margin-bottom: 8px;">Meditation • 10m</p>
            <h3 style="font-size: 1.2rem; margin-bottom: 8px;">Morning Light</h3>
            <p style="color: var(--color-text-muted); font-size: 0.95rem;">Start your day with immense clarity and purpose.</p>
          </div>
        </div>
        <div style="border: 1px solid #EAEAEA; border-radius: 20px; overflow: hidden; transition: transform 0.2s; cursor: pointer;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
          <div style="height: 160px; background: #A6E3E9; display: flex; align-items: center; justify-content: center; font-size: 4rem;">🎧</div>
          <div style="padding: 24px;">
            <p style="color: var(--color-text-muted); font-size: 0.85rem; text-transform: uppercase; font-weight: 700; margin-bottom: 8px;">Focus Music • 120m</p>
            <h3 style="font-size: 1.2rem; margin-bottom: 8px;">Deep Work State</h3>
            <p style="color: var(--color-text-muted); font-size: 0.95rem;">Binaural beats engineered to help you concentrate.</p>
          </div>
        </div>
        <div style="border: 1px solid #EAEAEA; border-radius: 20px; overflow: hidden; transition: transform 0.2s; cursor: pointer;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
          <div style="height: 160px; background: #D3C3FA; display: flex; align-items: center; justify-content: center; font-size: 4rem;">💤</div>
          <div style="padding: 24px;">
            <p style="color: var(--color-text-muted); font-size: 0.85rem; text-transform: uppercase; font-weight: 700; margin-bottom: 8px;">Sleepcast • 45m</p>
            <h3 style="font-size: 1.2rem; margin-bottom: 8px;">Midnight Train</h3>
            <p style="color: var(--color-text-muted); font-size: 0.95rem;">A rhythmic journey across a snowy landscape.</p>
          </div>
        </div>
        <div style="border: 1px solid #EAEAEA; border-radius: 20px; overflow: hidden; transition: transform 0.2s; cursor: pointer;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
          <div style="height: 160px; background: #FF9A9E; display: flex; align-items: center; justify-content: center; font-size: 4rem;">🌬️</div>
          <div style="padding: 24px;">
            <p style="color: var(--color-text-muted); font-size: 0.85rem; text-transform: uppercase; font-weight: 700; margin-bottom: 8px;">Anxiety Relief • 3m</p>
            <h3 style="font-size: 1.2rem; margin-bottom: 8px;">Panic SOS</h3>
            <p style="color: var(--color-text-muted); font-size: 0.95rem;">A rapid grounding exercise for intense moments.</p>
          </div>
        </div>
      </div>
      
    </div>
  </section>
`;

const GuidedCourses = `
  <section class="page-hero" style="background-color: #FFF3E0; padding: 100px 0;">
    <div class="container text-center">
      <h1 class="hero-title" style="margin-bottom: 24px; font-size: 4rem;">Guided Courses</h1>
      <p class="hero-subtitle" style="margin: 0 auto; max-width: 600px; font-size: 1.25rem;">Multi-day programs focused on specific topics to help you build lasting mindful habits.</p>
    </div>
  </section>
  <section style="padding: 100px 0; background: #fafbfc;">
    <div class="container" style="max-width: 1000px;">
      
      <div style="background: white; border-radius: 24px; padding: 40px; box-shadow: var(--shadow-sm); margin-bottom: 48px; display: flex; gap: 40px; align-items: center;">
         <div style="flex: 1;">
           <img src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Self Compassion" style="width: 100%; border-radius: 16px;">
         </div>
         <div style="flex: 1;">
           <span style="color: var(--color-primary); font-weight: 700; font-size: 0.85rem; letter-spacing: 1px; text-transform: uppercase;">10 Day Course</span>
           <h2 style="font-size: 2rem; margin: 8px 0 16px;">Self-Compassion</h2>
           <p style="color: var(--color-text-muted); font-size: 1.1rem; line-height: 1.6; margin-bottom: 24px;">Learn to treat yourself with the same kindness and understanding you offer a friend. This course explores letting go of the inner critic.</p>
           <div style="height: 6px; background: #EAEAEA; border-radius: 3px; margin-bottom: 12px; overflow: hidden;">
             <div style="width: 30%; height: 100%; background: var(--color-primary);"></div>
           </div>
           <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 24px;">Day 3 of 10 completed</p>
           <a href="#/meditation" class="btn btn-primary" style="padding: 12px 24px; text-decoration: none; display: inline-block;">Continue Course</a>
         </div>
      </div>
      
      <h2 style="font-size: 2rem; margin-bottom: 32px; text-align: center;">More Courses</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px;">
         <div style="background: white; border: 1px solid #EAEAEA; border-radius: 20px; padding: 32px; display: flex; flex-direction: column; gap: 16px; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
           <span style="color: var(--color-primary); font-weight: 700; font-size: 0.85rem; letter-spacing: 1px; text-transform: uppercase;">30 Day Course</span>
           <h3 style="font-size: 1.5rem; margin: 0;">Transforming Anger</h3>
           <p style="color: var(--color-text-muted); flex: 1;">Learn to process strong emotions constructively instead of pushing them away.</p>
           <a href="#/calming-anxiety" class="btn btn-outline" style="align-self: flex-start; padding: 8px 16px; font-size: 0.9rem; text-decoration: none;">Start Course</a>
         </div>
         <div style="background: white; border: 1px solid #EAEAEA; border-radius: 20px; padding: 32px; display: flex; flex-direction: column; gap: 16px; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
           <span style="color: var(--color-primary); font-weight: 700; font-size: 0.85rem; letter-spacing: 1px; text-transform: uppercase;">14 Day Course</span>
           <h3 style="font-size: 1.5rem; margin: 0;">Managing Money Stress</h3>
           <p style="color: var(--color-text-muted); flex: 1;">A guided program to untangle your self-worth from your net-worth.</p>
           <a href="#/stress" class="btn btn-outline" style="align-self: flex-start; padding: 8px 16px; font-size: 0.9rem; text-decoration: none;">Start Course</a>
         </div>
      </div>
    </div>
  </section>
`;

const BeginningMeditation = `
  <section class="page-hero" style="background-color: #E8F5E9; padding: 100px 0;">
    <div class="container text-center">
      <h1 class="hero-title" style="margin-bottom: 24px; font-size: 4rem;">Beginning Meditation</h1>
      <p class="hero-subtitle" style="margin: 0 auto; max-width: 600px; font-size: 1.25rem;">The perfect starting point for your mindfulness journey. Learn the fundamentals at your own pace.</p>
    </div>
  </section>
  <section style="padding: 100px 0; background: white;">
    <div class="container" style="max-width: 800px;">
      
      <div style="text-align: center; margin-bottom: 64px;">
        <h2 style="font-size: 2.5rem; margin-bottom: 16px;">The Basics Path</h2>
        <p style="color: var(--color-text-muted); font-size: 1.125rem;">A structured progression to teach you the techniques.</p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div style="display: flex; align-items: center; gap: 24px; padding: 24px; border: 1px solid var(--color-primary); border-radius: 20px; background: rgba(52, 168, 83, 0.05); position: relative;">
          <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: var(--color-primary); border-radius: 20px 0 0 20px;"></div>
          <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 24px;">1</div>
          <div style="flex: 1;">
            <h3 style="font-size: 1.4rem; margin-bottom: 4px;">Basics Course</h3>
            <p style="color: var(--color-text-muted); margin: 0;">10 Sessions • Your first introduction to focusing on the breath.</p>
          </div>
          <a href="#/guided-courses" class="btn btn-primary" style="padding: 10px 20px; text-decoration: none;">Start</a>
        </div>
        
        <div style="display: flex; align-items: center; gap: 24px; padding: 24px; border: 1px solid #EAEAEA; border-radius: 20px; background: white;">
          <div style="width: 64px; height: 64px; border-radius: 50%; background: #F8F9FA; color: #ccc; border: 2px dashed #EAEAEA; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 24px;">2</div>
          <div style="flex: 1;">
            <h3 style="font-size: 1.4rem; margin-bottom: 4px; color: #888;">Basics II</h3>
            <p style="color: #aaa; margin: 0;">10 Sessions • Deepen your understanding of noting techniques.</p>
          </div>
          <a href="#/signup" class="btn btn-primary" style="padding: 10px 20px; text-decoration: none; background: var(--color-primary); color: white;">Start 3-Day Trial</a>
        </div>
        
        <div style="display: flex; align-items: center; gap: 24px; padding: 24px; border: 1px solid #EAEAEA; border-radius: 20px; background: white;">
          <div style="width: 64px; height: 64px; border-radius: 50%; background: #F8F9FA; color: #ccc; border: 2px dashed #EAEAEA; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 24px;">3</div>
          <div style="flex: 1;">
            <h3 style="font-size: 1.4rem; margin-bottom: 4px; color: #888;">Basics III</h3>
            <p style="color: #aaa; margin: 0;">10 Sessions • Solidify your daily habit.</p>
          </div>
          <a href="#/signup" class="btn btn-primary" style="padding: 10px 20px; text-decoration: none; background: var(--color-primary); color: white;">Start 3-Day Trial</a>
        </div>
      </div>
      
    </div>
  </section>
`;

const Exercise3Min = `
  <section class="page-hero" style="background-color: #E8EAF6; padding: 100px 0; min-height: calc(100vh - 72px); display: flex; flex-direction: column; justify-content: center;">
    <div class="container text-center" style="max-width: 800px;">
      <h1 style="font-size: 3rem; margin-bottom: 24px;">The 5-4-3-2-1 Method</h1>
      <p style="font-size: 1.2rem; color: var(--color-text-muted); margin-bottom: 48px;">Follow the prompts below to ground yourself in the present moment.</p>
      
      <div id="exercise-container" style="background: white; padding: 40px; border-radius: 24px; box-shadow: var(--shadow-md);">
        <h2 id="exercise-step-title" style="font-size: 8rem; margin: 0; color: var(--color-primary);">5</h2>
        <h3 id="exercise-step-text" style="font-size: 2rem; margin: 24px 0;">Things you can see</h3>
        <p id="exercise-step-desc" style="color: var(--color-text-muted); font-size: 1.1rem; margin-bottom: 32px;">Look around you and notice five things you haven't noticed before.</p>
        
        <button class="btn btn-primary" onclick="window.nextExerciseStep()" style="font-size: 1.2rem; padding: 16px 40px; border-radius: 100px;">Next Step</button>
      </div>
      
      <div style="margin-top: 32px;">
         <a href="#/calming-anxiety" style="color: var(--color-primary); font-weight: 600; text-decoration: none;">&larr; Back to Calming Anxiety</a>
      </div>
    </div>
  </section>
`;

window.exerciseStep = 0;
window.nextExerciseStep = () => {
   const steps = [
     { num: '5', title: 'Things you can see', desc: "Look around you and notice five things you haven't noticed before. A shadow, a crack in the wall, the texture of a leaf." },
     { num: '4', title: 'Things you can feel', desc: "Notice four things you can feel. The texture of your clothing, the breeze on your skin, or the ground beneath your feet." },
     { num: '3', title: 'Things you can hear', desc: "Listen for three sounds. A bird singing, the hum of a refrigerator, or distant traffic." },
     { num: '2', title: 'Things you can smell', desc: 'Find two things you can smell. You might need to move around a bit. Pine cones, coffee, or even the scent of your own skin.' },
     { num: '1', title: 'Thing you can taste', desc: 'Focus on one thing you can taste. The lingering flavor of a meal, a sip of water, or simply the inside of your mouth.' },
     { num: '✨', title: 'You are grounded.', desc: 'Take a deep breath and notice how you feel compared to when you started.', done: true }
   ];
   
   window.exerciseStep++;
   if (window.exerciseStep >= steps.length) {
     window.location.hash = '#/calming-anxiety';
     window.exerciseStep = 0;
     return;
   }
   
   const stepParams = steps[window.exerciseStep];
   document.getElementById('exercise-step-title').innerText = stepParams.num;
   document.getElementById('exercise-step-text').innerText = stepParams.title;
   document.getElementById('exercise-step-desc').innerText = stepParams.desc;
   
   if (stepParams.done) {
     document.querySelector('#exercise-container button').innerText = 'Finish';
   }
};

const createReliefPage = (title, emoji, desc, content) => `
  <section class="page-hero" style="background-color: #FAFAFA; padding: 100px 0; min-height: calc(100vh - 72px);">
    <div class="container" style="max-width: 800px;">
      <div style="font-size: 4rem; margin-bottom: 24px; text-align: center;">${emoji}</div>
      <h1 class="hero-title" style="text-align: center; margin-bottom: 16px;">${title}</h1>
      <p class="hero-subtitle" style="text-align: center; margin-bottom: 48px;">${desc}</p>
      
      <div style="background: white; padding: 40px; border-radius: 24px; box-shadow: var(--shadow-sm); line-height: 1.8; font-size: 1.1rem; color: var(--color-text-dark);">
        ${content}
      </div>
      
      <div style="margin-top: 40px; text-align: center;">
         <a href="#/calming-anxiety" class="btn btn-outline" style="border-radius: 100px;">&larr; Back to Exercises</a>
      </div>
    </div>
  </section>
`;

const ReliefSunday = createReliefPage('Sunday Scaries', '📅', 'Prepare for the week ahead with a calm mind.', `
  <h3 style="font-size: 1.5rem; margin-bottom: 16px;">Why do we get the Sunday Scaries?</h3>
  <p style="margin-bottom: 24px;">The transition from weekend rest to weekday responsibility can trigger anticipatory anxiety. It's completely normal, but you don't have to let it ruin your Sunday evening.</p>
  <h3 style="font-size: 1.5rem; margin-bottom: 16px;">Actionable Steps</h3>
  <ul style="margin-bottom: 24px; padding-left: 20px;">
    <li><strong>Plan ahead:</strong> Take 15 minutes on Friday afternoon to outline Monday's tasks.</li>
    <li><strong>Protect your Sunday night:</strong> Dedicate the evening to low-stress, joyful activities. Avoid checking work emails.</li>
    <li><strong>Reframe your thoughts:</strong> Instead of dreading Monday, focus on one positive thing you're looking forward to this week.</li>
  </ul>
`);

const ReliefSocial = createReliefPage('Social Anxiety', '☕', 'Quick centering exercises before stepping into a crowd.', `
  <h3 style="font-size: 1.5rem; margin-bottom: 16px;">Navigating Social Settings</h3>
  <p style="margin-bottom: 24px;">Social anxiety often stems from the fear of judgment. Remember that most people are more focused on themselves than on you.</p>
  <h3 style="font-size: 1.5rem; margin-bottom: 16px;">The "Power Pose" Practice</h3>
  <p style="margin-bottom: 24px;">Before entering a social event, find a quiet space (like a restroom). Stand tall, plant your feet firmly, put your hands on your hips, and take three slow, deep breaths. This physical stance can lower cortisol (stress hormone) and boost confidence.</p>
  <h3 style="font-size: 1.5rem; margin-bottom: 16px;">Shift the Focus</h3>
  <p style="margin-bottom: 24px;">When talking to others, focus on being genuinely curious about them. Ask open-ended questions. Shifting the spotlight away from yourself can significantly reduce feelings of anxiety.</p>
`);

const ReliefFlying = createReliefPage('Fear of Flying', '✈️', 'Manage takeoff jitters and turbulence panic.', `
  <h3 style="font-size: 1.5rem; margin-bottom: 16px;">Understanding the Fear</h3>
  <p style="margin-bottom: 24px;">Flying anxiety often involves a lack of control and fear of the unknown. Education and preparation are key to managing it.</p>
  <h3 style="font-size: 1.5rem; margin-bottom: 16px;">Turbulence is Normal</h3>
  <p style="margin-bottom: 24px;">Think of turbulence like driving on a bumpy road or waves in the ocean. It's uncomfortable, but it's completely normal and modern airplanes are built to handle it effortlessly.</p>
  <h3 style="font-size: 1.5rem; margin-bottom: 16px;">The 4-7-8 Breathing Technique</h3>
  <p style="margin-bottom: 24px;">During takeoff or turbulence, use this breath to calm your nervous system:</p>
  <ul style="margin-bottom: 24px; padding-left: 20px;">
    <li>Inhale quietly through your nose for 4 seconds.</li>
    <li>Hold your breath for 7 seconds.</li>
    <li>Exhale completely through your mouth, making a whoosh sound, for 8 seconds.</li>
  </ul>
`);


const CalmingAnxiety = `
  <section class="page-hero" style="background-color: #F3E5F5; padding: 100px 0;">
    <div class="container text-center">
      <h1 class="hero-title" style="margin-bottom: 24px; font-size: 4rem;">Calming Everyday Anxiety</h1>
      <p class="hero-subtitle" style="margin: 0 auto; max-width: 600px; font-size: 1.25rem;">Tools to help you stress less about the little things throughout your day and find your center.</p>
    </div>
  </section>
  <section style="padding: 100px 0; background: white;">
    <div class="container" style="max-width: 1000px;">
      
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px; margin-bottom: 64px;">
        <div style="background: url('https://images.unsplash.com/photo-1518241353330-0f7941c2dadd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80') center/cover; border-radius: 24px; min-height: 400px; position: relative; overflow: hidden;">
          <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); display: flex; flex-direction: column; justify-content: flex-end; padding: 40px; color: white;">
            <span style="background: rgba(255,255,255,0.2); padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; width: fit-content; margin-bottom: 16px;">SOS Exercise</span>
            <h3 style="font-size: 2rem; margin: 0 0 12px;">The 5-4-3-2-1 Method</h3>
            <p style="color: #EAEAEA; line-height: 1.6; margin-bottom: 24px;">A powerful grounding technique to pull you out of an anxious spiral and back into the present moment.</p>
            <a href="#/exercise-3min" class="btn" style="background: white; color: #111; border: none; padding: 12px 24px; text-decoration: none; display: inline-block;">Start 3 Min Practice</a>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 24px;">
          <h2 style="font-size: 2rem; margin-bottom: 8px;">Targeted Relief</h2>
          <p style="color: var(--color-text-muted); font-size: 1.1rem; margin-bottom: 8px;">Find the right tool for whatever is making you anxious right now.</p>
          
          <div onclick="window.location.hash='#/relief-sunday'" style="background: #F8F9FA; border: 1px solid #EAEAEA; border-radius: 16px; padding: 24px; display: flex; align-items: center; gap: 20px; transition: transform 0.2s; cursor: pointer;" onmouseover="this.style.transform='translateX(8px)'" onmouseout="this.style.transform='translateX(0)'">
            <div style="font-size: 2.5rem;">📅</div>
            <div>
              <h4 style="font-size: 1.2rem; margin-bottom: 4px;">Sunday Scaries</h4>
              <p style="color: var(--color-text-muted); margin: 0; font-size: 0.95rem;">Prepare for the week ahead with a calm mind.</p>
            </div>
          </div>
          <div onclick="window.location.hash='#/relief-social'" style="background: #F8F9FA; border: 1px solid #EAEAEA; border-radius: 16px; padding: 24px; display: flex; align-items: center; gap: 20px; transition: transform 0.2s; cursor: pointer;" onmouseover="this.style.transform='translateX(8px)'" onmouseout="this.style.transform='translateX(0)'">
            <div style="font-size: 2.5rem;">☕</div>
            <div>
              <h4 style="font-size: 1.2rem; margin-bottom: 4px;">Social Anxiety</h4>
              <p style="color: var(--color-text-muted); margin: 0; font-size: 0.95rem;">Quick centering exercises before stepping into a crowd.</p>
            </div>
          </div>
          <div onclick="window.location.hash='#/relief-flying'" style="background: #F8F9FA; border: 1px solid #EAEAEA; border-radius: 16px; padding: 24px; display: flex; align-items: center; gap: 20px; transition: transform 0.2s; cursor: pointer;" onmouseover="this.style.transform='translateX(8px)'" onmouseout="this.style.transform='translateX(0)'">
            <div style="font-size: 2.5rem;">✈️</div>
            <div>
              <h4 style="font-size: 1.2rem; margin-bottom: 4px;">Fear of Flying</h4>
              <p style="color: var(--color-text-muted); margin: 0; font-size: 0.95rem;">Manage takeoff jitters and turbulence panic.</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </section>
`;

const MindfulParenting = `
  <section class="page-hero" style="background-color: #FCE4EC; padding: 100px 0;">
    <div class="container text-center">
      <h1 class="hero-title" style="margin-bottom: 24px; font-size: 4rem;">Mindful Parenting</h1>
      <p class="hero-subtitle" style="margin: 0 auto; max-width: 600px; font-size: 1.25rem;">Nurture your family with patience, presence, and deeper connection throughout every stage of parenting.</p>
    </div>
  </section>
  <section style="padding: 100px 0; background: white;">
    <div class="container" style="max-width: 1000px;">
      
      <div style="background: #F8F9FA; border-radius: 32px; padding: 48px; margin-bottom: 80px; text-align: center;">
        <h2 style="font-size: 2.5rem; margin-bottom: 24px;">The Parenting Journey</h2>
        <p style="color: var(--color-text-muted); font-size: 1.125rem; max-width: 700px; margin: 0 auto 40px;">Parenting is full of joy, chaos, and overwhelming moments. Our mindful parenting resources help you stay grounded so you can show up as the parent you want to be.</p>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 32px;">
          <div style="background: white; padding: 32px; border-radius: 24px; border: 1px solid #EAEAEA; box-shadow: var(--shadow-sm); transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
            <div style="font-size: 3rem; margin-bottom: 16px;">🧘‍♀️</div>
            <h3 style="font-size: 1.4rem; margin-bottom: 12px;">For Parents</h3>
            <p style="color: var(--color-text-muted);">Self-care meditations, stress-relief practices, and techniques to manage frustration.</p>
          </div>
          <div style="background: white; padding: 32px; border-radius: 24px; border: 1px solid #EAEAEA; box-shadow: var(--shadow-sm); transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
            <div style="font-size: 3rem; margin-bottom: 16px;">👶🏽</div>
            <h3 style="font-size: 1.4rem; margin-bottom: 12px;">For Kids</h3>
            <p style="color: var(--color-text-muted);">Engaging mindfulness exercises, breathing games, and focus tools for young minds.</p>
          </div>
          <div style="background: white; padding: 32px; border-radius: 24px; border: 1px solid #EAEAEA; box-shadow: var(--shadow-sm); transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
            <div style="font-size: 3rem; margin-bottom: 16px;">👨‍👩‍👧‍👦</div>
            <h3 style="font-size: 1.4rem; margin-bottom: 12px;">Together</h3>
            <p style="color: var(--color-text-muted);">Shared activities to foster open communication and build stronger family bonds.</p>
          </div>
        </div>
      </div>
      
      <h2 style="font-size: 2.5rem; margin-bottom: 32px; text-align: center;">Popular Resources</h2>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; margin-bottom: 80px;">
        <div style="border: 1px solid #EAEAEA; border-radius: 24px; overflow: hidden; background: white; transition: box-shadow 0.3s, transform 0.3s; cursor: pointer;" onmouseover="this.style.boxShadow='var(--shadow-md)'; this.style.transform='translateY(-4px)'" onmouseout="this.style.boxShadow='none'; this.style.transform='translateY(0)'">
          <div style="height: 160px; background: url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80') center/cover;"></div>
          <div style="padding: 32px;">
             <span style="color: var(--color-primary); font-weight: 700; font-size: 0.85rem; letter-spacing: 1px; text-transform: uppercase;">Course</span>
             <h3 style="font-size: 1.5rem; margin: 12px 0;">Patience in the Chaos</h3>
             <p style="color: var(--color-text-muted); line-height: 1.6; margin-bottom: 24px;">A 7-day course on finding calm during tantrums and chaotic mornings.</p>
             <a href="#/guided-courses" class="btn btn-outline" style="display: block; width: 100%; text-align: center; border-radius: 8px; box-sizing: border-box; text-decoration: none;">Start Course</a>
          </div>
        </div>
        <div style="border: 1px solid #EAEAEA; border-radius: 24px; overflow: hidden; background: white; transition: box-shadow 0.3s, transform 0.3s; cursor: pointer;" onmouseover="this.style.boxShadow='var(--shadow-md)'; this.style.transform='translateY(-4px)'" onmouseout="this.style.boxShadow='none'; this.style.transform='translateY(0)'">
          <div style="height: 160px; background: url('https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80') center/cover;"></div>
          <div style="padding: 32px;">
             <span style="color: var(--color-primary); font-weight: 700; font-size: 0.85rem; letter-spacing: 1px; text-transform: uppercase;">Exercise</span>
             <h3 style="font-size: 1.5rem; margin: 12px 0;">The 3-Breath Pause</h3>
             <p style="color: var(--color-text-muted); line-height: 1.6; margin-bottom: 24px;">A simple technique to reset your nervous system before reacting to your child.</p>
             <a href="#/calming-anxiety" class="btn btn-outline" style="display: block; width: 100%; text-align: center; border-radius: 8px; box-sizing: border-box; text-decoration: none;">Try Now</a>
          </div>
        </div>
        <div style="border: 1px solid #EAEAEA; border-radius: 24px; overflow: hidden; background: white; transition: box-shadow 0.3s, transform 0.3s; cursor: pointer;" onmouseover="this.style.boxShadow='var(--shadow-md)'; this.style.transform='translateY(-4px)'" onmouseout="this.style.boxShadow='none'; this.style.transform='translateY(0)'">
           <div style="height: 160px; background: url('https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80') center/cover;"></div>
          <div style="padding: 32px;">
             <span style="color: var(--color-primary); font-weight: 700; font-size: 0.85rem; letter-spacing: 1px; text-transform: uppercase;">Article</span>
             <h3 style="font-size: 1.5rem; margin: 12px 0;">Navigating Teen Years</h3>
             <p style="color: var(--color-text-muted); line-height: 1.6; margin-bottom: 24px;">How to transition from manager to consultant as your children grow.</p>
             <a href="#/articles" class="btn btn-outline" style="display: block; width: 100%; text-align: center; border-radius: 8px; box-sizing: border-box; text-decoration: none;">Read Article</a>
          </div>
        </div>
      </div>
      
    </div>
  </section>
`;

const MindfulnessWork = `
  <section class="page-hero" style="background-color: #E6F7F0; padding: 100px 0;">
    <div class="container text-center">
      <h1 class="hero-title" style="margin-bottom: 24px; font-size: 4rem;">Mindfulness at Work</h1>
      <p class="hero-subtitle" style="margin: 0 auto; max-width: 600px; font-size: 1.25rem;">Cultivate focus, resilience, and better communication in your professional environment.</p>
    </div>
  </section>
  <section style="padding: 100px 0; background: white;">
    <div class="container" style="max-width: 1000px;">
      
      <div style="background: linear-gradient(135deg, #1A3A2A, #2D5E4D); border-radius: 32px; padding: 64px; color: white; display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 80px;">
        <span style="background: rgba(255,255,255,0.1); padding: 8px 16px; border-radius: 20px; font-size: 0.9rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 24px;">Daily Recommendation</span>
        <h2 style="font-size: 3rem; margin: 0 0 16px;">The 3-Minute Desk Reset</h2>
        <p style="font-size: 1.25rem; color: #A0C0B0; margin-bottom: 32px; max-width: 600px;">Step away from the screen, drop your shoulders, and recalibrate your focus before your next task.</p>
        <button id="play-exercise-btn" class="btn" style="background: white; color: #1A3A2A; padding: 16px 40px; font-size: 1.2rem; border-radius: 30px;">Play Exercise</button>
        <div id="exercise-panel" style="display:none; margin-top: 32px; background: rgba(255,255,255,0.9); border-radius: 24px; padding: 28px; text-align:left; box-shadow: var(--shadow-md);">
          <h3 style="margin-top:0; font-size: 1.75rem;">Desk Reset Exercise</h3>
          <p style="color: var(--color-text-muted); font-size: 1rem; margin-bottom: 24px;">Follow these movement and breathing steps to reset your body and mind in three minutes.</p>
          <ol style="padding-left: 20px; color: var(--color-text-dark);">
            <li style="margin-bottom: 12px;">Stand up and stretch your arms overhead. Inhale deeply for 4 seconds.</li>
            <li style="margin-bottom: 12px;">Exhale slowly while rolling your shoulders back and down.</li>
            <li style="margin-bottom: 12px;">Do 3 slow neck circles to release tension.</li>
            <li style="margin-bottom: 12px;">Finish with 5 grounding breaths: inhale for 4, hold for 2, exhale for 6.</li>
          </ol>
          <button id="close-exercise-btn" class="btn btn-outline" style="margin-top: 16px;">Close Exercise</button>
        </div>
      </div>
        <div style="border: 1px solid #EAEAEA; border-radius: 20px; overflow: hidden; transition: transform 0.2s; cursor: pointer;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
          <div style="height: 140px; background: #E6F7F0; display: flex; align-items: center; justify-content: center; font-size: 3rem;">💼</div>
          <div style="padding: 24px;">
            <h3 style="font-size: 1.2rem; margin-bottom: 8px;">Pre-Meeting Prep</h3>
            <p style="color: var(--color-text-muted); font-size: 0.95rem;">Clear your head and set an intention before stepping into that big presentation or tough conversation.</p>
          </div>
        </div>
        <div style="border: 1px solid #EAEAEA; border-radius: 20px; overflow: hidden; transition: transform 0.2s; cursor: pointer;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
          <div style="height: 140px; background: #FFF3E0; display: flex; align-items: center; justify-content: center; font-size: 3rem;">🔋</div>
          <div style="padding: 24px;">
            <h3 style="font-size: 1.2rem; margin-bottom: 8px;">Mid-day Slump</h3>
            <p style="color: var(--color-text-muted); font-size: 0.95rem;">A revitalizing breathing technique to boost your energy naturally at 3 PM.</p>
          </div>
        </div>
        <div style="border: 1px solid #EAEAEA; border-radius: 20px; overflow: hidden; transition: transform 0.2s; cursor: pointer;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
          <div style="height: 140px; background: #E8F5E9; display: flex; align-items: center; justify-content: center; font-size: 3rem;">🚇</div>
          <div style="padding: 24px;">
            <h3 style="font-size: 1.2rem; margin-bottom: 8px;">The Commute Home</h3>
            <p style="color: var(--color-text-muted); font-size: 0.95rem;">Leave work stress at work. Use your transit time to transition back into personal time.</p>
          </div>
        </div>
      </div>
      
    </div>
  </section>
`;

const SleepMusic = `
  <section class="page-hero" style="background-color: #1A1A3A; color: white; padding: 80px 0;">
    <div class="container text-center">
      <h1 class="hero-title" style="margin-bottom: 20px; color: white;">Sleep Music</h1>
      <p class="hero-subtitle" style="margin: 0 auto; max-width: 600px; color: #A0A0C0;">Drift off to peaceful sounds, ambient textures, and calm sleepscapes.</p>
    </div>
  </section>
  <section class="library-section" style="background-color: #0F0F24; padding: 60px 0;">
    <div class="container">
      <!-- Sleep music player -->
      <div class="featured-player" style="background: linear-gradient(145deg, #2D2D5E, #1A1A3A); border-radius: 24px; padding: 40px; color: white; display: flex; gap: 40px; align-items: center; margin-bottom: 60px; box-shadow: 0 20px 40px rgba(0,0,0,0.4);">
        <div class="player-cover" style="width: 250px; height: 250px; border-radius: 20px; background: url('https://images.unsplash.com/photo-1534067339794-fbac860c4013?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80') center/cover; box-shadow: 0 10px 30px rgba(0,0,0,0.5); flex-shrink: 0; position: relative;">
          <div class="play-overlay" style="position: absolute; inset:0; display:flex; align-items:center; justify-content:center; background: rgba(0,0,0,0.2); border-radius: 20px;">
             <button id="sleep-play-toggle" style="width: 64px; height: 64px; border-radius: 50%; background: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #1A1A3A; box-shadow: 0 4px 12px rgba(0,0,0,0.3); transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">START</button>
          </div>
        </div>
        <div class="player-controls" style="flex: 1;">
          <span style="background: rgba(255,255,255,0.1); padding: 6px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Featured Track</span>
          <h2 id="sleep-track-title" style="font-size: 2.5rem; margin: 16px 0 8px;">Deep Melody Tunes</h2>
          <p id="sleep-track-desc" style="color: #A0A0C0; font-size: 1.1rem; margin-bottom: 32px;">Harmonic frequencies and slow, deep cello melodies to guide you into profound sleep.</p>
          
          <div class="progress-container" style="margin-bottom: 24px;">
            <div class="time-readout" style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #A0A0C0; margin-bottom: 8px;">
              <span id="sleep-current-time">0:00</span>
              <span id="sleep-total-time">8:00:00</span>
            </div>
            <div id="sleep-progress-bar" class="progress-bar" style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; cursor: pointer;">
              <div id="sleep-progress-fill" class="progress-fill" style="width: 0%; height: 100%; background: var(--color-primary); border-radius: 3px; box-shadow: 0 0 10px var(--color-primary);"></div>
            </div>
          </div>
          
          <div class="control-buttons" style="display: flex; align-items: center; gap: 24px;">
            <button id="sleep-previous-track" style="background:none; border:none; color: white; font-size: 28px; cursor: pointer; opacity: 0.7; transition: opacity 0.2s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">⏮</button>
            <button id="sleep-play-button" style="width: 56px; height: 56px; border-radius: 50%; background: var(--color-primary); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 20px; color: white; box-shadow: 0 4px 12px rgba(52, 168, 83, 0.4);">START</button>
            <button id="sleep-next-track" style="background:none; border:none; color: white; font-size: 28px; cursor: pointer; opacity: 0.7; transition: opacity 0.2s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">⏭</button>
            <label style="display: flex; align-items: center; gap: 8px; color: #A0A0C0; font-size: 0.9rem;">
              <span>Vol</span>
              <input id="sleep-volume" type="range" min="0" max="100" value="50" style="cursor: pointer;">
            </label>
          </div>
        </div>
      </div>

      <h2 class="section-title" style="color: white; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px;">More Sleep Music</h2>
      <div class="library-grid" style="margin-top: 32px; display: grid; grid-template-columns: repeat(3, minmax(240px, 1fr)); gap: 24px;">
        <div class="sleep-library-card" data-track-index="0" style="background-color: #2D2D5E; color: white; border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: 28px; cursor: pointer; transition: transform 0.3s, background 0.3s;">
          <div class="card-content"><h3 style="margin-bottom: 12px;">Ambient Dreams</h3><p style="color:#A0A0C0; margin-bottom: 20px;">Atmospheric synth pads and soft chimes.</p></div>
          <div class="card-illustration" style="font-size: 2rem;">🌙</div>
        </div>
        <div class="sleep-library-card" data-track-index="1" style="background-color: #2D2D5E; color: white; border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: 28px; cursor: pointer; transition: transform 0.3s, background 0.3s;">
          <div class="card-content"><h3 style="margin-bottom: 12px;">Melody Sleep Flow</h3><p style="color:#A0A0C0; margin-bottom: 20px;">Warm melodic textures with gentle bell tones.</p></div>
          <div class="card-illustration" style="font-size: 2rem;">🎼</div>
        </div>
        <div class="sleep-library-card" data-track-index="2" style="background-color: #2D2D5E; color: white; border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: 28px; cursor: pointer; transition: transform 0.3s, background 0.3s;">
          <div class="card-content"><h3 style="margin-bottom: 12px;">Rain & Piano</h3><p style="color:#A0A0C0; margin-bottom: 20px;">The soothing sound of rain mixed with slow chords.</p></div>
          <div class="card-illustration" style="font-size: 2rem;">🌧️</div>
        </div>
      </div>
    </div>
  </section>
`;

const WhiteNoise = `
  <section class="page-hero" style="background-color: #E8F5E9; padding: 100px 0;">
    <div class="container text-center">
      <h1 class="hero-title" style="margin-bottom: 24px; font-size: 4rem;">Wind & Rain</h1>
      <p class="hero-subtitle" style="margin: 0 auto; max-width: 600px; font-size: 1.25rem;">Natural wind textures and small rain drops to mask distractions and help your brain relax.</p>
    </div>
  </section>
  <section style="padding: 100px 0; background: #fafbfc;">
    <div class="container" style="max-width: 1000px;">
      
      <div style="text-align: center; margin-bottom: 64px;">
        <h2 style="font-size: 2.5rem; margin-bottom: 16px;">Nature's Soothing Patterns</h2>
        <p style="color: var(--color-text-muted); font-size: 1.125rem;">Choose a natural soundscape to help soften distractions and support calm focus.</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; margin-bottom: 64px;">
        <div style="background: white; border: 1px solid #EAEAEA; border-radius: 24px; padding: 40px; text-align: center; box-shadow: var(--shadow-sm); position: relative; overflow: hidden;">
          <div style="position: absolute; top: -50px; left: -50px; width: 100px; height: 100px; background: rgba(200,200,200,0.1); border-radius: 50%;"></div>
          <div style="width: 64px; height: 64px; background: #f0f0f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; margin: 0 auto 24px;">🌬️</div>
          <h3 style="font-size: 1.5rem; margin-bottom: 12px;">Wind Noise</h3>
          <p style="color: var(--color-text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 24px;">Gentle gusts with airy movement and soft low-end breath.</p>
          <button id="wind-noise-play" class="btn btn-outline" style="width: 100%; border-radius: 30px;">Play</button>
        </div>
        
        <div style="background: white; border: 1px solid #EAEAEA; border-radius: 24px; padding: 40px; text-align: center; box-shadow: var(--shadow-sm); position: relative; overflow: hidden; transform: scale(1.05); z-index: 1; border-top: 4px solid #87CEFA;">
          <div style="position: absolute; top: 10px; right: 10px; font-size: 0.75rem; background: #87CEFA; color: #20456A; padding: 4px 12px; border-radius: 12px; font-weight: bold;">Small Drops</div>
          <div style="width: 64px; height: 64px; background: #E0F4FF; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; margin: 0 auto 24px;">💧</div>
          <h3 style="font-size: 1.5rem; margin-bottom: 12px;">Rain Drops</h3>
          <p style="color: var(--color-text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 24px;">Soft, textured drops with a delicate high-frequency shimmer.</p>
          <button id="rain-noise-play" class="btn btn-primary" style="width: 100%; border-radius: 30px; background: #87CEFA; color: #20456A; border: none;">Play</button>
        </div>
        
        <div style="background: white; border: 1px solid #EAEAEA; border-radius: 24px; padding: 40px; text-align: center; box-shadow: var(--shadow-sm); position: relative; overflow: hidden;">
          <div style="position: absolute; bottom: -50px; right: -50px; width: 100px; height: 100px; background: rgba(139,69,19,0.1); border-radius: 50%;"></div>
          <div style="width: 64px; height: 64px; background: #F5DEB3; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; margin: 0 auto 24px;">🐻</div>
          <h3 style="font-size: 1.5rem; margin-bottom: 12px;">Brown Noise</h3>
          <p style="color: var(--color-text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 24px;">Rich, low-frequency rumble. Sounds like distant thunder or a strong river current.</p>
          <button id="brown-noise-play" class="btn btn-outline" style="width: 100%; border-radius: 30px;">Play</button>
        </div>
      </div>
      <div style="text-align:center; margin-top: 32px;">
        <label for="noise-volume" style="font-weight:700; display:block; margin-bottom: 12px;">Volume</label>
        <input id="noise-volume" type="range" min="0" max="100" value="50" style="width: 320px; max-width: 100%;">
        <p id="noise-status" style="margin-top: 18px; color: var(--color-text-muted);">No sound playing.</p>
      </div>

    </div>
  </section>
`;

const Assessment = `
  <section class="page-hero" style="background-color: #F3E5F5; padding: 80px 0;">
    <div class="container text-center">
      <h1 class="hero-title" style="margin-bottom: 20px;">Stress Check-in</h1>
      <p class="hero-subtitle" style="margin: 0 auto; max-width: 600px;">A short 5-question assessment to help you understand your current stress levels.</p>
    </div>
  </section>
  <section style="padding: 80px 0; background: #fafbfc; min-height: 50vh;">
    <div class="container" style="max-width: 700px;">
      <div style="background: white; padding: 40px; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-md);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
          <h3 style="margin: 0;">Question 1 of 5</h3>
          <span style="color: var(--color-primary); font-weight: 600;">20% Completed</span>
        </div>
        <div style="height: 8px; background: #EAEAEA; border-radius: 4px; margin-bottom: 40px;">
          <div style="height: 100%; width: 20%; background: var(--color-primary); border-radius: 4px;"></div>
        </div>
        
        <h2 style="font-size: 1.5rem; margin-bottom: 32px;">In the last week, how often have you felt overwhelmed by your responsibilities?</h2>
        
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <label style="display: flex; align-items: center; padding: 20px; border: 1px solid #EAEAEA; border-radius: 12px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.borderColor='var(--color-primary)'" onmouseout="this.style.borderColor='#EAEAEA'">
            <input type="radio" name="q1" style="margin-right: 16px; transform: scale(1.5);">
            <span style="font-size: 1.1rem;">Never</span>
          </label>
          <label style="display: flex; align-items: center; padding: 20px; border: 1px solid #EAEAEA; border-radius: 12px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.borderColor='var(--color-primary)'" onmouseout="this.style.borderColor='#EAEAEA'">
            <input type="radio" name="q1" style="margin-right: 16px; transform: scale(1.5);">
            <span style="font-size: 1.1rem;">Rarely</span>
          </label>
          <label style="display: flex; align-items: center; padding: 20px; border: 1px solid #EAEAEA; border-radius: 12px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.borderColor='var(--color-primary)'" onmouseout="this.style.borderColor='#EAEAEA'">
            <input type="radio" name="q1" style="margin-right: 16px; transform: scale(1.5);">
            <span style="font-size: 1.1rem;">Sometimes</span>
          </label>
          <label style="display: flex; align-items: center; padding: 20px; border: 1px solid #EAEAEA; border-radius: 12px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.borderColor='var(--color-primary)'" onmouseout="this.style.borderColor='#EAEAEA'">
            <input type="radio" name="q1" style="margin-right: 16px; transform: scale(1.5);">
            <span style="font-size: 1.1rem;">Often</span>
          </label>
          <label style="display: flex; align-items: center; padding: 20px; border: 1px solid #EAEAEA; border-radius: 12px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.borderColor='var(--color-primary)'" onmouseout="this.style.borderColor='#EAEAEA'">
            <input type="radio" name="q1" style="margin-right: 16px; transform: scale(1.5);">
            <span style="font-size: 1.1rem;">Always</span>
          </label>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-top: 40px;">
          <button id="prev-question-btn" class="btn btn-outline" style="opacity: 0.5; cursor: not-allowed;" disabled>Previous</button>
          <button id="next-question-btn" class="btn btn-primary">Next Question</button>
        </div>
      </div>
    </div>
  </section>
`;

const assessmentQuestions = [
  {
    prompt: 'In the last week, how often have you felt overwhelmed by your responsibilities?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    prompt: 'How often have you had trouble relaxing?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    prompt: 'How often have you felt nervous, anxious, or on edge?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    prompt: 'How often have you been able to control irritability?',
    options: ['Always', 'Often', 'Sometimes', 'Rarely', 'Never']
  },
  {
    prompt: 'How often have you felt overwhelming fatigue?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  }
];

const assessmentState = {
  index: 0,
  answers: []
};

function renderAssessment() {
  const questionData = assessmentQuestions[assessmentState.index];
  const container = document.getElementById('main-content');
  if (!container) return;

  container.innerHTML = `
  <section class="page-hero" style="background-color: #F3E5F5; padding: 80px 0;">
    <div class="container text-center">
      <h1 class="hero-title" style="margin-bottom: 20px;">Stress Check-in</h1>
      <p class="hero-subtitle" style="margin: 0 auto; max-width: 600px;">A short 5-question assessment to help you understand your current stress levels.</p>
    </div>
  </section>
  <section style="padding: 80px 0; background: #fafbfc; min-height: 50vh;">
    <div class="container" style="max-width: 700px;">
      <div style="background: white; padding: 40px; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-md);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
          <h3 style="margin: 0;">Question ${assessmentState.index + 1} of ${assessmentQuestions.length}</h3>
          <span style="color: var(--color-primary); font-weight: 600;">${Math.round(((assessmentState.index + 1) / assessmentQuestions.length) * 100)}% Completed</span>
        </div>
        <div style="height: 8px; background: #EAEAEA; border-radius: 4px; margin-bottom: 40px;">
          <div style="height: 100%; width: ${((assessmentState.index + 1) / assessmentQuestions.length) * 100}%; background: var(--color-primary); border-radius: 4px;"></div>
        </div>
        <h2 style="font-size: 1.5rem; margin-bottom: 32px;">${questionData.prompt}</h2>
        <div style="display: flex; flex-direction: column; gap: 16px;" id="assess-options"></div>
        <div style="display: flex; justify-content: space-between; margin-top: 40px;">
          <button id="prev-question-btn" class="btn btn-outline">Previous</button>
          <button id="next-question-btn" class="btn btn-primary">Next Question</button>
        </div>
      </div>
    </div>
  </section>
`;

  const optionsContainer = document.getElementById('assess-options');
  questionData.options.forEach((option, i) => {
    const selected = assessmentState.answers[assessmentState.index] === i;
    optionsContainer.insertAdjacentHTML('beforeend', `
      <label style="display: flex; align-items: center; padding: 20px; border: 1px solid #EAEAEA; border-radius: 12px; cursor: pointer; ${selected ? 'border-color: var(--color-primary); background: #E9F8F1;' : ''}">
        <input type="radio" name="question" value="${i}" style="margin-right: 16px; transform: scale(1.5);" ${selected ? 'checked' : ''}>
        <span style="font-size: 1.1rem;">${option}</span>
      </label>
    `);
  });

  const prevButton = document.getElementById('prev-question-btn');
  const nextButton = document.getElementById('next-question-btn');

  prevButton.disabled = assessmentState.index === 0;
  prevButton.style.opacity = assessmentState.index === 0 ? '0.5' : '1';
  prevButton.style.cursor = assessmentState.index === 0 ? 'not-allowed' : 'pointer';

  const selectInput = document.querySelector('input[name="question"]:checked');
  if (!selectInput) {
    nextButton.disabled = true;
    nextButton.style.opacity = '0.5';
    nextButton.style.cursor = 'not-allowed';
  }

  optionsContainer.querySelectorAll('input[name="question"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      nextButton.disabled = false;
      nextButton.style.opacity = '1';
      nextButton.style.cursor = 'pointer';
      assessmentState.answers[assessmentState.index] = Number(radio.value);
    });
  });

  prevButton.onclick = () => {
    if (assessmentState.index > 0) {
      assessmentState.index -= 1;
      renderAssessment();
    }
  };

  nextButton.onclick = () => {
    const checked = document.querySelector('input[name="question"]:checked');
    if (!checked) return;

    assessmentState.answers[assessmentState.index] = Number(checked.value);

    if (assessmentState.index < assessmentQuestions.length - 1) {
      assessmentState.index += 1;
      renderAssessment();
    } else {
      const score = assessmentState.answers.reduce((sum, value) => sum + value, 0);
      const interpretation = score <= 6 ? 'Low stress' : score <= 12 ? 'Moderate stress' : 'High stress';
      const tips = [];

      // Personalized tips based on responses
      if ([3, 4].includes(assessmentState.answers[0])) {
        tips.push('Break tasks into smaller steps and take short mental breaks between responsibilities.');
      }
      if ([3, 4].includes(assessmentState.answers[1])) {
        tips.push('Try daily relaxation exercises (deep breathing, body scan, progressive muscle relaxation).');
      }
      if ([3, 4].includes(assessmentState.answers[2])) {
        tips.push('Use grounding techniques such as 5-4-3-2-1 to reduce anxiety in the moment.');
      }
      if ([0, 1].includes(assessmentState.answers[3])) {
        tips.push('Practice patience techniques and set boundaries to avoid irritability spikes.');
      }
      if ([3, 4].includes(assessmentState.answers[4])) {
        tips.push('Improve sleep hygiene: consistent bedtime, screen-free wind-down, and nighttime routine.');
      }

      if (!tips.length) {
        tips.push('Great job! Keep maintaining your current wellness habits and check in again regularly.');
      }

      const relevantGain = interpretation === 'High stress' ? 'Focus on immediate stress reduction practices and weekly review.' : interpretation === 'Moderate stress' ? 'Keep consistent habits and build a small daily routine.' : 'Maintain current habits and take a periodic check-in.';

      container.innerHTML = `
        <section class="page-hero" style="background-color: #F3E5F5; padding: 80px 0;">
          <div class="container text-center">
            <h1 class="hero-title">Assessment complete</h1>
            <p class="hero-subtitle">Your stress level: ${interpretation}</p>
          </div>
        </section>
        <section style="padding: 80px 0; background: #fafbfc; min-height: 50vh;">
          <div class="container" style="max-width: 700px; text-align: center;">
            <div style="background: white; padding: 40px; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-md);">
              <p>Thanks for completing the check-in. Based on your answers, here are your personalized next actions:</p>
              <h3>03. Quick improvement focus</h3>
              <p style="margin-top: 0; font-weight: 600;">${relevantGain}</p>
              <h3>02. Targeted recommendations</h3>
              <ul style="text-align: left; margin: 10px 0 20px; padding-left: 18px;">
                ${tips.map((tip) => `<li style="margin-bottom: 8px;">${tip}</li>`).join('')}
              </ul>
              <h3>01. Your response summary</h3>
              <ul style="text-align:left; margin-top: 10px;">
                ${assessmentQuestions.map((q, idx) => `<li><strong>${q.prompt}</strong><br/>${q.options[assessmentState.answers[idx]] || 'Not answered'}</li>`).join('')}
              </ul>
              <button class="btn btn-primary" style="margin-top: 24px;" onclick="window.location.hash='#/'">Back to Home</button>
            </div>
          </div>
        </section>
      `;
    }
  };
}

const sleepTracks = [
  {
    title: 'Deep Melody Tunes',
    description: 'Harmonic frequencies and slow, deep cello melodies to guide you into profound sleep.',
    durationSeconds: 8 * 60 * 60,
    createSource: (ctx) => {
      const masterGain = ctx.createGain();
      masterGain.gain.value = 0.14;
      masterGain.connect(ctx.destination);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 700;
      filter.Q.value = 1.2;

      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = 95;

      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.value = 155;

      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.04;

      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 35;
      lfo.connect(lfoGain);
      lfoGain.connect(osc1.frequency);
      lfoGain.connect(osc2.frequency);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(masterGain);

      osc1.start();
      osc2.start();
      lfo.start();

      return {
        stop: () => {
          osc1.stop();
          osc2.stop();
          lfo.stop();
          masterGain.disconnect();
          filter.disconnect();
        }
      };
    }
  },
  {
    title: 'Melody Sleep Flow',
    description: 'Warm melodic textures with gentle bell tones, designed for deep calm and restful sleep.',
    durationSeconds: 5 * 60 * 60,
    createSource: (ctx, gainNode) => {
      const masterGain = gainNode || ctx.createGain();
      masterGain.gain.value = 0.12;

      const melody = ctx.createOscillator();
      melody.type = 'triangle';
      melody.frequency.value = 110;

      const harmony = ctx.createOscillator();
      harmony.type = 'sine';
      harmony.frequency.value = 165;

      const melodyGain = ctx.createGain();
      melodyGain.gain.value = 0.08;
      melody.connect(melodyGain);
      melodyGain.connect(masterGain);

      const harmonyGain = ctx.createGain();
      harmonyGain.gain.value = 0.06;
      harmony.connect(harmonyGain);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 900;
      filter.Q.value = 0.9;
      melodyGain.connect(filter);
      harmonyGain.connect(filter);
      filter.connect(masterGain);

      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.06;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 20;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      melody.start();
      harmony.start();
      lfo.start();

      return {
        stop: () => {
          melody.stop();
          harmony.stop();
          lfo.stop();
          masterGain.disconnect();
          filter.disconnect();
          melodyGain.disconnect();
          harmonyGain.disconnect();
        }
      };
    }
  },
  {
    title: 'Rain & Piano',
    description: 'Soft rainfall textures mixed with slow piano chimes for a restful soundscape.',
    durationSeconds: 6 * 60 * 60,
    createSource: (ctx, gainNode) => {
      const masterGain = gainNode || ctx.createGain();
      masterGain.gain.value = 0.12;
      if (!gainNode) {
        masterGain.connect(ctx.destination);
      }

      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 400;
      noiseFilter.Q.value = 0.9;
      noiseSource.connect(noiseFilter);
      noiseFilter.connect(masterGain);

      const piano = ctx.createOscillator();
      piano.type = 'triangle';
      piano.frequency.value = 220;

      const pianoGain = ctx.createGain();
      pianoGain.gain.value = 0.09;
      piano.connect(pianoGain);
      pianoGain.connect(masterGain);

      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.05;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 20;
      lfo.connect(lfoGain);
      lfoGain.connect(piano.frequency);

      noiseSource.start();
      piano.start();
      lfo.start();

      return {
        stop: () => {
          noiseSource.stop();
          piano.stop();
          lfo.stop();
          masterGain.disconnect();
          noiseFilter.disconnect();
          pianoGain.disconnect();
        }
      };
    }
  }
];

let sleepAudioContext = null;
let sleepGainNode = null;
let sleepAudioPlayer = null;
let currentSleepTrackIndex = 0;
let sleepTrackStartTime = 0;
let sleepTrackElapsedBeforePause = 0;
let sleepProgressTimer = null;

function ensureSleepAudioContext() {
  if (!sleepAudioContext) {
    sleepAudioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (sleepAudioContext.state === 'suspended') {
    sleepAudioContext.resume();
  }
  return sleepAudioContext;
}

let noiseAudioContext = null;
let noiseGainNode = null;
let noiseSourceNode = null;
let noiseAuxNodes = [];
let currentNoiseType = null;

function ensureNoiseAudioContext() {
  if (!noiseAudioContext) {
    noiseAudioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (noiseAudioContext.state === 'suspended') {
    noiseAudioContext.resume();
  }
  return noiseAudioContext;
}

function createNoiseBuffer(ctx, seconds = 2) {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function createNoiseSource(ctx, type) {
  const source = ctx.createBufferSource();
  source.buffer = createNoiseBuffer(ctx);
  source.loop = true;
  const auxNodes = [];

  if (type === 'wind') {
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 900;
    filter.Q.value = 0.8;

    const motionGain = ctx.createGain();
    motionGain.gain.value = 0.08;

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.07;
    lfo.connect(lfoGain);
    lfoGain.connect(motionGain.gain);

    source.connect(filter);
    filter.connect(motionGain);
    auxNodes.push(lfo);
    return { source, output: motionGain, auxNodes };
  }

  if (type === 'rain') {
    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 1700;
    highpass.Q.value = 0.75;

    const shimmer = ctx.createBiquadFilter();
    shimmer.type = 'lowpass';
    shimmer.frequency.value = 8000;
    shimmer.Q.value = 0.7;

    const dropGain = ctx.createGain();
    dropGain.gain.value = 0.09;

    const tremolo = ctx.createOscillator();
    tremolo.type = 'sine';
    tremolo.frequency.value = 9.5;
    const tremoloGain = ctx.createGain();
    tremoloGain.gain.value = 0.075;
    tremolo.connect(tremoloGain);
    tremoloGain.connect(dropGain.gain);

    source.connect(highpass);
    highpass.connect(shimmer);
    shimmer.connect(dropGain);
    auxNodes.push(tremolo);
    return { source, output: dropGain, auxNodes };
  }

  if (type === 'brown') {
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 450;
    filter.Q.value = 1.2;
    source.connect(filter);
    return { source, output: filter, auxNodes };
  }

  return { source, output: source, auxNodes };
}

function stopNoisePlayback() {
  if (noiseSourceNode) {
    try {
      noiseSourceNode.stop();
    } catch (e) {
      // ignore already-stopped source
    }
    noiseSourceNode.disconnect();
    noiseSourceNode = null;
  }
  noiseAuxNodes.forEach((node) => {
    try {
      if (node.stop) node.stop();
    } catch (e) {
      // ignore already-stopped auxiliary nodes
    }
    try {
      node.disconnect();
    } catch (e) {
      // ignore disconnect errors
    }
  });
  noiseAuxNodes = [];
  if (noiseGainNode) {
    noiseGainNode.disconnect();
    noiseGainNode = null;
  }
  currentNoiseType = null;
  updateNoiseButtons();
}

function updateNoiseButtons() {
  ['wind', 'rain', 'brown'].forEach((type) => {
    const button = document.getElementById(`${type}-noise-play`);
    if (button) {
      button.textContent = currentNoiseType === type ? 'Pause' : 'Play';
    }
  });

  const status = document.getElementById('noise-status');
  if (status) {
    status.textContent = currentNoiseType
      ? `${currentNoiseType === 'rain' ? 'Rain drops' : currentNoiseType.charAt(0).toUpperCase() + currentNoiseType.slice(1)} playing.`
      : 'No sound playing.';
  }
}

function playNoise(type) {
  const ctx = ensureNoiseAudioContext();
  stopNoisePlayback();

  noiseGainNode = ctx.createGain();
  const volumeControl = document.getElementById('noise-volume');
  noiseGainNode.gain.value = volumeControl ? Number(volumeControl.value) / 100 : 0.5;
  noiseGainNode.connect(ctx.destination);

  const { source, output, auxNodes = [] } = createNoiseSource(ctx, type);
  output.connect(noiseGainNode);
  source.start();

  noiseSourceNode = source;
  noiseAuxNodes = auxNodes;
  currentNoiseType = type;
  updateNoiseButtons();
}

function initWindRain() {
  const volumeControl = document.getElementById('noise-volume');
  const windBtn = document.getElementById('wind-noise-play');
  const rainBtn = document.getElementById('rain-noise-play');
  const brownBtn = document.getElementById('brown-noise-play');

  if (windBtn) {
    windBtn.addEventListener('click', () => {
      if (currentNoiseType === 'wind') stopNoisePlayback();
      else playNoise('wind');
    });
  }
  if (rainBtn) {
    rainBtn.addEventListener('click', () => {
      if (currentNoiseType === 'rain') stopNoisePlayback();
      else playNoise('rain');
    });
  }
  if (brownBtn) {
    brownBtn.addEventListener('click', () => {
      if (currentNoiseType === 'brown') stopNoisePlayback();
      else playNoise('brown');
    });
  }

  if (volumeControl) {
    volumeControl.addEventListener('input', () => {
      if (noiseGainNode) {
        noiseGainNode.gain.value = Number(volumeControl.value) / 100;
      }
    });
  }

  updateNoiseButtons();
}

function initMindfulnessWork() {
  const exerciseBtn = document.getElementById('play-exercise-btn');
  const closeBtn = document.getElementById('close-exercise-btn');
  const panel = document.getElementById('exercise-panel');

  if (exerciseBtn && panel) {
    exerciseBtn.addEventListener('click', () => {
      panel.style.display = 'block';
      exerciseBtn.style.display = 'none';
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  if (closeBtn && panel && exerciseBtn) {
    closeBtn.addEventListener('click', () => {
      panel.style.display = 'none';
      exerciseBtn.style.display = 'inline-flex';
      exerciseBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
}

function formatDuration(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

function updateSleepUI() {
  const trackInfo = sleepTracks[currentSleepTrackIndex];
  const titleElement = document.getElementById('sleep-track-title');
  const descElement = document.getElementById('sleep-track-desc');
  const timeElement = document.getElementById('sleep-current-time');
  const totalElement = document.getElementById('sleep-total-time');
  const progressFill = document.getElementById('sleep-progress-fill');
  const playButton = document.getElementById('sleep-play-button');
  const totalTime = trackInfo.durationSeconds;

  if (titleElement) titleElement.textContent = trackInfo.title;
  if (descElement) descElement.textContent = trackInfo.description;
  if (totalElement) totalElement.textContent = formatDuration(totalTime);

  const elapsed = sleepAudioPlayer && sleepTrackStartTime ? ((Date.now() - sleepTrackStartTime) / 1000) + sleepTrackElapsedBeforePause : sleepTrackElapsedBeforePause;
  const displayTime = Math.min(elapsed, totalTime);

  if (timeElement) timeElement.textContent = formatDuration(displayTime);
  if (progressFill) progressFill.style.width = `${Math.min((displayTime / totalTime) * 100, 100)}%`;
  if (playButton) playButton.textContent = sleepAudioPlayer ? '❚❚' : 'START';
}

function playSleepTrack(index) {
  const ctx = ensureSleepAudioContext();
  stopSleepAudio();
  currentSleepTrackIndex = index;
  const volumeControl = document.getElementById('sleep-volume');
  sleepGainNode = ctx.createGain();
  sleepGainNode.gain.value = volumeControl ? Number(volumeControl.value) / 100 : 0.5;
  sleepGainNode.connect(ctx.destination);

  const trackInfo = sleepTracks[index];
  sleepAudioPlayer = trackInfo.createSource(ctx, sleepGainNode);
  sleepTrackStartTime = Date.now();
  sleepTrackElapsedBeforePause = 0;
  sleepProgressTimer = setInterval(updateSleepUI, 250);
  updateSleepUI();
}

function stopSleepAudio() {
  if (sleepAudioPlayer && sleepAudioPlayer.stop) {
    sleepAudioPlayer.stop();
  }
  sleepAudioPlayer = null;
  if (sleepGainNode) {
    sleepGainNode.disconnect();
    sleepGainNode = null;
  }
  if (sleepProgressTimer) {
    clearInterval(sleepProgressTimer);
    sleepProgressTimer = null;
  }
  updateSleepUI();
}

function pauseSleepTrack() {
  if (!sleepAudioPlayer) return;
  sleepTrackElapsedBeforePause += (Date.now() - sleepTrackStartTime) / 1000;
  stopSleepAudio();
}

function toggleSleepPlayback() {
  if (sleepAudioPlayer) {
    pauseSleepTrack();
  } else {
    playSleepTrack(currentSleepTrackIndex);
  }
}

function initSleepMusic() {
  const playButton = document.getElementById('sleep-play-button');
  const playToggle = document.getElementById('sleep-play-toggle');
  const nextButton = document.getElementById('sleep-next-track');
  const prevButton = document.getElementById('sleep-previous-track');
  const volumeControl = document.getElementById('sleep-volume');
  const trackCards = document.querySelectorAll('.sleep-library-card');

  if (playButton) {
    playButton.onclick = toggleSleepPlayback;
  }
  if (playToggle) {
    playToggle.onclick = toggleSleepPlayback;
  }
  if (nextButton) {
    nextButton.onclick = () => {
      currentSleepTrackIndex = (currentSleepTrackIndex + 1) % sleepTracks.length;
      playSleepTrack(currentSleepTrackIndex);
    };
  }
  if (prevButton) {
    prevButton.onclick = () => {
      currentSleepTrackIndex = (currentSleepTrackIndex - 1 + sleepTracks.length) % sleepTracks.length;
      playSleepTrack(currentSleepTrackIndex);
    };
  }
  if (volumeControl) {
    volumeControl.oninput = () => {
      const gainValue = Number(volumeControl.value) / 100;
      if (sleepGainNode) {
        sleepGainNode.gain.value = gainValue;
      }
    };
  }
  trackCards.forEach((card) => {
    card.addEventListener('click', () => {
      const index = Number(card.dataset.trackIndex);
      if (!Number.isNaN(index)) {
        playSleepTrack(index);
      }
    });
    card.addEventListener('mouseover', () => {
      card.style.background = '#363670';
      card.style.transform = 'translateY(-4px)';
    });
    card.addEventListener('mouseout', () => {
      card.style.background = '#2D2D5E';
      card.style.transform = 'translateY(0)';
    });
  });

  updateSleepUI();
}

const MindfulGames = `
  <section class="page-hero" style="background-color: #E3F2FD; padding: 80px 0;">
    <div class="container text-center">
      <h1 class="hero-title" style="margin-bottom: 20px;">Mindful Games</h1>
      <p class="hero-subtitle" style="margin: 0 auto; max-width: 600px;">Take a moment to play, relax, and center yourself.</p>
    </div>
  </section>
  <section class="library-section" style="padding: 60px 0; background: #FAFAFA;">
    <div class="container">
      <div class="library-grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
        <!-- Breathing Sync -->
        <div class="library-card" style="background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: transform 0.3s; cursor: pointer; border: 1px solid #EAEAEA;" onmouseover="this.style.transform='translateY(-8px)'" onmouseout="this.style.transform='translateY(0)'" onclick="window.location.hash='#/game/breathing'">
          <div style="height: 160px; background: linear-gradient(135deg, #A8E6CF, #DCEDC1); display: flex; align-items: center; justify-content: center;">
            <div style="width: 60px; height: 60px; border-radius: 50%; background: white; animation: pulse 3s infinite ease-in-out;"></div>
            <style>@keyframes pulse { 0% { transform: scale(0.8); opacity: 0.8; } 50% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(0.8); opacity: 0.8; } }</style>
          </div>
          <div style="padding: 24px;">
            <h3 style="font-size: 1.5rem; margin-bottom: 8px;">Breathing Sync</h3>
            <p style="color: var(--color-text-muted); line-height: 1.6;">Follow the visual guide to slow your breathing, calm your heart rate, and clear your mind.</p>
          </div>
        </div>

        <!-- Zen Bubbles -->
        <div class="library-card" style="background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: transform 0.3s; cursor: pointer; border: 1px solid #EAEAEA;" onmouseover="this.style.transform='translateY(-8px)'" onmouseout="this.style.transform='translateY(0)'" onclick="window.location.hash='#/game/bubbles'">
          <div style="height: 160px; background: linear-gradient(135deg, #FFD3B6, #FFAAA5); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;">
            <div style="position: absolute; width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.4); bottom: 20px; left: 30%; animation: floatUp 4s infinite linear;"></div>
            <div style="position: absolute; width: 25px; height: 25px; border-radius: 50%; background: rgba(255,255,255,0.3); bottom: 40px; right: 25%; animation: floatUp 3s infinite linear 1s;"></div>
            <div style="position: absolute; width: 50px; height: 50px; border-radius: 50%; background: rgba(255,255,255,0.5); bottom: -20px; left: 60%; animation: floatUp 5s infinite linear 2s;"></div>
            <style>@keyframes floatUp { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(-200px); opacity: 0; } }</style>
          </div>
          <div style="padding: 24px;">
            <h3 style="font-size: 1.5rem; margin-bottom: 8px;">Zen Bubbles</h3>
            <p style="color: var(--color-text-muted); line-height: 1.6;">Gently tap or click drifting bubbles to dissolve them. A mindless activity to drift into relaxation.</p>
          </div>
        </div>
        <!-- Zen Sand -->
        <div class="library-card" style="background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: transform 0.3s; cursor: pointer; border: 1px solid #EAEAEA;" onmouseover="this.style.transform='translateY(-8px)'" onmouseout="this.style.transform='translateY(0)'" onclick="window.location.hash='#/game/zensand'">
          <div style="height: 160px; background: #EEDC9A; display: flex; align-items: center; justify-content: center; position: relative;">
            <div style="width: 100%; height: 20px; border-bottom: 2px solid rgba(0,0,0,0.05); position: absolute; top: 30px;"></div>
            <div style="width: 100%; height: 20px; border-bottom: 2px solid rgba(0,0,0,0.05); position: absolute; top: 60px;"></div>
            <div style="width: 100%; height: 20px; border-bottom: 2px solid rgba(0,0,0,0.05); position: absolute; top: 90px;"></div>
            <div style="font-size: 3rem; color: #8B7355; opacity: 0.8;">〰️</div>
          </div>
          <div style="padding: 24px;">
            <h3 style="font-size: 1.5rem; margin-bottom: 8px;">Zen Sand</h3>
            <p style="color: var(--color-text-muted); line-height: 1.6;">A digital Zen Garden. Drag gently across the sand to draw soothing, rhythmic patterns.</p>
          </div>
        </div>

        <!-- Lotus Ripples -->
        <div class="library-card" style="background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: transform 0.3s; cursor: pointer; border: 1px solid #EAEAEA;" onmouseover="this.style.transform='translateY(-8px)'" onmouseout="this.style.transform='translateY(0)'" onclick="window.location.hash='#/game/lotus'">
          <div style="height: 160px; background: linear-gradient(135deg, #1C2B36, #2C3E50); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;">
            <div style="width: 80px; height: 80px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.2); position: absolute; animation: ripple 3s infinite ease-out;"></div>
            <style>@keyframes ripple { 0% { transform: scale(0.5); opacity: 1; } 100% { transform: scale(3); opacity: 0; } }</style>
            <div style="font-size: 3rem; text-shadow: 0 0 10px rgba(255,150,150,0.6);">🪷</div>
          </div>
          <div style="padding: 24px;">
            <h3 style="font-size: 1.5rem; margin-bottom: 8px;">Lotus Ripples</h3>
            <p style="color: var(--color-text-muted); line-height: 1.6;">Tap the tranquil pond surface to create water ripples and bloom ethereal lotus flowers.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
`;

const GameZenSand = `
  <style>
    .game-container-sand {
      position: relative; height: calc(100vh - 72px); background: #EEDC9A; overflow: hidden;
    }
    #sand-canvas {
      display: block; width: 100%; height: 100%; touch-action: none; cursor: crosshair;
    }
    .game-back-sand {
      position: absolute; top: 20px; left: 20px; text-decoration: none;
      color: #8B7355; font-weight: 600; font-size: 1.1rem; display: flex; align-items: center; gap: 8px;
      background: rgba(255,255,255,0.4); padding: 8px 16px; border-radius: 20px; backdrop-filter: blur(4px);
      z-index: 10;
    }
    .sand-instruction {
      position: absolute; top: 20px; right: 20px; z-index: 10;
      color: #8B7355; font-size: 1.2rem; font-weight: 600; background: rgba(255,255,255,0.4); padding: 8px 16px; border-radius: 20px; pointer-events: none;
    }
    #sand-clear-btn {
      position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); z-index: 10;
      background: rgba(255,255,255,0.6); border: none; padding: 12px 24px; border-radius: 30px; font-weight: 600; color: #8B7355; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.05); font-size: 1rem;
    }
    #sand-clear-btn:hover { background: rgba(255,255,255,0.9); transform: translateX(-50%) translateY(-2px); }
  </style>
  <div class="game-container-sand">
    <a href="#/mindful-games" class="game-back-sand">← Back to Games</a>
    <div class="sand-instruction">Drag to rake sand</div>
    <button id="sand-clear-btn">Smooth Sand</button>
    <canvas id="sand-canvas"></canvas>
  </div>
`;

const GameLotus = `
  <style>
    .game-container-lotus {
      position: relative; height: calc(100vh - 72px); background: #1C2B36; overflow: hidden;
    }
    #lotus-canvas {
      display: block; width: 100%; height: 100%; touch-action: none; cursor: pointer;
    }
    .game-back-lotus {
      position: absolute; top: 20px; left: 20px; text-decoration: none;
      color: rgba(255,255,255,0.9); font-weight: 600; font-size: 1.1rem; display: flex; align-items: center; gap: 8px;
      background: rgba(0,0,0,0.3); padding: 8px 16px; border-radius: 20px; backdrop-filter: blur(4px);
      z-index: 10;
    }
    .lotus-instruction {
      position: absolute; top: 20px; right: 20px; z-index: 10;
      color: rgba(255,255,255,0.8); font-size: 1.2rem; font-weight: 600; pointer-events: none;
    }
  </style>
  <div class="game-container-lotus">
    <a href="#/mindful-games" class="game-back-lotus">← Back to Games</a>
    <div class="lotus-instruction">Tap to bloom</div>
    <canvas id="lotus-canvas"></canvas>
  </div>
`;

const GameBreathing = `
  <style>
    .game-container {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      height: calc(100vh - 72px); background: #F4F9F4; overflow: hidden; position: relative;
    }
    .breathing-circle-wrapper {
      position: relative; width: 300px; height: 300px; display: flex; align-items: center; justify-content: center;
      cursor: pointer; -webkit-tap-highlight-color: transparent;
    }
    .breathing-ring {
      position: absolute; width: 100%; height: 100%; border-radius: 50%;
      border: 2px dashed #A8E6CF; opacity: 0.5; pointer-events: none;
    }
    .breathing-circle {
      width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, #A8E6CF, #34A853);
      box-shadow: 0 10px 40px rgba(52, 168, 83, 0.3);
      transition: all 4s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex; align-items: center; justify-content: center;
      color: white; font-weight: 600; font-size: 1.2rem; user-select: none;
    }
    .expanding {
      width: 280px; height: 280px;
    }
    .instructions {
      margin-top: 40px; text-align: center; color: #555;
      font-size: 1.2rem; transition: opacity 0.5s;
    }
    .game-back {
      position: absolute; top: 20px; left: 20px; text-decoration: none;
      color: #0B3C72; font-weight: 600; font-size: 1.1rem; display: flex; align-items: center; gap: 8px;
    }
    .game-score-display {
      position: absolute; top: 20px; right: 20px; background: white; padding: 10px 20px;
      border-radius: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); font-weight: bold; color: #34A853;
    }
  </style>
  <div class="game-container">
    <a href="#/mindful-games" class="game-back">← Back to Games</a>
    <div class="game-score-display">Mindful Breaths: <span id="breath-count">0</span></div>
    
    <div style="margin-bottom: 40px; text-align: center;">
      <h2 style="font-size: 2rem; color: #2C5E43; margin-bottom: 8px;">Breathing Sync</h2>
      <p style="color: #666; max-width: 400px; margin: 0 auto;">Hold to inhale, release to exhale.</p>
    </div>

    <div class="breathing-circle-wrapper" id="breathing-area">
      <div class="breathing-ring"></div>
      <div class="breathing-circle" id="breathing-circle">Hold</div>
    </div>

    <div class="instructions" id="breathing-instruction">Click and hold to inhale</div>
  </div>
`;

const GameBubbles = `
  <style>
    .game-container-bubbles {
      position: relative; height: calc(100vh - 72px); background: linear-gradient(180deg, #E0C3FC 0%, #8EC5FC 100%);
      overflow: hidden;
    }
    #bubbles-canvas {
      display: block; width: 100%; height: 100%; touch-action: none; cursor: crosshair;
    }
    .game-back-bubbles {
      position: absolute; top: 20px; left: 20px; text-decoration: none;
      color: white; font-weight: 600; font-size: 1.1rem; display: flex; align-items: center; gap: 8px;
      background: rgba(0,0,0,0.2); padding: 8px 16px; border-radius: 20px; backdrop-filter: blur(4px);
      z-index: 10;
    }
    .score-overlay {
      position: absolute; top: 20px; right: 20px; z-index: 10;
      color: white; font-size: 1.2rem; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
  </style>
  <div class="game-container-bubbles">
    <a href="#/mindful-games" class="game-back-bubbles">← Back to Games</a>
    <div class="score-overlay">Bubbles Relieved: <span id="bubble-score">0</span></div>
    <canvas id="bubbles-canvas"></canvas>
  </div>
`;

function initBreathingGame() {
  const area = document.getElementById('breathing-area');
  const circle = document.getElementById('breathing-circle');
  const instruction = document.getElementById('breathing-instruction');
  const scoreSpan = document.getElementById('breath-count');
  if (!area || !circle) return;

  let isBreathingIn = false;
  let breaths = 0;
  let holdTimeout;

  const startInhale = (e) => {
    if(e.type !== 'touchstart' && e.button !== 0) return; // Only left click or touch
    isBreathingIn = true;
    circle.classList.add('expanding');
    circle.textContent = 'Inhale';
    instruction.textContent = 'Keep holding...';
    instruction.style.opacity = '1';
    
    // Suggest hold
    holdTimeout = setTimeout(() => {
      if(isBreathingIn) {
        circle.textContent = 'Release';
        instruction.textContent = 'Now gently release';
        instruction.style.color = '#34A853';
      }
    }, 4000);
  };

  const startExhale = () => {
    if(!isBreathingIn) return;
    clearTimeout(holdTimeout);
    isBreathingIn = false;
    circle.classList.remove('expanding');
    circle.textContent = 'Exhale';
    instruction.textContent = 'Click and hold to inhale again';
    instruction.style.color = '#555';
    breaths++;
    scoreSpan.textContent = breaths;
    setTimeout(() => {
        if(!isBreathingIn) circle.textContent = 'Hold';
    }, 4000); // Reset text after exhale duration
  };

  area.addEventListener('mousedown', startInhale);
  window.addEventListener('mouseup', startExhale);
  area.addEventListener('touchstart', (e) => { e.preventDefault(); startInhale(e); });
  window.addEventListener('touchend', startExhale);
  
  // Cleanup on hash change
  const cleanup = () => {
    window.removeEventListener('mouseup', startExhale);
    window.removeEventListener('touchend', startExhale);
    window.removeEventListener('hashchange', cleanup);
  };
  window.addEventListener('hashchange', cleanup);
}

function initBubblesGame() {
  const canvas = document.getElementById('bubbles-canvas');
  const scoreSpan = document.getElementById('bubble-score');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let bubbles = [];
  let score = 0;
  let animationRef;

  const resize = () => {
    width = canvas.parentElement.clientWidth;
    height = canvas.parentElement.clientHeight;
    canvas.width = width;
    canvas.height = height;
  };
  window.addEventListener('resize', resize);
  resize();

  class Bubble {
    constructor() {
      this.r = Math.random() * 30 + 15;
      this.x = Math.random() * (width - this.r * 2) + this.r;
      this.y = height + this.r;
      this.speedY = Math.random() * 1.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.alpha = Math.random() * 0.4 + 0.2;
      this.hue = Math.random() * 60 + 200; // Blue to purple range
      this.popped = false;
      this.popRadius = this.r;
      this.popAlpha = 1;
    }

    update() {
      if (this.popped) {
        this.popRadius += 2;
        this.popAlpha -= 0.05;
      } else {
        this.y -= this.speedY;
        this.x += this.speedX;
        // Float logic
        if(Math.random() > 0.95) this.speedX += (Math.random() - 0.5) * 0.2;
        
        // Reset if off top
        if (this.y + this.r < 0) {
           this.y = height + this.r;
           this.x = Math.random() * width;
        }
      }
    }

    draw(ctx) {
      if (this.popped) {
        if(this.popAlpha > 0) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.popRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `hsla(${this.hue}, 100%, 80%, ${this.popAlpha})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
      } else {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 100%, 85%, ${this.alpha})`;
        ctx.fill();
        ctx.strokeStyle = `hsla(${this.hue}, 100%, 75%, ${this.alpha + 0.2})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Highlight
        ctx.beginPath();
        ctx.arc(this.x - this.r * 0.3, this.y - this.r * 0.3, this.r * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fill();
      }
    }
  }

  // Create initial bubbles
  for(let i = 0; i < 20; i++) {
    const b = new Bubble();
    b.y = Math.random() * height; // scatter vertically initially
    bubbles.push(b);
  }

  const loop = () => {
    ctx.clearRect(0, 0, width, height);
    
    for(let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i];
      b.update();
      b.draw(ctx);
      if(b.popped && b.popAlpha <= 0) {
        bubbles.splice(i, 1);
        bubbles.push(new Bubble()); // Replenish
      }
    }
    
    animationRef = requestAnimationFrame(loop);
  };
  loop();

  const handleInteraction = (ex, ey) => {
     for(let i = bubbles.length - 1; i >= 0; i--) {
         const b = bubbles[i];
         if(!b.popped) {
             const dist = Math.hypot(b.x - ex, b.y - ey);
             if(dist < b.r + 10) { // generous hitbox
                 b.popped = true;
                 score++;
                 scoreSpan.textContent = score;
                 // pop sound simulation via visual only
             }
         }
     }
  };

  const onDown = (e) => handleInteraction(e.offsetX, e.offsetY);
  canvas.addEventListener('mousedown', onDown);
  
  const onTouch = (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    Array.from(e.changedTouches).forEach(touch => {
       handleInteraction(touch.clientX - rect.left, touch.clientY - rect.top);
    });
  };
  canvas.addEventListener('touchstart', onTouch);

  const cleanup = () => {
     window.removeEventListener('resize', resize);
     cancelAnimationFrame(animationRef);
     canvas.removeEventListener('mousedown', onDown);
     canvas.removeEventListener('touchstart', onTouch);
     window.removeEventListener('hashchange', cleanup);
  };
  window.addEventListener('hashchange', cleanup);
}

function initZenSand() {
  const canvas = document.getElementById('sand-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  let width, height;
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  const resize = () => {
    width = canvas.parentElement.clientWidth;
    height = canvas.parentElement.clientHeight;
    canvas.width = width;
    canvas.height = height;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 15;
  };
  window.addEventListener('resize', resize);
  resize();

  const drawSandLine = (x, y) => {
    ctx.globalCompositeOperation = 'source-over';
    
    // Draw thick dark line for depth
    ctx.strokeStyle = 'rgba(180, 150, 100, 0.4)';
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Draw bright highlight for ridge
    ctx.strokeStyle = 'rgba(255, 250, 220, 0.5)';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(lastX - 2, lastY - 2);
    ctx.lineTo(x - 2, y - 2);
    ctx.stroke();

    lastX = x;
    lastY = y;
  };

  const fadeEffect = () => {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(238, 220, 154, 0.015)'; // Very slow fade to base color
    ctx.fillRect(0, 0, width, height);
    if(canvas.isConnected) {
      requestAnimationFrame(fadeEffect);
    }
  };
  fadeEffect(); // start fading loop

  const getPos = (e) => {
    const rect = canvas.getBoundingClientRect();
    if(e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e) => {
    e.preventDefault();
    isDrawing = true;
    const pos = getPos(e);
    lastX = pos.x;
    lastY = pos.y;
  };

  const moveDraw = (e) => {
    if(!isDrawing) return;
    e.preventDefault();
    const pos = getPos(e);
    // distance check to prevent too many points
    if(Math.hypot(pos.x - lastX, pos.y - lastY) > 2) {
       drawSandLine(pos.x, pos.y);
    }
  };

  const endDraw = () => isDrawing = false;

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', moveDraw);
  window.addEventListener('mouseup', endDraw);
  
  canvas.addEventListener('touchstart', startDraw, {passive: false});
  canvas.addEventListener('touchmove', moveDraw, {passive: false});
  window.addEventListener('touchend', endDraw);

  const clearBtn = document.getElementById('sand-clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#EEDC9A'; // immediate clear
      ctx.fillRect(0, 0, width, height);
    });
  }

  const cleanup = () => {
    window.removeEventListener('resize', resize);
    window.removeEventListener('mouseup', endDraw);
    window.removeEventListener('touchend', endDraw);
    window.removeEventListener('hashchange', cleanup);
  };
  window.addEventListener('hashchange', cleanup);
}

function initLotusPond() {
  const canvas = document.getElementById('lotus-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let entities = [];
  let animationRef;

  const resize = () => {
    width = canvas.parentElement.clientWidth;
    height = canvas.parentElement.clientHeight;
    canvas.width = width;
    canvas.height = height;
  };
  window.addEventListener('resize', resize);
  resize();

  class Ripple {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 0;
      this.maxRadius = Math.random() * 50 + 100;
      this.opacity = 1;
      this.speed = Math.random() * 0.5 + 0.5;
    }
    update() {
      this.radius += this.speed;
      this.opacity = 1 - (this.radius / this.maxRadius);
    }
    draw(ctx) {
      if(this.opacity <= 0) return;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(150, 200, 255, ${this.opacity * 0.5})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  class Lotus {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.scale = 0;
      this.opacity = 0;
      this.life = 0;
      this.maxLife = 300; // 5 seconds at 60fps
      this.rotation = Math.random() * Math.PI * 2;
      this.hue = Math.random() * 40 + 320; // pink to magenta
    }
    update() {
      this.life++;
      if(this.life < 30) {
        this.scale += 0.03;
        this.opacity += 0.03;
      } else if (this.life > this.maxLife - 60) {
        this.opacity -= 0.02; // fade out
      }
    }
    draw(ctx) {
      if(this.opacity <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.scale(this.scale, this.scale);
      ctx.globalAlpha = this.opacity;
      
      // Draw petals
      ctx.fillStyle = `hsl(${this.hue}, 80%, 70%)`;
      for(let i=0; i<8; i++) {
        ctx.rotate(Math.PI / 4);
        ctx.beginPath();
        ctx.ellipse(0, 20, 10, 30, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = `hsl(${this.hue}, 90%, 85%)`;
        ctx.stroke();
      }
      // center
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#FFE066';
      ctx.fill();
      
      ctx.restore();
    }
  }

  const loop = () => {
    ctx.fillStyle = 'rgba(28, 43, 54, 0.2)'; // trail effect
    ctx.fillRect(0, 0, width, height);

    for(let i = entities.length - 1; i >= 0; i--) {
      const e = entities[i];
      e.update();
      e.draw(ctx);
      if(e.opacity <= 0 || (e.life && e.life >= e.maxLife)) {
        entities.splice(i, 1);
      }
    }
    animationRef = requestAnimationFrame(loop);
  };
  loop();

  const spawn = (x, y) => {
    entities.push(new Ripple(x, y));
    setTimeout(() => entities.push(new Ripple(x, y)), 400); // 2nd ripple
    entities.push(new Lotus(x, y));
  };

  const handleInteraction = (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    if(e.touches) {
      Array.from(e.changedTouches).forEach(t => spawn(t.clientX - rect.left, t.clientY - rect.top));
    } else {
      spawn(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  canvas.addEventListener('mousedown', handleInteraction);
  canvas.addEventListener('touchstart', handleInteraction, {passive: false});

  const cleanup = () => {
    window.removeEventListener('resize', resize);
    canvas.removeEventListener('mousedown', handleInteraction);
    canvas.removeEventListener('touchstart', handleInteraction);
    cancelAnimationFrame(animationRef);
    window.removeEventListener('hashchange', cleanup);
  };
  window.addEventListener('hashchange', cleanup);
}

const SleepPage_sleepcasts = createMediaPage('SLEEPCASTS', 'Sleepcasts', '#D1C4E9', '🌙', 'Stories to dream to.', '#/sleep');
const SleepPage_sleep_music = createMediaPage('SLEEP MUSIC', 'Sleep Music', '#D1C4E9', '🎶', 'Drift off to peaceful sounds.', '#/sleep');
const SleepPage_wind_downs = createMediaPage('WIND DOWNS', 'Wind Downs', '#D1C4E9', '🕯️', 'Prepare your mind for rest.', '#/sleep');
const SleepPage_rainday_antiques = createMediaPage('NIGHTTIME STORIES', 'Rainday Antiques', '#D1C4E9', '🕰️', 'A wander through a cozy shop.', '#/sleep');
const SleepPage_midnight_launderette = createMediaPage('NIGHTTIME STORIES', 'Midnight Launderette', '#D1C4E9', '🧺', 'The hum of tumbling clothes.', '#/sleep');
const SleepPage_cat_marina = createMediaPage('NIGHTTIME STORIES', 'Cat Marina', '#D1C4E9', '⛵', 'Boats bobbing and felines sleeping.', '#/sleep');
const SleepPage_goodnight_moon = createMediaPage('KIDS SLEEP', 'Goodnight Moon', '#D1C4E9', '🌜', 'Classic tales narrated softly.', '#/sleep');
const SleepPage_breathing_elmo = createMediaPage('KIDS SLEEP', 'Breathing with Elmo', '#D1C4E9', '🎈', 'Fun exercises for little ones.', '#/sleep');
const SleepPage_sleepy_jungle = createMediaPage('KIDS SLEEP', 'Sleepy Jungle', '#D1C4E9', '🐒', 'Animal friends go to rest.', '#/sleep');
const FocusPage_focus_music = createMediaPage('FOCUS ENHANCERS', 'Focus Music', '#FFE0B2', '🎧', 'Beats to boost productivity.', '#/focus');
const FocusPage_quick_breaks = createMediaPage('FOCUS ENHANCERS', 'Quick Breaks', '#FFE0B2', '⏱️', 'Reset your mind before the next task.', '#/focus');
const FocusPage_exam_prep = createMediaPage('FOCUS ENHANCERS', 'Exam Prep', '#FFE0B2', '📚', 'Calm those testing nerves.', '#/focus');
const FocusPage_melody_flow = createMediaPage('SOUNDSCAPES', 'Melody Flow', '#FFE0B2', '🎼', 'Soft melodic loops for focused calm.', '#/focus');
const FocusPage_coffee_shop = createMediaPage('SOUNDSCAPES', 'Coffee Shop', '#FFE0B2', '☕', 'The hum of a busy café.', '#/focus');
const FocusPage_forest_ambience = createMediaPage('SOUNDSCAPES', 'Forest Ambience', '#FFE0B2', '🌲', 'Nature sounds to clear the mind.', '#/focus');
const FocusPage_desk_stretches = createMediaPage('MINDFUL MOVEMENT', 'Desk Stretches', '#FFE0B2', '💪', 'Relieve neck and shoulder tension.', '#/focus');
const FocusPage_walking_breaks = createMediaPage('MINDFUL MOVEMENT', 'Walking Breaks', '#FFE0B2', '🚶‍♂️', 'A guided mind-clearing stroll.', '#/focus');
const FocusPage_eye_rest = createMediaPage('MINDFUL MOVEMENT', 'Eye Rest', '#FFE0B2', '👁️', 'Exercises for screen fatigue.', '#/focus');
const AnxietyPage_panic_sos = createMediaPage('ANXIETY', 'Panic SOS', '#E8F5E9', '🛟', 'Quick relief for intense anxiety.', '#/anxiety');
const AnxietyPage_letting_go_of_stress = createMediaPage('ANXIETY', 'Letting Go of Stress', '#E8F5E9', '🎈', 'Release tension from mind and body.', '#/anxiety');

const Onboarding = `
  <section class="onboarding-section" style="padding: 60px 0; min-height: 80vh; background-color: #FAFAFA;">
    <div class="container" style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 24px; box-shadow: var(--shadow-md);">
      <div id="onboarding-dynamic-content"></div>
    </div>
  </section>
`;

window.OnboardingFlow = {
  step: 1,
  category: null,
  answers: [],
  questions: {
    sleep: [
      { text: "How many hours do you usually sleep?", options: ["Less than 5", "5-7 hours", "More than 7 hours"] },
      { text: "Do you wake up frequently during the night?", options: ["Always", "Sometimes", "Rarely"] },
      { text: "Is it hard to fall asleep initially?", options: ["Very hard", "Somewhat hard", "Not at all"] }
    ],
    anxiety: [
      { text: "How often do you feel overwhelmed?", options: ["Daily", "Weekly", "Rarely"] },
      { text: "Do you experience physical symptoms like a racing heart?", options: ["Often", "Occasionally", "Never"] },
      { text: "Are your worries difficult to control?", options: ["Very difficult", "Sometimes", "I can manage them"] }
    ],
    stress: [
      { text: "Do you feel tense or have muscle pain often?", options: ["Yes, constantly", "Sometimes", "Rarely"] },
      { text: "Is your workload manageable?", options: ["Too heavy", "Just right", "Light"] },
      { text: "How often do you have time for yourself?", options: ["Never", "Once a week", "Every day"] }
    ]
  },
  
  selectCategory: (cat) => {
    window.OnboardingFlow.category = cat;
    window.OnboardingFlow.step = 2;
    window.OnboardingFlow.render();
  },

  selectAnswer: (qIndex, ansIndex) => {
    window.OnboardingFlow.answers[qIndex] = ansIndex;
    // Highlight selected button
    const buttons = document.querySelectorAll('.answer-btn-' + qIndex);
    buttons.forEach((btn, idx) => {
      if (idx === ansIndex) {
        btn.style.borderColor = 'var(--color-primary)';
        btn.style.background = '#E4F1FF';
      } else {
        btn.style.borderColor = '#EAEAEA';
        btn.style.background = 'white';
      }
    });
  },

  submitAnswers: () => {
    if (window.OnboardingFlow.answers.filter(a => a !== undefined).length < 3) {
      alert("Please answer all questions before proceeding.");
      return;
    }
    window.OnboardingFlow.step = 3;
    window.OnboardingFlow.render();
  },

  finish: () => {
    window.location.hash = '#/';
  },

  render: () => {
    const container = document.getElementById('onboarding-dynamic-content');
    if (!container) return;

    if (window.OnboardingFlow.step === 1) {
      container.innerHTML = `
        <h2 style="font-size: 2rem; margin-bottom: 16px; text-align: center;">Welcome! Let's personalize your experience.</h2>
        <p style="color: var(--color-text-muted); margin-bottom: 32px; text-align: center; font-size: 1.1rem;">What would you like to focus on first?</p>
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <button class="btn btn-outline" style="padding: 20px; font-size: 1.2rem; text-align: left; border-radius: 16px;" onclick="window.OnboardingFlow.selectCategory('sleep')">💤 Improving my sleep</button>
          <button class="btn btn-outline" style="padding: 20px; font-size: 1.2rem; text-align: left; border-radius: 16px;" onclick="window.OnboardingFlow.selectCategory('anxiety')">🌱 Managing anxiety</button>
          <button class="btn btn-outline" style="padding: 20px; font-size: 1.2rem; text-align: left; border-radius: 16px;" onclick="window.OnboardingFlow.selectCategory('stress')">😌 Reducing stress</button>
        </div>
      `;
    } else if (window.OnboardingFlow.step === 2) {
      const qList = window.OnboardingFlow.questions[window.OnboardingFlow.category];
      let questionsHTML = '';
      qList.forEach((q, qIndex) => {
        questionsHTML += `
          <div style="margin-bottom: 32px;">
            <h3 style="font-size: 1.3rem; margin-bottom: 16px;">${qIndex + 1}. ${q.text}</h3>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              ${q.options.map((opt, oIndex) => `<button class="btn btn-outline answer-btn-${qIndex}" style="text-align: left; padding: 16px; border-radius: 12px; transition: all 0.2s;" onclick="window.OnboardingFlow.selectAnswer(${qIndex}, ${oIndex})">${opt}</button>`).join('')}
            </div>
          </div>
        `;
      });

      container.innerHTML = `
        <h2 style="font-size: 1.8rem; margin-bottom: 24px; text-align: center;">A few quick questions</h2>
        ${questionsHTML}
        <button class="btn btn-primary" style="width: 100%; padding: 16px; font-size: 1.2rem; border-radius: 12px;" onclick="window.OnboardingFlow.submitAnswers()">See My Plan</button>
      `;
    } else if (window.OnboardingFlow.step === 3) {
      let feedback = "";
      let suggestion = "";
      let link = "";

      if (window.OnboardingFlow.category === 'sleep') {
        feedback = "It looks like your sleep could use some support. Getting quality rest is crucial for your well-being.";
        suggestion = "We recommend starting with our Sleepcasts or relaxing white noise to help you drift off easier.";
        link = '<a href="#/sleep" class="btn btn-primary" style="display: block; margin-bottom: 16px; padding: 16px; border-radius: 12px; text-align: center; text-decoration: none;">Explore Sleep Library</a>';
      } else if (window.OnboardingFlow.category === 'anxiety') {
        feedback = "Dealing with anxiety can be exhausting. Recognizing it is the first step toward managing it.";
        suggestion = "Try our 3-minute breathing exercise whenever you feel overwhelmed to help regulate your nervous system.";
        link = '<a href="#/exercise-3min" class="btn btn-primary" style="display: block; margin-bottom: 16px; padding: 16px; border-radius: 12px; text-align: center; text-decoration: none;">Try Breathing Exercise</a>';
      } else {
        feedback = "You're carrying a lot of stress right now. It's important to carve out moments of relief.";
        suggestion = "Our Daily De-stress routines are designed to help you release tension throughout the day.";
        link = '<a href="#/stress" class="btn btn-primary" style="display: block; margin-bottom: 16px; padding: 16px; border-radius: 12px; text-align: center; text-decoration: none;">View Stress Tools</a>';
      }

      container.innerHTML = `
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="font-size: 4rem; margin-bottom: 16px;">✨</div>
          <h2 style="font-size: 2rem; margin-bottom: 16px;">Your Personalized Plan</h2>
          <p style="font-size: 1.1rem; color: var(--color-text-dark); margin-bottom: 16px;">${feedback}</p>
          <p style="color: var(--color-text-muted); margin-bottom: 32px;">${suggestion}</p>
        </div>
        ${link}
        <button class="btn btn-outline" style="width: 100%; padding: 16px; border-radius: 12px;" onclick="window.OnboardingFlow.finish()">Go to Dashboard</button>
      `;
    }
  }
};

// --- Simple Router ---
const routes = {
  '/': Home,
  '/sleep/sleepcasts': SleepPage_sleepcasts,
  '/sleep/sleep-music': SleepPage_sleep_music,
  '/sleep/wind-downs': SleepPage_wind_downs,
  '/sleep/rainday-antiques': SleepPage_rainday_antiques,
  '/sleep/midnight-launderette': SleepPage_midnight_launderette,
  '/sleep/cat-marina': SleepPage_cat_marina,
  '/sleep/goodnight-moon': SleepPage_goodnight_moon,
  '/sleep/breathing-elmo': SleepPage_breathing_elmo,
  '/sleep/sleepy-jungle': SleepPage_sleepy_jungle,
  '/focus/focus-music': FocusPage_focus_music,
  '/focus/quick-breaks': FocusPage_quick_breaks,
  '/focus/exam-prep': FocusPage_exam_prep,
  '/focus/melody-flow': FocusPage_melody_flow,
  '/focus/coffee-shop': FocusPage_coffee_shop,
  '/focus/forest-ambience': FocusPage_forest_ambience,
  '/focus/desk-stretches': FocusPage_desk_stretches,
  '/focus/walking-breaks': FocusPage_walking_breaks,
  '/focus/eye-rest': FocusPage_eye_rest,

  '/meditation': Meditation,
  '/sleep': Sleep,
  '/focus': Focus,
  '/articles': Articles,
  '/articles/daily-meditation': ArticleDailyMeditation,
  '/articles/sleep-reasons': ArticleSleepReasons,
  '/articles/stress-burnout': ArticleStressBurnout,
  '/articles/better-communication': ArticleBetterCommunication,
  '/articles/mindful-parenting': ArticleMindfulParenting,
  '/articles/difficult-colleagues': ArticleDifficultColleagues,
  '/assessment': Assessment,
  '/onboarding': Onboarding,
  '/login': LoginSignup('Log in'),
  '/signup': LoginSignup('Sign up for free'),
  '/anxiety': Anxiety,
  '/anxiety/panic-sos': AnxietyPage_panic_sos,
  '/anxiety/letting-go-of-stress': AnxietyPage_letting_go_of_stress,
  '/stress': Stress,
  '/about': About,
  '/careers': Careers,
  '/press': Press,

  // Exhaustive Options - "What we offer"
  '/online-therapy': OnlineTherapy,
  '/mindfulness': Mindfulness,
  '/coaching': Coaching,
  '/ebb-ai': EbbAI,

  // Exhaustive Options - "How we help"
  '/sleep-better': SleepBetter,
  '/mental-health': MentalHealth,
  '/mindful-families': MindfulFamilies,

  // Exhaustive Options - "Explore our library"
  '/new-popular': NewPopular,
  '/guided-courses': GuidedCourses,
  '/beginning-meditation': BeginningMeditation,
  '/calming-anxiety': CalmingAnxiety,
  '/mindful-parenting': MindfulParenting,
  '/mindfulness-work': MindfulnessWork,
  '/sleep-music': SleepMusic,
  '/white-noise': WhiteNoise,
  '/exercise-3min': Exercise3Min,
  '/relief-sunday': ReliefSunday,
  '/relief-social': ReliefSocial,
  '/relief-flying': ReliefFlying,
  '/mindful-games': MindfulGames,
  '/game/breathing': GameBreathing,
  '/game/bubbles': GameBubbles,
  '/game/zensand': GameZenSand,
  '/game/lotus': GameLotus
};

const router = () => {
  // Get hash path, default to '/'
  let path = window.location.hash.slice(1) || '/';

  if (path !== '/white-noise' && currentNoiseType) {
    stopNoisePlayback();
  }

  // Clean up nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.style.color = 'var(--color-text-dark)';
    link.style.borderBottom = 'none';
  });

  // Highlight active link if it exists
  const activeLinkId = `nav-${path.slice(1)}`;
  const activeLink = document.getElementById(activeLinkId);
  if (activeLink) {
    activeLink.style.color = 'var(--color-primary)';
  }

  // Find content, default to home if not found
  const content = routes[path] || Home;

  // Inject
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.innerHTML = content;
    // Scroll to top on navigation
    window.scrollTo(0, 0);

    // Initialize Chart.js if on Home route
    if (path === '/' || path === '') {
      const ctx = document.getElementById('moodChart');
      if (ctx) {
        if (window.moodChartInstance) {
          window.moodChartInstance.destroy();
        }
        window.moodChartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              label: 'Mood Level (higher is better)',
              data: window.moodData,
              fill: true,
              backgroundColor: 'rgba(52, 168, 83, 0.1)',
              borderColor: '#34A853',
              borderWidth: 3,
              tension: 0.4,
              pointBackgroundColor: '#ffffff',
              pointBorderColor: '#34A853',
              pointBorderWidth: 2,
              pointRadius: 6,
              pointHoverRadius: 8
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 5,
                ticks: {
                  stepSize: 1,
                  display: false
                },
                grid: {
                  borderDash: [5, 5]
                }
              },
              x: {
                grid: {
                  display: false
                }
              }
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                backgroundColor: '#1A1A3A',
                titleFont: { family: 'Outfit', size: 14 },
                bodyFont: { family: 'Outfit', size: 14 },
                padding: 12,
                displayColors: false,
                callbacks: {
                  label: function (context) {
                    const moods = ['Terrible', 'Bad', 'Okay', 'Good', 'Great'];
                    return 'Mood: ' + moods[context.raw - 1];
                  }
                }
              }
            }
          }
        });
        
        setTimeout(() => {
           const val = window.moodData[6];
           let btnIndex = val - 1;
           const buttons = document.querySelectorAll('.mood-selector .mood-btn');
           if (buttons[btnIndex]) {
             window.setMood(val, buttons[btnIndex]);
           }
        }, 0);
      }
    }

    // Initialize Auth routes
    if (path === '/login' || path === '/signup') {
      window.AuthFlow.mode = path === '/login' ? 'login' : 'signup';
      window.AuthFlow.step = 1;
      window.AuthFlow.render();
    }

    // Initialize Onboarding route
    if (path === '/onboarding') {
      window.OnboardingFlow.step = 1;
      window.OnboardingFlow.category = null;
      window.OnboardingFlow.answers = [];
      window.OnboardingFlow.render();
    }

    // Initialize Assessment route
    if (path === '/assessment') {
      renderAssessment();
    }

    // Initialize Stress tools route
    if (path === '/stress') {
      initStressTools();
    }

    // Initialize Sleep Music route
    if (path === '/sleep-music') {
      initSleepMusic();
    }

    // Initialize Wind & Rain route
    if (path === '/white-noise') {
      initWindRain();
    }

    // Initialize Games
    if (path === '/game/breathing') {
      initBreathingGame();
    }
    if (path === '/game/bubbles') {
      initBubblesGame();
    }
    if (path === '/game/zensand') {
      initZenSand();
    }
    if (path === '/game/lotus') {
      initLotusPond();
    }

    // Initialize Mindfulness at Work route
    if (path === '/mindfulness-work') {
      initMindfulnessWork();
    }

    // Initialize Ebb AI Chat
    if (path === '/ebb-ai') {
      const input = document.getElementById('ebb-chat-input');
      const sendBtn = document.getElementById('ebb-chat-send');
      const messagesContainer = document.getElementById('ebb-chat-messages');
    }

    // Initialize Ebb AI Chat
    if (path === '/ebb-ai') {
      const input = document.getElementById('ebb-chat-input');
      const sendBtn = document.getElementById('ebb-chat-send');
      const messagesContainer = document.getElementById('ebb-chat-messages');

      let chatHistory = [];

      const addMessage = (text, isUser) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;

        let styleStrStr = "";
        let timeAlignStr = "";
        let timeColorStr = "";

        if (isUser) {
          styleStrStr = "align-self: flex-end; background: var(--color-primary); color: white; padding: 16px; border-radius: 16px 16px 4px 16px; box-shadow: var(--shadow-sm); max-width: 80%;";
          timeAlignStr = "text-align: right;";
          timeColorStr = "#E6F7F0";
        } else {
          styleStrStr = "align-self: flex-start; background: white; padding: 16px; border-radius: 16px 16px 16px 4px; box-shadow: var(--shadow-sm); max-width: 80%;";
          timeAlignStr = "text-align: left;";
          timeColorStr = "#aaa";
        }

        msgDiv.style.cssText = styleStrStr;
        
        // Basic escaping and formatting for text
        const formattedText = text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\n/g, "<br/>");

        msgDiv.innerHTML = `
          <div style="margin: 0; line-height: 1.5; font-size: 0.95rem;">${formattedText}</div>
          <span class="message-time" style="font-size: 0.75rem; color: ${timeColorStr}; margin-top: 8px; display: block; ${timeAlignStr}">Just now</span>
        `;

        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      };

      const getLocalEbbResponse = (userText) => {
        const lower = userText.toLowerCase();

        if (!lower.trim()) {
          return "Can you share a little more? I'm here to listen.";
        }

        if (/(hi|hello|hey|good morning|good evening|greetings)/i.test(userText)) {
          return "Hey! How are you feeling today?";
        }

        if (/(sad|down|depressed|unhappy)/i.test(userText)) {
          return "I'm sorry you're feeling that way. Do you want to tell me what happened so we can explore it together?";
        }

        if (/(anxious|anxiety|nervous|scared)/i.test(userText)) {
          return "That sounds stressful. Would you like a quick grounding exercise to ease the tension?";
        }

        if (/(happy|good|great|fantastic|awesome)/i.test(userText)) {
          return "That's wonderful to hear! What's one thing that made your day feel good?";
        }

        if (userText.endsWith('?')) {
          return "Great question! Let's unpack that and explore your options together.";
        }

        const defaultResponses = [
          "I hear you. Can you say more about that?",
          "Thanks for sharing. What would help you most right now?",
          "That sounds meaningful. What do you notice in your body as you talk about it?"
        ];
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
      };

      const getOpenAIResponse = async (userText) => {
        const openaiKey = localStorage.getItem('OPENAI_API_KEY');
        if (!openaiKey) {
          throw new Error('OpenAI API key not found. Save OPENAI_API_KEY in localStorage.');
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'You are a compassionate mental wellness chatbot named Ebb that provides supportive guidance and practical strategies.' },
              ...chatHistory,
              { role: 'user', content: userText }
            ],
            temperature: 0.8,
            max_tokens: 350
          })
        });

        if (!response.ok) {
          const details = await response.text();
          throw new Error(`OpenAI request failed: ${response.status} ${details}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content?.trim() || 'I had trouble generating a complete answer. Can you rephrase?';
      };

      const handleSend = async () => {
        const text = input.value.trim();
        if (!text) return;

        addMessage(text, true);
        chatHistory.push({ role: 'user', content: text });

        input.value = '';
        input.disabled = true;
        sendBtn.disabled = true;

        // Typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message typing-indicator-container';
        typingDiv.style.cssText = "align-self: flex-start; background: white; padding: 16px; border-radius: 16px 16px 16px 4px; box-shadow: var(--shadow-sm); max-width: 80%;";
        typingDiv.innerHTML = `
            <div class="typing-indicator" style="display: flex; gap: 4px; align-items: center; height: 20px;">
              <span style="width: 6px; height: 6px; background: #ccc; border-radius: 50%; animation: bounce 1.4s infinite ease-in-out both;"></span>
              <span style="width: 6px; height: 6px; background: #ccc; border-radius: 50%; animation: bounce 1.4s infinite ease-in-out both; animation-delay: 0.2s;"></span>
              <span style="width: 6px; height: 6px; background: #ccc; border-radius: 50%; animation: bounce 1.4s infinite ease-in-out both; animation-delay: 0.4s;"></span>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
          let finalResponse;
          try {
            finalResponse = await getOpenAIResponse(text);
          } catch (openaiError) {
            console.warn('OpenAI fallback:', openaiError);
            finalResponse = getLocalEbbResponse(text);
          }

          // mimic typing delay for user experience
          await new Promise(resolve => setTimeout(resolve, 400));

          typingDiv.remove();
          addMessage(finalResponse, false);
          chatHistory.push({ role: 'assistant', content: finalResponse });

        } catch (error) {
          console.error('Chat error:', error);
          typingDiv.remove();
          addMessage("I'm sorry, something went wrong internally. Please try again.", false);

        } finally {
          input.disabled = false;
          sendBtn.disabled = false;
          input.focus();
        }
      };

      sendBtn.addEventListener('click', handleSend);
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !input.disabled) handleSend();
      });
    }

    // Initialize 3-Min Exercise Route
    if (path === '/exercise-3min') {
       window.exerciseStep = -1; // -1 because nextExerciseStep adds 1, making the first display 0
       window.nextExerciseStep(); // Show the very first frame correctly initialized
    }
  }
};

const stressToolDefinitions = {
  'daily-de-stress': {
    title: 'Daily De-stress',
    description: 'Quick daily reset routines to lower tension and prevent overwhelm.',
    actions: [
      'Take a 2-minute walk and breathe gently while observing your surroundings.',
      'Do 10 slow shoulder circles and stretch your spine 3 times.',
      'Write down one thing you completed today in a journal.'
    ]
  },
  'unwind': {
    title: 'Unwind',
    description: 'Transition tools for work-to-home, or bedtime routines.',
    actions: [
      'Turn off screens 30 minutes before you want to relax.',
      'Play soft music or white noise for 10 minutes.',
      'Close your eyes and do a body scan from toes to head.'
    ]
  },
  'breathing-break': {
    title: 'Breathing Break',
    description: 'A structured breathing practice to calm the nervous system.',
    actions: [
      'Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds.',
      'Repeat for 5 cycles, then notice your heart rate.',
      'Use a timer or app and keep the breathing smooth.'
    ]
  },
  'mood-journaling': {
    title: 'Mood Journaling',
    description: 'Track what triggers stress and what makes you feel better.',
    actions: [
      'Write 3 short sentences about your current mood.',
      'List 2 positives and 2 challenges from the last 24 hours.',
      'Set one small intention for with how you want to feel next.'
    ]
  },
  'mindful-movement': {
    title: 'Mindful Movement',
    description: 'Gentle motion for calming physical tension and increasing presence.',
    actions: [
      'Try 5-10 minutes of slow, focused walking.',
      'Do a simple yoga stretch for neck, shoulders, and back.',
      'Use an app or timer to keep movement intentional, not rushed.'
    ]
  },
  'sleep-prep': {
    title: 'Sleep Prep',
    description: 'Create a reliable wind-down routine for better sleep quality.',
    actions: [
      'Set a consistent bedtime and wake time (even weekends).',
      'Avoid caffeine after 3 PM and blue light 60 minutes pre-bed.',
      'Do a calming breathing or meditation segment before lying down.'
    ]
  }
};

const STRESS_TOOL_STORAGE_KEY = 'wellmind-stress-tool-progress';

function loadStressToolProgress() {
  try {
    return JSON.parse(localStorage.getItem(STRESS_TOOL_STORAGE_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveStressToolProgress(progress) {
  localStorage.setItem(STRESS_TOOL_STORAGE_KEY, JSON.stringify(progress));
}

function initStressTools() {
  const grid = document.getElementById('stress-tool-grid');
  const detailPanel = document.getElementById('stress-tool-details');
  const title = document.getElementById('stress-tool-title');
  const description = document.getElementById('stress-tool-description');
  const progressText = document.getElementById('stress-tool-progress');
  const actionsList = document.getElementById('stress-tool-actions');
  const clearBtn = document.getElementById('stress-tool-clear');
  const saveBtn = document.getElementById('stress-tool-save');
  const emailBtn = document.getElementById('stress-tool-email');

  if (!grid || !detailPanel || !title || !description || !progressText || !actionsList || !clearBtn || !saveBtn || !emailBtn) return;

  let toolProgress = loadStressToolProgress();
  const dashboard = document.getElementById('stress-tool-dashboard');
  const dashboardText = document.getElementById('stress-tool-dashboard-text');
  const dashboardList = document.getElementById('stress-tool-dashboard-list');
  const resetAllBtn = document.getElementById('stress-tool-reset-all');

  const renderDashboard = () => {
    if (!dashboard || !dashboardText || !dashboardList || !resetAllBtn) return;

    const totalActions = Object.values(stressToolDefinitions).reduce((sum, tool) => sum + tool.actions.length, 0);
    let completedActions = 0;

    const items = Object.entries(stressToolDefinitions).map(([id, tool]) => {
      const done = Array.isArray(toolProgress[id]) ? new Set(toolProgress[id]).size : 0;
      completedActions += Math.min(done, tool.actions.length);
      return `<li>${tool.title}: ${Math.min(done, tool.actions.length)} / ${tool.actions.length}</li>`;
    });

    const percent = totalActions ? Math.round((completedActions / totalActions) * 100) : 0;

    dashboardText.textContent = `Overall completed ${completedActions} of ${totalActions} items (${percent}%).`;
    dashboardList.innerHTML = items.join('');
    dashboard.style.display = 'block';
  };

  if (dashboard && dashboardText && dashboardList && resetAllBtn) {
    resetAllBtn.onclick = () => {
      toolProgress = {};
      saveStressToolProgress(toolProgress);
      renderDashboard();
      alert('All tool progress has been reset.');
    };
  }

  const showTool = (id) => {
    const tool = stressToolDefinitions[id];
    if (!tool) return;

    const completedActions = new Set(toolProgress[id] || []);

    title.textContent = tool.title;
    description.textContent = tool.description;
    progressText.textContent = `Completed: ${completedActions.size} of ${tool.actions.length}`;

    const isDaily = id === 'daily-de-stress';
    actionsList.innerHTML = tool.actions.map((action, idx) => {
      const checked = completedActions.has(idx);
      return `<li style="margin-bottom: 10px;"><label style="display:flex; align-items:center; gap: 8px;"><input type="checkbox" data-index="${idx}" ${checked ? 'checked' : ''}>${action}</label></li>`;
    }).join('');

    if (isDaily) {
      actionsList.insertAdjacentHTML('beforeend', `
        <li style="margin-top:16px; border-top:1px dashed #ccc; padding-top: 14px;">
          <div style="display:flex; align-items:center; justify-content:space-between; gap: 12px;">
            <span style="font-weight:bold;">2-Minute Reset Session</span>
            <span id="daily-reset-timer-status" style="font-weight:600;color:#3F51B5;">Ready</span>
          </div>
          <p style="margin:8px 0 10px; color:#555;">Follow along with a short breathing and movement sequence.</p>
          <button id="daily-reset-start" class="btn btn-primary" style="margin-right:8px;">Start Reset</button>
          <button id="daily-reset-stop" class="btn btn-outline" disabled>Stop</button>
        </li>
      `);
    }

    detailPanel.style.display = 'block';

    grid.querySelectorAll('.library-card').forEach((card) => {
      card.style.border = card.dataset.tool === id ? '2px solid var(--color-primary)' : '1px solid #EAEAEA';
      card.style.transform = card.dataset.tool === id ? 'scale(1.02)' : 'scale(1)';
    });

    const checkboxHandlers = () => {
      const checkedSet = new Set();
      actionsList.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
        const idx = Number(checkbox.dataset.index);
        if (checkbox.checked) checkedSet.add(idx);
        checkbox.addEventListener('change', () => {
          if (checkbox.checked) checkedSet.add(idx);
          else checkedSet.delete(idx);
          toolProgress[id] = Array.from(checkedSet);
          saveStressToolProgress(toolProgress);
          progressText.textContent = `Completed: ${checkedSet.size} of ${tool.actions.length}`;
        });
      });
      return checkedSet;
    };

    const checkedSet = checkboxHandlers();

    if (isDaily) {
      const startBtn = document.getElementById('daily-reset-start');
      const stopBtn = document.getElementById('daily-reset-stop');
      const statusSpan = document.getElementById('daily-reset-timer-status');
      let timerId = null;
      let remaining = 120;

      const formatTime = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2, '0')}`;

      const updateTimerStatus = () => {
        if (statusSpan) statusSpan.textContent = `Time left: ${formatTime(remaining)}`;
      };

      const endSession = () => {
        clearInterval(timerId);
        timerId = null;
        if (statusSpan) statusSpan.textContent = 'Complete!';
        stopBtn.disabled = true;
        startBtn.disabled = false;
        checkedSet.add(tool.actions.length - 1); // mark last item as complete (optional)
        toolProgress[id] = Array.from(checkedSet);
        saveStressToolProgress(toolProgress);
        renderDashboard();
      };

      startBtn.addEventListener('click', () => {
        if (timerId) return;
        remaining = 120;
        updateTimerStatus();
        startBtn.disabled = true;
        stopBtn.disabled = false;

        timerId = setInterval(() => {
          remaining -= 1;
          updateTimerStatus();
          if (remaining <= 0) {
            endSession();
          }
        }, 1000);
      });

      stopBtn.addEventListener('click', () => {
        if (timerId) {
          clearInterval(timerId);
          timerId = null;
          if (statusSpan) statusSpan.textContent = 'Stopped';
          stopBtn.disabled = true;
          startBtn.disabled = false;
        }
      });
    }

    saveBtn.onclick = () => {
      toolProgress[id] = Array.from(actionsList.querySelectorAll('input[type="checkbox"]'))
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => Number(checkbox.dataset.index));
      saveStressToolProgress(toolProgress);
      renderDashboard();
      alert('Progress saved.');
    };

    emailBtn.onclick = () => {
      const completed = Array.from(actionsList.querySelectorAll('input[type="checkbox"]:checked')).map((checkbox) => tool.actions[Number(checkbox.dataset.index)]);
      const template = `Hi,\n\nHere is my Well-Mind stress plan for ${tool.title}:\n\n${tool.actions.map((action) => `- ${action}${completed.includes(action) ? ' ✅' : ''}`).join('\n')}\n\nBest,\n[Your Name]`;
      const mailtoLink = `mailto:?subject=${encodeURIComponent('Well-Mind Stress Plan')}&body=${encodeURIComponent(template)}`;
      window.location.href = mailtoLink;
    };

    renderDashboard();
  };

  grid.querySelectorAll('.library-card').forEach((card) => {
    card.addEventListener('click', () => showTool(card.dataset.tool));
  });

  clearBtn.addEventListener('click', () => {
    detailPanel.style.display = 'none';
    progressText.textContent = '';
    actionsList.innerHTML = '';
    title.textContent = '';
    description.textContent = '';
    grid.querySelectorAll('.library-card').forEach((card) => {
      card.style.border = '1px solid #EAEAEA';
      card.style.transform = 'scale(1)';
    });
  });
}

// Listen for hash changes
window.addEventListener('hashchange', router);

// Load initial route
router();

// Listen for hash changes
window.addEventListener('hashchange', router);

// Load initial route
router();
