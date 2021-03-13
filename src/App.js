// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import React, { Component } from 'react';
import testData from './test/testData.json'
import jsTPS from './common/jsTPS.js'

import ChangeTask_Transaction from './transactions/ChangeTask_Transaction.js'
// THESE ARE OUR REACT COMPONENTS
import Navbar from './components/Navbar'
import LeftSidebar from './components/LeftSidebar'
import Workspace from './components/Workspace'
import { LinkTwoTone } from '@material-ui/icons';
{/*import ItemsListHeaderComponent from './components/ItemsListHeaderComponent'
import ItemsListComponent from './components/ItemsListComponent'
import ListsComponent from './components/ListsComponent'
*/}
class App extends Component {
  constructor(props) {
    // ALWAYS DO THIS FIRST
    super(props);

    // DISPLAY WHERE WE ARE
    console.log("App constructor");

    // MAKE OUR TRANSACTION PROCESSING SYSTEM
    this.tps = new jsTPS();

    // CHECK TO SEE IF THERE IS DATA IN LOCAL STORAGE FOR THIS APP
    let recentLists = localStorage.getItem("recentLists");
    console.log("recentLists: " + recentLists);
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
    console.log(`hasRedo; ${this.tps.hasTransactionToRedo()}`)
    if(this.tps.hasTransactionToRedo()){
      console.log('redoing')
      this.tps.doTransaction();
      //add check undo and redo
    }
    console.log(this.tps.transactions);
  }
  undo = () =>{
    console.log(`hasUndo: ${this.tps.hasTransactionToUndo()}`)
    if(this.tps.hasTransactionToUndo()){
      console.log('undoing')
      this.tps.undoTransaction();
      //add check undo redo
    }
    console.log(this.tps.transactions);
  }

  // WILL LOAD THE SELECTED LIST
  loadToDoList = (toDoList) => {
    console.log("loading " + toDoList);

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

  makeNewToDoList = () => {
    let newToDoList = {
      id: this.highListId,
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
    this.setState({currentList: newInfo},() =>{
      console.log(this.state.currentList);
      this.afterToDoListsChangeComplete();
    });
    // console.log(this.state.currentList)
    
    
  }

  

  // THIS IS A CALLBACK FUNCTION FOR AFTER AN EDIT TO A LIST
  afterToDoListsChangeComplete = () => {
    console.log("App updated currentToDoList: " + this.state.currentList);
    console.log(this.state.currentList);
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
      console.log(this.state.toDoLists);
    })
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
    },() =>{
      console.log('setted currentList');
      console.log(this.state.currentList);
      this.afterToDoListsChangeComplete();
    })


  }

  render() {
    let items = this.state.currentList.items;
    return (
      <div id="root">
        <Navbar />
        <LeftSidebar 
          toDoLists={this.state.toDoLists}
          loadToDoListCallback={this.loadToDoList}
          addNewListCallback={this.addNewList}
        />
        <Workspace currentList= {this.state.currentList} toDoListItems={items} addNewItemToList = {this.addNewListItemToList} undoCallBack = {this.undo} redoCallBack = {this.redo} changeNewDescriptionTransactionCallBack = {this.changeNewDescriptionTransaction}/>
      </div>
    );
  }
}

export default App;