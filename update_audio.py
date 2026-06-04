import re

with open('main.js', 'r', encoding='utf-8') as f:
    content = f.read()

new_media_page = """const createMediaPage = (category, title, heroColor, icon, description, backLink) => {
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
          <button id="btn-${uid}" onclick="window.toggleAudio(this, 'prog-${uid}', 'time-${uid}')" style="width: 80px; height: 80px; border-radius: 40px; background: var(--color-brand); color: white; border: none; font-size: 32px; display: flex; align-items: center; justify-content: center; margin: 0 auto; cursor: pointer; box-shadow: 0 10px 20px rgba(246, 114, 66, 0.3); transition: transform 0.2s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            ▶
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
"""

audio_logic = """
window.audioTimers = {};
window.audioData = {};

window.toggleAudio = (btn, progId, timeId) => {
  const isPlaying = btn.innerHTML.includes('⏸');
  
  if (isPlaying) {
    // Pause
    btn.innerHTML = '▶';
    clearInterval(window.audioTimers[progId]);
    
    // Web audio stop (if using mock noise)
    if (window.audioData[progId] && window.audioData[progId].oscNode) {
      window.audioData[progId].oscNode.stop();
      window.audioData[progId] = null;
    }
  } else {
    // Play
    btn.innerHTML = '⏸';
    
    if (!window.audioData[progId]) {
       window.audioData[progId] = { time: 0, maxTime: 45 * 60 };
    }
    
    // If Web Audio API is desired, we can generate a soothing pink noise
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, ctx.currentTime); // Low soothing hum A2
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      window.audioData[progId].oscNode = osc;
    } catch(e) {}

    window.audioTimers[progId] = setInterval(() => {
      window.audioData[progId].time += 1;
      let secs = window.audioData[progId].time;
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
"""

# Extract and substitute createMediaPage
start_idx = content.find('const createMediaPage = ')
if start_idx != -1:
    end_idx = content.find('const createArticlePage =')
    if end_idx != -1:
        # replace block
        content = content[:start_idx] + new_media_page + "\n" + content[end_idx:]

# inject audio_logic near top
if 'window.toggleAudio' not in content:
    content = content.replace("window.moodChartInstance = null;", "window.moodChartInstance = null;\n" + audio_logic)

with open('main.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Audio logic injected successfully.")
