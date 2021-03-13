// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import React, { Component } from 'react'

class ListLink extends Component {
    constructor(props) {
        super(props);
        
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tListLink " + this.props.toDoList.key + " constructor");

        this.state = {
            name : this.props.toDoList.name,
            nameHiddenStyle: "none",
            nameMainStyle : "block"
        }

        this.hiddenNameRef = React.createRef(); //used to focus onto the description input
    }

    componentDidMount = () => {
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tListLink " + this.props.toDoList.key + " did mount");
    }

    componentDidUpdate = () =>{
        if(this.hiddenNameRef.current !==null){ //checks to see if the hidden inputs have appeared
            this.hiddenNameRef.current.focus();
        }
    }

    handleLoadAndDoubleClick = (event) =>{
        this.handleLoadList();
        this.handleNameClick(event);
    }

    handleLoadList = () => {
        this.props.loadToDoListCallback(this.props.toDoList);
    }

    handleNameClick = (event) =>{
        console.log('clicked');
        if(event.detail == 2){
            this.setState({
                nameMainStyle : "none",
                nameHiddenStyle: "block",
                
            })
        }   
    }

    handleNameChange = (event) =>{
        this.setState({name:event.target.value})
    }

    handleNameBlur = () =>{
        this.setState({
            nameMainStyle : "block",
            nameHiddenStyle: "none",
            
        });
        this.props.changeCurrentListNameCallBack(this.state.name);

    }


    render() {
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tListLink render");
        console.log(this.props.position);
        if(this.props.position == 0){
            return (
                <div>
                <div 
                    className='todo-list-button'
                    onClick={this.handleLoadAndDoubleClick}
                    style ={{display : this.state.nameMainStyle}}
                >
                    {this.props.toDoList.name}<br />
                </div>
                <input  type = "text" value = {this.state.name} className = "hidden_todo_list_input" onChange ={this.handleNameChange} onBlur ={this.handleNameBlur} style ={{display : this.state.nameHiddenStyle}} ref ={this.hiddenNameRef}/>
                </div>
                
            )
        }
        return (
            <div 
            className='todo-list-button'
            onClick={this.handleLoadList}
        >
            {this.props.toDoList.name}<br />
        </div>
        )
        
    }
}

export default ListLink;