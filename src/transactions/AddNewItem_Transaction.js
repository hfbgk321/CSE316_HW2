import {jsTPS_Transaction} from '../common/jsTPS.js';


export default class AddNewItem_Transaction extends jsTPS_Transaction{
  constructor(intitApp){
    super();
    this.app = intitApp;

  }

  doTransaction(){
    debugger;
    if(this.itemAdded!=null){
      this.app.addItemToList(this.itemAdded);
    }else{
      this.itemAdded = this.app.addNewListItemToList();
    }
  }

  undoTransaction(){
      this.app.removeItemFromList(this.itemAdded.id);
  }
}