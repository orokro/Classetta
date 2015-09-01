/*
	This is the main class file for our ClassItemManager.

	Okay, so this project in particular will be kind of confusing.

	When we speak of "class" we can mean a literally class in the source code, like the one below.
	But since this project deals with classes, (e.g. what the user is "designing"), "class" can
	also reference the class objects in the users interface.

	To make things slightly simpler, we'll call the things that the user manipulates "ClassItems"

	So this is the ClassItemManager, it managages the creation, deletion, and editing of class items.

	This is responsible for updating the list of ClassItems in the DOM (The in the side bar area)
*/
class ClassItemManager {

	constructor(ListAreaDOM){

		//reference to self so call backs work properly
		var me = this;

		//lets intialize a counter that will only always increment - so new classes can have unqiue IDs
		//start with 1000, giving us 1000 private IDs that the Item Manager will never attempt to use.
		this.classIDCounter = 1000;

		//and of course, initialize our list of class items
		this.classItems = [];

		//keep track of our "selected" class...
		//let -1 mean that no class is currently selected
		this.selectedClassItem = -1;

		//save reference to the DOM area we'll be manipulating
		this.DOM = ListAreaDOM;

		//save refernce to the actual list 
		this.listDOM = this.DOM.find('#divClassList');

		//save references to our Add / Remove buttons:
		this.cmdAddDOM = this.DOM.find('#cmdAddClassItem');
		this.cmdRemDOM = this.DOM.find('#cmdRemoveClassItem');
		
		//lets bind some events for the Add / Remove ClassItem buttons!
		this.cmdAddDOM.click(function(e){ me.handleAddClassItemClick(me, this, e); });
		this.cmdRemDOM.click(function(e){ me.handleRemClassItemClick(me, this, e); });

		//dont allow draging to mess things up with selection:
		this.cmdAddDOM.mousedown(function(e){ e.preventDefault(); });
		this.cmdRemDOM.mousedown(function(e){ e.preventDefault(); });
		
		//now we can use some DOM bubbling magic to only bind one event to catch all the list item fires...
		//basically if we bind the list itself we can check for event.target to see which list item was clicked..
		this.listDOM.click(function(e){ me.handleListClick(me, this, e); });

		//and prevent dragging from messing everything up with highlighting
		this.listDOM.mousedown(function(e){ e.preventDefault(); });

		//for our own events lets make some helper objects
		this.eventSelectionChange = new CallbackHelperObj();
		this.eventSelectionEdited = new CallbackHelperObj();
		
	}//constructor

	/* EVENT HANDLERS +++ EVENT HANDLERS +++ EVENT HANDLERS +++ EVENT HANDLERS +++ EVENT HANDLERS +++ EVENT HANDLERS */
	//handle when the add-class button is clicked
	handleAddClassItemClick(me, cmd, e){

		//create a new class:
		var newClassItm = new ClassItem(me.classIDCounter++);

		//add it to ourself
		me.addClassItm(newClassItm);

	}

	//handle when the remove-class button is clicked
	handleRemClassItemClick(me, cmd, e){

		//make sure something is selected a valid selection ID is greater than or equal to 0
		if(me.selectedClassItem >= 0)
			me.removeClassItm(me.selectedClassItem);

	}

	//Handle when an item is clicked by capturing it's bubble on the way up
	handleListClick(me, item, e){

		//check if the target has an id:
		var targetID = $(e.target).attr('id');
		if(!(typeof(targetID)==="undefined")){

			//make sure the first half of the id is "clsItm_"
			if(targetID.substr(0, 7)=="clsItm_"){

				//get the ID of the class item clicked:
				var ClassItemID = parseInt(targetID.split('_')[1]);

				//change which item is selected:
				me.setSelectedItem(ClassItemID);

			}//matches correct id pattern

		}//end if has ID

	}

