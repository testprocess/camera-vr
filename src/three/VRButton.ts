class VRButton {
    static xrSessionIsGranted: boolean;

	static createButton( renderer: any ) {

		const button = document.createElement( 'button' );

		function showEnterVR( /*device*/ ) {

			let currentSession: any = null;

			async function onSessionStarted( session: any ) {

				session.addEventListener( 'end', onSessionEnded );

				await renderer.xr.setSession( session );
				button.textContent = 'EXIT VR';

				currentSession = session;

			}

			function onSessionEnded( /*event*/ ) {

				currentSession.removeEventListener( 'end', onSessionEnded );

				button.textContent = 'Enter VR';

				currentSession = null;

			}

			//

			button.style.display = '';

			button.style.cursor = 'pointer';

			button.textContent = 'Enter VR';



			button.onclick = function () {

				if ( currentSession === null ) {

					// WebXR's requestReferenceSpace only works if the corresponding feature
					// was requested at session creation time. For simplicity, just ask for
					// the interesting ones as optional features, but be aware that the
					// requestReferenceSpace call will fail if it turns out to be unavailable.
					// ('local' is always available for immersive sessions and doesn't need to
					// be requested separately.)

					const sessionInit = { optionalFeatures: [ 'local-floor', 'bounded-floor', 'hand-tracking', 'layers' ] };
					navigator.xr.requestSession( 'immersive-vr', sessionInit ).then( onSessionStarted );

				} else {

					currentSession.end();

				}

			};

		}

		function disableButton() {

			button.style.display = '';



			button.onmouseenter = null;
			button.onmouseleave = null;

			button.onclick = null;

		}

		function showWebXRNotFound() {

			disableButton();

			button.textContent = 'VR NOT SUPPORTED';

		}

		function showVRNotAllowed( exception: any ) {

			disableButton();

			console.warn( 'Exception when trying to call xr.isSessionSupported', exception );

			button.textContent = 'VR NOT ALLOWED';

		}

		function stylizeElement( element: any ) {

			element.style.position = 'absolute';

			element.style.background = '#ECE3CE';
			element.style.color = '#3A4D39';
			element.style.textAlign = 'center';

			element.style.outline = 'none';
			element.style.zIndex = '999';
            element.style.border = 'none';

            element.style.fontSize = '1.4rem';


            element.style.width = "50%"
            element.style.height = "100%"

		}

		if ( 'xr' in navigator ) {

			button.id = 'VRButton';
			button.style.display = 'none';

			stylizeElement( button );

			navigator.xr.isSessionSupported( 'immersive-vr' ).then( function ( supported ) {

				supported ? showEnterVR() : showWebXRNotFound();

				if ( supported && VRButton.xrSessionIsGranted ) {

					button.click();

				}

			} ).catch( showVRNotAllowed );

			return button;

		} else {
			button.id = 'VRButton';

			const message = document.createElement( 'a' );
			stylizeElement( button );
			if ( window.isSecureContext === false ) {

				message.href = document.location.href.replace( /^http:/, 'https:' );
				message.innerHTML = 'WEBXR NEEDS HTTPS'; // TODO Improve message
                button.textContent = 'WEBXR NEEDS HTTPS';


			} else {

				message.innerHTML = 'WEBXR NOT AVAILABLE';
                button.textContent = 'WEBXR NOT AVAILABLE';

			}

			message.style.textDecoration = 'none';

			stylizeElement( message );

			return button;

		}

	}

	static registerSessionGrantedListener() {

		if ( typeof navigator !== 'undefined' && 'xr' in navigator ) {

			// WebXRViewer (based on Firefox) has a bug where addEventListener
			// throws a silent exception and aborts execution entirely.
			if ( /WebXRViewer\//i.test( navigator.userAgent ) ) return;

			navigator.xr.addEventListener( 'sessiongranted', () => {

				VRButton.xrSessionIsGranted = true;

			} );

		}

	}

}

VRButton.xrSessionIsGranted = false;
VRButton.registerSessionGrantedListener();

export { VRButton };