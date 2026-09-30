/* baby앙 메인. 실제 카페24 상품·게시판 모듈이 우선이고, 비어 있을 때만 연출 카드를 채운다. */
(function () {
  var photos = ['sq-sleep', 'sq-highchair', 'sq-puddle', 'sq-cube', 'sq-bunny', 'sq-bear', 'sq-stack', 'sq-autumn', 'sq-linen', 'sq-fruit'];
  var names = ['포근한 거즈 속싸개', '첫 이유식 식기 세트', '비 오는 날 우비 세트', '원목 장난감 셀렉션', '특별한 날의 선물 상자', '신생아 첫 옷 셀렉션', '쌓기 놀이 블록', '니트 모자와 가을 옷', '순한 면 침구', '손으로 먹는 간식 식기'];

  function fillPlaceholders(root) {
    root.querySelectorAll('.cz-products').forEach(function (section) {
      var list = section.querySelector('.prdList');
      var fallback = section.querySelector('[data-cz-placeholder]');
      if (!fallback) return;
      if (list && list.querySelector('li')) { fallback.remove(); return; }
      if (list) list.closest('.ec-base-product').hidden = true;
      var count = 10;
      var offset = section.classList.contains('cz-products--best') ? 3 : 0;
      fallback.hidden = false;
      fallback.innerHTML = Array.from({ length: count }, function (_, i) {
        var k = (i + offset) % photos.length;
        return '<a class="cz-ph" href="/product/search.html"><figure><img src="/SkinImg/baby/' + photos[k] +
          '.webp" alt="" loading="lazy"><span>준비 중</span></figure><strong>' + names[k] + '</strong><small>상품 준비 중 · 연출 이미지</small></a>';
      }).join('');
    });
  }

  function initFinder(root) {
    var form = root.querySelector('.cz-finder__form');
    if (!form) return;
    var keywords = {
      newborn: { rest: '신생아 침구', play: '신생아 장난감', meal: '젖병' },
      toddler: { rest: '유아 침구', play: '원목 장난감', meal: '유아 식기' }
    };
    var labels = { rest: ['포근한 잠을', '침구 · 속싸개', '를'], play: ['즐거운 놀이를', '장난감', '을'], meal: ['맛있는 한 끼를', '수유 · 이유식 용품', '을'] };
    function update() {
      var age = form.querySelector('[name=baby]:checked').value === 'toddler' ? 'toddler' : 'newborn';
      var baby = age === 'toddler' ? '걸음마 아기' : '신생아';
      var moment = form.querySelector('[name=moment]:checked').value;
      form.querySelector('[name=keyword]').value = keywords[age][moment];
      var out = form.querySelector('[data-finder-result]');
      out.textContent = '';
      out.append(baby + '의 ' + labels[moment][0] + ' 위한 ');
      var b = document.createElement('b'); b.textContent = labels[moment][1]; out.append(b, labels[moment][2] + ' 추천해요.');
    }
    form.addEventListener('change', update);
    form.addEventListener('submit', function (e) {
      e.preventDefault(); update();
      location.href = '/product/search.html?keyword=' + encodeURIComponent(form.querySelector('[name=keyword]').value);
    });
    update();
  }

  function initHotspots(root) {
    var spots = Array.from(root.querySelectorAll('.cz-hotspot'));
    function closeAll(except) {
      spots.forEach(function (b) {
        if (b === except) return;
        b.setAttribute('aria-expanded', 'false');
        document.getElementById(b.getAttribute('aria-controls')).hidden = true;
      });
    }
    spots.forEach(function (b) {
      b.addEventListener('click', function () {
        var open = b.getAttribute('aria-expanded') !== 'true';
        closeAll(b);
        b.setAttribute('aria-expanded', String(open));
        document.getElementById(b.getAttribute('aria-controls')).hidden = !open;
      });
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });
  }

  function initStarter(root) {
    var list = root.querySelector('[data-starter-list]');
    if (!list) return;
    var status = root.querySelector('[data-starter-status]');
    var bar = root.querySelector('[data-starter-bar]');
    var baby = 'newborn', saved = { newborn: [], toddler: [] }, persisted = true;
    try { var data = JSON.parse(localStorage.getItem('babyang-starter-v1')); if (data && Array.isArray(data.newborn) && Array.isArray(data.toddler)) saved = data; } catch (e) {}
    var items = {
      newborn: ['배냇저고리와 내의', '속싸개와 겉싸개', '젖병과 세정 용품', '기저귀와 물티슈', '아기 침대와 침구', '카시트'],
      toddler: ['이유식 식기와 스푼', '빨대컵', '턱받이', '걸음마 신발', '안전문과 모서리 보호대', '월령에 맞는 장난감']
    };
    // 준비물 목록은 HTML 의 [data-starter-items] (게시판 화면 관리로 바꿀 수 있다)
    function readItems() {
      root.querySelectorAll('[data-starter-items]').forEach(function (el) {
        var list = el.textContent.split('\n').map(function (t) { return t.trim(); }).filter(Boolean);
        if (list.length) items[el.getAttribute('data-starter-items')] = list;
      });
      ['newborn', 'toddler'].forEach(function (k) { saved[k] = saved[k].filter(function (n) { return n < items[k].length; }); });
    }
    readItems();
    function update() {
      var done = saved[baby].length, total = items[baby].length;
      try { localStorage.setItem('babyang-starter-v1', JSON.stringify(saved)); } catch (e) { persisted = false; }
      status.textContent = done + ' / ' + total + ' 준비 완료' + (done === total ? ' · 이제 아기를 맞이할 준비가 끝났어요!' : persisted ? ' · 이 기기에 저장돼요' : ' · 지금 화면에서만 유지돼요');
      if (bar) bar.style.width = (done / total * 100) + '%';
    }
    function render() {
      list.innerHTML = '';
      items[baby].forEach(function (name, i) {
        var row = document.createElement('label'), input = document.createElement('input'), mark = document.createElement('i'), text = document.createElement('span'), link = document.createElement('a');
        input.type = 'checkbox'; input.checked = saved[baby].indexOf(i) > -1;
        text.textContent = name; link.textContent = '보러 가기'; link.href = '/product/search.html?keyword=' + encodeURIComponent(name);
        input.addEventListener('change', function () {
          saved[baby] = saved[baby].filter(function (n) { return n !== i; });
          if (input.checked) saved[baby].push(i);
          update();
        });
        row.append(input, mark, text, link); list.appendChild(row);
      });
      update();
    }
    root.querySelectorAll('[data-starter-baby]').forEach(function (button) {
      button.addEventListener('click', function () {
        baby = button.dataset.starterBaby;
        root.querySelectorAll('[data-starter-baby]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === button)); });
        render();
      });
    });
    root.querySelector('[data-starter-reset]').addEventListener('click', function () { saved[baby] = []; render(); });
    document.addEventListener('babyang:cms', function () { readItems(); render(); });
    render();
  }

  function initRails(root) {
    root.querySelectorAll('.cz-products--rail').forEach(function (section) {
      section.querySelectorAll('[data-rail]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var track = section.querySelector('.ec-base-product:not([hidden]) .prdList') || section.querySelector('.cz-placeholder:not([hidden])');
          if (!track) return;
          var card = track.firstElementChild;
          var step = card ? card.getBoundingClientRect().width + 20 : 300;
          if (section.classList.contains('is-pinned')) window.scrollBy({ top: step * 2 * Number(btn.dataset.rail), behavior: 'smooth' });
          else track.scrollBy({ left: step * 2 * Number(btn.dataset.rail), behavior: 'smooth' });
        });
      });
    });
  }

  /* 스크롤 히어로 : 스크롤 위치에 따라 3장의 사진이 차례로 넘어간다 */
  // 스크롤 연동 공통 : 아이폰 관성 스크롤에서 떨리지 않게
  //  1) 위치(시작점·거리)는 처음 · 폭이 바뀔 때만 재고, 스크롤 중에는 scrollY 만 읽는다 (매 프레임 레이아웃 계산 없음)
  //  2) 화면 값은 목표값을 부드럽게 따라간다(lerp) : 스크롤 값이 띄엄띄엄 들어와도 움직임이 끊기지 않는다
  function scrollFollower(measure, target, draw) {
    var cur = null, drawn = null, running = false, lastW = window.innerWidth, t = null;
    function loop() {
      var goal = target();
      if (cur === null) cur = goal;
      cur += (goal - cur) * 0.2;
      if (Math.abs(goal - cur) < 0.0004) cur = goal;
      // 값이 그대로면 아무것도 쓰지 않는다 : 화면 밖 섹션은 스크롤해도 스타일을 건드리지 않는다
      if (cur !== drawn) { drawn = cur; draw(cur); }
      if (cur !== goal) requestAnimationFrame(loop); else running = false;
    }
    function kick() { if (!running) { running = true; requestAnimationFrame(loop); } }
    function remeasure() { clearTimeout(t); t = setTimeout(function () { measure(); drawn = null; kick(); }, 120); }
    measure();
    window.addEventListener('scroll', kick, { passive: true });
    // 아이폰 주소창이 접히며 생기는 세로 크기 변화는 무시하고, 폭이 바뀔 때만 다시 잰다
    window.addEventListener('resize', function () { if (window.innerWidth !== lastW) { lastW = window.innerWidth; remeasure(); } else kick(); });
    window.addEventListener('load', remeasure);
    window.addEventListener('cz:head', remeasure);   // 띠배너를 닫아 헤더 위치가 바뀌면 다시 잰다
    return { kick: kick, remeasure: remeasure, jump: function (v) { cur = drawn = v; draw(v); } };
  }

  function initWorldHero(root) {
    var track = root.querySelector('[data-scroll-hero]');
    if (!track) return;
    var hero = track.querySelector('.pe-hero');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    var images = Array.from(track.querySelectorAll('[data-world-image]'));
    var copies = Array.from(track.querySelectorAll('[data-world-copy]'));
    var route = Array.from(track.querySelectorAll('[data-world-jump]'));
    var label = track.querySelector('.pe-image-label');
    var labels = ['baby앙 STORY / 01', 'THE OUTING COLLECTION / 02', 'THE SLEEP COLLECTION / 03'];
    var video = track.querySelector('.pe-world-video');
    if (video) {
      video.muted = true; video.defaultMuted = true; video.setAttribute('muted', '');
      var play = function () { var p = video.play(); if (p && p.catch) p.catch(function () {}); };
      video.addEventListener('canplay', play, { once: true }); play();
    }
    var clamp = function (n) { return Math.max(0, Math.min(1, n)); };
    var smooth = function (n) { n = clamp(n); return n * n * (3 - 2 * n); };
    var last = images.length - 1, active = -1;
    // --hero-progress 는 쓰는 곳(사진 위 덮개, 진행 막대)에만 넣는다. 히어로 전체에 넣으면 영상·사진까지 매 프레임 스타일을 다시 계산해 아이폰에서 떨린다
    var progressEls = [track.querySelector('.pe-hero__visual'), track.querySelector('.pe-hero-scroll i')].filter(Boolean);
    function drawScene(position) {
      var index = Math.min(last, Math.floor(position + .5));
      var prog = (position / Math.max(1, last)).toFixed(4);
      progressEls.forEach(function (el) { el.style.setProperty('--hero-progress', prog); });
      images.forEach(function (img, i) {
        img.style.opacity = (1 - smooth((Math.abs(position - i) - .28) / .44)).toFixed(3);
        img.style.transform = reduce.matches ? 'none' : 'translate3d(0,0,0) scale(' + (1.02 + clamp(position - i + .5) * .09).toFixed(4) + ')';
      });
      copies.forEach(function (copy, i) {
        copy.style.opacity = (1 - smooth((Math.abs(position - i) - .22) / .35)).toFixed(3);
        copy.style.transform = reduce.matches ? 'none' : 'translate3d(0,' + ((i - position) * 24).toFixed(2) + 'px,0)';
      });
      if (index !== active) {
        active = index;
        images.forEach(function (img, i) {
          img.setAttribute('aria-hidden', String(i !== index));
          if (img.tagName === 'VIDEO') { if (i === index) { var p = img.play(); if (p && p.catch) p.catch(function () {}); } else img.pause(); }
        });
        copies.forEach(function (copy, i) {
          copy.style.pointerEvents = i === index ? 'auto' : 'none';
          copy.inert = i !== index;
          copy.setAttribute('aria-hidden', String(i !== index));
        });
        route.forEach(function (b, i) { b.setAttribute('aria-pressed', String(i === index)); });
        if (label) label.textContent = labels[index];
      }
    }
    var m = { start: 0, dist: 1 };
    var follow = scrollFollower(function () {
      var top = parseFloat(getComputedStyle(hero).top) || 0;
      m.start = track.getBoundingClientRect().top + window.scrollY - top;
      m.dist = Math.max(1, track.offsetHeight - hero.offsetHeight);
    }, function () {
      return reduce.matches ? 0 : clamp((window.scrollY - m.start) / m.dist) * Math.max(1, last);
    }, drawScene);
    route.forEach(function (button, i) {
      button.addEventListener('click', function () {
        if (reduce.matches) { follow.jump(i); return; }
        window.scrollTo({ top: Math.max(0, m.start + m.dist * i / Math.max(1, route.length - 1)), behavior: 'smooth' });
      });
    });
    if ('ResizeObserver' in window) new ResizeObserver(follow.remeasure).observe(track);
    reduce.addEventListener('change', function () { follow.jump(0); follow.kick(); });
  }

  /* Scroll World (이미지 전용) : 섹션을 스크롤하는 동안 장면마다 카메라가 날아 들어갔다가(가까워짐) 지나간다.
     레이어의 data-depth 가 클수록 더 빠르게 커지고 바깥으로 밀려나며, 마우스를 따라 더 크게 움직인다. */
  function initWorld(root) {
    var sec = root.querySelector('.cz-world');
    if (!sec) return;
    var stage = sec.querySelector('.cz-world__stage');
    var scenes = Array.from(sec.querySelectorAll('.cz-world__scene'));
    var copies = Array.from(sec.querySelectorAll('.cz-world__copy'));
    var route = Array.from(sec.querySelectorAll('[data-world-go]'));
    var N = scenes.length, SPAN = N - 0.35;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    sec.style.setProperty('--cz-world-n', N);
    var layers = scenes.map(function (scene) {
      return Array.from(scene.children).map(function (el, k) {
        return { el: el, d: parseFloat(el.dataset.depth || '1'), r: parseFloat(getComputedStyle(el).getPropertyValue('--r')) || 0, seed: k * 1.7, ox: 0, oy: 0 };
      });
    });
    var mx = 0, my = 0, tx = 0, ty = 0, visible = false, active = -1, raf = 0;
    var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

    function measure() {
      var head = document.getElementById('header');
      var h = head ? Math.max(0, Math.round(head.getBoundingClientRect().bottom)) : 0;
      root.style.setProperty('--cz-head', h + 'px');
      var w = stage.clientWidth, hh = stage.clientHeight;
      layers.forEach(function (list) {
        list.forEach(function (L) {
          var cs = getComputedStyle(L.el);
          L.ox = (parseFloat(cs.left) || w / 2) - w / 2;
          L.oy = (parseFloat(cs.top) || hh / 2) - hh / 2;
        });
      });
    }
    function scaleFor(z, d) {
      if (z < 0) return Math.max(0.3, 1 + z * 0.95 * Math.min(d, 1.4));
      if (z < 0.62) return 1 + z * 0.18 * d;
      return 1 + 0.1116 * d + (z - 0.62) * 2.6 * d;
    }
    function draw(time) {
      raf = 0;
      var rect = sec.getBoundingClientRect();
      var travel = Math.max(1, sec.offsetHeight - stage.offsetHeight);
      var head = parseFloat(getComputedStyle(root).getPropertyValue('--cz-head')) || 0;
      var P = clamp((head - rect.top) / travel, 0, 1);
      sec.style.setProperty('--cz-world-p', P.toFixed(4));
      tx += (mx - tx) * 0.08; ty += (my - ty) * 0.08;
      var pos = P * SPAN, now = time || 0;
      scenes.forEach(function (scene, i) {
        var z = pos - i, last = i === N - 1;
        scene.style.opacity = clamp((z + 0.3) / 0.3, 0, 1).toFixed(3);
        var on = z > -0.3 && (last || z < 1);
        scene.classList.toggle('is-on', on);
        scene.setAttribute('aria-hidden', String(!(z > -0.2 && (last || z < 0.8))));
        if (!on) return;
        layers[i].forEach(function (L) {
          var zz = last ? Math.min(z, 0.62) : z;
          var s = scaleFor(zz, L.d);
          var o = zz < -0.45 ? 0 : zz < 0 ? (zz + 0.45) / 0.45 : zz < 0.72 ? 1 : Math.max(0, 1 - (zz - 0.72) / 0.28);
          var push = (s - 1) * 0.55;
          var bob = L.d > 1 ? Math.sin(now * 0.0012 + L.seed) * 5 * L.d : 0;
          var dx = L.ox * push + tx * L.d * 16, dy = L.oy * push + ty * L.d * 10 + bob;
          L.el.style.opacity = o.toFixed(3);
          L.el.style.transform = 'translate(-50%,-50%) translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px) scale(' + s.toFixed(4) + ') rotate(' + L.r + 'deg)';
        });
      });
      copies.forEach(function (copy, i) {
        var z = pos - i, last = i === N - 1;
        var o = clamp((z + 0.12) / 0.2, 0, 1) * (last ? 1 : clamp((0.72 - z) / 0.16, 0, 1));
        copy.style.opacity = o.toFixed(3);
        copy.style.setProperty('--cz-copy-y', ((1 - o) * 24).toFixed(1) + 'px');
        copy.classList.toggle('is-on', o > 0.5);
        copy.inert = o < 0.5;
        copy.setAttribute('aria-hidden', String(o < 0.5));
      });
      var idx = clamp(Math.round(pos - 0.2), 0, N - 1);
      if (idx !== active) { active = idx; route.forEach(function (b, k) { b.setAttribute('aria-pressed', String(k === idx)); }); }
      if (visible && (fine || Math.abs(mx - tx) > 0.001)) raf = requestAnimationFrame(draw);
    }
    function request() { if (!raf) raf = requestAnimationFrame(draw); }

    if (reduce.matches) return;
    measure();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', function () { measure(); request(); }, { passive: true });
    if (fine) {
      stage.addEventListener('pointermove', function (e) {
        var r = stage.getBoundingClientRect();
        mx = ((e.clientX - r.left) / r.width - 0.5) * 2; my = ((e.clientY - r.top) / r.height - 0.5) * 2; request();
      });
      stage.addEventListener('pointerleave', function () { mx = 0; my = 0; request(); });
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) { measure(); request(); } }).observe(sec);
    } else { visible = true; }
    route.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        var head = parseFloat(getComputedStyle(root).getPropertyValue('--cz-head')) || 0;
        var top = sec.getBoundingClientRect().top + window.scrollY - head;
        var travel = sec.offsetHeight - stage.offsetHeight;
        window.scrollTo({ top: top + travel * Math.min(1, (i + 0.2) / SPAN), behavior: 'smooth' });
      });
    });
    request();
  }

  /* 이벤트 레이어 팝업 : 4초마다 다음 장으로, 오늘 하루 닫기는 자정까지 localStorage 에 기억 */
  function initPopup() {
    var pop = document.getElementById('cz-pop');
    if (!pop) return;
    var KEY = 'babyang-pop-hide-until';
    var editing = /[?&]edit=1/.test(location.search); // 편집 모드에서는 '오늘 하루 닫기'와 상관없이 띄운다
    try { if (!editing && Number(localStorage.getItem(KEY)) > Date.now()) return; } catch (e) {}
    // 게시판 화면 관리(baby-cms.js)의 '이벤트 팝업' 글이 들어온 뒤에 그린다
    if (window.BABYANG_CMS && !pop.__cmsWaited) { pop.__cmsWaited = true; window.BABYANG_CMS.ready(initPopup, 900); return; }
    var SC = window.STORE_CONTENT || {}, cfg = SC.popup;
    if (cfg && cfg.enabled === false) return;
    var track = pop.querySelector('.cz-pop__track');
    // store-content.js 의 popup.slides 로 팝업 장을 다시 그린다 (없으면 HTML 기본값 그대로)
    if (cfg && cfg.slides && cfg.slides.length) {
      var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]; }); };
      var saleEnd = (SC.sale && SC.sale.timer && SC.sale.timer.endAt) || '';
      track.innerHTML = cfg.slides.map(function (s) {
        var timed = s.type === 'timer';
        return '<a class="cz-pop__slide' + (timed ? ' cz-pop__slide--timer' : '') + '" href="' + esc(s.link || '#') + '">'
          + '<div class="cz-pop__img"><img src="' + esc(s.image) + '" alt="' + esc(s.imageAlt) + '"' + (s.imagePosition ? ' style="object-position:' + esc(s.imagePosition) + '"' : '') + '>'
          + (s.badge ? '<span class="cz-pop__badge">' + esc(s.badge) + '</span>' : '')
          + (timed ? '<div class="cz-pop__timer" data-end="' + esc(s.endAt || saleEnd) + '" data-ended="' + esc(s.endedText || '이벤트가 종료되었습니다') + '"><span class="cz-pop__tlab"><i></i>' + esc(s.timerLabel || '이벤트 마감까지') + '</span><span class="cz-pop__tval"></span></div>' : '')
          + '</div><div class="cz-pop__txt">'
          + (s.kicker ? '<small>' + esc(s.kicker) + '</small>' : '') + (s.title ? '<strong>' + esc(s.title) + '</strong>' : '')
          + (s.text ? '<p>' + esc(s.text) + '</p>' : '') + (s.button ? '<em>' + esc(s.button) + '</em>' : '')
          + '</div></a>';
      }).join('');
      var dotBox = pop.querySelector('.cz-pop__dots');
      if (dotBox) dotBox.innerHTML = cfg.slides.map(function (s, k) { return '<button type="button" aria-label="' + (k + 1) + '번 이벤트" aria-current="' + (k === 0) + '"></button>'; }).join('');
    }
    // 타이머 팝업 : 남은 시간을 1초마다 갱신
    var clocks = Array.from(pop.querySelectorAll('.cz-pop__timer'));
    function parseEnd(s) { var m = String(s || '').match(/(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?/); return m ? Date.UTC(+m[1], m[2] - 1, +m[3], (m[4] || 23) - 9, m[5] || 59) : NaN; }
    function tick() {
      var now = Date.now();
      clocks.forEach(function (el) {
        var end = parseEnd(el.getAttribute('data-end')), out = el.querySelector('.cz-pop__tval');
        if (isNaN(end)) { el.hidden = true; return; }
        var left = Math.max(0, Math.floor((end - now) / 1000));
        if (!left) { el.classList.add('is-ended'); out.textContent = el.getAttribute('data-ended'); return; }
        var d = Math.floor(left / 86400), p = function (v) { return (v < 10 ? '0' : '') + v; };
        out.innerHTML = '<b>' + d + '</b><small>일</small><b>' + p(Math.floor(left % 86400 / 3600)) + '</b>:<b>' + p(Math.floor(left % 3600 / 60)) + '</b>:<b>' + p(left % 60) + '</b>';
      });
    }
    if (clocks.length) { tick(); setInterval(tick, 1000); }
    var dots = Array.from(pop.querySelectorAll('.cz-pop__dots button'));
    var n = pop.querySelectorAll('.cz-pop__slide').length, cur = 0, timer = null;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var gap = cfg && cfg.interval != null ? Number(cfg.interval) * 1000 : 4000;
    function go(i) {
      cur = (i + n) % n;
      track.style.transform = 'translateX(' + (-100 * cur) + '%)';
      dots.forEach(function (d, k) { d.setAttribute('aria-current', String(k === cur)); });
    }
    // 움직임 줄이기(Windows '애니메이션 효과' 끔)여도 넘기기는 한다 — 미끄러지는 효과만 뺀다
    if (reduce) track.style.transition = 'none';
    function play() { stop(); if (n > 1 && gap > 0) timer = setInterval(function () { go(cur + 1); }, gap); }
    function stop() { if (timer) clearInterval(timer); timer = null; }
    function close() { stop(); pop.hidden = true; document.removeEventListener('keydown', onKey); }
    function onKey(e) { if (e.key === 'Escape') close(); }
    dots.forEach(function (d, k) { d.addEventListener('click', function () { go(k); play(); }); });
    pop.querySelector('[data-pop-close]').addEventListener('click', close);
    pop.querySelector('[data-pop-today]').addEventListener('click', function () {
      var end = new Date(); end.setHours(24, 0, 0, 0);
      try { localStorage.setItem(KEY, String(end.getTime())); } catch (e) {}
      close();
    });
    pop.addEventListener('click', function (e) { if (e.target === pop) close(); });
    // 마우스를 팝업 카드에 올렸을 때만 멈춘다 (#cz-pop 은 화면 전체를 덮는 배경이라 여기에 걸면 늘 멈춰 있었다)
    var card = pop.querySelector('.cz-pop__box') || pop;
    card.addEventListener('mouseenter', stop); card.addEventListener('mouseleave', play);
    document.addEventListener('keydown', onKey);
    function open() {
      // 첫 방문 인트로(로고 화면)가 끝난 뒤에 띄운다
      if (document.documentElement.classList.contains('st-intro-on')) { setTimeout(open, 800); return; }
      pop.hidden = false; go(0); play();
    }
    setTimeout(open, cfg && cfg.delay != null ? Number(cfg.delay) * 1000 : 1200);
  }

  function initMisc(root) {
    var free = root.querySelector('[data-free-over]'), ship = (window.STORE_CONTENT || {}).shipping;
    if (free && ship && ship.freeBar !== false && ship.freeOver > 0) {
      free.textContent = (ship.freeOver % 10000 === 0 ? ship.freeOver / 10000 + '만원' : ship.freeOver.toLocaleString('ko-KR') + '원') + ' 이상 무료배송 · ';
      free.hidden = false;
    } else if (free) free.hidden = true;   // 무료배송 안내를 끄면 HTML 기본 문구도 숨긴다
  }

  // 신상품 : 섹션을 화면에 고정하고, 고정된 동안 내린 거리만큼 상품 줄을 가로로 민다
  //  · 무대(stage)는 콘텐츠 높이만큼만 차지하고 화면 세로 가운데에 멈춘다 → 섹션 위아래에 빈 공간이 생기지 않는다
  function initRailPin(root) {
    var pin = root.querySelector('[data-rail-pin]');
    if (!pin || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var section = pin.closest('.cz-products--pin'), stage = pin.querySelector('.cz-pin__stage');
    var now = pin.querySelector('[data-rail-now]'), total = pin.querySelector('[data-rail-total]');
    var bar = pin.querySelector('.cz-pin__bar i');
    var track = null, items = [], lead = -1;
    // 위치는 상품 줄(track)과 진행 막대에만 직접 넣는다. 섹션 전체에 CSS 변수를 넣으면 카드 10장을 매 프레임 다시 계산해 아이폰에서 떨린다
    function setX(x) { if (track) track.style.setProperty('transform', 'translate3d(' + (-x).toFixed(1) + 'px,0,0)', 'important'); }
    function setP(p) { if (bar) bar.style.setProperty('transform', 'scaleX(' + Math.max(0.04, p).toFixed(3) + ')'); }
    var m = { start: 0, dist: 0 };
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    function measure() {
      track = section.querySelector('.ec-base-product:not([hidden]) .prdList') || section.querySelector('.cz-placeholder:not([hidden])');
      if (!track) return;
      section.classList.add('is-pinned');
      setX(0);
      items = Array.from(track.children);
      m.dist = Math.max(0, track.scrollWidth - track.clientWidth);
      if (m.dist < 8) { section.classList.remove('is-pinned'); pin.style.height = ''; m.dist = 0; track.style.removeProperty('transform'); return; }
      var hd = document.getElementById('header'), head = hd ? Math.round(hd.getBoundingClientRect().bottom) : 90;
      var vh = document.documentElement.clientHeight;
      var top = Math.max(head, Math.round(head + (vh - head - stage.offsetHeight) / 2));
      section.style.setProperty('--cz-stage-top', top + 'px');
      pin.style.height = (stage.offsetHeight + m.dist) + 'px';
      m.start = pin.getBoundingClientRect().top + window.scrollY - top;
      if (total) total.textContent = pad(items.length);
    }
    function target() { return m.dist ? Math.min(1, Math.max(0, (window.scrollY - m.start) / m.dist)) : 0; }
    function draw(p) {
      if (!m.dist) return;
      setX(p * m.dist);
      setP(p);
      var i = Math.round(p * (items.length - 1));
      if (i !== lead) {
        if (now) now.textContent = pad(i + 1);
        if (items[lead]) items[lead].classList.remove('is-lead');
        if (items[i]) items[i].classList.add('is-lead');
        lead = i;
      }
    }
    var follow = scrollFollower(measure, target, draw);
    if ('ResizeObserver' in window && track) new ResizeObserver(follow.remeasure).observe(track);
  }

  // 9. 장면 속 상품 : PC 에서는 무대를 고정하고 스크롤한 만큼 장면을 한 장씩 옆으로 넘긴다(장면마다 잠깐 머묾).
  //    사진 속 + 나 상품 줄을 누르면 구매 레이어가 열린다. 상품 정보는 index.html 의 #cz-looks-data.
  function initLooks(root) {
    var sec = root.querySelector('.cz-looks');
    if (!sec) return;
    var data = {};
    try { data = JSON.parse(document.getElementById('cz-looks-data').textContent); } catch (e) {}
    var IMG = '/SkinImg/baby/';
    var html = document.documentElement;

    /* 구매 레이어 */
    var qv = document.getElementById('cz-qv'), lastBtn = null;
    var won = function (n) { return Number(n).toLocaleString('ko-KR') + '원'; };
    function reviewOf(no) {
      try {
        var c = JSON.parse(sessionStorage.getItem('babyang-reviews-v3'));
        var list = (c && c.items || []).filter(function (it) { return String(it.productNo) === String(no); });
        if (!list.length) return '';
        var pts = list.filter(function (it) { return it.point; });
        var avg = pts.length ? pts.reduce(function (s, it) { return s + it.point; }, 0) / pts.length : 0;
        return (avg ? '<b>★ ' + avg.toFixed(1) + '</b> · ' : '') + '리뷰 ' + list.length;
      } catch (e) { return ''; }
    }
    // 상품 사진 : 목록 데이터는 파일 이름, 게시판 화면 관리로 추가한 상품(baby-cms.js 가 채움)은 전체 주소
    var imgUrl = function (p) { return /^(https?:)?\/\//.test(p.img) ? p.img : IMG + p.img + '.webp'; };
    function openQV(no, from) {
      var p = data[no] || (window.BABYANG_PRODUCTS || {})[no];
      if (!p || !qv) { if (no) location.href = '/product/detail.html?product_no=' + no; return; }
      lastBtn = from || null;
      var img = qv.querySelector('.cz-qv__img img');
      img.src = imgUrl(p); img.alt = p.name;
      qv.querySelector('.cz-qv__cat').textContent = p.cat || '';
      qv.querySelector('#cz-qv-name').textContent = p.name;
      qv.querySelector('.cz-qv__price').innerHTML = p.retail
        ? '<em>' + Math.round((1 - p.price / p.retail) * 100) + '%</em><b>' + won(p.price) + '</b><s>' + won(p.retail) + '</s>'
        : '<b>' + won(p.price) + '</b>';
      qv.querySelector('.cz-qv__desc').textContent = p.desc || '';
      var rv = qv.querySelector('.cz-qv__review'), r = reviewOf(no);
      rv.innerHTML = r; rv.hidden = !r;
      var url = '/product/detail.html?product_no=' + no;
      qv.querySelector('[data-qv-buy]').href = url;
      qv.querySelector('[data-qv-more]').href = url;
      qv.hidden = false;
      html.classList.add('cz-qv-open');
      qv.querySelector('[data-qv-close]').focus({ preventScroll: true });
    }
    function closeQV() {
      if (!qv || qv.hidden) return;
      qv.hidden = true;
      html.classList.remove('cz-qv-open');
      if (lastBtn) lastBtn.focus({ preventScroll: true });
    }
    // 점·목록은 게시판 화면 관리로 다시 그려질 수 있어 섹션에서 한 번에 받는다
    sec.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-prd]');
      if (b && sec.contains(b) && !document.documentElement.classList.contains('cms-edit')) openQV(b.dataset.prd, b);
    });
    // 섹션에 가까워지면 레이어에 쓸 상품 사진을 미리 받아 둔다 (처음 열 때 빈 칸 방지)
    var preload = function () { Object.keys(data).forEach(function (k) { new Image().src = imgUrl(data[k]); }); };
    if ('IntersectionObserver' in window) {
      var pio = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { pio.disconnect(); preload(); } }, { rootMargin: '800px 0px' });
      pio.observe(sec);
    } else preload();
    if (qv) {
      qv.querySelector('[data-qv-close]').addEventListener('click', closeQV);
      qv.addEventListener('click', function (e) { if (e.target === qv) closeQV(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeQV(); });
    }

    /* 고정 무대 + 장면 넘김 */
    var pin = sec.querySelector('[data-looks-pin]'), stage = sec.querySelector('.cz-looks__stage');
    var track = sec.querySelector('[data-looks-track]'), looks = Array.from(sec.querySelectorAll('.cz-look'));
    var now = sec.querySelector('[data-looks-now]');
    var wide = window.matchMedia('(min-width:1024px)'), reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    var xs = [], dist = 0, active = -1, raf = 0;
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    // 장면 사이 구간에서 앞 25%·뒤 25% 는 머물고 가운데에서만 움직인다
    var ease = function (t) { t = Math.min(1, Math.max(0, (t - 0.25) / 0.5)); return t * t * (3 - 2 * t); };
    function setActive(i) {
      if (i === active) return;
      active = i;
      looks.forEach(function (l, k) { l.classList.toggle('is-active', k === i); });
      if (now) now.textContent = pad(i + 1);
    }
    function measure() {
      if (!wide.matches || reduce.matches || looks.length < 2) {
        sec.classList.remove('is-pinned'); pin.style.height = ''; track.style.transform = ''; dist = 0;
        looks.forEach(function (l) { l.classList.add('is-active'); });
        return;
      }
      sec.classList.add('is-pinned');
      track.style.transform = 'none';
      var sw = stage.clientWidth;
      xs = looks.map(function (l) { return l.offsetLeft - (sw - l.offsetWidth) / 2; });
      dist = Math.round(window.innerHeight * 0.85) * (looks.length - 1);
      pin.style.height = (stage.offsetHeight + dist) + 'px';
      active = -1;
      update();
    }
    function update() {
      raf = 0;
      if (!dist) return;
      var top = parseFloat(getComputedStyle(stage).top) || 0;
      var p = Math.min(1, Math.max(0, (top - pin.getBoundingClientRect().top) / dist));
      var f = p * (looks.length - 1), i = Math.min(looks.length - 2, Math.floor(f)), e = ease(f - i);
      var x = xs[i] + (xs[i + 1] - xs[i]) * e;
      track.style.transform = 'translate3d(' + (-x).toFixed(1) + 'px,0,0)';
      setActive(Math.round(i + e));
    }
    var t = null;
    function remeasure() { clearTimeout(t); t = setTimeout(measure, 150); }
    measure();
    window.addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', remeasure);
    window.addEventListener('load', measure);
    wide.addEventListener('change', measure);
    looks.forEach(function (l) { var im = l.querySelector('img'); if (im && !im.complete) im.addEventListener('load', remeasure, { once: true }); });
  }

  function initReveal(root) {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    root.querySelectorAll('.cz-sec, .cz-finder, .cz-size, .cz-story, .cz-duo, .cz-starter, .cz-reviews, .cz-help').forEach(function (el) {
      if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('cz-reveal'); io.observe(el); }
    });
  }

  // 헤더 아래 끝(띠배너 + 헤더)을 --cz-head 로 넘긴다. 고정(sticky) 섹션들이 이 선에 멈춘다.
  // 띠배너를 닫거나 화면 폭이 바뀌어 헤더 높이가 달라지면 바로 갱신해 빈 공간이 생기지 않게 한다.
  function initHeadLine() {
    var header = document.getElementById('header'), last = -1;
    if (!header) return;
    function sync() {
      var h = Math.max(0, Math.round(header.getBoundingClientRect().bottom));
      if (h === last) return;
      last = h;
      document.documentElement.style.setProperty('--cz-head', h + 'px');
      window.dispatchEvent(new Event('cz:head'));
    }
    sync();
    window.addEventListener('resize', sync);
    window.addEventListener('load', sync);
    if ('ResizeObserver' in window) new ResizeObserver(sync).observe(header);
    if ('MutationObserver' in window) {
      var mo = new MutationObserver(function () { requestAnimationFrame(sync); });
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });
      mo.observe(header, { attributes: true, attributeFilter: ['class', 'style'] });
    }
  }

  function init() {
    var root = document.querySelector('.baby-cozy');
    if (!root) return;
    if (window.BABYANG_CMS) window.BABYANG_CMS.applyCached(); // 게시판으로 바꾼 사진·글자를 인터랙션보다 먼저 넣는다
    initHeadLine();
    initWorldHero(root);
    initWorld(root);
    initPopup();
    fillPlaceholders(root);
    initFinder(root);
    initHotspots(root);
    initLooks(root);
    initStarter(root);
    initRails(root);
    initRailPin(root);
    initMisc(root);
    initReveal(root);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
}());
