(function ($) {
var Multisteps = function ($el, options) {
    $el.addClass('multisteps');

	if ( typeof options === 'undefined' ) options = {};
	if ( typeof options.start === 'undefined' ) options.start = 0;
	if ( typeof options.loop === 'undefined' ) options.loop = false;
	if ( typeof options.orientation === 'undefined' ) options.orientation = 'vertical';
	if ( typeof options.animateIn === 'undefined' ) options.animateIn = 'fadeInUp';
	if ( typeof options.animateOut === 'undefined' ) options.animateOut = 'fadeOutUp';
	if ( typeof options.onChange === 'undefined' ) options.onChange = function () {};
	if ( typeof options.onAfterChange === 'undefined' ) options.onAfterChange = function () {};

	var support = function () {
		var animation = false,
				animationstring = 'animation',
				keyframeprefix = '',
				domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
				pfx  = '',
				elm = document.body;

		if( elm.style.animationName !== undefined ) { animation = true; }    

		if( animation === false ) {
			for( var i = 0; i < domPrefixes.length; i++ ) {
				if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
					pfx = domPrefixes[ i ];
					animationstring = pfx + 'Animation';
					keyframeprefix = '-' + pfx.toLowerCase() + '-';
					animation = true;
					break;
				}
			}
		}

		return {
			supported: animation,
			prefix: pfx,
			onEnd: pfx.length === 0 ? 'animationend' : pfx.toLowerCase() + 'AnimationEnd'
		};
	};
	var animation = support();

	var steps = function () { return $el.children('.step'); };
	var current = function () { return steps().filter('.actual-active'); }
	var index = function () { return current().index(); };
	var size = function () { return steps().size(); };

	var startingStep = typeof options.start === 'number' ? steps().eq(options.start) : steps().filter('#' + options.start);
	startingStep.addClass('active actual-active');
	if (options.orientation === 'vertical') {
		$el.addClass('vertical');
		$el.css('height', startingStep.innerHeight());
	} else {
		$el.addClass('horizontal');
		$el.css('width', startingStep.innerWidth());
	}

	$(window).resize(function () { self.refresh(); });

	var self = this;

	// navigation
	this.prev = function () {
		var i = index();
		if (i === 0) {
			if (options.loop) {
				this.last();
			}
		} else {
			this.goto(i - 1);
		}
	};

	this.next = function () {
		var i = index();
		if (i == size() - 1) {
			if (options.loop) {
				this.first();
			}
		} else {
			this.goto(i + 1);
		}
	};

	this.first = function () {
		this.goto(0);
	};

	this.last = function () {
		this.goto(size() - 1);
	};

	this.goto = function (to) {
		var now = current();
		var then = typeof to === 'number' ? steps().eq(to) : steps().filter('#' + to);
		if (now.size() === 0 || then.size() === 0) {
			console.error('Multisteps: Target step "' + to + '" doesn\'t exist.')
			return;
		}
		if (then[0] === now[0]) {
			console.warn('Multisteps: going to step where I already am.')
			return;
		}

		now.removeClass('actual-active');
		then.addClass('actual-active');

		if (animation.supported) {
			now.add(then).addClass('animated ' + options.animateIn);
			now.addClass(options.animateOut);

			now.one(animation.onEnd, function () {
				now.removeClass('active ' + options.animateOut);
				then.addClass('preparing');
				setTimeout(function () {
					if (options.orientation === 'vertical') {
						$el.css('height', then.innerHeight() + 2);
					} else {
						$el.css('width', then.innerWidth() + 2);
					}
				}, 0);
				$el.one(animation.onEnd, function () {
					then.removeClass('preparing').addClass('active');

					options.onAfterChange(then.index(), now.index(), size());
				});

				options.onChange(then.index(), now.index(), size());
			});
		} else {
			now.removeClass('active');
			then.addClass('active');
			options.onChange(then.index(), now.index(), size());
			options.onAfterChange(then.index(), now.index(), size());
		}
	};

	this.refresh = function () {
		if (options.orientation === 'vertical')
			$el.css('height', current().innerHeight() + 2);
		else
			$el.css('width', current().innerWidth() + 2);
	};
};

$.fn.multisteps = function () {
	var args = Array.prototype.slice.apply(arguments);

	var returnValue = this.each(function () {
		$el = $(this);

		if (typeof args[0] === 'object' || typeof args[0] === 'undefined') {
			var options = args[0];
			var ctrl = new Multisteps($el, options);
			$el.data('multisteps', ctrl);
		} else {
			if (typeof $el.data('multisteps') === 'undefined') return;

			var ctrl = $el.data('multisteps');

			var command = args[0];
			var parameters = args.slice(1);

			if (typeof ctrl[command] === 'undefined') return;

			return ctrl[command].apply(ctrl, parameters);
		}
	});

	return returnValue;
};

})(jQuery);