'use strict'

import {jsTPS_Transaction} from '../common/jsTPS';
export default class DeleteItem_Transaction extends jsTPS_Transaction{
  constructor(initApp,item,position){
    super();
    this.app = initApp;
    this.position = position;
    this.item = item;
  }


  doTransaction(){
    this.app.removeItemInPosition(this.position);
  }

  undoTransaction(){
    this.app.addItemToPosition(this.item,this.position);
  }
} 