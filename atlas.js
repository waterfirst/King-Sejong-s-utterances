const byId = (id) => document.getElementById(id);
const svgNode = (name) => document.createElementNS('http://www.w3.org/2000/svg', name);
const regionNames = new Intl.DisplayNames('ko', { type: 'region' });
const languageNames = new Intl.DisplayNames('ko', { type: 'language', fallback: 'none' });
const compareNames = new Intl.Collator('ko').compare;
const countryName = (code) => ({ KR: '대한민국', KP: '북한', CD: '콩고민주공화국' })[code] ?? regionNames.of(code);
const languageName = (code) => ({ zh: '중국어 (CLDR zh)', es: '스페인어', my: '미얀마어' })[code] ?? languageNames.of(code) ?? code;
const statusNames = ['공용 지위 미기록', '소수언어 공용', '지역 공용', '사실상 국가 공용', '국가 공용'];
const layerColors = ['#0069da', '#d43180', '#cf7b00'];
const historyColors = { retained: '#138476', other: '#c66224' };
const historyLabels = { retained: '국가 공용·중앙 공무에 사용', other: '국가 공용·중앙 공무 지위 없음' };

const empires = {
  GB: ['영국', '영어'], FR: ['프랑스', '프랑스어'], NL: ['네덜란드', '네덜란드어'],
  ES: ['스페인', '스페인어'], PT: ['포르투갈', '포르투갈어'], JP: ['일본', '일본어']
};
const cases = [
  ['IN', 'GB', 'retained', '영국령 인도 → 1947년 분할과 인도 독립', '힌디어와 함께 영어를 연방 공무와 의회에 계속 사용합니다. 공용어법 제3조.',
    'https://history.state.gov/countries/india', 'https://www.indiacode.nic.in/bitstream/123456789/1526/1/A1963__19.pdf'],
  ['MM', 'GB', 'other', '영국령 버마 → 1948년 독립', '헌법 제450조는 미얀마어를 공용어로 정합니다.',
    'https://history.state.gov/countries/burma', 'https://www.wipo.int/wipolex/en/legislation/details/6187'],
  ['SN', 'FR', 'retained', '프랑스령 서아프리카의 일부 → 1960년 말리연방 독립, 이후 세네갈 분리', '프랑스어는 공용어입니다. 월로프어를 비롯한 여러 언어는 헌법이 인정하는 민족 언어입니다.',
    'https://history.state.gov/countries/senegal', 'https://primature.sn/publications/lois-et-reglements/loi-ndeg-2001-03-du-22-janvier-2001-portant-constitution-modifiee'],
  ['VN', 'FR', 'other', '프랑스령 인도차이나 → 1945년 독립 선언 → 1954년 프랑스와 전쟁 종결', '헌법 제5조는 베트남어를 국가 언어로 정합니다.',
    'https://history.state.gov/historicaldocuments/frus1952-54v16/d1035', 'https://xaydungchinhsach.chinhphu.vn/toan-van-hien-phap-nuoc-cong-hoa-xa-hoi-chu-nghia-viet-nam-119231225213002261.htm'],
  ['DZ', 'FR', 'other', '프랑스 식민 통치 → 1962년 독립', '아랍어와 타마지그트어가 공용어입니다. 프랑스어는 일부 도시 등에서 사회적으로 쓰입니다.',
    'https://history.state.gov/countries/algeria', 'https://www.wipo.int/wipolex/fr/legislation/details/20552', 'https://asjp.cerist.dz/en/downArticle/326/11/4/252345'],
  ['SR', 'NL', 'retained', '네덜란드 식민 통치 → 자치 확대 → 1975년 독립', '네덜란드어가 공용어이며, 스라난 통고 등 여러 언어도 쓰입니다.',
    'https://history.state.gov/countries/suriname', 'https://www.un.int/suriname/fr/suriname/country-facts'],
  ['ID', 'NL', 'other', '네덜란드령 동인도 → 1945년 독립 선언 → 1949년 주권 이양', '헌법 제36조는 인도네시아어를 국가 언어로 정합니다.',
    'https://history.state.gov/historicaldocuments/frus1949v07p1/d409', 'https://www.dpr.go.id/dokumen/jdih/undang-undang-dasar'],
  ['PE', 'ES', 'retained', '스페인령 페루 → 1821년 독립 선언 → 1824년 독립 전쟁 종결', '스페인어가 공용어입니다. 케추아어, 아이마라어 등도 널리 쓰이는 지역에서는 공용어입니다.',
    'https://history.state.gov/historicaldocuments/frus1865p1/d353', 'https://www3.congreso.gob.pe/Docs/biblioteca/Constitucion/CP-ED-Nov2022/files/basic-html/page39.html'],
  ['PH', 'ES', 'other', '스페인 식민 통치 → 1898년 독립 선언·스페인 통치 종료 → 미국 통치 → 1946년 독립', '필리핀어와 영어가 공용어입니다. 스페인어는 헌법이 자발적·선택적 진흥 대상으로 규정합니다.',
    'https://history.state.gov/milestones/1866-1898/spanish-american-war', 'https://officialgazette.gov.ph/constitutions/1987-constitution/', 'https://history.state.gov/countries/philippines'],
  ['BR', 'PT', 'retained', '포르투갈 식민 통치 → 1822년 독립 선언', '포르투갈어가 공용어입니다. 헌법 제13조.',
    'https://history.state.gov/countries/brazil', 'https://www4.planalto.gov.br/legislacao/legis-federal/constituicao'],
  ['TL', 'PT', 'retained', '포르투갈 식민 통치 → 1975년 독립 선언 → 인도네시아 점령·유엔 과도 통치 → 2002년 독립 회복', '테툼어와 포르투갈어가 공용어입니다. 헌법 제13조.',
    'https://www.gftm.gov.tl/about/timor-leste/', 'https://timor-leste.gov.tl/wp-content/uploads/2010/03/Constitution_RDTL_ENG.pdf'],
  ['KR', 'JP', 'other', '일본의 한국 병합(1910년) → 한반도 광복(1945년) → 대한민국 정부 수립(1948년)', '국어기본법에서 대한민국의 공용어를 한국어로 규정합니다.',
    'https://theme.archives.go.kr/next/gazette/viewIntroduction03.do', 'https://www.law.go.kr/lsInfoP.do?lsId=009877&urlMode=lsInfoP']
];

