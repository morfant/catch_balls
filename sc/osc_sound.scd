
// SynthDefs

(
SynthDef(\sine, {|freq = 440, dur = 1.0, trig = 1|
	// var env = Line.kr(0.2, 0.0, dur, doneAction:2);
	var env = EnvGen.kr(Env.perc(0.01, 0.03), trig, doneAction: 2);
	var sig = SinOsc.ar(freq, 0, env);
	Out.ar(0, Pan2.ar(sig));
}).add;


SynthDef(\condan, {|freq = 240, dur = 5, gate = 1, amp = 0.5, freq2 = 33, amp2 = 0.5|
	// var env = EnvGen.kr(Env.perc(0.01, dur), gate);
	var env = EnvGen.kr(Env.adsr(), gate, doneAction: 2);
	var sig2 = LFSaw.kr(freq2, mul: amp2);
	// var sig2 = LFPar.kr(freq2, mul: amp2);
	var sig = SinOsc.ar(freq, mul: env*sig2);

	Out.ar(0, Pan2.ar(sig)*amp);
}).add;

)


a = Synth(\condan, [freq: 400, amp: 0.9, freq2: 80, amp2: 0.5]);
a.release(0.1);

a.set(\amp, 0);
~e0.play;

// Functions
(

~f0 = {|lenMul = 1, keyAdd = 0|
// var lenMul = 0.7;

Pbind(
		\instrument, \sine,
		// \freq, Pseq(60 - 24 +[\, 8, 14, 2, 4, 14, 12, 4, 5, \, 7, \, 7, 7, \],inf).midicps,
		\freq, Pseq(60 - 10 + keyAdd + [\, 8, 14, 2, 4, 14, 12, 4, 5, \, 7, \, 7, 7, \],1).midicps,
		// \dur, Pseq([1/8, 1/8, 1/4, 1/4, 1/4, 1/4, 1/4, 1/2, 1/4, 1/8, 1/8, 1/8, 1/8, 1/8, 1/8] * 1.2, inf),
		\dur, Pseq([1/8, 1/8, 1/4, 1/4, 1/4, 1/4, 1/4, 1/2, 1/4, 1/16, 1/8, 3/16, 1/8, 1/8, 1/8] * 0.6 * lenMul, 1),
		\delta, Pseq([1/8, 1/8, 1/4, 1/4, 1/4, 1/4, 1/4, 1/2, 1/4, 1/16, 1/8, 3/16, 1/8, 1/8, 1/8] * lenMul, 1),
	);

};

~f1 = {|lenMul = 1|
// var lenMul = 0.7;

Pbind(
		\instrument, \sine,
		// \freq, Pseq(60 - 24 +[\, 8, 14, 2, 4, 14, 12, 4, 5, \, 7, \, 7, 7, \],inf).midicps,
		\freq, Pseq(60 - 10 +[\, 8, 14, 2, 4, 14, 12, 4, 5, \, 7, \, 7, 7, \],1).midicps,
		// \dur, Pseq([1/8, 1/8, 1/4, 1/4, 1/4, 1/4, 1/4, 1/2, 1/4, 1/8, 1/8, 1/8, 1/8, 1/8, 1/8] * 1.2, inf),
		\dur, Pseq([1/8, 1/8, 1/4, 1/4, 1/4, 1/4, 1/4, 1/2, 1/4, 1/16, 1/8, 3/16, 1/8, 1/8, 1/8] * 0.6 * lenMul, 1),
		\delta, Pseq([1/8, 1/8, 1/4, 1/4, 1/4, 1/4, 1/4, 1/2, 1/4, 1/16, 1/8, 3/16, 1/8, 1/8, 1/8] * lenMul, 1),
	);

};

~f2 = {|lenMul = 1|
// var lenMul = 0.7;

Pbind(
		\instrument, \sine,
		// \freq, Pseq(60 - 24 +[\, 8, 14, 2, 4, 14, 12, 4, 5, \, 7, \, 7, 7, \],inf).midicps,
		\freq, Pseq(60 - 10 +[\, 8, 14, 2, 4, 14, 12, 4, 5, \, 7, \, 7, 7, \],1).midicps,
		// \dur, Pseq([1/8, 1/8, 1/4, 1/4, 1/4, 1/4, 1/4, 1/2, 1/4, 1/8, 1/8, 1/8, 1/8, 1/8, 1/8] * 1.2, inf),
		\dur, Pseq([1/8, 1/8, 1/4, 1/4, 1/4, 1/4, 1/4, 1/2, 1/4, 1/16, 1/8, 3/16, 1/8, 1/8, 1/8] * 0.6 * lenMul, 1),
		\delta, Pseq([1/8, 1/8, 1/4, 1/4, 1/4, 1/4, 1/4, 1/2, 1/4, 1/16, 1/8, 3/16, 1/8, 1/8, 1/8] * lenMul, 1),
	);

};

~f3 = {|lenMul = 1|
// var lenMul = 0.7;

Pbind(
		\instrument, \sine,
		// \freq, Pseq(60 - 24 +[\, 8, 14, 2, 4, 14, 12, 4, 5, \, 7, \, 7, 7, \],inf).midicps,
		\freq, Pseq(60 - 10 +[\, 8, 14, 2, 4, 14, 12, 4, 5, \, 7, \, 7, 7, \],1).midicps,
		// \dur, Pseq([1/8, 1/8, 1/4, 1/4, 1/4, 1/4, 1/4, 1/2, 1/4, 1/8, 1/8, 1/8, 1/8, 1/8, 1/8] * 1.2, inf),
		\dur, Pseq([1/8, 1/8, 1/4, 1/4, 1/4, 1/4, 1/4, 1/2, 1/4, 1/16, 1/8, 3/16, 1/8, 1/8, 1/8] * 0.6 * lenMul, 1),
		\delta, Pseq([1/8, 1/8, 1/4, 1/4, 1/4, 1/4, 1/4, 1/2, 1/4, 1/16, 1/8, 3/16, 1/8, 1/8, 1/8] * lenMul, 1),
	);

};


)


