// 디자인센터 상세페이지 만들기 (PETPIA 상세페이지와 같은 구성)
//   node docs/tools/designcenter-detail.js        → _deploy/dc/detail.html (미리보기 · 이미지로 굽기용)
// 재료 : _deploy/dc/detail.css (PETPIA 상세 CSS), _deploy/dc/img/*.webp (스킨 사진), _deploy/dc/shots/walk-NN-page|edit.jpg (섹션 캡처),
//        _deploy/dc/walk-meta.json (섹션마다 번호 붙인 칸 이름)
const fs = require('fs');
const path = require('path');
const DC = path.join(__dirname, '../../_deploy/dc');
const CSS = fs.readFileSync(path.join(DC, 'detail.css'), 'utf8');
const META = JSON.parse(fs.readFileSync(path.join(DC, 'walk-meta.json'), 'utf8'));
const ORDER_FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSf26MVAAFBO6btjz97kuKnjw6jvWKNdJ21ET3jIUsov0NTR_g/viewform?usp=header';
const SAMPLE = 'https://ecudemo408995.cafe24.com/';
const I = n => 'img/' + n + '.webp';
const S = n => 'shots/' + n + '.jpg';

// 섹션 머리글 · 버튼 이름 · 덧붙임 안내
const SEC = {
  '첫 화면': ['Little days, big love', '메인 첫 화면 (영상 · 사진)', '첫 화면 고치기', ['<b>영상 바꾸기</b> : 1번의 <em>영상 주소</em> 칸에 mp4 주소를 넣으면 그 영상이, 비우면 사진이 나와요.', '스크롤하면 나오는 2번 · 3번 장면도 아래쪽 칸에서 똑같이 바꿔요.']],
  '이용 안내': ['Shop info', '이용 안내 (배송 · 교환 · 후기 · 문의)', '이용 안내 고치기', ['안내 칸을 늘리려면 [복사해서 추가], 줄이려면 [삭제]를 눌러요.']],
  '몇 개월': ['How little?', '우리 아이는 몇 개월인가요?', '몇 개월 고치기', ['신생아 · 걸음마 아기 카드마다 사진, 제목, 바로가기를 바꿔요. 바로가기는 한 줄에 「이름 주소」로 써요.']],
  '카테고리': ['Shop by need', '오늘은 무엇이 필요하세요?', '카테고리 고치기', ['동그라미 하나가 칸 하나예요. 분류를 늘리려면 [복사해서 추가]를 눌러요.']],
  '추천 상품 제목': ['Curated · New · Best · Reviews', '상품 섹션 4곳 (추천 · 신상 · 인기 · 포토리뷰)', '추천 상품 제목 고치기', ['상품은 카페24 관리자 › 메인 진열에서 고르면 자동으로 나와요. 섹션 제목과 버튼 글자만 [고치기]로 바꿔요.', '포토리뷰는 상품 사용후기 게시판의 사진 후기가 자동으로 모여요.']],
  '취향 찾기': ['Find what they need', '우리 아이에게 지금 필요한 건?', '취향 찾기 고치기', ['선택지 사진과 안내 글, 연결되는 상품 분류를 바꿔요.']],
  '사이즈 가이드': ['Size, made easy', '아기 옷 사이즈, 어렵지 않아요', '사이즈 가이드 고치기', ['키 · 몸무게별 사이즈 표와 재는 법 1 · 2 · 3번도 아래 칸에서 바꿔요.']],
  '장면 속 상품': ['Shop the look', '장면 속 그 상품', '장면 속 상품 고치기', ['사진 위 + 점은 편집 창에서 사진을 눌러 찍고, 상품번호만 적으면 상품 이름 · 가격이 자동으로 나와요.']],
  '기획전': ['A day to celebrate', '소중한 날엔, 조금 더 특별하게', '기획전 고치기', ['왼쪽 · 오른쪽 배너의 사진, 글, 링크를 바꿔요.']],
  '체크리스트': ['Your first chapter', '아기를 맞이하는 날, 하나씩 준비해요', '체크리스트 고치기', ['준비물은 한 줄에 하나씩 쓰면 그대로 체크 항목이 돼요.']],
  '함께 지내는 법': ['Little notes', '함께 자라는 법', '함께 지내는 법 고치기', ['육아 메모 카드를 늘리거나 줄일 수 있어요.']],
  '회원 안내': ['Your everyday, in one place', '다음 쇼핑도, 조금 더 편하게', '회원 안내 고치기', []],
  '자주 묻는 질문': ['A little help', '자주 묻는 질문', '자주 묻는 질문 고치기', ['질문을 늘리려면 [복사해서 추가]를 눌러요.']],
  '맨 아래 브랜드': ['baby앙', '맨 아래 브랜드', '맨 아래 브랜드 고치기', ['큰 로고 사진과 문장을 우리 가게 것으로 바꿔요.']],
  '이벤트 팝업': ['Event popup', '메인 이벤트 팝업', '이 팝업 고치기', ['팝업 <em>사진</em> → [사진 바꾸기]를 누르고 내 컴퓨터 사진 고르기', '<em>제목 · 설명 · 버튼 · 링크</em> 칸 → 지우고 새로 쓰기', '<em>마감 시각</em>에 2026-10-31 23:59 처럼 쓰면 남은 시간 타이머가 붙어요.', '팝업은 최대 5장까지 저절로 넘어가요. [복사해서 추가]로 늘려요.']],
};
const isPhoto = l => /사진/.test(l) && !/스티커|글/.test(l);
const mapItem = (l, i) => isPhoto(l)
  ? `<li><b>${i + 1}</b><span><em>${l}</em> → [사진 바꾸기]를 누르고 내 컴퓨터 사진 고르기</span></li>`
  : `<li><b>${i + 1}</b><span><em>${l}</em> 칸 → 지우고 새로 쓰기</span></li>`;

