// place your application-wide javascripts here

jQuery(document).ready( function($) {
	socket = io.connect( document.location.protocol, '//' + document.location.hostname );
	socket.on('connected', function (data) {
	});

	socket.on('data:measures', function(data) {
	  	//put the measures in a global bus and signal all widgets

		f = data.split("$");
		if(f[0] == "DREF@"){
			if(typeof(HUD) != 'undefined')
				injectData(HUD, f[1], config);
			if(typeof(Radar) != 'undefined')
				injectRadarData(Radar, f[1], config);
			if(typeof(SMS) != 'undefined')
				injectSMSData(SMS, f[1], config);
			if(typeof(AOA) != 'undefined'){
				injectGaugeData(f[1], config);
			}
		}
	});
});
