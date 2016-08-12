window.i18n = (function() {
    var selectedLang = "en-us";
    var loadedPhrases = {};

    /**
     * Get a thranslated phrase.
     */
    function getTranslatedPhrase(phrase) {
        try {
            var phraseId = phrase.toLowerCase();

            if(phraseId in loadedPhrases)
                return loadedPhrases[phraseId];

            loadedPhrases[phraseId] = ko.observable(phrase);    
            return loadedPhrases[phraseId]
        } catch(err) {
            console.log("Error getting translation for phrase:", phrase);
            console.log(err);
        }
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
        setLanguage: setLanguage,
        loadedPhrases: loadedPhrases
    }
    return vm;
})();

// Global translation function.
function tr(phrase) {
    if(phrase == null) {
        console.log("Error: can't translate a null phrase.");
        return '';
    }
    
    return window.i18n.getTranslatedPhrase(phrase);
}

function ftr(phrase, args) {
    if(phrase == null) {
        console.log("Error: can't translate a null phrase.");
        return '';
    }

    return vsprintf(tr(phrase)(), args);
}
function EncounterMarker(latlng, map, args) {
	this.latlng = latlng;	
	this.args = args;	
	this.setMap(map);	
}

EncounterMarker.prototype = new google.maps.OverlayView();

EncounterMarker.prototype.draw = function() {
	
	var self = this;
	
	var div = this.div;
	
	if (!div) {
	
		div = this.div = document.createElement('div');
		var innerdiv = document.createElement('div');
		
		var d = $(div);
		var i = $(innerdiv);

		d.addClass('marker');
		d.css({			
			'position': "absolute",
			'width': "60px",
			'height': "60px",
			'border-radius': '30px',
			'border': '4px solid rgba(61, 134, 165, 0.5)',
			'background-color': 'rgba(255, 255, 255, 0.75)',
			'z-index': "90"
		})	

		if(self.args.PokemonId !== 'undefined')
			i.css({'background-image': "url(img/pokemon/" + self.args.PokemonId + ".png)"});

		i.css({
			'background-size': "contain",
			'background-position': "center center",
			'background-repeat': 'no-repeat',
			'width': "40px",
			'height': "40px",
			'border-radius': '20px',
			'margin': "5px"
		})

		d.append(i);
			
		if (typeof(self.args.marker_id) !== 'undefined') {
			div.dataset.marker_id = self.args.marker_id;
		}
		
		/*google.maps.event.addDomListener(div, "click", function(event) {
			alert('You clicked on a custom marker!');			
			google.maps.event.trigger(self, "click");
		});*/
		
		var panes = this.getPanes();
		panes.overlayImage.appendChild(div);
	}
	
	var point = this.getProjection().fromLatLngToDivPixel(this.latlng);
	
	if (point) {
		div.style.left = (point.x - 10) + 'px';
		div.style.top = (point.y - 20) + 'px';
	}
};

EncounterMarker.prototype.remove = function() {
	if (this.div) {
		this.div.parentNode.removeChild(this.div);
		this.div = null;
	}	
};

