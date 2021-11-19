class BalaServer{
  constructor(_index){
    this.index = _index;
    this.percent = 0.0;
    this.pos = [0.0,0.0,0.0,0.0];//inix,iniy, endx,endy
    this.mode = false;

    this.step = 0.0075;
    this.key = '';
    this.LIMIT = 1.2;
    
    this.pos_actual = {x:0.0,z:0.0}
  }
  kill(){
    this.mode = false;
    this.percent = 0.0;
    this.pos = [0.0,0.0,0.0,0.0];//inix,iniy, endx,endy
    this.key = '';
  }

  shoot(_dt){
    this.mode = true;
    this.percent = 0.0;
    this.pos = {x:0.0,z:0.0}
  }

  getPositionAlongTheLine(x1, y1, x2, y2, percentage) {
    this.pos_actual.x = this.pos[0] * (1.0 - this.percent) + this.pos[2] * this.percent;
    this.pos_actual.z = this.pos[1] * (1.0 - this.percent) + this.pos[3] * this.percent;
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

export default BalaServer;
