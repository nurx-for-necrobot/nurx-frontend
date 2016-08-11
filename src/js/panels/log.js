
window.nurx.registerPanel("log", function(nurx) {
    var maxLogLevel = 15;
    var logLevels = {
        0: 'None',
        1: 'Error',
        2: 'Warning',
        3: 'Pokestop',
        4: 'Farming',
        5: 'Sniper',
        6: 'Recycling',
        7: 'Berry',
        8: 'Caught',
        9: 'Flee',
        10: 'Transfer',
        11: 'Evolve',
        12: 'Egg',
        13: 'Update',
        14: 'Info',
        15: 'New',
        16: 'Debug'
    };

    /**
     * Handle logging.
     */
    function logMessage(message) {
        // Log everything to console.
        console.log(nurx.instanceId + "> " + message.Data.Message);

        // Don't log stuff over the max log level.
        if(message.Data.Level > maxLogLevel)
            return;
            
        // Add new log entry, truncate old entries.
        $("#" + nurx.instanceId + " .log-content").append("<div class='log-entry log-color-" + logLevels[message.Data.Level] + "'>[" + logLevels[message.Data.Level] + "] " + message.Data.Message + '</div>');
        $("#" + nurx.instanceId + " .log-content").css({ height: ($("#" + nurx.instanceId + " .log").height() - 20) + "px" });

        while($("#" + nurx.instanceId + " .log-entry").length > 100) {
            $("#" + nurx.instanceId + " .log-content").find('.log-entry:lt(1)').remove();
        }

        // Auto scroll to bottom.
        var height = $("#" + nurx.instanceId + " .log-content")[0].scrollHeight;
        $("#" + nurx.instanceId + " .log-content").scrollTop(height);
    }

    // Setup websockets command listners.
    nurx.commandListeners["log_message"] = logMessage;

    return {
        logLevels: logLevels,                 
        init: function() {}
    };
});