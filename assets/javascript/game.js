//load up the page, there are 4 characters - Done!
var mario = {
    name: "mario",
    hP: 120,
    aTKP: 4,
    baseATKP: 4,
    counterATKP: 10,
    image: "./assets/images/0.png"
};

var link = {
    name: "link",
    hP: 100,
    aTKP: 6,
    baseATKP: 6,
    counterATKP: 8,
    image: "./assets/images/1.png"
};

var samus = {
    name: "samus",
    hP: 180,
    aTKP: 5,
    baseATKP: 5,
    counterATKP: 5,
    image: "./assets/images/2.png"
};

var fox = {
    name: "fox",
    hP: 150,
    aTKP: 3,
    baseATKP: 3,
    counterATKP: 6,
    image: "./assets/images/3.png"
};

var characterArray = [mario, link, samus, fox];
var characterNames = ["mario", "link", "samus", "fox"];
var attack;
var didIChooseMyCharacterYet = false;
var areYouFighting = false;
var gameOver = false;
var yourCharacter = {};
var opponent = {};

function addCharacterImage(object, id) {
    var fighterImg = $("<img>");
    fighterImg.addClass("img-fluid");
    fighterImg.attr("src", object.image);
    $(id).append(fighterImg);
}

$(".character-select").on("click" , function(){
    if (!areYouFighting && !gameOver) {
        if(didIChooseMyCharacterYet) {
            //choose a character you want to attack
            var htmlSelected = $(this).attr("data-index");
            htmlSelected = parseInt(htmlSelected);
            opponent = characterArray[htmlSelected];
            var index = characterNames.indexOf(opponent.name);
            characterNames.splice(index, 1);
            console.log(characterNames);
            addCharacterImage(opponent, "#cpu-fighter-image");
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
            addCharacterImage(yourCharacter, "#your-fighter-image");
            didIChooseMyCharacterYet = true;
        }
    }
})

$("#attack-button-image").on("click" ,  function(){
    if (areYouFighting && !gameOver) {
        console.log("Pre-attack calculations:")
        console.log("Opponent HP: " + opponent.hP)
        console.log("Character HP: " + yourCharacter.hP)
        console.log("-------------------------------")
        console.log("Attack Calculations:")
        // your attack
        opponent.hP = opponent.hP - yourCharacter.aTKP;
        console.log("Opponent HP after attack:" + opponent.hP)
        // counter attack
        yourCharacter.hP = yourCharacter.hP - opponent.counterATKP;
        console.log("Your HP after counter attack: " + yourCharacter.hP)
        // increase attack power
        yourCharacter.aTKP = yourCharacter.aTKP + yourCharacter.baseATKP;
        console.log("Your attack power has increased to " + yourCharacter.aTKP)
        console.log("-------------------------------")
        // check if your hp is 0 or less
        // if your hp is less than or equal to 0, say you lose and stop the game
        if (yourCharacter.hP <= 0) {
            alert("You lose!");
            gameOver = true;
        }
        // check if opponent hp is 0 or less
        if (opponent.hP <= 0) {
            // remove opponent image from cpu-fighter-image element
            $("#cpu-fighter-image").empty()
            // clear the opponent variable
            opponent = {};
            // reset yourCharacter.aTKP to baseATKP
            yourCharacter.aTKP = yourCharacter.baseATKP;
            areYouFighting = false;
            // check to see if any opponents are left in the characterArray
            if (characterNames.length < 1) {
                alert("You win!");
                gameOver = true;
            }
        }
    }
})

// display HPs on the page
// update the HP values with each Attack button click
// display how much damage you did, and how much counter attack damage was done to you with each attack button click
// display a You Win and a You Lose screen/graphic/something or other
// format HTML to look good.  characters standing on platform, character select in colored squares to stand out more (maybe margin between each - lookup bootstrap margin classes)
