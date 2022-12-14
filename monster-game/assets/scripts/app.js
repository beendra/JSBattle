const ATTACK_VALUE = 10; //all caps separated by an underscore indicates a global variable
const MONSTER_ATTACK_VALUE = 14; 
const STRONG_ATTACK_VALUE = 17;
const HEAL_VALUE = 20;

const enteredValue = prompt('Maximum life', '100');

let chosenMaxLife = parseInt(enteredValue);

if(isNaN(chosenMaxLife) || chosenMaxLife <= 0){
    chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function reset(){
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

function endRound(){
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    if(currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert('lost a life!');
    }
    if(currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
     alert('you won!');
    } else if(currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
     alert('you lose!');
    } else if(currentPlayerHealth <= 0 && currentMonsterHealth <=0){
     alert('it is a tie!')
    }

    if(currentMonsterHealth <= 0 || currentPlayerHealth <= 0 ) {
        reset();
    }
}

function attackMonster(mode){
    if(mode === 'ATTACK'){
        maxDamange = ATTACK_VALUE;
    } else if(mode === 'STRONG_ATTACK'){
        maxDamange = STRONG_ATTACK_VALUE;
    }
    const damage = dealMonsterDamage(maxDamange);
    currentMonsterHealth -= damage;
    endRound();
}

function attackHandler() {
    attackMonster('ATTACK');
}

function strongAttackHandler() {
    attackMonster('STRONG_ATTACK');
}

function healPlayerHandler() {
    let healValue;
    if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE){
        alert('you cannot heal more than your max health');
    } else {
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(HEAL_VALUE); 
    currentPlayerHealth += HEAL_VALUE;
    endRound();
}

attackBtn.addEventListener('click', attackHandler);

strongAttackBtn.addEventListener('click', strongAttackHandler);

healBtn.addEventListener('click', healPlayerHandler);