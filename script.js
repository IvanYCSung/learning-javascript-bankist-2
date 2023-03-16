'use strict';

///////////////////////////////////////////////////////
////////// Modal window //////////

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

const openModal = function (e) {
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
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

////////// button scrolling //////////
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  section1.scrollIntoView({ behavior: 'smooth' });
});

////////// page navigation //////////
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });
// we do usually not use above as it creates multiple copies of the event when the webpage loads, that slows down webpage speed. we use event delegation (event propagation) below...
// 1. add event listener to common parent element
// 2. determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

////////// tabbed component //////////
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // guard clause
  if (!clicked) return;

  // remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // activate tab

  clicked.classList.add('operations__tab--active');

  // activate content aera
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

////////// menu fade animaion //////////
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// passing "arguments" into handler by using .bind with a function
// function.bind return a new separate function...
nav.addEventListener('mouseover', handleHover.bind(0.5));
// mouseover is similiar to mouseenter, but mouseover does bubble up

nav.addEventListener('mouseout', handleHover.bind(1));
// mouseout is similar to mouseleave, but mouseout does bubble up

// or we do without .bind
// nav.addEventListener('mouseover', function(e){
//  handleHover(e, 0.5 / 1)
// });

////////// sticky navigation //////////
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);

// window.addEventListener('scroll', function () {
//   console.log(window.scrollY);
//   if (this.window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// we don't usually use 'scroll' as it calls the function every scroll, that will slow down webpage, instead we use API below...
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
console.log(navHeight);

const stickyNav = function (entries) {
  console.log(entries);

  const [entry] = entries; // === entries[0]

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, // it only takes px
});

headerObserver.observe(header);

// see how API works below...
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry, observer);
//   });
// };

// const obsOptions = {
//   root: null, // setting root to null means viewport
//   threshold: [0, 0.2], // setting intersectionRatio
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);
// console.log(observer);

////////// reveal section //////////
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

////////// lazy loading images //////////
const imgTargets = document.querySelectorAll('img[data-src]');
// img[] is how you select data attributes

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    // 'load' is to load the target first and then call the function
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

