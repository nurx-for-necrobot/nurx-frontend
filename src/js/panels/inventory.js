window.nurx.registerPanel("inventory", function(nurx) {

    // Observables.
    var inventoryListData = ko.observableArray([]);
    
    var items = ko.computed(function() {
        var clonedData = JSON.parse(JSON.stringify(inventoryListData()));
        
        var containsNullPoke = true;
        while(containsNullPoke) {
            containsNullPoke = false;
            for(var i = 0; i < clonedData.length; i++) {
                if(clonedData[i] == null) {
                    clonedData.splice(i, 1);
                    containsNullPoke = true;
                    break;
                }
            }
        }

        return clonedData;
    });
    // Computeds.

    // Functions.

    /**
     * Handle websockets data update.
     */     
    function loadInventoryList(message) {      
        inventoryListData(message.Data); 
    }

    // Setup websockets command listners.
    nurx.commandListeners["inventorylist"] = loadInventoryList;

    return {
        // Observables.
        inventoryListData: inventoryListData,
        items: items,

        // Functions.
        init: function() {}
    };
});