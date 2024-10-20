// Подключение функционала "Чертогов Фрилансера"
import { isMobile, bodyLockToggle, bodyLockStatus, _slideUp, _slideDown, _slideToggle } from "./functions.js";
// Подключение списка активных модулей
import { flsModules } from "./modules.js";

//#region Глобальный клик

document.addEventListener("click", function (e) {
   // очистка input по клику на крестик
   if (e.target.closest('.form__clear-svg')) {
      let input = e.target.closest('.form__line').querySelector('.form__input') || e.target.closest('.form__line').querySelector('.form__txt');
      input.value = '';
      input.classList.remove('_form-focus');
      input.parentElement.classList.remove('_form-focus');
      e.target.closest('.form__clear-svg').classList.remove('_active');
      // Inputmask.remove(input);
      // input.style.height = `auto`;
   }

   // автовысота для textarea
   if (e.target.closest('textarea')) {
      txtarAutoHeight(e.target)
   }
});

//#endregion

//#region автовысота для textarea

function txtarAutoHeight(target) {
   const el = target;
   if (el.closest('textarea')) {

      let origHeight
      if (el.dataset.height) {
         origHeight = el.dataset.height
      } else {
         origHeight = el.scrollHeight
         el.dataset.height = origHeight
      }
      origHeight = Number(origHeight)
      el.style.height = el.setAttribute('style', 'height: ' + (origHeight + 1) + 'px');
      el.addEventListener('input', e => {
         if (el.scrollHeight > origHeight) {
            el.style.height = 'auto';
            el.style.height = (el.scrollHeight) + 10 + 'px';
         } else {
            el.style.height = 'auto';
            el.style.height = origHeight + 'px';
         }
      });
   }
}

//#endregion

//#region Функционал дропдаунов открыть\закрыть

document.addEventListener("click", function (e) {
   const target = e.target;
   const ddWrapper = target.closest('[data-dropdown]');
   const ddActive = document.querySelector('._dd-active');

   if (ddWrapper) {
      dropdownAction(e, ddWrapper, ddActive);
   } else if (target.closest('.zones__link[data-zone]')) {
      let zone = e.target.closest('.zones__link[data-zone]').dataset.zone
      dropdownAction(e, document.querySelector(`[data-dropdown=${zone}]`), ddActive)
   } else if (ddActive) {
      ddActive.classList.remove('_dd-active');
   }

});

function dropdownAction(e, ddWrapper, ddActive) {
   // debugger
   const target = e.target;
   const ddButton = ddWrapper.querySelector('[data-dropdown-button]');
   const input = ddWrapper.querySelector('input');

   if (target == ddButton || target.closest('[data-dropdown-button]') || target.closest('[data-zone]')) {
      if (ddActive && ddActive !== ddWrapper) {
         ddActive.classList.remove('_dd-active');
      }

      ddWrapper.classList.toggle('_dd-active');
      if (input) { setTimeout(() => { input.focus() }, 100); }

      e.preventDefault();
   }
}

//#endregion

//#region Открытие/закрытие меню-каталога

document.addEventListener('DOMContentLoaded', () => {
   const mainPage = document.querySelector('main.page');
   const menuCatalog = document.querySelector('.menu-catalog');
   const menuLinks = menuCatalog.querySelectorAll('.menu-catalog__link[data-parent]');
   const menuBlocks = menuCatalog.querySelectorAll('.submenu-catalog__body[data-submenu]');
   let submenuTimer;

   function closeAllSubmenu() {
      menuBlocks.forEach(block => {
         block.classList.remove('submenu-open');
         block.style.top = null
      })
      menuLinks.forEach(link => { link.classList.remove('active'); });
      document.documentElement.classList.remove('submenu-open');
   }

   function openSubmenu(target) {
      closeAllSubmenu();
      target.classList.add('active')
      menuBlocks.forEach(block => {
         if (block.dataset.submenu == target.dataset.parent) {
            submenuTimer = setTimeout(() => {
               block.classList.add('submenu-open');
               if (window.matchMedia('(min-width:1199.98px)').matches) {
                  block.style.top = `${mainPage.offsetTop}px`
               }
            }, 400)
         }
      })
      document.documentElement.classList.add('submenu-open');
   }

   document.addEventListener('pointerover', e => {
      const target = e.target;

      if (!target.closest('.menu-catalog')) {
         closeAllSubmenu();
         clearTimeout(submenuTimer);
         return;
      }

      if (target.closest('[data-parent]')) {
         clearTimeout(submenuTimer);
         openSubmenu(target);
      }
   })
   document.addEventListener("click", function (e) {
      if (e.target.closest('[data-parent]') && e.pointerType === 'touch') {
         e.preventDefault();
      }
      if (e.target.closest('.js-back-to-menu')) { closeAllSubmenu() }
   });
})

//#endregion
