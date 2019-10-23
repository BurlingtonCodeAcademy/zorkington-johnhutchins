//globals
const readline = require('readline');
const readlineInterface = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
    return new Promise((resolve, reject) => {
        readlineInterface.question(questionText, resolve);
    });
}

class Player{
    constructor(name,title){
        this.name = name,
        this.title = title
    }
    inventory = [];
    drop = function(item){
        delete this.inventory[item];
    }
    take = function(item){
        this.inventory.push(item);
    }
    speak = function(words){
        console.log(words);
    }
    showInventory = function(){
        console.log(inventory);
    }
}

class Location{
    constructor(name,description,subLocations, items, isCurrentLocation, nextLocation){
        this.name = name,
        this.description = description,
        this.subLocations = subLocations,
        this.items = items,
        this.isCurrentLocation = isCurrentLocation,
        this.nextLocation = nextLocation
    }
    goToSubLocation(){ 
         
    }
}

class Objects{
    constructor(name,description,actions,nextHotItem,offLimits){
        this.name = name,
        this.description = description,
        this.actions = actions,
        this.nextHotItem = nextHotItem,
        this.offLimits = offLimits
    }
}

let locationsVisited = [];

//players
let bob = new Player('Bob','teacher');
let josh = new Player('Josh','classmate');

//objects
let coffee = new Objects('Coffee','you brew some fantastic coffee',['brew','drink','give','chuck']);
let mac = new Objects('MacBook','turns on so you can do your work',['go code','get mac','go to class','search web'],coffee);
let sevenDays = new Objects('Seven Days','Headline: Burlington Man Decides to Code!\nYou could take the paper or leave it, but you should head to class',['read'],mac);
let keypad = new Objects('keypad','the screen blinks...\nAwaiting your input...\n',['keypad','unlock','unlock door','code','code 12345','12345'],sevenDays);
let pen = new Objects('Pen','you jot down notes',['write','scratch']);
let boat = new Objects('powerboat','you drive the boat around for a while',['drive','dock']);
let sign = new Objects('sign', 'The sign says "Welcome to Burlington Code Academy! Come on up to the third floor. If the door is locked, use the keypad code 12345."',['read','head'],keypad,['take']);
let beer = new Objects('beer','mmm an ice cold switchback.... ',['give','take','drink','spill'],null)

//locations
let southHero = new Location('South Hero','southern most base of the resistance', ['bay','inland','woods'],['go to'],['wooden bowl','old schoolhouse'],false,null)
let fort = new Location('Fort','a stout and sturdy defense of pillows and blankets',null, null,['magazine','popcorn'],false,southHero);

let truck = new Location('Truck','you start driving your truck, where do you want to go? ',['driverseat','backseat'],['drive','park'],['radio','steering wheel'],false,fort);
let home = new Location('Home','You go home and lago homydown to take a nap.\nThese micro brews sure do make you tired!!\nYou wake up, what do you want to do? ',null,['sleep','go to work','get in truck','code'],['microwave','tv'],false,truck)
let splash = new Location("Splash, a bar",'you get a beer with Bob and discuss "this" in javascript.\nYou wonder, what should you do next? ',null,[beer,'drink beer','buy beer','buy another beer','go home','take pint glass'],false,home)
let lakefront = new Location('Lakefront','You sit by the lake, enjoying your day, when Bob walks down and wonders if you will buy him a beer? ',['splash','boathouse','park'],['get beer','go to splash'],['ice cream stand','bikepath'], false,home)
let churchStreet = new Location('Church Street','You stagger out, bleary eyed, looking at lower church street. What do you want to do? ',['lululemon','ll bean','leunigs'],['walk','go to waterfront'],['ben and jerrys'], false,lakefront)
let BCAclassroom = new Location('BCA Classroom','You walk into class, sit down, open your comptuer, and start working.\nYou start to walk out the door but realize you left your computer..\nWhat do you want to do? ',null,[mac,'attend class','make tea','listen to bob','study','leave class','leave'],false,churchStreet)
let BCA = new Location('Burlington Code Academy','You walk up the stairs, looking at the BCA classroom...  ',['foyer','staircase','classroom'],['study','code','attend class','talk to Bob'],[mac], false,BCAclassroom)
let foyer182Main = new Location('182 Main Street - Foyer',"You are in a foyer. In Vermont, this is pronounced FO-ee-yurr'. A copy of Seven Days lies in a corner.\nYou can go upstairs and go to class ",null,[sevenDays],false,BCA)
let mainStreet = new Location('Main Street', '182 Main St.\nYou are standing on Main Street between Church and South Winooski.\nThere is a door here. A keypad sits on the handle.\nOn the door is a handwritten sign.',['foyer','staircase','hallway'],[sign],true,foyer182Main)

