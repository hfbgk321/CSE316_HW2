// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import React, { Component } from 'react';
import testData from './test/testData.json'
import jsTPS from './common/jsTPS.js'

import ChangeTask_Transaction from './transactions/ChangeTask_Transaction.js'
import ChangeDueDate_Transaction from './transactions/ChangeDueDate_Transaction';
import ChangeStatus_Transaction from './transactions/ChangeStatus_Transaction';
import ChangeUp_Transaction from './transactions/ChangeUp_Transaction';
import ChangeDown_Transaction from './transactions/ChangeDown_Transaction';
import AddNewItem_Transaction from './transactions/AddNewItem_Transaction';
import DeleteItem_Transaction from './transactions/DeleteItem_Transaction';

// THESE ARE OUR REACT COMPONENTS
import Navbar from './components/Navbar'
import LeftSidebar from './components/LeftSidebar'
import Workspace from './components/Workspace'

{/*import ItemsListHeaderComponent from './components/ItemsListHeaderComponent'
import ItemsListComponent from './components/ItemsListComponent'
import ListsComponent from './components/ListsComponent'
*/}
class App extends Component {
  constructor(props) {
    // ALWAYS DO THIS FIRST
    super(props);

    // DISPLAY WHERE WE ARE
    // console.log("App constructor");

    // MAKE OUR TRANSACTION PROCESSING SYSTEM
    this.tps = new jsTPS();

    // CHECK TO SEE IF THERE IS DATA IN LOCAL STORAGE FOR THIS APP
    let recentLists = localStorage.getItem("recentLists");
    // console.log("recentLists: " + recentLists);
    if (!recentLists) {
      recentLists = JSON.stringify(testData.toDoLists);
      localStorage.setItem("toDoLists", recentLists);
    }
    recentLists = JSON.parse(recentLists);

    // FIND OUT WHAT THE HIGHEST ID NUMBERS ARE FOR LISTS
    let highListId = -1;
    let highListItemId = -1;
    for (let i = 0; i < recentLists.length; i++) {
      let toDoList = recentLists[i];
      if (toDoList.id > highListId) {
        highListId = toDoList.id;
      }
      for (let j = 0; j < toDoList.items.length; j++) {
        let toDoListItem = toDoList.items[j];
        if (toDoListItem.id > highListItemId)
        highListItemId = toDoListItem.id;
      }
    };

    // SETUP OUR APP STATE
    this.state = {
      toDoLists: recentLists,
      currentList: {items: []},
      nextListId: highListId+1,
      nextListItemId: highListItemId+1,
      useVerboseFeedback: true
    }
  }

  redo = () =>{
    // console.log(`hasRedo; ${this.tps.hasTransactionToRedo()}`)
    if(this.tps.hasTransactionToRedo()){
      this.tps.doTransaction();
      //add check undo and redo
    }
    // console.log(this.tps.transactions);
    return {
      hasRedo:this.tps.hasTransactionToRedo(),
      hasUndo: this.tps.hasTransactionToUndo()
    }
  }
  undo = () =>{
    // console.log(`hasUndo: ${this.tps.hasTransactionToUndo()}`)
    if(this.tps.hasTransactionToUndo()){
      this.tps.undoTransaction();
      //add check undo redo
    }
    return {
      hasRedo:this.tps.hasTransactionToRedo(),
      hasUndo: this.tps.hasTransactionToUndo()
    }
  }

  // WILL LOAD THE SELECTED LIST
  loadToDoList = (toDoList) => {
    // console.log("loading " + toDoList);

    // MAKE SURE toDoList IS AT THE TOP OF THE STACK BY REMOVING THEN PREPENDING
    const nextLists = this.state.toDoLists.filter(testList =>
      testList.id !== toDoList.id
    );
    nextLists.unshift(toDoList);

    this.setState({
      toDoLists: nextLists,
      currentList: toDoList
    });
  }

  addNewList = () => {
    let newToDoListInList = [this.makeNewToDoList()];
    let newToDoListsList = [...newToDoListInList, ...this.state.toDoLists];
    let newToDoList = newToDoListInList[0];

    // AND SET THE STATE, WHICH SHOULD FORCE A render
    this.setState({
      toDoLists: newToDoListsList,
      currentList: newToDoList,
      nextListId: this.state.nextListId+1
    }, this.afterToDoListsChangeComplete);
  }

  exitCurrentList = () =>{
    this.setState({currentList: {items: []}});
  }

  makeNewToDoList = () => {
    let newToDoList = {
      id: this.state.nextListId,
      name: 'Untitled',
      items: []
    };
    return newToDoList;
  }

  makeNewToDoListItem = () =>  {
    let newToDoListItem = {
      id: this.state.nextListItemId, // added not sure tho
      description: "No Description",
      dueDate: "none",
      status: "incomplete"
    };
    this.setState({
      nextListItemId: this.state.nextListItemId+1
    })
    return newToDoListItem;
  }

