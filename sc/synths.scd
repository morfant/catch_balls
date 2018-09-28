// ======================================= SynthDef ===========================================

0 : 정해진 멜로디 재생, 디지털적인 또로로로롱..
1 : 일정 주기로 베이스 드럼처럼 둥둥 거리는
2 : 공의 움직임에 민감하게 반응함을 알 수 있는 고음, 얇은 소리
3 : 약간 멜랑콜리한 늘어지고 빨라지고에 따라 느낌이 달라지는

Synth(\gobeat, [\freq, 2000]);
Synth(\sine, [\freq, 4000, \amp, 3]); // ball 0
Synth(\ddd, [\freq, 8000]); // 0
Synth(\woong); // 1
Synth(\dirac, [\freq, 700, \amp, 0.1]); // digital 적인데.. 0에 mix?
Synth(\chal, [\amp, 1.0, \freq, 2000]); // 1
Synth("help-TCoin", [\freq, 5000, \rel, 4]); // 0


// sustained
Synth("help-TCoin_ori", [\freq, 3000]); // 2
Synth(\sori, [\amp, 1.0, \freq, 100]); // 2
Synth(\woonglong); // 3
Synth(\hafen); // 1 or 2
Synth(\liedR, [\freq, 1000]); // 3
Synth("latooncarfian"); // 공 4개가 모두 공중에 있을 때 간헐적으로?


(
SynthDef(\gobeat, {|freq = 240, dur = 0.9, gate = 1, amp = 0.5|
	// var env = Line.kr(0.2, 0.0, dur, doneAction:2);
	var env = EnvGen.kr(Env.perc(0.01, dur), gate, doneAction: 2);
	var sig = SinOsc.ar(freq, 0);
	var verb = GVerb.ar(sig, 80, 4.85, 0.41, 0.19, 15, -3, -9, -11);

	Out.ar(0, verb*env*amp + sig*env*amp);
}).add;


// conceptual dance
SynthDef(\condan, {|freq = 240, dur = 5, gate = 1, amp = 0.5, freq2 = 33, amp2 = 0.5|
	// var env = EnvGen.kr(Env.perc(0.01, dur), gate);
	var env = EnvGen.kr(Env.adsr(), gate, doneAction: 2);
	var sig2 = LFSaw.kr(freq2, mul: amp2);
	// var sig2 = LFPar.kr(freq2, mul: amp2);
	var sig = SinOsc.ar(freq, mul: env*sig2);

	Out.ar(0, Pan2.ar(sig)*amp);
}).add;


SynthDef(\sine, {|freq = 240, dur = 0.2, gate = 1, atk = 0.1, amp = 0.5|
	// var env = EnvGen.kr(Env.perc(atk, dur), gate, doneAction: 2);
	var env = Line.kr(0.2, 0.0, dur, doneAction:2);
	var sig = SinOsc.ar(freq, 0, env);
	var sig2 = SinOsc.kr(freq/4, mul: env);
	var no = WhiteNoise.ar(env) * 0.005 * LFTri.kr(80, mul: 0.4);
	Out.ar(0, Pan2.ar(sig*sig2+no)*amp);
}).add;

SynthDef(\ddd, {|freq = 240, dur = 0.2, gate = 1, atk = 0.1, amp = 0.5, toneLow = 7, toneGain = 0.3|
	var env = EnvGen.kr(Env.perc(atk, dur), gate, doneAction: 2);
	var sig2 = SinOsc.kr(freq/toneLow, mul: toneGain);
	var sig = SinOsc.ar(freq*sig2, pi/6);
	var no = WhiteNoise.ar(0.005) * LFTri.kr(80, mul: 0.4);
	Out.ar(0, Pan2.ar((sig+no)*env)*amp);
}).add;

//new lead - freq를 set 으로 변화 할 때 특별한 효과가 생긴다.
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
        out = Out.ar(0, Pan2.ar(delay, pansig));
    }).add;

SynthDef("latooncarfian", { arg out = 0, freq = 440, chFreq1 = 2, chFreq2 = 2,
	a = 1, b = 3, c = 0.5, d = 0.5, gate = 1, amp = 0.3;
    var s1, s2, env;
        s1 = LatoocarfianN.ar(
    SampleRate.ir/4,
    LFNoise2.kr(chFreq1,1.5,1.5),
    LFNoise2.kr(chFreq1,1.5,1.5),
    LFNoise2.kr(chFreq1,0.5,1.5),
    LFNoise2.kr(chFreq1,0.5,1.5), mul: 0.1
);

        s2 = LatoocarfianN.ar(
    SampleRate.ir/4,
    LFNoise2.kr(chFreq2,1.5,1.5),
    LFNoise2.kr(chFreq2,1.5,1.5),
    LFNoise2.kr(chFreq2,0.5,1.5),
    LFNoise2.kr(chFreq2,0.5,1.5), mul: 0.1
);

Out.ar(out, [s1, s2] * amp);

}).add;


