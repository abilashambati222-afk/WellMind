import re

ambient_logic = """
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
"""

with open('main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the existing logic block
start_idx = content.find('if (!window.audioTimers) {')
if start_idx != -1:
    # Find the end of this if block. Since it's right at the top, we just find the next top level statement
    end_idx = content.find("import './style.css';", start_idx)
    if end_idx == -1: end_idx = content.find("window.moodChartInstance = null;", start_idx)
    
    if end_idx != -1:
        content = ambient_logic + "\n" + content[end_idx:]
        with open('main.js', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Successfully replaced basic audio with Ambient Generative Engine!")
    else:
        print("Couldn't find the end marker to replace.")
else:
    print("Couldn't find the start marker.")