EncounterMarker.prototype.getPosition = function() {
	return this.latlng;	
};
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
window.pokedata = {
    inventory: {
        "0": "Unknown",
        "1": "Poke ball",
        "2": "Great Ball",
        "3": "Ultra Ball",
        "4": "Master Ball",
        "101": "Potion",
        "102": "Super Potion",
        "103": "Hyper Potion",
        "104": "Max Potion",
        "201": "Revive",
        "202": "Max Revive",
        "301": "Lucky Egg",
        "401": "Incense",
        "402": "Incense Spicy",
        "403": "Incense Cool",
        "404": "Incense Floral",
        "501": "Lure Module",
        "602": "X Attack",
        "603": "X Defense",
        "604": "X Miracle",
        "701": "Razberry",
        "702": "Blukberry",
        "703": "Weparberry",
        "705": "Pinapberry",
        "801": "Camera",
        "901": "Incubator ∞",
        "902": "Incubator",
        "1001": "Pokemon Storage Upgrade",
        "1002": "Item Storage Upgrade"
    },
    pokemon: {"1":"Bulbasaur","2":"Ivysaur","3":"Venusaur","4":"Charmander","5":"Charmeleon","6":"Charizard","7":"Squirtle","8":"Wartortle","9":"Blastoise","10":"Caterpie","11":"Metapod","12":"Butterfree","13":"Weedle","14":"Kakuna","15":"Beedrill","16":"Pidgey","17":"Pidgeotto","18":"Pidgeot","19":"Rattata","20":"Raticate","21":"Spearow","22":"Fearow","23":"Ekans","24":"Arbok","25":"Pikachu","26":"Raichu","27":"Sandshrew","28":"Sandslash","29":"Nidoran♀","30":"Nidorina","31":"Nidoqueen","32":"Nidoran♂","33":"Nidorino","34":"Nidoking","35":"Clefairy","36":"Clefable","37":"Vulpix","38":"Ninetales","39":"Jigglypuff","40":"Wigglytuff","41":"Zubat","42":"Golbat","43":"Oddish","44":"Gloom","45":"Vileplume","46":"Paras","47":"Parasect","48":"Venonat","49":"Venomoth","50":"Diglett","51":"Dugtrio","52":"Meowth","53":"Persian","54":"Psyduck","55":"Golduck","56":"Mankey","57":"Primeape","58":"Growlithe","59":"Arcanine","60":"Poliwag","61":"Poliwhirl","62":"Poliwrath","63":"Abra","64":"Kadabra","65":"Alakazam","66":"Machop","67":"Machoke","68":"Machamp","69":"Bellsprout","70":"Weepinbell","71":"Victreebel","72":"Tentacool","73":"Tentacruel","74":"Geodude","75":"Graveler","76":"Golem","77":"Ponyta","78":"Rapidash","79":"Slowpoke","80":"Slowbro","81":"Magnemite","82":"Magneton","83":"Farfetch'd","84":"Doduo","85":"Dodrio","86":"Seel","87":"Dewgong","88":"Grimer","89":"Muk","90":"Shellder","91":"Cloyster","92":"Gastly","93":"Haunter","94":"Gengar","95":"Onix","96":"Drowzee","97":"Hypno","98":"Krabby","99":"Kingler","100":"Voltorb","101":"Electrode","102":"Exeggcute","103":"Exeggutor","104":"Cubone","105":"Marowak","106":"Hitmonlee","107":"Hitmonchan","108":"Lickitung","109":"Koffing","110":"Weezing","111":"Rhyhorn","112":"Rhydon","113":"Chansey","114":"Tangela","115":"Kangaskhan","116":"Horsea","117":"Seadra","118":"Goldeen","119":"Seaking","120":"Staryu","121":"Starmie","122":"Mr. Mime","123":"Scyther","124":"Jynx","125":"Electabuzz","126":"Magmar","127":"Pinsir","128":"Tauros","129":"Magikarp","130":"Gyarados","131":"Lapras","132":"Ditto","133":"Eevee","134":"Vaporeon","135":"Jolteon","136":"Flareon","137":"Porygon","138":"Omanyte","139":"Omastar","140":"Kabuto","141":"Kabutops","142":"Aerodactyl","143":"Snorlax","144":"Articuno","145":"Zapdos","146":"Moltres","147":"Dratini","148":"Dragonair","149":"Dragonite","150":"Mewtwo","151":"Mew","152":"Chikorita","153":"Bayleef","154":"Meganium","155":"Cyndaquil","156":"Quilava","157":"Typhlosion","158":"Totodile","159":"Croconaw","160":"Feraligatr","161":"Sentret","162":"Furret","163":"Hoothoot","164":"Noctowl","165":"Ledyba","166":"Ledian","167":"Spinarak","168":"Ariados","169":"Crobat","170":"Chinchou","171":"Lanturn","172":"Pichu","173":"Cleffa","174":"Igglybuff","175":"Togepi","176":"Togetic","177":"Natu","178":"Xatu","179":"Mareep","180":"Flaaffy","181":"Ampharos","182":"Bellossom","183":"Marill","184":"Azumarill","185":"Sudowoodo","186":"Politoed","187":"Hoppip","188":"Skiploom","189":"Jumpluff","190":"Aipom","191":"Sunkern","192":"Sunflora","193":"Yanma","194":"Wooper","195":"Quagsire","196":"Espeon","197":"Umbreon","198":"Murkrow","199":"Slowking","200":"Misdreavus","201":"Unown","202":"Wobbuffet","203":"Girafarig","204":"Pineco","205":"Forretress","206":"Dunsparce","207":"Gligar","208":"Steelix","209":"Snubbull","210":"Granbull","211":"Qwilfish","212":"Scizor","213":"Shuckle","214":"Heracross","215":"Sneasel","216":"Teddiursa","217":"Ursaring","218":"Slugma","219":"Magcargo","220":"Swinub","221":"Piloswine","222":"Corsola","223":"Remoraid","224":"Octillery","225":"Delibird","226":"Mantine","227":"Skarmory","228":"Houndour","229":"Houndoom","230":"Kingdra","231":"Phanpy","232":"Donphan","233":"Porygon2","234":"Stantler","235":"Smeargle","236":"Tyrogue","237":"Hitmontop","238":"Smoochum","239":"Elekid","240":"Magby","241":"Miltank","242":"Blissey","243":"Raikou","244":"Entei","245":"Suicune","246":"Larvitar","247":"Pupitar","248":"Tyranitar","249":"Lugia","250":"Ho-Oh","251":"Celebi","252":"Treecko","253":"Grovyle","254":"Sceptile","255":"Torchic","256":"Combusken","257":"Blaziken","258":"Mudkip","259":"Marshtomp","260":"Swampert","261":"Poochyena","262":"Mightyena","263":"Zigzagoon","264":"Linoone","265":"Wurmple","266":"Silcoon","267":"Beautifly","268":"Cascoon","269":"Dustox","270":"Lotad","271":"Lombre","272":"Ludicolo","273":"Seedot","274":"Nuzleaf","275":"Shiftry","276":"Taillow","277":"Swellow","278":"Wingull","279":"Pelipper","280":"Ralts","281":"Kirlia","282":"Gardevoir","283":"Surskit","284":"Masquerain","285":"Shroomish","286":"Breloom","287":"Slakoth","288":"Vigoroth","289":"Slaking","290":"Nincada","291":"Ninjask","292":"Shedinja","293":"Whismur","294":"Loudred","295":"Exploud","296":"Makuhita","297":"Hariyama","298":"Azurill","299":"Nosepass","300":"Skitty","301":"Delcatty","302":"Sableye","303":"Mawile","304":"Aron","305":"Lairon","306":"Aggron","307":"Meditite","308":"Medicham","309":"Electrike","310":"Manectric","311":"Plusle","312":"Minun","313":"Volbeat","314":"Illumise","315":"Roselia","316":"Gulpin","317":"Swalot","318":"Carvanha","319":"Sharpedo","320":"Wailmer","321":"Wailord","322":"Numel","323":"Camerupt","324":"Torkoal","325":"Spoink","326":"Grumpig","327":"Spinda","328":"Trapinch","329":"Vibrava","330":"Flygon","331":"Cacnea","332":"Cacturne","333":"Swablu","334":"Altaria","335":"Zangoose","336":"Seviper","337":"Lunatone","338":"Solrock","339":"Barboach","340":"Whiscash","341":"Corphish","342":"Crawdaunt","343":"Baltoy","344":"Claydol","345":"Lileep","346":"Cradily","347":"Anorith","348":"Armaldo","349":"Feebas","350":"Milotic","351":"Castform","352":"Kecleon","353":"Shuppet","354":"Banette","355":"Duskull","356":"Dusclops","357":"Tropius","358":"Chimecho","359":"Absol","360":"Wynaut","361":"Snorunt","362":"Glalie","363":"Spheal","364":"Sealeo","365":"Walrein","366":"Clamperl","367":"Huntail","368":"Gorebyss","369":"Relicanth","370":"Luvdisc","371":"Bagon","372":"Shelgon","373":"Salamence","374":"Beldum","375":"Metang","376":"Metagross","377":"Regirock","378":"Regice","379":"Registeel","380":"Latias","381":"Latios","382":"Kyogre","383":"Groudon","384":"Rayquaza","385":"Jirachi","386":"Deoxys","387":"Turtwig","388":"Grotle","389":"Torterra","390":"Chimchar","391":"Monferno","392":"Infernape","393":"Piplup","394":"Prinplup","395":"Empoleon","396":"Starly","397":"Staravia","398":"Staraptor","399":"Bidoof","400":"Bibarel","401":"Kricketot","402":"Kricketune","403":"Shinx","404":"Luxio","405":"Luxray","406":"Budew","407":"Roserade","408":"Cranidos","409":"Rampardos","410":"Shieldon","411":"Bastiodon","412":"Burmy","413":"Wormadam","414":"Mothim","415":"Combee","416":"Vespiquen","417":"Pachirisu","418":"Buizel","419":"Floatzel","420":"Cherubi","421":"Cherrim","422":"Shellos","423":"Gastrodon","424":"Ambipom","425":"Drifloon","426":"Drifblim","427":"Buneary","428":"Lopunny","429":"Mismagius","430":"Honchkrow","431":"Glameow","432":"Purugly","433":"Chingling","434":"Stunky","435":"Skuntank","436":"Bronzor","437":"Bronzong","438":"Bonsly","439":"Mime Jr.","440":"Happiny","441":"Chatot","442":"Spiritomb","443":"Gible","444":"Gabite","445":"Garchomp","446":"Munchlax","447":"Riolu","448":"Lucario","449":"Hippopotas","450":"Hippowdon","451":"Skorupi","452":"Drapion","453":"Croagunk","454":"Toxicroak","455":"Carnivine","456":"Finneon","457":"Lumineon","458":"Mantyke","459":"Snover","460":"Abomasnow","461":"Weavile","462":"Magnezone","463":"Lickilicky","464":"Rhyperior","465":"Tangrowth","466":"Electivire","467":"Magmortar","468":"Togekiss","469":"Yanmega","470":"Leafeon","471":"Glaceon","472":"Gliscor","473":"Mamoswine","474":"Porygon-Z","475":"Gallade","476":"Probopass","477":"Dusknoir","478":"Froslass","479":"Rotom","480":"Uxie","481":"Mesprit","482":"Azelf","483":"Dialga","484":"Palkia","485":"Heatran","486":"Regigigas","487":"Giratina","488":"Cresselia","489":"Phione","490":"Manaphy","491":"Darkrai","492":"Shaymin","493":"Arceus","494":"Victini","495":"Snivy","496":"Servine","497":"Serperior","498":"Tepig","499":"Pignite","500":"Emboar","501":"Oshawott","502":"Dewott","503":"Samurott","504":"Patrat","505":"Watchog","506":"Lillipup","507":"Herdier","508":"Stoutland","509":"Purrloin","510":"Liepard","511":"Pansage","512":"Simisage","513":"Pansear","514":"Simisear","515":"Panpour","516":"Simipour","517":"Munna","518":"Musharna","519":"Pidove","520":"Tranquill","521":"Unfezant","522":"Blitzle","523":"Zebstrika","524":"Roggenrola","525":"Boldore","526":"Gigalith","527":"Woobat","528":"Swoobat","529":"Drilbur","530":"Excadrill","531":"Audino","532":"Timburr","533":"Gurdurr","534":"Conkeldurr","535":"Tympole","536":"Palpitoad","537":"Seismitoad","538":"Throh","539":"Sawk","540":"Sewaddle","541":"Swadloon","542":"Leavanny","543":"Venipede","544":"Whirlipede","545":"Scolipede","546":"Cottonee","547":"Whimsicott","548":"Petilil","549":"Lilligant","550":"Basculin","551":"Sandile","552":"Krokorok","553":"Krookodile","554":"Darumaka","555":"Darmanitan","556":"Maractus","557":"Dwebble","558":"Crustle","559":"Scraggy","560":"Scrafty","561":"Sigilyph","562":"Yamask","563":"Cofagrigus","564":"Tirtouga","565":"Carracosta","566":"Archen","567":"Archeops","568":"Trubbish","569":"Garbodor","570":"Zorua","571":"Zoroark","572":"Minccino","573":"Cinccino","574":"Gothita","575":"Gothorita","576":"Gothitelle","577":"Solosis","578":"Duosion","579":"Reuniclus","580":"Ducklett","581":"Swanna","582":"Vanillite","583":"Vanillish","584":"Vanilluxe","585":"Deerling","586":"Sawsbuck","587":"Emolga","588":"Karrablast","589":"Escavalier","590":"Foongus","591":"Amoonguss","592":"Frillish","593":"Jellicent","594":"Alomomola","595":"Joltik","596":"Galvantula","597":"Ferroseed","598":"Ferrothorn","599":"Klink","600":"Klang","601":"Klinklang","602":"Tynamo","603":"Eelektrik","604":"Eelektross","605":"Elgyem","606":"Beheeyem","607":"Litwick","608":"Lampent","609":"Chandelure","610":"Axew","611":"Fraxure","612":"Haxorus","613":"Cubchoo","614":"Beartic","615":"Cryogonal","616":"Shelmet","617":"Accelgor","618":"Stunfisk","619":"Mienfoo","620":"Mienshao","621":"Druddigon","622":"Golett","623":"Golurk","624":"Pawniard","625":"Bisharp","626":"Bouffalant","627":"Rufflet","628":"Braviary","629":"Vullaby","630":"Mandibuzz","631":"Heatmor","632":"Durant","633":"Deino","634":"Zweilous","635":"Hydreigon","636":"Larvesta","637":"Volcarona","638":"Cobalion","639":"Terrakion","640":"Virizion","641":"Tornadus","642":"Thundurus","643":"Reshiram","644":"Zekrom","645":"Landorus","646":"Kyurem","647":"Keldeo","648":"Meloetta","649":"Genesect","650":"Chespin","651":"Quilladin","652":"Chesnaught","653":"Fennekin","654":"Braixen","655":"Delphox","656":"Froakie","657":"Frogadier","658":"Greninja","659":"Bunnelby","660":"Diggersby","661":"Fletchling","662":"Fletchinder","663":"Talonflame","664":"Scatterbug","665":"Spewpa","666":"Vivillon","667":"Litleo","668":"Pyroar","669":"Flabébé","670":"Floette","671":"Florges","672":"Skiddo","673":"Gogoat","674":"Pancham","675":"Pangoro","676":"Furfrou","677":"Espurr","678":"Meowstic","679":"Honedge","680":"Doublade","681":"Aegislash","682":"Spritzee","683":"Aromatisse","684":"Swirlix","685":"Slurpuff","686":"Inkay","687":"Malamar","688":"Binacle","689":"Barbaracle","690":"Skrelp","691":"Dragalge","692":"Clauncher","693":"Clawitzer","694":"Helioptile","695":"Heliolisk","696":"Tyrunt","697":"Tyrantrum","698":"Amaura","699":"Aurorus","700":"Sylveon","701":"Hawlucha","702":"Dedenne","703":"Carbink","704":"Goomy","705":"Sliggoo","706":"Goodra","707":"Klefki","708":"Phantump","709":"Trevenant","710":"Pumpkaboo","711":"Gourgeist","712":"Bergmite","713":"Avalugg","714":"Noibat","715":"Noivern","716":"Xerneas","717":"Yveltal","718":"Zygarde","719":"Diancie","720":"Hoopa","721":"Volcanion"}
};

