import {
    readyException
} from "jquery";

let game: Array <string> = ["diamond", "pearl", "heartgold", "soulsilver", "platinum"];

//let kanto: Array < number > = range(0, 151);
//let johto : Array<number> = range(100,152)

let johto: Array < number > = range(493, 1);

let globalIdArray : Array <number> = [];

let perGameCatchEntries : number = 3;

let gameRegionMap: Map < string, Array < number >> = new Map < string,
    Array < number >> ();

let pokemonIdMap: Array < string > = [];

function uploadAndIngestSave() : void {
    document.getElementById('file').click();
    
    
}

document.getElementById('file').addEventListener('change', () => {
    
    document.getElementById('uploadfile').click();
}, false);

function toggleSrcOn(htmlID: string): void {
    //
    document.getElementById(htmlID).setAttribute("src", document.getElementById(htmlID).getAttribute("src").replace(".png", "_selected.png"));
}

function toggleSrcOff(htmlID: string): void {
    //
    document.getElementById(htmlID).setAttribute("src", document.getElementById(htmlID).getAttribute("src").replace("_selected.png", ".png"));
}

function resetAllProgress() : void{
    globalIdArray.forEach((id : number) => {

        if(document.getElementById(`${id}_checkbox`).checked){
            document.getElementById(`${id}_checkbox`).checked = false;
        }
   });
}




// https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server

function JSONgenerate() {
    let element : HTMLElement = document.createElement('a');

    let text = `{`

    //let count = 0;
    globalIdArray.forEach((id : number) => {
        if(document.getElementById(`${id}_checkbox`).checked){
            text += `"${id}": "completed"`
        }
        else{
            text += `"${id}": "not complete"`
        }

        if(id === globalIdArray.length){
            text += "\n";
        }else{
            text += ",\n";
        }

        
   }); 

   text += `}`

    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', "progress.json");
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}

/* Vanilla JS tutorial referenced to handle File IO
    https://gomakethings.com/how-to-upload-and-process-a-json-file-with-vanilla-js/
 */

// Get the form and file field
let form : any = document.querySelector('#upload');
let file : any = document.querySelector('#file');

/**
 * Handle submit events
 * @param  {Event} event The event object
 */
 function handleSubmit (event: any) {

	// Stop the form from reloading the page
	event.preventDefault();

	// If there's no file, do nothing
	if (!file.value.length) return;

	// Create a new FileReader() object
	let reader = new FileReader();

	// Setup the callback event to run when the file is read
	reader.onload = logFileAndApplyCheckMarks;

	// Read the file
	reader.readAsText(file.files[0]);

}

// Listen for submit events
form.addEventListener('submit', handleSubmit);


/**
 * Log the uploaded file to the console
 * @param {event} Event The file loaded event
 */
 function logFileAndApplyCheckMarks (event: any) {
	let str = event.target.result;
	let img = document.createElement('img');
	img.src = str;
	//app.append(img);
	//

    let json : any = JSON.parse(str);

    

    //https://stackoverflow.com/questions/684672/how-do-i-loop-through-or-enumerate-a-javascript-object
    for (let key in json) {
    if (json.hasOwnProperty(key)) {
        //

        if( json[key] === "completed" ){

            if(document.getElementById(`${key}_checkbox`) !== null){

                document.getElementById(`${key}_checkbox`).checked = true;

            }
        
        }



    }
}

}


function getCompletedPokemonPct(): number {

    let count = 0;

   globalIdArray.forEach((id : number) => {
        if(document.getElementById(`${id}_checkbox`).checked){
            count++;
        }
   }); 

    return Math.round((count/(globalIdArray.length-1) * 10000)) / 100;
}

