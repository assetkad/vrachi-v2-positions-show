jQuery(document).ready(function() {
    const $peopleStepWrapper = jQuery('.requests__form--step--people');

    const setRightButtonDisabled = (state) => {
        const $rightButton = jQuery('.requests__form--step.active .requests__form--step--buttons--right button');
        $rightButton.prop('disabled', state);
    };

    const BREADCRUMB_TEMPLATE = `<li class="mod-breadcrumbs__item breadcrumb-item" data-requests-step="{{ stepIndex }}">
        <span>{{ title }}</span>
    </li>`;

    const $breadcrumbsList = jQuery('.mod-breadcrumbs__wrapper ol');

    // Breadcrumbs

    const addStepToBreadcrumb = (title, stepIndex) => {
        const itemHTML = BREADCRUMB_TEMPLATE.replace('{{ title }}', title)
            .replace('{{ stepIndex }}', stepIndex);

        $breadcrumbsList.append(itemHTML);
        return true;
    };

    const removeStepFromBreadcrumb = (stepIndex) => {
        $breadcrumbsList.find(`[data-requests-step="${stepIndex}"]`).detach();
        return true;
    };

    const switchStep = (forward = true) => {
        const $allSteps = $stepsWrapper.find('.requests__form--step');
        const $activeStep = $stepsWrapper.find('.requests__form--step.active');

        const prevActiveStepIndex = parseInt($activeStep.attr('data-index'));

        $activeStep.hide();
        $activeStep.removeClass('active');

        let newIndex;

        if(forward) {
            newIndex = prevActiveStepIndex + 1;

            setRightButtonDisabled(true);

            if((newIndex + 1) >= $allSteps.length) {
                newIndex = $allSteps.length - 1;
            }
        } else {
            newIndex = prevActiveStepIndex - 1;

            if(newIndex <= 0) {
                newIndex = 0;
            }
        }

        const $newStep = jQuery($allSteps[newIndex]);
        $newStep.fadeIn(300);
        $newStep.addClass('active');

        const $rightButton = jQuery('.requests__form--step.active .requests__form--step--buttons--right button');

        if(forward) {
            addStepToBreadcrumb($newStep.attr('data-step-title'), newIndex);

            if((newIndex + 1) >= $allSteps.length) {
                $rightButton.text(window.requestsTexts.request_submit_text);
            }
        } else {
            removeStepFromBreadcrumb(prevActiveStepIndex);
        }
    };

    const $stepsWrapper = jQuery('.requests__form--steps');

    jQuery('.requests__form--step--buttons--left button').click(function() {
        switchStep(false);
    });

    jQuery('.requests__form--step--buttons--right button:not(.next-custom-button):not([type="submit"])').click(function() {
        switchStep(true);
    });

    $peopleStepWrapper.find('input').change(function() {
        setRightButtonDisabled($peopleStepWrapper.find('input[type="radio"]:checked').length === 0);
    });

    // Personal step
    const $personalInputs = jQuery('.requests__form--step--personal input'),
          $personalStepNextButton = jQuery('.requests__form--step--personal--buttons .next-custom-button');

    const validateEmail = (email) => {
        return email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };
	
	$personalInputs.each(function() {
		jQuery(this).change(function() {
			jQuery(this).removeClass('is-invalid');
		});
	});

    const validatePersonalInputs = (outputErrors = false) => {
        let errors = [];

        $personalInputs.each(function() {
            const inputValue = jQuery(this).val(),
                  isEmail = jQuery(this).attr('data-type') === 'email';

            let isMaskCompleted = jQuery(this).attr('data-mask') ? jQuery(this).val().search('_') === -1 : true;

            if(isEmail) {
                isMaskCompleted = true;
            }

            if((!!jQuery(this).attr('required') && (inputValue.length === 0 || !isMaskCompleted))
                || (isEmail && inputValue.length !== 0 && !validateEmail(inputValue))) {
				jQuery(this).addClass('is-invalid');
                errors.push(jQuery(this));
            }
        });

        if(errors.length > 0) {
            return false;
        }

        return true;
    };

    $personalStepNextButton.click(function() {
        if(!validatePersonalInputs(true)) {
            return false;
        }

        switchStep(true);
    });

    // Question form
    const $questionInput = jQuery('.requests__form--step--question textarea'),
          $questionNextButton = jQuery('.requests__form--step--question--buttons .next-custom-button');

    $questionInput.on('keyup', function() {
        $questionNextButton.prop('disabled', jQuery(this).val().length === 0);
    });

    $questionNextButton.click(function(e) {

        let data = {};

        jQuery('.requests__form--step[data-index="1"] input').each(function() {
            data[`jform[${jQuery(this).attr('name')}]`] = jQuery(this).val();
        });

        data['jform[manager]'] = jQuery('.requests__form--step[data-index="0"] input[name="manager"]:checked')
            .attr('id').replace('persons', '');
        data['jform[question]'] = jQuery('.requests__form--step[data-index="3"] textarea').val();
        data['jform[request_at]'] = jQuery('.requests__form--step[data-index="2"] input').val();

        jQuery.ajax({
            url: '/index.php?option=com_requests&task=requests.createRequest',
            method: 'POST',
            data,

            beforeSend: function() {
                jQuery('.requests__form--step--buttons button').prop('disabled', true);
            },

            success: function() {
                switchStep(true);

                setTimeout(() => {
                    window.location = "/";
                }, 10000);
            },

            fail: function() {
                jQuery('.requests__form--step--buttons button').prop('disabled', false);
                toastr.error('Something went wrong');
            }
        })

    });
});