var count = 0;
var people = [];
var singleDrinkBAC = 0.027;
var millisecondsToHour = 2.77778e-7;
var hourlyDecreaseBAC = 0.0075;

$('.join').click(function () {
  var name = prompt('Enter your name:');
  if (name === null || name === '') {
    return;
  }

  count++;
  var id = count;
  var person = {
    name: name,
    weight: 140,
    drinks: 0,
    drinkTimes: [],
    atParty: true
  };
  people.push(person);

  var html = '<div id="person-' + id + '" class="person"><div class="person-name">' + name + '</div><button id="person-drink-' + id + '" class="person-drink">DRINK</button><button id="person-leave-' + id + '" class="person-leave">✖</button></div>';
  $('.input-container').append(html);
  initButtons(person, id);
});

function initButtons(person, id) {
  $('#person-drink-' + id).click(function () {
    var date = new Date();
    person.drinks++;
    person.drinkTimes.push(date.getTime());
  });

  $('#person-leave-' + id).click(function () {
    person.atParty = false;
    $('#person-' + id).remove();
  });
}

function calculateAverageBAC() {
  var totalBAC = 0.0;
  var activePartygoers = 0;
  people.forEach(function (person) {
    totalBAC = person.atParty ? totalBAC + calculateBAC(person) : totalBAC;
    activePartygoers = person.atParty ? activePartygoers + 1 : activePartygoers;
  });
  var averageBAC = totalBAC / activePartygoers;
  return averageBAC || 0;
};

function calculateBAC(person) {
  var BAC = 0.0;
  var date = new Date();
  var currentTime = date.getTime();
  var lastTime = person.drinkTimes[0] || currentTime;
  person.drinkTimes.forEach(function (time) {
    BAC = decrementBAC(BAC, lastTime, time);
    BAC = incrementBAC(BAC);
  });
  BAC = decrementBAC(BAC, lastTime, currentTime);
  return BAC;
};

function decrementBAC(BAC, t1, t2) {
  var timeSinceLast = (t2 - t1) * millisecondsToHour;
  var newBAC = BAC - timeSinceLast * hourlyDecreaseBAC;
  return newBAC < 0 ? 0 : newBAC;
};

function incrementBAC(BAC) {
  return BAC + singleDrinkBAC;
}

setInterval(function () {
  var averageBAC = calculateAverageBAC();
  $('.bac-value').text(averageBAC.toFixed(10));
}, 1);