function tweet() : void {

    if(getCompletedPokemonPct() >= 100){
        let tweetmsg : string = `I ${getCompletedPokemonPct()} % completed my Gen 4 Pokedex! Try out this pokedex helper tool at https://wustlcse204.github.io/10-final-project-individual-evinjaff/`
    } else{
        let tweetmsg : string = `I am ${getCompletedPokemonPct()} % into completing my Gen 4 Pokedex! Try out this pokedex helper tool at https://wustlcse204.github.io/10-final-project-individual-evinjaff/`
    }

    
    let url : string = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetmsg)}`

    document.getElementById("tweetlink").setAttribute("href", url);

    document.getElementById("tweetlink").click();
}

function revealDetails(htmlID: string): void {

    if(document.getElementById("placeholder") != null){
        document.getElementById("placeholder").remove();
    }

    const text: HTMLElement = document.getElementById(htmlID);
    text.classList.remove("d-none");
    text.classList.toggle("show");

    document.getElementById("displaybox").innerHTML = document.getElementById(htmlID).innerHTML;


}

//According to PokeApi, redundant queries such as Pokedex # must be cached
//TODO: REmove the blocking AJAX to make the site faster
function getPokemonNamefromId(pokemonId: number): string {

    ////
    //Assuming it's been cached
    if (pokemonIdMap[pokemonId] != null && pokemonIdMap[pokemonId] != undefined && pokemonIdMap[pokemonId] != "") {
        return pokemonIdMap[pokemonId];
    }
    //Otherwise take the long way round
    else {
        let pokeurl: string = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`

        let result: string = "";

        //used: https://stackoverflow.com/questions/5316697/jquery-return-data-after-ajax-call-success
        let ajaxSettings: object = {
            type: 'GET',
            url: pokeurl,
            async: true,
            success: function (data: any) {
                ////
                result = data["forms"][0]['name'];
                pokemonIdMap[pokemonId] = data["forms"][0]['name'];
            },

        };

        $.ajax(ajaxSettings);

        return result;
    }

    return "didn't make it";
}

function initGameRegionMap(): void {

    //Johto Region
    gameRegionMap.set("silver", johto);
    gameRegionMap.set("gold", johto);
    gameRegionMap.set("soulsilver", johto);
    gameRegionMap.set("heartgold", johto);

}

function createLoadingElement(id: string): HTMLElement {

    let loadingimg: HTMLElement = document.createElement("img");

    loadingimg.id = id;

    loadingimg.setAttribute("src", "img/loading.gif");

    loadingimg.setAttribute("alt", "loading")

    return loadingimg;
}

function range(size: number, startAt: number = 0): Array < number > {
    return [...Array(size).keys()].map(i => i + startAt);
}

function hideLoader() {
    $('#catch_loading_placeholder').hide();
}

$(window).ready(hideLoader);

// Strongly recommended: Hide loader after 20 seconds, even if the page hasn't finished loading
setTimeout(hideLoader, 20 * 1000);

function initializeState(): void {

    initGameRegionMap();

    //Get all the initial form fill-outs

    //let game: string = "heartgold"; //Something new

    let idArray : Array<number> = gameRegionMap.get("heartgold");

    globalIdArray = idArray;
    ////

    //document.getElementById("pokemon_catch_lookup").appendChild(createLoadingElement("catch_loading_placeholder"));

    let itemsProcessed: number = 1;

    idArray.forEach((pokemonId: number) => {

        let newDiv = document.createElement("div");

        newDiv.setAttribute("id", `${pokemonId}_info_container`)

        newDiv.classList.add("d-none");

        newDiv.classList.add("pokemon_info_container")

        document.getElementById("pokemon_catch_lookup").appendChild(newDiv);

        getPokemonCatch(game, pokemonId);

        

        itemsProcessed++;

        if (itemsProcessed === idArray.length) {

            //document.getElementById("catch_loading_placeholder").remove();

            //hideLoader();

            idArray.forEach((pokemonId: number) => {

                //

                if(document.getElementById(`${pokemonId}_info_container`) !== null){
                    document.getElementById(`${pokemonId}_info_container`).classList.remove("d-none");
                }

                
            });

            

        }

    });

    

    

    //document.getElementById("catch_loading_placeholder").remove();



}

