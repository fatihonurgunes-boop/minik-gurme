import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');

async function generatePlayStoreAssets() {
  // SVG for Feature Graphic 1024x500
  const featureGraphicSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 500" width="1024" height="500">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fff8f0"/>
        <stop offset="40%" stop-color="#fef3c7"/>
        <stop offset="100%" stop-color="#fed7aa"/>
      </linearGradient>
      <linearGradient id="bowlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#d97706"/>
      </linearGradient>
      <linearGradient id="foodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#10b981"/>
        <stop offset="100%" stop-color="#059669"/>
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="10" stdDeviation="16" flood-opacity="0.12"/>
      </filter>
    </defs>

    <!-- Background -->
    <rect width="1024" height="500" fill="url(#bg)"/>

    <!-- Subtle decorative circles -->
    <circle cx="950" cy="80" r="140" fill="#fde68a" opacity="0.3"/>
    <circle cx="80" cy="420" r="180" fill="#fde68a" opacity="0.25"/>
    <circle cx="500" cy="460" r="100" fill="#fed7aa" opacity="0.3"/>

    <!-- Left App Icon Badge -->
    <g transform="translate(90, 85)" filter="url(#shadow)">
      <rect width="330" height="330" rx="75" fill="#ffffff"/>
      <!-- Inner Bowl Illustration -->
      <g transform="translate(15, 10)">
        <ellipse cx="150" cy="225" rx="55" ry="10" fill="#b45309" opacity="0.2"/>
        <path d="M70 140 C70 215, 230 215, 230 140 Z" fill="url(#bowlGrad)"/>
        <ellipse cx="150" cy="140" rx="80" ry="20" fill="#fef3c7"/>
        <ellipse cx="150" cy="143" rx="70" ry="15" fill="url(#foodGrad)"/>
        <!-- Spoon -->
        <g transform="rotate(30 200 110)">
          <rect x="195" y="40" width="14" height="100" rx="7" fill="#fb923c"/>
          <ellipse cx="202" cy="140" rx="20" ry="26" fill="#f97316"/>
        </g>
        <!-- Smile -->
        <path d="M132 175 Q150 192 168 175" stroke="#78350f" stroke-width="5" stroke-linecap="round" fill="none"/>
        <circle cx="122" cy="168" r="6" fill="#f43f5e" opacity="0.4"/>
        <circle cx="178" cy="168" r="6" fill="#f43f5e" opacity="0.4"/>
        <!-- Heart -->
        <path d="M220 70 C220 60, 205 57, 201 67 C197 57, 182 60, 182 70 C182 85, 201 95, 201 95 C201 95, 220 85, 220 70 Z" fill="#f43f5e"/>
      </g>
    </g>

    <!-- Right Typography & Value Propositions -->
    <g transform="translate(470, 110)">
      <!-- Badge -->
      <rect x="0" y="0" width="220" height="34" rx="17" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="1.5"/>
      <text x="110" y="22" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#047857" text-anchor="middle">
        🌱 BEBEK EK GIDA REHBERİ
      </text>

      <!-- Main Title -->
      <text x="0" y="85" font-family="system-ui, -apple-system, sans-serif" font-size="46" font-weight="800" fill="#1c1917" letter-spacing="-1">
        Minik Gurme
      </text>

      <!-- Subtitle -->
      <text x="0" y="125" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="600" fill="#78350f">
        3 Gün Kuralı &amp; Günlük Menü Takibi
      </text>

      <!-- 3 Feature Chips -->
      <g transform="translate(0, 160)">
        <rect x="0" y="0" width="155" height="42" rx="14" fill="#ffffff" stroke="#fde68a" stroke-width="1.5"/>
        <text x="77" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#92400e" text-anchor="middle">
          ✓ 3 Gün Kuralı
        </text>

        <rect x="168" y="0" width="165" height="42" rx="14" fill="#ffffff" stroke="#fde68a" stroke-width="1.5"/>
        <text x="250" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#92400e" text-anchor="middle">
          ✓ Alerji Takibi
        </text>

        <rect x="345" y="0" width="150" height="42" rx="14" fill="#ffffff" stroke="#fde68a" stroke-width="1.5"/>
        <text x="420" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#92400e" text-anchor="middle">
          ✓ Ay Ay Rehber
        </text>
      </g>

      <!-- Security / Local Storage Trust Tag -->
      <g transform="translate(0, 225)">
        <text x="0" y="15" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" fill="#059669">
          🔒 %100 Cihaz İçi Güvenli Depolama • İnternetsiz Çevrimdışı Çalışır
        </text>
      </g>
    </g>
  </svg>
  `;

  // Write Feature Graphic (1024x500)
  await sharp(Buffer.from(featureGraphicSvg))
    .resize(1024, 500)
    .png()
    .toFile(path.join(publicDir, 'play-store-feature-graphic.png'));
  console.log('Generated play-store-feature-graphic.png (1024x500)');

  // Ensure 512x512 Play Store Icon exists with solid background (Play Store rejects transparent corners)
  const iconSvg = fs.readFileSync(path.join(publicDir, 'icon.svg'));
  await sharp(iconSvg)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'play-store-icon-512.png'));
  console.log('Generated play-store-icon-512.png (512x512)');
}

generatePlayStoreAssets().catch(err => {
  console.error(err);
  process.exit(1);
});
