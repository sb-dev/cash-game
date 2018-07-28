var timeline, settings;
$(function() {

    $('body').on('click', '.card:not(.current)', function() {
        var target = this;
        flipCard(target);
        $(target).addClass('current');
        setTimeout(
            function(){
                flipCard(target);
                $(target).removeClass('current');
            }, 2000
        );
    });

    $.getJSON( "/settings.json", function( data ) {
        settings = data;
        settings.players.forEach(function(player) {
            var playerElement = createPlayer(player['id'], player['name'])
            $('#targetElement').append(playerElement)
            $( `#${player['id']}` ).position(player['position'])
        });

        shuffleCards(settings.cards);

        var index = 0;
        timeline = anime.timeline({autoplay: false});
        for(var i = 0; i < settings.cardsPerPlayer; i++) {

            $('.player').each(function() {
                var playerOffset = $(this).offset();
                var cardOffset = $(`#c${index}`).offset();
                var options = createOptions(`#c${index}.card`, -(cardOffset.left - playerOffset.left - 90 - (10 * i)), -(cardOffset.top - playerOffset.top + 65 + (10 * i)));
                if(index > 0) {
                    options.offset = '-=600';
                }

                if($(this).is('#current')) {
                    options.translateX = [
                        { value: -(cardOffset.left - playerOffset.left - 45 - (70 * i)), duration: 800 }
                    ];
                    options.translateY = [
                        { value: -(cardOffset.top - playerOffset.top + 30), duration: 800 }
                    ];
                    options.scale = 1.33;

                    $(`#c${index}.card`).addClass('current');
                }

                timeline.add(options);
                index += 1;
            })

        }

        timeline.play();

        timeline.finished.then(function() {
            setTimeout(function(){ flipCard('.current') }, 1000);
        });
    });

});

function createOptions(card, x, y) {
    return {
        targets: card,
        translateX: [
            { value: x, duration: 800 }
        ],
        translateY: [
            { value: y, duration: 800 }
        ],
        rotate: '2turn',
        duration: 600,
        easing: 'easeOutQuint'
    };
}

function createPlayer(id, name) {
    return `<div id="${id}" class="player">
                <span class="name">${name}</span>
            </div>`;
}

function shuffleCards(cards) {
    for (var i = cards.length; i > 0; i--) {
        var toSwap = Math.floor(Math.random() * i);
        var temp = cards[i];
        cards[i] = cards[toSwap];
        cards[toSwap] = temp;
    }

    for(var i = 0; i < cards.length; i++) {
        var card = createCard(i, cards[i]);
        $('#bottomCardDeck').append(card);
    }
}

function createCard(index, id) {
    return `<div id="c${index}" class="card" data-card="${id}">
                <div class="front"></div>
                <div class="back"></div>
            </div>`;
}

function flipCard(target) {
    var ranks = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
    var suits = ['C','D','H','S'];

    $(target).each(function() {
        var card = $(this).attr('data-card'),
            rank = 0,
            suit = 0;

        if(card != 0) {
            rank = card % 13;
            suit = Math.floor(card / 13);
        }
        $(this).find('.front').attr('style', `background: url('/public/img/${ranks[rank]}${suits[suit]}.png'); background-size: cover;`);

        var style = $(this).attr('style'),
            result = '';
        style.split(";").forEach(function (block) {
            if(block.includes(":")) {
                var property = block.split(':')[0].trim(),
                    value = block.split(':')[1];

                if (property === 'transform') {
                    result +=  property + ':' + value + ' rotateY(180deg);';
                } else {
                    result +=  ' ' + property + ':' + value + ';';
                }
            }
        });

        $(this).attr('style', result);
    });
}