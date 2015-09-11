/*
	This is the main class file for our StyleManager.

	Basically this adds, appends, and manages stylesheets so the HighlightJS (HLJS) Code samples can be re-styled by the user.
*/
class CodeStyleManager {

	constructor(baseCSSPath, ListAreaDOM){

		//reference to self so call backs work properly
		var me = this;

		//lets intialize a counter that will only always increment - so new stylkes can have unqiue IDs
		//start with 1000, giving us 1000 private IDs that the Code Style Manager will never attempt to use.
		this.IDCounter = 1000;

		//and of course, initialize our list of styles
		this.styles = [];

		//keep track of our "selected" style...
		//let -1 mean that no class is currently selected
		this.selectedStyle = -1;

		//save reference to the DOM area we'll be manipulating
		this.DOM = ListAreaDOM;

		//keep track of the base path to the CSS files for the styles
		this.baseCSSPath = baseCSSPath;

		//save reference to the actual list 
		this.listDOM = this.DOM.find('#stylesListContainer');
		
		//now we can use some DOM bubbling magic to only bind one event to catch all the list item fires...
		//basically if we bind the list itself we can check for event.target to see which list item was clicked..
		this.listDOM.click(function(e){ me.handleListClick(me, this, e); });

		//and prevent dragging from messing everything up with highlighting
		this.listDOM.mousedown(function(e){ e.preventDefault(); });

		//for our own events lets make some helper objects
		this.eventSelectionChange = new CallbackHelperObj();
		
	}//constructor

	/* EVENT HANDLERS +++ EVENT HANDLERS +++ EVENT HANDLERS +++ EVENT HANDLERS +++ EVENT HANDLERS +++ EVENT HANDLERS */
	//Handle when an item is clicked by capturing it's bubble on the way up
	handleListClick(me, item, e){

		//check if the target has an id:
		var targetID = $(e.target).attr('id');
		if(!(typeof(targetID)==="undefined")){

			//make sure the first half of the id is "style_"
			if(targetID.substr(0, 6)=="style_"){

				//get the ID of the class item clicked:
				var styleID = parseInt(targetID.split('_')[1]);

				//change which item is selected:
				me.setSelectedItem(styleID);

			}//matches correct id pattern

		}//end if has ID

	}


	/* METHODS +++ METHODS +++ METHODS +++ METHODS +++ METHODS +++ METHODS +++ METHODS +++ METHODS +++ METHODS +++ METHODS */

	//allow the base bath to be get/set
	setBaseCSSPath(path){
		this.baseCSSPath = path;
	}
	getBaseCSSPath(){
		return this.baseCSSPath;
	}

	//add a style to our list of styles
	addStyle(styleName, fileName){

		//make a simple item object
		var item = 	{
						ID: this.IDCounter++,
						name: styleName,
						fileName: fileName
					};

		//add the style to our list of styles
		this.styles.push(item);

		//as soon as at lease one style is present, we should select it
		if(this.selectedStyle<0)
			this.setSelectedItem(item.ID);

		//we should add a link to this file to the head area
		var CSSPath = this.baseCSSPath + item.fileName;
		$('head').append('<link id="css_'+item.ID+'" class="cssCodeStyle" rel="stylesheet" type="text/css" href="'+CSSPath+'" disabled />');
		
		//and rebuild our list of styles:
		this.updateList();

	}

	//remove a style from our list of styles
	removeStyle(styleID){

		//we need to find where in the array it is so we can splice it out
		var arrayPos = this.findIndexByID(styleID);

		//if nothing was found, it's not present and therefore cant be removed
		//note: must use ===false and NOT !arrayPos because 0 is a valid position!
		if(arrayPos===false) return;

		//other wise, let's split the item out of our array:
		this.styles.splice(arrayPos, 1);

		//now we need to update which item is selected.. this is the tricky part.
		//IF there were more items after the array, in theory the arrayPos variable should
		//still be in valid range... we should just select that one.
		//BUT if we deleted an item from the end of the list, then arrayPos will now be out
		//of bounds... so we should just select array.length-1;
		//but if the array is now empty, we should just select -1 for no item!
		var newItemPos;
		if(this.styles.length<=0)
			this.setSelectedItem(-1);
		else if(arrayPos<=(this.styles.length-1))
			this.setSelectedItem(this.styles[arrayPos].ID);
		else
			this.setSelectedItem(this.styles[this.styles.length-1].ID);

		//we should remove the old CSS file from the head-dom
		$('#css_'+styleID).remove();

	}

	//check all our styles and look for one with the given id
	findIndexByID(styleID){

		//loop over all our styles
		for(var i=0; i<this.styles.length; i++){

			//check if the ID matches:
			if(this.styles[i].ID == styleID)
				return i;
		}//next i

		//nothing was found? return false as error code
		return false;
	}

	//check all our stles and look for one with a matching name
	findIndexByName(name){

		//loop over all our styles
		for(var i=0; i<this.styles.length; i++){

			//check if the ID matches:
			if(this.styles[i].name == name)
				return i;
		}//next i

		//nothing was found? return false as error code
		return false;
	}

	//get a reference to one of the styles by it's ID
	getStyleByID(styleID){
		return this.styles[this.findIndexByID(styleID)];
	}

	//get a style by its name
	getStyleByName(name){
		return this.styles[this.findIndexByName(name)];
	}

	//change which item is selected, by name
	setSelectedItemByName(name){
		var item = this.getStyleByName(name);
		if(item==false) return;
		this.setSelectedItem(item.ID);
	}

	//change which item is currently selected 
	setSelectedItem(styleID){

		//update the index
		this.selectedStyle = styleID;

		//disable all the other CSS links
		$('.cssCodeStyle').prop('disabled', true);

		//enable only the selected one
		$('#css_'+styleID).prop('disabled', false);

		//and rebuild our list:
		this.updateList();

		//fire the event for the selection change!
		this.eventSelectionChange.fire(this.getStyleByID(styleID));
	}

	//Rebuild the DOM List of items
	updateList(){

		//create an empty div to add the items to
		var listItemsDOM = $('<div class="listItems"></div>');

		var top = this.listDOM.scrollTop();

		//loop over our styles and update the dom list
		for(var i=0; i<this.styles.length; i++){

			//loop over all our items
			var item = this.styles[i];

			//add a row for this item. Auto add in the "selected" identifier if the ID's match
			listItemsDOM.append('<div id="style_'+item.ID+'" class="listItem '+((item.ID==this.selectedStyle)?'selectedClassItem':'')+'">'+item.name); //+' {'+item.getID()+'}</div>');

		}//next i

		//update the list DOM
		//this.listDOM.find('.listItems').remove();
		this.listDOM.html(listItemsDOM);

		this.listDOM.scrollTop(top);

	}

	//allow functions to be un/registerd for our SelectionChange event
	onSelectionChange(func){ return this.eventSelectionChange.register(func); }
	unbindSelectionChange(id){ return this.eventSelectionChange.unregister(id); }
	
}