function element(tag, text, className) {
  const item = document.createElement(tag);
  if (text) item.textContent = text;
  if (className) item.className = className;
  return item;
}

function options(select, values) {
  select.replaceChildren(...values.map(([value, label]) => new Option(label, value)));
}

function makeMap(svg, prefix, onSelect) {
  const definitions = svgNode('defs');
  const base = svgNode('g');
  base.classList.add('atlas-map-base');
  const paint = svgNode('g');
  paint.classList.add('atlas-map-paint');
  const border = svgNode('g');
  border.classList.add('atlas-map-selection');
  svg.append(definitions, base, paint, border);

  function use(id) {
    const copy = svgNode('use');
    copy.setAttribute('href', '#' + prefix + '-' + id);
    copy.dataset.country = id;
    return copy;
  }
  function addShape(id, shape) {
    shape.id = prefix + '-' + id;
    definitions.append(shape);
    const copy = use(id);
    const title = svgNode('title');
    title.textContent = /^[A-Z]{2}$/.test(id) ? countryName(id) : '';
    copy.append(title);
    base.append(copy);
  }

  for (const [id, path] of Object.entries(atlasData.outlines)) {
    const shape = svgNode('path');
    shape.setAttribute('d', path);
    shape.setAttribute('fill-rule', 'evenodd');
    addShape(id, shape);
  }
  for (const [id, [x, y]] of Object.entries(atlasData.islands)) {
    const shape = svgNode('circle');
    shape.setAttribute('cx', x);
    shape.setAttribute('cy', y);
    shape.setAttribute('r', 2.35);
    addShape(id, shape);
  }
  svg.addEventListener('click', (event) => {
    const id = event.target.dataset.country;
    if (id) onSelect(id);
  });
  return {
    draw(groups, selected) {
      paint.replaceChildren(...groups.map(({ countries, color, opacity }) => {
        const layer = svgNode('g');
        layer.setAttribute('fill', color);
        layer.setAttribute('fill-opacity', opacity);
        layer.append(...countries.map(use));
        return layer;
      }));
      border.replaceChildren(...(selected ? [use(selected)] : []));
    }
  };
}

