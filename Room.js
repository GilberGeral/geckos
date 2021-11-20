
import ServerBullet from './ServerBullet.js';
class Room {
  constructor(_index){
    this.index = _index;
    this.max_players = 2;
    this.players = [];
    this.players_public = [];
    this.ids = [];
    this.bullets =[];
    this.asteroids =[];
    this.LIMIT_WORLD = 500;
    
    this.ast=["ast_1","ast_2","ast_3","ast_4","ast_5","ast_6" ];

    this.colours = ["cafe","azul","morado","verde"];
    
  }
  random(_min,_max){
    return parseInt(Math.random() * (_max - _min) + _min);
  }

  loop(){
    if( this.players.length < 1 )return;
    //calcular TODA la logica del juego

  }

  makeBullets(MAX_BULLETS){
    for(let _t =0; _t < MAX_BULLETS; _t+=1){
      this.bullets[_t] = new ServerBullet(_t);   
    }
  }

  makeAsteroids(MAX_ASTEROIDS){
    for(let _j=0; _j < MAX_ASTEROIDS; _j+=1){
      this.asteroids[_j] = {index:_j,mode:true,scl:this.random(1,3),clr:this.random(0,3),type:this.ast[this.random(0,5)],px:this.random(-this.LIMIT_WORLD,this.LIMIT_WORLD),pz:this.random(-this.LIMIT_WORLD,this.LIMIT_WORLD)};
    }
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
