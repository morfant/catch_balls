// bootup server!
s.boot;

// define synth
(
SynthDef(\sine, {|freq = 440, dur = 1.0|
	var env = Line.kr(0.2, 0.0, dur, doneAction:2);
	var sig = SinOsc.ar(freq, 0, env);
	Out.ar(0, Pan2.ar(sig));
}).add;
)

// call synth!
Synth(\sine);
Synth(\sine, [freq: 660, dur: 2.0]);
Synth(\sine, [freq: 69.midicps, dur: 2.0]);


// ======================================= Lang side Sequence ===========================================
// Routine(Tdef)
(
r = Routine{
	inf.do{
		Synth(\sine, [freq: [48,55,60,64,67,81].midicps, dur: 1.4]);
		1.0.wait;
	}
}.play;
)

r.pause;



r.next;

// Tdef for hotswap to code
(
Tdef(\seq1, {
	inf.do{
		Synth(\sine, [freq: [48,55,60,64,67,81].midicps, dur: 1.4]);
		1.0.wait;
}}).play;
)

// sync with Tdefs
(
Tdef(\seq1, {
	inf.do{
		Synth(\sine, [freq: [48,55,60,64,67,81].choose.midicps, dur: 1.4]);
		1.0.wait;
}}).play(quant:4);
)

(
Tdef(\seq2, {
	inf.do{
		Synth(\sine, [freq: 64.midicps, dur: 0.5]);
		0.5.wait;
}}).play(quant:4);
)

//change tempo
TempoClock.default.tempo_(80/60);


// Pattern with sequence
(// ball_0
var lenMul = 0.8;
Pdef(\seq1,
	Pbind(
		\instrument, \sine,
		// \freq, Pseq(60 - 24 +[\, 8, 14, 2, 4, 14, 12, 4, 5, \, 7, \, 7, 7, \],inf).midicps,
		\freq, Pseq(60 - 10 +[\, 8, 14, 2, 4, 14, 12, 4, 5, \, 7, \, 7, 7, \],inf).midicps,
		// \dur, Pseq([1/8, 1/8, 1/4, 1/4, 1/4, 1/4, 1/4, 1/2, 1/4, 1/8, 1/8, 1/8, 1/8, 1/8, 1/8] * 1.2, inf),
		\dur, Pseq([1/8, 1/8, 1/4, 1/4, 1/4, 1/4, 1/4, 1/2, 1/4, 1/16, 1/8, 3/16, 1/8, 1/8, 1/8] * 0.6 * lenMul/2, inf),
		\delta, Pseq([1/8, 1/8, 1/4, 1/4, 1/4, 1/4, 1/4, 1/2, 1/4, 1/16, 1/8, 3/16, 1/8, 1/8, 1/8] * lenMul, inf)
	)
).play(quant:1);
)


(// ball_1
var lenMul = 1;
Pdef(\seq2,
	Pbind(
		\instrument, \default,
		// \freq, Pseq(60 - 24 +[\, 8, 14, 2, 4, 14, 12, 4, 5, \, 7, \, 7, 7, \],inf).midicps,
		\freq, Pseq(60 - 10 +[\, 5, \, 7, \, 7, 7, \],inf).midicps,
		// \dur, Pseq([1/8, 1/8, 1/4, 1/4, 1/4, 1/4, 1/4, 1/2, 1/4, 1/8, 1/8, 1/8, 1/8, 1/8, 1/8] * 1.2, inf),
		\dur, Pseq([1/8, 1/8, 1/4, 1/4, 1/4, 1/4, 1/4, 1/2] * 0.6 * lenMul/2, inf),
		\delta, Pseq([1/8, 1/8, 1/4, 1/4, 1/4, 1/4, 1/4, 1/2] * lenMul, inf)
	)
).play(quant:1);
)


(
var lenMul = 1;

a = Pbind(
		\instrument, \sine,
		// \freq, Pseq(60 - 24 +[\, 8, 14, 2, 4, 14, 12, 4, 5, \, 7, \, 7, 7, \],inf).midicps,
		\freq, Pseq(60 - 10 +[14, 2, 4, 14, 12, 4, \, 7, 7, \],inf).midicps,
		// \dur, Pseq([1/8, 1/8, 1/4, 1/4, 1/4, 1/4, 1/4, 1/2, 1/4, 1/8, 1/8, 1/8, 1/8, 1/8, 1/8] * 1.2, inf),
		\dur, Pseq([1/8, 1/8, 1/4, 1/4, 1/4, 1/4, 1/4, 1/2, 1/4, 1/16, 1/8, 3/16, 1/8, 1/8, 1/8] * 0.6 * lenMul, inf),
		\delta, Pseq([1/8, 1/8, 1/4, 1/4, 1/4, 1/4, 1/4, 1/2, 1/4, 1/16, 1/8, 3/16, 1/8, 1/8, 1/8] * lenMul, inf)
);

)