  addNewListItemToList = () =>{
    let newItem = this.makeNewToDoListItem();
    let newInfo = {
      id : this.state.currentList.id,
      items : [...this.state.currentList.items,newItem],
      name: this.state.currentList.name
    }
    this.setState({currentList: newInfo},this.afterToDoListsChangeComplete);
    return newItem;
  }

  deleteItemTransaction = (item, position) =>{
    let transaction = new DeleteItem_Transaction(this,item,position);
    this.tps.addTransaction(transaction);
  }

  removeItemInPosition = (position) =>{
    let newCurrList = [];
    let currList = this.state.currentList.items;

    for(let x = 0; x< currList.length;x++){
      if(x == position){
        continue;
      }else{
        newCurrList.push(currList[x]);
      }
    }

    let newInfo = {
      id : this.state.currentList.id,
      items: [...newCurrList],
      name: this.state.currentList.name
    }

    this.setState({
      currentList: newInfo
    },this.afterToDoListsChangeComplete);
  }

  addItemToPosition = (item, position) =>{
    let newCurrList = [];

    let currList = this.state.currentList.items;
    let found = false;
    for(let x = 0; x< currList.length;x++){
      if(x ==  position){
        newCurrList.push(item);
        newCurrList.push(currList[x]);
        found = true;
      }else{
        newCurrList.push(currList[x]);
      }
    }
    if(!found){
      newCurrList.push(item);
    }

    let newInfo = {
      id: this.state.currentList.id,
      items: [...newCurrList],
      name: this.state.currentList.name
    }

    this.setState({
      currentList: newInfo
    },this.afterToDoListsChangeComplete);
  }


  addNewItemTransaction = () =>{
    let transaction = new AddNewItem_Transaction(this);
    this.tps.addTransaction(transaction);
  }

  addItemToList = (item) =>{
    let currList = this.state.currentList.items;
    currList.push(item);

    let newInfo = {
      id: this.state.currentList.id,
      items: [...currList],
      name: this.state.currentList.name
    }

    this.setState({
      currentList: newInfo
    },this.afterToDoListsChangeComplete)
  }

  removeItemFromList = (id) =>{
    let newCurrList = [];
    let currList = this.state.currentList.items;

    for(let x = 0; x< currList.length;x++){
      if(currList[x].id == id){
        continue;
      }else{
        newCurrList.push(currList[x]);
      }
    }

    let newInfo = {
      id: this.state.currentList.id,
      items: [...newCurrList],
      name: this.state.currentList.name
    }

    this.setState({
      currentList: newInfo
    },this.afterToDoListsChangeComplete)
  }

  

  // THIS IS A CALLBACK FUNCTION FOR AFTER AN EDIT TO A LIST
  afterToDoListsChangeComplete = () => {
    let currList = this.state.currentList;
    // console.log("App updated currentToDoList: " + this.state.currentList);
    // console.log(this.state.currentList);
    // WILL THIS WORK? @todo
    let oldCurrentList = this.state.toDoLists.filter((list) => {
      return list.id !== this.state.currentList.id;
    })
    
  
    oldCurrentList.unshift(this.state.currentList);

    this.setState({
      toDoLists: oldCurrentList
    },() =>{
      let toDoListsString = JSON.stringify(this.state.toDoLists);
      localStorage.setItem("recentLists", toDoListsString);
      // console.log(this.state.toDoLists);
    })
  }

  deleteCurrentList = () =>{
    let newTodoLists = this.state.toDoLists.filter((list) =>{
      return list.id != this.state.currentList.id;
    })

    this.setState({
      currentList: {items: []},
      toDoLists: newTodoLists
    },() =>{
      let newToDoListsData = JSON.stringify(this.state.toDoLists);
      localStorage.setItem("recentLists",newToDoListsData);
    })
  }


  changeCurrentListName = (new_name) =>{
    let currList = this.state.currentList;
    currList.name = new_name;

    this.setState({
      currentList:currList
    },this.afterToDoListsChangeComplete);
  }

  changeNewDownPositionTransaction = (id) =>{
    let transaction = new ChangeDown_Transaction(this,id);
    this.tps.addTransaction(transaction);
  }


  changeNewUpPositionTransaction = (id)  =>{
    let transaction = new ChangeUp_Transaction(this,id);
    this.tps.addTransaction(transaction);
  }

  moveUp = (id) =>{

    //assuming the first and last tasks cant be moved up or down
    let currList = this.state.currentList.items;
    for(let x  = 0; x< currList.length;x++){
      if(x == 0 && currList[x].id == id) break;
      if(currList[x].id == id){
        let tempItem =  currList[x];
        currList[x] = currList[x-1];
        currList[x-1] = tempItem;
        break;
      }
    }

    let newInfo = {
      id : this.state.currentList.id,
      items : [...currList],
      name: this.state.currentList.name
    }
    

    this.setState({
      currentList : newInfo
    },
      this.afterToDoListsChangeComplete);
  }