SynthDef(
    \hafen,
    {
        arg freqScale = 200, amp = 0.1, gate = 1, inNum = 0;
        var sig, env, envgen, inputs, n = 32;
        inputs = [PinkNoise.ar(0.3), WhiteNoise.ar(0.1), ClipNoise.ar(0.1), BrownNoise.ar(0.2)];
        sig = DynKlank.ar(`[ (1..13)*freqScale, 1/(1..13), nil ],
            Select.ar(inNum, inputs));
        env = Env(
		[0]++{0.8.rand.squared}.dup(n-1) ++ [0],
				{rrand(0.1,0.3)}.dup(n),
				\lin, n-8, 8 );
        envgen = EnvGen.kr(env, gate, doneAction: 2);
        Out.ar(0, Pan2.ar(sig * envgen, 0, amp));
    }
).add;


SynthDef("lfp", { arg out = 100, freq = 440, chFreq1 = 2, chFreq2 = 2,
	a = 1, b = 3, c = 0.5, d = 0.5,
	aa = 1, bb = 3, cc = 0.5, dd = 0.5,
	gate = 1, amp = 0.1;
    var s1, s2, env;
    env = EnvGen.kr(Env.perc(0.15, 0.05), gate, doneAction: 2);
    s1 = LatoocarfianN.ar(SampleRate.ir/4, a, b, c, d, mul: 0.1);
    s2 = LatoocarfianN.ar(SampleRate.ir/4, aa, bb, cc, dd, mul: 0.1);

Out.ar(out, [s1, s2]*env*amp);

}).add;


// Synthdef 4 - Reverb
SynthDef(\verb,
    {
        arg in = 0, room = 2, rtime = 1, dam = 0.3, sp = 5, tail = 0.2;
        var sig, fil;
        sig = In.ar(in, 1);
        fil = GVerb.ar(sig, room = 2, rtime, dam, 0.5, sp, taillevel: tail);
        Out.ar(0, fil);

}).add;


// Synthdef 5
SynthDef(\woong,
    {
        arg cutoff = 202, rq = 1.0, sn = 8, amp = 0.5, gate = 1, freq = 55, freq2 = 75, freq3 = 100;
        var sig, fil, lfo, env;

		env = EnvGen.kr(Env.perc, gate, doneAction: 2);
        lfo = LFClipNoise.kr(sn, mul: 0.5, add: 0.5);
		sig = Mix.new([Saw.ar(freq, mul: amp/2), Saw.ar(freq3, mul: amp/2), Saw.ar(freq2, mul: amp/2)]) * lfo;
        fil = RLPF.ar(sig, cutoff, rq);
		Out.ar(0, Pan2.ar(fil*amp*env, 0));
    }
).add;


// {Mix.new([Saw.ar(100, mul: 0.4), Saw.ar(200, mul: 0.4)])!2}.play;

// Synthdef 6
SynthDef(\woonglong,
    {
        arg cutoff = 202, rq = 1.0, sn = 8, gate = 1, amp = 0.6;
        var sig, fil, lfo, env;

        env = EnvGen.kr(Env.asr(1.3, 1, 3), gate, doneAction: 2);
        sig = Saw.ar(#[50, 75], 1);
        fil = RLPF.ar(sig, cutoff, rq);
        Out.ar(0, fil * env * amp);
    }
).add;


// Synthdef 7
SynthDef(\dirac, {| out, amp = 0.03, freq = 100, decay = 0.01, pos = 0 |
		var i = Impulse.ar(0), sig;
//		sig = Mix.fill(6, {Ringz.ar(i, Rand(freq, freq*[1.5, 2]), decay)});
		sig = Mix.fill(6, {Ringz.ar(i, Rand(freq, freq*1.5), decay)});
		DetectSilence.ar(sig, doneAction: 2);
		sig = Pan2.ar(sig, pos, amp);
		Out.ar(out, sig);
	}).add;


SynthDef(\chal, {| out, amp = 0.03, freq = 100, decay = 0.01, pos = 0, freqBase = 120, ampBase = 0.3, gate = 1 |
		var i = Impulse.ar(10), sig, sigCol, fil;
	// sigCol = LFSaw.ar(freqBase, mul: ampBase);
		sigCol = SinOsc.ar(freqBase, mul: ampBase);
//		sig = Mix.fill(6, {Ringz.ar(i, Rand(freq, freq*[1.5, 2]), decay)});
	sig = Mix.fill(6, {Blip.ar(Rand(freq, freq*1.5), 1) * EnvGen.kr(Env.perc(0.01, 0.2), gate, doneAction: 2)});
	fil = LPF.ar(sig, 300);
		DetectSilence.ar(sig, doneAction: 2);
		sig = Pan2.ar(fil*sigCol, pos, amp);
		Out.ar(out, sig);
	}).add;




// Synthdef 8
SynthDef("help-TCoin_ori", { arg out=0, prob=0.5, freq = 20, freq_am = 0.5, amp = 0.2;
	var trig;
	trig = Impulse.ar(freq, 0, SinOsc.kr(freq_am,0,1,1));
	// trig = Impulse.ar(SinOsc.kr(0.01, 0, freq+100, freq+300), 0, SinOsc.kr(freq_am,0,1,1));
	Out.ar(out,
		// Mix.fill(3, {Ringz.ar(CoinGate.ar(prob, trig*0.5), #[1,1.5, 2, 4]*Rand(50, 90), 0.01)})*amp
		SinOsc.ar(#[1, 1.5, 3]*freq)*amp

	)
}).add;

SynthDef("help-TCoin", { arg out=0, prob=0.5, freq = 20, freq_am = 0.5, amp = 0.2, rel = 1, gate = 1;
	var trig, env;
	env = EnvGen.kr(Env.perc(0.01, rel), gate, doneAction: 2);
	trig = Impulse.ar(freq, 0, SinOsc.kr(freq_am,0,1,1));
	// trig = Impulse.ar(SinOsc.kr(0.01, 0, freq+100, freq+300), 0, SinOsc.kr(freq_am,0,1,1));
	Out.ar(out,
		// Mix.fill(3, {Ringz.ar(CoinGate.ar(prob, trig*0.5), #[1,1.5, 2, 4]*Rand(50, 90), 0.01)})*amp
		SinOsc.ar(#[1, 1.5, 3]*freq)*amp*env
	)
}).add;

SynthDef("help-TCoin_house", { arg out=0, prob=0.5, freq = 20, freq_am = 0.5, amp = 0.2, gate = 1,
	atkTime = 0.3, relTime = 0.1;
	var trig, env;
	// env = EnvGen.kr(Env.perc(0.3, 1), gate, doneAction: 2);
	env = EnvGen.kr(Env.perc(), gate, doneAction: 2);
	trig = Impulse.ar(freq, 0, SinOsc.kr(freq_am,0,1,1));
	// trig = Impulse.ar(SinOsc.kr(0.01, 0, freq+100, freq+300), 0, SinOsc.kr(freq_am,0,1,1));
	Out.ar(out,
		// Mix.fill(3, {Ringz.ar(CoinGate.ar(prob, trig*0.5), #[1,1.5, 2, 4]*Rand(50, 90), 0.01)})*amp
		SinOsc.ar(#[1, 1.5, 3]*freq)*amp*env
	)
}).add;


SynthDef(\sori,
	{
		arg amp = 1, freq = 20, freq2 = 20, gate = 1, ph = 0,
		freq3 = 10, filfreq = 100, rq = 0.2, freq4 = 100, dop = 0.5, harm = 200 ;
		var sig, env, sig2, env2, sig3, sig4, fil;
		//		env2 = EnvGen.kr(Env.perc(0.1, 0.5), gate, doneAction: 2);
		env2 = EnvGen.kr(Env.asr, gate, doneAction: 2);
		//		sig2 = SinOsc.kr(freq2*env2, ph);
		//		sig2 = LFTri.kr(freq2*env2, ph);
		//		sig2 = WhiteNoise.kr(1);
		sig4 = Blip.kr(freq4, harm);
		sig3 = SinOsc.kr(freq3);
		sig2 = LFNoise0.kr(freq2);

		sig = SinOsc.ar(freq*sig4, mul: 1);
		env = EnvGen.kr(Env.asr, gate, doneAction: 2);
		fil = RHPF.ar(sig, freq, rq);
		Out.ar(0, Pan2.ar(fil*env*amp));
	}
).add;


//Synth - mic in
SynthDef(\micin, {| in = 0, amp = 0, gate = 1 |
    var sig;
    sig = SoundIn.ar(in);
    Out.ar(0, Pan2.ar(sig, 0, amp));
}).add;
)