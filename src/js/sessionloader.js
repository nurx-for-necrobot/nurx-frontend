$(document).ready(function() {
    // Load sessions from storage.
    var sessionData = window.localStorage.getItem("nurx-sessions");
    if(sessionData != null) {
        try {
            sessionData = JSON.parse(sessionData);

            ko.utils.arrayForEach(sessionData, function(session) {
                window.nurx.createInstance(session.wsUrl, session.wsUser, session.wsPass);
            });

            if (window.nurx.instances().length > 0) {
                window.nurx.selectedInstanceIdx(0);
                window.nurx.resizeWindow();
            }
        } catch (err) {
            console.log("Error parsing previous session data: ", err)
        }
    }

    // Save sessions every 10 seconds.
    window.setInterval(function() {
        var sessionSave = [];
        ko.utils.arrayForEach(window.nurx.instances(), function(instance) {
            sessionSave.push(instance.credentials);
        });
        window.localStorage.setItem("nurx-sessions", JSON.stringify(sessionSave));
    }, 10000);
})