  moveDown = (id) =>{
    //assuming the first and last tasks cant be moved up or down
    let currList = this.state.currentList.items;
    for(let x  = 0; x< currList.length;x++){
      if(x == currList.length-1 && currList[x].id == id) break;
      if(currList[x].id == id){
        let tempItem =  currList[x];
        currList[x] = currList[x+1];
        currList[x+1] = tempItem;
        break;
      }
    }

    let newInfo = {
      id : this.state.currentList.id,
      items : [...currList],
      name: this.state.currentList.name
    }
    this.setState({
      currentList : newInfo
    },this.afterToDoListsChangeComplete);
  }

  changeNewStatusTransaction = (previous_status, new_status, id) =>{
    let transaction = new ChangeStatus_Transaction(this, previous_status,new_status, id);
    this.tps.addTransaction(transaction);
  }


  changeStatus =(id, new_status) => {
    let tempList = [];
    let currItems = this.state.currentList.items;
    for(let x = 0; x< currItems.length;x++){
      if(currItems[x].id == id){
        currItems[x].status = new_status;
        tempList.push(currItems[x]);
      }else{
        tempList.push(currItems[x]);
      }
    }

    let newInfo = {
      id : this.state.currentList.id,
      items : [...tempList],
      name: this.state.currentList.name
    }
    // console.log('heres the new info');
    // console.log(newInfo);
    

    this.setState({
      currentList : newInfo
    },
      this.afterToDoListsChangeComplete)
  }

  changeNewDueDateTransaction = (previous_duedate, new_duedate, id) => {
    let transaction = new ChangeDueDate_Transaction(this, previous_duedate,new_duedate,id);
    this.tps.addTransaction(transaction);
  }

  changeDueDate = (id, new_duedate) => {
    debugger;
    let tempList = [];
    let currItems = this.state.currentList.items;
    for(let x = 0; x< currItems.length;x++){
      if(currItems[x].id == id){
        currItems[x].due_date = new_duedate;
        tempList.push(currItems[x]);
      }else{
        tempList.push(currItems[x]);
      }
    }

    let newInfo = {
      id : this.state.currentList.id,
      items : [...tempList],
      name: this.state.currentList.name
    }
    // console.log('heres the new info');
    // console.log(newInfo);
    

    this.setState({
      currentList : newInfo
    },
      this.afterToDoListsChangeComplete)
  }

  changeNewDescriptionTransaction = (previous_description, new_description,id) => {
    let transaction = new ChangeTask_Transaction(this,previous_description, new_description,id);
    this.tps.addTransaction(transaction);
  }


  changeDescription = (id,new_description) =>{
    let tempList = [];
    let currItems = this.state.currentList.items;
    for(let x = 0; x< currItems.length;x++){
      if(currItems[x].id == id){
        currItems[x].description = new_description;
        tempList.push(currItems[x]);
      }else{
        tempList.push(currItems[x]);
      }
    }

    let newInfo = {
      id : this.state.currentList.id,
      items : [...tempList],
      name: this.state.currentList.name
    }
    

    this.setState({
      currentList : newInfo
    },
      this.afterToDoListsChangeComplete)
  }

  render() {
    let items = this.state.currentList.items;
    // console.log(items);
    return (
      <div id="root">
        <Navbar />
        <LeftSidebar 
          toDoLists={this.state.toDoLists}
          loadToDoListCallback={this.loadToDoList}
          addNewListCallback={this.addNewList}
          changeCurrentListNameCallBack ={this.changeCurrentListName}
        />
        <Workspace 
        currentList= {this.state.currentList} 
        toDoListItems={items} addNewItemToList = {this.addNewListItemToList} 
        undoCallBack = {this.undo} redoCallBack = {this.redo} 
        changeNewDescriptionTransactionCallBack = {this.changeNewDescriptionTransaction}
        changeNewDueDateTransactionCallBack = {this.changeNewDueDateTransaction}
        changeNewStatusTransactionCallBack = {this.changeNewStatusTransaction}
        changeNewUpPositionTransactionCallBack = {this.changeNewUpPositionTransaction}
        changeNewDownPositionTransactionCallBack ={this.changeNewDownPositionTransaction}
        addNewItemTransactionCallBack = {this.addNewItemTransaction}
        deleteItemTransactionCallBack ={this.deleteItemTransaction}
        exitCurrentListCallBack = {this.exitCurrentList}
        deleteCurrentListCallBack = {this.deleteCurrentList}
        />
      </div>
    );
  }
}

export default App;