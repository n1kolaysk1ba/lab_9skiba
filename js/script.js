var suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
var values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
var deck = new Array();
var players = new Array();
var currentPlayer = 0;
var inited = false;
function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

function createDeck()
{
    deck = new Array();
    for (var i = 0 ; i < values.length; i++)
    {
        for(var x = 0; x < suits.length; x++)
        {
            var weight = parseInt(values[i]);
            if (values[i] == "J" || values[i] == "Q" || values[i] == "K")
                weight = 10;
            if (values[i] == "A")
                weight = 11;
            var card = { Value: values[i], Suit: suits[x], Weight: weight };
            deck.push(card);
        }
    }
}

function resetPlayers(num)
{
    for(var i = 0; i < num; i++)
    {
        var hand = new Array();
        players[i].Points = 0
        players[i].Hand = hand;
    }
}
function createPlayers(num)
{
    players = new Array();
    for(var i = 1; i <= num; i++)
    {
        var hand = new Array();
        var player = { Name: 'Player ' + i, ID: i, Points: 0, Hand: hand };
        players.push(player);
    }
}

function createPlayersUI()
{
    document.getElementById('players').innerHTML = '';
    for(var i = 0; i < players.length; i++)
    {
        var div_player = document.createElement('div');
        var div_playerid = document.createElement('div');
        var div_hand = document.createElement('div');
        var div_points = document.createElement('div');

        div_points.className = 'points';
        div_points.id = 'points_' + i;
        div_player.id = 'player_' + i;
        div_player.className = 'player';
        div_hand.id = 'hand_' + i;
        if (!inited){
            let value = prompt("Введите имя " + i + " игрока");
            while (value == ""){
                value = prompt("Попробуй ещё раз!");
            }
            players[i].Name = value;
            div_playerid.innerHTML = value;
        }else{
            div_playerid.innerHTML = players[i].Name;
        }
        
        div_player.appendChild(div_playerid);
        div_player.appendChild(div_hand);
        div_player.appendChild(div_points);
        document.getElementById('players').appendChild(div_player);
    }
}

function shuffle()
{
    for (var i = 0; i < 1000; i++)
    {
        var location1 = Math.floor((Math.random() * deck.length));
        var location2 = Math.floor((Math.random() * deck.length));
        var tmp = deck[location1];

        deck[location1] = deck[location2];
        deck[location2] = tmp;
    }
}

function startblackjack()
{
    
    document.getElementById('btnStart').value = 'Новая игра';
    document.getElementById("status").style.display="none";
    currentPlayer = 0;
    createDeck();
    shuffle();
    if (inited){
        resetPlayers(2);
    }else{
        createPlayers(2);
    }
    
    createPlayersUI();

    dealHands();
    document.getElementById('player_' + currentPlayer).classList.add('active');
    inited = true;
}

function dealHands()
{
    for(var i = 0; i < 2; i++)
    {
        for (var x = 0; x < players.length; x++)
        {
            var card = deck.pop();
            players[x].Hand.push(card);
            renderCard(card, x);
            updatePoints();
        }
    }
    updateDeck();
}

function renderCard(card, player)
{
    var hand = document.getElementById('hand_' + player);
    hand.appendChild(getCardUI(card));
}

function getCardUI(card)
{
    var el = document.createElement('div');
    var icon = '';
    if (card.Suit == 'Hearts')
    icon='&hearts;';
    else if (card.Suit == 'Spades')
    icon = '&spades;';
    else if (card.Suit == 'Diamonds')
    icon = '&diams;';
    else
    icon = '&clubs;';
    
    el.className = 'card';
    el.innerHTML = card.Value + '<br/>' + icon;
    return el;
}

function getPoints(player)
{
    var points = 0;
    for(var i = 0; i < players[player].Hand.length; i++)
    {
        points += players[player].Hand[i].Weight;
    }
    players[player].Points = points;
    return points;
}

function updatePoints()
{
    for (var i = 0 ; i < players.length; i++)
    {
        getPoints(i);
        document.getElementById('points_' + i).innerHTML = players[i].Points;
    }
}

function hitMe()
{
    var card = deck.pop();
    players[currentPlayer].Hand.push(card);
    renderCard(card, currentPlayer);
    updatePoints();
    updateDeck();
    is_lost = check();
    if (is_lost) end();
}

function should_hit(dealer_total, player_total){
    console.log(dealer_total, player_total);
    if (dealer_total <= 10) return true;
    else if (player_total >= 21) return false;
    else if (dealer_total > player_total && dealer_total < 21) return true; 
    else return false;
}

function stay()
{
    document.getElementById('player_' + currentPlayer).classList.remove('active');
    currentPlayer += 1;
    document.getElementById('player_' + currentPlayer).classList.add('active');
    is_hit = should_hit(players[currentPlayer-1].Points, players[currentPlayer].Points)
    while (is_hit){
        hitMe();
        sleep(300)
        is_hit = should_hit(players[currentPlayer-1].Points, players[currentPlayer].Points)
    }
    end();
}

function end()
{
    if (players[0].Points > 21 && players[1].Points > 21){
        //оба проиграли
        document.getElementById('status').innerHTML = "Ничья!"
        document.getElementById("status").style.display = "inline-block";
    }
    else if (players[0].Points > players[1].Points && players[0].Points <= 21)
    {
        //первый выиграл
        document.getElementById('status').innerHTML = "Игрок " + 1 + " победил!";
        document.getElementById("status").style.display = "inline-block";
    }
    else if (players[1].Points > players[0].Points && players[1].Points <= 21) {
        // второй выиграл
        document.getElementById('status').innerHTML = "Игрок " + 2 + " победил!";
        document.getElementById("status").style.display = "inline-block";
    } else if (players[1].Points > 21){
        document.getElementById('status').innerHTML = "Игрок " + 1 + " победил!";
        document.getElementById("status").style.display = "inline-block";
    } else if (players[0].Points > 21){
        document.getElementById('status').innerHTML = "Игрок " + 2 + " победил!";
        document.getElementById("status").style.display = "inline-block";
    }
    else {
        // ничья
        document.getElementById('status').innerHTML = "Ничья!"
        document.getElementById("status").style.display = "inline-block";
    } 
   
}

function check()
{
    if (players[currentPlayer].Points > 21)
    {
        document.getElementById('status').innerHTML = 'Player: ' + players[currentPlayer].ID + ' LOST';
        document.getElementById('status').style.display = "inline-block";
        
        return true;
    }
    return false;
}

function updateDeck()
{
    document.getElementById('deckcount').innerHTML = deck.length;
}

window.addEventListener('load', function(){
    createDeck();
    shuffle();
    createPlayers(1);
});