window.nurx = (function() {

    var pokedata = window.pokedata;
    var DEFAULT_SERVICE_PORT = 14251;

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
                connectionText(tr("Connection lost<br />reconnecting ...")());
            } else if (wsConnectTries < 3) {
                timeout = 20000;            // 20 seconds until 3rd try;
                connectionText(tr("Connection lost<br />trying again in 20 seconds ...")());
            } else if (wsConnectTries < 10) {
                timeout = 1000 * 60 * 5;    // 5 minutes until 10th try.
                connectionText(tr("Connection lost<br />trying again in 5 minutes  ...")());
            } else {
                timeout = 1000 * 60 * 20;   // 20 minutes.
                connectionText(tr("Connection lost<br />trying again in 20 minutes ...")());
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
        $("#" + nurx.instanceId + " .log-content").append("<div class='log-entry log-color-" + tr(logLevels[message.Data.Level])() + "'>[" + logLevels[message.Data.Level] + "] " + message.Data.Message + '</div>');
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

window.nurx.registerPanel("navigation", function(nurx) {
    var LOCATION_HISTORY_MAX_POINTS = 200;

    var map;
    var playerMarker;
    var fortMarkers = [];
    var encounterMarkers = [];

    //var mapStyle = [{"stylers":[{"hue":"#ff1a00"},{"invert_lightness":true},{"saturation":-100},{"lightness":33},{"gamma":0.5}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#2D333C"}]}];
    //var mapStyle = [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#193341"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#2c5a71"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#29768a"},{"lightness":-37}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#406d80"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#406d80"}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#3e606f"},{"weight":2},{"gamma":0.84}]},{"elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"weight":0.6},{"color":"#1a3541"}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#2c5a71"}]}];
    var mapStyle = [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"lightness":33}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2e5d4"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#c5dac6"}]},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#c5c6c6"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#e4d7c6"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#fbfaf7"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"color":"#acbcc9"}]}];


    var locationHistory = [];
    var locationLine;

    function init() {
        // Initialize the map.
        var mapOptions = {
            zoom:18,
            center: new google.maps.LatLng(51.5073509,-0.12775829999998223),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: mapStyle,
            mapTypeControl: false,
            scaleControl: false,
            zoomControl: false,
        };
        map = new google.maps.Map(document.getElementById('gmap-' + nurx.instanceId), mapOptions);

        playerMarker = new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(51.5073509,-0.12775829999998223),
            icon: "img/marker_50.png",
            zIndex: 200
        }); 
    }


    /**
     * Handle location updates.
     */
    function updateLocation(message) {

        // Set the center and player marker.
        var pos = new google.maps.LatLng(message.Data.Lat, message.Data.Lng);
        map.setCenter(pos);
        playerMarker.setPosition(pos);

        // Setup the location history line.
        locationHistory.push({ lat: message.Data.Lat, lng: message.Data.Lng });
        while(locationHistory.length > LOCATION_HISTORY_MAX_POINTS) {
            locationHistory.splice(0, 1);
        }

        if(locationLine != null)
            locationLine.setMap(null);

        locationLine = new google.maps.Polyline({
            path: locationHistory,
            geodesic: true,
            strokeColor: '#5691FF',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        locationLine.setMap(map);
    }

    /**
     * Handle loading of pokestops.
     */
    function loadPokestops(message) {
        console.log(message);

        ko.utils.arrayForEach(fortMarkers, function(item) {
            item.setMap(null);
        });
        fortMarkers = [];

        ko.utils.arrayForEach(message.Data, function(fortData) {
            var fortMarker = new google.maps.Marker({
                map: map,
                position: new google.maps.LatLng(fortData.Latitude, fortData.Longitude),
                icon: "img/pokestop_25.png",
                zIndex: 100
            });
            fortMarkers.push(fortMarker);
        });
    }

    /**
    * Handle forUsed.
    */
    function fortUsed(message) {
        var fortPos = new google.maps.LatLng(message.Data.Latitude, message.Data.Longitude);

        // Find the fort that was used.
        var matchFort;
        for (var i = 0; i < fortMarkers.length; i++) {            
            if (fortPos.equals(fortMarkers[i].position)){
                matchFort = fortMarkers[i];
                break;
            }
        }

        if (matchFort != null) {
            matchFort.setIcon("img/pokestop_50.png");
            window.setTimeout(function() { matchFort.setIcon("img/pokestop_25.png"); }, 1000 * 60 * 5);
        }
    }


    /**
     * Show an encounter on the map.     
     */
    function showEncounter(encounter) {
        /*var pokeMarker = new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(encounter.Lat, encounter.Lng),
            icon: "img/pokemon/" + encounter.PokemonData.PokemonId + ".png",
            zIndex: 100
        });*/

        var pokeMarker = new EncounterMarker(
            new google.maps.LatLng(encounter.Lat, encounter.Lng), 
            map,
            {
                PokemonId:  encounter.PokemonData.PokemonId
            }
        );

        encounterMarkers.push(pokeMarker);
        setTimeout(function() {
            console.log("removing pokemon marker");

            try {
                for(var i = 0; i < encounterMarkers.length; i++) {
                    if(encounterMarkers[i] == pokeMarker) {
                        encounterMarkers.splice(i, 1);
                        return;
                    }                    
                }
                
                pokeMarker.remove();
                pokeMarker.setMap(null);
            } catch(err) {
                console.log("Error removing encounter marker: ", err);
            }
        }, 1000 * 60 * 3);
    }

    /**
     * Handle nearby encounters.
     */
    function encounterNearby(message) { 
        console.log("Nearby encounter: ", message);

        showEncounter({
            PokemonData: message.Data.PokemonData,
            Lat: message.Data.Latitude,
            Lng: message.Data.Longitude,
            SpawnId: message.Data.SpawnPointId,
            EncounterId: message.Data.EncounterId
        });
    }


    /**
     * Handle lure encounters.
     */
    function encounterLure(message) { }


    /**
     * Handle incense encounters.
     */
    function encounterIncense(message) { }


    // Setup websockets command listners.
    nurx.commandListeners["fortused"] = fortUsed;
    nurx.commandListeners["update_location"] = updateLocation;
    nurx.commandListeners["pokestops"] = loadPokestops;
    nurx.commandListeners["encounter_nearby"] = encounterNearby;
    nurx.commandListeners["encounter_lure"] = encounterLure;
    nurx.commandListeners["encounter_incense"] = encounterIncense;
    

    return {   
        init: init
    };
});

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
            case "Perfection": return tr("IV")();      
            case "Cp": return tr("CP")();
            case "Hp": return tr("HP")(); 
            case "PokemonId": return tr("Number")();     
            case "CreationTimeMs": return tr("Recent")();
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