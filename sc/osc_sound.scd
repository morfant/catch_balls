OSCdef

-10.abs

(
var count = 0, trig = 0;
OSCdef(\test, {
	|msg, time, addr, recvPort|
	msg.postln;

	// msg.size.postln;

	trig = msg[2];
	count = count + 1;
	if (count % 10 == 0,
		{

			Ndef(\digit, {
				// Pan2.ar(EnvGen.kr(Env.perc(0.1, 0.2), msg[1]) * Ringz.ar(VarSaw.ar(420), 200, mul: 0.05));
				// Pan2.ar(EnvGen.kr(Env.perc(0.1, 0.2), trig) * Ringz.ar(Impulse.ar(100 + (msg[1].abs*10)), 400+msg[1], mul: 0.05));
				Pan2.ar(EnvGen.kr(Env.perc(0.1, 0.2), trig) * Ringz.ar(Saw.ar(600 + (msg[1].abs*10)), 500+(msg[1].abs * 10), mul: 0.01));
			}).fadeTime_(0.1).play;

	});

	trig = 0;



}, '/isBallStopped'); // def style

)

(
Ndef(\digit, {
	Pan2.ar(EnvGen.kr(Env.new([0, 1, 0], [0.1, 0.3]), gate) * VarSaw.ar(freq));
})
);


(
Ndef(\baz1, {
	Pan2.ar(SinOsc.ar(240, 0, EnvGen.kr(Env.perc(0.0, 0.4, 0.4), g.(4, 16, [0,3,6,9,12,14]))));
}).play
)