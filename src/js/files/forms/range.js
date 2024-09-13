// Подключение из node_modules
import * as noUiSlider from 'nouislider';

// Подключение стилей из scss/base/forms/range.scss
// в файле scss/forms/forms.scss

// Подключение cтилей из node_modules
// import 'nouislider/dist/nouislider.css';

export function rangeInit(rangeSlider) {
	if (rangeSlider) {
		let priceCnt = rangeSlider.closest('.price')
		let textFrom = parseInt(rangeSlider.getAttribute('data-from'));
		let textTo = parseInt(rangeSlider.getAttribute('data-to'));
		const input0 = priceCnt.querySelector('.js_input-from');
		const input1 = priceCnt.querySelector('.js_input-to');
		const inputs = [input0, input1];

		let start = [textFrom, textTo]

		if (input0.value.length) {
			var current = parseFloat(input0.value.trim())
			if (current > textFrom) {
				start[0] = current
			}
		}

		if (input1.value.length) {
			var current = parseFloat(input1.value.trim())
			if (current < textTo) {
				start[1] = current
			}
		}

		noUiSlider.create(rangeSlider, {
			start,
			connect: true,
			range: {
				'min': [textFrom],
				'max': [textTo]
			}
		})


		rangeSlider.noUiSlider.on('update', function (values, handle) {
			inputs[handle].value = Math.round(values[handle]);
		});

		var skipRecursiveBackward = false

		rangeSlider.noUiSlider.on('end', function (values, handle) {
			if (input0 && input1) {
				skipRecursiveBackward = true
				inputs[handle].dispatchEvent((new Event('change')))
				inputs[handle].dispatchEvent((new Event('keyup')))
			}
		});

		const setRangeSlider = (i, value) => {
			let arr = [null, null];
			arr[i] = value;


			rangeSlider.noUiSlider.set(arr);
		};

		inputs.forEach((el, index) => {
			el.addEventListener('change', (e) => {
				if (skipRecursiveBackward) {
					skipRecursiveBackward = false
					return
				}
				setRangeSlider(index, e.currentTarget.value);
			});
		});
	}
}


const rangesSlidersFilters = document.querySelectorAll('.js-range');
rangesSlidersFilters.forEach(range => {
	rangeInit(range);
});
