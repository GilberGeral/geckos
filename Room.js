

class Room {
  constructor(_index){
    this.index = _index;
    this.max_players = 2;
    this.players = [];
    this.players_public = [];
    this.ids = [];
  }

  loop(){
    if( this.players.length < 1 )return;
    //calcular TODA la logica del juego

  }

  sync(_chanel){
    //sincronizar con los clientes... 
    if( this.players.length < 1 )return;
    //creamos el array con la info publica de cada player... 
    _channel.forward(_channel.roomId).emit('chat message', 'Hello!')

    // for (const [key, value] of Object.entries(this.players)) {
    //   console.log(key, value);

    // }

  }
}

export default Room;