function getPokemonSpriteSRC(pokemonId: number): string {

    let pokeurl: string = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`

    let result: string = "";

    //used: https://stackoverflow.com/questions/5316697/jquery-return-data-after-ajax-call-success
    let ajaxSettings: object = {
        type: 'GET',
        url: pokeurl,
        async: false,
        success: function (data: any) {
            ////
            result = data["sprites"]['front_default'];
        },

    };

    $.ajax(ajaxSettings);

    return result;

}


function getPokemonCatch(gameversion: string[], pokemon: number): void {

    let pokeurl: string = `https://pokeapi.co/api/v2/pokemon/${pokemon}/encounters`


    let ajaxSettings: object = {
        type: 'GET',
        url: pokeurl,
        success: function (msg: any) {
            ////

            let filteredArr: Array < object > = [];

            msg.forEach((item: any) => {
                item['version_details'].forEach((gameData: any) => {
                    if (game.indexOf(gameData['version']['name']) != -1) {
                        ////
                        ////

                        let elementToPush: any = gameData;

                        elementToPush["version_name"] = gameData['version']['name'];

                        elementToPush["location_name"] = item['location_area']['name'];

                        filteredArr.push(elementToPush);
                    }

                });
            });


            //Some logical test
            //if(){
            updatePokemonCatchUI(pokemon, filteredArr);

            //}
        },
        failure: function (msg: any) {}
    };

    $.ajax(ajaxSettings);

}

//From: https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
function capitalizeFirstLetter(input: string): string {
    return input.charAt(0).toUpperCase() + input.slice(1);
}

async function replaceSrc(htmlID: string, pokemonId: number): Promise < any > {

    ////

    // Used https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
    // to make loading work. Ironically my code runs too fast
    await new Promise(r => setTimeout(r, 1000));

    document.getElementById(htmlID).setAttribute("src", `${getPokemonSpriteSRC(pokemonId)}`);
}

