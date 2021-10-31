class Player{
  constructor(_index,_name="",_room){
    this.index = _index;
    this.name = _name;
    this.room = _room;
    this.id_channel ='';
    this.pos={x:0.0,y:0.0,z:0.0}
    this.rot={x:0.0,y:0.0,z:0.0}
    this.life = 1000;
    this.ship ="";
  }

  
}

export default Player;
