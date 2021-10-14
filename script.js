'use strict';

// MODAL

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function(e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
});



// NAVIGATION SCROLL

document.querySelector('.nav__links').addEventListener('click', function(e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    const coords = document.querySelector(id).getBoundingClientRect();
    window.scrollTo({
      top: window.scrollY + coords.top,
      left: window.scrollX + coords.left,
      behavior: 'smooth'
    });
  }
});

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function() {
  const coords = section1.getBoundingClientRect();

  window.scrollTo({
    top: window.scrollY + coords.top,
    left: window.scrollX + coords.left,
    behavior: 'smooth'
  });
});



// NAVIGATION HOVER

const nav = document.querySelector('.nav');

function handleHover(e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;

    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });

    document.querySelector('.nav__logo').style.opacity = this;
  }
}

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));



// STICKY NAVIGATION

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

function stickyNav([entry]) {
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}

new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
}).observe(header);



// REVEALING SECTIONS

const allSections = document.querySelectorAll('.section');

function revealSection([entry], observer) {
  if (entry.isIntersecting) {
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  }
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15
});

allSections.forEach(section => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});



// TABBED COMPONENT

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const contents = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function(e) {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;

  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  contents.forEach(c => c.classList.remove('operations__content--active'));

  clicked.classList.add('operations__tab--active');
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});



// LAZY IMAGES

const imgTargets = document.querySelectorAll('img[data-src]');

function observeImg([entry], observer) {
  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function() {
    this.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(observeImg, {
  root: null,
  threshold: 0,
  rootMargin: '-200px'
});

imgTargets.forEach(img => imgObserver.observe(img));



// SLIDER

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotsContainer = document.querySelector('.dots');

let currentSlide = 0;
const maxSlideLength = slides.length;

// functions
function createDots() {
  slides.forEach((_, i) => {
    dotsContainer.insertAdjacentHTML('beforeend', `
      <button class='dots__dot' data-slide='${i}'></button>
    `);
  });
}

function changeSlide(slide = 0) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });

  document.querySelectorAll('.dots__dot').forEach(dot => {
    dot.classList.remove('dots__dot--active');
  });

  document.querySelector(`.dots__dot[data-slide='${slide}']`)
    .classList.add('dots__dot--active');
}

function prevSlide() {
  if (currentSlide === 0) currentSlide = maxSlideLength - 1;
  else currentSlide--;

  changeSlide(currentSlide);
}

function nextSlide() {
  if (currentSlide === maxSlideLength - 1) currentSlide = 0;
  else currentSlide++;

  changeSlide(currentSlide);
}

// INITIALIZATION
createDots();
changeSlide();

// EVENTS
btnLeft.addEventListener('click', prevSlide);
btnRight.addEventListener('click', nextSlide);

document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowLeft') prevSlide();
  else if (e.key === 'ArrowRight') nextSlide();
});

dotsContainer.addEventListener('click', function(e) {
  if (e.target.classList.contains('dots__dot')) {
    currentSlide = +e.target.dataset.slide;
    changeSlide(currentSlide);
  }
});