(() => {
    const root = document.getElementById('hangul-articulation');
    const el = name => root.querySelector(`[data-${name}]`);
    const input = el('text'), choice = el('choice'), seek = el('seek'), play = el('play');
    const listenButton = el('listen');
    const rateInput = el('rate');
    const jamo = el('jamo');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const duration = 2.4;
    const initialJamo = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
    const vowelJamo = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ';
    const finalJamo = ' ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ';
    const codas = ' ㄱㄱㄱㄴㄴㄴㄷㄹㄱㅁㄹㄹㄹㅂㄹㅁㅂㅂㄷㄷㅇㄷㄷㄱㄷㅂㄷ';
    const clusters = {ㄳ:'ㄱㅅ',ㄵ:'ㄴㅈ',ㄶ:'ㄴㅎ',ㄺ:'ㄹㄱ',ㄻ:'ㄹㅁ',ㄼ:'ㄹㅂ',ㄽ:'ㄹㅅ',ㄾ:'ㄹㅌ',ㄿ:'ㄹㅍ',ㅀ:'ㄹㅎ',ㅄ:'ㅂㅅ'};
    const nasalize = {ㄱ:'ㅇ',ㄷ:'ㄴ',ㅂ:'ㅁ'};
    const tense = {ㄱ:'ㄲ',ㄷ:'ㄸ',ㅂ:'ㅃ',ㅅ:'ㅆ',ㅈ:'ㅉ'};
    const aspirate = {ㄱ:'ㅋ',ㄷ:'ㅌ',ㅂ:'ㅍ',ㅈ:'ㅊ'};
    const codaSound = letter => codas[finalJamo.indexOf(letter)];
    const consonants = {
      ㄱ:['back','stop'], ㄲ:['back','tense'], ㄴ:['ridge','nasal'], ㄷ:['ridge','stop'], ㄸ:['ridge','tense'], ㄹ:['ridge','tap'],
      ㅁ:['lips','nasal'], ㅂ:['lips','stop'], ㅃ:['lips','tense'], ㅅ:['hiss','fricative'], ㅆ:['hiss','fricative'], ㅇ:['open','open'],
      ㅈ:['palate','affricate'], ㅉ:['palate','affricate'], ㅊ:['palate','aspirated-affricate'], ㅋ:['back','aspirate'], ㅌ:['ridge','aspirate'],
      ㅍ:['lips','aspirate'], ㅎ:['throat','breath'], ㆁ:['back','nasal'], ㆆ:['throat','glottal-stop'], ㅿ:['hiss','voiced-fricative']
    };
    const finals = {ㄱ:['back','stop'], ㄴ:['ridge','nasal'], ㄷ:['ridge','stop'], ㄹ:['ridge','lateral'], ㅁ:['lips','nasal'], ㅂ:['lips','stop'], ㅇ:['back','nasal']};
    const points = {back:[199,78],ridge:[117,78],hiss:[115,83],palate:[141,69],lips:[80,90],throat:[231,139]};
    const placeNames = {back:'여린입천장과 혀 뒤',ridge:'윗잇몸과 혀끝',hiss:'윗잇몸과 혀 사이',palate:'입천장과 혀 앞',lips:'두 입술',throat:'성문'};
    const poses = {
      a:[108,116,139,108,188,108,214,122], e:[110,101,141,88,183,96,213,119], ae:[109,105,141,94,183,100,213,121],
      eo:[109,109,140,101,186,99,215,118], arae:[108,113,140,108,190,101,216,122], o:[107,105,140,97,188,86,215,116],
      u:[107,103,139,96,189,82,215,111], eu:[110,101,145,90,187,86,213,113], i:[110,96,143,75,180,88,213,112],
      back:[111,112,143,105,199,77,216,107], ridge:[118,78,139,95,185,107,214,120], hiss:[116,86,139,93,184,103,214,119],
      palate:[117,90,143,69,184,92,215,116], slit:[116,93,142,77,185,94,214,119]
    };
    // Lower lip centre minus four, then lip rounding. The two lips touch at lipY=91.
    const vowels = {
      ㅏ:['a',111,0],ㅐ:['ae',105,0],ㅑ:['a',111,0,'i'],ㅒ:['ae',105,0,'i'],ㅓ:['eo',107,0],ㅔ:['e',102,0],ㅕ:['eo',107,0,'i'],ㅖ:['e',102,0,'i'],
      ㅗ:['o',101,.82],ㅘ:['a',111,0,'o'],ㅙ:['ae',105,0,'o'],ㅚ:['e',102,0,'o'],ㅛ:['o',101,.82,'i'],ㅜ:['u',100,1],
      ㅝ:['eo',107,0,'u'],ㅞ:['e',102,0,'u'],ㅟ:['i',99,0,'u'],ㅠ:['u',100,1,'i'],ㅡ:['eu',100,0],ㅢ:['i',99,0,'eu'],ㅣ:['i',99,0],ㆍ:['arae',109,0]
    };
    const vowelInfo = {
      a:'턱을 내려 입을 넓게 엽니다.', ae:'혀 앞을 중간 높이에 두고 입을 엽니다.', e:'혀 앞을 올리고 입술을 펴 둡니다.',
      eo:'입술을 펴고 혀 몸통을 약간 뒤로 둡니다.', o:'혀 뒤를 올리고 입술을 둥글게 모읍니다.',
      u:'혀 뒤를 높이고 입술을 더 좁게 모읍니다.', eu:'입술을 모으지 않고 혀 몸통을 높입니다.', i:'혀 앞을 높이고 입술을 둥글게 모으지 않습니다.',
      arae:'혀 몸통을 뒤쪽에 두고 입을 여는 재구 모형입니다.'
    };
    const historicalGroups = [
      ['아음 · 어금닛소리', [
        ['ㄱ','가','「예의」는 君의 첫소리를 예로 듭니다. 혀 뒤를 여린입천장에 붙였다가 뗍니다.'],
        ['ㅋ','카','「예의」의 快 첫소리. ㄱ과 같은 자리에서 막았다가 숨을 세게 내보냅니다.'],
        ['ㆁ','앙','옛이응. 혀 뒤로 입길을 막고 코로 울리는 [ŋ] 계열입니다. 현대 ‘앙’에서는 받침을 비교해 보세요.']
      ]],
      ['설음 · 혓소리', [
        ['ㄷ','다','「예의」의 斗 첫소리. 혀끝으로 윗잇몸을 막았다가 뗍니다.'],
        ['ㅌ','타','혀끝으로 막았다가 떼면서 센 숨을 내보냅니다.'],
        ['ㄴ','나','혀끝을 윗잇몸에 댄 채 공기를 코로 보냅니다.']
      ]],
      ['순음 · 입술소리', [
        ['ㅂ','바','두 입술로 공기를 막았다가 엽니다.'],
        ['ㅍ','파','두 입술을 열면서 센 숨을 내보냅니다.'],
        ['ㅁ','마','두 입술을 닫고 공기를 코로 내보냅니다.']
      ]],
      ['치음 · 잇소리', [
        ['ㅈ','자','혀 앞에서 공기를 막았다가 좁은 틈을 열어 마찰을 만듭니다.'],
        ['ㅊ','차','혀 앞의 막힘을 풀면서 마찰과 센 숨을 냅니다.'],
        ['ㅅ','사','혀와 윗잇몸 사이의 좁은 틈으로 공기를 보내 마찰을 만듭니다.']
      ]],
      ['후음 · 목구멍소리', [
        ['ㆆ',null,'여린히읗. 「예의」는 挹의 첫소리를 예로 듭니다. 성문을 잠깐 닫았다 여는 [ʔ] 계열로 재구했습니다.'],
        ['ㅎ','하','성문 부근의 열린 틈으로 숨을 내보냅니다.'],
        ['ㅇ','아','해례본에서 목구멍소리로 분류합니다. 모형과 ‘아’ 음성은 현대 모음 앞에서 자음 소리가 나지 않는 경우를 보여줍니다.']
      ]],
      ['반설음과 반치음', [
        ['ㄹ','라','혀끝을 윗잇몸 쪽으로 움직입니다. 비교 음성은 현대 ‘라’의 첫소리입니다.'],
        ['ㅿ',null,'반시옷. 「예의」는 穰의 첫소리를 예로 듭니다. 성대가 울리면서 혀 앞의 좁은 틈에서 마찰을 내는 [z] 계열로 재구했습니다.']
      ]],
      ['중성 · 가운뎃소리', [
        ['ㆍ',null,'아래아. 「예의」는 呑의 가운뎃소리를 예로 듭니다. 정확한 음가에는 견해 차이가 있어 혀를 뒤쪽에 두고 입을 여는 한 가지 모형을 보여줍니다.'],
        ['ㅡ','으','입술을 모으지 않고 혀 몸통을 높입니다.'], ['ㅣ','이','혀 앞을 높이고 입술을 펴 둡니다.'],
        ['ㅗ','오','혀 뒤를 올리고 입술을 둥글게 모읍니다.'], ['ㅏ','아','입을 넓게 열어 소리 냅니다.'],
        ['ㅜ','우','혀 뒤를 높이고 입술을 더 좁고 둥글게 모읍니다.'], ['ㅓ','어','입술을 펴고 혀 몸통을 뒤쪽에 둡니다.'],
        ['ㅛ','요','ㅣ에 가까운 자세에서 ㅗ로 이어갑니다.'], ['ㅑ','야','ㅣ에 가까운 자세에서 ㅏ로 이어갑니다.'],
        ['ㅠ','유','ㅣ에 가까운 자세에서 ㅜ로 이어갑니다.'], ['ㅕ','여','ㅣ에 가까운 자세에서 ㅓ로 이어갑니다.']
      ]]
    ];
    const historicalLetters = historicalGroups.flatMap(([group, entries]) => entries.map(([glyph,comparison,note]) => ({glyph,comparison,note,group})));

    function analyze(text) {
      const units = Array.from(text.normalize('NFC'), char => {
        const code = char.charCodeAt(0) - 0xac00;
        if (code < 0 || code >= 11172) return {char};
        return {char, onset:initialJamo[Math.floor(code/588)], vowel:vowelJamo[Math.floor(code/28)%21], coda:finalJamo[code%28]};
      });
      for (let i=0; i<units.length; i++) {
        const current = units[i], next = units[i+1];
        if (!current.onset || current.coda === ' ') continue;
        if (!next?.onset) { current.coda = codaSound(current.coda); continue; }
        const raw = current.coda;
        const cluster = clusters[raw];
        const finalH = raw === 'ㅎ' || cluster?.[1] === 'ㅎ';
        if (next.onset === 'ㅇ' && raw !== 'ㅇ') {
          const moved = cluster?.[1] ?? raw;
          current.coda = cluster?.[0] ?? ' ';
          if (moved !== 'ㅎ') next.onset = next.vowel === 'ㅣ' && moved === 'ㄷ' ? 'ㅈ' : next.vowel === 'ㅣ' && moved === 'ㅌ' ? 'ㅊ' : moved;
          if (raw === 'ㅄ' || raw === 'ㄳ') next.onset = 'ㅆ';
          continue;
        }
        current.coda = codaSound(raw);
        if (finalH) {
          if (aspirate[next.onset]) { next.onset = aspirate[next.onset]; current.coda = cluster?.[0] ?? ' '; continue; }
          if (next.onset === 'ㅅ') { next.onset = 'ㅆ'; current.coda = cluster?.[0] ?? ' '; continue; }
          if (next.onset === 'ㄴ' && raw === 'ㅎ') current.coda = 'ㄴ';
        }
        if (next.onset === 'ㅎ' && !finalH) {
          const trailing = cluster?.[1] ?? raw;
          const base = aspirate[trailing] ? trailing : codaSound(trailing);
          if (aspirate[base]) {
            next.onset = base === 'ㄷ' && next.vowel === 'ㅣ' ? 'ㅊ' : aspirate[base];
            current.coda = cluster?.[0] ?? ' ';
            continue;
          }
        }
        if (current.coda === 'ㄴ' && next.onset === 'ㄹ') current.coda = 'ㄹ';
        if (current.coda === 'ㄹ' && next.onset === 'ㄴ') next.onset = 'ㄹ';
        if ('ㄱㄷㅂㅁㅇ'.includes(current.coda) && next.onset === 'ㄹ') next.onset = 'ㄴ';
        if ('ㄴㅁ'.includes(next.onset) && nasalize[current.coda]) current.coda = nasalize[current.coda];
        if (nasalize[current.coda] && tense[next.onset]) next.onset = tense[next.onset];
      }
      units.forEach((unit,i) => {
        if (!unit.onset) return;
        unit.spoken = String.fromCharCode(0xac00 + initialJamo.indexOf(unit.onset)*588 + vowelJamo.indexOf(unit.vowel)*28 + finalJamo.indexOf(unit.coda));
        unit.lateral = unit.onset === 'ㄹ' && units[i-1]?.coda === 'ㄹ';
      });
      return units;
    }

    const clamp = x => Math.max(0,Math.min(1,x));
    const ease = x => { const t=clamp(x); return t*t*(3-2*t); };
    const between = (t,a,b) => ease((t-a)/(b-a));
    const blend = (a,b,t) => a+(b-a)*t;
    const mix = (a,b,t) => a.map((x,i) => blend(x,b[i],t));
    const wide = [172,92,1];
    const cameraAt = place => {
      const target = points[place];
      return target ? [blend(wide[0],target[0],.74),blend(wide[1],target[1],.64),1.45] : wide;
    };
    let scene, units=[], tokens=[], index=0, time=0, active=false, raf=0, anchor=0, pending=0, lastCue='', speechRun;
    let composing=false, completed=false, historical=true;

    function render(t, speaking=false) {
      time = t;
      const unit = tokens[index];
      const [place, baseKind] = unit ? consonants[unit.onset] : consonants.ㅇ;
      const kind = unit?.lateral ? 'lateral' : baseKind;
      const [codaPlace,codaKind] = finals[unit?.coda] ?? ['open','open'];
      const [vowel, targetLip, targetRound, glide] = vowels[unit?.vowel] ?? vowels.ㅏ;
      const glidePose = glide ? poses[glide] : poses[vowel];
      const glideLip = glide === 'o' ? 101 : glide === 'u' ? 100 : 99;
      const glideRound = glide === 'o' ? .82 : glide === 'u' ? 1 : 0;
      const aspirated = kind === 'aspirate' || kind === 'aspirated-affricate';
      const affricate = kind === 'affricate' || kind === 'aspirated-affricate';
      const onsetVoiced = kind === 'nasal' || kind === 'tap' || kind === 'lateral' || kind === 'voiced-fricative';
      const release = kind === 'tap' ? .63 : .72;
      const vowelStart = kind === 'open' ? .40 : onsetVoiced ? .97 : aspirated || affricate || kind === 'fricative' || kind === 'breath' ? 1.11 : .98;
      const vowelMix = kind === 'open' ? between(t,.10,vowelStart) : between(t,release,vowelStart);
      const closure = between(t,.08,.47) * (1-vowelMix);
      const codaMix = codaKind === 'open' ? 0 : between(t,1.62,2.04);
      const vowelGlide = glide ? between(t,vowelStart,vowelStart+.30) : 1;
      const vowelPose = mix(glidePose,poses[vowel],vowelGlide);
      const consonantPose = affricate ? mix(poses.palate,poses.slit,between(t,release,release+.11)) : poses[place] ?? vowelPose;
      const codaPose = poses[codaPlace] ?? vowelPose;
      const tongue = mix(mix(mix(poses.a,vowelPose,vowelMix),consonantPose,closure),codaPose,codaMix);
      const lipContact = place === 'lips' ? closure : 0;
      const finalLip = codaPlace === 'lips' ? codaMix : 0;
      const round = blend(blend(glideRound,targetRound,vowelGlide)*vowelMix,0,Math.max(finalLip,lipContact));
      const lipX = 80-9*round;
      const lipY = blend(blend(107,blend(glideLip,targetLip,vowelGlide),vowelMix),91,Math.max(lipContact,finalLip));
      const isCoda = codaMix >= .35;
      const codaClosed = codaMix >= .975;
      const isVowel = t >= vowelStart;
      const voicedOnset = onsetVoiced && t >= .47 && t < vowelStart;
      const nasal = voicedOnset && kind === 'nasal' && t < release+.07 || codaClosed && codaKind === 'nasal';
      const voiced = Boolean(unit) && (voicedOnset || isVowel && !(codaClosed && codaKind === 'stop')) && t < 2.30;
      const breathStart = kind === 'breath' ? .42 : release;
      const breath = (aspirated || kind === 'breath') && t >= breathStart && t < vowelStart;
      const airGap = aspirated || kind === 'breath' ? blend(5,7.1,between(t,breathStart-.10,breathStart+.10)) : kind === 'tense' ? blend(5,.72,between(t,.19,.47)) : kind === 'glottal-stop' ? blend(blend(5,.09,between(t,.21,.45)),4.8,between(t,release,release+.08)) : 4.8;
      const voiceStart = onsetVoiced ? .47 : vowelStart;
      const vowelGap = blend(airGap,.90,between(t,voiceStart-.11,voiceStart+.03));
      const finalGap = codaKind === 'stop' ? blend(vowelGap,.55,between(t,1.86,2.08)) : vowelGap;
      const glottalGap = blend(finalGap,4.8,between(t,2.26,duration));
      const lateral = kind === 'lateral' && t >= .47 && t < release+.07 || codaClosed && codaKind === 'lateral';
      const oral = isVowel || t >= release+.035 || kind === 'breath' && t >= .42 || kind.endsWith('fricative') && t >= .47;
      const air = Boolean(unit) && (nasal || lateral || oral && !codaClosed) && t < 2.30;
      const contact = isCoda ? points[codaPlace] : t >= .24 && t < vowelStart ? points[place] : null;
      const vowelCamera = targetRound || glideRound ? cameraAt('lips') : wide;
      const cueCamera = mix(wide,cameraAt(place),between(t,.04,.55));
      const camera = mix(mix(cueCamera,vowelCamera,between(t,release,vowelStart+.40)),cameraAt(codaPlace),isCoda || codaMix ? between(t,1.63,2.10) : 0);
      const [x,y,zoom] = speaking ? wide : reduced.matches ? (isCoda ? cameraAt(codaPlace) : isVowel ? vowelCamera : cameraAt(place)) : camera;
      const onsetNasal = kind === 'nasal' ? between(t,.27,.47)*(1-between(t,release,release+.19)) : 0;
      const finalNasal = codaKind === 'nasal' ? between(t,1.62,2.04) : 0;
      const velumOpening = Math.max(onsetNasal,finalNasal);
      const pose = {tongue,lipX,lipY,round,contact,nasal,velumOpening,lateral,air,strong:aspirated && breath,voiced,glottalGap,x,y,zoom,step:t,still:reduced.matches};
      if (speaking && speechRun?.transition && !reduced.matches) {
        const transition = speechRun.transition;
        const progress = between(performance.now(),transition.at,transition.at+45);
        pose.tongue = mix(transition.pose.tongue,tongue,progress);
        for (const key of ['lipX','lipY','round','glottalGap','velumOpening']) pose[key] = blend(transition.pose[key],pose[key],progress);
        if (progress===1) speechRun.transition=null;
      }
      if (speaking && speechRun) speechRun.pose=pose;
      scene?.draw(pose);
      const [tx,ty,fx,fy,bx,by,rx,ry] = tongue;
      el('tongue').setAttribute('d',`M${tx} ${ty} C${fx-10} ${fy} ${fx} ${fy} ${fx+8} ${fy+1} S${bx-9} ${by} ${bx} ${by} Q${rx} ${by} ${rx} ${ry} L216 145 Q188 143 168 135 Q136 126 ${tx} ${ty}Z`);
      el('jaw').setAttribute('d',`M100 84 Q88 83 ${lipX} 86 M${lipX} ${lipY-4} Q91 ${lipY} 103 ${lipY-2} Q142 148 190 149 Q210 148 219 145 L219 128`);
      el('camera').setAttribute('transform',`translate(${180-x*zoom} ${88-y*zoom}) scale(${zoom})`);
      el('contact').style.visibility = contact ? 'visible' : 'hidden';
      if (contact) { el('contact').setAttribute('cx',contact[0]); el('contact').setAttribute('cy',contact[1]); }
      el('flow').style.visibility = air ? 'visible' : 'hidden';
      el('flow').setAttribute('d',nasal ? 'M229 136 Q233 70 208 57 Q169 29 107 44 L74 55' : `M229 136 Q231 87 213 ${Math.min(ry-8,96)} Q164 ${(fy+by)/2-7} ${tx-4} ${Math.min(ty-5,(lipY+89)/2)} L${lipX-15} ${(lipY+89)/2}`);
      el('glottis').style.opacity = voiced ? String(reduced.matches ? 1 : .52+.48*Math.sin(t*14)**2) : '.34';

      let phase = '초성 준비', note = placeNames[place] ? `${placeNames[place]} 쪽으로 움직입니다.` : '자음 접촉 없이 모음 자세를 잡습니다.';
      if (isCoda) {
        phase = '받침';
        note = `${placeNames[codaPlace]}에서 ${codaKind === 'nasal' ? '막고 공기를 코로 보냅니다.' : codaKind === 'lateral' ? '혀끝을 대고 혀 양옆으로 공기를 보냅니다.' : '공기를 막습니다. 받침을 터뜨리지 않습니다.'}`;
      } else if (isVowel) {
        phase = '모음';
        note = glide && vowelGlide < .98 ? '짧은 시작 모음에서 목표 모음으로 혀와 입술을 옮깁니다.' : `${vowelInfo[vowel]} 성대가 진동합니다.`;
      } else if (t >= .47 && kind !== 'open') {
        if (kind === 'glottal-stop') { phase = t < release ? '성문 닫힘' : '성문 열림'; note = t < release ? '두 성대가 가까워져 공기를 잠깐 막습니다.' : '성문을 다시 열고 모음으로 이어갑니다.'; }
        else if (kind === 'voiced-fricative') { phase = '유성 마찰'; note = '성대가 울리는 동안 혀 앞의 좁은 틈에서 마찰이 납니다.'; }
        else if (t >= release && !['fricative','breath'].includes(kind)) { phase = '초성 풀림'; note = affricate ? '막힘을 풀고 좁은 틈에 마찰을 만듭니다.' : breath ? '막힘을 풀고 센 숨을 내보냅니다.' : '혀나 입술의 막힘을 풀어 모음으로 이어갑니다.'; }
        else if (kind === 'nasal') { phase = '콧소리'; note = `${placeNames[place]}에서 입길을 막습니다. 성대가 울리고 공기는 코로 나갑니다.`; }
        else if (kind === 'breath') { phase = '숨소리'; note = '성문이 열린 채로 숨이 나갑니다.'; }
        else if (kind === 'fricative') { phase = '마찰'; note = '혀와 윗잇몸 사이 좁은 틈으로 공기가 나갑니다.'; }
        else { phase = '초성 접촉'; note = kind === 'tap' ? '혀끝이 윗잇몸을 한 번 가볍게 칩니다.' : kind === 'lateral' ? '혀끝이 윗잇몸에 닿고 공기는 혀 옆을 지납니다.' : `${placeNames[place]}에서 입길을 막습니다.`; }
      }
      if (t >= 2.30) { phase = '자세 유지'; note = '음절의 마지막 위치입니다.'; }
      const cue = `${index}/${unit?.spoken}/${phase}/${note}`;
      if (cue !== lastCue) {
        lastCue = cue;
        el('syllable').textContent = unit ? `${historical ? unit.char : `${index+1}/${tokens.length} · ${unit.char === unit.spoken ? unit.char : `${unit.char} → ${unit.spoken}`}`} · ${phase}` : '한글 음절을 입력하세요.';
        el('articulation').textContent = unit ? note : '';
        el('shot').textContent = unit ? speaking ? '카메라 · 입과 목 전체 고정' : `카메라 · ${isCoda ? placeNames[codaPlace] : isVowel ? targetRound || glideRound ? '입술과 혀' : '입 전체' : placeNames[place] ?? '입 전체'}` : '';
      }
      seek.value = t;
      el('time').textContent = `${t.toFixed(2)} / ${duration.toFixed(2)}초`;
    }

    function setIndex(next) { index=next; choice.value=String(index); }
    function label() { play.textContent = active ? '일시 정지' : completed ? '처음부터 다시 보기' : time > 0 ? '이어서 보기' : '천천히 보기'; }
    function stop() { active=false; cancelAnimationFrame(raf); clearTimeout(pending); label(); }
    function tick(now) {
      if (!active) return;
      const elapsed = (now-anchor)/1000;
      if (elapsed >= duration) {
        if (index+1 === tokens.length) { render(duration); completed=true; stop(); return; }
        const pause = tokens[index+1].pause;
        if (elapsed < duration+pause) { if (time!==duration) render(duration); raf=requestAnimationFrame(tick); return; }
        setIndex(index+1); anchor=now; render(0);
      } else render(Math.max(0,elapsed));
      raf=requestAnimationFrame(tick);
    }
    function start() {
      if (!tokens.length || active) return;
      clearTimeout(pending);
      if (completed) { completed=false; setIndex(0); render(0); }
      active=true; anchor=performance.now()-1000*time; label(); raf=requestAnimationFrame(tick);
    }
    function stopAudio() {
      if (!speechRun) return;
      cancelAnimationFrame(speechRun.frame);
      clearTimeout(speechRun.timeout);
      speechRun=null;
      window.speechSynthesis.cancel();
      listenButton.textContent=historical ? comparisonLabel() : '발음과 함께 재생';
      rateInput.disabled=false;
    }
    function update(auto=false, preferred=null) {
      stop(); stopAudio(); completed=false; lastCue='';
      const previous=tokens;
      units=analyze(input.value);
      let pause=0;
      tokens=[];
      units.forEach(unit => {
        if (!unit.onset) { pause=Math.max(pause,/[.!?。！？,，]/.test(unit.char) ? .40 : .15); return; }
        unit.pause=tokens.length ? pause : 0; pause=0; tokens.push(unit);
      });
      choice.replaceChildren(...tokens.map((unit,i)=>new Option(`${i+1}. ${unit.char === unit.spoken ? unit.char : `${unit.char} → ${unit.spoken}`}`,i)));
      play.disabled=choice.disabled=seek.disabled=el('listen').disabled=!tokens.length;
      el('reading').textContent=tokens.length ? `예상 발음 · ${units.map(unit=>unit.spoken??unit.char).join('')}` : '';
      el('status').hidden=true;
      let changed=0;
      while (changed<tokens.length && tokens[changed].char===previous[changed]?.char && tokens[changed].spoken===previous[changed]?.spoken) changed++;
      setIndex(tokens.length ? Math.min(tokens.length-1,preferred ?? (auto ? changed : 0)) : 0);
      render(0); label();
      if (auto && tokens.length && !reduced.matches) pending=setTimeout(start,220);
    }

    function status(message) { el('status').hidden=!message; el('status').textContent=message; }

    function comparisonLabel() { return `현대 비교 듣기 · ${historicalLetters[jamo.value].comparison}`; }

    function selectHistorical() {
      stopAudio(); stop(); status(''); completed=false; lastCue='';
      const letter=historicalLetters[jamo.value];
      const isVowel=Object.hasOwn(vowels,letter.glyph);
      units=[];
      tokens=[{char:letter.glyph,spoken:letter.glyph,onset:isVowel?'ㅇ':letter.glyph,vowel:isVowel?letter.glyph:'ㅏ',coda:' ',pause:0}];
      index=0;
      el('jamo-note').textContent=`${letter.glyph} · ${letter.note}`;
      listenButton.hidden=rateInput.closest('label').hidden=!letter.comparison;
      listenButton.disabled=choice.disabled=false;
      listenButton.textContent=letter.comparison ? comparisonLabel() : '';
      play.disabled=seek.disabled=false;
      render(0); label();
    }

    function setMode(useHistory) {
      stopAudio(); stop(); status('');
      historical=useHistory;
      el('history-mode').setAttribute('aria-pressed',String(historical));
      el('modern-mode').setAttribute('aria-pressed',String(!historical));
      el('history').hidden=!historical;
      el('modern').hidden=el('modern-choice').hidden=historical;
      if (historical) { selectHistorical(); return; }
      listenButton.hidden=rateInput.closest('label').hidden=false;
      listenButton.textContent='발음과 함께 재생';
      update();
    }

    function listenComparison(synth,voice) {
      const letter=historicalLetters[jamo.value];
      if (!letter.comparison) return;
      const speech=new SpeechSynthesisUtterance(letter.comparison);
      speech.voice=voice; speech.lang=voice.lang; speech.rate=Number(rateInput.value);
      const run={frame:0,timeout:0};
      speechRun=run;
      listenButton.textContent='비교 음성 정지'; rateInput.disabled=true;
      status('현대 한국어 비교 음성입니다.');
      const finish=message=>{ if (speechRun===run) { stopAudio(); status(message); } };
      run.timeout=setTimeout(()=>finish('비교 음성을 시작할 수 없습니다.'),5000);
      speech.onstart=()=>clearTimeout(run.timeout);
      speech.onend=()=>finish('');
      speech.onerror=()=>finish('비교 음성을 재생할 수 없습니다.');
      try { synth.speak(speech); } catch { finish('비교 음성을 시작할 수 없습니다.'); }
    }

    function spokenTimeline() {
      const words=[];
      let text='', word=null;
      let token=0;
      for (const unit of units) {
        if (!unit.onset) {
          if (word) word=null;
          if (/[\s,.!?，。！？]/.test(unit.char)) text+=unit.char;
          else if (!text.endsWith(' ')) text+=' ';
          continue;
        }
        if (!word) {
          word={offset:text.length, first:token, end:token, weights:[], total:0, pause:unit.pause};
          words.push(word);
        }
        const weight=1+(unit.coda!==' '?.14:0)+(vowels[unit.vowel][3]?.12:0);
        word.weights.push(weight); word.total+=weight;
        token++; word.end=token;
        text+=unit.char;
      }
      return {text,words};
    }

    function speechFrame(now, run) {
      if (speechRun!==run) return;
      let wordIndex=run.word;
      let elapsed=Math.max(0,(now-run.at)/1000);
      while (wordIndex+1<run.words.length) {
        const cost=run.words[wordIndex].total*run.seconds+run.words[wordIndex+1].pause*.45/run.rate;
        if (elapsed<cost) break;
        elapsed-=cost; wordIndex++;
      }
      const word=run.words[wordIndex];
      let offset=0;
      while (offset+1<word.weights.length && elapsed>word.weights[offset]*run.seconds) {
        elapsed-=word.weights[offset]*run.seconds; offset++;
      }
      const current=word.first+offset;
      if (current!==index) {
        if (run.pose) run.transition={pose:run.pose,at:now};
        setIndex(current);
      }
      const progress=clamp(elapsed/(word.weights[offset]*run.seconds));
      const unit=tokens[current];
      const end=unit.coda===' ' ? 1.71 : 2.28;
      const phase=progress<.28 ? blend(unit.onset==='ㅇ'?.19:.39,1.12,progress/.28) : blend(1.12,end,(progress-.28)/.72);
      render(phase,true);
      run.frame=requestAnimationFrame(time=>speechFrame(time,run));
    }

    function listen() {
      if (speechRun) { stopAudio(); status(''); label(); return; }
      if (!tokens.length) return;
      stop();
      const synth=window.speechSynthesis;
      const voice=synth?.getVoices().find(candidate=>candidate.localService && /^ko(?:[-_]|$)/i.test(candidate.lang));
      if (!voice) { status('이 브라우저에서 한국어 시스템 음성을 찾지 못했습니다. 운영체제에 한국어 음성을 추가하면 함께 재생할 수 있습니다.'); return; }
      if (historical) { listenComparison(synth,voice); return; }
      const {text,words}=spokenTimeline();
      const rate=Number(rateInput.value);
      const utterance=new SpeechSynthesisUtterance(text);
      utterance.voice=voice; utterance.lang=voice.lang; utterance.rate=rate;
      const run={words,rate,seconds:.184/rate,word:0,at:0,boundary:null,frame:0,timeout:0};
      speechRun=run;
      completed=false; setIndex(0); render(0,true); label();
      listenButton.textContent='재생 정지'; rateInput.disabled=true;
      status('한국어 음성을 준비하는 중입니다.');
      run.timeout=setTimeout(()=>{
        if (speechRun!==run) return;
        stopAudio(); status('음성 엔진이 재생을 시작하지 못했습니다. 다시 재생해 주세요.');
      },5000);
      utterance.onstart=()=>{
        if (speechRun!==run) return;
        clearTimeout(run.timeout);
        run.at=performance.now();
        status('음성 재생 중 · 음절 움직임은 추정합니다.');
        run.frame=requestAnimationFrame(time=>speechFrame(time,run));
      };
      utterance.onboundary=event=>{
        if (speechRun!==run || !run.at || event.name && event.name!=='word') return;
        const current=words.findLastIndex(word=>word.offset<=event.charIndex);
        if (current<run.word || current<0 || run.boundary?.index===current) return;
        const now=performance.now();
        if (run.boundary && current===run.boundary.index+1) {
          const prev=words[run.boundary.index];
          const elapsed=event.elapsedTime>run.boundary.elapsed ? event.elapsedTime-run.boundary.elapsed : (now-run.boundary.now)/1000;
          const estimate=(elapsed-words[current].pause*.45/rate)/prev.total;
          if (estimate>.055 && estimate<.75) run.seconds=blend(run.seconds,estimate,.42);
        }
        run.boundary={index:current,elapsed:event.elapsedTime,now};
        run.word=current; run.at=now;
        status('음성 재생 중 · 단어 경계를 따라 조음을 보정합니다.');
      };
      utterance.onend=()=>{
        if (speechRun!==run) return;
        setIndex(tokens.length-1); render(duration,true); stopAudio();
        completed=true; label(); status('');
      };
      utterance.onerror=()=>{
        if (speechRun!==run) return;
        stopAudio(); status('한국어 음성을 재생할 수 없습니다. 느리게 관찰은 계속 사용할 수 있습니다.');
      };
      try { synth.speak(utterance); }
      catch { stopAudio(); status('한국어 음성을 시작할 수 없습니다.'); }
    }

    input.addEventListener('compositionstart',()=>{composing=true;stop();stopAudio();});
    input.addEventListener('compositionend',()=>{composing=false;update(true);});
    input.addEventListener('input',event=>{if(!composing && !event.isComposing && input.value!==units.map(unit=>unit.char).join('')) update(true);});
    choice.addEventListener('change',()=>{stopAudio();status('');stop();completed=false;setIndex(Number(choice.value));render(0);label();});
    seek.addEventListener('input',()=>{stopAudio();status('');stop();completed=false;render(Number(seek.value));label();});
    play.addEventListener('click',()=>{stopAudio();status('');if(active)stop();else start();});
    rateInput.addEventListener('input',()=>{el('rate-value').textContent=`${Number(rateInput.value).toFixed(1)}×`;});
    listenButton.addEventListener('click',listen);
    let offset=0;
    for (const [group,entries] of historicalGroups) {
      const options=document.createElement('optgroup');
      options.label=group;
      for (const [glyph] of entries) options.append(new Option(glyph,String(offset++)));
      jamo.append(options);
    }
    jamo.addEventListener('change',selectHistorical);
    el('history-mode').addEventListener('click',()=>{ if (!historical) setMode(true); });
    el('modern-mode').addEventListener('click',()=>{ if (historical) setMode(false); });
    try { scene=root.createArticulationScene(); }
    catch { el('views').hidden=true; root.querySelector('.stage').removeAttribute('hidden'); }
    setMode(true);
  })();
