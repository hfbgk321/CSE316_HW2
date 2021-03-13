'use strict'

import {jsTPS_Transaction} from '../common/jsTPS';
export default class ChangeStatus_Transaction extends jsTPS_Transaction{
  constructor(initApp, previous_status, new_status, item_id){
    super();
    this.app = initApp;
    this.previous_status = previous_status;
    this.new_status = new_status;
    this.item_id = item_id;
  }


  doTransaction(){
    this.app.changeStatus(this.item_id, this.new_status);
  }

  undoTransaction(){
    this.app.changeStatus(this.item_id,this.previous_status);
  }
} 