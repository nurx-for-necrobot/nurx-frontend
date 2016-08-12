window.i18n = (function() {
    var selectedLang = "en-us";
    var loadedPhrases = {};

    /**
     * Get a thranslated phrase.
     */
    function getTranslatedPhrase(phrase) {
        var phraseId = phrase.toLowerCase();

        if(phraseId in loadedPhrases)
            return loadedPhrases[phraseId];

        loadedPhrases[phraseId] = ko.observable(phrase);    
        return loadedPhrases[phraseId]
    }


    /**
     * Set the language by loading the i18n/*.json file.
     */
    function setLanguage(langId) {
        selectedLang = langId;
        console.log("Loading language: ", langId);

        $.getJSON("i18n/" + langId + ".json", function(phrases) {
            console.log("Language data for " + langId + ":", phrases);

            // Iterate over all phrases from the json.
            for (var phraseId in phrases) {
                if (phrases.hasOwnProperty(phraseId)) {
                    
                    // Either set it, or add it into the loaded phrases object.
                    if(phraseId in loadedPhrases)
                        loadedPhrases[phraseId](phrases[phraseId]);
                    else
                        loadedPhrases[phraseId] = ko.observable(phrases[phraseId]);

                }
            }
        });
    }

    // Initialize i18n.
    setLanguage(selectedLang);

    // Return module.
    var vm = {
        getTranslatedPhrase: getTranslatedPhrase,
        setLanguage: setLanguage
    }
    return vm;
})();

// Global translation function.
function tr(phrase) {
    return window.i18n.getTranslatedPhrase(phrase);
} 