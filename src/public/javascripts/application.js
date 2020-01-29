// place your application-wide javascripts here

xplaneData = new XplaneData(xplane_data);

jQuery(document).ready(function ($) {
    socket = io.connect(document.location.protocol, '//' + document.location.hostname);
    socket.on('connected', function (data) {
    });

    socket.on('data:measures', function (data) {
        xplaneData.update(data);
    });
});

window.setInterval(function () {
    // Update all Widgets
    if (typeof (HUD) != 'undefined')
        injectData(HUD, xplaneData);
    if (typeof (Radar) != 'undefined')
        injectRadarData(Radar, xplaneData);
    if (typeof (SMS) != 'undefined')
        injectSMSData(SMS, xplaneData);
    if (typeof (AOA) != 'undefined') {
        injectGaugeData(xplaneData);
    }
}, refresh_timer);