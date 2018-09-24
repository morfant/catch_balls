(
Ndef(\clock, {|bpm = 2|
	var tick = Impulse.kr(bpm);  // 한 박(beat) 을 최대 96 분할
	// var clock = PulseCount.kr(tick);
	Out.kr(4094, tick);
	// Out.kr(4095, clock);
}).play;
)

(
f = { |v|
	if ( (In.kr(4094) eq: 0) == v, {
		"hi".postln;
	});
}
)

f.(0);


	{Impulse.kr(2)}.plot(4);


Pbind