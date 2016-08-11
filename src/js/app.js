
window.nurx = (function() {

    var pokedata = window.pokedata;

    var defaultModalOptions = {
        ready: function() { $('#global').addClass('modal-active'); },
        complete: function() { $('#global').removeClass('modal-active'); }
    };

    var panels = {};

    // Observables.
    var instances = ko.observableArray([]);
    var selectedInstanceIdx = ko.observable(-1);

    var newInstUrl = ko.observable();
    var newInstUser = ko.observable();
    var newInstPass = ko.observable();

    var SSLCheckUrl = ko.observable();

    // Computeds
    var currentInstance = ko.computed(function() {
        if(selectedInstanceIdx() >= 0 && instances().length > 0 && selectedInstanceIdx() < instances().length)
            return instances()[selectedInstanceIdx()];
        
        return null;        
    });
    currentInstance.subscribe(function(data) {
        setTimeout(function() { 
            $(".log").removeClass("log-show");
            $("#" + data.instanceId + " .log").addClass("log-show");
        }, 0);
    })
    
    // Functions.

    /**
     * Register panel to Nurx.
     */
    function registerPanel(panelName, panelFactory) {
        panels[panelName] = panelFactory;
    }

    /**
     * Create instance.
     */
    function createInstance(wsUrl, wsUser, wsPass) {
        var instanceId = Math.floor((Math.random() * 100000));
        var commandListeners = {};
        var instancePanels = {}

        var ws;   
        var wsConnectTries = 0;
        var pokestopInterval;

        // Obserbables.
        var selectedPane = ko.observable("navigation");
        var statsData = ko.observable(null);
        var profileData = ko.observable(null);
        var isConnected = ko.observable(false);
        var connectionText = ko.observable();
        var showLog = ko.observable(false);

        /**
         * Initalize the frontend.
         */
        function init() { 
            // Connect to NecroBot.
            connectionText("Connecting...");
            connectSocketServer();

            // Initalize all panels.
            for (var key in instancePanels) {
                if (instancePanels.hasOwnProperty(key))
                    instancePanels[key].init();
            }
        }

        /**
         * Setup the websockets connection.
         */
        function connectSocketServer() {
            var support = "MozWebSocket" in window ? 'MozWebSocket' : ("WebSocket" in window ? 'WebSocket' : null);

            if (support == null) {
                alert("Your browser cannot doesn't websockets. :(");
                return;
            }

            try {
                ws = new WebSocket('wss://' + wsUrl + '/');        
                ws.onmessage = handleMessage;

                // when the connection is established, this method is called
                ws.onopen = function () { 
                    console.log( "Server connection opened." );
                    isConnected(true);
                    wsConnectTries = 0;
                    
                    // Initial data retrieval.
                    setTimeout(function() {
                        sendCommand("location", {});
                        sendCommand("profile", {});
                        sendCommand("pokemonlist", {});
                        sendCommand("pokestops", {});
                        sendCommand("inventorylist", {});
                    }, 1000);

                    pokestopInterval = setInterval(function() {
                        sendCommand("pokestop", {}); 
                    }, 1000 * 60 * 5);
                }

                // when the connection is closed, this method is called
                ws.onclose = function () { 
                    isConnected(false);
                    console.log( "Server connection closed."); 
                    regainConnection();
                    checkSSL();
                }
            } catch(err) {
                console.log(err);
            }
        }

        /**
         * Reconnect if the instance isnt connected.
         */
        function triggerReconnect() {
            if(!isConnected())
                connectSocketServer();
        }

        /**
         * Attempt to regain the connection.
         */
        function regainConnection() {
            var timeout;

            if (wsConnectTries == 0) {
                timeout = 1000;
                connectionText("Connection lost<br />reconnecting ...");
            } else if (wsConnectTries < 3) {
                timeout = 20000;            // 20 seconds until 3rd try;
                connectionText("Connection lost<br />trying again in 20 seconds ...");
            } else if (wsConnectTries < 10) {
                timeout = 1000 * 60 * 5;    // 5 minutes until 10th try.
                connectionText("Connection lost<br />trying again in 5 minutes  ...");
            } else {
                timeout = 1000 * 60 * 20;   // 20 minutes.
                connectionText("Connection lost<br />trying again in 20 minutes ...");
            }
            
            wsConnectTries++;
            setTimeout(connectSocketServer, timeout);    
        }

        /**
         * Check to see if perhaps the SSL self signed cert hasnt been accepted.
         */
        function checkSSL() {
            var uSplit = wsUrl.split(":");
            var url = uSplit[0];
            var port = parseInt(uSplit[1], 10);

            var testws = new WebSocket('ws://' + url + ':' + (port + 1) + '/');    
            testws.onopen = function () {
                window.nurx.SSLCheckUrl("https://" + url + ":" + port + "/");
                $('#global').addClass('modal-active');
                $("#ssl-check-modal").openModal(defaultModalOptions);
            } 
        }

        /**
         * Send a websockets command.
         */
        function sendCommand(command, data) {
            var cmd = {
                'Command': command,
                'Data': data 
            };
            ws.send(JSON.stringify(cmd));        
        }


        /**
         * Websockets callback for handling messages. 
         */
        function handleMessage(evt) {
            var message = JSON.parse(evt.data);
            console.log(message);

            // Pass the message off to any registered command listeners.
            if(message.MessageType in commandListeners) {
                commandListeners[message.MessageType](message);
                return;
            }
            
            // Default commands.
            switch(message.MessageType) {
                case "profile":
                    profileData(message.Data);
                    break;
                case "stats":
                    statsData(message.Data);
                    break;
                default:
                    console.log("Unknown command: ", message);
                    break;
            }            
        }

        // Create the instance viewmodel.
        var nurxInstance = {
            // Credentials.
            credentials: {
                wsUrl: wsUrl,
                wsUser: wsUser,
                wsPass: wsPass
            },

            commandListeners: commandListeners,
            instancePanels: instancePanels,
            instanceId: instanceId,

            // Obserbables.
            selectedPane: selectedPane,
            statsData: statsData,
            profileData: profileData,
            isConnected: isConnected,
            connectionText: connectionText,
            showLog: showLog,
        
            // Functions.
            init: init,
            sendCommand: sendCommand,
            triggerReconnect: triggerReconnect
        }

        // For each panel we have, initialize it and inject it into the instance.
        for (var key in panels) {
            if (panels.hasOwnProperty(key)) {
                nurxInstance[key] = panels[key](nurxInstance);
                nurxInstance.instancePanels[key] = nurxInstance[key];
            }
        }

        // Add the instance to the root viewmodel.
        instances.push(nurxInstance);
        nurxInstance.init();
    }
    
    /**
     * Handle window resizing.
     */
    function resizeWindow() {
        var w = $(window).innerWidth();
        var h = $(window).innerHeight();

        console.log("Resizing...");

        $(".pane-container").css({
            'height': (h - 40) + "px",
            'width': w + 'px'                       
        });
        $(".pane").css({
            'height': (h - 40) + "px",
            'width': w + 'px'                         
        });        
    }


    /**
     * Open a new panel.
     */
    function openPanel(panelName) {
        $(".panel").addClass("panel-shown");
        $(".custom-modal-overlay").fadeIn();
        currentInstance().selectedPane(panelName);
    }


    /**
     * Close the panel.
     */
    function closePanel() {
        $(".custom-modal-overlay").fadeOut();
        $(".panel").removeClass("panel-shown");
    }


    /**
     * Triger reconnect on all non-connected instances.
     */
    function triggerReconnectAll() {
        ko.utils.arrayForEach(window.nurx.instances(), function(instance) {
            instance.triggerReconnect();
        });
    }

    /**
     * Show the dialog for adding a new instance.
     */
    function showNewInstanceDialog() {
        $('#global').addClass('modal-active');
        $('#instance-create-modal').openModal(defaultModalOptions);

        newInstUrl("localhost:" + DEFAULT_SERVICE_PORT);
        newInstUser("admin");
        newInstPass("");
        Materialize.updateTextFields();
    }

    /**
     * Create the new instance tab.
     */
    function createNewInstanceTab() {
        createInstance(newInstUrl(), newInstUser(), newInstPass());

        selectedInstanceIdx(instances().length - 1);
        closeNewInstanceModal();
        resizeWindow();        
    }

    /**
     * Close the new instance modal.
     */
    function closeNewInstanceModal() {
        $('#instance-create-modal').closeModal(defaultModalOptions);
    }

    
    /**
     * Show the close instance modal.
     */
    var closeModalInstanceId;
    function showCloseInstanceModal(instanceId) {
        closeModalInstanceId = instanceId;

        $('#global').addClass('modal-active');
        $("#instance-close-modal").openModal(defaultModalOptions);
    }

    /**
     * Handle an instance close confirmation.
     */
    function closeInstance() {
        for(var i = 0; i < instances().length; i++) {
            if(instances()[i].instanceId == closeModalInstanceId) {
                instances.splice(i, 1);
                break;
            }
        }

        if(instances().length > 0 && selectedInstanceIdx() >= instances().length)
            selectedInstanceIdx(instances().length - 1);

        closeCloseInstanceModal();
    }


    /**
     * Close the close instance modal.
     */
    function closeCloseInstanceModal() {
        $('#global').removeClass('modal-active');
        $("#instance-close-modal").closeModal(defaultModalOptions);
    }

    // Setup window events, initialize window.
    $(window).resize(resizeWindow);
    $(document).ready(function() {       
        ko.applyBindings(vm);
        resizeWindow();

        $('.modal-trigger').leanModal(); 
    })

    var vm = {    
        pokedata: pokedata,

        instances: instances,
        selectedInstanceIdx: selectedInstanceIdx,
        newInstUrl: newInstUrl,
        newInstUser: newInstUser,
        newInstPass: newInstPass,  
        SSLCheckUrl: SSLCheckUrl,   

        currentInstance: currentInstance,   

        registerPanel: registerPanel,
        createInstance: createInstance,
        resizeWindow: resizeWindow,
        openPanel: openPanel,
        closePanel: closePanel,
        triggerReconnectAll: triggerReconnectAll,
        showNewInstanceDialog: showNewInstanceDialog,
        createNewInstanceTab: createNewInstanceTab,
        closeNewInstanceModal: closeNewInstanceModal,
        showCloseInstanceModal: showCloseInstanceModal,
        closeInstance: closeInstance,
        closeCloseInstanceModal: closeCloseInstanceModal
    };   
    return vm;
})();