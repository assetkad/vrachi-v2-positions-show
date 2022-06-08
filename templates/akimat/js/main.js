window.isKioskDevice = () => {
	return (window.screenTop && window.screenY);
    //return (('ontouchstart' in window) ||
    //    (navigator.maxTouchPoints > 0) ||
    //    (navigator.msMaxTouchPoints > 0)) && (window.screenTop && window.screenY);
};

jQuery(document).ready(function () {
    const $body = jQuery('body');
	const timeoutTime = parseInt(window.timeoutTime);
	
    // Fix for modals that renders in modules
    $body.prepend(jQuery('.modal'));

    if(window.isKioskDevice() && window.location.pathname !== '' && timeoutTime !== 0) {
        jQuery(document).idle({
            onIdle: function() {
                window.location = '/';
            },
            idle: timeoutTime * 60000
        });
    }

    const IIN_MASK = '999999999999',
          PHONE_MASK = '+7 (999) 999-99-99',
          EMAIL_MASK = 'email';

    if(!window.isKioskDevice()) {
        jQuery("[data-type='iin']").inputmask(IIN_MASK);
        jQuery("[data-type='phone']").inputmask(PHONE_MASK);
        jQuery("[data-type='email']").inputmask(EMAIL_MASK);
    }


    const $timeRenderer = jQuery("#renderDateTimer");
	
	const renderCurrentTime = () => {
		$timeRenderer.html(new Date().toLocaleDateString("ru-RU", {
            year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'
        }))
	};

    setInterval(renderCurrentTime, 1000);
	renderCurrentTime();
});