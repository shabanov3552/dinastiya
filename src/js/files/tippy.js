// Подключение функционала "Чертогов Фрилансера"
import { isMobile, FLS } from "./functions.js";
// Подключение списка активных модулей
import { flsModules } from "./modules.js";

// Подключение из node_modules
import tippy from 'tippy.js';

// Подключение cтилей из src/scss/libs
import "../../scss/libs/tippy.scss";
// Подключение cтилей из node_modules
//import 'tippy.js/dist/tippy.css';

// Запускаем и добавляем в объект модулей
flsModules.tippy = tippy('[data-tippy-content]', {
   placement: 'right-end',
});
const breakpoint = window.matchMedia("(max-width: 768px)");

const breakpointChecker = () => {
   if (breakpoint.matches) {
      for (let i = 0; i < flsModules.tippy.length; i++) {
         flsModules.tippy[i].setProps({
            placement: "top"
         });
      }

   } else {
      for (let i = 0; i < flsModules.tippy.length; i++) {
         flsModules.tippy[i].setProps({
            placement: "right-end"
         });
      }
   }
};

breakpoint.addEventListener("change", breakpointChecker);
breakpointChecker();

//#region Добавление подсказок к кнопкам 

class CustomTippy {
   constructor(node, text, activeText) {
      this.node = node;
      this.text = text;
      this.activeText = activeText;
      this.tippyItem = tippy(this.node);
      this.isMobile = isMobile.any();
      this.breakpoint = null;
   }

   initTippy() {
      this.tippyItem.setContent(`Добавить в ${this.text}`);

      let observer = new MutationObserver(records => {
         records[0].target.classList.forEach(item => {
            item == '_active' ? this.tippyItem.setContent(`Удалить из ${this.activeText}`) : this.tippyItem.setContent(`Добавить в ${this.text}`);
         });
      });

      observer.observe(this.node, {
         subtree: true,
         attributes: true,
      });
      this.breakpointCheck();
      this.node.addEventListener("click", (e) => { this.createMobileTippy(e) });
   }

   breakpointCheck() {

      const breakpoint = window.matchMedia("(max-width: 768px)");

      const breakpointChecker = () => {
         if (breakpoint.matches) {
            this.breakpoint = true;
            this.tippyItem.disable();
         } else {
            this.breakpoint = false;
            this.tippyItem.enable();
         }
      };

      breakpoint.addEventListener("change", breakpointChecker);
      breakpointChecker();
   }

   createMobileTippy(e) {

      if (this.breakpoint) {
         let element = document.createElement('div');
         element.classList.add('action-notification');

         if (!this.node.classList.contains('_active')) {
            element.insertAdjacentHTML('afterbegin', `
				<p>Товар добавлен в ${this.text}</p>
			`);
         } else {
            element.insertAdjacentHTML('afterbegin', `
				<p>Товар удален из ${this.activeText}</p>
			`);
         }

         document.querySelector('.wrapper').insertAdjacentElement('afterend', element);
         setTimeout(() => {
            element.classList.add('show');
            setTimeout(() => {
               element.classList.remove('show');
               element.remove();
            }, 2000);
         }, 100);
      }
   }
}

const favorButtons = document.querySelectorAll('.product-card__btn-favorites');
favorButtons.forEach(element => {
   let tip = new CustomTippy(element, 'избранное', 'избранного');
   tip.initTippy();
});

const favorBasketButtons = document.querySelectorAll('.basket-card__favor');
favorBasketButtons.forEach(element => {
   let tip = new CustomTippy(element, 'избранное', 'избранного');
   tip.initTippy();
});

if (document.querySelector('.product')) {
   let productFavorTippy = new CustomTippy(document.querySelector('.product__btn-favorites'), 'избранное', 'избранного');
   productFavorTippy.initTippy();

   // let productCompareTippy = new CustomTippy(document.querySelector('.product__btn-compare'), 'сравнение', 'сравнения');
   // productCompareTippy.initTippy();
}

//#endregion