let currentLocation = mainStreet
let timesThroughGame = 0
async function playGame(){
    timesThroughGame++
    let locations = [
        southHero,
        fort,
        truck,
        home,
        splash,
        lakefront,
        churchStreet,
        BCAclassroom,
        BCA,
        foyer182Main,
        mainStreet
    ]


    let newPlayer = new Player('john','learner');

    if(timesThroughGame > 1){

    }
    if(currentLocation === mainStreet){
        let firstPrompt = await ask(currentLocation.description)
        while(firstPrompt !== 'read'){
            firstPrompt = await ask(currentLocation.description)
        }

        
        if(currentLocation.items[0].actions.includes(firstPrompt)){
            let prompt = await ask(currentLocation.items[0].description)
            while(!keypad.actions.includes(prompt)){
                console.log("KeyPad prompt === " + prompt)
                prompt = await ask(currentLocation.items[0].description)
            }
            if(prompt === 'keypad'){
                let keypadDesc = await ask(keypad.description)
                if(keypadDesc === '12345'){
                    //move to next room
                    currentLocation = foyer182Main
                } else {
                    keypadDesc = await ask(keypad.description)
                }
            }

/*             if(keypad.actions.includes(prompt)){
                console.log("Enter the next building.")
                currentLocation = foyer182Main
            } */
        }
    }

    if(currentLocation === foyer182Main){
        let current = await ask(foyer182Main.description)

        if(current.startsWith('take')){
            takeItem(newPlayer,current)
            //newPlayer.inventory.push(current.substring(4))
            console.log("Plyaer inv = " + newPlayer.inventory)
        }
        if(current === 'read'){
            console.log("You read the paper.... ")
            current = await ask(foyer182Main.description)
        }
        if(current === 'go upstairs'){
            currentLocation = currentLocation.nextLocation
        }
    }

    if(currentLocation === BCA){
        let cur = await ask(currentLocation.description)
        //console.log("CURRENT LOCATION === " + currentLocation.name)
        if(currentLocation.items.includes(cur)){
            //TODO manually set next location here... for some reason
            currentLocation = BCAclassroom
        }
    }

    if(currentLocation === BCAclassroom){
        let cur = await ask(currentLocation.description)
        if(currentLocation.items[0].actions.includes(cur)){
            //pickup computer 
            takeItem(newPlayer,currentLocation.items[0])
            console.log("New player iteems = " + newPlayer.inventory)
        }
        if(cur === 'leave class' || cur === 'leave'){
            currentLocation = currentLocation.nextLocation
        }
    }

    if(currentLocation === churchStreet){
        let cur = await ask(currentLocation.description)
        if(currentLocation.items.includes(cur)){
            console.log("Great idea, you walk tot the lakefront")
            currentLocation = lakefront
        }
    }

    if(currentLocation === lakefront){
        let cur = await ask(currentLocation.description)
        if(currentLocation.items.includes(cur)){
            currentLocation = splash
        }
    }

    if(currentLocation === splash){
        let cur = await ask(currentLocation.description)
        if(cur === 'take pint glass'){  
            console.log("Bob wants a glass also, so you give him one.")
            giveItem(newPlayer,bob,cur.substring(4))
            takeItem(newPlayer,cur.substring(4))
        }
        if(cur === 'go home'){
            currentLocation = home
        }
        
    }

    if(currentLocation === home){
        let cur = await ask(home.description)
        if(cur === 'go to work'){
            currentLocation = truck
        }
        if(cur === 'get in truck'){
            currentLocation = truck
        }
    }

    if(currentLocation === truck){
        let locationsPossible = [];
        //TODO should map these objects to "NAME": "locationObject"
        locations.forEach((loca)=>{
            locationsPossible.push(loca)
        })

       //let player go to any location they want.
        let cur = await ask(currentLocation.description)
        locationsPossible.forEach((location)=>{
            if(cur === location.name){
                //go to the location of their choosing
                console.log("You selected " + location.name)
                currentLocation = location
                console.log("CURRENT LOCATION SHOULD BE CHANGED +++ " + currentLocation.name)
                playGame()
            } else {
                //go to the default location.
            }

        })


    }

}


playGame();

async function askCurrentLocationQuestion(location){
    return await ask(location.description)
}

async function setCurrentLocation(location){
    return location.nextLocation
}

async function takeItem(player,string){
    let currentPlayer = player;
    if(string.startsWith('take')){
        return currentPlayer.inventory.push(string.substring(4))
    } else {
        return
    }
}

async function giveItem(giver,receiver,string){
    let givingPlayer = giver
    let receivingPlayer = receiver
    if(string.startsWith('give')===true){
        receivingPlayer.inventory.push(string.substring(4))
    }
}

async function checkPromptForInventory(string){
    if(string === 'i' || string === 'inventory' || string === 'player inventory'){
        return Player.inventory
    } else {
        return 'You have no inventory'
    }
}

async function checkPromptForTake(string){
    if(string.startsWith('take')){
        
    }
}

async function goAnywhere(location){
    //set currentlocation to location
    return this.current = location
}

async function cheatCodeValidator(string){
    const cheatCode = 'xyzzy'
    if(string.startsWith(cheatCode)){
        console.log("You entered the cheat code\nWe should take care of that here...")
    }
}


 /* let currentLocation = mainStreet

    async function locationQuestionIntoHotItemQuestion(){
        console.log("curent location ==== " + currentLocation.name)
    
        let currentItem = currentLocation.items[0]
        console.log("CURRENT ITEM ==== "+ currentItem.name)
        let nextItem = currentItem.nextHotItem
        console.log("NEXT ITEM === " + nextItem)
        let locationActions = currentLocation.items[0].actions
        let locationPrompt = await ask(currentLocation.description)
        
        if(locationActions.includes(locationPrompt)){
            let nextItemActions = nextItem.actions
            let askCurrent = await ask(currentItem.description)
            if(nextItemActions.includes(askCurrent)){
                //set new location and start process all over again
                currentLocation = currentLocation.nextLocation
                locationQuestionIntoHotItemQuestion()
            } else {
                console.log("Goodbye.")
            }
        } 
    }
locationQuestionIntoHotItemQuestion()
/*      let whichPlayer = await ask("Want to create a new character? y Or n");
    if(whichPlayer === 'y'){
        let firstName = await ask("What is your name? ");
        let title = await ask("What is your role? ");
        newPlayer = new Player(firstName,title);
    }
     */
    