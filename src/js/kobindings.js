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

ko.bindingHandlers.tooltip = {
    init: function(element, valueAccessor) {
        var value = ko.unwrap(valueAccessor());
        $(element).attr("title", value);
        $(element).tooltipster({
            theme: 'tooltipster-borderless',
            side: 'right',
            delay: [3000, 0]
        });
    },
    update: function(element, valueAccessor, allBindings) {
        var value = ko.unwrap(valueAccessor());

        $(element).tooltipster("destroy");
        $(element).attr("title", value);
        $(element).tooltipster({
            theme: 'tooltipster-borderless',
            side: 'right',
            delay: [3000, 0]
        });
    }
}