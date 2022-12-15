const ATTACK_VALUE = 10; //all caps separated by an underscore indicates a global variable
const MONSTER_ATTACK_VALUE = 14; 
const STRONG_ATTACK_VALUE = 17;
const HEAL_VALUE = 20;

const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';


const enteredValue = prompt('Set Maximum life', '100');

let chosenMaxLife = parseInt(enteredValue);
let battleLog = [];
let lastLoggedEvent;

if(isNaN(chosenMaxLife) || chosenMaxLife <= 0){
    chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(event, value, monsterHealth, playerHealth){
    let logEntry = {
        event: event,
        value: value,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
    };
    switch (event){
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry.target = 'MONSTER';
            break;
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry = {
                event: event,
                value: value,
                target: 'MONSTER',
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealth
            };
            break;
        case LOG_EVENT_MONSTER_ATTACK:
            logEntry = {
                event: event,
                value: value,
                target: 'PLAYER',
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealth
            };
            break;
        case LOG_EVENT_PLAYER_HEAL:
            logEntry = {
                event: event,
                value: value,
                target: 'PLAYER',
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealth
            };
            break;
        case LOG_EVENT_GAME_OVER:
            logEntry = {
                event: event,
                value: value,
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealth
            };
            break;
        default:
            logEntry = {};
    }
    // if(event === LOG_EVENT_PLAYER_ATTACK) {
    //     logEntry = {
    //         event: event,
    //         value: value,
    //         target: 'MONSTER',
    //         finalMonsterHealth: monsterHealth,
    //         finalPlayerHealth: playerHealth
    //     };
    // } else if(event === LOG_EVENT_PLAYER_STRONG_ATTACK) {
    //     logEntry = {
    //         event: event,
    //         value: value,
    //         target: 'MONSTER',
    //         finalMonsterHealth: monsterHealth,
    //         finalPlayerHealth: playerHealth
    //     };
    // } else if(event === LOG_EVENT_MONSTER_ATTACK) {
    //     logEntry = {
    //         event: event,
    //         value: value,
    //         target: 'PLAYER',
    //         finalMonsterHealth: monsterHealth,
    //         finalPlayerHealth: playerHealth
    //     };
    // } else if (event === LOG_EVENT_PLAYER_HEAL) {
    //     logEntry-= {
    //         event: event,
    //         value: value,
    //         target: 'PLAYER',
    //         finalMonsterHealth: monsterHealth,
    //         finalPlayerHealth: playerHealth
    //     };
    // } else if(event === LOG_EVENT_GAME_OVER){
    //     logEntry = {
    //         event: event,
    //         value: value,
    //         finalMonsterHealth: monsterHealth,
    //         finalPlayerHealth: playerHealth
    //     };
    // }
    battleLog.push(logEntry);
}

function reset(){
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

function endRound(){
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    writeToLog(LOG_EVENT_MONSTER_ATTACK, playerDamage, currentMonsterHealth, currentPlayerHealth);

    if(currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert('lost a life!');
    }
    if(currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
     alert('you won!');
     writeToLog(LOG_EVENT_GAME_OVER, 'player won', currentMonsterHealth, currentPlayerHealth);
    } else if(currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
     alert('you lose!');
     writeToLog(LOG_EVENT_GAME_OVER, 'monster won', currentMonsterHealth, currentPlayerHealth);
    } else if(currentPlayerHealth <= 0 && currentMonsterHealth <=0){
     alert('it is a tie!')
     writeToLog(LOG_EVENT_GAME_OVER, 'no winner', currentMonsterHealth, currentPlayerHealth);
    }

    if(currentMonsterHealth <= 0 || currentPlayerHealth <= 0 ) {
        reset();
    }
}

function attackMonster(mode){            
    const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;                                                                                       
    const logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;             
    // if(mode === MODE_ATTACK){
    //     maxDamage = ATTACK_VALUE;
    //     logEvent = LOG_EVENT_PLAYER_ATTACK
    // } else if(mode === MODE_STRONG_ATTACK){
    //     maxDamage = STRONG_ATTACK_VALUE;
    //     logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    // } // THIS IS THE EQUIVALENT IF STATEMENT AS THE ABOVE TERNARY STATEMENTS
    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);

    endRound();
}

function attackHandler() {
    attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
    attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler() {
    let healValue;
    if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE){
        alert('you cannot heal more than your max health');
        healValue = chosenMaxLife - currentPlayerHealth;
    } else {
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(healValue); 
    currentPlayerHealth += healValue;
    writeToLog(LOG_EVENT_PLAYER_HEAL, healValue, currentMonsterHealth, currentPlayerHealth);
    endRound();
}

function printLogHandler() {
    for(let i = 0 ; i < 3; i++) {
        console.log('-------------');
    }
    // let j = 0;
    // do{
    //     console.log(j);
    //     j++
    // } while ( j <3);

    // while(j < 3) {
    //     console.log(j)
    //     j++;
    // }
    // for(let i = 0 ; i < battleLog.length; i++) {
    //     console.log(battleLog[i]);
    // }
    let i=0;
    for(const logEntry of battleLog){
        if(!lastLoggedEvent && lastLoggedEvent !== 0 || lastLoggedEvent < i){
             console.log(`#${i}`);
        for(const key in logEntry){
            console.log(`${key} => ${logEntry[key]}`);
        }
        lastLoggedEvent = i;  
        break;
        }       
        i++;
        }
}

attackBtn.addEventListener('click', attackHandler);

strongAttackBtn.addEventListener('click', strongAttackHandler);

healBtn.addEventListener('click', healPlayerHandler);

logBtn.addEventListener('click', printLogHandler);