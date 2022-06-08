const accordion1 = new GraphAccordion('.accordion-1', {
	speed: 500,
	isOpen: (acc) => {
		console.log(acc);
	},
	isClose: (acc) => {
		console.log(acc);
	}
});

const accordion2 = new GraphAccordion('.accordion-2', {
	speed: 500
});

const accordion3 = new GraphAccordion('.accordion-3', {
	speed: 500
});

const accordion4 = new GraphAccordion('.accordion-4', {
	speed: 500
});