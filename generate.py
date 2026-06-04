import re

with open('main.js', 'r', encoding='utf-8') as f:
    content = f.read()

media_page_fn = """
const createMediaPage = (category, title, heroColor, icon, description, backLink) => `
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
          <button style="width: 80px; height: 80px; border-radius: 40px; background: var(--color-brand); color: white; border: none; font-size: 32px; display: flex; align-items: center; justify-content: center; margin: 0 auto; cursor: pointer; box-shadow: 0 10px 20px rgba(246, 114, 66, 0.3); transition: transform 0.2s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            ▶
          </button>
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; color: var(--color-text-light); font-size: 0.9rem; font-family: monospace;">
          <span>00:00</span>
          <span>45:00</span>
        </div>
        <div style="width: 100%; height: 6px; background: #EAEAEA; border-radius: 3px; cursor: pointer; position: relative;">
          <div style="position: absolute; left: 0; top: 0; height: 100%; width: 0%; background: var(--color-brand); border-radius: 3px;"></div>
        </div>
      </div>
      <div style="margin-top: -60px;">
        <a href="${backLink}" class="btn btn-outline" style="border-radius: 100px;">&larr; Back to Library</a>
      </div>
    </div>
  </section>
`;
"""

if 'const createMediaPage' not in content:
    content = content.replace('const createArticlePage =', media_page_fn + '\nconst createArticlePage =')

sleep_items = [
  {'id': 'sleepcasts', 'title': 'Sleepcasts', 'desc': 'Stories to dream to.', 'icon': '🌙', 'cat': 'SLEEPCASTS'},
  {'id': 'sleep-music', 'title': 'Sleep Music', 'desc': 'Drift off to peaceful sounds.', 'icon': '🎶', 'cat': 'SLEEP MUSIC'},
  {'id': 'wind-downs', 'title': 'Wind Downs', 'desc': 'Prepare your mind for rest.', 'icon': '🕯️', 'cat': 'WIND DOWNS'},
  {'id': 'rainday-antiques', 'title': 'Rainday Antiques', 'desc': 'A wander through a cozy shop.', 'icon': '🕰️', 'cat': 'NIGHTTIME STORIES'},
  {'id': 'midnight-launderette', 'title': 'Midnight Launderette', 'desc': 'The hum of tumbling clothes.', 'icon': '🧺', 'cat': 'NIGHTTIME STORIES'},
  {'id': 'cat-marina', 'title': 'Cat Marina', 'desc': 'Boats bobbing and felines sleeping.', 'icon': '⛵', 'cat': 'NIGHTTIME STORIES'},
  {'id': 'goodnight-moon', 'title': 'Goodnight Moon', 'desc': 'Classic tales narrated softly.', 'icon': '🌜', 'cat': 'KIDS SLEEP'},
  {'id': 'breathing-elmo', 'title': 'Breathing with Elmo', 'desc': 'Fun exercises for little ones.', 'icon': '🎈', 'cat': 'KIDS SLEEP'},
  {'id': 'sleepy-jungle', 'title': 'Sleepy Jungle', 'desc': 'Animal friends go to rest.', 'icon': '🐒', 'cat': 'KIDS SLEEP'}
]

