import fs from 'fs';

let content = fs.readFileSync('main.js', 'utf-8');
let lines = content.split(/\r?\n/);

const replacement = `          <div style="background: #F8F9FA; border: 1px solid #EAEAEA; border-radius: 16px; padding: 24px; display: flex; align-items: center; gap: 20px; transition: transform 0.2s; cursor: pointer;" onmouseover="this.style.transform='translateX(8px)'" onmouseout="this.style.transform='translateX(0)'">
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
\`;

const MindfulParenting = \`
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
             <button class="btn btn-outline" style="width: 100%; border-radius: 8px;">Start Course</button>
          </div>
        </div>
        <div style="border: 1px solid #EAEAEA; border-radius: 24px; overflow: hidden; background: white; transition: box-shadow 0.3s, transform 0.3s; cursor: pointer;" onmouseover="this.style.boxShadow='var(--shadow-md)'; this.style.transform='translateY(-4px)'" onmouseout="this.style.boxShadow='none'; this.style.transform='translateY(0)'">
          <div style="height: 160px; background: url('https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80') center/cover;"></div>
          <div style="padding: 32px;">
             <span style="color: var(--color-primary); font-weight: 700; font-size: 0.85rem; letter-spacing: 1px; text-transform: uppercase;">Exercise</span>
             <h3 style="font-size: 1.5rem; margin: 12px 0;">The 3-Breath Pause</h3>
             <p style="color: var(--color-text-muted); line-height: 1.6; margin-bottom: 24px;">A simple technique to reset your nervous system before reacting to your child.</p>
             <button class="btn btn-outline" style="width: 100%; border-radius: 8px;">Try Now</button>
          </div>
        </div>
        <div style="border: 1px solid #EAEAEA; border-radius: 24px; overflow: hidden; background: white; transition: box-shadow 0.3s, transform 0.3s; cursor: pointer;" onmouseover="this.style.boxShadow='var(--shadow-md)'; this.style.transform='translateY(-4px)'" onmouseout="this.style.boxShadow='none'; this.style.transform='translateY(0)'">
           <div style="height: 160px; background: url('https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80') center/cover;"></div>
          <div style="padding: 32px;">
             <span style="color: var(--color-primary); font-weight: 700; font-size: 0.85rem; letter-spacing: 1px; text-transform: uppercase;">Article</span>
             <h3 style="font-size: 1.5rem; margin: 12px 0;">Navigating Teen Years</h3>
             <p style="color: var(--color-text-muted); line-height: 1.6; margin-bottom: 24px;">How to transition from manager to consultant as your children grow.</p>
             <button class="btn btn-outline" style="width: 100%; border-radius: 8px;">Read Article</button>
          </div>
        </div>
      </div>
      
    </div>
  </section>
\`;`;

// lines 1319 to 1405 (1-indexed) = index 1318 to 1404
const count = 1405 - 1319 + 1; // 87 lines
lines.splice(1318, count, replacement);

fs.writeFileSync('main.js', lines.join('\n'), 'utf-8');
console.log('Fixed lines 1319-1405!');
