// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import React, { Component } from 'react'
import ReactDOM from "react-dom";
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import Close from '@material-ui/icons/Close';

class ToDoItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hiddenDescription : "none",
            displayDescription: "block",
            hiddenStatus: "none",
            displayStatus:"block",
            hiddenDate: "none",
            displayDate:"block",
            description: this.props.toDoListItem.description,
            status: this.props.toDoListItem.status,
            date: this.props.toDoListItem.due_date
        }

        this.hiddenDescriptionRef = React.createRef(); //used to focus onto the description input 
        this.hiddenDateRef = React.createRef(); // used to focus onto the date
        this.hiddenStatusRef = React.createRef(); // used to focus onto the status

        // DISPLAY WHERE WE ARE
        console.log("\t\t\tToDoItem " + this.props.toDoListItem.id + " constructor");
    }

    componentDidMount = () => {
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tToDoItem " + this.props.toDoListItem.id + " did mount");
    }

    
    // resetProps = () =>{
    //     this.setState({
    //         description: this.props.toDoListItem.description,
    //         status: this.props.toDoListItem.status,
    //         date: this.props.toDoListItem.due_date
    //     })
    // }
    

    componentDidUpdate = () =>{
        console.log('updated');
        console.log(this.state.description);
        if(this.hiddenDescriptionRef.current !==null){ //checks to see if the hidden inputs have appeared
            this.hiddenDescriptionRef.current.focus();
        }
        if(this.hiddenDateRef.current !==null){ 
            this.hiddenDateRef.current.focus();
        }
        if(this.hiddenStatusRef.current !==null){ 
            this.hiddenStatusRef.current.focus();
        }
    }


    handleDescriptionClick = () =>{
        console.log(`Clicked description with id: ${this.props.toDoListItem.id}`); //handles when user clicks on the description part
        this.setState({hiddenDescription :"block",displayDescription:"none"});
    }
    handleDescriptionChange = (event) =>{
        this.setState({description: event.target.value}); //handles when user is changing the description part
    }
    handleDescriptionBlur = () =>{
        this.setState({hiddenDescription: "none",displayDescription:"block"}); //handles when user unselects the 
        if(this.props.toDoListItem.description != this.state.description){
            this.props.changeNewDescriptionTransactionCallBack(this.props.toDoListItem.description, this.state.description,this.props.toDoListItem.id);
        }
    }



    handleDateClick = () =>{
        console.log(`Clicked date with id: ${this.props.toDoListItem.id}`); //handles when the user clicks the date part
        this.setState({displayDate:"none",hiddenDate:"block"});
    }
    handleDateChange = (event) =>{
        console.log(event.target.value);
        this.setState({date:event.target.value}); //handles when user changes the date part
    }
    handleDateBlur = () =>{
        this.setState({hiddenDate: "none",displayDate:"block"}); //handles when user unclicks the date part
        if(this.props.toDoListItem.due_date != this.state.date){
            this.props.changeNewDueDateTransactionCallBack(this.props.toDoListItem.due_date,this.state.date,this.props.toDoListItem.id);
        }
    }


    handleStatusClick = () =>{
        console.log(`Clicked status with id: ${this.props.toDoListItem.id}`); // handles whent he user clicks the status part
        this.setState({displayStatus:"none",hiddenStatus:"block"});
    }
    handleStatusChange = (event) =>{
        console.log(event.target.value);
        this.setState({status : event.target.value});
    }
    handleStatusBlur = () =>{
        this.setState({hiddenStatus:"none",displayStatus:"block"});
        if(this.props.toDoListItem.status != this.state.status){
            this.props.changeNewStatusTransactionCallBack(this.props.toDoListItem.status,this.state.status,this.props.toDoListItem.id);
        }
    }

    render() {
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tToDoItem render");
        let listItem = this.props.toDoListItem;
        let statusType = "status-complete";
        if (listItem.status === "incomplete")
            statusType = "status-incomplete";

        return (
            <div id={'todo-list-item-' + listItem.id} className='list-item-card'>
                <div className='item-col task-col' onClick ={this.handleDescriptionClick} style ={{display:this.state.displayDescription}}>{this.props.toDoListItem.description}</div>
                <input type = "text" name ="hidden_description_input" value = {this.state.description} onChange = {this.handleDescriptionChange} style ={{display:this.state.hiddenDescription}} onBlur ={this.handleDescriptionBlur} ref = {this.hiddenDescriptionRef}/>
                <div className='item-col due-date-col' onClick ={this.handleDateClick} style = {{display:this.state.displayDate}}>{this.props.toDoListItem.due_date}</div>
                <input type ="date" name = "hidden_date_input" value ={this.state.date} style ={{display: this.state.hiddenDate}} onChange ={this.handleDateChange} onBlur = {this.handleDateBlur} ref = {this.hiddenDateRef}/>
                <div className='item-col status-col' className={statusType} onClick = {this.handleStatusClick} style = {{display:this.state.displayStatus,color : this.props.toDoListItem.status == 'complete' ? "#7CC0FB" : "#EDCE42" }}>{this.props.toDoListItem.status}</div>
                <select onChange = {this.handleStatusChange} onBlur ={this.handleStatusBlur} style = {{display:this.state.hiddenStatus}} ref = {this.hiddenStatusRef} value ={this.state.status}>
                    <option value = "complete">complete</option>
                    <option value = "incomplete">incomplete</option>
                </select>
                <div className='item-col test-4-col'></div>
                <div className='item-col list-controls-col'>
                    <KeyboardArrowUp className='list-item-control todo-button' />
                    <KeyboardArrowDown className='list-item-control todo-button' />
                    <Close className='list-item-control todo-button' />
                    <div className='list-item-control'></div>
        <div className='list-item-control'></div>
                </div>
            </div>
        )
    }
}

export default ToDoItem;