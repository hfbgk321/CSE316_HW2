import {jsTPS_Transaction} from '../common/jsTPS.js';


export default class AddNewItem_Transaction extends jsTPS_Transaction{
  constructor(currentList){
    super();
    // this.currentList = currentList;

  }

  doTransaction(){
    // if(this.itemAdded!=null){
    //   this.currentList.items.push(this.itemAdded);
    //   //some sort of callback
    // }else{
    //   //call the add new item function
    // }
  }

  undoTransaction(){
    //removing item from the list
  }
}