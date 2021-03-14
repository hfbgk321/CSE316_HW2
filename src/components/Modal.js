import React, {Component} from 'react';
import Close from '@material-ui/icons/Close';

export default class Modal extends Component{
  constructor(props){
    super(props);
  }


  

  handleClose = (e) =>{
    // console.log('closing');
    this.props.onClose && this.props.onClose(e);
  }

  handleDelete = (e) =>{
    // console.log('deleting');
    this.props.onDelete && this.props.onDelete(e);
  }
  
  

  render(){
    if(!this.props.visible){
      return null;
    }
    return (
      <div id = "modal_container">
<div id = "modal_background">
      </div>
      <div id = "modal_content">
      <div className ="modal_delete_list_row">
        <h1 className = "modal_delete_list_row_child child1">Delete List?</h1>
        <Close className = "modal_delete_list_row_child child2" onClick = {this.handleClose}/>
      </div>

      <div id ="modal_button_container">
      <button className ="modal_delete_button" onClick = {this.handleDelete}>Delete</button>
      <button className ="modal_close_button" onClick = {this.handleClose}>Close</button>
      </div>
      
    </div>
      </div>
      
      )
    
    
    
  }


}