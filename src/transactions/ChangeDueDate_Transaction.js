'use strict'

import {jsTPS_Transaction} from '../common/jsTPS';
export default class ChangeDueDate_Transaction extends jsTPS_Transaction{
  constructor(initApp, previous_duedate, new_duedate, item_id){
    super();
    this.app = initApp;
    this.previous_duedate = previous_duedate;
    this.new_duedate = new_duedate;
    this.item_id = item_id;
  }


  doTransaction(){
    this.app.changeDueDate(this.item_id, this.new_duedate);
  }

  undoTransaction(){
    this.app.changeDueDate(this.item_id,this.previous_duedate);
  }
} 