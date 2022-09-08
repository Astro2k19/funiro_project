/*
Документация по работе в шаблоне: 
Документация слайдера: https://swiperjs.com/
Сниппет(HTML): swiper
*/

// Подключаем слайдер Swiper из node_modules
// При необходимости подключаем дополнительные модули слайдера, указывая их в {} через запятую
// Пример: { Navigation, Autoplay }
import Swiper, { Navigation, Pagination, Parallax } from 'swiper';
/*
Основниые модули слайдера:
Navigation, Pagination, Autoplay, 
EffectFade, Lazy, Manipulation
Подробнее смотри https://swiperjs.com/
*/
 
// Стили Swiper
// Базовые стили
import "../../scss/base/swiper.scss";
// Полный набор стилей из scss/libs/swiper.scss
// import "../../scss/libs/swiper.scss";
// Полный набор стилей из node_modules
// import 'swiper/css';

// Инициализация слайдеров
function initSliders() {
	// Перечень слайдеров
	// Проверяем, есть ли слайдер на стронице
	if (document.querySelector('.slider-main__body')) { // Указываем скласс нужного слайдера
		// Создаем слайдер
		new Swiper('.slider-main__body', { // Указываем скласс нужного слайдера
			modules: [Navigation, Pagination, Parallax],
			slidesPerView: 1,
			autoHeight: true,
			speed: 800,
			spaceBetween: 20,
			loop: true,  
			parallax: true,
			watchOverflow: true,
			
			pagination: {
				el: '.slider-main-controls__dots',
				clickable: true, 
				type: 'bullets',
			},

			navigation: {
				prevEl: '.slider-main .slider-arrow_prev',  
				nextEl: '.slider-main .slider-arrow_next',
			},
			breakpoints: {
				// when window width is >= 320px
				992: {  
					spaceBetween: 32,
				},
			  }
		});
	}

	if (document.querySelector('.slider-rooms__body')) { 
		new Swiper('.slider-rooms__body', {  
			modules: [Navigation, Pagination, Parallax],
			slidesPerView: 'auto',
			speed: 800,
			spaceBetween: 24,
			loop: true,  
			parallax: true,
			watchOverflow: true,
			
			pagination: {
				el: '.slider-rooms__dots',
				clickable: true, 
				type: 'bullets',
			},

			navigation: {
				prevEl: '.slider-rooms .slider-arrow_prev',  
				nextEl: '.slider-rooms .slider-arrow_next',
			}
		});
	}

	if (document.querySelector('.slider-tips__body')) { 
		new Swiper('.slider-tips__body', {  
			modules: [Navigation, Pagination],
			slidesPerView: 3,
			speed: 800,
			spaceBetween: 32,
			loop: true,  
			watchOverflow: true,
			
			pagination: {
				el: '.slider-tips__dots',
				clickable: true, 
				type: 'bullets',
			},

			navigation: {
				prevEl: '.slider-tips .slider-arrow_prev',  
				nextEl: '.slider-tips .slider-arrow_next',
			}, 

			breakpoints: { 

				320: {
				  slidesPerView: 1.1,
				  spaceBetween: 20
				},

				767: {
				  slidesPerView: 2,
				  spaceBetween: 25
				},

				992: {
				  slidesPerView: 3,
				  spaceBetween: 32
				}
			  }
		});
	}

}
// Скролл на базе слайдера (по классу swiper_scroll для оболочки слайдера)
function initSlidersScroll() {
	let sliderScrollItems = document.querySelectorAll('.swiper_scroll');
	if (sliderScrollItems.length > 0) {
		for (let index = 0; index < sliderScrollItems.length; index++) {
			const sliderScrollItem = sliderScrollItems[index];
			const sliderScrollBar = sliderScrollItem.querySelector('.swiper-scrollbar');
			const sliderScroll = new Swiper(sliderScrollItem, {
				observer: true,
				observeParents: true,
				direction: 'vertical',
				slidesPerView: 'auto',
				freeMode: {
					enabled: true,
				},
				scrollbar: {
					el: sliderScrollBar,
					draggable: true,
					snapOnRelease: false
				},
				mousewheel: {
					releaseOnEdges: true,
				},
			});
			sliderScroll.scrollbar.updateSize();
		}
	}
}

window.addEventListener("load", function (e) {
	// Запуск инициализации слайдеров
	initSliders();
	// Запуск инициализации скролла на базе слайдера (по классу swiper_scroll)
	//initSlidersScroll();
});