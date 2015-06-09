( function( $ ) {
var Multisteps = function( $el, options ) {
	$el.addClass( 'multisteps' );

	// set some defaults
	if ( typeof options === 'undefined' ) options = {};

	var defaults = {
		start: 0,
		loop: false,
		orientation: 'vertical',
		animateIn: 'fadeInUp',
		animateOut: 'fadeOutUp',
		onChange: function () {},
		onAfterChange: function () {}
	};

	for (var option in defaults)
		if (typeof options[option] === 'undefined')
			options[option] = defaults[option];


	// check animation support

	var support = function() {
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


	// define methods

	var steps = function() { return $el.children( '.step' ); };
	var current = function() { return steps().filter( '.actual-active' ); }
	var index = function() { return current().index(); };
	var size = function() { return steps().length; };
	var hasPrev = function() { return index() === 0; };
	var hasNext = function() { return index() === size() - 1; };

	var go = function (to) {
		var now = current();
		var then = typeof to === 'number' ? steps().eq(to) : steps().filter('#' + to);
		if ( now.size() === 0 || then.size() === 0 ) {
			console.error( 'multisteps: Target step "' + to + '" doesn\'t exist.' )
			return;
		}

		now.removeClass( 'actual-active' );
		then.addClass( 'actual-active' );

		if ( animation.supported ) {
			now.add( then ).addClass( 'animated ' + options.animateIn );
			now.addClass( options.animateOut );

			now.one( animation.onEnd, function() {
				now.removeClass( 'active ' + options.animateOut );
				then.addClass( 'preparing' );
				setTimeout( function() {
					if ( options.orientation === 'vertical' ) {
						$el.css( 'height', then.innerHeight() + 2 );
					} else {
						$el.css( 'width', then.innerWidth() + 2 );
					}
				}, 0 );
				$el.one( animation.onEnd, function() {
					then.removeClass( 'preparing' ).addClass( 'active' );

					options.onAfterChange( then.index(), now.index(), size() );
				} );

				options.onChange( then.index(), now.index(), size() );
			} );
		} else {
			now.removeClass( 'active' );
			then.addClass( 'active' );
			options.onChange( then.index(), now.index(), size() );
			options.onAfterChange( then.index(), now.index(), size() );
		}
	};
	var prev = function() {
		var i = index();
		if ( i === 0 ) {
			go( i - 1 );
		} else {
			if ( options.loop ) {
				last();
			}
		}
	};
	var next = function() {
		var i = index();
		if ( i == size() - 1 ) {
			if ( options.loop ) {
				this.first();
			}
		} else {
			this.goto( i + 1 );
		}
	};
	var first = function() {
		this.goto( 0 );
	};
	var last = function() {
		this.goto( size() - 1 );
	};

	var refresh = function() {
		if ( options.orientation === 'vertical' )
			$el.css( 'height', current().innerHeight() + 2 );
	};


	var startingStep = typeof options.start === 'number'
		? steps().eq( options.start )
		: steps().filter('#' + options.start);
	startingStep.addClass( 'active actual-active' );

	if ( options.orientation === 'vertical' ) {
		$el.addClass( 'vertical' );
		$el.css( 'height', startingStep.innerHeight() );
	} else {
		$el.addClass( 'horizontal' );
		$el.css( 'width', startingStep.innerWidth() );
	}

	$( window ).resize( function() { self.refresh(); } );

	var self = this;


	// attach methods to controller

	this.current = current;
	this.currentIndex = index;
	this.hasPrev = hasPrev;
	this.hasNext = hasNext;

	this.goto = go;
	this.prev = prev;
	this.next = next;
	this.first = first;
	this.last = last;

	this.refresh = refresh;
};

// wrap in jQuery plugin
$.fn.multisteps = function() {
	var args = Array.prototype.slice.apply( arguments );

	var returnValue = this.each( function() {
		$el = $( this );

		if ( typeof args[ 0 ] === 'object' || typeof args[ 0 ] === 'undefined' ) {
			var options = args[ 0 ];
			var ctrl = new Multisteps( $el, options );
			$el.data( 'multisteps', ctrl );
		} else {
			if ( typeof $el.data( 'multisteps' ) === 'undefined' ) return;

			var ctrl = $el.data( 'multisteps' );

			var command = args[ 0 ];
			var parameters = args.slice( 1 );

			if ( typeof ctrl[ command ] === 'undefined' ) return;

			return ctrl[ command ].apply( ctrl, parameters );
		}
	});

	return returnValue;
};

} )( jQuery );