import './ChatBotMessage.css'

const ChatBotMessage = ({ m, setAction }) => {

	console.log(m)

	const { from, type, message } = m

	const renderMessage = (type, message) => {
		switch (type) {
			case 'text':
				return (<span>{message}</span>)
			case 'buttons':
				return message.map((btn, i) => (
					<button onClick={() => setAction(btn.action)} key={i}>{btn.text}</button>
				))
			default:
				break;
		}
	}

	return (
		<div className={`message ${from === 'server' ? 'messageServer' : 'messageClient'}`}>
			{renderMessage(type, message)}
		</div>
	)
}

export default ChatBotMessage