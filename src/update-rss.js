#!/usr/bin/env node

/**
 * RSS更新スクリプト
 * HPを更新する度に実行して、更新履歴をRSSフィードに追加
 */

import fs from 'fs';
import path from 'path';

// 造語バージョン名の候補
const versionNames = [
  'シャイニングスター', 'ドリームウェーブ', 'キラキラブースト', 'ミラクルフロー',
  'スパークリングサン', 'レインボーライト', 'クリスタルダンス', 'ゴールデンフラッシュ',
  'シルバーストーム', 'プラチナバースト', 'ダイヤモンドレイ', 'エメラルドブリーズ',
  'サファイアムーン', 'ルビーファイア', 'パールウィスパー', 'オパールドリーム',
  'コスモスマジック', 'ギャラクシーピーク', 'ステラーウィンド', 'ネビュラクラウド',
  'オーロラスプラッシュ', 'サンダーボルト', 'ライトニングスピード', 'フレイムハート',
  'アイスクリスタル', 'ウィンドダンサー', 'ストームライダー', 'フェニックスウィング',
  'ドラゴンテイル', 'ユニコーンホーン', 'ペガサスフライト', 'グリフィンクロウ',
  'センチュリオンマーチ', 'グラディエーターロアー', 'サムライブレード', 'ニンジャシャドウ',
  'ウィザードスペル', 'ソーサラーチャーム', 'パラディンシールド', 'ローグダガー'
];

// 現在の日付でバージョン名を生成
function generateVersionName() {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const nameIndex = dayOfYear % versionNames.length;
  return versionNames[nameIndex];
}

// バージョン番号を生成（パッケージのバージョンを参照）
function getCurrentVersion() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const baseVersion = packageJson.version || '1.0.0';
    const [major, minor, patch] = baseVersion.split('.').map(Number);
    
    // 日付ベースで自動インクリメント
    const today = new Date();
    const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
    const newPatch = (patch + daysSinceEpoch) % 100;
    
    return `${major}.${minor}.${newPatch}`;
  } catch (error) {
    console.error('package.jsonの読み込みに失敗:', error);
    return '1.0.0';
  }
}

// RSSフィードを更新
function updateRSSFeed(title, description, changes = []) {
  const rssPath = path.join('src', 'rss.xml');
  
  if (!fs.existsSync(rssPath)) {
    console.error('RSSファイルが見つかりません:', rssPath);
    return;
  }
  
  let rssContent = fs.readFileSync(rssPath, 'utf8');
  
  const now = new Date();
  const pubDate = now.toUTCString().replace('GMT', '+0900');
  const version = getCurrentVersion();
  const versionName = generateVersionName();
  const fullTitle = `v${version}-${versionName} (${now.toLocaleDateString('ja-JP')})`;
  
  // 変更内容をHTMLリストに変換
  const changesHtml = changes.length > 0 
    ? `<ul>${changes.map(change => `<li>${change}</li>`).join('')}</ul>`
    : '<p>詳細な変更内容は省略されています。</p>';
  
  const newItem = `
    <item>
      <title>${fullTitle}</title>
      <link>http://localhost:3000</link>
      <description><![CDATA[
        <p>${description}</p>
        ${changesHtml}
        <p>いや〜、どんどん良くなってるね🙏</p>
      ]]></description>
      <pubDate>${pubDate}</pubDate>
      <guid>http://localhost:3000#v${version}-${versionName}</guid>
    </item>`;
  
  // 最新のlastBuildDateを更新
  rssContent = rssContent.replace(
    /<lastBuildDate>.*?<\/lastBuildDate>/,
    `<lastBuildDate>${pubDate}</lastBuildDate>`
  );
  
  // 最初のitemの直前に新しいitemを挿入
  const firstItemIndex = rssContent.indexOf('<item>');
  if (firstItemIndex !== -1) {
    rssContent = rssContent.slice(0, firstItemIndex) + 
                 newItem + '\n    ' + 
                 rssContent.slice(firstItemIndex);
  } else {
    // itemがない場合は</channel>の前に追加
    rssContent = rssContent.replace('</channel>', `    ${newItem}\n  </channel>`);
  }
  
  fs.writeFileSync(rssPath, rssContent, 'utf8');
  console.log(`✅ RSS更新完了: ${fullTitle}`);
  console.log(`📝 説明: ${description}`);
  if (changes.length > 0) {
    console.log('🔄 変更内容:');
    changes.forEach(change => console.log(`   • ${change}`));
  }
}

// コマンドライン引数を処理
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('📋 使用方法:');
    console.log('  node update-rss.js "アップデート内容" "変更1" "変更2" ...');
    console.log('');
    console.log('📋 例:');
    console.log('  node update-rss.js "デザインを大幅改善🎨" "新しいカラーテーマ追加" "レスポンシブ対応強化"');
    process.exit(1);
  }
  
  const description = args[0];
  const changes = args.slice(1);
  
  updateRSSFeed(description, changes);
}

// 直接実行された場合のみmain関数を呼び出し
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { updateRSSFeed, generateVersionName, getCurrentVersion };