////////// slider component //////////
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  let curSlide = 0;
  const maxSlide = slides.length;
  const dotContainer = document.querySelector('.dots');

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const preSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const int = function () {
    createDots();
    activateDot(0); // set the first dot as default
    goToSlide(0); // set the first slide as default
    // slide translateX 0%, 100%, 200%, 300%
  };
  int();

  btnRight.addEventListener('click', nextSlide);
  // slide translateX -100%, 0%, 100%, 200%
  btnLeft.addEventListener('click', preSlide);
  // slide translateX 0%, 100%, 200%, 300%

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') preSlide();
    // or we can use short circuting
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset; // = slide = e.target.dataset.slide
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
/*
//----- selecting elements -----//
console.log(document.documentElement); // selecting all the elements in the document
console.log(document.head); // selecting <head> in the document
console.log(document.body);

const header = document.querySelector('.header'); // selecting element name with querySelector
const allSection = document.querySelectorAll('.section'); // selecting all .section and return a node list
console.log(allSection);
document.getElementById('section--1'); // selecting element name with getElementById and no need to enter "."
const allButton = document.getElementsByTagName('button'); // selecting <button> without "." and return a live HTML collection
console.log(allButton);
console.log(document.getElementsByClassName('btn')); // selecting the same class names without "." and return a live HTML collection

//----- creating and inserting elements -----//
// .insertAdjecentHTML is to insert HTML from JS
const message = document.createElement('div'); // we create an element from JS, but not live DOM
message.classList.add('cookie--messsage');
// message.textContent = 'We use cookied for improved functionality and analytics.'
// message.textContent is only to add text, we can use innerHTML to add text and HTML
message.innerHTML =
  'We use cookied for improved functionality and analytics. <button class="btn btn--close--cookie">Got it!</button>';

// insert the element we created into HTML, but it only appear one place because it is not a live DOM and one element can only appear one place
// .prepend and .append add element on the top / bottom of the selected element
header.append(message);
header.prepend(message);

// we can clone the message in order to appear at multiple places
//header.append(message.cloneNode(true));

// .before and .after add element next to the selected element
header.before(message);
header.after(message);

//----- deleting elements -----//
document
  .querySelector('.btn--close--cookie')
  .addEventListener('click', function () {
    // message.parentElement.removeChild(message); old way to remove elements, before JS had .remove()
    message.remove();
  });

//----- style -----//
message.style.backgroundColor = '#37838d';
message.style.width = '120%'; // including unit

console.log(message.style.backgroundColor); // it is inline style (in HTML), it can show in console
console.log(message.style.color); // it is not inline style, it is in CSS
console.log(message.style.height); // it is not inline style

console.log(getComputedStyle(message)); // to get all the properties from message
console.log(getComputedStyle(message).color); // to get color property from message
console.log(getComputedStyle(message).height); // to get height property from message

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px'; // we cannot add 40 to 49.5333px, so remove px first and then add 40 and px later

// another way to change all type of properties values
document.documentElement.style.setProperty('--color-primary', 'orange');

//----- attributes -----//
const logo = document.querySelector('.nav__logo');
console.log(logo.alt); // standard property
console.log(logo.src); // standard property
console.log(logo.className); // standard property

logo.alt = 'Beautiful mininalist logo'; // change alt property in the DOM, HTML does not get changed

console.log(logo.designer); // non standard property, cannot be read by this way
console.log(logo.getAttribute('designer')); // read non standard property
console.log(logo.setAttribute('company', 'Bankist')); // add a new attribute and its value

console.log(logo.src); // abosolute location
console.log(logo.getAttribute('src')); // relative location

const link = document.querySelector('.nav__link--btn');
console.log(link.href); // abosolute location
console.log(link.getAttribute('href')); // relative location

//----- data attributes -----//
// any HTML attributes start with "data" will become "data attribute" and be part of dataset
console.log(logo.dataset.versionNumber); // in HTML, the name of the attribute is "data-version-number", but we enter "dataset.versionNumber" in JS

//----- classes -----//
logo.classList.add('c', 'j')
logo.classList.remove('c', 'j')
logo.classList.toggle('c')
logo.classList.contains('c')

// DO NOT USE BELOW, IT OVERWRITES EVERYTHING WE CREATED ABOVE
// logo.className = 'jonas'
*/

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
/*
//----- smooth scrolling -----//
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect(); // to get position X, Y, width, height, top...etc
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect()); // the target("learn more") position

  console.log('current scroll (X/Y)', window.pageXOffset, window.pageYOffset); // to show the current coordinates of the scroll

  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  ); // to show the size of the viewport

  // scrolling - old way
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // scrolling - modern way, no calculation above
  section1.scrollIntoView({ behavior: 'smooth' });
});
*/

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
/*
//----- types of events and event handlers -----//
const h1 = document.querySelector('h1');
// modern wy to listen events
// h1.addEventListener('mouseenter', function (e) {
//   alert('addEbentlistener: Great! You are reading the heading.');
// });

// the old way to listen events, but it cannot listen multiple events or remove events
// h1.onmouseenter = function (e) {
//   alert('addEbentlistener: Great! You are reading the heading.');
// };

//----- remove events -----//
const alertH1 = function (e) {
  alert('addEbentlistener: Great! You are reading the heading.');
  h1.removeEventListener('mouseenter', alertH1);
}; // the event only gets called once

h1.addEventListener('mouseenter', alertH1);

setTimeout(() => {
  h1.removeEventListener('mouseenter', alertH1)
}, 3000); // or we can set a timer to remove events
*/

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
/*
//----- events bubbling and propagation -----//

// capturing phase: .nav => .nav__links => .nav__link
// bubbling phase: .nav__link => .nav__links => .nav

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);
  console.log(e.currentTarget === this);

  // stop propagation
  // e.stopPropagation(); stop the event at this point, not more bubbling
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    this.style.backgroundColor = randomColor();
    console.log('NAV', e.target, e.currentTarget);
  }
  // true
  // the 3rd parameter set to true in .addEventListener is to trigger the event happening at capturing phase. If we do not set it, the default is false.
);

// e.tagart shows where we click
// e.currentTarget shows where listener is on
*/

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
/*
//----- DOM travering -----//
const h1 = document.querySelector('h1');

// going downwards: child
console.log(h1.querySelectorAll('.highlight')); // it selects all .highlight in h1 as deep as it can
console.log(h1.childNodes); // giving a nodelist with all the elements
console.log(h1.children); // giving a live HTML collection from the direct child
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

// going upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-secondary)'; // going up to find the closest .header, parent elements or itself
h1.closest('h1').style.background = 'var(--gradient-primary)'; // selecting the closest h1 element which itself

// going sideways: siblings
console.log(h1.previousElementSibling); // no previouse element, so it's null
console.log(h1.nextElementSibling);

console.log(h1.previousSibling); // giving us not just element
console.log(h1.nextSibling); // giving us not just element

console.log(h1.parentElement.children); // the way to select all the sibling elements by going up to the parent and then select all children

// HTML collect can be spreaded into arry for further actions
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)';
});
*/

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
/*
//----- lifecycle DOM event -----//
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built', e);
});
// DOMContentLoaded is after HTML and JS loaded
// if we have <script src="script.js"></script> at the end of HTML, it also means the same

window.addEventListener('load', function (e) {
  console.log('page full leaded', e);
});
// after HTML, JS, images and the whole page loaded

window.addEventListener('beforeunload', function (e) {
  e.preventDefault(); // it is used on the other website
  console.log(e);
  e.returnValue = 'ok'; // enter the message in the pop up window, but we cannot mulipulate the meesage anymore
});
// usually use on pop up window before users leave the webpage
*/