function legendItem(label, color, opacity = 1) {
  const item = element('li');
  const swatch = element('span', '', 'atlas-swatch');
  swatch.style.background = color;
  swatch.style.opacity = opacity;
  swatch.setAttribute('aria-hidden', 'true');
  item.append(swatch, label);
  return item;
}

function bar(label, summary, segments, scale) {
  const item = element('li', '', 'atlas-bar');
  const track = element('span', '', 'atlas-track');
  track.setAttribute('aria-hidden', 'true');
  for (const [size, color] of segments) {
    const fill = element('span', '', color);
    fill.style.width = (size / scale * 100) + '%';
    track.append(fill);
  }
  item.append(element('span', label), track, element('strong', summary));
  return item;
}

const speakers = [
  ['영어', 3.72, 11.21, 14.93],
  ['관화', 9.88, 1.94, 11.83]
];
byId('atlas-speakers').replaceChildren(...speakers.map(([name, native, second, total]) =>
  bar(name, total.toFixed(2) + '억', [[native, 'speaker-native'], [second, 'speaker-second']], 15)));
const speakerBreakdown = speakers.map(([name, native, second]) => name + ' 모어 ' + native.toFixed(2) + '억 · 제2언어 ' + second.toFixed(2) + '억');
byId('atlas-speakers').after(element('p', speakerBreakdown.join(' / '), 'source-note'));

const countrySelect = byId('atlas-country');
const criterion = byId('atlas-criterion');
const selectors = layerColors.map((_, index) => byId('atlas-layer-' + (index + 1)));
const common = ['en', 'fr', 'es', 'ko', 'zh', 'hi', 'ar', 'pt', 'ru', 'ja', 'id', 'nl'];
const languageOptions = Object.keys(atlasData.languages).filter((id) => !common.includes(id))
  .sort((a, b) => compareNames(languageName(a), languageName(b)));
const languageChoices = [['', '선택 안 함'], ...[...common, ...languageOptions].map((id) => [id, languageName(id)])];
selectors.forEach((select, index) => {
  options(select, languageChoices);
  select.value = ['en', 'fr', 'es'][index];
  select.addEventListener('change', () => {
    for (const other of selectors) {
      if (select !== other && select.value && other.value === select.value) other.value = '';
    }
    renderLanguages();
  });
});
const countryChoices = atlasData.countries.map((id) => [id, countryName(id)])
  .sort((a, b) => compareNames(a[1], b[1]));
options(countrySelect, [['', '나라 선택'], ...countryChoices]);
const languagesMap = makeMap(byId('atlas-language-map'), 'languages', (id) => {
  if (!atlasData.countries.includes(id)) return;
  countrySelect.value = id;
  renderLanguages();
});

const official = ([, status]) => status >= 3;
function qualifying(id, test) {
  return Object.entries(atlasData.languages[id]).filter(([, record]) => test(record)).map(([country]) => country);
}
function ranking(test) {
  return Object.keys(atlasData.languages).map((id) => [id, qualifying(id, test).length])
    .sort((a, b) => b[1] - a[1] || compareNames(languageName(a[0]), languageName(b[0])));
}
function renderRanking(id, ranks, style) {
  byId(id).replaceChildren(...ranks.slice(0, 5).map(([language, count]) =>
    bar(languageName(language), count + '곳', [[count, style]], ranks[0][1])));
}

