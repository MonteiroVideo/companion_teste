export function getActionDefinitions(self) {

	const actions = {}

	actions['send'] = {
		name: 'PPT/VIDEO',
		options: [
			{
				type: 'textinput',
				id: 'id_send',
				label: 'Command:',
				tooltip: 'Use %hh to insert Hex codes\nObsolete, use Send HEX command instead',
				default: '',
				useVariables: true,
			},
		],
		callback: async (action) => {
			const cmd = unescape(await self.parseVariablesInString(action.options.id_send))

			if (cmd != '') {
				const sendBuf = Buffer.from(cmd, 'latin1')

				self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())

				if (self.socket !== undefined && self.socket.isConnected) {
					self.socket.send(sendBuf)
				} else {
					self.log('debug', 'Socket not connected :(')
				}
			}
		},
	}

	// Helper function to create simple command actions
	const createSimpleCommandAction = (name, command) => ({
		name: `${name}`,
		options: [],
		callback: async () => {
			const cmd = command
			const sendBuf = Buffer.from(cmd, 'latin1')

			self.log('debug', `sending to ${self.config.host}: ${sendBuf.toString()}`)

			if (self.socket !== undefined && self.socket.isConnected) {
				self.socket.send(sendBuf)
			} else {
				self.log('debug', 'Socket not connected :(')
			}
		},
	})

	// Creating simple command actions
	const simpleCommands = {
		ESC: 'esc',
		NEXT: 'next',
		PREVIOUS: 'previous',
		FECHAR_PPT: 'pptexit',
		FECHAR_VIDEO: 'videoexit',
	}

	for (const [name, command] of Object.entries(simpleCommands)) {
		actions[name] = createSimpleCommandAction(name, command)
	}

	return actions
}
