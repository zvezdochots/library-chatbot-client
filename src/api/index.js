import axios from 'axios'

const APIURL = 'https://lib.gubkin.ru/api'

const api = axios.create({ baseURL: APIURL })

const loginRequest = async (surname = 'Юницкий', id = '125121') => {
	try {
		const response = await api.post('/Account/Login', JSON.stringify({
			Surname: surname,
			PassId: id
		}), { headers: { 'Content-Type': 'application/json' } })
		console.log('response', response.data.token)
		return response.data
	} catch (error) {
		console.log(error);
		throw error
	}
}

export { loginRequest }