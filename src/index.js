import config from './config/config.js';
import app from './app.js';

app.listen(config.PORT, function(){
    console.log(`escuchando en el puerto: ${config.PORT}`);
});


//comando para correr el servidor
// npm run dev == desarrollo
// npm run prod == produccion