focus_items = [
  {'id': 'focus-music', 'title': 'Focus Music', 'desc': 'Beats to boost productivity.', 'icon': '🎧', 'cat': 'FOCUS ENHANCERS'},
  {'id': 'quick-breaks', 'title': 'Quick Breaks', 'desc': 'Reset your mind before the next task.', 'icon': '⏱️', 'cat': 'FOCUS ENHANCERS'},
  {'id': 'exam-prep', 'title': 'Exam Prep', 'desc': 'Calm those testing nerves.', 'icon': '📚', 'cat': 'FOCUS ENHANCERS'},
  {'id': 'melody-flow', 'title': 'Melody Flow', 'desc': 'Soft melodic loops for focused calm.', 'icon': '🎼', 'cat': 'SOUNDSCAPES'},
  {'id': 'coffee-shop', 'title': 'Coffee Shop', 'desc': 'The hum of a busy café.', 'icon': '☕', 'cat': 'SOUNDSCAPES'},
  {'id': 'forest-ambience', 'title': 'Forest Ambience', 'desc': 'Nature sounds to clear the mind.', 'icon': '🌲', 'cat': 'SOUNDSCAPES'},
  {'id': 'desk-stretches', 'title': 'Desk Stretches', 'desc': 'Relieve neck and shoulder tension.', 'icon': '💪', 'cat': 'MINDFUL MOVEMENT'},
  {'id': 'walking-breaks', 'title': 'Walking Breaks', 'desc': 'A guided mind-clearing stroll.', 'icon': '🚶‍♂️', 'cat': 'MINDFUL MOVEMENT'},
  {'id': 'eye-rest', 'title': 'Eye Rest', 'desc': 'Exercises for screen fatigue.', 'icon': '👁️', 'cat': 'MINDFUL MOVEMENT'}
]

generated_consts = ""
for item in sleep_items:
    var_name = 'SleepPage_' + item['id'].replace('-', '_')
    generated_consts += f"const {var_name} = createMediaPage('{item['cat']}', '{item['title']}', '#D1C4E9', '{item['icon']}', '{item['desc']}', '#/sleep');\n"

for item in focus_items:
    var_name = 'FocusPage_' + item['id'].replace('-', '_')
    generated_consts += f"const {var_name} = createMediaPage('{item['cat']}', '{item['title']}', '#FFE0B2', '{item['icon']}', '{item['desc']}', '#/focus');\n"

if 'const SleepPage_sleepcasts' not in content:
    content = content.replace('// --- Simple Router ---', generated_consts + '\n// --- Simple Router ---')

generated_routes = ""
for item in sleep_items:
    generated_routes += f"  '/sleep/{item['id']}': SleepPage_{item['id'].replace('-', '_')},\n"
for item in focus_items:
    generated_routes += f"  '/focus/{item['id']}': FocusPage_{item['id'].replace('-', '_')},\n"

if "'/sleep/sleepcasts'" not in content:
    content = content.replace("  '/': Home,", "  '/': Home,\n" + generated_routes)

for item in sleep_items:
    regex = r'(<div class="library-card"([^>]*?)>)\s*(<div class="card-content"><h3>' + re.escape(item['title']) + r'</h3>)'
    def replace_sleep(match):
        prefix = match.group(1)
        suffix = match.group(3)
        if 'cursor: pointer' in prefix:
            return match.group(0)
        
        # safely insert style and onclick
        if 'style="' in prefix:
            new_prefix = prefix.replace('style="', 'style="cursor: pointer; ')
        else:
            new_prefix = prefix.replace('>', ' style="cursor: pointer;">')
        
        # Strip trailing >
        new_prefix = new_prefix[:-1] + f' onclick="window.location.hash=\'#/sleep/{item["id"]}\'">'
        return new_prefix + "\n          " + suffix

    content = re.sub(regex, replace_sleep, content)

for item in focus_items:
    regex = r'(<div class="library-card([^>]*?)>)\s*(<div class="card-content"><h3>' + re.escape(item['title']) + r'</h3>)'
    def replace_focus(match):
        prefix = match.group(1)
        suffix = match.group(3)
        if 'cursor: pointer' in prefix:
            return match.group(0)
        
        if 'style="' in prefix:
            new_prefix = prefix.replace('style="', 'style="cursor: pointer; ')
        else:
            new_prefix = prefix.replace('>', ' style="cursor: pointer;">')
            
        new_prefix = new_prefix[:-1] + f' onclick="window.location.hash=\'#/focus/{item["id"]}\'">'
        return new_prefix + "\n          " + suffix

    content = re.sub(regex, replace_focus, content)

with open('main.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done with python generator.")