const ezSecs = META.map(m => {
  const [kick, title, btn, notes] = SEC[m.name];
  return `
    <div class="ez-sec">
      <header><span class="ez-no">${m.id}</span><div><small>${kick}</small><h3>${title}</h3></div></header>
      <p class="ez-lead">이 섹션의 <b>[${btn}]</b>를 누르면 아래 창이 열려요. <b>화면의 번호 = 창의 번호</b>예요.</p>
      <figure class="ez-page"><img src="${S('walk-' + m.id + '-page')}" alt="${title} 화면"></figure>
      <p class="ez-arrow">▼ [고치기]를 누르면 열리는 창</p>
      <figure class="ez-edit"><img src="${S('walk-' + m.id + '-edit')}" alt="${title} 편집 창"></figure>
      <ul class="ez-map">${m.found.map(mapItem).join('')}${notes.map(n => `<li class="ez-note"><b>+</b><span>${n}</span></li>`).join('')}</ul>
    </div>`;
}).join('');

const html = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>baby앙 | 디자인센터 상세페이지</title>
<meta name="description" content="신생아 · 걸음마 아기 · 나들이 용품을 한곳에서. 이벤트와 타임세일, 쿠폰 뽑기까지 갖춘 baby앙 카페24 쇼핑몰 디자인 상세페이지입니다.">
<style>${CSS}
.hero{background-image:url('${I('scene-family-park')}')}
.sale-photo{background-image:url('${I('scene-puddle')}')}
.closing{background-image:url('${I('scene-sleep-linen')}')}
.hero-brand img{width:150px}
</style>
</head>
<body>
<main class="sheet">
  <section class="hero" id="top">
    <div class="hero-brand"><img src="${I('logo-babyang')}" alt="baby앙"></div>
    <div class="hero-stamp">DESIGNED<br>FOR LITTLE<br><b>DAYS</b></div>
    <div class="hero-copy">
      <span class="eyebrow">A Cafe24 shop skin for little ones</span>
      <h1 class="serif">Little days.<br><i>Big love.</i></h1>
      <p>잘 먹고, 신나게 놀고, 포근하게 자는 하루.<br>baby앙은 신생아 · 걸음마 아기 · 나들이 용품을 한곳에서 연결합니다.</p>
      <div class="label-row"><span>첫 화면 12초 육아 일상 영상</span><span>SALE 전용 이벤트 페이지</span><span>랜덤 쿠폰 뽑기 · 마감 카운트다운</span><span>상품별 타임세일</span><span>개월 수 · 필요한 순간 맞춤 탐색</span><span>무료배송 진행바 · 재고 임박 안내</span><span>후기 작성 유도 · 포토리뷰 이벤트</span><span>출산 준비 체크리스트 · 사이즈 가이드</span></div>
    </div>
  </section>
  <section class="easy" id="easy">
    <div class="easy-head"><span class="eyebrow">After purchase · no code</span><h2>구매 후, 이렇게 쉽게 바꿔요</h2><p>코드를 몰라도 돼요.<br><b>바꾸고 싶은 곳의 주황 버튼 → 글 고쳐 쓰기 → 저장</b>, 이게 전부예요.</p></div>
    <div class="ez-try">
      <h3>먼저 딱 한 번 해 볼까요? <span>메인 문구를 우리 가게 문구로</span></h3>
      <div class="ez-step"><p class="t"><b>1</b><span>구매 후 알려 드리는 <em>관리자 전용 주소</em>로 쇼핑몰을 열면, 모든 섹션에 주황색 <em>[고치기]</em> 버튼이 생겨요.</span></p><img src="${S('cms-home')}" alt="고치기 버튼이 생긴 메인 첫 화면"></div>
      <div class="ez-step"><p class="t"><b>2</b><span>[고치기]를 누르면 이 창이 열려요. <em>화면에 있던 글이 칸에 그대로</em> 들어 있으니 지우고 새로 쓰면 돼요.</span></p><img src="${S('walk-01-edit')}" alt="첫 화면 편집 창" class="narrow" style="max-height:760px;object-fit:cover;object-position:top"></div>
      <div class="ez-step"><p class="t"><b>3</b><span><em>[저장하기]</em>를 누르면 끝! 쇼핑몰을 새로고침하면 바로 바뀌어 있어요.</span></p><img src="${S('cms-after')}" alt="새 문구로 바뀐 메인 첫 화면"></div>
      <div class="ez-step"><p class="t"><b>+</b><span>사진도 똑같아요. <em>[사진 바꾸기]</em>를 누르고 내 컴퓨터 사진을 고르면 바로 바뀌어요.</span></p><p class="s">권장 크기와 다르면 바로 알려 줘서, 잘린 사진이 올라가지 않아요.</p></div>
    </div>
    <div class="ez-list-head"><span class="eyebrow">From top to bottom</span><h3>메인 화면, 위에서부터 하나씩</h3><p>모든 섹션이 같은 방법이에요. 화면에 붙은 번호와 창의 번호를 맞춰 보세요.</p></div>
    ${ezSecs}
    <div class="ez-end"><b>세일 페이지 · 상품 목록 위 배너 · 게시판 · 가이드 페이지</b>도 똑같이 [고치기]가 나와요.<br>섹션 숨기기 · 순서 바꾸기도 버튼 하나로, 실수해도 [실행 취소]와 [이전 저장본]으로 되돌려요.<br>카카오톡 상담 버튼도 편집 모드에서 채널 주소만 붙여 넣으면 연결돼요.</div>
  </section>
  <section class="process" id="process">
    <div class="process-head"><span class="eyebrow">After purchase · what happens next?</span><h2>작업 진행 절차 안내</h2><p>주문부터 디자인 적용과 완료 안내까지, 진행 순서를 먼저 확인해 주세요.</p></div>
    <div class="process-grid">
      <article class="process-card"><b><span>01</span> 디자인 선택 및 결제</b><p>디자인과 필요한 구매 옵션을 확인한 뒤 주문·결제를 진행합니다.</p></article>
      <article class="process-card"><b><span>02</span> 주문 접수</b><p>결제 확인 후 안내되는 접수 방법에 따라 쇼핑몰 정보와 요청사항을 전달합니다.</p><a class="process-cta" href="${ORDER_FORM}" target="_blank" rel="noopener">주문서 접수하기</a></article>
      <article class="process-card"><b><span>03</span> 디자인 복사 및 세팅</b><p>접수 내용 확인 후 선택한 상품에 포함된 디자인 복사와 세팅 작업을 진행합니다.</p></article>
      <article class="process-card"><b><span>04</span> 완료 확인 및 매뉴얼 전달</b><p>작업 결과를 확인하고, 디자인 사용에 필요한 매뉴얼과 안내를 전달받습니다.</p></article>
    </div>
    <p class="process-foot">세팅 범위와 준비 정보는 구매 옵션 및 주문 후 안내 내용을 확인해 주세요.</p>
  </section>
  <nav class="quick" aria-label="상세페이지 바로가기">
    <a href="#sale"><span>01 / EVENT</span>행사와 카운트다운</a><a href="#coupon"><span>02 / COUPON</span>쿠폰 뽑기</a><a href="#timesale"><span>03 / TIME SALE</span>상품별 마감 표시</a><a href="#shop"><span>04 / SHOPPING</span>쉬운 상품 찾기</a>
  </nav>
  <section class="intro">
    <div class="brandmark">B</div><span class="eyebrow">Little days, big love</span>
    <h2>쇼핑몰의 첫인상부터<br>구매를 돕는 작은 기능까지</h2>
    <p class="lead">아이와 함께하는 따뜻한 영상과 사진, 개월 수에 맞는 용품을 빠르게 찾는 탐색 구조, 다시 방문하게 만드는 프로모션. 보기 좋은 화면 안에 운영과 구매에 꼭 필요한 흐름을 담았습니다.</p>
  </section>
  <section class="event-hero" id="sale">
    <div class="event-top"><span class="eyebrow">Season sale · a little something for you</span><h2 class="serif">좋은 발견은<br>기다릴 때 더 설레니까</h2><p>SALE 전용 페이지에서 이벤트와 상품 혜택을 한눈에 안내합니다.</p>
      <div class="timer" aria-label="이벤트 종료까지 남은 시간을 보여주는 카운트다운 예시"><div class="timebox"><strong>30</strong><small>DAYS</small></div><div class="timebox"><strong>21</strong><small>HOURS</small></div><div class="timebox"><strong>49</strong><small>MIN</small></div><div class="timebox"><strong>00</strong><small>SEC</small></div></div>
      <p class="micro" style="margin-top:12px;color:#c9bdb1">이벤트 종료 시각에 맞춰 남은 시간이 자동으로 줄어드는 구성</p>
    </div>
    <div class="sale-photo"><div class="sale-caption"><span class="eyebrow">LITTLE ESSENTIALS EDIT</span><h3>Good finds.<br>Little days.</h3><p>우리 아이 하루를 위한 반가운 발견</p><span class="offer">UP TO 50% · LIMITED TIME ONLY</span></div></div>
    <div class="event-strip">SOFT PICKS &nbsp; · &nbsp; LITTLE ESSENTIALS &nbsp; · &nbsp; LITTLE DAYS, BIG LOVE</div>
  </section>
  <section class="section center">
    <span class="eyebrow">One page, more reasons to shop</span><h2>이벤트 안내와 혜택을<br>한 화면에 모아</h2><p class="lead">메인 팝업과 SALE 페이지가 방문자의 시선을 혜택으로 안내하고, 바로 상품을 살펴볼 수 있도록 이어집니다.</p>
    <div class="feature-pair">
      <article class="feature-card"><img src="${I('scene-autumn')}" alt="SALE 이벤트 배너 이미지"><div class="copy"><small>SALE EVENT</small><strong>마감 시간을 보여주는 기획전</strong><p>큰 비주얼과 종료 카운트다운으로 이벤트 기간과 시즌 혜택을 명확하게 전달합니다.</p></div></article>
      <article class="feature-card"><img src="${I('scene-reading')}" alt="포토리뷰 이벤트 이미지"><div class="copy"><small>REVIEW EVENT</small><strong>포토리뷰 참여 안내</strong><p>메인 팝업에서 리뷰 혜택을 소개하고 리뷰 작성 페이지로 연결합니다. 현재 샘플 안내는 포토리뷰 3,000P입니다.</p></div></article>
    </div>
  </section>
  <section class="section coupon-section" id="coupon">
    <div class="coupon-grid">
      <div class="coupon-art"><img src="${I('sq-bunny')}" alt="토끼 모자를 쓴 아기"><span class="coupon-sticker">RANDOM COUPON · MAX 50%</span></div>
      <div class="coupon-copy"><span class="eyebrow">A little gift for you</span><h2>쿠폰 뽑기의 설렘</h2><p class="lead">SALE 페이지에서 회원이 쿠폰을 직접 뽑고, 받은 혜택을 마이쿠폰에서 확인한 뒤 주문서에 적용합니다.</p>
        <div class="coupon-cards"><div class="coupon-card"><span>LUCKY COUPON</span><strong>5%</strong></div><div class="coupon-card"><span>LUCKY COUPON</span><strong>10%</strong></div><div class="coupon-card"><span>LUCKY COUPON</span><strong>20%</strong></div><div class="coupon-card"><span>LUCKY COUPON</span><strong>50%</strong></div></div>
        <h3>참여는 간단하게, 적용은 편리하게</h3><div class="steps"><div class="step"><b>STEP 01</b><span>로그인</span></div><div class="step"><b>STEP 02</b><span>쿠폰 뽑기</span></div><div class="step"><b>STEP 03</b><span>마이쿠폰 확인</span></div><div class="step"><b>STEP 04</b><span>주문서에 적용</span></div></div>
        <div class="note-box"><strong>운영 안내</strong><br>회원 전용 · 1인 1회 참여 · 발급 쿠폰은 마이쿠폰에서 확인 · 사용기간과 적용 조건은 쿠폰별 설정에 따릅니다.</div>
      </div>
    </div>
  </section>
  <section class="section timesale" id="timesale">
    <span class="eyebrow">A moment worth catching</span><h2>타임세일 혜택,<br>상품에서도 바로 확인</h2><p class="lead">타임세일 상품은 상품 카드와 상세 화면에서 할인 배지와 남은 시간을 보여줘 혜택과 기간을 놓치지 않게 돕습니다.</p>
    <div class="timesale-layout">
      <div class="product-shot"><img src="${I('sq-bear')}" alt="곰돌이 후드 우주복 상품 이미지"><span class="sale-badge">TIME SALE</span><div class="floating-timer"><span>혜택 종료까지</span><strong>08 : 24 : 16</strong></div></div>
      <div><div class="mini-window"><div class="mini-head"><b>PRODUCT DETAIL</b><span>혜택 확인이 쉬운 상품 화면</span></div><div class="mini-product"><img src="${I('sq-bear')}" alt="곰돌이 후드 우주복 미리보기"><div><h3>곰돌이 후드 우주복</h3><div class="price"><del>39,000원</del> 31,200원</div><span class="discount">TIME SALE · 20% OFF</span></div></div><div class="bar"><i></i></div><div class="floating-timer" style="position:static;margin-top:14px;background:#f4eee7;color:#3d342d"><span>남은 시간</span><strong style="color:#8d4e3d">08 : 24 : 16</strong></div></div>
        <div class="timesale-copy"><h3>목록에서 보고, 상세에서 다시 확인</h3><ul class="check-list"><li>상품 목록에 SALE 배지와 할인 정보 표시</li><li>상품 상세에 종료 카운트다운 배너 안내</li><li>상품별 종료 시각과 배너 색상을 설정해 운영</li></ul><p class="micro" style="margin-top:14px">표시 예시는 이해를 돕기 위한 샘플이며, 실제 할인율·종료 시각은 상품과 운영 설정에 따라 달라집니다.</p></div>
      </div>
    </div>
  </section>
  <section class="section merchant-tools">
    <div class="merchant-head"><div><span class="eyebrow">More comfort for the shop owner</span><h2>운영에 필요한 편의 기능도<br>꼼꼼하게</h2><p class="lead">고객의 구매 결정을 돕는 안내를 장바구니와 상품 상세의 필요한 위치에 보여줍니다.</p></div></div>
    <div class="merchant-grid">
      <article class="merchant-card"><span class="tiny-label">01 / SHIPPING</span><h3>무료배송 진행바</h3><p>장바구니 상단에서 무료배송 기준까지 남은 금액과 진행 상태를 안내합니다.</p><div class="mock-ui"><small>CART · FREE SHIPPING GOAL</small><strong>15,000원 더 담으면 무료배송</strong><div class="mock-bar"><i></i></div><small style="margin:8px 0 0">무료배송까지 남은 금액을 한눈에 확인</small></div></article>
      <article class="merchant-card"><span class="tiny-label">02 / LOW STOCK</span><h3>재고 임박 표시</h3><p>재고가 얼마 남지 않은 상품은 상세 가격 아래에 남은 수량을 보여줍니다.</p><div class="mock-ui"><small>PRODUCT DETAIL · PRICE</small><div class="mock-price">31,200원 <em>재고 3개 남음 · 품절 임박</em></div></div></article>
      <article class="merchant-card"><span class="tiny-label">03 / REVIEW PROMO</span><h3>후기 작성 유도 배너</h3><p>상품 상세의 후기 영역 위에 참여 문구와 후기 작성 버튼을 배치합니다.</p><div class="mock-ui"><small>JUST ABOVE PRODUCT REVIEWS</small><div class="mock-prompt"><b>구매하신 상품의 후기를 남겨 주세요<br><span style="font-weight:500;color:#8a7867">리뷰 혜택 안내</span></b><span>후기 쓰기 →</span></div></div></article>
    </div>
  </section>
  <section class="section flow">
    <div class="center"><span class="eyebrow">How little is your little one?</span><h2>우리 아이에게 맞는 길을<br>먼저 보여주세요</h2><p class="lead">개월 수와 필요한 순간을 고르면 어울리는 상품으로 연결되는 간단한 추천 도구를 제공합니다.</p></div>
    <div class="flow-grid"><article class="flow-card"><div class="photo"><img src="${I('card-newborn')}" alt="신생아 카테고리"></div><div class="copy"><small>01 / NEWBORN</small><h3>신생아 · 영아</h3><p>배냇저고리 · 속싸개 · 수유 · 기저귀 카테고리로 바로 이동</p></div></article><article class="flow-card"><div class="photo"><img src="${I('card-toddler')}" alt="걸음마 아기 카테고리"></div><div class="copy"><small>02 / TODDLER</small><h3>걸음마 아기</h3><p>식기 · 빨대컵 · 걸음마 신발 · 장난감으로 바로 이동</p></div></article><article class="flow-card"><div class="photo"><img src="${I('scene-park')}" alt="공원 나들이"></div><div class="copy"><small>03 / MOMENT</small><h3>지금 필요한 순간</h3><p>잠 · 놀이 · 외출 중 골라 관련 상품을 확인</p></div></article></div>
  </section>
  <section class="section shopping" id="shop">
    <div class="center"><span class="eyebrow">A clear path to the right product</span><h2>찾기 쉽고, 비교하기 편한<br>상품 탐색</h2><p class="lead">개월 수별 바로가기부터 추천 상품, 새로 들어온 상품, 인기 상품까지. 필요한 용품을 빠르게 만날 수 있습니다.</p></div>
    <div class="shop-demo"><div class="shop-top"><b>SHOP BY CATEGORY</b><span>카테고리를 눌러 상품 둘러보기</span></div><div class="category-pills"><span>전체</span><span>배냇저고리</span><span>속싸개</span><span>수유 · 이유식</span><span>장난감</span><span>침구</span><span>나들이</span><span>신발</span></div><div class="product-row"><div class="product-card"><img src="${I('sq-sleep')}" alt="속싸개 추천 상품"><div><b>린넨 거즈 속싸개</b><small>신생아</small><div class="icons">♡　＋</div></div></div><div class="product-card"><img src="${I('sq-toy')}" alt="원목 장난감 상품"><div><b>원목 쌓기 블록</b><small>걸음마 아기</small><div class="icons">♡　＋</div></div></div><div class="product-card"><img src="${I('sq-highchair')}" alt="하이체어 상품"><div><b>원목 하이체어</b><small>걸음마 아기 · 이유식</small><div class="icons">♡　＋</div></div></div><div class="product-card"><img src="${I('sq-puddle')}" alt="우비 세트 상품"><div><b>노란 우비 &amp; 장화</b><small>외출/나들이</small><div class="icons">♡　＋</div></div></div></div><div class="shop-benefits"><div><b>찜하기</b><span>마음에 든 상품을 저장</span></div><div><b>빠른 장바구니</b><span>상품 카드에서 담기</span></div><div><b>정렬해서 비교</b><span>신상품·가격·리뷰순 확인</span></div></div></div>
  </section>
  <section class="section convenience">
    <div class="center"><span class="eyebrow">Small helps for everyday decisions</span><h2>구매 전 고민을 덜어주는<br>실용적인 안내</h2><p class="lead">출산 준비물부터 옷 사이즈, 배송 확인까지. 자주 묻는 내용을 필요한 자리에 배치했습니다.</p></div>
    <div class="convenience-grid"><div class="convenience-photo"><img src="${I('starter-nursery')}" alt="아기 방"></div><div class="tool-list"><div class="tool-row"><div class="tool-icon">01</div><div><b>출산 준비 체크리스트</b><span>꼭 필요한 준비물을 체크하고 진행 상황 저장</span></div><em>CHECK</em></div><div class="tool-row"><div class="tool-icon">02</div><div><b>아기 옷 사이즈 가이드</b><span>키 · 몸무게로 고르는 사이즈 표와 재는 법 안내</span></div><em>GUIDE</em></div><div class="tool-row"><div class="tool-icon">03</div><div><b>상품별 상세 문의</b><span>소재나 배송 문의를 게시판으로 연결</span></div><em>Q&amp;A</em></div><div class="tool-row"><div class="tool-icon">04</div><div><b>FAQ 아코디언</b><span>배송 · 소재 · 선물 포장 · 교환 질문 빠르게 확인</span></div><em>HELP</em></div><div class="tool-row"><div class="tool-icon">05</div><div><b>마이페이지 한곳에서</b><span>관심상품 · 주문/배송 · 보유 쿠폰 조회</span></div><em>MY PAGE</em></div></div></div>
  </section>
  <section class="section proof">
    <span class="eyebrow">Stories from every family</span><h2>사용 경험이 다음 선택으로<br>이어지도록</h2><p class="lead">상품에 연결된 구매 후기와 포토리뷰를 통해 실제 사용 경험을 확인하고, 리뷰 이벤트로 참여를 안내합니다.</p>
    <div class="review-banner"><img src="${I('scene-blocks')}" alt="원목 블록을 쌓는 아이들"><div class="review-copy"><span class="star">★★★★★</span><h3>포토리뷰로 나누는<br>우리 아이 하루</h3><p>상품 사진과 후기를 살펴보고, 구매 후에는 나만의 경험을 남겨보세요. 상품 카드마다 평점과 리뷰 수가 붙고, 메인에는 최신 포토리뷰가 모여요.</p><span class="reward">샘플 이벤트 · 포토리뷰 3,000P</span></div></div>
  </section>
  <section class="section" style="background:#f2e9df">
    <div class="split"><div><span class="eyebrow">A design that feels like a brand</span><h2>따뜻한 이미지와<br>정돈된 구성</h2><p class="lead">크림과 세이지 톤, 햇살 가득한 육아 일상 사진, 여백을 살린 타이포그래피로 아기 용품을 편안하게 보여줍니다. PC와 모바일 화면에 맞춰 자연스럽게 정리됩니다.</p><div class="label-row"><span>육아 일상 영상 · 사진 메인 비주얼</span><span>반응형 화면</span><span>브랜드 컬러 구성</span></div></div><div class="img-panel"><img src="${I('scene-mom')}" alt="엄마와 아기 라이프스타일 이미지"></div></div>
  </section>
  <section class="closing"><span class="eyebrow">Your shop, ready for little ones</span><h2 class="serif">필요한 기능을 갖춘<br>나만의 유아동 쇼핑몰을 시작하세요</h2><p>baby앙으로 이벤트를 알리고, 혜택을 전하고, 엄마 아빠의 편리한 쇼핑을 만들어보세요.</p><a href="${SAMPLE}" target="_blank" rel="noopener">샘플 사이트 둘러보기 ↗</a></section>
  <footer class="footer"><b>BABYANG</b><p>Events · Time Sale · Lucky Coupon · Everyday Baby Shopping</p><p>※ 이미지와 상품 예시는 baby앙 사이트 화면 구성을 소개하기 위한 샘플입니다. 이벤트 혜택·상품·재고·가격·기간은 운영 설정에 따라 변경될 수 있습니다.</p></footer>
</main>
</body>
</html>
`;
fs.writeFileSync(path.join(DC, 'detail.html'), html);
console.log('ok', html.length);
