import express from 'express'; 
import { join } from 'path'; 

const app = express(); 

const SERVER_PORT_NUMBER = process.env.PORT || 8086; 

app.use(express.static(process.cwd() + '/dist'));
app.use(express.static(process.cwd() + '/build'));

app.get('/', (req, res) => {  // eslint-disable-line no-unused-vars 

	res.sendFile(join(process.cwd(), '/build', 'index.html')); 

}); 

app.listen(SERVER_PORT_NUMBER, () => global.console.log(`Two-Blocks app listening on port ${SERVER_PORT_NUMBER}`));