a.pause;
a.resume;

x = a.asStream;

x.next(()).play;


Pdef(\seq1).pause;
Pdef(\seq1).resume;
Pdef(\seq1).stop;
Pdef(\seq1).play;

(
Pdef(\seq2,
	Pbind(
		\instrument, \sine,
		\freq, Pxrand([\,64,67,71],inf).midicps * 2,
		\dur, 1.2,
		\delta, 1.0
	)
).quant_(4).play;
)



// ======================================= Server side Sequence ===========================================

// Ndef
(
Ndef(\x1, {
	Pan2.ar(SinOsc.ar(440, 0, 0.2));
}).fadeTime_(2).play;
)

Ndef(\x1).release(4);



// trig 신호를 받으면 재연산을 수행하는 UGen들

(// TRand / TIRand / TChoose
Ndef(\x2, {
	Pan2.ar(SinOsc.ar(TIRand.kr(4,10,Impulse.kr(1)) * 100, 0, 0.2));
}).fadeTime_(0.5).play;
)


(// EnvGen
Ndef(\x2, {
	var trig = Impulse.kr(4);
	var env = EnvGen.kr(Env.perc(0.0, 0.4, 0.3), trig);
	Pan2.ar(SinOsc.ar(TIRand.kr(4,10,trig) * 100, 0, env));
}).fadeTime_(0.5).play;
)


// 여러 UGen 들을 싱크하기 위해서는...
(
Ndef(\masterclock, {
	Out.kr(4095, Impulse.kr(4));
	0.0;
}).play;
)

(
Ndef(\x2, {
	var trig = In.kr(4095);
	var env = EnvGen.kr(Env.perc(0.0, 0.4, 0.3), trig);
	Pan2.ar(SinOsc.ar(TIRand.kr(4,10,trig) * 100, 0, env));
}).play
)


(
Ndef(\x3, {
	var trig = In.kr(4095);
	var env = EnvGen.kr(Env.perc(0.4, 0.01, 0.3), trig);
	Pan2.ar(SinOsc.ar(TIRand.kr(4,7,trig).poll * 100, 0, env));
}).play
)



A2K

// for advanced! =======================================================================
(// Clock
Ndef(\clock, {|bpm = 60|
	var tick = Impulse.kr(96 * (bpm / 60));  // 한 박(beat) 을 최대 96 분할
	var clock = PulseCount.kr(tick);
	Out.kr(4094, tick);
	Out.kr(4095, clock);
}).play;

ServerTree.add( { Ndef(\clock).play; }, s);

// trig 함수
t = {|div|
	/*(In.kr(4095) % (96 * div.reciprocal) eq: 0 ) * In.kr(4094);*/
	if ( In.kr(4095) > 0.5 , {
		"on".postln;

	},{
		"off".postln;

	});

};

// count 함수 (현재 마디나 박자 위치)
c = {|div|
	(In.kr(4095) / (96 * div.reciprocal)).floor;
};

// gatelane
g = {|div, len, lane|
	Mix((c.(div) % len) eq: lane) * t.(div);
};


//poly phonic
~poly = {|poly, gate|
	((PulseCount.kr(gate) + Array.fill(poly, {|i| i})) % poly < 1) * gate;
};
)

//=======================================================================================
t.(8);

(
Ndef(\foo1, {
	Pan2.ar(SinOsc.ar(440, 0, EnvGen.kr(Env.perc(0.0, 0.4, 0.4), t.(1))));
}).play
)

(
Ndef(\bar1, {
	Pan2.ar(SinOsc.ar(1440, 0, EnvGen.kr(Env.perc(0.0, 0.4, 0.4), t.(1))));
}).play
)

(
Ndef(\baz1, {
	Pan2.ar(SinOsc.ar(240, 0, EnvGen.kr(Env.perc(0.0, 0.4, 0.4), g.(4, 16, [0,3,6,9,12,14]))));
}).play
)


