(
OSCdef(\bomb, {
	|msg, time, addr, recvPort|


	if (msg[1] > 0, {
		var amp = msg[1];

		Synth(\gobeat, [\freq, 2000, \amp, amp]);

	})


}, '/bombard');
);