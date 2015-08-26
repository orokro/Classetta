/*
	So, if any object wants to define events it should allow other code to register callback functions for those
	events.

	This CallbackHelperObj just providers a little bit of ulitity to make registering, unregistering, and calling callbacks a bit handier

*/
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CallbackHelperObj = (function () {
	function CallbackHelperObj() {
		_classCallCheck(this, CallbackHelperObj);

		//no call backs registered yet.
		this.callbacks = [];

		//create a counter for unique id's for callbacks
		this.idCounter = 0;
	}

	//register a callback function!

	_createClass(CallbackHelperObj, [{
		key: "register",
		value: function register(func) {

			//get a unique ID for this callback
			var CBID = this.idCounter++;

			//make a new hash with a unique ID and the function:
			var CBHash = {
				id: CBID,
				f: func
			};

			//add it to our list
			this.callbacks.push(CBHash);

			//return the unique ID so it can be unregistered in the future...
			return CBID;
		}

		//remove a callback from our list of callbacks:
	}, {
		key: "unregister",
		value: function unregister(CBID) {

			//find it's pos in the array of callbacks
			var arrPos = -1;
			for (var i = 0; i < this.callbacks.length; i++) {
				if (this.callbacks[i].id == CBID) {
					arrPos = i;
					break;
				}
			} //next i

			//if arrPos is still -1, then we didn't find anything to remove ... CBID does not exist or was already removed
			if (arrPos < 0) return;

			//now we should just splice the function out:
			var oldFunc = this.callbacks.splice(arrPos, 1);

			//and return the function to the caller!
			return oldFunc;
		}

		//call all the callbacks at once!
	}, {
		key: "fire",
		value: function fire() {

			//note: even though no parameters are specified, if parameters are passed they will show up in the "arguments" array
			//we will simplly use the .apply method to find each function with the SAME arguments that were passed to fire()!

			//loop over all callbacks..
			for (var i = 0; i < this.callbacks.length; i++) {

				//get reference to specific callback:
				var callback = this.callbacks[i].f;

				//call the callback!
				callback.apply(null, arguments);
			} //next i
		}
	}]);

	return CallbackHelperObj;
})();
/* 
    This is the main application class for our Class.Design web app.

*/
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var ClassDesignApp = (function () {
        function ClassDesignApp() {
                _classCallCheck(this, ClassDesignApp);

                //so scope will resolve inside callbacks
                var me = this;

                //Create and Initialize our TabManager. It expects a reference to the tabs area
                this.TabMgr = new TabManager($('#divTabbedArea'));

                //Create an Initialize our ClassItemsManager. It expects a reference to the area in the sidebar for the list...
                this.ClassItmMgr = new ClassItemManager($('#divClassListArea'));

                //Keep track of which ClassItem is being worked on, or null if none
                this.currentClassItem = null;

                //Create and Initialize a new ClassEditor. It expects a reference to the current class object, and Editor Tab Page div
                this.Editor = new ClassEditor(this.currentClassItem, $('#tab_Editor'));

                //we need to bind an event for when the user changes the selected class,
                //so we can update the editor
                this.ClassItmMgr.onSelectionChange(function (o) {
                        me.handleSelectionChange(me, o);
                });

                //add default item for debugging
                this.ClassItmMgr.addClassItm(new ClassItem(this.ClassItmMgr.classIDCounter++));
        }

        //update the app apropriately when the selected ClassItem changes, or becomes null

        _createClass(ClassDesignApp, [{
                key: 'handleSelectionChange',
                value: function handleSelectionChange(me, newItem) {

                        //update the editor...
                        me.Editor.setClassItem(newItem);

                        //if the new item is null or undefined, that means no item is selected (e.g. the list was emptied)
                        if (typeof newItem === "undefined" || newItem == null) {

                                //hide the editor and show the welcome screen
                                $('#divEditor').hide();
                                $('#divWelcome').show();
                        } else {

                                //hide the editor and show the welcome screen
                                $('#divWelcome').hide();
                                $('#divEditor').show();
                        } //endif
                }
        }]);

        return ClassDesignApp;
})();
/*
	In our application the first tab is the "Editor" which allows ClassItems to be edited,
	in such ways as:
		- Change name
		- Add/Rem Inheritance
		- Add/Rem Interfaces
		- Add/Rem Methods
		- Add/Rem Members

	This editor takes a DIV to populate with it's controls, 
	as well as an initial ClassItem to edit. If the initial item is null or undefined,
	it will just start empty.

*/
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ClassEditor = (function () {
	function ClassEditor(clsItem, EditorDOM) {
		_classCallCheck(this, ClassEditor);

		//save the itintial class item:
		this.currentClassItem = clsItem;

		//save reference to our dom
		this.DOM = EditorDOM;
	}

	//update the editor to be editing a new ClassItem object...

	_createClass(ClassEditor, [{
		key: "setClassItem",
		value: function setClassItem(clsItem) {

			//save the new class item:
			this.currentClassItem = clsItem;
		}
	}]);

	return ClassEditor;
})();
/*
	This is the main class file for the ClassItem class

	So.. just to recap, ClassItems don't refer to actual classes in this projects code.
	Rather, ClassItems are the "classes" that the user is building.

*/
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ClassItem = (function () {
	function ClassItem(ID) {
		var initialClassName = arguments.length <= 1 || arguments[1] === undefined ? "Untitled" : arguments[1];

		_classCallCheck(this, ClassItem);

		//save our given id
		this.ID = ID;

		//save our given name (or default)
		this.itmName = initialClassName;
	}

	//constructor(initialClassName);

	_createClass(ClassItem, [{
		key: "getID",
		value: function getID() {
			return this.ID;
		}

		//setID(ID){ this.ID = ID; } //no setid, id's should be immutable

	}, {
		key: "getName",
		value: function getName() {
			return this.itmName;
		}
	}, {
		key: "setName",
		value: function setName(n) {
			this.itmName = n;
		}
	}]);

	return ClassItem;
})();
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
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var ClassItemManager = (function () {
	function ClassItemManager(ListAreaDOM) {
		_classCallCheck(this, ClassItemManager);

		//reference to self so call backs work properly
		var me = this;

		//lets intialize a counter that will only always increment - so new classes can have unqiue IDs
		this.classIDCounter = 0;

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
		this.cmdAddDOM.click(function (e) {
			me.handleAddClassItemClick(me, this, e);
		});
		this.cmdRemDOM.click(function (e) {
			me.handleRemClassItemClick(me, this, e);
		});

		//dont allow draging to mess things up with selection:
		this.cmdAddDOM.mousedown(function (e) {
			e.preventDefault();
		});
		this.cmdRemDOM.mousedown(function (e) {
			e.preventDefault();
		});

		//now we can use some DOM bubbling magic to only bind one event to catch all the list item fires...
		//basically if we bind the list itself we can check for event.target to see which list item was clicked..
		this.listDOM.click(function (e) {
			me.handleListClick(me, this, e);
		});

		//and prevent dragging from messing everything up with highlighting
		this.listDOM.mousedown(function (e) {
			e.preventDefault();
		});

		//for our own events lets make some help objects
		this.eventSelectionChange = new CallbackHelperObj();
	}

	//constructor

	/* EVENT HANDLERS +++ EVENT HANDLERS +++ EVENT HANDLERS +++ EVENT HANDLERS +++ EVENT HANDLERS +++ EVENT HANDLERS */
	//handle when the add-class button is clicked

	_createClass(ClassItemManager, [{
		key: 'handleAddClassItemClick',
		value: function handleAddClassItemClick(me, cmd, e) {

			//create a new class:
			var newClassItm = new ClassItem(me.classIDCounter++);

			//add it to ourself
			me.addClassItm(newClassItm);
		}

		//handle when the remove-class button is clicked
	}, {
		key: 'handleRemClassItemClick',
		value: function handleRemClassItemClick(me, cmd, e) {

			//make sure something is selected a valid selection ID is greater than or equal to 0
			if (me.selectedClassItem >= 0) me.removeClassItm(me.selectedClassItem);
		}

		//Hand when an item is clicked by capturing it's bubble on the way up
	}, {
		key: 'handleListClick',
		value: function handleListClick(me, item, e) {

			//check if the target has an id:
			var targetID = $(e.target).attr('id');
			if (!(typeof targetID === "undefined")) {

				//make sure the first half of the id is "clsItm_"
				if (targetID.substr(0, 7) == "clsItm_") {

					//get the ID of the class item clicked:
					var ClassItemID = parseInt(targetID.split('_')[1]);

					//change which item is selected:
					me.setSelectedItem(ClassItemID);
				} //matches correct id pattern
			} //end if has ID
		}

		/* METHODS +++ METHODS +++ METHODS +++ METHODS +++ METHODS +++ METHODS +++ METHODS +++ METHODS +++ METHODS +++ METHODS */

		//add a class item object to our list of class items
	}, {
		key: 'addClassItm',
		value: function addClassItm(item) {

			//add the class item to our list of class items:
			this.classItems.push(item);

			//every time a class is added, it should be "selected"
			this.setSelectedItem(item.getID());

			//and rebuild our list:
			this.updateList();
		}

		//remove a class item object from our list of class items
	}, {
		key: 'removeClassItm',
		value: function removeClassItm(itemID) {

			//we need to find where in the array it is so we can splice it out
			var arrayPos = this.findIndexByID(itemID);

			//if nothing was found, it's not present and therefore cant be removed
			//note: must use ===false and NOT !arrayPos because 0 is a valid position!
			if (arrayPos === false) return;

			//other wise, let's split the item out of our array:
			this.classItems.splice(arrayPos, 1);

			//now we need to update which item is selected.. this is the tricky part.
			//IF there were more items after the array, in theory the arrayPos variable should
			//still be in valid range... we should just select that one.
			//BUT if we deleted an item from the end of the list, then arrayPos will now be out
			//of bounds... so we should just select array.length-1;
			//but if the array is now empty, we should just select -1 for no item!
			var newItemPos;
			if (this.classItems.length <= 0) this.setSelectedItem(-1);else if (arrayPos <= this.classItems.length - 1) this.setSelectedItem(this.classItems[arrayPos].getID());else this.setSelectedItem(this.classItems[this.classItems.length - 1].getID());
		}

		//check all our class items and look for one with the given id
	}, {
		key: 'findIndexByID',
		value: function findIndexByID(itemID) {

			//loop over all our Class Items
			for (var i = 0; i < this.classItems.length; i++) {

				//check if the ID matches:
				if (this.classItems[i].getID() == itemID) return i;
			} //next i

			//nothing was found? return false as error code
			return false;
		}

		//get a reference to one of the Class Items by it's ID
	}, {
		key: 'getItemByID',
		value: function getItemByID(itemID) {
			return this.classItems[this.findIndexByID(itemID)];
		}

		//change which item is currently selected
	}, {
		key: 'setSelectedItem',
		value: function setSelectedItem(itemID) {

			//update the index
			this.selectedClassItem = itemID;

			//and rebuild our list:
			this.updateList();

			//fire the event for the selection change!
			this.eventSelectionChange.fire(this.getItemByID(itemID));
		}

		//Rebuild the DOM List of items
	}, {
		key: 'updateList',
		value: function updateList() {

			//create an empty div to add the items to
			var listItemsDOM = $('<div class="listItems"></div>');

			//loop over our class items and update the dom list
			for (var i = 0; i < this.classItems.length; i++) {

				//loop over all our items
				var item = this.classItems[i];

				//add a row for this item. Auto add in the "selected" identifier if the ID's match
				listItemsDOM.append('<div id="clsItm_' + item.getID() + '" class="listItem ' + (item.getID() == this.selectedClassItem ? 'selectedClassItem' : '') + '">' + item.getName() + ' {' + item.getID() + '}</div>');
			} //next i

			//update the list DOM
			this.listDOM.find('.listItems').remove();
			this.listDOM.append(listItemsDOM);
		}

		//allow functions to be un/registerd for our SelectionChange event
	}, {
		key: 'onSelectionChange',
		value: function onSelectionChange(func) {
			return this.eventSelectionChange.register(func);
		}
	}, {
		key: 'unbindSelectionChange',
		value: function unbindSelectionChange(id) {
			return this.eventSelectionChange.unregister(id);
		}
	}]);

	return ClassItemManager;
})();
/*
	This is the main class for our Tab Manger.

	The Tab Manager will be responsible for monitoring the events of the tabs,
	and updating the DOM / CSS as appropriate.
*/
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var TabManager = (function () {
		function TabManager(TabDom) {
				_classCallCheck(this, TabManager);

				//even in ES6 still gotta resort to ugly closure hacks to make callbacks work..
				var me = this;

				//save referemce our tab DOM container
				this.DOM = TabDom;

				//associative array to store our tab page references
				this.tabs = {};

				//save refernce to the DOM elements that make up the tabs:
				this.tabsDOM = $('#topTabs li');

				//get each of the tabs and create a page for it (if one doesn't already exist)
				this.tabsDOM.each(function () {

						//extract the name / keyword id for this tab:
						var name = $(this).attr('id').split('_')[1];

						//check if a page for this one already exists..
						var tabCheck = me.DOM.find('#tabPage_' + name);

						//if it DOESNT exist, let's create it!
						if (!tabCheck.length > 0) {

								//create a new tab page
								me.tabs[name] = $('<div id="tabPage_' + name + '" class="tabPage">Tab page for ' + name + '!</div>');

								//append it to the dom:
								$(me.DOM).append(me.tabs[name]);

								//otherwise, there should only be one 0 save the reference and move on!
						} else if (tabCheck.length == 1) {
										me.tabs[name] = $(tabCheck[0]);
								} else {
										Throw("TabManager found more than one tab sharing the ID: #tabPage_" + name);
								}
				});

				//Now that all the tab pages have been created lets cache a reference to their dom
				this.pagesDOM = this.DOM.find('.tabPage');

				//bind events for when a tab is clicked on...
				this.tabsDOM.click(function (e) {
						me.handleTabClick(me, this);
				});

				//dont allow draging to mess things up with selection:
				this.tabsDOM.mousedown(function (e) {
						e.preventDefault();
				});
		}

		//constructor()

		//When a tab is changed let's change which tab data is displayed:
		_createClass(TabManager, [{
				key: 'handleTabClick',
				value: function handleTabClick(me, elem) {

						//extract the name / keyword id for this tab:
						var name = $(elem).attr('id').split('_')[1];

						//hide all other tabs:
						me.pagesDOM.hide().removeClass('initialTabPage');

						//update the background
						me.DOM.removeClass().addClass('tabPage' + name + 'BG');

						//update tab sytles:
						me.tabsDOM.removeClass('activeTab');
						$(elem).addClass('activeTab');

						//show just the tab we care about:
						me.tabs[name].show();
				}
		}]);

		return TabManager;
})();