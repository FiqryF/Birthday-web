String.prototype.pxWidth = function (font) {
	let canvas = String.prototype.pxWidth.canvas ||
		(String.prototype.pxWidth.canvas = document.createElement("canvas")),
		context = canvas.getContext("2d");
	font && (context.font = font);
	let metrics = context.measureText(this);
	return metrics.width;
}

function isNumber(str) {
	return !isNaN(parseInt(str));
}

function getPureStr(str) {
	let spices = str.split('^');
	let res = spices[0];
	for (let i = 1; i < spices.length; i++) {
		let tmp = spices[i];
		if (isNumber(tmp.charAt(0))) {
			let rm = parseInt(tmp).toString();
			tmp = tmp.substring(rm.length);
		}
		else {
			tmp = '^' + tmp;
		}
		res += tmp;
	}
	return res;
}

function loadingPage() {
	let heart_div = $('.heart');
	let heart_parent = heart_div.parent();
	let page_width = heart_parent.width();
	let page_height = heart_parent.height();
	let heart_width = heart_div.width();
	let heart_height = heart_div.height();
	heart_div.css('top', (page_height - heart_height) / 2);
	heart_div.css('left', (page_width - heart_width) / 2);
}

let birthdayAudioContext = null;
let birthdayMusicStarted = false;
let birthdayMusicTimer = null;
let birthdayMusicMuted = false;
let birthdayMasterGain = null;

function unlockBirthdayAudio() {
	if (birthdayAudioContext) return;

	const AudioContext = window.AudioContext || window.webkitAudioContext;
	if (!AudioContext) return;

	birthdayAudioContext = new AudioContext();
	birthdayMasterGain = birthdayAudioContext.createGain();
	birthdayMasterGain.gain.setValueAtTime(0.82, birthdayAudioContext.currentTime);
	birthdayMasterGain.connect(birthdayAudioContext.destination);

	if (birthdayAudioContext.state === "suspended") {
		birthdayAudioContext.resume();
	}
}

function playTone(frequency, startTime, duration, options = {}) {
	if (!birthdayAudioContext || !birthdayMasterGain || birthdayMusicMuted) return;

	const oscillator = birthdayAudioContext.createOscillator();
	const gain = birthdayAudioContext.createGain();
	const filter = birthdayAudioContext.createBiquadFilter();

	oscillator.type = options.type || "sine";
	oscillator.frequency.setValueAtTime(frequency, startTime);
	filter.type = "lowpass";
	filter.frequency.setValueAtTime(options.filter || 1600, startTime);

	gain.gain.setValueAtTime(0.0001, startTime);
	gain.gain.exponentialRampToValueAtTime(options.volume || 0.08, startTime + 0.08);
	gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

	oscillator.connect(filter);
	filter.connect(gain);
	gain.connect(birthdayMasterGain);
	oscillator.start(startTime);
	oscillator.stop(startTime + duration + 0.05);
}

window.toggleOriginalBirthdayTheme = function () {
	birthdayMusicMuted = !birthdayMusicMuted;
	if (birthdayMasterGain && birthdayAudioContext) {
		birthdayMasterGain.gain.setTargetAtTime(birthdayMusicMuted ? 0.0001 : 0.82, birthdayAudioContext.currentTime, 0.08);
	}
};

window.isOriginalBirthdayThemeMuted = function () {
	return birthdayMusicMuted;
};

function playOriginalBirthdayTheme() {
	if (!birthdayAudioContext || birthdayMusicStarted) return;

	birthdayMusicStarted = true;
	$('#music_btn').css("display", "block");

	const melody = [523.25, 659.25, 783.99, 739.99, 659.25, 587.33, 659.25, 880.00, 783.99, 659.25, 587.33, 523.25];
	const harmony = [329.63, 392.00, 440.00, 392.00, 349.23, 392.00];
	const bass = [130.81, 196.00, 174.61, 164.81, 146.83, 196.00];
	let step = 0;

	function loop() {
		const now = birthdayAudioContext.currentTime + 0.04;
		const melodyNote = melody[step % melody.length];
		const harmonyNote = harmony[Math.floor(step / 2) % harmony.length];
		const bassNote = bass[Math.floor(step / 3) % bass.length];

		playTone(melodyNote, now, 0.92, {
			type: "sine",
			volume: 0.082,
			filter: 3200
		});

		playTone(melodyNote * 2, now + 0.16, 0.46, {
			type: "sine",
			volume: 0.024,
			filter: 5200
		});

		playTone(harmonyNote, now + 0.02, 1.45, {
			type: "triangle",
			volume: 0.034,
			filter: 1400
		});
		playTone(harmonyNote * 1.5, now + 0.34, 0.82, {
			type: "sine",
			volume: 0.018,
			filter: 2400
		});

		if (step % 6 === 5) {
			playTone(melodyNote * 2.5, now + 0.22, 0.52, {
				type: "sine",
				volume: 0.018,
				filter: 6200
			});
		}

		if (step % 3 === 0) {
			playTone(bassNote, now, 2.6, {
				type: "sine",
				volume: 0.064,
				filter: 700
			});
			playTone(bassNote * 2, now + 0.08, 2.25, {
				type: "sine",
				volume: 0.024,
				filter: 900
			});
			playTone(bassNote * 4, now + 0.12, 1.55, {
				type: "triangle",
				volume: 0.018,
				filter: 1500
			});
		}

		step += 1;
	}

	loop();
	birthdayMusicTimer = setInterval(loop, 1040);
}

function playBirthdayMusic() {
	let player = document.getElementById('music');
	if (player && player.getAttribute('src') && player.paused) {
		player.volume = 0.58;
		player.play().then(() => {
			$('#music_btn').css("display", "block");
		}).catch(() => {
			playOriginalBirthdayTheme();
		});
		return;
	}

	playOriginalBirthdayTheme();
}

$("#open").click(function (event) {
	event.preventDefault();
	unlockBirthdayAudio();
	document.getElementById('content').classList.add('is-open');

	if (!envelope_opened) {
		$('#wax-half').css('display', "block");
		new Typed('.letter', {
			strings: [
				"^1000",
				content.salutation + "<br><br>" +
				content.body + "<br><br><p style='float:right; display:block; width:" +
				content.sign + "px;'>^1000" + content.signature + "</p>"
			],
			typeSpeed: 100,
			backSpeed: 50,
			preStringTyped: function (arrayPos) {
				if (arrayPos === 1) playBirthdayMusic();
			}
		});
		$('#open').find("span").eq(0).css('background-position', "0 -150px");
		envelope_opened = true;
	}
});