function updatePokemonCatchUI(pokemonid: number, encounterarray: Array < object > ): void {
    //Do something
    ////

    //get the pokemon element
    let primaryelement: HTMLElement = document.getElementById(`${pokemonid}_info_container`);

    primaryelement.innerHTML = ""

    let title: HTMLElement = document.createElement("div");

    title.classList.add("visible_pokemon_region")
    
    //Async refactoring to get Pokemon Name

    let pokeurl: string = `https://pokeapi.co/api/v2/pokemon/${pokemonid}`

    let result: string = "";

    //used: https://stackoverflow.com/questions/5316697/jquery-return-data-after-ajax-call-success
    let ajaxSettings: object = {
        type: 'GET',
        url: pokeurl,
        async: true,
        success: function (data: any) {
            ////
            result = data["forms"][0]['name'];
            pokemonIdMap[pokemonid] = data["forms"][0]['name'];

            let pokemonName = result;

            title.innerHTML = `
            <input id="${pokemonid}_checkbox" type="checkbox" class="pokemon_checkbox">
            
            <img id="${pokemonid}_sprite" style="width: 30%" src="img/loadingpokeball.gif" alt="${pokemonid} sprite">
            
            <strong class="pokemon-title" onmouseleave='onclick=revealDetails("${pokemonid}_details")' onmouseover='onclick=revealDetails("${pokemonid}_details")'>${pokemonid}: ${removePastTheDash(capitalizeFirstLetter(pokemonName))}</p>
        
            
            `;
        
            //Debug button
        
            // <button onclick=revealDetails("${pokemonid}_details")>Reveal Details</button>
        
        
        
            primaryelement.appendChild(title);
        
        
            let hiddensection : HTMLElement = document.createElement('div');
        
            hiddensection.innerHTML += `<p class="pokemondetailtitle">${removePastTheDash(capitalizeFirstLetter(pokemonName))}</p>`
        
            hiddensection.setAttribute("id", `${pokemonid}_details`);
        
            hiddensection.classList.add("pokemonDetails");
        
            replaceSrc(`${pokemonid}_sprite`, pokemonid);
        
            ////
        
            if (encounterarray.length == 0) {
        
                let childElement: HTMLElement = document.createElement("p");
        
                let pokeurl: string = `https://pokeapi.co/api/v2/pokemon-species/${pokemonid}`
        
                let ajaxSettings: object = {
                    type: 'GET',
                    url: pokeurl,
                    success: function (data: any) {
                        //
        
                        let evolved: any = data['evolves_from_species'];
        
                        //
                        if (evolved != null) {
        
                            //Now let's go figure out the method
        
                            //
        
                            let evomethodajaxsettings: object = {
                                type: 'GET',
                                url: data['evolution_chain']['url'] + "?rv=" + Math.random(),
                                success: function (evo_msg: any) {
        
                                    //let evo_details : any = evo_msg['chain']['evolves_to'][0]['evolution_details'][0];
        
                                    //
                                    //
        
                                    if (evo_msg['chain'] != undefined) {
        
                                        ////
                                        childElement.innerHTML = traverseAndDetermineEvolution(evo_msg['chain'], pokemonName);
        
        
                                    } else {
        
                                        childElement.innerHTML = `<em>Evolution: </em> `;
        
                                        childElement.innerHTML += `Evolve from ${evolved['name']}`;
        
                                    }
        
                                },
                                failure: function (evo_err: any) {
                                    //
                                }
        
        
                            };
        
                            $.ajax(evomethodajaxsettings);
        
        
                        }
                        //Baby Pokemon Case
                        else if (data['is_baby']) {
                            childElement.innerHTML = `<img src="img/egg.gif" style="width: 10%" alt="egg">Obtain via hatching.`;
                        } else if (data['is_mythical']) {
                            childElement.innerHTML = `<img src="img/cherishball.webp" style="width: 10%" alt="cherishball">Is mythical and can only be obtained from special distribution events.`;
                        } else {
                            childElement.innerHTML = `Unable to be caught.`;
                        }
        
        
        
                    },
        
                };
        
                $.ajax(ajaxSettings);
        
        
        
        
        
        
                // Lookup evolution outcomes:
                // https://pokeapi.co/docs/v2#evolution-section
                // idea - if evolves too has more than 0
        
                hiddensection.appendChild(childElement);
        
            } else {
        
                let limit = 10;
                let counter = 1;
        
                ////
        
                // Let's sort the array and cleanly get it in
        
                encounterarray = sortAndPruneEncounterArray(encounterarray);
        
                ////
        
                encounterarray.every((encounterInfo: any) => {
        
                    
        
                    //TODO: Enforce strict ordering
        
                    let compositePct: Map < string, number > = buildCompositePct(encounterInfo['encounter_details']);
        
                    let childElement: HTMLElement = buildEncounterHTML(encounterInfo["location_name"], compositePct, encounterInfo["version_name"]);
        
                    hiddensection.appendChild(childElement);
        
                    if(counter === limit){
                        return false;
                    }
        
                    counter++;
        
                    return true;
        
                });
            }
        
        
            primaryelement.appendChild(hiddensection);
            //Clear out the sub elements

        },

    };


    $.ajax(ajaxSettings);

}

function buildEncounterHTML(location: string, condition: Map < string, number > , version: string): HTMLElement {
    let element = document.createElement("p");

    ////

    element.innerHTML = `<img width="10%" src="img/${version}.png">  <img width="5%" src="img/shakinggrass.gif" alt="shaking grass"><em>Catching: </em> `;

    element.innerHTML += cleanLocationString(location);

    //

    condition.forEach((percentage: number, conditionString: string) => {
        //

        if (percentage === 100) {
            element.innerHTML = ` <img width="10%" src="img/${version}.png"> <em>Static Encounter/Gift Pokemon: </em> <img width="5%" src="img/Bag_Parcel_Sprite.webp" alt="parcel"> ${location} \n`;
        } else {
            element.innerHTML += cleanConditionString(conditionString, percentage); 
        }
    });


    return element;
}

