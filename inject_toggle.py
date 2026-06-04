import sys

audio_logic = """
if (!window.audioTimers) {
  window.audioTimers = {};
  window.audioData = {};

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
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(110, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        window.audioData[progId].oscNode = osc;
      } catch(e) {}

      window.audioTimers[progId] = setInterval(() => {
        window.audioData[progId].time += 1;
        let secs = window.audioData[progId].time;
        
        // Safety bounds
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

if 'window.audioData =' not in content:
    content = audio_logic + "\n" + content
    with open('main.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Injected toggleAudio successfully.")
else:
    print("Already injected.")
