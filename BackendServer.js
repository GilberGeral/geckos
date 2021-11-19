import geckos from '@geckos.io/server';
import Player from './Player.js';
import BalaServer from './BalaServer.js';
import Room from './Room.js';

const io = geckos();

const type_msg={
  DOOR : "door",
  LOGIN : "login",
  UPDATE : "update",
  STOP : "stop",
  EXIT : "exit",
  SYNC:"sinc",
  LIST:"list_players",
  SHOOT:"shoot"
}
const MAX_BULLETS = 200;

const type_shoot = {BULLET:"1",ROCKET:"2",MISSILE:"3",MINE:"4"};


const ships =["arpia","ast_1","ast_2","ast_3","ast_4","ast_5","ast_6", "flea", "gunner", "hawk", "raptor", "wasp" ];

const max_rooms = 1;
const players_per_room = 2;
let rooms =[];
for(let _g=0; _g < max_rooms; _g+=1){
  rooms[_g] = new Room(_g);//array de rooms
}
let gb_bullets =[];
for(let _t =0; _t < MAX_BULLETS; _t+=1){
  gb_bullets[_t] = new BalaServer(_t);   
}

let gb_gamers=[];
gb_gamers[0]={"nm":"pablo gonzales","user":"pablito", "pass":"1234","color":"1,0,0","ship":"raptor"};
gb_gamers[1]={"nm":"juan alimaña","user":"juanito", "pass":"1234","color":"0,1,0","ship":"wasp"};

function addPlayer( _a_key,_ch_id,_color='255,26,58',room_id=0,_ship="raptor",_nombre="ND",_px=0,_pz=0){
  //por defecto SOLO una room
  rooms[0].players.push({key:_a_key,ch:_ch_id,id_room:room_id,color:_color,ship:_ship,name:_nombre,inix:_px,iniz:_pz});
  rooms[0].players_public.push({key:_a_key,px:_px,py:0.0,pz:_pz,rx:0.0,ry:0.0,rz:0.0,color:_color,ship:_ship,lf:0.0});
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
      rooms[0].players_public[_p].lf= _dt.lf;
      break;
    }
    
  }
  
  // console.log( rooms[0].players_public[_dt.c_key] );
}

function random(_min=1,_max=10){
  return parseInt(Math.random() * (_max - _min) + _min);
}


io.listen(8001); // default port is 9208

  io.onConnection(channel => {
    console.log( "nueva conexion id chanel "+channel.id );

    channel.onDisconnect(() => {
      console.log(`${channel.roomId} got disconnected`);
    });

    channel.on(type_msg.DOOR, data => {
      // console.log(`${channel.id} arrived data ** `);
      let _data ={"id_ch":channel.id,"mode":"guest"};
      // io.room(channel.roomId).emit(type_msg.DOOR, JSON.stringify(_data));
      channel.emit(type_msg.DOOR, JSON.stringify(_data));
    });

    channel.on(type_msg.LOGIN, data => {
      console.log( data );

      let _data = JSON.parse(data);
      console.log( " \n user login "+_data.u);
      
      let _res={"done":false,"level":"1","nombre":"","ship":"main","color":"","id_room":"A","a_key":"","ship":"","inix":"","iniz":""};
      let _px = random();
      let _pz = random();

      // gb_gamers.forEach(_g => {
        // if( _g.user == _data.u & _g.pass == _data.p ){
        // if( 1 == 1){
          _res.done = true;
          
          _res.nombre = _data.u;
          _res.ship = _data.shp;
          _res.color = _data.c;
          _res.a_key = (Math.random() + 1).toString(36).substring(7);

          _res.id_room = addPlayer(_res.a_key,channel.id,_res.color,channel.roomId,_res.ship,_res.nombre,_px,_pz);
          _res.inix = _px;
          _res.iniz = _pz;
          // console.log( _res );
          // return;
          // break;
        // }
      // });

      // io.room(channel.roomId).emit('login', JSON.stringify(_res));
      channel.emit(type_msg.LOGIN, JSON.stringify(_res));
      // io.emit(type_msg.SYNC, JSON.stringify(rooms[0].players_public));
      let _list =[];
      console.log( "players actuales " );
      console.log( rooms[0].players );
      rooms[0].players.forEach(_pl => {
        if( _pl.name != "ND" ){
          _list.push({key:_pl.key,color:_pl.color,ship:_pl.ship,name:_pl.name,u:0,px:_pl.inix,pz:_pl.iniz});
        }        
      });

      setTimeout(() => {
        io.emit(type_msg.LIST,JSON.stringify(_list) );
      }, 200);
      

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

    channel.on(type_msg.SHOOT, data => {
      let _dtsh = JSON.parse(data);
      console.log( " llego de shoot " );
      console.log( _dtsh );
      for(let _p=0;  _p < MAX_BULLETS; _p+=1){
        //TODO: aqui tipo d disparo, ojo
        if( !gb_bullets[_p].mode ){
          gb_bullets[_p].shoot(_dtsh);
        }
      }
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