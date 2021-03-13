// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import React, { Component } from 'react'
import ToDoItem from './ToDoItem'
import Undo from '@material-ui/icons/Undo';
import Redo from '@material-ui/icons/Redo';
import AddBox from '@material-ui/icons/AddBox';
import Delete from '@material-ui/icons/Delete';
import Close from '@material-ui/icons/Close';

class Workspace extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            hasUndo: false,
            hashRedo: false
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
        let undoRedoInfo = this.props.undoCallBack();
        this.setState({hasUndo: undoRedoInfo.hasUndo, hasRedo: undoRedoInfo.hasRedo});
    }

    handleRedo = () =>{
        let undoRedoInfo = this.props.redoCallBack();
        this.setState({hasUndo: undoRedoInfo.hasUndo, hasRedo: undoRedoInfo.hasRedo});
    }

    render() {
        return (
            <div id="workspace">
                <div id="todo-list-header-card" className="list-item-card">
                    <div id="task-col-header" className="item-col todo-button">Task</div>
                    <div id="date-col-header" className="item-col todo-button">Due Date</div>
                    <div id="status-col-header" className="item-col todo-button">Status</div>
                    <div className="item-col" display="flex" flexdirection="row" flexwrap="nowrap">
                        <Undo id="undo-button" className="list-item-control material-icons todo-button"  onClick ={this.handleUndo} />
                        <Redo id="redo-button" className="list-item-control material-icons todo-button"  onClick = {this.handleRedo}/>
                        <AddBox id="add-item-button" className="list-item-control material-icons todo-button" onClick ={this.handleAddNewItem}/>
                        <Delete id="delete-list-button" className="list-item-control material-icons todo-button" />
                        <Close id="close-list-button" className="list-item-control material-icons todo-button" />
                    </div>
                </div>
                <div id="todo-list-items-div">
                    {
                        
                        this.props.toDoListItems.map((toDoListItem,index) => (
                        <ToDoItem
                            key={toDoListItem.id}
                            positionInList = {index}
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