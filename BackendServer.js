import geckos from '@geckos.io/server';
import Player from './Player.js';
import Room from './Room.js';

const io = geckos();

const type_msg={
  DOOR : "door",
  LOGIN : "login",
  UPDATE : "update",
  STOP : "stop",
  EXIT : "exit",
  SYNC:"sinc"
}

const max_rooms = 1;
const players_per_room = 2;
let rooms =[];
for(let _g=0; _g < max_rooms; _g+=1){
  rooms[_g] = new Room(_g);//array de rooms
}

let gb_gamers=[];
gb_gamers[0]={"nm":"pablo gonzales","user":"pablito", "pass":"1234"};
gb_gamers[1]={"nm":"pablo gonzales","user":"juanito", "pass":"1234"};

function addPlayer( _a_key, _ch_id,_color='255,26,58',room_id=0){
  //por defecto SOLO una room
  console.log( "ad player key "+_a_key+", room id "+room_id+"" );

  rooms[0].players.push({key:_a_key,ch:_ch_id,id_room:room_id,color:_color});

  rooms[0].players_public.push({key:_a_key,px:0.0,py:0.0,pz:0.0,rx:0.0,ry:0.0,rz:0.0,color:_color});
  console.log( "largo room 0 de players "+rooms[0].players[0].ch );
  return 0;
}

function updatePlayer( _dt ){

  for (let _p = 0; _p < rooms[0].players_public.length; _p++) {
    if( rooms[0].players_public[_p].key == _dt.c_key ){
      rooms[0].players_public[_p].rx= _dt.rx;
      rooms[0].players_public[_p].ry= _dt.ry;
      rooms[0].players_public[_p].rz= _dt.rz;

      rooms[0].players_public[_p].px= _dt.px;
      rooms[0].players_public[_p].py= _dt.py;
      rooms[0].players_public[_p].pz= _dt.pz;
      break;
    }
    
  }
  
  // console.log( rooms[0].players_public[_dt.c_key] );
}



io.listen(8001); // default port is 9208

  io.onConnection(channel => {
    console.log( "nueva conexion id chanel "+channel.id );

    channel.onDisconnect(() => {
      console.log(`${channel.roomId} got disconnected`);
    });

    channel.on(type_msg.DOOR, data => {
      console.log(`${channel.id} arrived data ** `);
      let _data ={"id_ch":channel.id,"mode":"guest"};
      // io.room(channel.roomId).emit(type_msg.DOOR, JSON.stringify(_data));
      channel.emit(type_msg.DOOR, JSON.stringify(_data));
    });

    channel.on(type_msg.LOGIN, data => {
      console.log( data );

      let _data = JSON.parse(data);
      console.log( " \n user login "+_data.u);
      
      let _res={"done":false,"level":"1","nombre":"","ship":"main","color":"049015","id_room":"A","a_key":""};


      gb_gamers.forEach(_g => {
        if( _g.user == _data.u & _g.pass == _data.p ){
          _res.done = true;
          
          _res.nombre = _g.nm;
          _res.a_key = (Math.random() + 1).toString(36).substring(7);;
          _res.id_room = addPlayer(_res.a_key,channel.id,_data.c,channel.roomId);
          // console.log( _res );
          return;
        }
      });

      // io.room(channel.roomId).emit('login', JSON.stringify(_res));
      channel.emit(type_msg.LOGIN, JSON.stringify(_res));
      
    });

    channel.on(type_msg.UPDATE, _msg => {

      let _data = JSON.parse(_msg);

      if( rooms[0].players.length > 0 ){
        updatePlayer(_data);
      }else{
        console.log( "player NO registrado" );
      }
      
      // io.room(channel.roomId).emit('srv_cli', data);
    });

    channel.on(type_msg.STOP, data => {
     
      io.room(channel.roomId).emit('srv_cli', data);
    });

    channel.on(type_msg.EXIT, data => {
      
      io.room(channel.roomId).emit('srv_cli', data);
    });
});

function loop(){
  // rooms[0].sync();
  
  if( rooms[0].players.length > 0 ){    
    // console.log( "debio loop ");
    // io.room( rooms[0].players[0].id_room).emit(type_msg.SYNC, JSON.stringify(rooms[0].players_public));
    // console.log( "a enviar " );
    // console.log( JSON.stringify(rooms[0].players_public) );

    io.emit(type_msg.SYNC, JSON.stringify(rooms[0].players_public));
  }
  
}

setInterval(()=>{
  loop();
},20);