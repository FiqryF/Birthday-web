let envelope_opened = false;
let content = {
    salutation: "",
    signature: "",
    body: "",
    sign: 0
};
const envelopeOffsetY = 72;

function getEnvelopeScale() {
    if (window.innerWidth <= 420) return 0.48;
    if (window.innerWidth <= 720) return 0.58;
    return 1;
}

function getEnvelopeOffsetY() {
    if (window.innerWidth <= 720) return 0;
    return envelopeOffsetY;
}

function positionEnvelope() {
    let contact = $('#contact');
    let visualHeight = contact.height() * getEnvelopeScale();
    let mtop = Math.max(24, (window.innerHeight - visualHeight) * 0.5 + getEnvelopeOffsetY());
    contact.css('margin-top', mtop + 'px');
}

function playPause() {
    let player = document.getElementById('music');
    let play_btn = $('#music_btn');
    if (window.toggleOriginalBirthdayTheme && (!player || !player.getAttribute('src'))) {
        window.toggleOriginalBirthdayTheme();
        play_btn.attr('class', window.isOriginalBirthdayThemeMuted && window.isOriginalBirthdayThemeMuted() ? 'mute' : 'play');
        return;
    }

    if (player.paused) {
        player.play();
        play_btn.attr('class', 'play');
    }
    else {
        player.pause();
        play_btn.attr('class', 'mute');
    }
}

window.onload = function () {
    loadingPage();
    let result = window.eluvContent || {
        title: "eLuvLetter",
        recipient: "",
        sender: "",
        salutation: "",
        signature: "",
        body: "",
        bgm: ""
    };
    content.salutation = result.salutation;
    content.signature = result.signature;
    content.body = result.body;
    content.sign = getPureStr(content.signature).pxWidth('18px Georgia, serif');
    document.title = result.title;
    $('#recipient').append(result.recipient);
    $('#flipback').text(result.sender);
    $('#music').attr('src', result.bgm);
    $('#envelope').fadeIn('slow');
    $('.heart').fadeOut('fast');
    $('#contact').addClass('is-ready');
    positionEnvelope();
    $('body').css('opacity', '1');
    $('#jsi-cherry-container').css('z-index', '-99');
}

window.onresize = function () {
    let cherry_container = $('#jsi-cherry-container');
    let canvas = cherry_container.find('canvas').eq(0);
    canvas.height(cherry_container.height());
    canvas.width(cherry_container.width());
    // Do scaling for sakura background when the window is resized
    loadingPage();
    positionEnvelope();
}