	//Handle when the selected object is edited by the editor.. this way we can fire an event and the app knows to update the source tabs
	handleSelectedEdited(item){

		//if this is the currently selected object, let's fire our change event
		if(item.ID == this.selectedClassItem)
			this.eventSelectionEdited.fire(item);
	}



	/* METHODS +++ METHODS +++ METHODS +++ METHODS +++ METHODS +++ METHODS +++ METHODS +++ METHODS +++ METHODS +++ METHODS */

	//add a class item object to our list of class items
	addClassItm(item){

		//add the class item to our list of class items:
		this.classItems.push(item);

		//every time a class is added, it should be "selected"
		this.setSelectedItem(item.getID());

		//if this item changes it's name, the list should be updated:
		var me=this;
		item.onNameChange(function(){me.updateList();});

		//if this item is edited at all, we should check if its the selected object
		//and fire an event if it is
		var me=this;
		item.onChange(function(item){me.handleSelectedEdited(item);} );

		//and rebuild our list:
		this.updateList();

	}

	//remove a class item object from our list of class items
	removeClassItm(itemID){

		//we need to find where in the array it is so we can splice it out
		var arrayPos = this.findIndexByID(itemID);

		//if nothing was found, it's not present and therefore cant be removed
		//note: must use ===false and NOT !arrayPos because 0 is a valid position!
		if(arrayPos===false) return;

		//other wise, let's split the item out of our array:
		this.classItems.splice(arrayPos, 1);

		//now we need to update which item is selected.. this is the tricky part.
		//IF there were more items after the array, in theory the arrayPos variable should
		//still be in valid range... we should just select that one.
		//BUT if we deleted an item from the end of the list, then arrayPos will now be out
		//of bounds... so we should just select array.length-1;
		//but if the array is now empty, we should just select -1 for no item!
		var newItemPos;
		if(this.classItems.length<=0)
			this.setSelectedItem(-1);
		else if(arrayPos<=(this.classItems.length-1))
			this.setSelectedItem(this.classItems[arrayPos].getID());
		else
			this.setSelectedItem(this.classItems[this.classItems.length-1].getID());

	}

	//check all our class items and look for one with the given id
	findIndexByID(itemID){

		//loop over all our Class Items
		for(var i=0; i<this.classItems.length; i++){

			//check if the ID matches:
			if(this.classItems[i].getID() == itemID)
				return i;
		}//next i

		//nothing was found? return false as error code
		return false;
	}

	//get a reference to one of the Class Items by it's ID
	getItemByID(itemID){
		return this.classItems[this.findIndexByID(itemID)];
	}

	//change which item is currently selected 
	setSelectedItem(itemID){

		//update the index
		this.selectedClassItem = itemID;

		//and rebuild our list:
		this.updateList();

		//fire the event for the selection change!
		this.eventSelectionChange.fire(this.getItemByID(itemID));
	}

	//Rebuild the DOM List of items
	updateList(){

		//create an empty div to add the items to
		var listItemsDOM = $('<div class="listItems"></div>');

		//loop over our class items and update the dom list
		for(var i=0; i<this.classItems.length; i++){

			//loop over all our items
			var item = this.classItems[i];

			//add a row for this item. Auto add in the "selected" identifier if the ID's match
			listItemsDOM.append('<div id="clsItm_'+item.getID()+'" class="listItem '+((item.getID()==this.selectedClassItem)?'selectedClassItem':'')+'">'+item.getName()); //+' {'+item.getID()+'}</div>');

		}//next i

		//update the list DOM
		this.listDOM.find('.listItems').remove();
		this.listDOM.append(listItemsDOM);

	}

	//allow functions to be un/registerd for our SelectionChange event
	onSelectionChange(func){ return this.eventSelectionChange.register(func); }
	unbindSelectionChange(id){ return this.eventSelectionChange.unregister(id); }

	//allow functions to be un/registerd for our SelectedObjectEdited event
	onSelectionEdited(func){ return this.eventSelectionEdited.register(func); }
	unbindSelectionEdited(id){ return this.eventSelectionEdited.unregister(id); }


	
}