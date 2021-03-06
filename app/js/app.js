const main = {
	init: () => {
		main.helloMessage();
	},

	helloMessage: () => {
		console.log('hello world!')
	}

};

$(function() {
	main.init();
});