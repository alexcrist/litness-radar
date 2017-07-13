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

  var html = '<div id="person-' + id + '" class="person">\
                <div class="person-name">' + name + '</div>\
                <button id="person-drink-' + id + '" class="person-drink">DRINK</button>\
                <button id="person-leave-' + id + '" class="person-leave">✖</button>\
              </div>';

  $('.input-container').append(html);
  initButtons(person, id);
});

function initButtons(person, id) {
  $('#person-drink-' + id).click(function (e) {
    var date = new Date();
    person.drinks++;
    person.drinkTimes.push(date.getTime());
    explode(e.pageX, e.pageY, person.drinks);
  });

  $('#person-leave-' + id).click(function (e) {
    person.atParty = false;
    $('#person-' + id).remove();
    explode(e.pageX, e.pageY, person.drinks);
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

function explode(startX, startY, particleCount) {
  var arr = [];
  var angle = 0;
  var particles = [];

  for (var i = 0; i < particleCount; i++) {
    var rad = (Math.PI / 180) * angle;

    var x = Math.cos(rad) * (100 + Math.random() * 40);
    var y = Math.sin(rad) * (100 + Math.random() * 40);

    arr.push([ startX + x, startY + y ]);

    var z = $('<div class="debris"></div>');

    z.css({
      top: startY - 14,
      left: startX - 14
    }).appendTo($('body'));

    particles.push(z);
    angle += 360 / particleCount;
  }

  $.each(particles, function (i, v) {
    $(v).show();
    $(v).animate({
      top: arr[i][1],
      left: arr[i][0],
      width: 4,
      height: 4,
      opacity: 0
    }, 2000, function () {
      $(v).remove()
    });
  })
}

setInterval(function () {
  var averageBAC = calculateAverageBAC();
  $('.bac-value').text(averageBAC.toFixed(10));
}, 1);