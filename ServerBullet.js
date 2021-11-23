class ServerBullet{
  constructor(_index){
    this.index = _index;
    this.percent = 0.0;
    this.pos = [0.0,0.0,0.0,0.0];//inix,iniy, endx,endy
    this.mode = false;

    this.step = 0.0075;
    this.key = '';
    this.LIMIT = 1.2;
    this.sinc = true;
    this.pos_actual = {x:0.0,z:0.0}
  }

  kill(){
    this.mode = false;    
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
    this.sinc = false;
    this.distanceAtAny = 0.0;
    this.getPositionAlongTheLine();
  }

  getPositionAlongTheLine() {
    this.pos_actual.x = this.pos[0] * (1.0 - this.percent) + this.pos[2] * this.percent;
    this.pos_actual.z = this.pos[1] * (1.0 - this.percent) + this.pos[3] * this.percent;
    // console.log( "pos de bala "+this.index+", x = "+this.pos_actual.x +", z = "+this.pos_actual.z );
  }

  calculateDistance(_px,_py,_rad){

    let dx=this.pos_actual.x - _px;
    let dy=this.pos_actual.z - _py;
    this.distanceAtAny = (Math.sqrt(dx*dx+dy*dy)-(_rad));

  }

  update(_asteroids){
    if( !this.mode )return;
    this.percent += this.step;
    this.getPositionAlongTheLine();
    // console.log( "bala "+this.index+", % es "+this.percent );
    if( this.percent > this.LIMIT){
      this.kill();
      return;
    }

    //colision con asteroides... 
    // console.log( "asteroids" );
    // console.log( _asteroids );

    for(let _v=0; _v < _asteroids.length; _v+=1 ){
      if( _asteroids[_v].mode ){//si el asteroide esta vivo 
        //calcular distancia entre el y yo... 
        this.calculateDistance(_asteroids[_v].px,_asteroids[_v].pz,_asteroids[_v].scl);
        // console.log( "distancia a asteroide "+_v+" es "+this.distanceAtAny.toFixed(2) );
        if( this.distanceAtAny < _asteroids[_v].scl){
          this.kill();
          _asteroids[_v].sinc=false;
          _asteroids[_v].mode=false;
          //matar al asteroide... 
        }
      }
    }
  }
  
}

export default ServerBullet;