// OSCdef
(
var count = 0, trig = 0;
var isOpen_0 = false;
var isOpen_1 = false;
var isOpen_2 = false;
var isOpen_3 = false;

~p0 = ~f0.(1, 0);
~p1 = ~f1.(1);
~p2 = ~f2.(1);
~p3 = ~f3.(1);

~e1.free;
~e0 = nil;~e1 = nil;~e2 = nil;~e3 = nil;
// ~e0 = ~p0.asEventStreamPlayer;
// ~e0.play;~e0.pause;

~e1 = Synth(\condan, [\amp, 0]);


OSCdef(\ball, {
	|msg, time, addr, recvPort|
		var ballId = msg[1];
	    var acc_x = msg[3];
		var acc_y = msg[4];
		var acc_z = msg[5];
	    var ori_x = msg[6];
		var ori_y = msg[7];
		var ori_z = msg[8];

	var acc_sum = 0;
	// msg.postln;
	// addr.postln;
	// msg.size.postln;

	// trig = msg[2];
	// count = count + 1;


	// msg[4].postln;
	// msg.postln;



	// acc_sum = abs(acc_x) + abs(acc_y) + abs(acc_z);

	switch (ballId)
	{1} {

		if ( (msg[2] == 1) && (isOpen_0 == false), {
			// "0 is open".postln;
			~p0 = ~f0.(1, 0);
			~e0 = ~p0.asEventStreamPlayer;
			~e0.play;
			isOpen_0 = true;
		});

		if (msg[2] == 0, {
			~e0.stop;~e0.reset;
			~e0 = nil;
			isOpen_0 = false;
		});

	}
	{0} {
		if ( (msg[2] == 1) && (isOpen_1 == false), {
			acc_sum = abs(acc_x) + abs(acc_y) + abs(acc_z);
			~e1.set(\freq, acc_sum * 50, \amp, 0.7, \freq2, ori_x);

			isOpen_0 = true;
		});

		if (msg[2] == 0, {
			~e1.set(\amp, 0);
			isOpen_0 = false;
		});

	}
	{2} {

	}
	{3} {

	}



	// if (count % 10 == 0,
	// 	{
	//
	//
	// 		// x.next(()).play;
	// 		~pe0.play;
	//
	//
	//
	//
	// 		Ndef(\digit, {
	// 			// Pan2.ar(EnvGen.kr(Env.perc(0.1, 0.2), msg[1]) * Ringz.ar(VarSaw.ar(420), 200, mul: 0.05));
	// 			// Pan2.ar(EnvGen.kr(Env.perc(0.1, 0.2), trig) * Ringz.ar(Impulse.ar(100 + (msg[1].abs*10)), 400+msg[1], mul: 0.05));
	// 			Pan2.ar(EnvGen.kr(Env.perc(0.1, 0.2), trig) * Ringz.ar(Saw.ar(600 + (msg[1].abs*10)), 500+(msg[1].abs * 10), mul: 0.01));
	// 		}).fadeTime_(0.1).play;
	//
	// });
	//
	// trig = 0;



}, '/isBallStopped'); // def style

CmdPeriod.doOnce{

}
)

