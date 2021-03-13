'use strict'

import {jsTPS_Transaction} from '../common/jsTPS';
export default class ChangeDown_Transaction extends jsTPS_Transaction{
  constructor(initApp,id){
    super();
    this.app = initApp;
    this.id = id
  }


  doTransaction(){
    this.app.moveDown(this.id);
  }

  undoTransaction(){
    this.app.moveUp(this.id);
  }
} 