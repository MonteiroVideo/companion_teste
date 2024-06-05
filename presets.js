export function getPresetDefinitions() {
	const presets = {
		preset_esc: {
			type: 'button',
			category: 'PPT',
			name: 'Send ESC Command',
			style: {
				text: 'ESC',
				size: '18',
				color: '16777215',
				bgcolor: '0',
			},
			steps: [
				{
					down: [
						{
							actionId: 'ESC',
						},
					],
					up: [],
				},
			],
		},
		preset_next: {
			type: 'button',
			category: 'PPT',
			name: 'Send NEXT Command',
			style: {
				text: '>\nNext',
				size: '14',
				color: '16777215',
				bgcolor: '25600',
			},
			steps: [
				{
					down: [
						{
							actionId: 'NEXT',
						},
					],
					up: [],
				},
			],
		},
		preset_previous: {
			type: 'button',
			category: 'PPT',
			name: 'Send PREVIOUS Command',
			style: {
				text: '<\nPrevious',
				size: '14',
				color: '16777215',
				bgcolor: '9109504',
			},
			steps: [
				{
					down: [
						{
							actionId: 'PREVIOUS',
						},
					],
					up: [],
				},
			],
		},
		preset_fechar_ppt: {
			type: 'button',
			category: 'PPT',
			name: 'Send FECHAR_PPT Command',
			style: {
				text: 'PPT\nEXIT',
				size: '18',
				color: '16777215',
				bgcolor: '0',
			},
			steps: [
				{
					down: [
						{
							actionId: 'FECHAR_PPT',
						},
					],
					up: [],
				},
			],
		},
		preset_fechar_video: {
			type: 'button',
			category: 'VIDEO',
			name: 'Send FECHAR_VIDEO Command',
			style: {
				text: 'VIDEO EXIT',
				size: '18',
				color: '16777215',
				bgcolor: '0',
			},
			steps: [
				{
					down: [
						{
							actionId: 'FECHAR_VIDEO',
						},
					],
					up: [],
				},
			],
		},
	}

	// Generate PPT command presets
	for (let i = 1; i <= 20; i++) {
		const pptCommand = i < 10 ? `ppt\n0${i}` : `ppt\n${i}`
		presets[`preset_${pptCommand}`] = {
			type: 'button',
			category: 'PPT',
			name: `Send ${pptCommand.toUpperCase()} Command`,
			style: {
				text: pptCommand.toUpperCase(),
				size: '18',
				color: '16777215',
				bgcolor: '139',
			},
			steps: [
				{
					down: [
						{
							actionId: 'send',
							options: {
								id_send: pptCommand,
							},
						},
					],
					up: [],
				},
			],
		}
	}

	// Generate VIDEO command presets
	for (let i = 1; i <= 10; i++) {
		const videoCommand = i < 10 ? `video\n0${i}` : `video\n${i}`
		presets[`preset_${videoCommand}`] = {
			type: 'button',
			category: 'VIDEO',
			name: `Send ${videoCommand.toUpperCase()} Command`,
			style: {
				text: videoCommand.toUpperCase(),
				size: '18',
				color: '16777215',
				bgcolor: '25600',
			},
			steps: [
				{
					down: [
						{
							actionId: 'send',
							options: {
								id_send: videoCommand,
							},
						},
					],
					up: [],
				},
			],
		}
	}

	return presets
}
