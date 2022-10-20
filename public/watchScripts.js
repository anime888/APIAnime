let source = datalocal?.src || null,
	video = document.querySelector('video'),
	player,
	playerConfig = {
		playsinline: true,
		fullscreen: {
			enabled: true,
			fallback: true,
			iosNative: true,
		},
	};

if (Hls.isSupported()) {
	console.log('HSL Is supported, initialize..');
	var hls = new Hls();
	hls.loadSource(source);
	hls.attachMedia(video);
	hls.on(Hls.Events.MANIFEST_PARSED, function (e, d) {
		const q = d.levels?.map((e) => e.height).reverse();
		console.log(`Quality found: ${q.join(',')}`);
		player = new Plyr(video, {
			...playerConfig,
			quality: {
				default: q[0],
				options: q,
				forced: true,
				onChange: (q) => {
					hls.levels.forEach((e, i) => {
						if (e.height === q) {
							hls.currentLevel = i;
						}
					});
				},
			},
		});
	});
} else {
	if (video.canPlayType('application/vnd.apple.mpegurl')) {
		console.log('Using default video element.');
		video.src = source;
		player = new Plyr(video, {
			...playerConfig,
		});
	}
}
