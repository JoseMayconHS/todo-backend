import express from 'express'

const app = express()

app.get('/', (req, res) => {
	res.send('Docker OK')
})

app.listen(5000, () => {
	console.log('Server running at 5000')
})
