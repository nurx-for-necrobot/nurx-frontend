ko.bindingHandlers.matInput = {
    update: function(element, valueAccessor, allBindings) {
        // Find the "options" sub-binding:
        var boundValue = valueAccessor();
        Materialize.updateTextFields();
        
        // Register a callback for when "options" changes:
        boundValue.subscribe(function() {
            Materialize.updateTextFields();
        });
    }
};