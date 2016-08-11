
window.nurx.registerPanel("pokemon", function(nurx) {

    // Observables.
    var pokemonListData = ko.observableArray([]);
    var pokemonSortField = ko.observable("Perfection");
    var sortAscending = ko.observable(false);
    

    // Computeds.

    /**
     * Return a list of sorted pokemon.
     */
    var pokemonListSorted = ko.computed(function() {
        var clonedData = JSON.parse(JSON.stringify(pokemonListData()));

        // Strip out all null pokemon entries since they're messing stuff up.
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

        // Setup comparator values.
        var compLHS = sortAscending() ? 1 : -1;
        var compRHS = sortAscending() ? -1 : 1;

        clonedData.sort(function(a, b) {
            if(pokemonSortField() == "Perfection") {              
                if(a.Perfection == b.Perfection)
                    return 0;
                else
                    return a.Perfection > b.Perfection ? compLHS : compRHS;
            }
        
            if(a.Base[pokemonSortField()] == b.Base[pokemonSortField()])
                return 0;
            else
                return a.Base[pokemonSortField()] > b.Base[pokemonSortField()] ? compLHS : compRHS;
        });
        
        return clonedData;
    });


    /**
     * Get a nicely formatted name for the sort field.
     */
    var sortFieldDescription = ko.computed(function() {
        switch(pokemonSortField()) {
            case "Perfection": return "IV";      
            case "Cp": return "CP";
            case "Hp": return "HP"; 
            case "PokemonId": return "Number";     
            case "CreationTimeMs": return "Recent";
        }

        return pokemonSortField();
    });


    // Functions.

    /**
     * Handle websockets data update.
     */
    function loadPokemonList(message) {
        pokemonListData(message.Data); 
    }


    /**
     * Change the sorting of pokemon.
     */
    function sortBy(field) {
        // If sorting by same field, flip ascending/descending.
        if(pokemonSortField() == field)
            sortAscending(!sortAscending());
        else {
            pokemonSortField(field);
            sortAscending(true);
        }        
    }


    // Setup websockets command listners.
    nurx.commandListeners["pokemonlist"] = loadPokemonList;

    return {
        // Observables.
        pokemonListData: pokemonListData,
        pokemonSortField: pokemonSortField,

        // Computeds.
        pokemonListSorted: pokemonListSorted,
        sortFieldDescription: sortFieldDescription,
        sortAscending: sortAscending,

        // Functions.
        sortBy: sortBy,
        init: function() {}
    };
});