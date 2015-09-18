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
                this.tabMgr = new TabManager($('#divTabbedArea'));

                //Create an Initialize our ClassItemsManager. It expects a reference to the area in the sidebar for the list...
                this.classItmMgr = new ClassItemManager($('#divClassListArea'));

                //Keep track of which ClassItem is being worked on, or null if none
                this.currentClassItem = null;

                //Create and Initialize a new ClassEditor. It expects a reference to the current class object, and Editor Tab Page div
                this.editor = new ClassEditor(this.currentClassItem, $('#divEditor'));

                //we need to bind an event for when the user changes the selected class,
                //so we can update the editor
                this.classItmMgr.onSelectionChange(function (o) {
                        me.handleSelectionChange(me, o);
                });

                //and when the editor edits the selected ClassItem... so we can update the code tabs
                this.classItmMgr.onSelectionEdited(function (o) {
                        me.handleSelectionEdited(me, o);
                });

                //if the show extras check boxs is checked we should update the various code
                $('#chkShowExtras').bind('change click keyup', function (e) {
                        me.refreshCodeOutput();
                });

                //Create a Code style manager so the user can select different colorization styles for their code
                this.codeStyleMgr = new CodeStyleManager('css/hljs/', $('#divExtraOptionsArea'));

                //add some styles
                this.codeStyleMgr.addStyle("Atelier Forest Light", "atelier-forest.light.css");
                this.codeStyleMgr.addStyle("Atelier Health Light", "atelier-heath.light.css");
                this.codeStyleMgr.addStyle("Color Brewer", "color-brewer.css");
                this.codeStyleMgr.addStyle("HLJS", "default.css");
                this.codeStyleMgr.addStyle("Docco", "docco.css");
                this.codeStyleMgr.addStyle("Google Code", "googlecode.css");
                this.codeStyleMgr.addStyle("Idea", "idea.css");
                this.codeStyleMgr.addStyle("Tomorrow", "tomorrow.css");
                this.codeStyleMgr.addStyle("Visual Studio", "vs.css");
                this.codeStyleMgr.addStyle("X Code", "xcode.css");

                //select the Google Code style by default
                this.codeStyleMgr.setSelectedItemByName("Google Code");

                //instantiate the responsive-design helper that swaps out css depending out window size
                this.responsiveHelper = new ResponsiveHelper();

                //create a bunch of code generators for the tabs
                this.codeGenerators = [];
                this.codeGenerators.push(new JavaCodeGenerator($('#tabPage_Java')));
                this.codeGenerators.push(new CSharpCodeGenerator($('#tabPage_CSharp')));
                this.codeGenerators.push(new PythonCodeGenerator($('#tabPage_Python')));
                this.codeGenerators.push(new RubyCodeGenerator($('#tabPage_Ruby')));
                this.codeGenerators.push(new PHPCodeGenerator($('#tabPage_PHP')));
                this.codeGenerators.push(new JSCodeGenerator($('#tabPage_JS')));
                this.codeGenerators.push(new VBCodeGenerator($('#tabPage_VB')));
                this.codeGenerators.push(new PerlCodeGenerator($('#tabPage_Perl')));
                this.codeGenerators.push(new CppCodeGenerator($('#tabPage_Cpp')));
                this.codeGenerators.push(new SwiftCodeGenerator($('#tabPage_Swift')));

                //bind click events for load demo class links
                $('#aLoadThorough').click(function (e) {
                        me.classItmMgr.addClassItm(demoClasses.CompleteDemo());
                });
                $('#aLoadRoboKitty').click(function (e) {
                        me.classItmMgr.addClassItm(demoClasses.RoboKitty());
                });

                this.refreshCodeOutput();

                //return;

                //add default item for debugging
                this.classItmMgr.addClassItm(demoClasses.Blank());
                this.classItmMgr.addClassItm(demoClasses.OnlyMembers());
                this.classItmMgr.addClassItm(demoClasses.OnlyConstants());
                this.classItmMgr.addClassItm(demoClasses.OnlyStatics());
                this.classItmMgr.addClassItm(demoClasses.RoboKitty());
                this.classItmMgr.addClassItm(demoClasses.CompleteDemo());

                this.tabMgr.setTab('CSharp');
        }

        //update the app apropriately when the selected ClassItem changes, or becomes null

        _createClass(ClassDesignApp, [{
                key: 'handleSelectionChange',
                value: function handleSelectionChange(me, newItem) {

                        //update the editor...
                        me.editor.setClassItem(newItem);

                        //if the new item is null or undefined, that means no item is selected (e.g. the list was emptied)
                        if (typeof newItem === "undefined" || newItem == null) {

                                //hide the editor and show the welcome screen
                                $('#divEditor').hide();
                                $('#divWelcome').show();
                        } else {

                                //hide the weclome and show the editor screen
                                $('#divWelcome').hide();
                                $('#divEditor').show();
                        } //endif

                        //update the code sampels!
                        me.updateGenerators(newItem);
                }

                //update the app appropriately when the selected ClassItem is edited in the editor
        }, {
                key: 'handleSelectionEdited',
                value: function handleSelectionEdited(me, item) {
                        me.updateGenerators(item);
                }

                //update all the generators (whether or not they need it)
        }, {
                key: 'updateGenerators',
                value: function updateGenerators(item) {

                        //get the statis of our "extra code samples" check box to pass along
                        var extraCodeSamples = $('#chkShowExtras').is(":checked");

                        //update each of the code generators!
                        for (var g = 0; g < this.codeGenerators.length; g++) {

                                //get the generator
                                var generator = this.codeGenerators[g];

                                //tell it to update it's class
                                generator.update(item, extraCodeSamples);
                        } //next g
                }

                //refresh the code genreators!
        }, {
                key: 'refreshCodeOutput',
                value: function refreshCodeOutput() {
                        this.updateGenerators(this.editor.currentClassItem);
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
			var getName = function getName(str) {
				var itms = str.split('_');
				itms = itms.splice(1);
				str = itms.join('_');
				return str;
			};
			return {
				val: elem.val(),
				propName: elem.parent().attr('class'),
				mName: getName(elem.parent().parent().attr('class').split(' ')[0]),
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
				if (details.val == 'true') details.val = true;
				if (details.val == 'false') details.val = false;

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
var PROTECTED = 2;

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
			this.eventChange.fire(this);
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
			this.isPublic = b;this.eventChange.fire(this);
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
			this.isFinal = b;this.eventChange.fire(this);
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
			this.isAbstract = b;this.eventChange.fire(this);
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
			this.eventChange.fire(this);
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
			if (typeof n == 'string') n = [n];
			for (var i in n) {
				var v = n[i];
				if (this.findByName(this.interfaces, v) === false) {
					this.interfaces.push({
						mName: v
					});
					this.eventChange.fire(this);
				}
			} //next i
		}
	}, {
		key: 'remInterfaceByName',
		value: function remInterfaceByName(n) {
			this.interfaces = this.interfaces.filter(function (i) {
				return i.mName !== n;
			});
			this.eventChange.fire(this);
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

			if (val == "true") val = true;
			if (val == "false") val = false;

			m[prop] = val;
			this.eventChange.fire(this);
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
			if (typeof n == 'string') {
				if (this.findByName(this.members, n) === false) {
					this.members.push({
						mName: n,
						access: PRIVATE,
						isStatic: false,
						isConst: false,
						mType: INT,
						val: null
					});
					this.eventChange.fire(this);
				}
			} else if (typeof n == 'object') {
				if (this.findByName(this.members, n.mName) === false) {
					this.members.push(n);
					this.eventChange.fire(this);
				}
			}
		}
	}, {
		key: 'remMemberByName',
		value: function remMemberByName(n) {
			this.members = this.members.filter(function (i) {
				return i.mName !== n;
			});
			this.eventChange.fire(this);
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
					if (val == '') val = null;else val = this.filterValueByType(val, parseInt(m.mType));
					break;

				case 'mType':
					//update the value based on the new type:
					if (m.val != null) m.val = this.filterValueByType(m.val.toString(), parseInt(val));
					break;

				default:
					if (val == "true") val = true;
					if (val == "false") val = false;
			} //swatch

			m[prop] = val;
			this.eventChange.fire(this);
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
			if (typeof n == 'string') {
				if (this.findByName(this.methods, n) === false) {

					this.methods.push({
						mName: n,
						access: PUBLIC,
						isStatic: false,
						isConst: false,
						isAbstract: false,
						mType: VOID,
						params: []
					});
					this.eventChange.fire(this);
				}
			} else if (typeof n == 'object') {
				if (this.findByName(this.methods, n.mName) === false) {
					this.methods.push(n);
					this.eventChange.fire(this);
				}
			}
		}
	}, {
		key: 'remMethodByName',
		value: function remMethodByName(n) {
			this.methods = this.methods.filter(function (i) {
				return i.mName !== n;
			});
			this.eventChange.fire(this);
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

			if (val == "true") val = true;
			if (val == "false") val = false;

			m[prop] = val;
			this.eventChange.fire(this);
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

		//for our own events lets make some helper objects
		this.eventSelectionChange = new CallbackHelperObj();
		this.eventSelectionEdited = new CallbackHelperObj();
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

		//Handle when an item is clicked by capturing it's bubble on the way up
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

		//Handle when the selected object is edited by the editor.. this way we can fire an event and the app knows to update the source tabs
	}, {
		key: 'handleSelectedEdited',
		value: function handleSelectedEdited(item) {

			//if this is the currently selected object, let's fire our change event
			if (item.ID == this.selectedClassItem) this.eventSelectionEdited.fire(item);
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

			//if this item is edited at all, we should check if its the selected object
			//and fire an event if it is
			var me = this;
			item.onChange(function (item) {
				me.handleSelectedEdited(item);
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

		//allow functions to be un/registerd for our SelectedObjectEdited event
	}, {
		key: 'onSelectionEdited',
		value: function onSelectionEdited(func) {
			return this.eventSelectionEdited.register(func);
		}
	}, {
		key: 'unbindSelectionEdited',
		value: function unbindSelectionEdited(id) {
			return this.eventSelectionEdited.unregister(id);
		}
	}]);

	return ClassItemManager;
})();
/*
	This the parent class for all the language code generators.

	This class is ABSTRACT and must be subclassed, since the buildcode() function as well as private member variables will only be defined in the individual code generators.

	Each language supported will extend this class and only write the methods to generate code and of course the constructor to initialize variables

	Code generators have the following responsibilities:
		- Manage the DOM for the area where the code will be displayed (in tabs..)
		- Generate code when given a new ClassItem object

*/
//Abstract!
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CodeGenerator = (function () {
	function CodeGenerator(DOM) {
		_classCallCheck(this, CodeGenerator);

		//save reference to the dom element this code generator will reside in
		this.DOM = DOM;
	}

	//takes a class item and rebuilds the appropriate source code based on the class item for this language

	_createClass(CodeGenerator, [{
		key: "update",
		value: function update(item, extraCodeSamples) {

			var code;

			//if the item is null, just update with the default comment
			if (typeof item === "undefined" || item == null) code = this.buildDefaultComment();else {

				//inspect useful data on our item:
				var info = this.inspect(item);

				//variable to build the code
				code = this.buildCode(item, info);
			}

			//if "extraCodeSamples" was specified, we should add a second section with generic code samples
			if (extraCodeSamples == true) {

				code += "\n\n<hr>" + this.buildExtraSamplesComment() + this.buildExtraSamplesCode() + "\n\n\n";
			}

			//update the code inside the code tag
			this.codeDOM.html(code);

			//apply the code highlighting
			hljs.highlightBlock(this.codeDOM[0]);
		}

		//when generating warnings, or processing the lists of members and methods, some general pre-processing of the ClassItem would be useful
	}, {
		key: "inspect",
		value: function inspect(item) {

			//prevent some redundancy in the JSON
			var _methods = item.getMethods();
			var _publicMethods = _methods.filter(function (n) {
				return n.access == PUBLIC;
			});
			var _privateMethods = _methods.filter(function (n) {
				return n.access == PRIVATE;
			});
			var _protectedMethods = _methods.filter(function (n) {
				return n.access == PROTECTED;
			});
			var _staticMethods = _methods.filter(function (n) {
				return n.isStatic == true;
			});
			var _constMethods = _methods.filter(function (n) {
				return n.isConst == true;
			});
			var _abstractMethods = _methods.filter(function (n) {
				return n.isAbstract == true;
			});
			var _abstractFinalMethods = _methods.filter(function (n) {
				return n.isAbstract == true && n.isFinal == true;
			});

			var _members = item.getMembers();
			var _publicMembers = _members.filter(function (n) {
				return n.access == PUBLIC;
			});
			var _privateMembers = _members.filter(function (n) {
				return n.access == PRIVATE;
			});
			var _protectedMembers = _members.filter(function (n) {
				return n.access == PROTECTED;
			});
			var _staticMembers = _members.filter(function (n) {
				return n.isStatic == true;
			});
			var _constMembers = _members.filter(function (n) {
				return n.isConst == true;
			});
			var _initMembers = _members.filter(function (n) {
				return n.val != null;
			});

			//build one giant object of infos!
			var ret = {

				//pass through properties
				name: item.getName(),
				isPublic: item.getPublic(),
				isAbstract: item.getAbstract(),
				isFinal: item.getFinal(),

				//inheritance realted info:
				hasAncestor: typeof (item.getAncestor() != "undefined") && item.getAncestor() != null,
				ancestor: item.getAncestor(),

				//interface related info:
				hasInterfaces: item.getInterfaces().length > 0,
				interfaces: item.getInterfaces(),

				//member related info:
				members: _members,
				hasMembers: _members.length > 0,

				publicMembers: _publicMembers,
				hasPublicMembers: _publicMembers.length > 0,

				privateMembers: _privateMembers,
				hasPrivateMembers: _privateMembers.length > 0,

				protectedMembers: _protectedMembers,
				hasProtectedMembers: _protectedMembers.length > 0,

				staticMembers: _staticMembers,
				hasStaticMembers: _staticMembers.length > 0,

				constMembers: _constMembers,
				hasConstMembers: _constMembers.length > 0,

				initMembers: _initMembers,
				hasInitMembers: _initMembers.length > 0,

				//method related info:
				methods: _methods,
				hasMethods: _methods.length > 0,

				publicMethods: _publicMethods,
				hasPublicMethods: _publicMethods.length > 0,

				privateMethods: _privateMethods,
				hasPrivateMethods: _privateMethods.length > 0,

				protectedMethods: _protectedMethods,
				hasProtectedMethods: _protectedMethods.length > 0,

				staticMethods: _staticMethods,
				hasStaticMethods: _staticMethods.length > 0,

				constMethods: _constMethods,
				hasConstMethods: _constMethods.length > 0,

				abstractMethods: _abstractMethods,
				hasAbstractMethods: _abstractMethods.length > 0,

				abstractFinalMethods: _abstractFinalMethods,
				hasAbstractFinalMethods: _abstractFinalMethods.length > 0

			}; //var ret

			return ret;
		}
		//inspect(item)

		//make the first letter of a string capitol
	}, {
		key: "firstToUpper",
		value: function firstToUpper(str) {
			str = str.toString();
			return str.toString().substr(0, 1).toUpperCase() + str.toString().substr(1);
		}

		//make a comment
	}, {
		key: "comment",
		value: function comment(str) {
			var addNewLine = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

			return this.singleLineComments + str + (addNewLine ? "\n" : "");
		}

		//wrap a string in multiline comments
	}, {
		key: "wrapMuliLineComment",
		value: function wrapMuliLineComment(str) {

			str = str.split("\n");

			//truncate trailing newline if necessary
			if (str[str.length - 1] == '') str = this.multiLineComments.prefix + str.slice(0, str.length - 1).join("\n" + this.multiLineComments.prefix);else str = this.multiLineComments.prefix + str.join("\n" + this.multiLineComments.prefix);

			return this.multiLineComments.open + str + this.multiLineComments.close;
		}

		//check if this supports a feature or not
	}, {
		key: "checkSupports",
		value: function checkSupports(feature) {
			//assume supports, otherwise return value set
			if (typeof feature === 'undefined' || feature != true && feature != false) return true;else return feature;
		}

		//build the default commenting telling the user to goto the editor tab, etc.
	}, {
		key: "buildDefaultComment",
		value: function buildDefaultComment() {
			return this.wrapMuliLineComment("Please create a class on the left, and edit it with the Editor tab!\n" + "<-----");
		}

		//adds some comments with warnings
	}, {
		key: "buildCode_Warnings",
		value: function buildCode_Warnings(item, info) {

			var ret = this.getWarningText(info);

			//finish up the comment
			ret = this.wrapMuliLineComment(ret) + "\n";

			return ret;
		}

		//make the warning text bassed on the classes properities
	}, {
		key: "getWarningText",
		value: function getWarningText(info) {
			var ret = "Warning! The following " + this.langName + " code is automatically generated and may contain errors.\n" + "Classetta tries to be accurate as possible, but only provides minimal error checking.\n" + "Garbage In = Garbage Out. Make sure to use proper " + this.langName + " names, legal characters, not reserved words, etc.\n";

			//make a handy private method to generate a warning line
			var me = this;
			var hasWarnings = false;
			var warn = function warn(statement) {
				ret += "\nWarning! " + statement;hasWarnings = true;
			};

			// CLASS LEVEL WARNINGS

			if (info.isAbstract && info.isFinal) warn("You specified both Abstract and Final. That's probably not what you meant.");

			if (info.isPublic == false && !this.checkSupports(this.features["private"])) warn(this.langName + " doesn't support Private classes.");

			if (info.isFinal && !this.checkSupports(this.features.final)) warn(this.langName + " doesn't support Final classes.");

			if (info.isAbstract && !this.checkSupports(this.features.abstract)) warn(this.langName + " doesn't support Abstract classes.");

			if (info.hasAncestor && !this.checkSupports(this.features.inheritance)) warn(this.langName + " doesn't support Inheritance. Ignoring ancestor: " + info.ancestor);

			if (info.hasInterfaces && !this.checkSupports(this.features.interfaces)) {
				var names = [];
				for (var i = 0; i < info.interfaces.length; i++) names.push(info.interfaces[i].mName);
				names = names.join(', ');
				warn(this.langName + " doesn't support Interfaces. Ignoring: " + names);
			}

			if ((info.hasMethods || info.hasMembers) && !this.checkSupports(this.features.types)) warn(this.langName + " is not a Typed language. Ignoring Method/Member Type declarations.");

			// MEMBER LEVEL WARNINGS

			if (info.hasConstMembers && !this.checkSupports(this.features.members.final)) warn(this.langName + " doesn't support Constant Members! Declaring as regular Members instead.");

			if (info.hasProtectedMembers && !this.checkSupports(this.features.members["protected"])) warn(this.langName + " doesn't support Protected Members! Declaring as Private Members instead.");

			if (info.hasPrivateMembers && !this.checkSupports(this.features.members["private"])) warn(this.langName + " doesn't support Private Members! Declaring as regular Members instead.");

			if (info.hasStaticMembers && !this.checkSupports(this.features.members["static"])) warn(this.langName + " doesn't support Static Members! Declaring as regular Members instead.");

			// METHOD LEVEL WARNINGS

			if (info.hasAbstractFinalMethods) {
				var names = [];
				for (var i = 0; i < info.abstractFinalMethods.length; i++) names.push(info.abstractFinalMethods[i].mName);
				names = names.join(', ');
				warn("The Methods: [" + names + "] were specified as both Abstract and Final.  That's probably not what you meant.");
			}

			if (info.hasConstMethods && !this.checkSupports(this.features.methods.final)) warn(this.langName + " doesn't support Final Methods! Declaring as regular Methods instead.");

			if (info.hasAbstractMethods && !this.checkSupports(this.features.methods.abstract)) warn(this.langName + " doesn't support Abstract Methods! Declaring as regular Methods instead.");

			if (info.hasProtectedMethods && !this.checkSupports(this.features.methods["protected"])) warn(this.langName + " doesn't support Protected Methods! Declaring as Private Methods instead.");

			if (info.hasPrivateMethods && !this.checkSupports(this.features.methods["private"])) warn(this.langName + " doesn't support Private Methods! Declaring as regular Methods instead.");

			if (info.hasStaticMethods && !this.checkSupports(this.features.methods["static"])) warn(this.langName + " doesn't support Static Methods! Declaring as regular Methods instead.");

			//add extra newline if has warnings
			if (hasWarnings) ret += "\n";

			//return our list of warnings!
			return ret;
		}

		// Build a quick little comment to denote the extra code samples section
	}, {
		key: "buildExtraSamplesComment",
		value: function buildExtraSamplesComment() {

			var ret = "EXTRA CODE SAMPLES:\n" + "-------------------\n" + "The following section is not part of the class implementation.\n" + "Below you will find sample code for various common routines in " + this.langName + ".\n" + "To disable this section, uncheck \"Show Extra Code Samples\" On the left.";

			ret = this.wrapMuliLineComment(ret) + "\n\n";

			return ret;
		}

		// Let the target languages override this method
	}, {
		key: "buildExtraSamplesCode",
		value: function buildExtraSamplesCode() {

			return this.comment("buildExtraSamplesCode() was not overridden in " + this.langName);
		}
	}]);

	return CodeGenerator;
})();
/*
	This is the main class file for our StyleManager.

	Basically this adds, appends, and manages stylesheets so the HighlightJS (HLJS) Code samples can be re-styled by the user.
*/
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var CodeStyleManager = (function () {
		function CodeStyleManager(baseCSSPath, ListAreaDOM) {
				_classCallCheck(this, CodeStyleManager);

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
				this.listDOM.click(function (e) {
						me.handleListClick(me, this, e);
				});

				//and prevent dragging from messing everything up with highlighting
				this.listDOM.mousedown(function (e) {
						e.preventDefault();
				});

				//for our own events lets make some helper objects
				this.eventSelectionChange = new CallbackHelperObj();
		}

		//constructor

		/* EVENT HANDLERS +++ EVENT HANDLERS +++ EVENT HANDLERS +++ EVENT HANDLERS +++ EVENT HANDLERS +++ EVENT HANDLERS */
		//Handle when an item is clicked by capturing it's bubble on the way up

		_createClass(CodeStyleManager, [{
				key: 'handleListClick',
				value: function handleListClick(me, item, e) {

						//check if the target has an id:
						var targetID = $(e.target).attr('id');
						if (!(typeof targetID === "undefined")) {

								//make sure the first half of the id is "style_"
								if (targetID.substr(0, 6) == "style_") {

										//get the ID of the class item clicked:
										var styleID = parseInt(targetID.split('_')[1]);

										//change which item is selected:
										me.setSelectedItem(styleID);
								} //matches correct id pattern
						} //end if has ID
				}

				/* METHODS +++ METHODS +++ METHODS +++ METHODS +++ METHODS +++ METHODS +++ METHODS +++ METHODS +++ METHODS +++ METHODS */

				//allow the base bath to be get/set
		}, {
				key: 'setBaseCSSPath',
				value: function setBaseCSSPath(path) {
						this.baseCSSPath = path;
				}
		}, {
				key: 'getBaseCSSPath',
				value: function getBaseCSSPath() {
						return this.baseCSSPath;
				}

				//add a style to our list of styles
		}, {
				key: 'addStyle',
				value: function addStyle(styleName, fileName) {

						//make a simple item object
						var item = {
								ID: this.IDCounter++,
								name: styleName,
								fileName: fileName
						};

						//add the style to our list of styles
						this.styles.push(item);

						//as soon as at lease one style is present, we should select it
						if (this.selectedStyle < 0) this.setSelectedItem(item.ID);

						//we should add a link to this file to the head area
						var CSSPath = this.baseCSSPath + item.fileName;
						$('head').append('<link id="css_' + item.ID + '" class="cssCodeStyle" rel="stylesheet" type="text/css" href="' + CSSPath + '" disabled />');

						//and rebuild our list of styles:
						this.updateList();
				}

				//remove a style from our list of styles
		}, {
				key: 'removeStyle',
				value: function removeStyle(styleID) {

						//we need to find where in the array it is so we can splice it out
						var arrayPos = this.findIndexByID(styleID);

						//if nothing was found, it's not present and therefore cant be removed
						//note: must use ===false and NOT !arrayPos because 0 is a valid position!
						if (arrayPos === false) return;

						//other wise, let's split the item out of our array:
						this.styles.splice(arrayPos, 1);

						//now we need to update which item is selected.. this is the tricky part.
						//IF there were more items after the array, in theory the arrayPos variable should
						//still be in valid range... we should just select that one.
						//BUT if we deleted an item from the end of the list, then arrayPos will now be out
						//of bounds... so we should just select array.length-1;
						//but if the array is now empty, we should just select -1 for no item!
						var newItemPos;
						if (this.styles.length <= 0) this.setSelectedItem(-1);else if (arrayPos <= this.styles.length - 1) this.setSelectedItem(this.styles[arrayPos].ID);else this.setSelectedItem(this.styles[this.styles.length - 1].ID);

						//we should remove the old CSS file from the head-dom
						$('#css_' + styleID).remove();
				}

				//check all our styles and look for one with the given id
		}, {
				key: 'findIndexByID',
				value: function findIndexByID(styleID) {

						//loop over all our styles
						for (var i = 0; i < this.styles.length; i++) {

								//check if the ID matches:
								if (this.styles[i].ID == styleID) return i;
						} //next i

						//nothing was found? return false as error code
						return false;
				}

				//check all our stles and look for one with a matching name
		}, {
				key: 'findIndexByName',
				value: function findIndexByName(name) {

						//loop over all our styles
						for (var i = 0; i < this.styles.length; i++) {

								//check if the ID matches:
								if (this.styles[i].name == name) return i;
						} //next i

						//nothing was found? return false as error code
						return false;
				}

				//get a reference to one of the styles by it's ID
		}, {
				key: 'getStyleByID',
				value: function getStyleByID(styleID) {
						return this.styles[this.findIndexByID(styleID)];
				}

				//get a style by its name
		}, {
				key: 'getStyleByName',
				value: function getStyleByName(name) {
						return this.styles[this.findIndexByName(name)];
				}

				//change which item is selected, by name
		}, {
				key: 'setSelectedItemByName',
				value: function setSelectedItemByName(name) {
						var item = this.getStyleByName(name);
						if (item == false) return;
						this.setSelectedItem(item.ID);
				}

				//change which item is currently selected
		}, {
				key: 'setSelectedItem',
				value: function setSelectedItem(styleID) {

						//update the index
						this.selectedStyle = styleID;

						//disable all the other CSS links
						$('.cssCodeStyle').prop('disabled', true);

						//enable only the selected one
						$('#css_' + styleID).prop('disabled', false);

						//and rebuild our list:
						this.updateList();

						//fire the event for the selection change!
						this.eventSelectionChange.fire(this.getStyleByID(styleID));
				}

				//Rebuild the DOM List of items
		}, {
				key: 'updateList',
				value: function updateList() {

						//create an empty div to add the items to
						var listItemsDOM = $('<div class="listItems"></div>');

						var top = this.listDOM.scrollTop();

						//loop over our styles and update the dom list
						for (var i = 0; i < this.styles.length; i++) {

								//loop over all our items
								var item = this.styles[i];

								//add a row for this item. Auto add in the "selected" identifier if the ID's match
								listItemsDOM.append('<div id="style_' + item.ID + '" class="listItem ' + (item.ID == this.selectedStyle ? 'selectedClassItem' : '') + '">' + item.name); //+' {'+item.getID()+'}</div>');
						} //next i

						//update the list DOM
						//this.listDOM.find('.listItems').remove();
						this.listDOM.html(listItemsDOM);

						this.listDOM.scrollTop(top);
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

		return CodeStyleManager;
})();
'use strict';

var demoClasses = {

		Blank: function Blank() {
				return new ClassItem(100);
		},
		CompleteDemo: function CompleteDemo() {

				var NewItem = new ClassItem(101);
				NewItem.setName('ThoroughDemo');
				NewItem.setAncestor('SomeClass');
				NewItem.addInterface(['Demoable', 'Listable', 'Comparable']);
				NewItem.setPublic(true);
				NewItem.setFinal(false);
				NewItem.setAbstract(false);

				//MEMBERS
				NewItem.addMember({
						mName: 'anInt',
						access: PUBLIC,
						isStatic: true,
						isConst: true,
						mType: INT,
						val: null
				});
				NewItem.addMember({
						mName: 'aShort',
						access: PUBLIC,
						isStatic: true,
						isConst: false,
						mType: SHORT,
						val: 12300
				});
				NewItem.addMember({
						mName: 'aLong',
						access: PUBLIC,
						isStatic: false,
						isConst: true,
						mType: LONG,
						val: 123000000
				});
				NewItem.addMember({
						mName: 'aByte',
						access: PUBLIC,
						isStatic: false,
						isConst: false,
						mType: BYTE,
						val: 123
				});
				NewItem.addMember({
						mName: 'aFloat',
						access: PRIVATE,
						isStatic: false,
						isConst: false,
						mType: FLOAT,
						val: 3.14
				});
				NewItem.addMember({
						mName: 'aDouble',
						access: PRIVATE,
						isStatic: false,
						isConst: false,
						mType: DOUBLE,
						val: 3.14159
				});
				NewItem.addMember({
						mName: 'aChar',
						access: PRIVATE,
						isStatic: false,
						isConst: false,
						mType: CHAR,
						val: 'g'
				});
				NewItem.addMember({
						mName: 'aString',
						access: PRIVATE,
						isStatic: false,
						isConst: false,
						mType: STRING,
						val: "Classetta Rules!"
				});
				NewItem.addMember({
						mName: 'aBoolean',
						access: PRIVATE,
						isStatic: false,
						isConst: false,
						mType: BOOLEAN,
						val: true
				});

				//METHODS
				NewItem.addMethod({
						mName: 'main',
						access: PUBLIC,
						isStatic: true,
						isConst: false,
						mType: VOID,
						params: []
				});
				NewItem.addMethod({
						mName: 'foo',
						access: PRIVATE,
						isStatic: false,
						isConst: true,
						mType: LONG,
						params: []
				});
				NewItem.addMethod({
						mName: 'compare',
						access: PUBLIC,
						isStatic: false,
						isConst: false,
						mType: BOOLEAN,
						params: []
				});
				NewItem.addMethod({
						mName: 'list',
						access: PUBLIC,
						isStatic: false,
						isConst: false,
						mType: STRING,
						params: []
				});
				NewItem.addMethod({
						mName: 'doDemo',
						access: PUBLIC,
						isStatic: false,
						isConst: false,
						mType: VOID,
						params: []
				});

				return NewItem;
		},

		RoboKitty: function RoboKitty() {

				var NewItem = new ClassItem(102);
				NewItem.setName('RoboKitty');
				NewItem.setAncestor('Cat');
				NewItem.addInterface(['Petable', 'Chargeable']);
				NewItem.setPublic(true);
				NewItem.setFinal(true);
				NewItem.setAbstract(false);

				//MEMBERS
				NewItem.addMember({
						mName: 'livesLeft',
						access: PUBLIC,
						isStatic: false,
						isConst: false,
						mType: INT,
						val: 9
				});
				NewItem.addMember({
						mName: 'batteryLevel',
						access: PRIVATE,
						isStatic: false,
						isConst: false,
						mType: DOUBLE,
						val: 100.0
				});
				NewItem.addMember({
						mName: 'MAX_LIVES',
						access: PUBLIC,
						isStatic: false,
						isConst: true,
						mType: INT,
						val: 9
				});
				NewItem.addMember({
						mName: 'name',
						access: PRIVATE,
						isStatic: false,
						isConst: false,
						mType: STRING,
						val: "DeathClaw"
				});

				//METHODS
				NewItem.addMethod({
						mName: 'getName',
						access: PUBLIC,
						isStatic: false,
						isConst: true,
						mType: STRING,
						params: []
				});
				NewItem.addMethod({
						mName: 'setName',
						access: PUBLIC,
						isStatic: false,
						isConst: true,
						mType: VOID,
						params: []
				});
				NewItem.addMethod({
						mName: 'reCharge',
						access: PUBLIC,
						isStatic: false,
						isConst: false,
						mType: BOOLEAN,
						params: []
				});
				NewItem.addMethod({
						mName: 'pet',
						access: PUBLIC,
						isStatic: false,
						isConst: false,
						mType: VOID,
						params: []
				});
				NewItem.addMethod({
						mName: 'attack',
						access: PUBLIC,
						isStatic: false,
						isConst: false,
						mType: VOID,
						params: []
				});

				NewItem.addMethod({
						mName: 'computeTrajectory',
						access: PRIVATE,
						isStatic: true,
						isConst: false,
						mType: DOUBLE,
						params: []
				});

				return NewItem;
		},

		OnlyMembers: function OnlyMembers() {
				var NewItem = new ClassItem(104);

				NewItem.setName('OnlyMembers');

				NewItem.addMember('a');
				NewItem.addMember('b');
				NewItem.addMember('c');

				return NewItem;
		},

		OnlyConstants: function OnlyConstants() {
				var NewItem = new ClassItem(105);

				NewItem.setName('OnlyConstants');

				NewItem.addMember('a');
				NewItem.getMemberByName('a').isConst = true;

				NewItem.addMember('b');
				NewItem.getMemberByName('b').isConst = true;

				NewItem.addMember('c');
				NewItem.getMemberByName('c').isConst = true;

				return NewItem;
		},

		OnlyStatics: function OnlyStatics() {
				var NewItem = new ClassItem(106);

				NewItem.setName('OnlyStatics');

				NewItem.addMember('a');
				NewItem.getMemberByName('a').isStatic = true;

				NewItem.addMember('b');
				NewItem.getMemberByName('b').isStatic = true;

				NewItem.addMember('c');
				NewItem.getMemberByName('c').isStatic = true;

				return NewItem;
		}
};
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var ResponsiveHelper = (function () {
	function ResponsiveHelper() {
		_classCallCheck(this, ResponsiveHelper);

		//for scope resolution in call backs
		var me = this;

		//bind an event for when the window resizes
		$(document).ready(function () {
			$(window).resize(function (e) {
				me.onResize(me, e);
			});

			me.onResize(me, null);
		});
	}

	//when the window resizes...

	_createClass(ResponsiveHelper, [{
		key: 'onResize',
		value: function onResize(me, e) {

			//get windows width
			var width = $(window).width();

			//start with nothing
			$('#topTabsContainer').removeClass('smallMode mediumMode rowsMode');

			if (width < 960) $('#topTabsContainer').addClass('rowsMode');

			if (width >= 1390) {
				//$('#topTabsContainer').removeClass('smallMode mediumMode');
				$('#topTabsContainer').removeClass('smallMode mediumMode rowsMode');
			} else if (width >= 1180) {
				$('#topTabsContainer').addClass('mediumMode');
			} else {
				$('#topTabsContainer').addClass('smallMode');
			}
		}
	}]);

	return ResponsiveHelper;
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
								me.tabs[name] = $('<div id="tabPage_' + name + '" class="tabPage"></div>');

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

						//change the tab by name
						me.setTab(name);
				}

				//Change to a tab of given name
		}, {
				key: 'setTab',
				value: function setTab(name) {
						//hide all other tabs:
						this.pagesDOM.hide().removeClass('initialTabPage');

						//update the background
						this.DOM.removeClass().addClass('tabPage' + name + 'BG');

						//update tab sytles:
						this.tabsDOM.removeClass('activeTab');
						$('#tab_' + name).addClass('activeTab');

						//show just the tab we care about:
						this.tabs[name].show();
				}
		}]);

		return TabManager;
})();
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Foo =

//let g = 69;

function Foo() {
  _classCallCheck(this, Foo);

  this.c = 69;
  Foo.count++;

  //this.g = const
  console.log(Foo.count);
};

Foo.count = 0;

var Employee = (function () {
  function Employee() {
    _classCallCheck(this, Employee);

    this.name = "Ravi";
  }

  _createClass(Employee, [{
    key: "setName",
    value: function setName(name) {
      this.name = name;
    }
  }], [{
    key: "getCounter",
    value: function getCounter() {
      if (!this.counter && this.counter !== 0) {
        this.counter = 0;
      } else {
        this.counter++;
      }
      return this.counter;
    }
  }]);

  return Employee;
})();
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CppCodeGenerator = (function (_CodeGenerator) {
	_inherits(CppCodeGenerator, _CodeGenerator);

	function CppCodeGenerator(DOM) {
		_classCallCheck(this, CppCodeGenerator);

		_get(Object.getPrototypeOf(CppCodeGenerator.prototype), "constructor", this).call(this, DOM);

		//Make note of language name
		this.langName = "C++";

		//set up comment styles
		this.singleLineComments = "// ";
		this.multiLineComments = { open: '/*\n',
			close: '\n*/',
			prefix: "\t" };

		//set up what this class supports:
		//Note: support is assumed by default, so this only has to disable features
		this.features = {
			methods: {},
			members: {}
		};

		//build the area for the code:
		this.DOM.append("<pre><code class=\"cpp\"></code></pre>");

		//cache reference to the PRE tag
		this.codeDOM = $(this.DOM.find('code'));
	}

	//builds the code!

	_createClass(CppCodeGenerator, [{
		key: "buildCode",
		value: function buildCode(item, info) {

			//variable to build the code
			var ret = this.buildCode_Warnings(item, info) + this.buildCode_Definition(item, info) + "\n\n" + this.buildCode_Constructor(item, info) + "\n\n" + this.buildCode_Destructor(item, info) + "\n\n" + this.buildCode_PublicItems(item, info) + this.buildCode_ProtectedItems(item, info) + this.buildCode_PrivateItems(item, info) + "}";

			return ret;
		}

		//build essentially the first line of the class: the defition
	}, {
		key: "buildCode_Definition",
		value: function buildCode_Definition(item, info) {

			var ret = '';

			//check if this code requires strings:
			var arr1 = info.methods.filter(function (n) {
				return n.mType == STRING;
			});
			var arr2 = info.members.filter(function (n) {
				return n.mType == STRING;
			});
			if (arr1.length > 0 || arr2.length > 0) ret += "#include &lt;string&gt;\n" + "using std::string;\n\n";

			if (!info.isPublic) ret += this.comment("NOTE: to have a private class, it must be placed under the \"private:\" header of the containing class:") + "private:\n";

			//build the left part that usually looks like "public final class foo"
			ret += 'class ' + info.name + ' ' + (info.isFinal ? 'final ' : '');
			//((info.isAbstract)?'abstract ':'')+

			//if it extends anything, add that here:
			if (info.hasAncestor) ret += ': public ' + info.ancestor;

			//if it implements any interfaces, add those here:
			if (info.hasInterfaces) {
				if (info.hasAncestor) ret += ', ';else ret += ' : ';
				for (var i = 0; i < info.interfaces.length; i++) ret += 'public ' + info.interfaces[i].mName + ', ';
				//truncate last two chars (', ')
				ret = ret.substring(0, ret.length - 2);
			}

			//finally add the '{'
			ret += ' {';
			return ret;
		}

		//build a constructor method for the class:
	}, {
		key: "buildCode_Constructor",
		value: function buildCode_Constructor(item, info) {

			var ret = "\t" + this.comment("Constructor") + "\t" + info.name + "()";

			//if the class has an ancestor lets call super in the constructor!
			if (info.hasAncestor) ret += " : " + info.ancestor + "()";

			ret += "{\n" + "\n\t\t" + this.comment("...") + "\t}";
			return ret;
		}

		//build a constructor method for the class:
	}, {
		key: "buildCode_Destructor",
		value: function buildCode_Destructor(item, info) {

			var ret = "\t" + this.comment("Destructor") + "\t~" + info.name + "()";

			ret += "{\n" + "\n\t\t" + this.comment("...") + "\t}";
			return ret;
		}

		//build all the public items at once
	}, {
		key: "buildCode_PublicItems",
		value: function buildCode_PublicItems(item, info) {

			//make sure there actually are public items:
			if (!info.hasPublicMembers && !info.hasPublicMethods) return '';

			var ret = "\t" + this.comment("Public Items past this point:") + "\tpublic:\n";

			//if it has public members, add them now:
			if (info.hasPublicMembers) ret += "\n" + this.buildCode_Members(info.publicMembers, item, info);

			//if it has public methods, add them now:"
			if (info.hasPublicMethods) ret += "\n" + this.buildCode_Methods(info.publicMethods, item, info);

			return ret;
		}

		//build all the protected items at once
	}, {
		key: "buildCode_ProtectedItems",
		value: function buildCode_ProtectedItems(item, info) {

			//make sure there actually are protected items:
			if (!info.hasProtectedMembers && !info.hasProtectedMethods) return '';

			var ret = "\t" + this.comment("Protected Items past this point:") + "\tprotected:\n";

			//if it has public members, add them now:
			if (info.hasProtectedMembers) ret += "\n" + this.buildCode_Members(info.protectedMembers, item, info);

			//if it has public methods, add them now:"
			if (info.hasProtectedMethods) ret += "\n" + this.buildCode_Methods(info.protectedMethods, item, info);

			return ret;
		}

		//build all the private items at once
	}, {
		key: "buildCode_PrivateItems",
		value: function buildCode_PrivateItems(item, info) {

			//make sure there actually are private items:
			if (!info.hasPrivateMembers && !info.hasPrivateMethods) return '';

			var ret = "\t" + this.comment("Private Items past this point:") + "\tprivate:\n";

			//if it has public members, add them now:
			if (info.hasPrivateMembers) ret += "\n" + this.buildCode_Members(info.privateMembers, item, info);

			//if it has public methods, add them now:"
			if (info.hasPrivateMethods) ret += "\n" + this.buildCode_Methods(info.privateMethods, item, info);

			return ret;
		}

		//build out all the methods
	}, {
		key: "buildCode_Methods",
		value: function buildCode_Methods(methods, item, info) {

			var typeToStr = ['void', 'int', 'short int', 'long int', 'char', 'float', 'double', 'char', 'string', 'bool'];

			//code to return
			var ret = '';

			if (info.hasMethods) {

				//code to return:
				ret = "\t" + this.comment("Methods");

				//loop over methods
				for (var i = 0; i < methods.length; i++) {

					//get the method
					var method = methods[i];

					if (method.isAbstract) ret += "\t" + 'virtual ' + typeToStr[parseInt(method.mType)] + ' ' + method.mName + "()" + (method.isConst ? ' final' : '') + +" = 0\n\n";else ret += "\t" + (method.isStatic && !method.isAbstract ? 'static ' : '') + typeToStr[parseInt(method.mType)] + ' ' + method.mName + "()" + (method.isConst ? ' final' : '') + "{\n" + "\t\t" + this.comment("...") + "\t}\n\n";
				} //next i
			} //endif has methods

			return ret;
		}

		//build out all the member variables
	}, {
		key: "buildCode_Members",
		value: function buildCode_Members(members, item, info) {

			var typeToStr = ['void', 'int', 'short int', 'long int', 'char', 'float', 'double', 'char', 'string', 'bool'];
			var typeDefaults = ["Null", 0, 0, 0, 0, '0.0', '0.0', '', '', 'False'];

			//code to return
			var ret = '';

			if (info.hasMembers) {

				//code to return:
				ret = "\t" + this.comment("Member Variables");

				//loop over methods
				for (var i = 0; i < members.length; i++) {

					//get the method
					var member = members[i];

					ret += "\t" + (member.isConst ? 'const ' : '') + (member.isStatic ? 'static ' : '') + typeToStr[parseInt(member.mType)] + ' ' + member.mName;

					if (member.val != null) {
						switch (parseInt(member.mType)) {
							case INT:
							case DOUBLE:
								ret += " = " + member.val;
								break;
							case SHORT:
								ret += " = (short int)" + member.val;
								break;
							case LONG:
								ret += " = (long int)" + member.val;
								break;
							case BYTE:
								ret += " = (char)" + member.val;
								break;
							case FLOAT:
								ret += " = " + member.val + 'f';
								break;
							case CHAR:
								ret += " = '" + member.val + "'";
								break;
							case STRING:
								ret += " = \"" + member.val + "\"";
								break;
							case BOOLEAN:
								ret += " = " + member.val.toString();
								break;
						} //swatch
					} else {
							if (member.isConst) ret += " = " + typeDefaults[member.mType];
						} //has default value

					//apply the semicolon and new line
					ret += ";\n";
				} //next i
			} //endif has methods

			return ret;
		}
	}]);

	return CppCodeGenerator;
})(CodeGenerator);
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CSharpCodeGenerator = (function (_CodeGenerator) {
	_inherits(CSharpCodeGenerator, _CodeGenerator);

	function CSharpCodeGenerator(DOM) {
		_classCallCheck(this, CSharpCodeGenerator);

		_get(Object.getPrototypeOf(CSharpCodeGenerator.prototype), "constructor", this).call(this, DOM);

		//Make note of language name
		this.langName = "C#";

		//set up comment styles
		this.singleLineComments = "// ";
		this.multiLineComments = { open: '/*\n',
			close: '\n*/',
			prefix: "\t" };

		//set up what this class supports:
		//Note: support is assumed by default, so this only has to disable features
		this.features = {
			methods: {},
			members: {}
		};

		//build the area for the code:
		this.DOM.append("<pre><code class=\"cs\"></code></pre>");

		//cache reference to the PRE tag
		this.codeDOM = $(this.DOM.find('code'));
	}

	//builds the code!

	_createClass(CSharpCodeGenerator, [{
		key: "buildCode",
		value: function buildCode(item, info) {

			//variable to build the code
			var ret = this.buildCode_Warnings(item, info) + this.buildCode_Definition(item, info) + "\n\n" + this.buildCode_Constructor(item, info) + "\n\n" + this.buildCode_Methods(item, info) + this.buildCode_Members(item, info) + "}";

			return ret;
		}

		//build essentially the first line of the class: the defition
	}, {
		key: "buildCode_Definition",
		value: function buildCode_Definition(item, info) {

			//build the left part that usually looks like "public final class foo"
			var ret = (info.isPublic ? 'public ' : 'private ') + (info.isFinal ? 'sealed ' : '') + (info.isAbstract ? 'abstract ' : '') + 'class ' + info.name;

			//if it extends anything, add that here:
			if (info.hasAncestor) ret += ' : ' + info.ancestor;

			//if it implements any interfaces, add those here:
			if (info.hasInterfaces) {
				if (info.hasAncestor) ret += ', ';else ret += ' : ';
				for (var i = 0; i < info.interfaces.length; i++) ret += info.interfaces[i].mName + ', ';
				//truncate last two chars (', ')
				ret = ret.substring(0, ret.length - 2);
			}

			//finally add the '{'
			ret += ' {';
			return ret;
		}

		//build a constructor method for the class:
	}, {
		key: "buildCode_Constructor",
		value: function buildCode_Constructor(item, info) {

			var ret = "\t" + this.comment("Constructor") + "\tpublic " + info.name + "()";

			//if the class has an ancestor lets call super in the constructor!
			if (info.hasAncestor) ret += " : base()";

			ret += "{\n" + "\n\t\t" + this.comment("...") + "\t}";
			return ret;
		}

		//build out all the methods
	}, {
		key: "buildCode_Methods",
		value: function buildCode_Methods(item, info) {

			var typeToStr = ['void', 'int', 'short', 'long', 'byte', 'float', 'double', 'char', 'string', 'bool'];
			var accessToStr = ['private', 'public', 'protected'];

			//get list of methods
			var methods = info.methods;

			//code to return
			var ret = '';

			if (info.hasMethods) {

				//code to return:
				ret = "\t" + this.comment("Methods");

				//loop over methods
				for (var i = 0; i < methods.length; i++) {

					//get the method
					var method = methods[i];

					ret += "\t" + accessToStr[method.access] + ' ' + (method.isStatic ? 'static ' : '') + (method.isConst ? 'sealed override ' : '') + typeToStr[parseInt(method.mType)] + ' ' + method.mName + "(){\n" + "\t\t" + this.comment("...") + "\t}\n\n";
				} //next i
			} //endif has methods

			return ret;
		}

		//build out all the member variables
	}, {
		key: "buildCode_Members",
		value: function buildCode_Members(item, info) {

			var typeToStr = ['void', 'int', 'short', 'long', 'byte', 'float', 'double', 'char', 'string', 'bool'];
			var accessToStr = ['private', 'public', 'protected'];

			//get list of methods
			var members = info.members;

			//code to return
			var ret = '';

			if (info.hasMembers) {

				//code to return:
				ret = "\t" + this.comment("Member Variables");

				//loop over methods
				for (var i = 0; i < members.length; i++) {

					//get the method
					var member = members[i];

					ret += "\t" + accessToStr[member.access] + ' ' + (member.isStatic ? 'static ' : '') + (member.isConst ? 'const ' : '') + typeToStr[parseInt(member.mType)] + ' ' + member.mName;

					if (member.val != null) {
						switch (parseInt(member.mType)) {
							case INT:
							case DOUBLE:
								ret += " = " + member.val;
								break;
							case SHORT:
								ret += " = (short)" + member.val;
								break;
							case LONG:
								ret += " = (long)" + member.val;
								break;
							case BYTE:
								ret += " = (byte)" + member.val;
								break;
							case FLOAT:
								ret += " = " + member.val + 'f';
								break;

							case CHAR:
								ret += " = '" + member.val + "'";
								break;
							case STRING:
								ret += " = \"" + member.val + "\"";
								break;
							case BOOLEAN:
								ret += " = " + member.val.toString();
								break;
						} //swatch
					} //has default value

					//apply the semicolon and new line
					ret += ";\n";
				} //next i
			} //endif has methods

			return ret;
		}
	}]);

	return CSharpCodeGenerator;
})(CodeGenerator);
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ES6CodeGenerator = (function (_CodeGenerator) {
	_inherits(ES6CodeGenerator, _CodeGenerator);

	function ES6CodeGenerator(DOM) {
		_classCallCheck(this, ES6CodeGenerator);

		_get(Object.getPrototypeOf(ES6CodeGenerator.prototype), "constructor", this).call(this, DOM);

		//Make note of language name
		this.langName = "JavaScript ES6";

		//set up comment styles
		this.singleLineComments = "// ";
		this.multiLineComments = { open: '/*\n',
			close: '\n*/',
			prefix: "\t" };

		//set up what this class supports:
		//Note: support is assumed by default, so this only has to disable features
		this.features = {
			interfaces: false,
			abstract: false,
			final: false,
			"private": false,
			types: false,
			methods: {
				final: false,
				abstract: false,
				"private": false,
				"protected": false
			},
			members: {
				"private": false,
				"protected": false
			}
		};

		//build the area for the code:
		this.DOM.append("<pre><code class=\"javascript\"></code></pre>");

		//cache reference to the PRE tag
		this.codeDOM = $(this.DOM.find('code'));

		//colorize it
		hljs.highlightBlock(this.codeDOM[0]);
	}

	//builds the code!

	_createClass(ES6CodeGenerator, [{
		key: "buildCode",
		value: function buildCode(item, info) {

			//variable to build the code
			var ret = this.buildCode_Warnings(item, info) + this.buildCode_Constants(item, info) + this.buildCode_Definition(item, info) + "\n\n" + this.buildCode_Constructor(item, info) + "\n" + this.buildCode_Members(item, info) + "\t\t" + this.comment("...") + "\t}\n\n" + this.buildCode_Methods(item, info) + "}\n\n" + this.buildCode_StaticMembers(item, info) + this.buildCode_StaticMethods(item, info);

			return ret;
		}

		//filter out and display constants before the class actually starts
	}, {
		key: "buildCode_Constants",
		value: function buildCode_Constants(item, info) {

			//get just constants
			var constants = info.constMembers;

			var ret = '';

			if (info.hasConstMembers) {

				ret += "\n" + this.comment("Constants") + this.comment("NOTE: Unless I'm misunderstanding the documentation, class constants must actually be global to be used throughout the class.") + this.comment("If they're defined in the constructor() they will only be available in the constructors scope... Way to go ES6 /s");

				for (var i = 0; i < constants.length; i++) {

					var constant = constants[i];

					ret += "const " + constants[i].mName;

					if (constant.val != null) {
						switch (parseInt(constant.mType)) {
							case INT:
							case DOUBLE:
							case SHORT:
							case LONG:
							case BYTE:
							case FLOAT:
								ret += " = " + constant.val;
								break;
							case CHAR:
								ret += " = '" + constant.val + "'";
								break;
							case STRING:
								ret += " = \"" + constant.val + "\"";
								break;
							case BOOLEAN:
								ret += " = " + constant.val.toString();
								break;
						} //swatch
					} else {
							ret += " = null";
						} //has default value

					//add semicolon and new line
					ret += ";\n";
				} //next i

				ret += "\n";
			}

			return ret;
		}

		//build essentially the first line of the class: the defition
	}, {
		key: "buildCode_Definition",
		value: function buildCode_Definition(item, info) {

			//build the left part that usually looks like "public final class foo"
			var ret = 'class ' + info.name;

			//if it extends anything, add that here:
			if (info.hasAncestor) ret += ' extends ' + info.ancestor;

			//finally add the '{'
			ret += ' {';
			return ret;
		}

		//build a constructor method for the class:
	}, {
		key: "buildCode_Constructor",
		value: function buildCode_Constructor(item, info) {

			var ret = "\t" + this.comment("Constructor") + "\tconstructor(){\n";

			//if this class is abstract when a put in the abstract hack
			if (info.isAbstract) {

				ret += "\n\t\t" + this.comment("ES6 doesn't natively support Abstract classes, but this solution is a hack that attempts to solve that.") + "\t\t" + this.comment("Found here: http://tinyurl.com/om5xm8w") + "\t\tif (new.target === " + info.name + "){\n" + "\t\t\tthrow new TypeError(\"Cannot construct Abstract instances directly\");\n" + "\t\t}\n";
			}

			//if the class has an ancestor lets call super in the constructor!
			if (info.hasAncestor) ret += "\n\t\t" + this.comment("Call Super Constructor") + "\t\tsuper();\n";

			return ret;
		}

		//build out all the member variables
	}, {
		key: "buildCode_Members",
		value: function buildCode_Members(item, info) {

			//get list of methods and filter out static methods and constants
			var members = item.getMembers().filter(function (n) {
				return n.isStatic != true && n.isConst != true;
			});

			//code to return
			var ret = '';

			if (members.length > 0) {

				//code to return:
				ret = "\t\t" + this.comment("Member Variables");

				//loop over methods
				for (var i = 0; i < members.length; i++) {

					//get the method
					var member = members[i];

					ret += "\t\tthis." + member.mName;

					if (member.val != null) {
						switch (parseInt(member.mType)) {
							case INT:
							case DOUBLE:
							case SHORT:
							case LONG:
							case BYTE:
							case FLOAT:
								ret += " = " + member.val;
								break;
							case CHAR:
								ret += " = '" + member.val + "'";
								break;
							case STRING:
								ret += " = \"" + member.val + "\"";
								break;
							case BOOLEAN:
								ret += " = " + member.val.toString();
								break;
						} //swatch
					} else {
							ret += " = null";
						} //has default value

					//apply the semicolon and new line
					ret += ";\n";
				} //next i

				ret += "\n";
			} //endif has methods

			return ret;
		}

		//build out all the methods
	}, {
		key: "buildCode_Methods",
		value: function buildCode_Methods(item, info) {

			//get list of methods and filter out static ones
			var methods = item.getMethods().filter(function (n) {
				return n.isStatic != true;
			});

			//code to return
			var ret = '';

			if (methods.length > 0) {

				//code to return:
				ret = "\t" + this.comment("Methods");

				//loop over methods
				for (var i = 0; i < methods.length; i++) {

					//get the method
					var method = methods[i];

					ret += "\t" + method.mName + "(){\n" + "\t\t" + this.comment("...") + "\t}\n\n";
				} //next i
			} //endif has methods

			return ret;
		}

		//build out just the static members
	}, {
		key: "buildCode_StaticMembers",
		value: function buildCode_StaticMembers(item, info) {

			//get just static members
			var members = info.staticMembers;

			var ret = '';

			if (info.hasStaticMembers) {

				ret += this.comment("Static Members");

				for (var i = 0; i < members.length; i++) {

					var member = members[i];

					ret += info.name + "." + members[i].mName;

					if (member.val != null) {
						switch (parseInt(member.mType)) {
							case INT:
							case DOUBLE:
							case SHORT:
							case LONG:
							case BYTE:
							case FLOAT:
								ret += " = " + member.val;
								break;
							case CHAR:
								ret += " = '" + member.val + "'";
								break;
							case STRING:
								ret += " = \"" + member.val + "\"";
								break;
							case BOOLEAN:
								ret += " = " + member.val.toString();
								break;
						} //swatch
					} else {
							ret += " = null";
						} //has default value

					//add semicolon and new line
					ret += ";\n";
				} //next i

				ret += "\n";
			}

			return ret;
		}
	}, {
		key: "buildCode_StaticMethods",
		value: function buildCode_StaticMethods(item, info) {

			//get list of methods and filter only static ones
			var methods = info.staticMethods;

			//code to return
			var ret = '';

			if (info.hasStaticMethods) {

				//code to return:
				ret = this.comment("Static Methods");

				//loop over methods
				for (var i = 0; i < methods.length; i++) {

					//get the method
					var method = methods[i];

					ret += info.name + "." + method.mName + "(){\n" + "\t" + this.comment("...") + "}\n\n";
				} //next i
			} //endif has methods

			return ret;
		}
	}]);

	return ES6CodeGenerator;
})(CodeGenerator);
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var JavaCodeGenerator = (function (_CodeGenerator) {
	_inherits(JavaCodeGenerator, _CodeGenerator);

	function JavaCodeGenerator(DOM) {
		_classCallCheck(this, JavaCodeGenerator);

		_get(Object.getPrototypeOf(JavaCodeGenerator.prototype), "constructor", this).call(this, DOM);

		//Make note of language name
		this.langName = "Java";

		//set up comment styles
		this.singleLineComments = "// ";
		this.multiLineComments = { open: '/*\n',
			close: '\n*/',
			prefix: "\t" };

		//set up what this class supports:
		//Note: support is assumed by default, so this only has to disable features
		this.features = {
			methods: {},
			members: {}
		};

		//build the area for the code:
		this.DOM.append("<pre><code class=\"java\"></code></pre>");

		//cache reference to the PRE tag
		this.codeDOM = $(this.DOM.find('code'));
	}

	//builds the code!

	_createClass(JavaCodeGenerator, [{
		key: "buildCode",
		value: function buildCode(item, info) {

			//variable to build the code
			var ret = this.buildCode_Warnings(item, info) + this.buildCode_Definition(item, info) + "\n\n" + this.buildCode_Constructor(item, info) + "\n\n" + this.buildCode_Methods(item, info) + this.buildCode_Members(item, info) + "}";

			return ret;
		}

		//build essentially the first line of the class: the defition
	}, {
		key: "buildCode_Definition",
		value: function buildCode_Definition(item, info) {

			//build the left part that usually looks like "public final class foo"
			var ret = (info.isPublic ? 'public ' : 'private ') + (info.isFinal ? 'final ' : '') + (info.isAbstract ? 'abstract ' : '') + 'class ' + info.name;

			//if it extends anything, add that here:
			if (info.hasAncestor) ret += ' extends ' + info.ancestor;

			//if it implements any interfaces, add those here:
			if (info.hasInterfaces) {
				ret += ' implements ';
				for (var i = 0; i < info.interfaces.length; i++) ret += info.interfaces[i].mName + ', ';
				//truncate last two chars (', ')
				ret = ret.substring(0, ret.length - 2);
			}

			//finally add the '{'
			ret += ' {';
			return ret;
		}

		//build a constructor method for the class:
	}, {
		key: "buildCode_Constructor",
		value: function buildCode_Constructor(item, info) {

			var ret = "\t" + this.comment("Constructor") + "\tpublic " + item.getName() + "(){\n";

			//if the class has an ancestor lets call super in the constructor!
			if (item.getAncestor() != null && item.getAncestor != "") ret += "\n\t\t" + this.comment("Call Super Constructor") + "\t\tsuper();\n";

			ret += "\n\t\t" + this.comment("...") + "\t}";
			return ret;
		}

		//build out all the methods
	}, {
		key: "buildCode_Methods",
		value: function buildCode_Methods(item, info) {

			var typeToStr = ['void', 'int', 'short', 'long', 'byte', 'float', 'double', 'char', 'String', 'boolean'];
			var accessToStr = ['private', 'public', 'protected'];

			//get list of methods
			var methods = info.methods;

			//code to return
			var ret = '';

			if (info.hasMethods) {

				//code to return:
				ret = "\t" + this.comment("Methods");

				//loop over methods
				for (var i = 0; i < methods.length; i++) {

					//get the method
					var method = methods[i];

					ret += "\t" + accessToStr[method.access] + ' ' + (method.isStatic ? 'static ' : '') + (method.isConst ? 'final ' : '') + typeToStr[parseInt(method.mType)] + ' ' + method.mName + "(){\n" + "\t\t" + this.comment("...") + "\t}\n\n";
				} //next i
			} //endif has methods

			return ret;
		}

		//build out all the member variables
	}, {
		key: "buildCode_Members",
		value: function buildCode_Members(item, info) {

			var typeToStr = ['void', 'int', 'short', 'long', 'byte', 'float', 'double', 'char', 'String', 'boolean'];
			var accessToStr = ['private', 'public', 'protected'];

			//get list of methods
			var members = info.members;

			//code to return
			var ret = '';

			if (info.hasMembers) {

				//code to return:
				ret = "\t" + this.comment("Member Variables");

				//loop over methods
				for (var i = 0; i < members.length; i++) {

					//get the method
					var member = members[i];

					ret += "\t" + accessToStr[member.access] + ' ' + (member.isStatic ? 'static ' : '') + (member.isConst ? 'final ' : '') + typeToStr[parseInt(member.mType)] + ' ' + member.mName;

					if (member.val != null) {
						switch (parseInt(member.mType)) {
							case INT:
							case DOUBLE:
								ret += " = " + member.val;
								break;
							case SHORT:
								ret += " = (short)" + member.val;
								break;
							case LONG:
								ret += " = (long)" + member.val;
								break;
							case BYTE:
								ret += " = (byte)" + member.val;
								break;
							case FLOAT:
								ret += " = " + member.val + 'f';
								break;

							case CHAR:
								ret += " = '" + member.val + "'";
								break;
							case STRING:
								ret += " = \"" + member.val + "\"";
								break;
							case BOOLEAN:
								ret += " = " + member.val.toString();
								break;
						} //swatch
					} //has default value

					//apply the semicolon and new line
					ret += ";\n";
				} //next i
			} //endif has methods

			return ret;
		}

		// build out some useful common code structures
	}, {
		key: "buildExtraSamplesCode",
		value: function buildExtraSamplesCode() {

			return "// Conditionals\nif(someVar==true){\n\t// ...\n}else if(otherVar>10){\n\t// ...\n}else{" + "\n\t// ...\n}\n\n// Switch only works with numbers\nswitch(someVar){\n\tcase 1:\n\tcase 2:" + "\n\tcase 3:\n\t\t// ...\n\t\tbreak;\n\tcase 4:\n\t\t// ...\n\t\tbreak;\n\tdefault:\n\t\t// ...\n\t\tbrea" + "k;\n}\n\n// For loop\nfor(int i=0; i<10; i++){\n\t// ...\n}\n\n// For Each loop\nint items" + "[] = {1, 2, 3, 4, 5};\nfor(int itm :  items){\n\t// ...\n}\n\n// While loops\nwhile(tru" + "e){\n\t// ...\n}\n\ndo{\n\t// ...\n}while(true);" + "";
		}
	}]);

	return JavaCodeGenerator;
})(CodeGenerator);
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var JSCodeGenerator = (function (_CodeGenerator) {
	_inherits(JSCodeGenerator, _CodeGenerator);

	function JSCodeGenerator(DOM) {
		_classCallCheck(this, JSCodeGenerator);

		_get(Object.getPrototypeOf(JSCodeGenerator.prototype), 'constructor', this).call(this, DOM);

		//so this resovles in all scopes:
		var me = this;

		//add an area to let the user pick between our three flavors of JS: Native, TypeScript, ES6
		//as well as containers for our childen elements
		this.DOM.html('<div class="GenHeader">' + 'JavaScript has multiple implementations, choose your flavor!<br>' + '<div class="options">' + '<input type="radio" name="optFlavJS" id="opt01" value="01" checked><label for="opt01">Vanilla JS</label> ' + '<input type="radio" name="optFlavJS" id="opt02" value="02"><label for="opt02">ES6 / Babel</label> ' + '<input type="radio" name="optFlavJS" id="opt03" value="03"><label for="opt03">TypeScript</label> ' + '</div>' + '</div>' + '<div id="SubTab_01" class="SubTab"></div>' + '<div id="SubTab_02" class="SubTab" style="display:none;"></div>' + '<div id="SubTab_03" class="SubTab" style="display:none;"></div>');

		//create generators for each type of JS
		this.codeGenerators = [];
		this.codeGenerators.push(new VanillaJSCodeGenerator(this.DOM.find('#SubTab_01')));
		this.codeGenerators.push(new ES6CodeGenerator(this.DOM.find('#SubTab_02')));
		this.codeGenerators.push(new TypeScriptCodeGenerator(this.DOM.find('#SubTab_03')));

		//bind event for the option boxes to switch out the code.
		this.DOM.find("input").bind('click change', function (e) {

			//get the ID
			var id = $(this).val();

			//hide all JS tabs
			me.DOM.find('.SubTab').hide();

			//show just the selected tab
			me.DOM.find('#SubTab_' + id).show();
		});
		this.DOM.find('label').mousemove(function (e) {
			e.preventDefault();
		});
	}

	//OVERRIDE the parents update method, so we can update all of our children!
	//takes a class item and rebuilds the appropriate source code based on the class item for this language

	_createClass(JSCodeGenerator, [{
		key: 'update',
		value: function update(item, extraCodeSamples) {

			//update each of the code generators!
			for (var g = 0; g < this.codeGenerators.length; g++) {

				//get the generator
				var generator = this.codeGenerators[g];

				//tell it to update it's class
				generator.update(item, extraCodeSamples);
			} //next g
		}
	}]);

	return JSCodeGenerator;
})(CodeGenerator);
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PerlCodeGenerator = (function (_CodeGenerator) {
	_inherits(PerlCodeGenerator, _CodeGenerator);

	function PerlCodeGenerator(DOM) {
		_classCallCheck(this, PerlCodeGenerator);

		_get(Object.getPrototypeOf(PerlCodeGenerator.prototype), "constructor", this).call(this, DOM);

		//Make note of language name
		this.langName = "Perl";

		//set up comment styles
		this.singleLineComments = "# ";
		this.multiLineComments = { open: "=begin comment\n",
			close: "\n=cut",
			prefix: "\t" };

		//set up what this class supports:
		//Note: support is assumed by default, so this only has to disable features
		this.features = {
			final: false,
			abstract: false,
			"private": false,
			types: false,
			methods: {
				abstract: false,
				final: false,
				"static": false,
				"private": false,
				"protected": false
			},
			members: {
				final: true,
				"static": false,
				"private": false,
				"protected": false
			}
		};

		//build the area for the code:
		this.DOM.append("<pre><code class=\"perl\"></code></pre>");

		//cache reference to the PRE tag
		this.codeDOM = $(this.DOM.find('code'));
	}

	//builds the code!

	_createClass(PerlCodeGenerator, [{
		key: "buildCode",
		value: function buildCode(item, info) {
			var ret = this.buildCode_Warnings(item, info) + this.buildCode_Definition(item, info) + "\n" + this.buildCode_StaticMembers(item, info) + this.buildCode_Constructor(item, info) + "\n" + this.buildCode_Methods(item, info) + this.comment("All Packages must end in a true statement") + "1;";

			return ret;
		}

		//build essentially the first line of the class: the defition
	}, {
		key: "buildCode_Definition",
		value: function buildCode_Definition(item, info) {

			//build the left part that usually looks like "public final class foo"
			var ret = this.comment("NOTE: " + this.langName + " doesn't have syntax for definging a class. This code belongs in a file called: \"" + info.name + ".pm\".") + this.comment("ALSO NOTE: Nobody should use Perl for anything, ever.") + "package " + info.name + ";\n\n" + "use strict;\n" + "use warnings;\n";

			//if it has either an ancestor or interfaces:
			if (info.hasAncestor || info.hasInterfaces) {
				ret += "\n" + this.comment("Ancestors and Interfaces") + "our @ISA = qw(\n";

				//if we have an ancestor, add that now:
				if (info.hasAncestor) ret += "\t" + info.ancestor + "\n";

				//if it has interfaces, lets spit em out
				if (info.hasInterfaces) {
					for (var i = 0; i < info.interfaces.length; i++) {
						ret += "\t" + info.interfaces[i].mName + "\n";
					} //next i
				}

				ret += ");";
			} //ancestors or interfaces

			ret += "\n";

			return ret;
		}

		//build out all the static member variables
	}, {
		key: "buildCode_StaticMembers",
		value: function buildCode_StaticMembers(item, info) {

			var typeDefaults = ["Null", 0, 0, 0, 0, '0.0', '0.0', '', '', 'False'];

			//get list of methods
			var items = info.staticMembers;

			//code to return
			var ret = '';

			if (info.hasStaticMembers > 0) {

				//code to return:
				ret = this.comment("Static Members");

				//loop over methods
				for (var i = 0; i < items.length; i++) {

					//get the method
					var itm = items[i];

					ret += 'my ' + itm.mName + " = ";

					if (itm.val != null) {
						switch (parseInt(itm.mType)) {
							case INT:
							case DOUBLE:
							case SHORT:
							case LONG:
							case BYTE:
							case FLOAT:
								ret += itm.val;
								break;
							case CHAR:
								ret += "'" + itm.val + "'";
								break;
							case STRING:
								ret += "\"" + itm.val + "\"";
								break;
							case BOOLEAN:
								ret += this.firstToUpper(itm.val);
								break;
						} //swatch
					} else {
							ret += "undef";
						} //has default value

					//apply the new line
					ret += ";\n";
				} //next i
				ret += "\n";
			} //endif has statics

			return ret;
		}

		//build a constructor method for the class:
	}, {
		key: "buildCode_Constructor",
		value: function buildCode_Constructor(item, info) {

			var ret = this.comment("Constructor") + "sub new {\n" + "\tmy $class = shift;\n\n" + "\tmy $self = {\n";

			ret += this.buildCode_Members(item, info);

			ret += "\t};\n\n" + "\tbless($self, $class);\n";

			if (info.hasAncestor) ret += "\n\t" + this.comment("Call Super Constructor") + "\t$self->SUPER::new();\n";

			ret += "\n}\n";

			return ret;
		}

		//build out all the member variables
	}, {
		key: "buildCode_Members",
		value: function buildCode_Members(item, info) {

			var typeDefaults = ["undef", 0, 0, 0, 0, '0.0', '0.0', '', '', 'False'];

			//get list of methods
			var items = item.getMembers().filter(function (n) {
				return n.isStatic != true;
			});

			//code to return
			var ret = '';

			if (items.length > 0) {

				//code to return:
				//ret = 	this.comment("Members");

				//loop over methods
				for (var i = 0; i < items.length; i++) {

					//get the method
					var itm = items[i];
					ret += "\t\t" + (itm.access == PUBLIC ? '' : '_') + itm.mName + ' => ';

					if (itm.val != null) {
						switch (parseInt(itm.mType)) {
							case INT:
							case DOUBLE:
							case SHORT:
							case LONG:
							case BYTE:
							case FLOAT:
								ret += itm.val;
								break;
							case CHAR:
								ret += "'" + itm.val + "'";
								break;
							case STRING:
								ret += "\"" + itm.val + "\"";
								break;
							case BOOLEAN:
								ret += this.firstToUpper(itm.val);
								break;
						} //swatch
					} else {
							ret += " = undef";
						} //has default value

					//apply the new line
					ret += ",\n";
				} //next i
				ret += "\n";
			} //endif has constnats

			//remove the last comma:
			ret = ret.split(',');
			ret = ret.splice(0, ret.length - 1).join(',') + ret[ret.length - 1];

			return ret;
		}

		//build out all the methods
	}, {
		key: "buildCode_Methods",
		value: function buildCode_Methods(item, info) {

			//get list of methods
			var methods = info.methods;

			//code to return
			var ret = '';

			if (info.hasMethods) {

				//code to return:
				ret = this.comment("Methods");

				//loop over methods
				for (var i = 0; i < methods.length; i++) {

					//get the method
					var method = methods[i];

					if (method.isStatic == true) ret += 'sub ' + (method.access == PUBLIC ? '' : '_') + method.mName + " {\n" + "\t" + this.comment("...") + "}\n\n";else ret += 'sub ' + (method.access == PUBLIC ? '' : '_') + method.mName + " {\n" + "\tmy $self = shift;\n" + "\t" + this.comment("...") + "}\n\n";
				} //next i
			} //endif has methods

			return ret;
		}
	}]);

	return PerlCodeGenerator;
})(CodeGenerator);
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PHPCodeGenerator = (function (_CodeGenerator) {
	_inherits(PHPCodeGenerator, _CodeGenerator);

	function PHPCodeGenerator(DOM) {
		_classCallCheck(this, PHPCodeGenerator);

		_get(Object.getPrototypeOf(PHPCodeGenerator.prototype), "constructor", this).call(this, DOM);

		//Make note of language name
		this.langName = "PHP";

		//set up comment styles
		this.singleLineComments = "// ";
		this.multiLineComments = { open: '/*\n',
			close: '\n*/',
			prefix: "\t" };

		//set up what this class supports:
		//Note: support is assumed by default, so this only has to disable features
		this.features = {
			"private": false,
			types: false,
			methods: {},
			members: {}
		};

		//build the area for the code:
		this.DOM.append("<pre><code class=\"php\"></code></pre>");

		//cache reference to the PRE tag
		this.codeDOM = $(this.DOM.find('code'));
	}

	//builds the code!

	_createClass(PHPCodeGenerator, [{
		key: "buildCode",
		value: function buildCode(item, info) {

			//variable to build the code
			var ret = this.buildCode_Warnings(item, info) + this.buildCode_Definition(item, info) + "\n" + this.buildCode_Members(item, info) + "\n" + this.buildCode_Constructor(item, info) + "\n\n" + this.buildCode_Methods(item, info) + "}";

			return ret;
		}

		//build essentially the first line of the class: the defition
	}, {
		key: "buildCode_Definition",
		value: function buildCode_Definition(item, info) {

			//build the left part that usually looks like "public final class foo"
			var ret = (info.isFinal ? 'final ' : '') + (info.isAbstract ? 'abstract ' : '') + 'class ' + info.name;
			//((item.getPublic())?'public ':'private ') +

			//if it extends anything, add that here:
			if (info.hasAncestor) ret += ' extends ' + info.ancestor;

			//if it implements any interfaces, add those here:
			if (info.hasInterfaces) {
				ret += ' implements ';
				for (var i = 0; i < info.interfaces.length; i++) ret += info.interfaces[i].mName + ', ';
				//truncate last two chars (', ')
				ret = ret.substring(0, ret.length - 2);
			}

			//finally add the '{'
			ret += ' {';
			return ret;
		}

		//build out all the member variables
	}, {
		key: "buildCode_Members",
		value: function buildCode_Members(item, info) {

			var accessToStr = ['private', 'public', 'protected'];

			//get list of methods
			var members = info.members;

			//code to return
			var ret = "";

			if (info.hasMembers) {

				//handle constants first since the syntax is slightly different
				var constants = members.filter(function (n) {
					return n.isConst == true;
				});
				if (constants.length > 0) {

					ret += "\n\t" + this.comment("Class Constants");
					for (var i = 0; i < constants.length; i++) {

						var constant = constants[i];
						ret += "\tconst " + constant.mName;

						if (constant.val != null) {
							switch (parseInt(constant.mType)) {
								case INT:
								case DOUBLE:
								case SHORT:
								case LONG:
								case BYTE:
								case FLOAT:
									ret += " = " + constant.val;
									break;
								case CHAR:
									ret += " = '" + constant.val + "'";
									break;
								case STRING:
									ret += " = \"" + constant.val + "\"";
									break;
								case BOOLEAN:
									ret += " = " + constant.val.toString().toUpperCase();
									break;
							} //swatch
						} else {
								ret += ' = NULL';
							} //has default value

						ret += ";\n";
					} //next i

					//ret += "\n";
				} //end if has constants

				//now that we handled constants, lets filter them out
				members = members.filter(function (n) {
					return n.isConst != true;
				});

				if (members.length > 0) {

					//code to return:
					ret += "\n\t" + this.comment("Member Variables");

					//loop over methods
					for (var i = 0; i < members.length; i++) {

						//get the method
						var member = members[i];

						ret += "\t" + accessToStr[member.access] + ' ' + (member.isStatic ? 'static ' : '') + '$' + member.mName;

						if (member.val != null) {
							switch (parseInt(member.mType)) {
								case INT:
								case DOUBLE:
								case SHORT:
								case LONG:
								case BYTE:
								case FLOAT:
									ret += " = " + member.val;
									break;
								case CHAR:
									ret += " = '" + member.val + "'";
									break;
								case STRING:
									ret += " = \"" + member.val + "\"";
									break;
								case BOOLEAN:
									ret += " = " + member.val.toString().toUpperCase();
									break;
							} //swatch
						} //has default value

						//apply the semicolon and new line
						ret += ";\n";
					} //next i
				} //end if has non constants
			} //endif has methods

			return ret;
		}

		//build a constructor method for the class:
	}, {
		key: "buildCode_Constructor",
		value: function buildCode_Constructor(item, info) {

			var ret = "\t" + this.comment("Constructor") + "\tfunction __construct(){\n";

			//if the class has an ancestor lets call super in the constructor!
			if (item.getAncestor() != null && item.getAncestor != "") ret += "\n\t\t" + this.comment("Call Super Constructor") + "\t\tparent::__construct();\n";

			ret += "\n\t\t" + this.comment("...") + "\t}";
			return ret;
		}

		//build out all the methods
	}, {
		key: "buildCode_Methods",
		value: function buildCode_Methods(item, info) {

			var accessToStr = ['private', 'public', 'protected'];

			//get list of methods
			var methods = info.methods;

			//code to return
			var ret = '';

			if (info.hasMethods) {

				//code to return:
				ret = "\t" + this.comment("Methods");

				//loop over methods
				for (var i = 0; i < methods.length; i++) {

					//get the method
					var method = methods[i];

					ret += "\t" + (method.isConst ? 'final ' : '') + accessToStr[method.access] + ' ' + (method.isStatic ? 'static ' : '') + "function " + method.mName + "(){\n" + "\t\t" + this.comment("...") + "\t}\n\n";
				} //next i
			} //endif has methods

			return ret;
		}
	}]);

	return PHPCodeGenerator;
})(CodeGenerator);
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PythonCodeGenerator = (function (_CodeGenerator) {
	_inherits(PythonCodeGenerator, _CodeGenerator);

	function PythonCodeGenerator(DOM) {
		_classCallCheck(this, PythonCodeGenerator);

		_get(Object.getPrototypeOf(PythonCodeGenerator.prototype), "constructor", this).call(this, DOM);

		//Make note of language name
		this.langName = "Python";

		//set up comment styles
		this.singleLineComments = "# ";
		this.multiLineComments = { open: '\"\"\"\n',
			close: '\n\"\"\"',
			prefix: "\t" };

		//set up what this class supports:
		//Note: support is assumed by default, so this only has to disable features
		this.features = {
			"private": false,
			final: false,
			interfaces: false,
			types: false,
			methods: {
				final: false,
				"private": false,
				"protected": false
			},
			members: {
				final: false,
				"private": false,
				"protected": false
			}
		};

		//build the area for the code:
		this.DOM.append("<pre><code class=\"python\"></code></pre>");

		//cache reference to the PRE tag
		this.codeDOM = $(this.DOM.find('code'));
	}

	//builds the code!

	_createClass(PythonCodeGenerator, [{
		key: "buildCode",
		value: function buildCode(item, info) {

			//variable to build the code
			var ret = this.buildCode_Warnings(item, info) + this.buildCode_Definition(item, info) + this.buildCode_StaticMembers(item, info) + "\n" + this.buildCode_Constructor(item, info) + this.buildCode_Members(item, info) + "\n" + "\t\t" + this.comment("...") + "\n" + this.buildCode_Methods(item, info);

			return ret;
		}

		//build essentially the first line of the class: the defition
	}, {
		key: "buildCode_Definition",
		value: function buildCode_Definition(item, info) {

			//build the left part that usually looks like "public final class foo"
			var ret = 'class ' + (info.isPublic ? '' : '_') + info.name;

			//if it extends anything, add that here:
			if (info.hasAncestor) ret += '(' + info.ancestor + ')';

			//add the colon and new line before a possible abstract class definition
			ret += ":\n";

			//if this class is abstract, use the Python ABC thingy
			if (info.isAbstract) {
				ret = "from abc import ABCMeta, abstractmethod\n\n" + ret;
				ret += "\t__metaclass__ = ABCMeta\n";
			}
			return ret;
		}

		//in python the static members are declared seperately from the isntance variables, so here a sperate method to do that
	}, {
		key: "buildCode_StaticMembers",
		value: function buildCode_StaticMembers(item, info) {

			//get list of members
			var members = info.staticMembers;

			//code to return
			var ret = '';

			if (info.hasStaticMembers) {

				//code to return:
				ret = "\n\t" + this.comment("Class Variables (static)");

				//loop over methods
				for (var i = 0; i < members.length; i++) {

					//get the method
					var member = members[i];

					if (member.isStatic) {

						ret += "\t" + (member.access == PUBLIC ? '' : '_') + member.mName;

						if (member.val != null) {
							switch (parseInt(member.mType)) {
								case INT:
								case SHORT:
								case LONG:
								case BYTE:
								case FLOAT:
								case DOUBLE:
									ret += " = " + member.val;
									break;
								case CHAR:
									ret += " = '" + member.val + "'";
									break;
								case STRING:
									ret += " = \"" + member.val + "\"";
									break;
								case BOOLEAN:
									ret += " = " + this.firstToUpper(member.val);
									break;
							} //swatch
						} else {
								ret += " = None";
							} //endif has default value

						//apply the new line
						ret += "\n";
					} //endif static
				} //next i
			} //endif has methods

			return ret;
		}

		//build a constructor method for the class:
	}, {
		key: "buildCode_Constructor",
		value: function buildCode_Constructor(item, info) {

			var ret = "\t" + this.comment("Constructor") + "\tdef __init__(self):\n";

			//if the class has an ancestor lets call super in the constructor!
			if (info.hasAncestor) ret += "\n\t\t" + this.comment("Call Super Constructor") + "\t\tself.super(self, " + info.name + ").__init__()\n";
			//"\t\t" + info.ancestor + ".__init__(self)\n";
			return ret;
		}

		//build out all the member variables
	}, {
		key: "buildCode_Members",
		value: function buildCode_Members(item, info) {

			//get list of members
			var members = info.members.filter(function (n) {
				return n.isStatic != true;
			});

			//code to return
			var ret = '';

			if (members.length > 0) {

				//code to return:
				ret = "\n\t\t" + this.comment("Instance Variables");

				//loop over methods
				for (var i = 0; i < members.length; i++) {

					//get the method
					var member = members[i];

					if (!member.isStatic) {

						ret += "\t\tself." + (member.access == PUBLIC ? '' : '_') + member.mName;

						if (member.val != null) {
							switch (parseInt(member.mType)) {
								case INT:
								case SHORT:
								case LONG:
								case BYTE:
								case FLOAT:
								case DOUBLE:
									ret += " = " + member.val;
									break;
								case CHAR:
									ret += " = '" + member.val + "'";
									break;
								case STRING:
									ret += " = \"" + member.val + "\"";
									break;
								case BOOLEAN:
									ret += " = " + this.firstToUpper(member.val);
									break;
							} //swatch
						} else {
								ret += " = None";
							} //endif has default value

						//apply the new line
						ret += "\n";
					} //endif not static
				} //next i
			} //endif has methods

			return ret;
		}

		//build out all the methods
	}, {
		key: "buildCode_Methods",
		value: function buildCode_Methods(item, info) {

			//get list of methods
			var methods = info.methods;

			//code to return
			var ret = '';

			if (info.hasMethods) {

				//code to return:
				ret = "\t" + this.comment("Methods");

				//loop over methods
				for (var i = 0; i < methods.length; i++) {

					//get the method
					var method = methods[i];

					if (method.isStatic) ret += "\t@staticmethod\n";
					if (method.isAbstract) ret += "\t@abc.abstractmethod\n";

					ret += "\tdef " + (method.access == PUBLIC ? '' : '_') + method.mName + (method.isStatic ? "()" : "(self)") + ":\n";

					if (method.isAbstract) ret += "\t\t\"\"\"Abstract Method: " + method.mName + " Documentation...\"\"\"\n" + "\t\treturn\n\n";

					ret += "\t\t" + this.comment("...") + "\n\n";
				} //next i
			} //endif has methods

			return ret;
		}
	}]);

	return PythonCodeGenerator;
})(CodeGenerator);
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RubyCodeGenerator = (function (_CodeGenerator) {
		_inherits(RubyCodeGenerator, _CodeGenerator);

		function RubyCodeGenerator(DOM) {
				_classCallCheck(this, RubyCodeGenerator);

				_get(Object.getPrototypeOf(RubyCodeGenerator.prototype), "constructor", this).call(this, DOM);

				//Make note of language name
				this.langName = "Ruby";

				//set up comment styles
				this.singleLineComments = "# ";
				this.multiLineComments = { open: '=begin\n',
						close: '\n=end',
						prefix: "\t" };

				//set up what this class supports:
				//Note: support is assumed by default, so this only has to disable features
				this.features = {
						abstract: false,
						final: false,
						"private": false,
						"protected": false,
						types: false,
						methods: {
								abstract: false,
								final: false,
								"protected": false
						},
						members: {
								"protected": false
						}
				};

				//build the area for the code:
				this.DOM.append("<pre><code class=\"ruby\"></code></pre>");

				//cache reference to the PRE tag
				this.codeDOM = $(this.DOM.find('code'));

				//colorize it
				hljs.highlightBlock(this.codeDOM[0]);
		}

		//builds the code!

		_createClass(RubyCodeGenerator, [{
				key: "buildCode",
				value: function buildCode(item, info) {

						//variable to build the code
						var ret = this.buildCode_Warnings(item, info) + this.buildCode_Definition(item, info) + this.buildCode_Constants(item, info) + this.buildCode_PublicMembers(item, info) + this.buildCode_StaticMembers(item, info) + "\n" + this.buildCode_Constructor(item, info) + this.buildCode_Members(item, info) + "\n" + "\t\t" + this.comment("...") + "\tend\n\n" + this.buildCode_PublicMethods(item, info) + this.buildCode_PrivateMethods(item, info) + "end";

						return ret;
				}

				//build essentially the first line of the class: the defition
		}, {
				key: "buildCode_Definition",
				value: function buildCode_Definition(item, info) {

						//build the left part that usually looks like "public final class foo"
						var ret = 'class ' + info.name;

						//if it extends anything, add that here:
						if (info.hasAncestor) ret += ' < ' + info.ancestor;

						//add newline
						ret += "\n";

						return ret;

						// just a note: Ruby doesn't natively support private classes, final classes, abstract classes, or interfaces.
				}

				//build out all the constant variables for this class... ugh
		}, {
				key: "buildCode_Constants",
				value: function buildCode_Constants(item, info) {

						//filter out non-constants:
						var constants = info.constMembers;

						var ret = '';

						if (info.hasConstMembers) {

								ret = "\n\t" + this.comment("Class Constants");

								//loop over methods
								for (var i = 0; i < constants.length; i++) {

										//get the constant
										var constant = constants[i];

										//get the name of the constant and make sure it's first letter is uppercase:
										ret += "\t" + this.firstToUpper(constant.mName);

										if (constant.val != null) {
												switch (parseInt(constant.mType)) {
														case INT:
														case SHORT:
														case LONG:
														case BYTE:
														case FLOAT:
														case DOUBLE:
																ret += " = " + constant.val;
																break;
														case CHAR:
																ret += " = '" + constant.val + "'";
																break;
														case STRING:
																ret += " = \"" + constant.val + "\"";
																break;
														case BOOLEAN:
																ret += " = " + constant.val.toString();
																break;
												} //swatch
										} else {
														ret += " = Nil";
												} //endif has default value

										//apply the new line
										ret += "\n";
								} //next i
						} //end if has constants

						return ret;
				}

				//build out all the constant variables for this class... ugh
		}, {
				key: "buildCode_PublicMembers",
				value: function buildCode_PublicMembers(item, info) {

						//filter out constant/static members:
						var members = item.getMembers().filter(function (n) {
								return n.isConst != true && n.isStatic != true;
						});

						//filter just the public methods:
						members = members.filter(function (n) {
								return n.access == PUBLIC;
						});

						var ret = '';

						if (members.length > 0) {

								ret = "\n\t" + this.comment("Public members") + "\t" + this.comment("NOTE: in addition to a 'attr_accessor', Ruby also implements:") + "\t" + this.comment("attr_reader (for public read access only)") + "\t" + this.comment("attr_writer (for public write access only)");

								//loop over methods
								for (var i = 0; i < members.length; i++) {

										//get the constant
										var member = members[i];

										ret += "\tattr_accessor :" + member.mName + "\n";
								} //next i
						} //end if has members

						return ret;
				}

				//in Ruby public member variables and static member variables have slightly different syntax than regular memember varaibles.
		}, {
				key: "buildCode_StaticMembers",
				value: function buildCode_StaticMembers(item, info) {

						//get list of members
						var members = info.members;

						//code to return
						var ret = '';

						//filter out just static members
						members = members.filter(function (n) {
								return n.isStatic == true;
						});

						if (members.length > 0) {

								//code to return:
								ret = "\n\t" + this.comment("Class Variables (static)");

								//loop over methods
								for (var i = 0; i < members.length; i++) {

										//get the method
										var member = members[i];

										if (member.isStatic) {

												ret += "\t@@" + member.mName;

												if (member.val != null) {
														switch (parseInt(member.mType)) {
																case INT:
																case SHORT:
																case LONG:
																case BYTE:
																case FLOAT:
																case DOUBLE:
																		ret += " = " + member.val;
																		break;
																case CHAR:
																		ret += " = '" + member.val + "'";
																		break;
																case STRING:
																		ret += " = \"" + member.val + "\"";
																		break;
																case BOOLEAN:
																		ret += " = " + member.val.toString();
																		break;
														} //swatch
												} else {
																ret += " = Nil";
														} //endif has default value

												//apply the new line
												ret += "\n";
										} //endif static
								} //next i
						} //endif has methods

						return ret;
				}

				//build a constructor method for the class:
		}, {
				key: "buildCode_Constructor",
				value: function buildCode_Constructor(item, info) {

						var ret = "\t" + this.comment("Constructor") + "\tdef initialize()\n";

						//if the class has an ancestor lets call super in the constructor!
						if (info.hasAncestor) ret += "\n\t\t" + this.comment("Call Super Constructor") + "\t\tsuper()\n";

						return ret;
				}

				//build out all the member variables inside the initialize function in ruby
		}, {
				key: "buildCode_Members",
				value: function buildCode_Members(item, info) {

						//get list of members
						var members = info.members;

						//filter out static and constant methods
						members = members.filter(function (n) {
								return n.isStatic != true && n.isConst != true;
						});

						//code to return
						var ret = '';

						if (members.length > 0) {

								//code to return:
								ret = "\n\t\t" + this.comment("Instance Variables");

								//loop over methods
								for (var i = 0; i < members.length; i++) {

										//get the method
										var member = members[i];

										ret += "\t\t@" + member.mName;

										if (member.val != null) {
												switch (parseInt(member.mType)) {
														case INT:
														case SHORT:
														case LONG:
														case BYTE:
														case FLOAT:
														case DOUBLE:
																ret += " = " + member.val;
																break;
														case CHAR:
																ret += " = '" + member.val + "'";
																break;
														case STRING:
																ret += " = \"" + member.val + "\"";
																break;
														case BOOLEAN:
																ret += " = " + member.val.toString();
																break;
												} //swatch
										} else {
														ret += " = Nil";
												} //endif has default value

										//apply the new line
										ret += "\n";
								} //next i
						} //endif has methods

						return ret;
				}

				//build out all public methods
		}, {
				key: "buildCode_PublicMethods",
				value: function buildCode_PublicMethods(item, info) {

						//filter out just the public methods
						var methods = item.getMethods().filter(function (n) {
								return n.access == PUBLIC;
						});

						var ret = '';

						if (methods.length > 0) {

								ret += "\t" + this.comment("Public Methods") + "\tpublic\n\n";

								//build the methods
								ret += this.buildCode_Methods(methods);
						}

						return ret;
				}

				//build out all private methods
		}, {
				key: "buildCode_PrivateMethods",
				value: function buildCode_PrivateMethods(item, info) {

						//filter out just the public methods
						var methods = item.getMethods().filter(function (n) {
								return n.access == PRIVATE || n.access == PROTECTED;
						});

						var ret = '';

						if (methods.length > 0) {

								ret += "\t" + this.comment("Private Methods") + "\tprivate\n\n";

								//build the methods
								ret += this.buildCode_Methods(methods);
						}

						return ret;
				}

				//helper function for buildCode_PublicMethods and buildCode_PrivateMethods build out all the methods
		}, {
				key: "buildCode_Methods",
				value: function buildCode_Methods(methods) {

						//code to return
						var ret = '';

						if (methods.length > 0) {

								//loop over methods
								for (var i = 0; i < methods.length; i++) {

										//get the method
										var method = methods[i];

										ret += "\tdef " + (method.isStatic ? 'self.' : '') + method.mName + "()\n" + "\t\t" + this.comment("...") + "\tend\n\n";
								} //next i
						} //endif has methods

						return ret;
				}
		}]);

		return RubyCodeGenerator;
})(CodeGenerator);
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SwiftCodeGenerator = (function (_CodeGenerator) {
		_inherits(SwiftCodeGenerator, _CodeGenerator);

		function SwiftCodeGenerator(DOM) {
				_classCallCheck(this, SwiftCodeGenerator);

				_get(Object.getPrototypeOf(SwiftCodeGenerator.prototype), "constructor", this).call(this, DOM);

				//Make note of language name
				this.langName = "Swift";

				//set up comment styles
				this.singleLineComments = "// ";
				this.multiLineComments = { open: '/*\n',
						close: '\n*/',
						prefix: "\t" };

				//set up what this class supports:
				//Note: support is assumed by default, so this only has to disable features
				this.features = {
						abstract: false,
						methods: {
								abstract: false,
								"protected": false
						},
						members: {
								"protected": false
						}
				};

				//build the area for the code:
				this.DOM.append("<pre><code class=\"swift\"></code></pre>");

				//cache reference to the PRE tag
				this.codeDOM = $(this.DOM.find('code'));
		}

		//builds the code!

		_createClass(SwiftCodeGenerator, [{
				key: "buildCode",
				value: function buildCode(item, info) {

						//variable to build the code
						var ret = this.buildCode_Warnings(item, info) + this.buildCode_Definition(item, info) + "\n\n" + this.buildCode_Members(item, info) + this.buildCode_Constructor(item, info) + "\n\n" + this.buildCode_Destructor(item, info) + "\n\n" + this.buildCode_Methods(item, info) + "}";

						return ret;
				}

				//build essentially the first line of the class: the defition
		}, {
				key: "buildCode_Definition",
				value: function buildCode_Definition(item, info) {

						//build the left part that usually looks like "public final class foo"
						var ret = (info.isPublic ? 'public ' : 'internal ') + (info.isFinal ? 'final ' : '') + 'class ' + info.name;

						//if it extends anything, add that here:
						if (info.hasAncestor) ret += ': ' + info.ancestor;

						//if it implements any interfaces, add those here:
						if (info.hasInterfaces) {
								if (info.hasAncestor) ret += ', ';else ret += ': ';
								for (var i = 0; i < info.interfaces.length; i++) ret += info.interfaces[i].mName + ', ';
								//truncate last two chars (', ')
								ret = ret.substring(0, ret.length - 2);
						}

						//finally add the '{'
						ret += ' {';
						return ret;
				}

				//build out all the member variables
		}, {
				key: "buildCode_Members",
				value: function buildCode_Members(item, info) {

						var typeToStr = ['', 'Int', 'Int16', 'Int64', 'Int8', 'Float', 'Double', 'Character', 'String', 'Boolean'];
						var accessToStr = ['private', 'public', 'private'];

						//get list of methods
						var members = info.members;

						//code to return
						var ret = '';

						if (info.hasMembers) {

								//code to return:
								ret = "\t" + this.comment("Member Variables");

								//loop over methods
								for (var i = 0; i < members.length; i++) {

										//get the method
										var member = members[i];

										ret += "\t" + accessToStr[member.access] + ' ' + (member.isFinal ? 'final ' : '') + (member.isStatic ? 'static ' : '') + (member.isConst ? 'let ' : 'var ') + member.mName + (member.mType != VOID ? ": " + typeToStr[parseInt(member.mType)] : "");

										if (member.val != null) {
												switch (parseInt(member.mType)) {
														case INT:
														case SHORT:
														case LONG:
														case BYTE:
														case DOUBLE:
																ret += " = " + member.val;
																break;
														case FLOAT:
																ret += " = " + member.val + 'f';
																break;
														case CHAR:
														case STRING:
																ret += " = \"" + member.val + "\"";
																break;
														case BOOLEAN:
																ret += " = " + member.val.toString();
																break;
												} //swatch
										} //has default value

										//apply the new line
										ret += "\n";
								} //next i

								//apply the new line
								ret += "\n";
						} //endif has methods

						return ret;
				}

				//build a constructor method for the class:
		}, {
				key: "buildCode_Constructor",
				value: function buildCode_Constructor(item, info) {

						var ret = "\t" + this.comment("Constructor") + "\tinit()";

						ret += "{\n" + "\n\t\t" + this.comment("...") + (info.hasAncestor ? "\n\t\t" + this.comment("Call Super Constructor") + "\t\tsuper.init()\n" : "") + "\t}";
						return ret;
				}

				//build a Destructor method for the class:
		}, {
				key: "buildCode_Destructor",
				value: function buildCode_Destructor(item, info) {

						var ret = "\t" + this.comment("Optional Destructor") + "\tdeinit ";

						ret += "{" + "\n\t\t" + this.comment("...") + "\t}";
						return ret;
				}

				//build out all the methods
		}, {
				key: "buildCode_Methods",
				value: function buildCode_Methods(item, info) {

						var typeToStr = ['', 'Int', 'Int16', 'Int64', 'Int8', 'Float', 'Double', 'Character', 'String', 'Boolean'];
						var accessToStr = ['private', 'public', 'private'];

						//get list of methods
						var methods = info.methods;

						//code to return
						var ret = '';

						if (info.hasMethods) {

								//code to return:
								ret = "\t" + this.comment("Methods");

								//loop over methods
								for (var i = 0; i < methods.length; i++) {

										//get the method
										var method = methods[i];

										ret += "\t" + accessToStr[method.access] + ' ' + (method.isStatic ? 'static ' : '') + (method.isConst ? 'final ' : '') + "func " + method.mName + "()" + (method.mType != VOID ? " -> " + typeToStr[parseInt(method.mType)] + ' ' : "") + "{\n" + "\t\t" + this.comment("...") + "\t}\n\n";
								} //next i
						} //endif has methods

						return ret;
				}
		}]);

		return SwiftCodeGenerator;
})(CodeGenerator);
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TypeScriptCodeGenerator = (function (_CodeGenerator) {
		_inherits(TypeScriptCodeGenerator, _CodeGenerator);

		function TypeScriptCodeGenerator(DOM) {
				_classCallCheck(this, TypeScriptCodeGenerator);

				_get(Object.getPrototypeOf(TypeScriptCodeGenerator.prototype), "constructor", this).call(this, DOM);

				//Make note of language name
				this.langName = "TypeScript";

				//set up comment styles
				this.singleLineComments = "// ";
				this.multiLineComments = { open: '/*\n',
						close: '\n*/',
						prefix: "\t" };

				//set up what this class supports:
				//Note: support is assumed by default, so this only has to disable features
				this.features = {
						abstract: false,
						final: false,
						"private": false,
						methods: {
								final: false,
								abstract: false
						},
						members: {}
				};

				//build the area for the code:
				this.DOM.append("<pre><code class=\"typescript\"></code></pre>");

				//cache reference to the PRE tag
				this.codeDOM = $(this.DOM.find('code'));

				//colorize it
				hljs.highlightBlock(this.codeDOM[0]);
		}

		//builds the code!

		_createClass(TypeScriptCodeGenerator, [{
				key: "buildCode",
				value: function buildCode(item, info) {

						//variable to build the code
						var ret = this.buildCode_Warnings(item, info) + this.buildCode_Definition(item, info) + "\n" + this.buildCode_Members(item, info) + this.buildCode_Constructor(item, info) + "\n" + this.buildCode_MemberAssignments(item, info) + "\t\t" + this.comment("...") + "\t}\n\n" + this.buildCode_Methods(item, info) + this.buildCode_Constants(item, info) + "}";

						return ret;
				}

				//build essentially the first line of the class: the defition
		}, {
				key: "buildCode_Definition",
				value: function buildCode_Definition(item, info) {

						//build the left part that usually looks like "public final class foo"
						var ret = 'class ' + info.name;

						//if it extends anything, add that here:
						if (info.hasAncestor) ret += ' extends ' + info.ancestor;

						//if it implements any interfaces, add those here:
						if (info.hasInterfaces) {
								ret += ' implements ';
								for (var i = 0; i < info.interfaces.length; i++) ret += info.interfaces[i].mName + ', ';
								//truncate last two chars (', ')
								ret = ret.substring(0, ret.length - 2);
						}

						//finally add the '{'
						ret += ' {';
						return ret;
				}

				//build out all the member variables
		}, {
				key: "buildCode_Members",
				value: function buildCode_Members(item, info) {

						var typeToStr = ['void', 'number', 'number', 'number', 'number', 'number', 'number', 'string', 'string', 'boolean'];
						var typeDefaults = [null, 0, 0, 0, 0, '0.0', '0.0', '', '', 'false'];
						var accessToStr = ['private', 'public', 'protected'];

						//get list of members and filter statics
						var statics = item.getMembers().filter(function (n) {
								return n.isStatic == true && n.isConst != true;
						});

						//code to return
						var ret = '';

						if (statics.length > 0) {

								//code to return:
								ret = "\n\t" + this.comment("Static Member Variables");

								//loop over methods
								for (var i = 0; i < statics.length; i++) {

										//get the method
										var itm = statics[i];

										ret += "\tstatic " + itm.mName + ': ' + typeToStr[parseInt(itm.mType)];

										if (itm.val != null) {
												switch (parseInt(itm.mType)) {
														case INT:
														case DOUBLE:
														case SHORT:
														case LONG:
														case BYTE:
														case FLOAT:
																ret += " = " + itm.val;
																break;
														case CHAR:
																ret += " = '" + itm.val + "'";
																break;
														case STRING:
																ret += " = \"" + itm.val + "\"";
																break;
														case BOOLEAN:
																ret += " = " + itm.val.toString();
																break;
												} //swatch
										} else {
														ret += " = " + typeDefaults[itm.mType];
												} //has default value

										//apply the semicolon and new line
										ret += ";\n";
								} //next i
						} //endif has methods

						//now lets get a list of the non-statics, non-constants
						var members = item.getMembers().filter(function (n) {
								return n.isStatic != true && n.isConst != true;
						});

						if (members.length > 0) {

								//code to return:
								ret += "\n\t" + this.comment("Member Variables");

								//loop over methods
								for (var i = 0; i < members.length; i++) {

										//get the method
										var itm = members[i];

										ret += "\t" + accessToStr[itm.access] + ' ' + itm.mName + ': ' + typeToStr[parseInt(itm.mType)] + ";\n";
								} //next i
						} //endif has methods

						return ret;
				}

				//build a constructor method for the class:
		}, {
				key: "buildCode_Constructor",
				value: function buildCode_Constructor(item, info) {

						var ret = "\n\t" + this.comment("Constructor") + "\tconstructor(){\n";

						//if the class has an ancestor lets call super in the constructor!
						if (item.getAncestor() != null && item.getAncestor != "") ret += "\n\t\t" + this.comment("Call Super Constructor") + "\t\tsuper();\n";
						return ret;
				}

				//build out all the member variables
		}, {
				key: "buildCode_MemberAssignments",
				value: function buildCode_MemberAssignments(item, info) {

						var typeToStr = ['void', 'int', 'short', 'long', 'byte', 'float', 'double', 'char', 'String', 'boolean'];

						//get list of methods that are not static or constants
						var members = item.getMembers().filter(function (n) {
								return n.isStatic != true && n.isConst != true;
						});

						//filter out members that do actually have an initial value
						members = members.filter(function (n) {
								return n.val != null;
						});

						//code to return
						var ret = '';

						if (members.length > 0) {

								//code to return:
								ret = "\t\t" + this.comment("Initialize Member Variables");

								//loop over methods
								for (var i = 0; i < members.length; i++) {

										//get the method
										var itm = members[i];

										ret += "\t\tthis." + itm.mName;

										//since we filted the members arealdy, it's gaurented to have a value
										//no need to check again
										switch (parseInt(itm.mType)) {
												case INT:
												case DOUBLE:
												case SHORT:
												case LONG:
												case BYTE:
												case FLOAT:
														ret += " = " + itm.val;
														break;
												case CHAR:
														ret += " = '" + itm.val + "'";
														break;
												case STRING:
														ret += " = \"" + itm.val + "\"";
														break;
												case BOOLEAN:
														ret += " = " + itm.val.toString();
														break;
										} //swatch

										//apply the semicolon and new line
										ret += ";\n";
								} //next i

								ret += "\n";
						} //endif has methods

						return ret;
				}

				//build out all the methods
		}, {
				key: "buildCode_Methods",
				value: function buildCode_Methods(item, info) {

						var typeToStr = ['void', 'number', 'number', 'number', 'number', 'number', 'number', 'string', 'string', 'boolean'];
						var accessToStr = ['private', 'public'];

						//get list of methods
						var methods = item.getMethods();

						//code to return
						var ret = '';

						if (methods.length > 0) {

								//code to return:
								ret = "\t" + this.comment("Methods");

								//loop over methods
								for (var i = 0; i < methods.length; i++) {

										//get the method
										var method = methods[i];

										ret += "\t" + accessToStr[method.access] + ' ' + (method.isStatic ? 'static ' : '') + method.mName + "(): " + typeToStr[parseInt(method.mType)] + "{\n" + "\t\t" + this.comment("...") + "\t}\n\n";
								} //next i
						} //endif has methods

						return ret;
				}
		}, {
				key: "buildCode_Constants",
				value: function buildCode_Constants(item, info) {

						var typeToStr = ['void', 'number', 'number', 'number', 'number', 'number', 'number', 'string', 'string', 'boolean'];
						var typeDefaults = [null, 0, 0, 0, 0, '0.0', '0.0', '', '', 'false'];
						var accessToStr = ['private', 'public', 'protected'];

						//get list of members and filter statics
						var constants = info.constMembers;

						//code to return
						var ret = '';

						if (info.hasConstMembers) {

								//code to return:
								ret = "\t" + this.comment("Constants") + "\t" + this.comment("NOTE: TypeScript does not natively support constants.") + "\t" + this.comment("This section is a workaround described here: http://tinyurl.com/op776sg");

								//loop over methods
								for (var i = 0; i < constants.length; i++) {

										//get the method
										var itm = constants[i];

										ret += "\tpublic static get " + itm.mName + ': ' + typeToStr[parseInt(itm.mType)] + " { return ";

										if (itm.val != null) {
												switch (parseInt(itm.mType)) {
														case INT:
														case DOUBLE:
														case SHORT:
														case LONG:
														case BYTE:
														case FLOAT:
																ret += itm.val;
																break;
														case CHAR:
																ret += "'" + itm.val + "'";
																break;
														case STRING:
																ret += "\"" + itm.val + "\"";
																break;
														case BOOLEAN:
																ret += itm.val.toString();
																break;
												} //swatch
										} else {
														ret += typeDefaults[itm.mType];
												} //has default value

										//apply the semicolon and new line
										ret += "; }\n";
								} //next i

								ret += "\n";
						} //endif has methods

						return ret;
				}
		}]);

		return TypeScriptCodeGenerator;
})(CodeGenerator);
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VanillaJSCodeGenerator = (function (_CodeGenerator) {
		_inherits(VanillaJSCodeGenerator, _CodeGenerator);

		function VanillaJSCodeGenerator(DOM) {
				_classCallCheck(this, VanillaJSCodeGenerator);

				_get(Object.getPrototypeOf(VanillaJSCodeGenerator.prototype), "constructor", this).call(this, DOM);

				//Make note of language name
				this.langName = "Vanilla JavaScript";

				//set up comment styles
				this.singleLineComments = "// ";
				this.multiLineComments = { open: '/*\n',
						close: '\n*/',
						prefix: "\t" };

				//set up what this class supports:
				//Note: support is assumed by default, so this only has to disable features
				this.features = {
						inheritance: false,
						interfaces: false,
						final: false,
						abstract: false,
						"private": false,
						types: false,
						methods: {
								final: false,
								abstract: false,
								"private": false,
								"protected": false
						},
						members: {
								final: false,
								"private": false,
								"protected": false
						}
				};

				//build the area for the code:
				this.DOM.append("<pre><code class=\"javascript\"></code></pre>");

				//cache reference to the PRE tag
				this.codeDOM = $(this.DOM.find('code'));

				//colorize it
				hljs.highlightBlock(this.codeDOM[0]);
		}

		//builds the code!

		_createClass(VanillaJSCodeGenerator, [{
				key: "buildCode",
				value: function buildCode(item, info) {

						//variable to build the code
						var ret = this.buildCode_Warnings(item, info) + this.buildCode_Definition(item, info) + "\n\n" + this.buildCode_Constructor(item, info) + "\t" + this.comment("...") + "}\n\n" + this.buildCode_Prototype(item, info) + this.buildCode_Constants(item, info) + this.buildCode_StaticMembers(item, info) + this.buildCode_StaticMethods(item, info);

						return ret;
				}

				//build essentially the first line of the class: the defition
		}, {
				key: "buildCode_Definition",
				value: function buildCode_Definition(item, info) {

						//build the left part that usually looks like "public final class foo"
						var ret = 'var ' + info.name + " = function(){ ";

						//if it extends anything, add that here:
						//var ancestor = item.getAncestor();
						//if(ancestor!=null && ancestor!='')
						//	ret += ' extends ' + ancestor;

						//if it implements any interfaces, add those here:
						if (info.hasInterfaces) {
								ret += this.comment('implements ', false);
								for (var i = 0; i < info.interfaces.length; i++) ret += info.interfaces[i].mName + ', ';
								//truncate last two chars (', ')
								ret = ret.substring(0, ret.length - 2);
						}

						return ret;
				}

				//build a constructor method for the class:
		}, {
				key: "buildCode_Constructor",
				value: function buildCode_Constructor(item, info) {

						var ret = "\t" + this.comment("Constructor");

						//if this class is abstract when a put in the abstract hack
						if (info.isAbstract) {

								ret += "\n\t" + this.comment("JavaScript doesn't natively support Abstract classes, but this solution is a hack that attempts to solve that.") + "\t" + this.comment("Found here: http://tinyurl.com/nhmhc4z") + "\tif (new.target === " + info.name + "){\n" + "\t\tthrow new TypeError(\"Cannot construct Abstract instances directly\");\n" + "\t}\n\n";
						}
						/*
      //if the class has an ancestor lets call super in the constructor!
      if(item.getAncestor()!=null && item.getAncestor!="")
      	ret += 	"\n\t// call super constructor\n" + 
      			"\tsuper();\n";*/

						return ret;
				}

				//make the prototype
		}, {
				key: "buildCode_Prototype",
				value: function buildCode_Prototype(item, info) {

						//use the otehr buildings to make the prototypes components
						var ret = info.name + ".prototype = {\n\n" + this.buildCode_Members(item, info) + this.buildCode_Methods(item, info);

						//remove the last comma:
						ret = ret.split(',');
						ret = ret.splice(0, ret.length - 1).join(',') + ret[ret.length - 1];

						//close the prototype area
						ret += "}\n\n";

						return ret;
				}

				//build out all the member variables
		}, {
				key: "buildCode_Members",
				value: function buildCode_Members(item, info) {

						var typeDefaults = [null, 0, 0, 0, 0, '0.0', '0.0', '', '', 'false'];

						//get list of methods and filter out static methods and constants
						var members = item.getMembers().filter(function (n) {
								return n.isStatic != true && n.isConst != true;
						});

						//code to return
						var ret = '';

						if (members.length > 0) {

								ret += "\t" + this.comment("Member Variables");

								for (var i = 0; i < members.length; i++) {

										var itm = members[i];

										ret += "\t" + itm.mName + ": ";

										if (itm.val != null) {
												switch (parseInt(itm.mType)) {
														case INT:
														case DOUBLE:
														case SHORT:
														case LONG:
														case BYTE:
														case FLOAT:
																ret += itm.val;
																break;
														case CHAR:
																ret += "'" + itm.val + "'";
																break;
														case STRING:
																ret += "\"" + itm.val + "\"";
																break;
														case BOOLEAN:
																ret += itm.val.toString();
																break;
												} //swatch
										} else {
														ret += typeDefaults[itm.mType];
												} //has default value

										//add semicolon and new line
										ret += ",\n";
								} //next i

								ret += "\n";
						}

						return ret;
				}

				//build out all the methods
		}, {
				key: "buildCode_Methods",
				value: function buildCode_Methods(item, info) {

						//get list of methods and filter out static ones
						var methods = item.getMethods().filter(function (n) {
								return n.isStatic != true;
						});

						//code to return
						var ret = '';

						if (methods.length > 0) {

								//code to return:
								ret = "\t" + this.comment("Methods");

								//loop over methods
								for (var i = 0; i < methods.length; i++) {

										//get the method
										var method = methods[i];

										ret += "\t" + method.mName + ": function(){\n" + "\t\t//...\n" + "\t},\n";
								} //next i
						} //endif has methods

						return ret;
				}

				//filter out and display constants before the class actually starts
		}, {
				key: "buildCode_Constants",
				value: function buildCode_Constants(item, info) {

						var typeDefaults = [null, 0, 0, 0, 0, '0.0', '0.0', '', '', 'false'];

						//get just constants
						var constants = info.constMembers;

						var ret = '';

						if (info.hasConstMembers) {

								ret += this.comment("Constants") + this.comment("NOTE: JavaScript doesn't natively support constants.") + this.comment("Using all caps is a convention, but doesn't actually make them immutable.");

								for (var i = 0; i < constants.length; i++) {

										var constant = constants[i];

										//get conver the name to CONSTANT_STYLE
										var name = constant.mName.replace(/([A-Z].)/g, '_$1');
										if (name.charAt(0) == '_') name = name.substr(1);
										name = name.toUpperCase();

										ret += item.getName() + "." + name + " = ";

										if (constant.val != null) {
												switch (parseInt(constant.mType)) {
														case INT:
														case DOUBLE:
														case SHORT:
														case LONG:
														case BYTE:
														case FLOAT:
																ret += constant.val;
																break;
														case CHAR:
																ret += "'" + constant.val + "'";
																break;
														case STRING:
																ret += "\"" + constant.val + "\"";
																break;
														case BOOLEAN:
																ret += constant.val.toString();
																break;
												} //swatch
										} else {
														ret += typeDefaults[constant.mType];
												} //has default value

										//add semicolon and new line
										ret += ";\n";
								} //next i

								ret += "\n";
						}

						return ret;
				}

				//build out just the static members
		}, {
				key: "buildCode_StaticMembers",
				value: function buildCode_StaticMembers(item, info) {

						var typeDefaults = [null, 0, 0, 0, 0, '0.0', '0.0', '', '', 'false'];

						//get just static members`
						var members = info.staticMembers;

						var ret = '';

						if (info.hasStaticMembers) {

								ret += this.comment("Static Members");

								for (var i = 0; i < members.length; i++) {

										var member = members[i];

										ret += info.name + "." + members[i].mName;

										if (member.val != null) {
												switch (parseInt(member.mType)) {
														case INT:
														case DOUBLE:
														case SHORT:
														case LONG:
														case BYTE:
														case FLOAT:
																ret += " = " + member.val;
																break;
														case CHAR:
																ret += " = '" + member.val + "'";
																break;
														case STRING:
																ret += " = \"" + member.val + "\"";
																break;
														case BOOLEAN:
																ret += " = " + member.val.toString();
																break;
												} //swatch
										} else {
														ret += " = " + typeDefaults[member.mType];
												} //has default value

										//add semicolon and new line
										ret += ";\n";
								} //next i

								ret += "\n";
						}

						return ret;
				}
		}, {
				key: "buildCode_StaticMethods",
				value: function buildCode_StaticMethods(item, info) {

						//get list of methods and filter only static ones
						var methods = info.staticMethods;

						//code to return
						var ret = '';

						if (info.hasStaticMethods) {

								//code to return:
								ret = this.comment("Static Methods");

								//loop over methods
								for (var i = 0; i < methods.length; i++) {

										//get the method
										var method = methods[i];

										ret += info.name + "." + method.mName + " = function(){\n" + "\t//...\n" + "}\n";
								} //next i
						} //endif has methods

						return ret;
				}
		}]);

		return VanillaJSCodeGenerator;
})(CodeGenerator);
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VB6CodeGenerator = (function (_CodeGenerator) {
	_inherits(VB6CodeGenerator, _CodeGenerator);

	function VB6CodeGenerator(DOM) {
		_classCallCheck(this, VB6CodeGenerator);

		_get(Object.getPrototypeOf(VB6CodeGenerator.prototype), "constructor", this).call(this, DOM);

		//Make note of language name
		this.langName = "VB6";

		//set up comment styles
		this.singleLineComments = "'";
		this.multiLineComments = { open: '',
			close: '',
			prefix: "'" };

		//set up what this class supports:
		//Note: support is assumed by default, so this only has to disable features
		this.features = {
			inheritance: false,
			final: false,
			abstract: false,
			"private": false,
			methods: {
				abstract: false,
				final: false,
				"static": false,
				"protected": false
			},
			members: {
				final: true,
				"static": false,
				"protected": false
			}
		};

		//build the area for the code:
		this.DOM.append("<pre><code class=\"vbscript\"></code></pre>");

		//cache reference to the PRE tag
		this.codeDOM = $(this.DOM.find('code'));
	}

	//builds the code!

	_createClass(VB6CodeGenerator, [{
		key: "buildCode",
		value: function buildCode(item, info) {
			var ret = this.buildCode_Warnings(item, info) + this.buildCode_Definition(item, info) + this.buildCode_Constants(item, info) + this.buildCode_Members(item, info) + this.buildCode_Constructor(item, info) + "\n" + this.buildCode_Methods(item, info);

			return ret;
		}

		//build essentially the first line of the class: the defition
	}, {
		key: "buildCode_Definition",
		value: function buildCode_Definition(item, info) {

			//build the left part that usually looks like "public final class foo"
			var ret = this.comment("NOTE: " + this.langName + " doesn't have syntax for definging a class. This code belongs in a file called: \"" + info.name + ".cls\".");

			//if it has interfaces, lets spit em out
			if (info.hasInterfaces) {
				for (var i = 0; i < info.interfaces.length; i++) {
					ret += "Implements " + info.interfaces[i].mName + "\n";
				} //next i
			}
			ret += "\n";

			return ret;
		}

		//build out all the member variables
	}, {
		key: "buildCode_Constants",
		value: function buildCode_Constants(item, info) {

			var typeToStr = ['Void', 'Integer', 'Integer', 'Long', 'Byte', 'Single', 'Double', 'String', 'String', 'Boolean'];
			var accessToStr = ['Private', 'Public', 'Private'];
			var typeDefaults = ["Null", 0, 0, 0, 0, '0.0', '0.0', '', '', 'False'];

			//get list of methods
			var items = info.constMembers;

			//code to return
			var ret = '';

			if (info.hasConstMembers > 0) {

				//code to return:
				ret = this.comment("Constants") + this.comment("NOTE: In " + this.langName + " Class Constants can only be private.");

				//loop over methods
				for (var i = 0; i < items.length; i++) {

					//get the method
					var itm = items[i];

					ret += 'Private Const ' + itm.mName + ' As ' + typeToStr[parseInt(itm.mType)] + " = ";

					if (itm.val != null) {
						switch (parseInt(itm.mType)) {
							case INT:
							case DOUBLE:
							case SHORT:
							case LONG:
							case BYTE:
							case FLOAT:
								ret += itm.val;
								break;
							case CHAR:
								ret += "'" + itm.val + "'";
								break;
							case STRING:
								ret += "\"" + itm.val + "\"";
								break;
							case BOOLEAN:
								ret += this.firstToUpper(itm.val);
								break;
						} //swatch
					} else {
							ret += typeDefaults[itm.mType];
						} //has default value

					//apply the new line
					ret += "\n";
				} //next i
				ret += "\n";
			} //endif has constnats

			return ret;
		}

		//build out all the member variables
	}, {
		key: "buildCode_Members",
		value: function buildCode_Members(item, info) {

			var typeToStr = ['Void', 'Integer', 'Integer', 'Long', 'Byte', 'Single', 'Double', 'String', 'String', 'Boolean'];
			var accessToStr = ['Private', 'Public', 'Private'];
			var typeDefaults = ["Null", 0, 0, 0, 0, '0.0', '0.0', '', '', 'False'];

			//get list of methods
			var items = item.getMembers().filter(function (n) {
				return n.isConst != true;
			});

			//code to return
			var ret = '';

			if (items.length > 0) {

				//code to return:
				ret = this.comment("Members");

				//loop over methods
				for (var i = 0; i < items.length; i++) {

					//get the method
					var itm = items[i];
					ret += accessToStr[itm.access] + ' ' + itm.mName + ' As ' + typeToStr[parseInt(itm.mType)] + "\n";
				} //next i
				ret += "\n";
			} //endif has constnats

			return ret;
		}

		//build a constructor method for the class:
	}, {
		key: "buildCode_Constructor",
		value: function buildCode_Constructor(item, info) {

			var ret = this.comment("Constructor") + this.comment("NOTE: " + this.langName + " Constructors cannot take parameters!") + "Private Sub Class_Initialize()\n";

			//get list of methods
			var items = item.getMembers().filter(function (n) {
				return n.isConst != true && n.val != null;
			});

			if (items.length > 0) {

				ret += "\n\t" + this.comment("Intitlize our Member Variables");

				//loop over methods
				for (var i = 0; i < items.length; i++) {

					//get the method
					var itm = items[i];

					ret += "\t" + itm.mName + ' = ';

					switch (parseInt(itm.mType)) {
						case INT:
						case DOUBLE:
						case SHORT:
						case LONG:
						case BYTE:
						case FLOAT:
							ret += itm.val;
							break;
						case CHAR:
						case STRING:
							ret += "\"" + itm.val + "\"";
							break;
						case BOOLEAN:
							ret += this.firstToUpper(itm.val);
							break;
					} //swatch

					//apply the new line
					ret += "\n";
				} //next i
			} //has stuff to init
			ret += "\n\t'...\n" + "End Sub\n";
			return ret;
		}

		//build out all the methods
	}, {
		key: "buildCode_Methods",
		value: function buildCode_Methods(item, info) {

			var typeToStr = ['Void', 'Integer', 'Integer', 'Long', 'Byte', 'Single', 'Double', 'String', 'String', 'Boolean'];
			var accessToStr = ['Private', 'Public', 'Private'];

			//get list of methods
			var methods = info.methods;

			//code to return
			var ret = '';

			if (info.hasMethods) {

				//code to return:
				ret = this.comment("Methods");

				//loop over methods
				for (var i = 0; i < methods.length; i++) {

					//get the method
					var method = methods[i];

					if (method.mType == VOID) ret += accessToStr[method.access] + ' Sub ' + method.mName + "()\n" + "\t" + this.comment("...") + "End Sub\n\n";else ret += accessToStr[method.access] + ' Function ' + method.mName + "() As " + typeToStr[parseInt(method.mType)] + "\n" + "\t" + this.comment("...") + "End Sub\n\n";
				} //next i
			} //endif has methods

			return ret;
		}
	}]);

	return VB6CodeGenerator;
})(CodeGenerator);
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VBCodeGenerator = (function (_CodeGenerator) {
	_inherits(VBCodeGenerator, _CodeGenerator);

	function VBCodeGenerator(DOM) {
		_classCallCheck(this, VBCodeGenerator);

		_get(Object.getPrototypeOf(VBCodeGenerator.prototype), 'constructor', this).call(this, DOM);

		//so this resovles in all scopes:
		var me = this;

		//add an area to let the user pick between our three flavors of JS: Native, TypeScript, ES6
		//as well as containers for our childen elements
		this.DOM.html('<div class="GenHeader">' + 'Visual Basic has multiple implementations, choose your flavor!<br>' + '<div class="options">' + '<input type="radio" name="optFlavVB" id="opt01v" value="01" checked><label for="opt01v">VB.NET</label> ' + '<input type="radio" name="optFlavVB" id="opt02v" value="02"><label for="opt02v">VB6</label> ' + '</div>' + '</div>' + '<div id="SubTab_01" class="SubTab"></div>' + '<div id="SubTab_02" class="SubTab" style="display:none;"></div>');

		//create generators for each type of JS
		this.codeGenerators = [];
		this.codeGenerators.push(new VBNetCodeGenerator(this.DOM.find('#SubTab_01')));
		this.codeGenerators.push(new VB6CodeGenerator(this.DOM.find('#SubTab_02')));

		//bind event for the option boxes to switch out the code.
		this.DOM.find("input").bind('click change', function (e) {

			//get the ID
			var id = $(this).val();

			//hide all JS tabs
			me.DOM.find('.SubTab').hide();

			//show just the selected tab
			me.DOM.find('#SubTab_' + id).show();
		});
		this.DOM.find('label').mousemove(function (e) {
			e.preventDefault();
		});
	}

	//OVERRIDE the parents update method, so we can update all of our children!
	//takes a class item and rebuilds the appropriate source code based on the class item for this language

	_createClass(VBCodeGenerator, [{
		key: 'update',
		value: function update(item, extraCodeSamples) {

			//update each of the code generators!
			for (var g = 0; g < this.codeGenerators.length; g++) {

				//get the generator
				var generator = this.codeGenerators[g];

				//tell it to update it's class
				generator.update(item, extraCodeSamples);
			} //next g
		}
	}]);

	return VBCodeGenerator;
})(CodeGenerator);
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VBNetCodeGenerator = (function (_CodeGenerator) {
		_inherits(VBNetCodeGenerator, _CodeGenerator);

		function VBNetCodeGenerator(DOM) {
				_classCallCheck(this, VBNetCodeGenerator);

				_get(Object.getPrototypeOf(VBNetCodeGenerator.prototype), "constructor", this).call(this, DOM);

				//Make note of language name
				this.langName = "VB.NET";

				//set up comment styles
				this.singleLineComments = "'";
				this.multiLineComments = { open: '',
						close: '',
						prefix: "'" };

				//set up what this class supports:
				//Note: support is assumed by default, so this only has to disable features
				this.features = {
						methods: {},
						members: {}
				};

				//build the area for the code:
				this.DOM.append("<pre><code class=\"vbnet\"></code></pre>");

				//cache reference to the PRE tag
				this.codeDOM = $(this.DOM.find('code'));
		}

		//builds the code!

		_createClass(VBNetCodeGenerator, [{
				key: "buildCode",
				value: function buildCode(item, info) {

						//variable to build the code
						var ret = this.buildCode_Warnings(item, info) + this.buildCode_Definition(item, info) + "\n\n" + this.buildCode_Members(item, info) + this.buildCode_Constructor(item, info) + "\n\n" + this.buildCode_Methods(item, info) + "End Class";

						return ret;
				}

				//build essentially the first line of the class: the defition
		}, {
				key: "buildCode_Definition",
				value: function buildCode_Definition(item, info) {

						//build the left part that usually looks like "public final class foo"
						var ret = (info.isPublic ? 'Public ' : 'Private ') + (info.isFinal ? 'NotInheritable ' : '') + (info.isAbstract ? 'MustInherit ' : '') + 'Class ' + info.name;

						//if it extends anything, add that here:
						if (info.hasAncestor) ret += '\n\tInherits ' + info.ancestor;

						//if it implements any interfaces, add those here:
						if (info.hasInterfaces) {
								for (var i = 0; i < info.interfaces.length; i++) ret += "\n\tImplements " + info.interfaces[i].mName;
						}

						return ret;
				}

				//build out all the member variables
		}, {
				key: "buildCode_Members",
				value: function buildCode_Members(item, info) {

						//var typeToStr = ['void', 'int', 'short', 'long', 'byte', 'float', 'double', 'char', 'String', 'boolean'];
						var typeToStr = ['Void', 'Integer', 'Integer', 'Long', 'Byte', 'Single', 'Double', 'String', 'String', 'Boolean'];
						var accessToStr = ['Private', 'Public', 'Protected'];
						var typeDefaults = ["Null", 0, 0, 0, 0, '0.0', '0.0', '', '', 'False'];

						//get list of methods
						var members = info.members;

						//code to return
						var ret = '';

						if (info.hasMembers) {

								//code to return:
								ret = "\t" + this.comment("Member Variables");

								//loop over methods
								for (var i = 0; i < members.length; i++) {

										//get the method
										var member = members[i];

										ret += "\t" + accessToStr[member.access] + ' ' + (member.isStatic && !member.isConst ? 'Shared ' : '') + (member.isConst ? 'Const ' : '') + member.mName + " As " + typeToStr[parseInt(member.mType)];

										if (member.val != null) {
												switch (parseInt(member.mType)) {
														case INT:
														case DOUBLE:
														case SHORT:
														case LONG:
														case BYTE:
														case FLOAT:
																ret += " = " + member.val;
																break;
														case CHAR:
																ret += " = \"" + member.val + "\"";
																break;
														case STRING:
																ret += " = \"" + member.val + "\"";
																break;
														case BOOLEAN:
																ret += " = " + this.firstToUpper(member.val);
																break;
												} //swatch
										} //has default value

										//apply the semicolon and new line
										ret += "\n";
								} //next i
								ret += "\n";
						} //endif has methods

						return ret;
				}

				//build a constructor method for the class:
		}, {
				key: "buildCode_Constructor",
				value: function buildCode_Constructor(item, info) {

						var ret = "\t" + this.comment("Constructor") + "\tPublic Sub New()\n";

						//if the class has an ancestor lets call super in the constructor!
						if (info.hasAncestor) ret += "\n\t\t" + this.comment("Call Super Constructor") + "\t\tMyBase.new()\n";

						ret += "\n\t\t" + this.comment("...") + "\tEnd Sub";
						return ret;
				}

				//build out all the methods
		}, {
				key: "buildCode_Methods",
				value: function buildCode_Methods(item, info) {

						var typeToStr = ['Void', 'Integer', 'Integer', 'Long', 'Byte', 'Single', 'Double', 'String', 'String', 'Boolean'];
						var accessToStr = ['Private', 'Public', 'Protected'];

						//get list of methods
						var methods = info.methods;

						//code to return
						var ret = '';

						if (info.hasMethods) {

								//code to return:
								ret = "\t" + this.comment("Methods");

								//loop over methods
								for (var i = 0; i < methods.length; i++) {

										//get the method
										var method = methods[i];

										var VBMethodType = method.mType == VOID ? "Sub" : "Function";

										ret += "\t" + accessToStr[method.access] + ' ' + (method.isStatic ? 'Shared ' : '') + (method.isConst ? 'NotOverridable ' : '') + VBMethodType + " " + method.mName + "()" + (method.mType == VOID ? "" : " As " + typeToStr[parseInt(method.mType)]) + "\n" + "\t\t" + this.comment("...") + "\tEnd " + VBMethodType + "\n\n";
								} //next i
						} //endif has methods

						return ret;
				}
		}]);

		return VBNetCodeGenerator;
})(CodeGenerator);