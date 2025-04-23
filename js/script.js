document.addEventListener("DOMContentLoaded", function () {
  // === 공통 유틸 ===
  function safeQuery(selector) {
    return document.querySelector(selector);
  }

  function safeQueryAll(selector) {
    return document.querySelectorAll(selector);
  }

  // === 1. Main 슬라이더 ===
  (function initMainSlider() {
    let index = 0;
    const slides = safeQueryAll(".slide");
    const total = slides.length;
    const slider = safeQuery(".slider");

    if (!slider || total === 0) return;

    function move(n) {
      index = (index + n + total) % total;
      slider.style.transform = `translateX(-${index * 33.3333}%)`;
    }

    safeQuery(".main-prev")?.addEventListener("click", () => move(-1));
    safeQuery(".main-next")?.addEventListener("click", () => move(1));
    setInterval(() => move(1), 3000);
  })();

  // === 2. MD's Pick 슬라이더 ===
  (function initMdSlider() {
    const slider = safeQuery('.md-slider');
    const slides = safeQueryAll('.md-slide');
    const prevBtn = safeQuery('.md-prev');
    const nextBtn = safeQuery('.md-next');

    if (!slider || slides.length === 0) return;

    let index = 0;

    function showSlide(i) {
      slider.style.transform = `translateX(-${i * 25}%)`;
    }

    function nextSlide() {
      index = (index + 1) % slides.length;
      showSlide(index);
    }

    function prevSlide() {
      index = (index - 1 + slides.length) % slides.length;
      showSlide(index);
    }

    nextBtn?.addEventListener('click', nextSlide);
    prevBtn?.addEventListener('click', prevSlide);

    setInterval(nextSlide, 4000);
  })();

  // === 3. Event 슬라이더 ===
  (function initEventSlider() {
    const track = safeQuery('.carousel-track');
    const nextBtn = safeQuery('.event-next');
    const prevBtn = safeQuery('.event-prev');

    if (!track || track.children.length < 1) return;

    let eventHandler = true;

    // 클론 슬라이드 추가 (한 번만 실행)
    if (!track.querySelector('.cloned')) {
      const cloneFirst = track.firstElementChild.cloneNode(true);
      const cloneLast = track.lastElementChild.cloneNode(true);
      cloneFirst.classList.add('cloned');
      cloneLast.classList.add('cloned');
      track.insertBefore(cloneLast, track.firstElementChild);
      track.appendChild(cloneFirst);
    }

    track.children[1]?.classList.add('current-slide');
    const slideWidth = track.children[1].getBoundingClientRect().width;
    track.style.transform = `translateX(-${slideWidth}px)`;

    function moveSlide(direction) {
      if (!eventHandler) return;
      eventHandler = false;

      const delta = direction === 'next' ? -2 : 0;
      track.style.transition = 'transform 0.5s ease-out';
      track.style.transform = `translateX(-${slideWidth * Math.abs(delta)}px)`;

      setTimeout(() => {
        track.style.transition = '';
        track.style.transform = `translateX(-${slideWidth}px)`;

        if (direction === 'next') {
          const first = track.firstElementChild;
          track.appendChild(first);
        } else {
          const last = track.lastElementChild;
          track.insertBefore(last, track.firstElementChild);
        }

        safeQueryAll('.carousel-slide').forEach(slide => slide.classList.remove('current-slide'));
        track.children[1]?.classList.add('current-slide');
        eventHandler = true;
      }, 500);
    }

    nextBtn?.addEventListener('click', () => moveSlide('next'));
    prevBtn?.addEventListener('click', () => moveSlide('prev'));
  })();

  let current = 0;
  // === 4. Review 슬라이더 ===
  (function initReviewSlider() {
    const totalSlides = safeQueryAll(".review-slide").length;
    const slider = safeQuery(".review-slider");

    if (!slider || totalSlides === 0) return;

    function update() {
      slider.style.transform = `translateX(-${current * 33.3333}%)`;

      safeQueryAll(".review-item").forEach((item, idx) => {
        item.classList.toggle("active", idx === current);
      });

      safeQueryAll(".review-hashtag").forEach((tag, idx) => {
        tag.classList.toggle("active", idx === current);
      });

      safeQueryAll(".review-buttons button").forEach((btn, idx) => {
        btn.classList.toggle("active", idx === current);
      });
    }

    setInterval(() => {
      current = (current + 1) % totalSlides;
      update();
    }, 3000);

    update();
  })();



  // === 5. Cursor Effect ===
  (function initCursorEffect() {
    const cursor = safeQuery(".cursor_effect");
    const cursorIcon = safeQuery(".cursor_icon");

    if (!cursor) return;

    document.documentElement.addEventListener("mousemove", (e) => {
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });

    safeQueryAll("a").forEach(anchor => {
      anchor.addEventListener("mouseover", () => cursor.classList.add("on"));
      anchor.addEventListener("mouseout", () => cursor.classList.remove("on"));
    });

    document.documentElement.addEventListener("mousedown", () => {
      cursorIcon?.classList.add("active");
    });

    document.documentElement.addEventListener("mouseup", () => {
      cursorIcon?.classList.remove("active");
    });
  })();
});

function moveReview(n) {
  current = n;
  const totalSlides = document.querySelectorAll(".review-slide").length;
  const slider = document.querySelector(".review-slider");

  if (!slider || totalSlides === 0) return;

  slider.style.transform = `translateX(-${current * 33.3333}%)`;

  document.querySelectorAll(".review-item").forEach((item, idx) => {
    item.classList.toggle("active", idx === current);
  });

  document.querySelectorAll(".review-hashtag").forEach((tag, idx) => {
    tag.classList.toggle("active", idx === current);
  });

  document.querySelectorAll(".review-buttons button").forEach((btn, idx) => {
    btn.classList.toggle("active", idx === current);
  });
}

// === 6. 상품 목록 가져오기(각카테고리) ===
window.addEventListener('load', function () {
  // 상품 목록을 가져오기
  const productList = document.querySelectorAll('.product-item');

  // 상품 개수 계산
  const productCount = productList.length;

  // 상품 개수를 표시
  const productCountElement = document.getElementById('product-count');
  productCountElement.textContent = productCount;
});

/*9개 이상되면 2페이지 넘어감*/
const itemsPerPage = 9;
let currentPage = 1;

const allItems = Array.from(document.querySelectorAll('.product-item'));
const totalProducts = allItems.length;
const totalPages = Math.ceil(totalProducts / itemsPerPage);

// 총 상품 수 표시
document.getElementById('product-count').textContent = totalProducts;

function showPage(page) {
  currentPage = page;
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  allItems.forEach((item, index) => {
    item.style.display = (index >= start && index < end) ? 'block' : 'none';
  });

  updatePagination();
}

function updatePagination() {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.classList.toggle('active', i === currentPage);
    btn.addEventListener('click', () => showPage(i));
    pagination.appendChild(btn);
  }
}

// 첫 페이지 렌더
showPage(1);