const officialRanks = ranking(official);
function renderLanguages() {
  const threshold = criterion.value === 'official' ? 1 : Number(criterion.value);
  const populationTest = ([share]) => share >= threshold;
  const test = criterion.value === 'official' ? official : populationTest;
  const groups = selectors.flatMap((select, index) => select.value ? [{
    id: select.value, color: layerColors[index], opacity: 0.36, countries: qualifying(select.value, test)
  }] : []);
  const selected = countrySelect.value;
  languagesMap.draw(groups, selected);
  byId('atlas-language-legend').replaceChildren(...groups.map(({ id, color, opacity, countries }) =>
    legendItem(languageName(id) + ' · ' + countries.length + '곳', color, opacity)));
  const detail = byId('atlas-country-detail');
  detail.replaceChildren();
  if (!selected || !groups.length) {
    detail.textContent = groups.length ? '나라를 선택하면 언어별 비중과 공용 지위가 여기에 표시됩니다.' : '지도를 칠할 언어를 한 개 이상 선택하세요.';
  } else {
    detail.append(element('strong', countryName(selected)));
    const list = element('ul');
    for (const { id, countries } of groups) {
      const record = atlasData.languages[id][selected];
      const note = record ? record[0] + '% · ' + statusNames[record[1]] : 'CLDR 자료 없음';
      list.append(element('li', languageName(id) + ' · ' + note + (countries.includes(selected) ? ' · 지도에 표시' : '')));
    }
    detail.append(list);
  }
  const ranks = ranking(populationTest);
  const [mostUsed, usedCount] = ranks[0];
  const [mostOfficial, officialCount] = officialRanks[0];
  byId('atlas-rank-summary').textContent = '인구 ' + threshold + '% 이상 기준으로 ' + languageName(mostUsed) + ' ' +
    usedCount + '곳, 국가 공용·사실상 공용 기준으로 ' + languageName(mostOfficial) + ' ' + officialCount + '곳이 각각 가장 많습니다.';
  renderRanking('atlas-usage-ranks', ranks, 'atlas-rank-usage');
}
criterion.addEventListener('change', renderLanguages);
countrySelect.addEventListener('change', renderLanguages);
renderRanking('atlas-official-ranks', officialRanks, 'atlas-rank-official');
renderLanguages();

const empireSelect = byId('atlas-empire');
options(empireSelect, [['', '전체 사례'], ...Object.entries(empires).map(([id, [name]]) => [id, name])]);
let historyCountry = '';
const historyMap = makeMap(byId('atlas-history-map'), 'history', (id) => {
  if (!filteredCases().some(([country]) => country === id)) return;
  historyCountry = id;
  renderHistory();
});

function filteredCases() {
  return cases.filter(([, empire]) => !empireSelect.value || empireSelect.value === empire);
}

function historyRow([country, empire, status, sequence, current, ...sources]) {
  const row = element('tr');
  const name = element('th', countryName(country));
  name.scope = 'row';
  const currentCell = element('td');
  currentCell.append(element('strong', historyLabels[status]), element('p', current));
  const links = element('td', '', 'atlas-history-sources');
  sources.forEach((url, index) => {
    const link = element('a', ['역사', '언어 지위', '추가 자료'][index]);
    link.href = url;
    links.append(link);
  });
  row.append(name, element('td', empires[empire].join(' · ')), element('td', sequence), currentCell, links);
  return row;
}

function renderHistory() {
  const records = filteredCases();
  const groups = Object.entries(historyLabels).map(([id, label]) => ({
    label, color: historyColors[id], opacity: 0.76,
    countries: records.filter(([, , status]) => status === id).map(([country]) => country)
  }));
  historyMap.draw(groups, historyCountry);
  byId('atlas-history-legend').replaceChildren(...groups.map(({ label, color, opacity }) => legendItem(label, color, opacity)));
  byId('atlas-history-bars').replaceChildren(...groups.map(({ label, countries }, index) =>
    bar(label, countries.length + '곳', [[countries.length, index === 0 ? 'atlas-retained' : 'atlas-other']], records.length)));
  byId('atlas-history-rows').replaceChildren(...records.map(historyRow));
  const selected = records.find(([country]) => country === historyCountry);
  const detail = byId('atlas-history-detail');
  detail.replaceChildren();
  if (selected) {
    detail.append(element('strong', countryName(selected[0]) + ' · ' + empires[selected[1]][1]), element('p', selected[3]), element('p', selected[4]));
  } else {
    detail.textContent = '지도에서 색칠된 나라를 누르거나 아래 표에서 ' + records.length + '개 사례를 확인하세요.';
  }
}

empireSelect.addEventListener('change', () => {
  historyCountry = '';
  renderHistory();
});
renderHistory();
