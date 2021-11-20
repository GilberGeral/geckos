class ServerBullet{
  constructor(_index){
    this.index = _index;
    this.percent = 0.0;
    this.pos = [0.0,0.0,0.0,0.0];//inix,iniy, endx,endy
    this.mode = false;

    this.step = 0.0075;
    this.key = '';
    this.LIMIT = 1.2;
    this.sinc = false;
    this.pos_actual = {x:0.0,z:0.0}
  }

  kill(){
    this.mode = false;
    this.percent = 0.0;
    this.pos = [0.0,0.0,0.0,0.0];//inix,iniy, endx,endy
    this.key = '';
    this.sinc = false;
  }

  shoot(_dt){
    this.mode = true;
    this.percent = 0.0;
    this.pos[0] = parseFloat(_dt.x1);
    this.pos[1] = parseFloat(_dt.y1);
    this.pos[2] = parseFloat(_dt.x2);
    this.pos[3] = parseFloat(_dt.y2);
    this.key = _dt.key;
    this.angle = parseFloat(_dt.an);
    // this.pos_actual.x = 0.0;
    // this.pos_actual.z = 0.0;
    this.getPositionAlongTheLine();
  }

  getPositionAlongTheLine() {
    this.pos_actual.x = this.pos[0] * (1.0 - this.percent) + this.pos[2] * this.percent;
    this.pos_actual.z = this.pos[1] * (1.0 - this.percent) + this.pos[3] * this.percent;
    // console.log( "pos de bala "+this.index+", x = "+this.pos_actual.x +", z = "+this.pos_actual.z );
  }

  update(){
    if( !this.mode )return;
    this.percent += this.step;
    this.getPositionAlongTheLine();
    if( this.percent > this.LIMIT){
      this.kill();
    }
  }
  
}

export default ServerBullet;
