import { useEffect, useRef, useState } from 'react'
import { loginRequest } from '../../api';
import ChatBotMessage from '../ChatBotMessage/ChatBotMessage';
import './ChatBot.css'

const ChatBot = () => {

	const [opened, setOpened] = useState(false);
	const [messages, setMessages] = useState([]);

	const [userInput, setUserInput] = useState('');

	const [flag, setFlag] = useState(false);
	const [flagType, setFlagType] = useState('');

	const [user, setUser] = useState({
		surname: '',
		id: ''
	})

	const [awaitingMessage, setAwaitingMessage] = useState({
		from: 'client',
		type: '',
		message: '',
	})

	const [token, setToken] = useState(null);

	const ws = useRef();

	const setAction = (action) => {
		setAwaitingMessage({ ...awaitingMessage, type: action })
	}

	useEffect(() => {
		if (!ws.current) {
			ws.current = new WebSocket('ws://localhost:8080');
			ws.current.onopen = function (e) {
				//ws.current.send("Меня зовут Джон");
			};
			ws.current.onmessage = function (event) {
				const message = JSON.parse(event.data)
				console.log('message', message);
				if (message.type === 'service') {
					switch (message.text) {
						case 'login':
							setFlag(true)
							setFlagType('surname')
							addMessage({ text: 'Введите фамилию', type: 'server' })
							break;
						default:
							break;
					}
				} else {
					addMessage(message)
				}
			};
		}
	}, [])

	useEffect(() => {
		if (user.surname && user.id && !token) {
			loginRequest(user.surname, user.id).then((res) => {
				if (res.token) {
					setToken(res.token)
					addMessage({ text: `Вы успешно вошли`, type: 'server' })
				}
			})
		}
	}, [token, user])

	const addMessage = (message) => {
		setMessages(m => ([...m, message]))
	}

	const sendMessage = () => {
		// if (input) {
		// 	addMessage({ text: input, type: 'client' })
		// 	if (flag) {
		// 		switch (flagType) {
		// 			case 'surname':
		// 				setFlagType('id')
		// 				setUser({ ...user, surname: input })
		// 				addMessage({ text: 'Введите номер билета', type: 'server' })
		// 				break;
		// 			case 'id':
		// 				setFlagType('')
		// 				setFlag(false)
		// 				setUser({ ...user, id: input })
		// 				break;
		// 			default:
		// 				break;
		// 		}
		// 	} else {
		// 		ws.current.send(input);
		// 	}
		// 	setInput('');
		// }
	}

	return (
		<>
			{opened &&
				<div className='chatbotWindow'>
					<div className='chatbotMessages'>
						{messages.length ? messages.map((m, i) => (
							<ChatBotMessage key={i} m={m} setAction={setAction} />
						)) : null}
					</div>
					<form className='chatbotInputContainer' onSubmit={() => sendMessage()} action='#'>
						<input
							type='text'
							value={awaitingMessage.message}
							onChange={(e) => setAwaitingMessage({ ...awaitingMessage, message: e.target.value })}
							placeholder='Введите сообщение...'
						/>
						<button onClick={() => sendMessage()}>
							<svg height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg">
								<path d="M4.02 42l41.98-18-41.98-18-.02 14 30 4-30 4z" />
								<path d="M0 0h48v48h-48z" fill="none" />
							</svg>
						</button>
					</form>
				</div>
			}
			<button className='chatbotBtn' onClick={() => setOpened(!opened)}>
				<svg height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg">
					<path d="M0 0h48v48H0V0z" fill="none" />
					<path d="M40 4H8C5.79 4 4 5.79 4 8v36l8-8h28c2.21 0 4-1.79 4-4V8c0-2.21-1.79-4-4-4zm0 28H12l-4 4V8h32v24z" />
				</svg>
			</button>
		</>
	)
}

export default ChatBot