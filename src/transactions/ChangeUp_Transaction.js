'use strict'

import {jsTPS_Transaction} from '../common/jsTPS';
export default class ChangeUp_Transaction extends jsTPS_Transaction{
  constructor(initApp,id){
    super();
    this.app = initApp;
    this.id = id
  }


  doTransaction(){
    this.app.moveUp(this.id);
  }

  undoTransaction(){
    this.app.moveDown(this.id);
  }
} 