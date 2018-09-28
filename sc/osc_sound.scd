
//================================ SynthDefs ================================

(
SynthDef(\sine, {|freq = 440, dur = 1.0, trig = 1|
	// var env = Line.kr(0.2, 0.0, dur, doneAction:2);
	var env = EnvGen.kr(Env.perc(0.01, 0.03), trig, doneAction: 2);
	var sig = SinOsc.ar(freq, 0, env);
	Out.ar(0, Pan2.ar(sig));
}).add;


SynthDef(\sine2, {|freq = 240, dur = 0.2, gate = 1, atk = 0.1, amp = 3|
	var env = EnvGen.kr(Env.perc(atk, dur), gate, doneAction: 2);
	// var env = Line.kr(0.2, 0.0, dur, doneAction:2);
	var sig = SinOsc.ar(freq, 0, env);
	var sig2 = SinOsc.kr(freq/4, mul: env);
	var no = WhiteNoise.ar(env) * 0.005 * LFTri.kr(80, mul: 0.4);
	Out.ar(0, Pan2.ar(sig*sig2+no)*amp);
}).add;

SynthDef(\condan, {|freq = 240, dur = 5, gate = 1, amp = 0.5, freq2 = 33, amp2 = 0.5|
	// var env = EnvGen.kr(Env.perc(0.01, dur), gate);
	var env = EnvGen.kr(Env.adsr(), gate, doneAction: 2);
	var sig2 = LFSaw.kr(freq2, mul: amp2);
	// var sig2 = LFPar.kr(freq2, mul: amp2);
	var sig = SinOsc.ar(freq, mul: env*sig2);

	Out.ar(0, Pan2.ar(sig)*amp);
}).add;


Ndef(\pulsepulse, {|freq = 200, freq_reson = 100, freq_trig = 4, amp = 0.02 |
	var sig = Impulse.ar(freq);
	var trig = Impulse.kr(freq_trig);
	var env = EnvGen.kr(Env.perc(0.0, 0.8), trig);
	Pan2.ar(Mix.fill(6, {Ringz.ar(sig, TRand.kr(freq_reson, freq_reson*1.5, trig), 0.01)}), 0, env * amp);
}).fadeTime_(0.01);



SynthDef(\woong,
    {
        arg cutoff = 202, rq = 1.0, sn = 8, amp = 0.5, gate = 1, freq = 55, freq2 = 75, freq3 = 100;
        var sig, fil, lfo, env;

		env = EnvGen.kr(Env.perc(0.01, 0.4), gate, doneAction: 2);
        lfo = LFClipNoise.kr(sn, mul: 0.5, add: 0.5);
		sig = Mix.new([Saw.ar(freq, mul: amp/2), Saw.ar(freq3, mul: amp/2), Saw.ar(freq2, mul: amp/2)]);
        fil = RLPF.ar(sig, cutoff, rq);
		Out.ar(0, Pan2.ar(fil*amp*env, 0));
    }
).add;


SynthDef(\liedR,
    {
        |freq = 2598, amp = 0.3, gate = 1, efxfreq = 700, panfreq = 3, dronerq = 0.4|
        var sig, env, efx, pansig, out, delay, drone;
        sig = Saw.ar(freq, mul: amp);
        env = EnvGen.kr(Env.adsr(0.1, 0.2, 0.5, 2, 1), gate, doneAction: 2);
        efx = RLPF.ar(sig*env, efxfreq, 0.2, 1);
        drone = RLPF.ar(BrownNoise.ar(0.01), 120, dronerq, 1);
        delay = CombC.ar(efx+drone, 0.2, 0.1, 0.03, 1, efx);
        //env = EnvGen.kr(Env.asr(0.1, 0.2, 0.5), gate, doneAction: 2);
        pansig = LFTri.kr(panfreq, mul: 0.5, add: 0);
        out = Out.ar(0, Pan2.ar(delay, pansig, amp));
    }).add;



SynthDef("help-TCoin_ori", { arg out=0, prob=0.5, freq = 20, freq_am = 0.5, amp = 0.2;
	var trig;
	trig = Impulse.ar(freq, 0, SinOsc.kr(freq_am,0,1,1));
	// trig = Impulse.ar(SinOsc.kr(0.01, 0, freq+100, freq+300), 0, SinOsc.kr(freq_am,0,1,1));
	Out.ar(out,
		// Mix.fill(3, {Ringz.ar(CoinGate.ar(prob, trig*0.5), #[1,1.5, 2, 4]*Rand(50, 90), 0.01)})*amp
		SinOsc.ar(#[1, 1.5, 3]*freq)*amp

	)
}).add;

SynthDef("sophi", { arg out=0, freq = 120, amp = 0.2, gate = 1;
	var sig, env, verb;
	env = EnvGen.kr(Env.perc(0.05, 1.45), gate, doneAction: 2);
	sig = Mix.new( [
			SinOsc.ar(1 * freq, mul: env),
			SinOsc.ar(1.5 * freq, mul: env * 0.5),
			SinOsc.ar(2 * freq, mul: env),
     	    SinOsc.ar(1.75 * freq, mul: env * 0.7),
		]) * amp;

	verb = GVerb.ar(sig, 30, spread: 4);
	sig = verb*0.5 + sig;
	Out.ar(out, sig);
}).add;

)


~e.stop;~p = ~f1.(1.2, -1.5, \sophi, 0.1);~e = ~p.asEventStreamPlayer;~e.play;


a = Synth("help-T", [\freq, 200]);

a = Synth(\liedR, [\freq, 1000]);
a.set(\freq, 500);

a = Synth(\woong);

Ndef(\pulsepulse).play;
Ndef(\pulsepulse).set(\freq, 400, \freq_trig, 3, \freq_reson, 2900, \amp, 0.02);
Ndef(\pulsepulse).set(\freq, 4, \freq_trig, 10, \freq_reson, 200, \amp, 0.02);


TRand
a = Synth(\sine2);

a = Synth(\dirac, [freq: 400]);
a.set(\freq, 600, \amp, 0.05);

a = Synth(\condan, [freq: 400, amp: 0.9, freq2: 80, amp2: 0.5]);

a.release(0.1);

a.set(\amp, 0);
~e0.play;


a = Synth(\dirac, [freq: 800]);


//================================ Functions ================================
(

~f0 = {|lenMul = 1, keyAdd = 0|
// var lenMul = 0.7;

Pbind(
		// \instrument, "help-TCoin",
		// \instrument, \dirac,
		\instrument, \gobeat,
		// \freq, Pseq(60 - 24 +[\, 8, 14, 2, 4, 14, 12, 4, 5, \, 7, \, 7, 7, \],inf).midicps,
		\freq, Pseq(60 - 10 + keyAdd + [\, 8, 14, 2, 4, 14, 12, 4, 5, \, 7, \, 7, 7, \],1).midicps,
		// \dur, Pseq([1/8, 1/8, 1/4, 1/4, 1/4, 1/4, 1/4, 1/2, 1/4, 1/8, 1/8, 1/8, 1/8, 1/8, 1/8] * 1.2, inf),
		\dur, Pseq([1/8, 1/8, 1/4, 1/4, 1/4, 1/4, 1/4, 1/2, 1/4, 1/16, 1/8, 3/16, 1/8, 1/8, 1/8] * 0.6 * lenMul, 1),
		\delta, Pseq([1/8, 1/8, 1/4, 1/4, 1/4, 1/4, 1/4, 1/2, 1/4, 1/16, 1/8, 3/16, 1/8, 1/8, 1/8] * lenMul, 1),
		// \amp, 0.1
	);

};

~f1 = {|lenMul = 1, keyAdd = 0, inst = "default", ampMul = 1|
// var lenMul = 0.7;

Pbind(
		\instrument, inst,
		// \freq, Pseq(60 - 24 +[\, 8, 14, 2, 4, 14, 12, 4, 5, \, 7, \, 7, 7, \],inf).midicps,
		\freq, Pseq([
			Pseq(60 + keyAdd + [0, -5, -5, 5, 4, 5, 0, 4, 2, 0, -1, 0 ], 1),
			Pseq(60 + keyAdd + [0, -5, -5, 5, 4, 5, 0, 4, 2, 0, -1, -5 ], 1),
		].midicps, inf),
		\dur, Pseq([1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/2, 1/4] * 0.6 * lenMul, inf),
		\delta, Pseq([1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1, 1/2] * lenMul, inf),
		\amp, Pseq([1, 0.6, 0.6, 0.8, 0.6, 0.6, 0.7, 0.8, 0.7, 0.7, 0.8, 0.6] * ampMul, inf),
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

~p = ~f1.(1.2, 5, \sophi, 0.1);~e = ~p.asEventStreamPlayer;
~e.play;

//================================ OSCdef ================================
(

var count = 0, trig = 0;
var isOpen_0 = false;
var isOpen_1 = false;
var isOpen_2 = false;
var isOpen_3 = false;

~soundOff = false;

~p0 = ~f0.(1, 0);
~p1 = ~f1.(1);
~p2 = ~f2.(1);
~p3 = ~f3.(1);

// ~e1.free;~e2.free;~e3.free;
~e0 = nil;~e1 = nil;~e2 = nil;~e3 = nil;~e6 = nil;
// ~e0 = ~p0.asEventStreamPlayer;
// ~e0.play;~e0.pause;

~e1 = Synth(\condan, [\amp, 0]);
// ~e3 = Synth(\liedR, [\amp, 0]);
// ~e3 = Synth("help-TCoin_ori", [\amp, 0]);

Ndef(\pulsepulse).play;Ndef(\pulsepulse).set(\amp, 0);



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
		var ori_sum = 0;
	// msg.postln;
	// addr.postln;
	// msg.size.postln;

	// trig = msg[2];
	// count = count + 1;


	// msg[4].postln;
	// msg.postln;

	// ~testCount = ~testCount + 1;
	// ~testCount.postln;

	// acc_sum = abs(acc_x) + abs(acc_y) + abs(acc_z);

	if (~soundOff == false, {
		switch (ballId)
		{9} {

			if ( (msg[2] == 1) && (isOpen_0 == false), {
				acc_sum = abs(acc_x) + abs(acc_y) + abs(acc_z);
				"0 is open".postln;
				~p0 = ~f0.(1, 16);
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
		{4} {
			if ( (msg[2] == 1) && (isOpen_1 == false), {
				"1 open".postln;
				acc_sum = abs(acc_x) + abs(acc_y) + abs(acc_z);
				~e1.set(\freq, acc_sum * 50, \amp, 0.7, \freq2, ori_x);

				isOpen_1 = true;
			});

			if (msg[2] == 0, {
				~e1.set(\amp, 0);
				isOpen_1 = false;
			});

		}
		{8} {
			// if ( (msg[2] == 1) && (isOpen_2 == false), {
			if ( (msg[2] == 1), {
				"on".postln;
				acc_sum = abs(acc_x) + abs(acc_y) + abs(acc_z);
				ori_sum = abs(ori_x) + abs(ori_y) + abs(ori_z);

				Ndef(\pulsepulse).set(\freq, acc_sum * 10, \freq_reson, abs(ori_x*2), \freq_trig, 10, \amp, 0.05);
				// Ndef(\pulsepulse).set(\freq, acc_sum/2, \freq_reson, ori_sum * 10, \freq_trig, 10, \amp, 0.05);
				isOpen_2 = true;
			});

			if (msg[2] == 0, {
				// "off".postln;
				/*			~testCount = ~testCount + 1;
				~testCount.postln;*/

				Ndef(\pulsepulse).set(\amp, 0);
				isOpen_2 = false;
			});




		}
		{0} {
			if ( (msg[2] == 1), {
				// bombing...
				~e3 = Synth(\woong, [\freq, acc_sum.linlin(0, 100, 30, 240), \freq2, ori_x.linlin(0, 360, 40, 200), \freq3, ori_y.linlin(0, 100, 30, 90), \sn, 8, \cutoff, ori_z.linlin(0, 100, 180, 400)]);


				acc_sum = abs(acc_x) + abs(acc_y) + abs(acc_z);

				// melancholy
				// ~e3 = Synth(\liedR, [\freq, acc_sum.linlin(0, 100, 30, 240)]);
				// ~e3.set(\freq, acc_sum.linlin(0, 100, 55, 79).midicps, \efxfreq, 200, \amp, 0.7);
				// ~e3.set(\freq, acc_sum.linlin(0, 100, 66, 70).midicps, \amp, 0.6);

			});

			if (msg[2] == 0, {
				isOpen_3 = false;
			});



		}

		{5} { // Ending stage
			// like beep "삐---"

			if ( msg[2] == 0, { // NOT STOP
				~e6 = Synth("help-TCoin", [\freq, 5000, \rel, 0.1]); // 0
			});

			if (msg[2] == 1, { // STOP
				~e6.set(\amp, 0);

			});


		}
		{6} { // sound off
			~soundOff = true;
		}
	});


	if (~soundOff == true, {
		~e0.stop;~e0 = nil;
		Ndef.clear;
		~e1.free;~e3.free;

		OSCdef(\ball).clear;
	});

}, '/isBallStopped'); // def style

CmdPeriod.doOnce{

}
)

