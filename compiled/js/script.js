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
                this.Editor = new ClassEditor(this.currentClassItem, $('#divEditor'));

                //we need to bind an event for when the user changes the selected class,
                //so we can update the editor
                this.ClassItmMgr.onSelectionChange(function (o) {
                        me.handleSelectionChange(me, o);
                });

                //add default item for debugging
                var newItem = new ClassItem(this.ClassItmMgr.classIDCounter++);

                newItem.setName('DemoClass');

                newItem.addInterface("Petable");
                newItem.addInterface("Feedable");
                newItem.addInterface("foo");

                newItem.addMember("aInt");
                newItem.getMemberByName("aInt").mType = INT;
                newItem.getMemberByName("aInt").access = PUBLIC;
                newItem.getMemberByName("aInt").isStatic = true;
                newItem.getMemberByName("aInt").isConst = true;
                newItem.getMemberByName("aInt").val = 123000000;
                newItem.addMember("aShort");
                newItem.getMemberByName("aShort").mType = SHORT;
                newItem.getMemberByName("aShort").access = PUBLIC;
                newItem.getMemberByName("aShort").isStatic = true;
                newItem.getMemberByName("aShort").val = 123000;
                newItem.addMember("aLong");
                newItem.getMemberByName("aLong").mType = LONG;
                newItem.getMemberByName("aLong").access = PUBLIC;
                newItem.getMemberByName("aLong").val = 123000000000;
                newItem.addMember("aByte");
                newItem.getMemberByName("aByte").mType = BYTE;
                newItem.getMemberByName("aByte").val = 123;
                newItem.addMember("aFloat");
                newItem.getMemberByName("aFloat").mType = FLOAT;
                newItem.getMemberByName("aFloat").val = 3.14159;
                newItem.addMember("aDouble");
                newItem.getMemberByName("aDouble").mType = DOUBLE;
                newItem.getMemberByName("aDouble").val = 3.1415926535897;
                newItem.addMember("aChar");
                newItem.getMemberByName("aChar").mType = CHAR;
                newItem.getMemberByName("aChar").val = 'g';
                newItem.addMember("aString");
                newItem.getMemberByName("aString").mType = STRING;
                newItem.getMemberByName("aString").val = "Design.Class Rules!";
                newItem.addMember("aBoolean");
                newItem.getMemberByName("aBoolean").mType = BOOLEAN;
                newItem.getMemberByName("aBoolean").val = true;

                newItem.addMethod("main");
                newItem.getMethodByName("main").mType = VOID;
                newItem.getMethodByName("main").access = PUBLIC;
                newItem.getMethodByName("main").isStatic = true;
                newItem.getMethodByName("main").isConst = false;
                newItem.getMethodByName("main").params = ["String args[]"];
                newItem.addMethod("foo");
                newItem.getMethodByName("foo").mType = LONG;
                newItem.getMethodByName("foo").access = PRIVATE;
                newItem.getMethodByName("foo").isStatic = false;
                newItem.getMethodByName("foo").isConst = true;
                newItem.getMethodByName("foo").params = ["String args[]"];
                newItem.addMethod("bar");
                newItem.getMethodByName("bar").mType = STRING;
                newItem.getMethodByName("bar").access = PUBLIC;
                newItem.getMethodByName("bar").isStatic = false;
                newItem.getMethodByName("bar").isConst = false;
                newItem.getMethodByName("bar").params = ["String args[]"];

                this.ClassItmMgr.addClassItm(newItem);

                newItem.onChange(function () {
                        console.log('My object changed!');
                });
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
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var ClassEditor = (function () {
	function ClassEditor(clsItem, EditorDOM) {
		_classCallCheck(this, ClassEditor);

		//variable so scope will resolve in call backs
		var me = this;

		//save the itintial class item:
		this.currentClassItem = clsItem;

		//save reference to our dom
		this.DOM = EditorDOM;

		//lets cache a bunch of jQuery searchs for useful elements
		this.area = {
			classname: { DOM: this.DOM.find('#classname'),
				txt: this.DOM.find('#classname').find(':text'),
				nfo: this.DOM.find('#classname').find('.infobox'),
				chkClassPublic: this.DOM.find('#chkClassPublic'),
				chkClassFinal: this.DOM.find('#chkClassFinal'),
				chkClassAbstract: this.DOM.find('#chkClassAbstract')
			},
			ancestor: { DOM: this.DOM.find('#ancestor'),
				txt: this.DOM.find('#ancestor').find('input'),
				nfo: this.DOM.find('#ancestor').find('.infobox')
			},
			interfaces: { DOM: this.DOM.find('#interfaces'),
				txt: this.DOM.find('#interfaces').find('input'),
				cmd: this.DOM.find('#interfaces').find('button'),
				nfo: this.DOM.find('#interfaces').find('.infobox'),
				lst: this.DOM.find('#interfaces').find('.entries')
			},
			members: { DOM: this.DOM.find('#members'),
				txt: this.DOM.find('#members').find('input'),
				cmd: this.DOM.find('#members').find('button'),
				nfo: this.DOM.find('#members').find('.infobox'),
				lst: this.DOM.find('#members').find('.entries')
			},
			methods: { DOM: this.DOM.find('#methods'),
				txt: this.DOM.find('#methods').find('input'),
				cmd: this.DOM.find('#methods').find('button'),
				nfo: this.DOM.find('#methods').find('.infobox'),
				lst: this.DOM.find('#methods').find('.entries')
			}
		};

		//start with the basics - lets make the panels toggleable
		this.DOM.find('.toggleBar').click(function (e) {

			//get the next toggle wrapper
			var wrapper = $(this).next('.toggleWrapper');

			var headerActivated = this;
			wrapper.slideToggle("slow", function () {

				if (wrapper.is(':visible')) $(headerActivated).text('▼' + $(headerActivated).text().substr(1));else $(headerActivated).text('►' + $(headerActivated).text().substr(1));
			});
		});

		//prevent dragging from messing up selection
		this.DOM.find('.toggleBar').mousedown(function (e) {
			e.preventDefault();
		});
		this.DOM.find('label').mousedown(function (e) {
			e.preventDefault();
		});

		//Lots of events to bind ...

		//make the table rows red when the delete flag is hovered over
		this.DOM.mouseover(function (e) {
			if ($(e.target).is('.deleteRow')) $(e.target).parent().parent().addClass('deleteRowTr');
		});
		this.DOM.mouseout(function (e) {
			if ($(e.target).is('.deleteRow')) $(e.target).parent().parent().removeClass('deleteRowTr');
		});

		//simple handlets for the checkboxes:
		this.area.classname.chkClassPublic.bind('change click keyup', function (e) {
			me.currentClassItem.setPublic($(this).is(":checked"));
		});
		this.area.classname.chkClassFinal.bind('change click keyup', function (e) {
			me.currentClassItem.setFinal($(this).is(":checked"));
		});
		this.area.classname.chkClassAbstract.bind('change click keyup', function (e) {
			me.currentClassItem.setAbstract($(this).is(":checked"));
		});

		//handle input for the Class Name and Ancestor Name
		this.area.classname.txt.bind('keypress keyup keydown change', function (e) {
			me.handleNameChange(me, this, e);
		});
		this.area.ancestor.txt.bind('keypress keyup keydown change', function (e) {
			me.handleAncestorChange(me, this, e);
		});

		//handle text box changes for the Interfaces / Members / Methods boxes (which each take comma seperated values)
		this.area.interfaces.txt.bind('keypress keyup keydown change', function (e) {
			me.handleMultiInputChange(me, this, e, true, me.area.interfaces);
		});
		this.area.methods.txt.bind('keypress keyup keydown change', function (e) {
			me.handleMultiInputChange(me, this, e, false, me.area.methods);
		});
		this.area.members.txt.bind('keypress keyup keydown change', function (e) {
			me.handleMultiInputChange(me, this, e, false, me.area.members);
		});

		//handle when the return key is pressed on the mutlis
		this.area.interfaces.txt.bind('keydown change', function (e) {
			if (e.which == 13) me.addAll(me.currentClassItem.addInterface, me.area.interfaces.txt);
		});
		this.area.methods.txt.bind('keydown change', function (e) {
			if (e.which == 13) me.addAll(me.currentClassItem.addMethod, me.area.methods.txt);
		});
		this.area.members.txt.bind('keydown change', function (e) {
			if (e.which == 13) me.addAll(me.currentClassItem.addMember, me.area.members.txt);
		});

		//handle button presses
		this.area.interfaces.cmd.click(function (e) {
			me.addAll(me.currentClassItem.addInterface, me.area.interfaces.txt);
		});
		this.area.methods.cmd.click(function (e) {
			me.addAll(me.currentClassItem.addMethod, me.area.methods.txt);
		});
		this.area.members.cmd.click(function (e) {
			me.addAll(me.currentClassItem.addMember, me.area.members.txt);
		});

		//handle all the events for the select boxes!
		this.area.members.DOM.change(function (e) {
			me.handleSelectChange(me, me.currentClassItem.updateMemberByName, e);
		});
		this.area.methods.DOM.change(function (e) {
			me.handleSelectChange(me, me.currentClassItem.updateMethodByName, e);
		});

		//handle all the events for any of the editable text areas!
		this.area.interfaces.DOM.mouseup(function (e) {
			me.handleEditableTextClick(me, e);
			me.handleDeleteRowClick(me, e, me.currentClassItem.remInterfaceByName);
		});
		this.area.members.DOM.mouseup(function (e) {
			me.handleEditableTextClick(me, e);
			me.handleDeleteRowClick(me, e, me.currentClassItem.remMemberByName);
		});
		this.area.methods.DOM.mouseup(function (e) {
			me.handleEditableTextClick(me, e);
			me.handleDeleteRowClick(me, e, me.currentClassItem.remMethodByName);
		});

		//handle all the events for the edit in place text areas
		this.area.interfaces.DOM.bind('keypress keyup keydown change', function (e) {
			if (e.which == 13 && $(e.target).is('.editInPlaceBox')) me.handleEditableTextSubmit(me, me.currentClassItem.updateInterfaceByName, e);
		});
		this.area.members.DOM.bind('keypress keyup keydown change', function (e) {
			if (e.which == 13 && $(e.target).is('.editInPlaceBox')) me.handleEditableTextSubmit(me, me.currentClassItem.updateMemberByName, e);
		});
		this.area.methods.DOM.bind('keypress keyup keydown change', function (e) {
			if (e.which == 13 && $(e.target).is('.editInPlaceBox')) me.handleEditableTextSubmit(me, me.currentClassItem.updateMethodByName, e);
		});

		//if(e.which==13) me.handleEditableTextSubmit(me, e);
		//	editBox.bind('keypress keyup keydown change', function(e){ me.handleEditableTextChange(me, e); });
	}

	//takes a text box and makes sure there's no whitespace or double quotes, then returns the value as a string

	_createClass(ClassEditor, [{
		key: 'removeWhiteSpace',
		value: function removeWhiteSpace(textBox) {
			var val = $(textBox).val();

			//remove all whitespace if there's any
			if (val.match(/\s/g) != null && val.match(/\s/g).length > 0) {
				val = val.replace(/\s/g, "");
				$(textBox).val(val);
			}
			if (val.match(/\"/g) != null && val.match(/\"/g).length > 0) {
				val = val.replace(/\"/g, "");
				$(textBox).val(val);
			}

			return val;
		}

		//returns a string of HTML elements description warnings about nameformatting.
		//For instance, class names generally should start with a capitol, not start with a number, etc
	}, {
		key: 'getNameWarnings',
		value: function getNameWarnings(strName) {
			var classOrInterface = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

			//a string of HTML to append to:
			var ret = '';

			//if it's empty, this will be easy!
			if (strName == '') {
				return '<div class="warning">Empty name!</div>';
			}

			//get the first character of the string:
			var firstChar = strName.substr(0, 1);

			if (classOrInterface == true) {
				//check if first char is not a letter:
				if (firstChar.match(/[a-zA-Z]/) == null) {
					ret += '<div class="warning"><strong>[' + strName + ']</strong>: The first character "' + firstChar + '" is not a letter [a-zA-Z]. This is illegal in most languages.</div>';

					//if it is a letter, make sure it's upper case:
				} else if (firstChar.match(/[A-Z]/) == null) {
						ret += '<div class="warning"><strong>[' + strName + ']</strong>: The first character "' + firstChar + '" is not uppercase. It is considered good convention in most languages to start a Class / Interface with an uppercase.</div>';
					}

				//if not classOrInterface, rules are slightly different for methods and members...
			} else {
					//check if first char is not a letter:
					if (firstChar.match(/[a-zA-Z_]/) == null) {
						ret += '<div class="warning"><strong>[' + strName + ']</strong>: The first character "' + firstChar + '" is not a letter [a-zA-Z] or underscore _. This is illegal in most languages.</div>';

						//if it is a letter, make sure it's lowercase case:
					} else if (firstChar.match(/[a-z_]/) == null) {
							ret += '<div class="warning"><strong>[' + strName + ']</strong>: The first character "' + firstChar + '" is not lowercase. It may be mistaken for a Class name, which usually start with an uppercase.</div>';
						}
				} //end if classOrInterface

			//now if there are any special characters
			if (strName.match(/[^0-9a-zA-Z_]/) != null) {
				ret += '<div class="warning"><strong>[' + strName + ']</strong>: This name contains special characters that may not be available in all languages.</div>';
			}

			//return our warnngs!
			return ret;
		}
	}, {
		key: 'handleNameChange',
		value: function handleNameChange(me, trigger, e) {
			//get the value and make sure there's no whitespace:
			var val = me.removeWhiteSpace(trigger);

			//update the info label with any warnings:
			me.area.classname.nfo.html(me.getNameWarnings(val));

			//if the value is empty we can just use "Untitled"
			if (val == '') val = 'Untitled';

			//update the object (note: warnings are only warnings. If the user enters stupid data, this will generate stupid output!)
			if (me.currentClassItem != null && !(typeof me.currentClassItem === "undefined")) me.currentClassItem.setName(val);
		}
	}, {
		key: 'handleAncestorChange',
		value: function handleAncestorChange(me, trigger, e) {
			//get the value and make sure there's no whitespace:
			var val = me.removeWhiteSpace(trigger);

			//update the info label with any warnings:
			if (val == '') me.area.ancestor.nfo.html('');else me.area.ancestor.nfo.html(me.getNameWarnings(val));

			//update the object (note: warnings are only warnings. If the user enters stupid data, this will generate stupid output!)
			if (me.currentClassItem != null && !(typeof me.currentClassItem === "undefined")) me.currentClassItem.setAncestor(val);
		}

		//handle when the comma-seperated value boxes change
	}, {
		key: 'handleMultiInputChange',
		value: function handleMultiInputChange(me, trigger, e, classOrInterface, area) {
			//get the value and make sure there's no whitespace:
			var val = me.removeWhiteSpace(trigger);

			//split based on commas and remove empties:
			var items = val.split(',').filter(function (s) {
				return s != "";
			});

			//get warnings for all items
			var allWarnings = '';
			for (var i = 0; i < items.length; i++) allWarnings += me.getNameWarnings(items[i], classOrInterface);

			//update warning label
			area.nfo.html(allWarnings);
		}

		//call the supplied add method with every item in an array of strings
	}, {
		key: 'addAll',
		value: function addAll(func, txtBox) {
			//get the value and make sure there's no whitespace:
			var val = this.removeWhiteSpace(txtBox);

			//split based on commas and remove empties:
			var items = val.split(',').filter(function (s) {
				return s != "";
			});

			//add all items to the object
			for (var i = 0; i < items.length; i++) func.apply(this.currentClassItem, [items[i]]);

			//definately should rebuild the dom now...
			this.updateDOM();
		}

		// get the details of a table item
	}, {
		key: 'tblItmDetails',
		value: function tblItmDetails(elem) {
			return {
				val: elem.val(),
				propName: elem.parent().attr('class'),
				mName: elem.parent().parent().attr('class').split(' ')[0].split('_')[1],
				container: elem.parent(),
				row: elem.parent().parent(),
				table: elem.parent().parent()
			};
		}

		//handle when one of the select boxes changes in a table
	}, {
		key: 'handleSelectChange',
		value: function handleSelectChange(me, f, e) {

			//get the element that fired the event
			var elem = $(e.target);

			//if a select fired the change event, we can change the value...
			if (elem.is('select')) {

				//get details of this table item
				var details = this.tblItmDetails(elem);
				if (details.val === 'true') details.val = true;
				if (details.val === 'false') details.val = false;

				//now we can update the item
				f.apply(me.currentClassItem, [details.mName, details.propName, details.val]);
			} //endif select
		}

		//when an edit-in-place text field is submitted we need to get its value, update the span, and update our Class Item object
	}, {
		key: 'handleEditableTextSubmit',
		value: function handleEditableTextSubmit(me, f, e) {

			//get the element that fired the event
			var elem = $(e.target);

			//get details of this table item
			var details = this.tblItmDetails(elem);

			//now we can update the item
			f.apply(me.currentClassItem, [details.mName, details.propName, details.val]);

			//lets update the span...
			details.container.find('span').html(details.val).show();

			//and remove the text box!
			elem.remove();

			//we should rebuild the itnerface because the TR tag is now invalid
			//of course, I could do some complciated logic here to go an update the TR class, BUT
			//then id have to make special cases for the different sections...
			me.updateDOM();
		}

		//handle when an editable text field is clicked on one of the tables
	}, {
		key: 'handleEditableTextClick',
		value: function handleEditableTextClick(me, e) {

			e.preventDefault();

			//get the element that was clicked
			var elem = $(e.target);

			//if it was a span of type "editableTextField" then we can convert the field to a text box:
			if (elem.is('span') && elem.is('.editableTextField')) {

				//get the value of the span:
				var val;
				if (elem.is('.unset')) val = '';else val = elem.html();

				//hide the element
				elem.hide();

				//get the container for the element and the new textbox (it's parent)
				var container = elem.parent();

				//create an input box with the same value
				container.append('<input type="text" class="editInPlaceBox" value="' + val + '" style="width:' + container.width() + 'px"/>');

				//find and focus the textbox
				var editBox = container.find('input').focus().select();

				//bind an event to the editbox, should be become unfocused, just hide itself and restore the span!
				var dissolveBox = function dissolveBox(e) {
					editBox.remove();elem.show();
				};
				editBox.blur(dissolveBox);
				editBox.keydown(function (e) {
					if (e.keyCode == 27) dissolveBox();
				});
			} //end if is editableTextField span
		}

		//handle when an editable text field is clicked on one of the tables
	}, {
		key: 'handleDeleteRowClick',
		value: function handleDeleteRowClick(me, e, f) {

			e.preventDefault();

			//get the element that was clicked
			var elem = $(e.target);

			//if it was a span of type "editableTextField" then we can convert the field to a text box:
			if (elem.is('div') && elem.is('.deleteRow')) {

				//get details of this table item
				var details = this.tblItmDetails(elem);

				//remove the item from the ClassItem object
				f.apply(me.currentClassItem, [details.mName]);

				//remove the parent tr
				details.row.fadeOut('fast', function () {
					$(this).remove();
				});

				//if the table has no more TRs then just update the interface
				if (details.table.find('tr').length <= 1) me.updateDOM();
			} //end if is editableTextField span
		}

		//update the editor to be editing a new ClassItem object...
	}, {
		key: 'setClassItem',
		value: function setClassItem(clsItem) {

			//save the new class item:
			this.currentClassItem = clsItem;

			//update the DOM interface to reflect the new class!
			this.updateDOM();
		}

		//clears all fields and dom elements
	}, {
		key: 'clearDOM',
		value: function clearDOM() {
			this.DOM.find('input').val('');
			this.DOM.find('.infobox').html('');
			this.DOM.find('.entries').html('');
			this.area.classname.chkClassPublic.prop('checked', true);
			this.area.classname.chkClassFinal.prop('checked', false);
			this.area.classname.chkClassAbstract.prop('checked', false);
		}

		//make a select html box for the options
	}, {
		key: 'makeSelect',
		value: function makeSelect(value, options) {
			value = value.toString();
			var ret = '<select>';
			for (var opt in options) {
				var text = options[opt];
				ret += '<option value="' + opt + '" ' + (opt == value ? 'selected' : '') + ' >' + text + '</option>';
			} //next opt
			ret += '</select>';
			return ret;
		}

		//updates the DOM
	}, {
		key: 'updateDOM',
		value: function updateDOM() {

			//start with a fresh slate...
			this.clearDOM();

			//if there is no current class item, we out!
			if (this.currentClassItem == null || typeof this.currentClassItem === "undefined") return;

			//update the main class checkboxes
			this.area.classname.chkClassPublic.prop('checked', this.currentClassItem.getPublic());
			this.area.classname.chkClassFinal.prop('checked', this.currentClassItem.getFinal());
			this.area.classname.chkClassAbstract.prop('checked', this.currentClassItem.getAbstract());

			//update the class name box
			this.area.classname.txt.val(this.currentClassItem.getName());

			//only populate this box if data exists:
			if (this.currentClassItem.getAncestor() != null) this.area.ancestor.txt.val(this.currentClassItem.getAncestor());

			//get the interfaces of this item and build a table
			var interfaces = this.currentClassItem.getInterfaces();
			if (interfaces.length > 0) {
				var tbl = $('<table><tr><td>Implements Interface:</td><td width="0"></td></tr></table>');
				for (var i = 0; i < interfaces.length; i++) {
					tbl.append('<tr class="tr_' + interfaces[i].mName + '">' + '<td class="mName"><span class="editableTextField">' + interfaces[i].mName + '</span></td>' + '<td class="delete"><div class="deleteRow">DEL</div></td>' + '</tr>');
				} //next i
				this.area.interfaces.lst.append(tbl);
			}

			//get the members of this item and build a table
			var members = this.currentClassItem.getMembers();
			if (members.length > 0) {
				var tbl = $('<table>' + '<tr>' + '<td>Access</td>' + '<td>Static</td>' + '<td>Const/Final</td>' + '<td>Type</td>' + '<td>Name</td>' + '<td>Initial Value</td>' + '<td width="0"></td>' + '</tr>' + '</table>');
				for (var i = 0; i < members.length; i++) {
					var m = members[i];
					tbl.append('<tr class="tr_' + m.mName + '">' + '<td class="access">' + this.makeSelect(m.access, { 0: "private", 1: "public" }) + '</td>' + '<td class="isStatic">' + this.makeSelect(m.isStatic, { 'false': " - ", 'true': "static" }) + '</td>' + '<td class="isConst">' + this.makeSelect(m.isConst, { 'false': " - ", 'true': "const" }) + '</td>' + '<td class="mType">' + this.makeSelect(m.mType, { 1: "int", 2: "short", 3: "long", 4: "byte", 5: "float", 6: "double", 7: "char", 8: "string", 9: "boolean" }) + '</td>' + '<td class="mName"><span class="editableTextField">' + m.mName + '</span></td>' + '<td class="val"><span class="editableTextField ' + (m.val == null ? 'unset' : '') + '">' + (m.val == null ? '&lt;unset&gt;' : m.val) + '</span></td>' + '<td class="delete"><div class="deleteRow">DEL</div></td>' + '</tr>');
				} //next i
				this.area.members.lst.append(tbl);
			}

			//get the methods of this item and build a table
			var methods = this.currentClassItem.getMethods();
			if (methods.length > 0) {
				var tbl = $('<table>' + '<tr>' + '<td>Access</td>' + '<td>Static</td>' + '<td>Final</td>' + '<td>Return Type</td>' + '<td>Name</td>' + '<td>Params</td>' + '<td width="0"></td>' + '</tr>' + '</table>');
				for (var i = 0; i < methods.length; i++) {
					var m = methods[i];
					tbl.append('<tr class="tr_' + m.mName + '">' + '<td class="access">' + this.makeSelect(m.access, { 0: "private", 1: "public" }) + '</td>' + '<td class="isStatic">' + this.makeSelect(m.isStatic, { 'false': " - ", 'true': "static" }) + '</td>' + '<td class="isConst">' + this.makeSelect(m.isConst, { 'false': " - ", 'true': "const" }) + '</td>' + '<td class="mType">' + this.makeSelect(m.mType, { 0: "void", 1: "int", 2: "short", 3: "long", 4: "byte", 5: "float", 6: "double", 7: "char", 8: "string", 9: "boolean" }) + '</td>' + '<td class="mName"><span class="editableTextField">' + m.mName + '</td>' + '<td class="params">' + '()' + '</td>' + '<td class="delete"><div class="deleteRow">DEL</div></td>' + '</tr>');
				} //next i
				this.area.methods.lst.append(tbl);
			}
		}
	}]);

	return ClassEditor;
})();
/*
	This is the main class file for the ClassItem class

	So.. just to recap, ClassItems don't refer to actual classes in this projects code.
	Rather, ClassItems are the "classes" that the user is building.

*/

//making these constants global because apparently ES6 constants are next-to-useless unless global
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var PRIVATE = 0;
var PUBLIC = 1;

var VOID = 0;
var INT = 1;
var SHORT = 2;
var LONG = 3;
var BYTE = 4;
var FLOAT = 5;
var DOUBLE = 6;
var CHAR = 7;
var STRING = 8;
var BOOLEAN = 9;

var ClassItem = (function () {
	function ClassItem(ID) {
		var initialClassName = arguments.length <= 1 || arguments[1] === undefined ? "Untitled" : arguments[1];

		_classCallCheck(this, ClassItem);

		//save our given id
		this.ID = ID;

		//save our given name (or default)
		this.itmName = initialClassName;

		this.ancestorName = null;
		this.interfaces = [];
		this.members = [];
		this.methods = [];
		this.isPublic = true;
		this.isFinal = false;
		this.isAbstract = false;

		//add some events
		this.eventNameChange = new CallbackHelperObj();
		this.eventChange = new CallbackHelperObj();
	}

	//constructor(initialClassName);

	_createClass(ClassItem, [{
		key: 'getID',
		value: function getID() {
			return this.ID;
		}

		//setID(ID){ this.ID = ID; } //no setid, id's should be immutable

		//get/set the class name
	}, {
		key: 'getName',
		value: function getName() {
			return this.itmName;
		}
	}, {
		key: 'setName',
		value: function setName(n) {
			this.itmName = n;
			this.eventNameChange.fire(this.itmName);
			this.eventChange.fire();
		}

		//get/set access
	}, {
		key: 'getPublic',
		value: function getPublic() {
			return this.isPublic;
		}
	}, {
		key: 'setPublic',
		value: function setPublic(b) {
			this.isPublic = b;this.eventChange.fire();
		}

		//get/set final
	}, {
		key: 'getFinal',
		value: function getFinal() {
			return this.isFinal;
		}
	}, {
		key: 'setFinal',
		value: function setFinal(b) {
			this.isFinal = b;this.eventChange.fire();
		}

		//get/set abstract
	}, {
		key: 'getAbstract',
		value: function getAbstract() {
			return this.isAbstract;
		}
	}, {
		key: 'setAbstract',
		value: function setAbstract(b) {
			this.isAbstract = b;this.eventChange.fire();
		}

		//get/set the ancestor
	}, {
		key: 'getAncestor',
		value: function getAncestor() {
			return this.ancestorName;
		}
	}, {
		key: 'setAncestor',
		value: function setAncestor(n) {
			if (n == '') this.ancestorName = null;else this.ancestorName = n;
			this.eventChange.fire();
		}

		//interfaces are just strings... so just add / remove strings:
		//getInterfaces(){ return this.interfaces; }
		//addInterface(n){ if(this.interfaces.indexOf(n)<0) this.interfaces.push(n); }
		//remInterface(n){ this.interfaces = this.interfaces.filter(function(i){ return i!=n;}); }

		//get / add / remove / update interfaces
	}, {
		key: 'getInterfaces',
		value: function getInterfaces() {
			return this.interfaces;
		}
	}, {
		key: 'addInterface',
		value: function addInterface(n) {
			if (this.findByName(this.interfaces, n) === false) {
				this.interfaces.push({
					mName: n
				});
				this.eventChange.fire();
			}
		}
	}, {
		key: 'remInterfaceByName',
		value: function remInterfaceByName(n) {
			this.interfaces = this.interfaces.filter(function (i) {
				return i.mName !== n;
			});
			this.eventChange.fire();
		}
	}, {
		key: 'getInterfaceByName',
		value: function getInterfaceByName(n) {
			return this.interfaces[this.findByName(this.interfaces, n)];
		}
	}, {
		key: 'updateInterfaceByName',
		value: function updateInterfaceByName(n, prop, val) {
			var m = this.interfaces[this.findByName(this.interfaces, n)];

			//make sure the value is a string at least...
			val = val.toString();

			//special logic for names - make sure they fit the rules
			if (prop == 'mName') {
				//remove whitespace and quotes
				val = val.replace(/\"/g, "");
				val = val.replace(/\s/g, "");

				if (val == "") return;
			}

			m[prop] = val;
			this.eventChange.fire();
		}

		//get / add / remove / update members
	}, {
		key: 'getMembers',
		value: function getMembers() {
			return this.members;
		}
	}, {
		key: 'addMember',
		value: function addMember(n) {
			if (this.findByName(this.members, n) === false) {
				this.members.push({
					mName: n,
					access: PRIVATE,
					isStatic: false,
					isConst: false,
					mType: INT,
					val: 0
				});
				this.eventChange.fire();
			}
		}
	}, {
		key: 'remMemberByName',
		value: function remMemberByName(n) {
			this.members = this.members.filter(function (i) {
				return i.mName !== n;
			});
			this.eventChange.fire();
		}
	}, {
		key: 'getMemberByName',
		value: function getMemberByName(n) {
			return this.members[this.findByName(this.members, n)];
		}
	}, {
		key: 'updateMemberByName',
		value: function updateMemberByName(n, prop, val) {
			var m = this.members[this.findByName(this.members, n)];

			//make sure the value is a string at least...
			val = val.toString();

			//special logic for name, value, and type changes
			switch (prop) {
				case 'mName':
					//remove whitespace and quotes
					val = val.replace(/\"/g, "");
					val = val.replace(/\s/g, "");

					if (val == "") return;
					break;

				case 'val':
					if (prop == 'val') {
						if (val == '') val = null;else val = this.filterValueByType(val, m.mType);
					}
					break;

				case 'mType':
					//update the value based on the new type:
					m.val = this.filterValueByType(m.val.toString(), parseInt(val));
					break;
			} //swatch

			m[prop] = val;
			this.eventChange.fire();
		}

		//get / add / remove / update methods
	}, {
		key: 'getMethods',
		value: function getMethods() {
			return this.methods;
		}
	}, {
		key: 'addMethod',
		value: function addMethod(n) {
			if (this.findByName(this.methods, n) === false) {
				this.methods.push({
					mName: n,
					access: PUBLIC,
					isStatic: false,
					isConst: false,
					mType: VOID,
					params: []
				});
				this.eventChange.fire();
			}
		}
	}, {
		key: 'remMethodByName',
		value: function remMethodByName(n) {
			this.methods = this.methods.filter(function (i) {
				return i.mName !== n;
			});
			this.eventChange.fire();
		}
	}, {
		key: 'getMethodByName',
		value: function getMethodByName(n) {
			return this.methods[this.findByName(this.methods, n)];
		}
	}, {
		key: 'updateMethodByName',
		value: function updateMethodByName(n, prop, val) {
			var m = this.methods[this.findByName(this.methods, n)];

			//make sure the value is a string at least...
			val = val.toString();

			//special logic for names - make sure they fit the rules
			if (prop == 'mName') {
				//remove whitespace and quotes
				val = val.replace(/\"/g, "");
				val = val.replace(/\s/g, "");

				if (val == "") return;
			}

			m[prop] = val;
			this.eventChange.fire();
		}

		//given an array finds an item that has a certain name
	}, {
		key: 'findByName',
		value: function findByName(arr, name) {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i].mName == name) return i;
			}
			return false;
		}

		//filter a value by it's type
	}, {
		key: 'filterValueByType',
		value: function filterValueByType(val, type) {
			switch (type) {
				case INT:
				case SHORT:
				case LONG:
				case BYTE:

					//remove whitespace and quotes
					val = val.replace(/\"/g, "");
					val = val.replace(/\s/g, "");

					//check if its a number:
					if (val.match(/[^0-9.]/g) != null) val = "0";

					//remove anything after the first decimal, if there is one:
					val = val.split('.')[0];
					break;

				case FLOAT:
				case DOUBLE:

					//remove whitespace and quotes
					val = val.replace(/\"/g, "");
					val = val.replace(/\s/g, "");

					//check if its a number:
					if (val.match(/[^0-9.]/g) != null || val == '') val = "0";

					//remove extranous decimals, if any
					if (val.match(/\./g) != null) {
						if (val.match(/\./g).length > 1) val = val.split('.')[0] + '.' + val.split('.').splice(1).join('');
					} else val += '.0';

					break;

				case CHAR:

					//always just take the first char:
					if (val.length > 1) val = val.substr(0, 1);
					break;

				case BOOLEAN:
					if (val.toLowerCase() == 't') val = 'true';
					try {
						val = Boolean(JSON.parse(val.toLowerCase()));
					} catch (e) {
						val = false;
					}
					break;
			} //swatch

			return val;
		}

		//allow functions to be un/registerd for our name change event
	}, {
		key: 'onNameChange',
		value: function onNameChange(func) {
			return this.eventNameChange.register(func);
		}
	}, {
		key: 'unbindNameChange',
		value: function unbindNameChange(id) {
			return this.eventNameChange.unregister(id);
		}

		//allow functions to be un/registerd for our general change event
	}, {
		key: 'onChange',
		value: function onChange(func) {
			return this.eventChange.register(func);
		}
	}, {
		key: 'unbindChange',
		value: function unbindChange(id) {
			return this.eventChange.unregister(id);
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

			//if this item changes it's name, the list should be updated:
			var me = this;
			item.onNameChange(function () {
				me.updateList();
			});

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
				listItemsDOM.append('<div id="clsItm_' + item.getID() + '" class="listItem ' + (item.getID() == this.selectedClassItem ? 'selectedClassItem' : '') + '">' + item.getName()); //+' {'+item.getID()+'}</div>');
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