function cleanConditionString(condition : string, percentage : number) : string {
    
    if(condition === "stock"){
        return ": " + percentage + "%";
    }

    if(condition === "radar-on"){
        return ": " + percentage + "%" + ` (<img width="5%" src="img/pokeradar.png" alt="pokeradar"> Pokeradar)`;
    }

    if(condition === "swarm-yes"){
        return ": " + percentage + "%" + ` (<img width="5%" src="img/swarm.png" alt="pokeradar"> Swarm)`;
    }

    //Grouped Dual-Slot
    if(condition === "slot2-all"){
        return ": " + percentage + "%" + ` (<img width="7%" src="img/all.png" alt="pokeradar"> Dual Slot with all games)`;
    }

    if(condition === "slot2-frlge"){
        return ": " + percentage + "%" + ` (<img width="7%" src="img/frlge.png" alt="pokeradar"> Dual Slot with FireRed, LeafGreen, and Emerald)`;
    }
    
    //Individual Dual-Slot

    if(condition === "slot2-sapphire"){
        return ": " + percentage + "%" + ` (<img width="7%" src="img/saphire.png" alt="pokeradar"> Pokemon Sapphire Dual Slot)`;
    }

    if(condition === "slot2-ruby"){
        return ": " + percentage + "%" + ` (<img width="7%" src="img/ruby.png" alt="pokeradar"> Pokemon Ruby Dual Slot)`;
    }

    if(condition === "slot2-emerald"){
        return ": " + percentage + "%" + ` (<img width="7%" src="img/emerald.png" alt="pokeradar"> Pokemon Emerald Dual Slot)`;
    }

    if(condition === "slot2-leafgreen"){
        return ": " + percentage + "%" + ` (<img width="7%" src="img/leafgreen.png" alt="pokeradar"> Pokemon LeafGreen Dual Slot)`;
    }

    if(condition === "slot2-firered"){
        return ": " + percentage + "%" + ` (<img width="7%" src="img/firered.png" alt="pokeradar"> Pokemon FireRed Dual Slot)`;
    }


    
    
    
    return " " + condition + ": " + percentage + "%";

}

function cleanLocationString(location: string) : string{

    let noArea : string = location.replace("-area", "");

    let noHyphen : string = noArea.replace("-", " ");

    


    return noHyphen;
    
}


function buildCompositePct(encounterArray: Array < any > ): Map < string, number > {

    ////

    let map: Map < string, number > = new Map < string,
        number > ();

    //stock encounters
    map.set("stock", 0);

    let specialOnes = [];

    encounterArray.forEach((encounter: any) => {
        //
        let comboString = "";

        if(encounter["condition_values"].length === 0){
            map.set("stock", map.get("stock") + encounter["chance"] );
        }
        else{

        encounter["condition_values"].forEach((miniCondition: any) => {

            if(miniCondition["name"].includes("-no") || miniCondition["name"].includes("-off") ){
                map.set("stock", map.get("stock") + encounter["chance"] );
            }
            else {

                //Exclude redundant dual-slots

                if(map.get("stock") > 0 && miniCondition["name"].includes("slot2") ){

                }else{
                    map.set( miniCondition["name"], encounter["chance"]);
                }
               
                
            }



        });

        }

        map.forEach( (value:number, key:string) => {

            if( value <= map.get("stock") && key !== "stock"){
                map.delete(key);
            }

        })

        //

        

  


    });

    //

    if(map.get("stock") === 0){
        map.delete("stock");
    }

    //Combine multi-dual slot edge cases

    //All work
    if( map.has('slot2-ruby') && map.has('slot2-ruby') &&  map.has('slot2-sapphire') && map.has('slot2-emerald') && map.has('slot2-firered') &&  map.has('slot2-leafgreen')){
        map.set('slot2-all', map.get('slot2-ruby'));
        
        //

        map.delete('slot2-ruby') 
        map.delete('slot2-ruby')
        map.delete('slot2-sapphire') 
        map.delete('slot2-emerald') 
        map.delete('slot2-firered') 
        map.delete('slot2-leafgreen')
    }
    //FR/LG/E cases
    else if(map.has('slot2-emerald') && map.has('slot2-firered') &&  map.has('slot2-leafgreen') ){
        map.set('slot2-frlge', map.get('slot2-emerald'));
        
        //

        map.delete('slot2-emerald') 
        map.delete('slot2-firered')
        map.delete('slot2-leafgreen')
    }

    



    return map;

}


window.addEventListener("load", () => {
    initializeState();
}, false);