(
Ndef(\pad, {
	var sel = (c.(1) / 8).floor % 2; // c 함수
	var note = Select.kr(sel, [ [60, 64, 67, 71], [64, 67, 71, 74] ]);
	Pan2.ar(Mix(SinOsc.ar(note.midicps, 0, 0.1)));
}).fadeTime_(1).play;
)

(
Ndef(\arp, {
	var sel = c.(8) % 4  +   (4 * (c.(1) / 8).floor % 2); // c 함수
	var note = Select.kr(sel, [60, 64, 67, 71, 64, 67, 71, 74 ]);
	Pan2.ar(Mix(SinOsc.ar(note.midicps * 2, 0, 0.1)));
}).fadeTime_(1).play;
)


(
Ndef(\lead, {
	var trig = t.(0.25);
	var note = VarLag.kr(TChoose.kr(trig, [55, 59, 60, 67]), 0.4);
	Pan2.ar(Mix(Saw.ar([note, note+5].midicps, 0.2)));
}).fadeTime_(0.5).play;
)


(
Ndef(\lead2, {
	var trig = ~poly.(4, t.(4));
	var note = TChoose.kr(trig, [55, 59, 60, 67]) + 24;
	Pan2.ar(Mix(Saw.ar(note.midicps, EnvGen.kr(Env.perc(0.0, 2.0, 0.2), trig))));
}).fadeTime_(0.5).play;
)



Ndef(\clock).set(\bpm, 60);


b = Buffer.read(s, Platform.resourceDir +/+ "sounds/a11wlk01.wav"); // remember to free the buffer later.

(
Ndef(\buff, {
	var trig = t.(8);
	Pan2.ar(PlayBuf.ar(1, b, 1, trig, b.numFrames / 8 * TIRand.kr(0,7,trig), 1),  TRand.kr(-1.0, 1.0, trig));
}).play;
)

// Link ==========================================================================================

Link.enable;

(
Ndef(\foo1, {
	Pan2.ar(SinOsc.ar(440, 0, EnvGen.kr(Env.perc(0.0, 0.4, 0.4), LinkTrig.kr(4))));
}).play
)

(
Ndef(\bar1, {
	Pan2.ar(SinOsc.ar(1440, 0, EnvGen.kr(Env.perc(0.0, 0.4, 0.4), LinkTrig.kr(1))));
}).play
)

(
Ndef(\baz1, {
	Pan2.ar(SinOsc.ar(240, 0, EnvGen.kr(Env.perc(0.0, 0.4, 0.4), LinkLane.kr(4, 16, [0,3,6,9,12,14]))));
}).play
)


(
Ndef(\pad, {
	var sel = (LinkCount.kr(1) / 8).floor % 2; // c 함수
	var note = Select.kr(sel, [ [60, 64, 67, 71], [64, 67, 71, 74] ]);
	Pan2.ar(Mix(SinOsc.ar(note.midicps, 0, 0.1)));
}).fadeTime_(1).play;
)

(
Ndef(\arp, {
	var sel = LinkCount.kr(8) % 4  +   (4 * (LinkCount.kr(1) / 8).floor % 2); // c 함수
	var note = Select.kr(sel, [60, 64, 67, 71, 64, 67, 71, 74 ]);
	Pan2.ar(Mix(SinOsc.ar(note.midicps * 2, 0, 0.1)));
}).fadeTime_(1).play;
)


(
Ndef(\lead, {
	var trig = LinkTrig.kr(0.25);
	var note = VarLag.kr(TChoose.kr(trig, [55, 59, 60, 67]), 0.4);
	Pan2.ar(Mix(Saw.ar([note, note+5].midicps, 0.2)));
}).fadeTime_(0.5).play;
)


(
Ndef(\lead2, {
	var trig = ~poly.(4, LinkTrig.kr(4));
	var note = TChoose.kr(trig, [55, 59, 60, 67]) + 24;
	Pan2.ar(Mix(Saw.ar(note.midicps, EnvGen.kr(Env.perc(0.0, 2.0, 0.2), trig))));
}).fadeTime_(0.5).play;
)

Link.setTempo(60);


b = Buffer.read(s, Platform.resourceDir +/+ "sounds/a11wlk01.wav"); // remember to free the buffer later.

(
Ndef(\buff, {
	var trig = LinkTrig.kr(8);
	Pan2.ar(PlayBuf.ar(1, b, 1, trig, b.numFrames / 8 * TIRand.kr(0,7,trig, 1),  TRand.kr(-1.0, 1.0, trig)));
}).play;
)




