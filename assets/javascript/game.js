//load up the page, there are 4 characters - Done!
var mario = {
    name: "Mario",
    hP: 120,
    aTKP: 8,
    baseATKP: 8,
    counterATKP: 8,
    image: "./assets/images/0.png"
};

var link = {
    name: "Link",
    hP: 100,
    aTKP: 8,
    baseATKP: 8,
    counterATKP: 8,
    image: "./assets/images/1.png"
};

var samus = {
    name: "Samus",
    hP: 140,
    aTKP: 5,
    baseATKP: 5,
    counterATKP: 15,
    image: "./assets/images/2.png"
};

var fox = {
    name: "Fox",
    hP: 110,
    aTKP: 10,
    baseATKP: 10,
    counterATKP: 10,
    image: "./assets/images/3.png"
};

var characterArray = [mario, link, samus, fox];
var characterNames = ["Mario", "Link", "Samus", "Fox"];
var attack;
var didIChooseMyCharacterYet = false;
var areYouFighting = false;
var gameOver = false;
var yourCharacter = {};
var opponent = {};

// pre-load the music files on page load so they're ready to play immediately when triggered
var fightMusic = new Audio("./assets/music/background.mp3");
var failMusic = new Audio("./assets/music/fail.mp3");
var winMusic;

function addCharacterImage(object, id) {
    var fighterImg = $("<img>");
    fighterImg.addClass("img-fluid");
    fighterImg.attr("src", object.image);
    fighterImg.attr("id", "fighter"+object.name);
    $(id).prepend(fighterImg);
}

function hpUpdate(object, id) {
    var fighterHP = object.hP;
    $(id).attr("hidden", false);
    $(id).text("HP: "+fighterHP);
}


$(document).on("click", ".character-select", function(){
    if (!areYouFighting && !gameOver) {
        if(didIChooseMyCharacterYet) {
            //choose a character you want to attack
            var htmlSelected = $(this).attr("data-index");
            htmlSelected = parseInt(htmlSelected);
            opponent = characterArray[htmlSelected];
            var index = characterNames.indexOf(opponent.name);
            characterNames.splice(index, 1);
            console.log(characterNames);
            hpUpdate(opponent, "#opponentHp");
            addCharacterImage(opponent, "#cpu-fighter-image");
            $(this).attr("src" ,  "assets/images/"+opponent.name+"Gray.png");
            $(this).removeClass("character-select");
            $("#buttom-image").attr("hidden", false);
            areYouFighting = true;
        } else {
            //select a character
            // save what character we selected
            var htmlSelected = $(this).attr("data-index");
            htmlSelected = parseInt(htmlSelected);
            yourCharacter = characterArray[htmlSelected];
            // remove the selected character from the characterArray
            var index = characterNames.indexOf(yourCharacter.name);
            characterNames.splice(index, 1);
            console.log(characterNames);
            // generate the fighter image and append it to character area
            hpUpdate(yourCharacter, "#yourHp");
            addCharacterImage(yourCharacter, "#your-fighter-image");
            // change the src to the black and white version
            $(this).attr("src" ,  "assets/images/"+yourCharacter.name+"Gray.png");
            // take the character-select class off so the delegated click event does not fire on after the pic is black and white
            $(this).removeClass("character-select");
            // pre-load the win music for the selected character, just in case
            winMusic = new Audio("./assets/music/"+yourCharacter.name+".mp3");
            // start playing the main battle music after character is selected.  can't play audio on page load now (in a straightforward way) due to browser restrictions.
            fightMusic.play();
            // indicate to code that your character was selected, in order to handle click events properly
            didIChooseMyCharacterYet = true;
        }
    }
})

$("#attack-button-image").on("click" ,  function(){
    if (areYouFighting && !gameOver) {
        // your attack
        opponent.hP = opponent.hP - yourCharacter.aTKP;
        hpUpdate(opponent, "#opponentHp")
        // counter attack
        yourCharacter.hP = yourCharacter.hP - opponent.counterATKP;
        hpUpdate(yourCharacter, "#yourHp")
        // increase attack power
        yourCharacter.aTKP = yourCharacter.aTKP + yourCharacter.baseATKP;
        // check if your hp is 0 or less
        // if your hp is less than or equal to 0, say you lose and stop the game
        if (yourCharacter.hP <= 0) {
            $("#results").text("You lose!");
            fightMusic.pause();
            failMusic.play();
            gameOver = true;
        }
        // check if opponent hp is 0 or less
        if (opponent.hP <= 0 && yourCharacter.hP >= 0) {
            // hide the HP until a new opponent is selected
            $("#opponentHp").attr("hidden", true);
            // remove opponent image from cpu-fighter-image element
            $("#fighter"+opponent.name).remove()
            // clear the opponent variable
            opponent = {};
            // DONT DO THIS - THE INSTRUCTIONS DID NOT SAY TO RESET THE ATTACK POWER - reset yourCharacter.aTKP to baseATKP
            // yourCharacter.aTKP = yourCharacter.baseATKP;
            areYouFighting = false;
            // hide the attack button again to indicate to the user that you are supposed to pick another opponent
            $("#buttom-image").attr("hidden", true);
            // check to see if any opponents are left in the characterArray
            if (characterNames.length < 1) {
                $("#results").text("You win!");
                fightMusic.pause();
                winMusic.play()
                gameOver = true;
            }
        }
    }
})