function traverseAndDetermineEvolution(evolutionChain: any, currentPokemon: string): string {

    let evoString;

    //

    //Keep looping through until you can find it

    try {
        let previousEvo = evolutionChain;
        let currentEvo = evolutionChain;
        while (true) {
            //Let's keep going deeper until we find what species we want

            if (currentEvo['evolves_to'].length > 1) {
                //This means branching evolution - Let's look through this. Since branching only happens
                //Once no recursion is needed

                //

                for (let i = 0; i < currentEvo['evolves_to'].length; i++) {

                    if (currentEvo['evolves_to'][i]['species']['name'] === currentPokemon || currentEvo['evolves_to'][i]['species']['name'] === removePastTheDash(currentPokemon)) {
                        //
                        //This means we got our pokemon!! 
                        let retString: string = "";

                        //

                        //


                        retString = buildEvoString(currentEvo['evolves_to'][i]["evolution_details"][0], previousEvo);


                        return retString;


                    } else{
                        //
                        //Let's look 1 deeper for the Silcoon/Beautifly case
                        for (let j = 0; j < currentEvo['evolves_to'][i]['evolves_to'].length; j++) {

                            //

                            if(currentEvo['evolves_to'][i]['evolves_to'][j]['species']['name'] === currentPokemon || currentEvo['evolves_to'][i]['evolves_to'][j]['species']['name'] === removePastTheDash(currentPokemon)){
                                //

                                return buildEvoString(currentEvo['evolves_to'][i]['evolves_to'][j]["evolution_details"][0], currentEvo['evolves_to'][i]);

                                
                            }
                        }

                    }

                }

            }


            //

            
            //Cherrim Edge Case
            if (currentEvo['evolves_to'].length === 0){
                return buildEvoString(currentEvo["evolution_details"][0], previousEvo);
            }

            if (currentEvo['evolves_to'][0]['species']['name'] === currentPokemon) {
                //This means we got our pokemon!! 

                let retString: string = "";

                //


                retString = buildEvoString(currentEvo['evolves_to'][0]["evolution_details"][0], previousEvo);

                //Determine Icon

                // Rare Candy:`<img width="5%" src="img/rarecandy.webp" alt="rare candy"><em>Evolution: </em> `


                return retString;


            }

            //
            currentEvo = currentEvo['evolves_to'][0];
            previousEvo = currentEvo;






        }

    } catch (e: any) {

        return `Unknown Evolution Method`;
    }


    return evoString;
}

function appendGenderString(gender: number, pokemon: string): string {
    // 0 : male
    // 1 : female

    if (gender === null) {
        return pokemon;
    }

    if (gender === 2) {
        return "male " + pokemon;
    } else {
        return "female " + pokemon;
    }

}

