const models = [
  { name: 'Qwen3-8B', team: '알리바바 Qwen', instructions: [87.60, 61.46, 56.60, 50.13, 49.87, 17.79], math: [86.80, 78.20, 81.80, 78.80, 59.40, 13.80] },
  { name: 'Gemma 2 9B IT', team: 'Google', instructions: [75.20, 53.36, 50.40, 47.16, 48.24, 22.91], math: [77.00, 49.60, 54.80, 55.20, 57.00, 12.60] },
  { name: 'Aya Expanse 32B', team: 'Cohere For AI', instructions: [74.93, 55.52, 49.05, 46.90, 49.86, 18.06], math: [82.60, 76.40, 82.20, 76.80, 71.60, 11.00] },
  { name: 'Aya 23 35B', team: 'Cohere For AI', instructions: [67.11, 48.78, 40.43, 43.93, 40.70, 15.90], math: [56.00, 55.00, 59.40, 61.20, 43.60, 3.80] },
  { name: 'Mistral 7B Instruct', team: 'Mistral AI', instructions: [59.57, 41.78, 40.97, 25.33, 21.83, 18.59], math: [48.60, 39.40, 34.60, 18.40, 14.80, 4.40] },
  { name: 'Mixtral 8×7B Instruct', team: 'Mistral AI', instructions: [56.06, 36.39, 33.70, 31.53, 24.65, 12.40], math: [56.80, 55.00, 62.00, 32.40, 28.80, 5.20] }
];

const language = document.getElementById('bias-language');
const task = document.getElementById('bias-task');
const chart = document.getElementById('bias-chart');
const summary = document.getElementById('bias-summary');
const metric = document.getElementById('bias-metric');
const pct = (score) => score.toFixed(2) + '%';

function renderScores() {
  const scores = models.map(({ name, team, [task.value]: values }) => ({ name, team, score: values[Number(language.value)] }))
    .sort((a, b) => b.score - a.score);
  const best = scores[0];
  summary.textContent = language.selectedOptions[0].textContent + ' · 이 실험에서 가장 높은 관측값은 ' + best.name + ' ' + pct(best.score) + '입니다.';
  metric.textContent = task.value === 'instructions'
    ? '정해진 형식 등 지시를 모두 지킨 프롬프트의 비율입니다. 숫자는 논문 표 9의 엄격 평가입니다.'
    : '질문 언어로 풀이 예시 8개를 제공한 수학 정확도입니다. 숫자는 논문 표 11에 따릅니다.';
  chart.replaceChildren(...scores.map(({ name, team, score }, index) => {
    const row = document.createElement('li');
    const label = document.createElement('span');
    label.textContent = name;
    const developer = document.createElement('small');
    developer.textContent = team;
    label.append(developer);
    const track = document.createElement('span');
    track.className = 'bias-track';
    track.setAttribute('aria-hidden', 'true');
    const fill = document.createElement('span');
    fill.style.width = score + '%';
    if (index === 0) fill.className = 'bias-top-score';
    track.append(fill);
    const value = document.createElement('strong');
    value.textContent = pct(score);
    row.append(label, track, value);
    return row;
  }));
}

language.addEventListener('change', renderScores);
task.addEventListener('change', renderScores);
renderScores();
