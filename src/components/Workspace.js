// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import React, { Component } from 'react'
import ToDoItem from './ToDoItem'
import Undo from '@material-ui/icons/Undo';
import Redo from '@material-ui/icons/Redo';
import AddBox from '@material-ui/icons/AddBox';
import Delete from '@material-ui/icons/Delete';
import Close from '@material-ui/icons/Close';

import Modal from './Modal';

class Workspace extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            hasUndo: false,
            hashRedo: false,
            visibleModal : false,
        }

        this.checkCTRLZY = this.checkCTRLZY.bind(this);
        
    }


    componentDidMount(){
        document.addEventListener("keydown",this.checkCTRLZY,false);
    }

    componentWillUnmount(){
        document.removeEventListener("keydown",this.checkCTRLZY,false);
    }

    checkCTRLZY(event){

        if(event.ctrlKey && event.keyCode == 90){
            // console.log('ctrlz');
            this.props.undoCallBack();
        }

        if(event.ctrlKey && event.keyCode == 89){
            // console.log('ctrly')
            this.props.redoCallBack();
        }

    }

    handleAddNewItem = () => {
        this.props.addNewItemTransactionCallBack();
    }

    handleUndo = () =>{
        this.props.undoCallBack();
    }

    handleRedo = () =>{
        this.props.redoCallBack();
    }

    handleCloseList = () =>{
        this.props.exitCurrentListCallBack();
    }

    handleTriggerModal = () =>{
        
        this.setState({visibleModal : true},() =>{
            // console.log('triggering modal');
            // console.log(this.state.visibleModal);
        });
    }

    showModal = () =>{
        this.setState({
            visibleModal: false
        })
    }

    handleDeleteList = () =>{
        // console.log('deleting list');
        this.showModal();
        this.props.deleteCurrentListCallBack();
    }

    render() {
        return (
            <div id="workspace">
                <div id="todo-list-header-card" className="list-item-card">
                    <div id="task-col-header" className="item-col todo-button">Task</div>
                    <div id="date-col-header" className="item-col todo-button">Due Date</div>
                    <div id="status-col-header" className="item-col todo-button">Status</div>
                    <div className="item-col" display="flex" flexdirection="row" flexwrap="nowrap">
                        <Undo id="undo-button" className="list-item-control material-icons todo-button" onClick ={this.handleUndo} style ={{color : this.props.hasUndo ? "white": "black", pointerEvents: this.props.hasUndo ? "auto" : "none"}}/>
                        <Redo id="redo-button" className="list-item-control material-icons todo-button"  onClick = {this.handleRedo} style ={{color : this.props.hasRedo ? "white": "black", pointerEvents: this.props.hasRedo ? "auto" : "none"}}/>
                        <AddBox id="add-item-button" className="list-item-control material-icons todo-button" onClick ={this.handleAddNewItem} style ={{color : this.props.hasCurrentList ? "white": "black", pointerEvents: this.props.hasCurrentList ? "auto" : "none"}}/>
                        <Delete id="delete-list-button" className="list-item-control material-icons todo-button" onClick = {this.handleTriggerModal} style ={{color : this.props.hasCurrentList ? "white": "black", pointerEvents: this.props.hasCurrentList ? "auto" : "none"}}/>
                        <Close id="close-list-button" className="list-item-control material-icons todo-button" onClick = {this.handleCloseList} style ={{color : this.props.hasCurrentList ? "white": "black", pointerEvents: this.props.hasCurrentList ? "auto" : "none"}}/>
                    </div>
                </div>
                <div id="todo-list-items-div">
                    <Modal visible = {this.state.visibleModal} onClose = {this.showModal} onDelete = {this.handleDeleteList}/>
                    {
                        this.props.toDoListItems.map((toDoListItem,index) => (
                        <ToDoItem
                            key={toDoListItem.id}
                            positionInList = {index}
                            lastPosition = {this.props.toDoListItems.length}
                            toDoListItem={toDoListItem}     // PASS THE ITEM TO THE CHILDREN
                            changeNewDescriptionTransactionCallBack = {this.props.changeNewDescriptionTransactionCallBack}
                            changeNewDueDateTransactionCallBack ={this.props.changeNewDueDateTransactionCallBack}
                            changeNewStatusTransactionCallBack ={this.props.changeNewStatusTransactionCallBack}
                            changeNewUpPositionTransactionCallBack = {this.props.changeNewUpPositionTransactionCallBack}
                            changeNewDownPositionTransactionCallBack = {this.props.changeNewDownPositionTransactionCallBack}
                            deleteItemTransactionCallBack ={this.props.deleteItemTransactionCallBack}
                        />))
                    }
                </div>
                <br />
            </div>
        );
    }
}

export default Workspace;