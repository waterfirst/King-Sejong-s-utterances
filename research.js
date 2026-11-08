(() => {
  // Representative language coordinates from Glottolog 5.3, rounded to two decimal places.
  const families = [
    ['한국어족','kore1284',[['한국어','kore1280',37.54,126.98],['제주어','jeju1234',33.38,126.56]]],
    ['인도유럽어족','indo1319',[['영어','stan1293',53,-1],['스페인어','stan1288',40.44,-1.12],['힌디어','hind1269',25,77]]],
    ['중국티베트어족','sino1245',[['관화','mand1415',40.02,116.23],['버마어','nucl1310',20.79,93.97]]],
    ['아프리카아시아어족','afro1255',[['표준 아랍어','stan1318',27.96,43.85],['암하라어','amha1245',11.71,39.54]]],
    ['대서양콩고어족','atla1278',[['요루바어','yoru1245',7.15,3.67],['스와힐리어','swah1253',-8.26,37.62]]],
    ['오스트로네시아어족','aust1307',[['인도네시아어','indo1316',-7.33,109.72],['타갈로그어','taga1270',14.06,121.75],['마오리어','maor1246',-38.29,176.54]]],
    ['드라비다어족','drav1251',[['타밀어','tami1289',10.52,78.83]]],
    ['오스트로아시아어족','aust1305',[['베트남어','viet1252',20.68,105.77],['크메르어','cent1989',12.05,105.02]]],
    ['크라다이어족','taik1256',[['태국어','thai1261',14.19,100.67]]],
    ['튀르크어족','turk1311',[['튀르키예어','nucl1301',39.87,32.87]]],
    ['우랄어족','ural1272',[['핀란드어','finn1318',64.76,25.56]]],
    ['몽골어족','mong1349',[['할하 몽골어','halh1238',48.32,106.29]]],
    ['일본어족','japo1237',[['일본어','nucl1643',35,135]]],
    ['케추아어족','quec1387',[['아야쿠초 케추아어','ayac1239',-13.85,-74.32]]],
    ['마야어족','maya1287',[['유카텍 마야어','yuca1254',18.78,-88.96]]],
    ['파마늉아어족','pama1250',[['피찬차차라어','pitj1243',-26.97,131.36]]],
    ['고립어 예시','isolate',[['바스크어','basq1248',43.28,-1.32]]]
  ];
  const picker = document.querySelector('[data-family]');
  const markerLayer = document.querySelector('[data-language-points]');
  const description = document.querySelector('[data-family-description]');
  const namespace = 'http://www.w3.org/2000/svg';
  const glottolog = 'https://glottolog.org/resource/languoid/id/';
  const points = [];

  for (const [family, id, languages] of families) {
    picker.add(new Option(family, id));
    for (const [language, code, lat, lon] of languages) {
      const dot = document.createElementNS(namespace, 'circle');
      dot.setAttribute('cx', (lon + 180) * 2);
      dot.setAttribute('cy', (84 - lat) * 2.06);
      const title = document.createElementNS(namespace, 'title');
      title.textContent = `${family} · ${language}`;
      dot.append(title);
      markerLayer.append(dot);
      points.push({id, language, code, dot});
    }
  }
  picker.add(new Option('대표 지점 모두 보기', 'all'));

  function updateMap() {
    const selected = picker.value;
    const matches = [];
    for (const point of points) {
      const active = point.id === selected || selected === 'all';
      point.dot.classList.toggle('selected', active);
      point.dot.setAttribute('r', active ? 4.2 : 2.8);
      if (!active) continue;
      markerLayer.append(point.dot);
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.textContent = point.language;
      link.href = glottolog + point.code;
      item.append(link);
      matches.push(item);
    }
    description.replaceChildren(...matches);
  }
  picker.addEventListener('change', updateMap);
  updateMap();

  const input = document.querySelector('#research-text');
  const nfcOutput = document.querySelector('[data-unicode-nfc]');
  const nfdOutput = document.querySelector('[data-unicode-nfd]');
  const parts = document.querySelector('[data-unicode-parts]');
  const encoder = new TextEncoder();
  const stats = value => `${Array.from(value).length}개 코드 포인트 · UTF-8 ${encoder.encode(value).length}바이트`;
  const codePoint = char => `U+${char.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`;

  function updateText() {
    const nfc = input.value.normalize('NFC');
    const nfd = nfc.normalize('NFD');
    nfcOutput.textContent = stats(nfc);
    nfdOutput.textContent = stats(nfd);
    const syllables = Array.from(nfc).filter(char => /^[가-힣]$/u.test(char));
    parts.textContent = syllables.length ? syllables.map(char =>
      `${char} (${codePoint(char)}) → ${Array.from(char.normalize('NFD'), codePoint).join(' + ')}`
    ).join(' · ') : '현대 한글 음절을 입력하면 위치별 자모 코드가 표시됩니다.';
  }
  input.addEventListener('input', event => { if (!event.isComposing) updateText(); });
  input.addEventListener('compositionend', updateText);
  updateText();
})();
