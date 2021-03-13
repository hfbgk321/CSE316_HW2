'use strict'

import {jsTPS_Transaction} from '../common/jsTPS.js';


export default class ChangeTask_Transaction extends jsTPS_Transaction{
  constructor(initApp, previous_description, new_description, item_id){
    super();
    this.app = initApp;
    this.previous_description = previous_description;
    this.new_description = new_description;
    this.item_id = item_id;
  }

  doTransaction(){
    console.log('doing this transaction');
   this.app.changeDescription(this.item_id,this.new_description);
  }

  undoTransaction(){
    //removing item from the list
    this.app.changeDescription(this.item_id,this.previous_description);
  }
}