function buildEvoString(evoInfo: any, previousEvo: any): string {
    //Build Trigger

    let retString = "";

    let evolvingPokemon = capitalizeFirstLetter(previousEvo["species"]["name"]);


    //Weird dual-form edge case
    if(evolvingPokemon === "Cherrim"){
        evolvingPokemon = "Cherubi";
    }

    if (!Array.isArray(evoInfo)) {



        if (evoInfo['trigger']['name'] === "level-up") {
            retString = `<img width="10%" src="img/rarecandy.webp" alt="rare candy"> Level up ${appendGenderString(evoInfo['gender'], evolvingPokemon)}`
        } else if (evoInfo['trigger']['name'] === "use-item") {
            retString = `Use a  `;
        } else if (evoInfo['trigger']['name'] === "trade") {
            retString = `<img width="10%" src="img/trade.webp" alt="rare candy"> Trade  ${appendGenderString(evoInfo['gender'], evolvingPokemon)}`;
        } else if (evoInfo['trigger']['name'] === "shed") {
            return `<img width="10%" src="img/shedshell.webp" alt="rare candy"> Evolve Nincada while possessing a pokeball and an open slot in your party`;
        } else {
            retString = "Weird Stuff";
        }

        //Add effects

        if (evoInfo['item'] != null) {

            let prettyName = evoInfo['item']['name'].replace("-", "").toLowerCase();

            retString = `<img width="10%" src="img/${prettyName}.webp" alt="${prettyName}"> ` + retString;

            retString += ` ${ evoInfo['item']['name'].replace("-", " ") } on ${appendGenderString(evoInfo['gender'], evolvingPokemon)}`;
        }

        if (evoInfo['min_level'] != null) {
            retString += ` to level ${evoInfo['min_level']}`;
        }

        if (evoInfo['held_item'] != null) {
            retString += ` holding a ${evoInfo['held_item']['name'].replace("-", " ")}`;
        }

        if (evoInfo['min_happiness'] != null) {
            retString += ` with high friendship`;
        }

        if (evoInfo['min_beauty'] != null) {
            retString += ` with high beauty`;
        }

        if (evoInfo['known_move'] != null) {
            retString += ` and teach it ${evoInfo['known_move']['name'].replace("-", " ")}`;
        }

        if (evoInfo['party_species'] != null) {
            retString += ` with a ${evoInfo['party_species']['name'].replace("-", " ")} in your party`;
        }


        if (evoInfo['time_of_day'] != null && evoInfo['time_of_day'] != "") {
            retString += ` at ${evoInfo['time_of_day'].replace("-", " ")}`;
        }

        if (evoInfo['relative_physical_stats'] != null) {
            retString += ` with its ${determineGreaterStat(evoInfo['relative_physical_stats'])}`;
        }

        if (evoInfo['location'] != null) {
            retString += ` at ${evoInfo['location']['name'].replace("-", " ")}`;
        }
    } else {
        //
        if (evoInfo[0]['trigger']['name'] === "level-up") {
            retString = `<img width="10%" src="img/rarecandy.webp" alt="rare candy"> Level up ${appendGenderString(evoInfo[0]['gender'] , evolvingPokemon)}`
        } else if (evoInfo[0]['trigger']['name'] === "use-item") {
            retString = `<img width="10%" src="img/placeholderitem.png" alt="rare candy"> Use a  `;
        } else if (evoInfo[0]['trigger']['name'] === "trade") {
            retString = `<img width="10%" src="img/trade.webp" alt="rare candy"> Trade  ${appendGenderString(evoInfo[0]['gender'] , evolvingPokemon)}`;
        } else if (evoInfo[0]['trigger']['name'] === "shed") {
            return `<img width="10%" src="img/shedshell.webp" alt="rare candy"> Evolve Nincada while possessing a pokeball and an open slot in your party`;
        } else {
            retString = "Weird Shit";
        }

        //Add effects

        if (evoInfo[0]['item'] != null) {

            let prettyName = evoInfo[0]['item']['name'].replace("-", "").toLowerCase();

            retString = `<img width="10%" src="img/${prettyName}.webp" alt="${prettyName}"> ` + retString;

            retString += ` ${ evoInfo[0]['item']['name'].replace("-", " ") } on ${appendGenderString(evoInfo[0]['gender'] , evolvingPokemon)}`;
        }

        if (evoInfo[0]['min_level'] != null) {
            retString += ` to level ${evoInfo[0]['min_level']}`;
        }

        if (evoInfo[0]['min_happiness'] != null) {
            retString += ` with high friendship`;
        }

        if (evoInfo[0]['held_item'] != null) {
            retString += ` holding a ${evoInfo[0]['held_item']['name'].replace("-", " ")}`;
        }

        if (evoInfo[0]['known_move'] != null) {
            retString += ` and teach it ${evoInfo[0]['known_move']['name'].replace("-", " ")}`;
        }

        //
        if (evoInfo[0]['time_of_day'] != null && evoInfo[0]['time_of_day'] != "") {
            retString += ` at ${evoInfo[0]['time_of_day'].replace("-", " ")}`;
        }

        if (evoInfo[0]['relative_physical_stats'] != null) {
            retString += ` with its ${determineGreaterStat(evoInfo[0]['relative_physical_stats'])}`;
        }


        if (evoInfo[0]['location'] != null) {
            retString += ` at ${evoInfo[0]['location']['name'].replace("-", " ")}`;
        }
    }




    return retString;
}

