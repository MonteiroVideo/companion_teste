import { InstanceBase, InstanceStatus, runEntrypoint, TCPHelper } from '@companion-module/base'
import { ConfigFields } from './config.js'
import { getActionDefinitions } from './actions.js'
import { getPresetDefinitions } from './presets.js'
import net from 'net'

class CronosDownTCP extends InstanceBase {
	async init(config) {
		this.config = config

		this.setActionDefinitions(getActionDefinitions(this))
		this.setPresetDefinitions(getPresetDefinitions(this))

		await this.configUpdated(config)
		this.init_tcp_variables()
		this.init_server()
	}

	async configUpdated(config) {
		if (this.socket) {
			this.socket.destroy()
			delete this.socket
		}

		this.config = config
		this.init_tcp()
		this.init_tcp_variables()
	}

	async destroy() {
		if (this.socket) {
			this.socket.destroy()
		} else {
			this.updateStatus(InstanceStatus.Disconnected)
		}
	}

	getConfigFields() {
		return ConfigFields
	}

	init_tcp() {
		if (this.socket) {
			this.socket.destroy()
			delete this.socket
		}

		this.updateStatus(InstanceStatus.Connecting)

		if (this.config.host) {
			this.socket = new TCPHelper(this.config.host, this.config.port)

			this.socket.on('status_change', (status, message) => {
				this.updateStatus(status, message)
			})

			this.socket.on('error', (err) => {
				this.updateStatus(InstanceStatus.ConnectionFailure, err.message)
				this.log('error', 'Network error: ' + err.message)
			})

			this.socket.on('data', (data) => {
				if (this.config.saveresponse) {
					let dataResponse = data

					if (this.config.convertresponse == 'string') {
						dataResponse = data.toString()
					} else if (this.config.convertresponse == 'hex') {
						dataResponse = data.toString('hex')
					}

					this.setVariableValues({ custom_message: this.config.custom_text || '' }) // Usar o texto customizado definido nas configurações

					this.updateReceivedMessages(dataResponse)
				}
			})
		} else {
			this.updateStatus(InstanceStatus.BadConfig)
		}
	}

	init_tcp_variables() {
		const variables = [
			{ name: 'Timer', variableId: 'timer' },
			{ name: 'Timer Hours', variableId: 'timer_hours' },
			{ name: 'Timer Minutes', variableId: 'timer_minutes' },
			{ name: 'Timer Seconds', variableId: 'timer_seconds' },

		];

		for (let i = 1; i <= 20; i++) {
			variables.push({ name: `Item ${i}`, variableId: `item${i}` });
		}

		this.setVariableDefinitions(variables);

		const now = new Date();
		const hours = now.getHours().toString().padStart(2, '0');
		const minutes = now.getMinutes().toString().padStart(2, '0');
		const seconds = now.getSeconds().toString().padStart(2, '0');

		const initialValues = {
			timer: `${hours}:${minutes}:${seconds}`,
			timer_hours: hours,
			timer_minutes: minutes,
			timer_seconds: seconds,

		};

		for (let i = 1; i <= 20; i++) {
			initialValues[`item${i}`] = `PRESET\n${i}`;
		}

		this.setVariableValues(initialValues);
	}

	update_tcp_variables() {
		const now = new Date()
		const hours = now.getHours().toString().padStart(2, '0')
		const minutes = now.getMinutes().toString().padStart(2, '0')
		const seconds = now.getSeconds().toString().padStart(2, '0')

		this.setVariableValues({
			timer_hours: hours,
			timer_minutes: minutes,
			timer_seconds: seconds,
			timer: `${hours}:${minutes}:${seconds}`
		})
	}

	init_server() {
		const server = net.createServer((socket) => {
			socket.on('data', (data) => {
				const message = data.toString('utf8');
				const params = new URLSearchParams(message);
				const hours = params.get('hours');
				const minutes = params.get('minutes');
				const seconds = params.get('seconds');
				const time = params.get('time');
	
				if (hours && minutes && seconds && time) {
					this.setVariableValues({
						timer_hours: hours,
						timer_minutes: minutes,
						timer_seconds: seconds,
						timer: time,
					});
					this.log('info', `Received time: ${time} (H: ${hours}, M: ${minutes}, S: ${seconds})`);
				} else {
					const itemValues = {};
	
					for (let i = 1; i <= 20; i++) {
						const itemValue = params.get(`item${i}`);
						if (itemValue !== null) {
							itemValues[`item${i}`] = itemValue;
						}
					}
	
					this.setVariableValues(itemValues);
	
					const receivedItems = Object.values(itemValues).filter(value => value !== '');
					this.log('info', `Received items: ${receivedItems.join(', ')}`);
				}
			});
	
			socket.on('error', (err) => {
				this.log('error', `Server error: ${err.message}`);
			});
		});
	
		// Use the configured port instead of a hardcoded value
		server.listen(12345, () => {
			this.log('info', `Server listening on port ${this.config.port}`);
		});
	}
	
	/*async sendCommand(cmd) {
		if (cmd !== undefined) {
			this.log('debug', `sending ${cmd} to ${this.config.host}`)

			if (this.config.prot === 'tcp') {
				this.init_tcp(async () => {
					if (this.socket) {
						await this.socket.send(cmd + '\r')
					}
				})
			} else {
				this.log('error', 'Unsupported protocol')
			}
		}
	}*/
}

runEntrypoint(CronosDownTCP, [])