function removePastTheDash(currentPokemon: string) {
    //https://stackoverflow.com/questions/5631384/remove-everything-after-a-certain-character
    if(currentPokemon.split("-")[1] === "oh" || currentPokemon.split("-")[1] === "mime" || currentPokemon.split("-")[1] === "jr"){
        return currentPokemon;
    }

    return currentPokemon.split("-")[0];
}

function determineGreaterStat(statNumber: number) {
    switch (statNumber) {
        case 0:
            return "attack and defense equal";
        case -1:
            return "defense greater than attack";
        case 1:
            return "attack greater than defense";
    }
}

function sortAndPruneEncounterArray(encounterarray: any[]): object[] {
    
    let sortedarray = encounterarray;

    // Referenced: https://www.tutorialspoint.com/how-to-define-custom-sort-function-in-javascript#:~:text=To%20define%20custom%20sort%20function%2C%20you%20need%20to%20compare%20first,the%20data%20in%20descending%20order.

    sortedarray.sort(function (first : any, second: any) {

        let firstVer : string = first['version_name'];
        let secondVer : string = second['version_name'];

        switch(firstVer){
            case "soulsilver":
                if(secondVer === "soulsilver"){
                    return 0;
                }
                return -1;

            case "heartgold":
                if(secondVer === "soulsilver"){
                    return 1;
                } else if(secondVer === "heartgold"){
                    return 0;
                } else{
                    return -1;
                }
            case "diamond":
                if(secondVer === "soulsilver"){
                    return 1;
                } else if(secondVer === "heartgold"){
                    return 1;
                } else if(secondVer === "diamond"){
                    return 0;
                } else{
                    return -1;
                }
            case "pearl":
                if(secondVer === "soulsilver"){
                    return 1;
                } else if(secondVer === "heartgold"){
                    return 1;
                } else if(secondVer === "diamond"){
                    return 1;
                } else if(secondVer === "pearl"){
                    return 0;
                } else{
                    return -1;
                }
            case "platinum":
                if(secondVer === "soulsilver"){
                    return 1;
                } else if(secondVer === "heartgold"){
                    return 1;
                } else if(secondVer === "diamond"){
                    return 1;
                } else if(secondVer === "pearl"){
                    return 1;
                } else{
                    return 0;
                }

            default:
                throw "Unknown Game" + firstVer + " , " + secondVer;
        }

     });

     //Build new array
     let newArray : Array<any> = [];
     let gameSpecificArray : Array<any> = [];

     let limit = perGameCatchEntries;

     let counter = 0;
    sortedarray.forEach((encounter : any) => {

        if(gameExistsInArrayAlready(encounter['version_name'], newArray)){
            
        }
        else{

            gameSpecificArray.push(encounter);

            ////
            
            if(!allVersionKeysMatch(gameSpecificArray)){
                ////

                let IncompatibleSide : Array<any>  = gameSpecificArray.slice(gameSpecificArray.length - 1 , gameSpecificArray.length);
                
                //

                newArray = newArray.concat(gameSpecificArray.slice( 0, gameSpecificArray.length-1 ));

                ////

                gameSpecificArray = IncompatibleSide;

                ////
            }

            ////

            counter++;

    
            if(gameSpecificArray.length === limit || sortedarray.length === counter){
                ////
                newArray = newArray.concat(gameSpecificArray);
                gameSpecificArray = [];
            }

            

        }
    });


    ////

    return newArray;
}
function allVersionKeysMatch(gameSpecificArray: any[]) : boolean {

    if(gameSpecificArray.length === 0){
        return true;
    }

    let matchedKey = gameSpecificArray[0]['version_name'];
    let flip = true;
    gameSpecificArray.forEach( (encounter) => {
        if(encounter['version_name'] !== matchedKey){
            flip = false;
        }
    });

    return flip;
}

function gameExistsInArrayAlready(versionNameToCheck : string , newArray: any[]) : boolean {
    if(newArray.length === 0){
        return false;
    }

    let flip = false;
    newArray.forEach((encounter) => {
        if(encounter['version_name'] === versionNameToCheck){
            flip = true;
        }
    });

    return flip;

}



