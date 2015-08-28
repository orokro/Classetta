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
class ClassEditor{

	constructor(clsItem, EditorDOM){

		//variable so scope will resolve in call backs
		var me = this;

		//save the itintial class item:
		this.currentClassItem = clsItem;

		//save reference to our dom
		this.DOM = EditorDOM;

		//lets cache a bunch of jQuery searchs for useful elements
		this.area = {
						classname:  {	DOM: this.DOM.find('#classname'),
										txt: this.DOM.find('#classname').find(':text'),
										nfo: this.DOM.find('#classname').find('.infobox'),
										chkClassPublic: this.DOM.find('#chkClassPublic'),
										chkClassFinal: this.DOM.find('#chkClassFinal'),
										chkClassAbstract: this.DOM.find('#chkClassAbstract')
									},
						ancestor:   {	DOM: this.DOM.find('#ancestor'),
										txt: this.DOM.find('#ancestor').find('input'),
										nfo: this.DOM.find('#ancestor').find('.infobox')
									},
						interfaces: {	DOM: this.DOM.find('#interfaces'),
										txt: this.DOM.find('#interfaces').find('input'),
										cmd: this.DOM.find('#interfaces').find('button'),
										nfo: this.DOM.find('#interfaces').find('.infobox'),
										lst: this.DOM.find('#interfaces').find('.entries')
									},
						members:  	{	DOM: this.DOM.find('#members'),
										txt: this.DOM.find('#members').find('input'),
										cmd: this.DOM.find('#members').find('button'),
										nfo: this.DOM.find('#members').find('.infobox'),
										lst: this.DOM.find('#members').find('.entries')
									},
						methods:  	{	DOM: this.DOM.find('#methods'),
										txt: this.DOM.find('#methods').find('input'),
										cmd: this.DOM.find('#methods').find('button'),
										nfo: this.DOM.find('#methods').find('.infobox'),
										lst: this.DOM.find('#methods').find('.entries')
									}
					};
						

		//start with the basics - lets make the panels toggleable
		this.DOM.find('.toggleBar').click(function(e){

			//get the next toggle wrapper
			var wrapper = $(this).next('.toggleWrapper');

			var headerActivated = this;
			wrapper.slideToggle("slow", function(){

				if(wrapper.is(':visible'))
					$(headerActivated).text('▼' + $(headerActivated).text().substr(1) );
				else
					$(headerActivated).text('►' + $(headerActivated).text().substr(1) );

			});

		});

		//prevent dragging from messing up selection
		this.DOM.find('.toggleBar').mousedown(function(e){ e.preventDefault(); });
		this.DOM.find('label').mousedown(function(e){ e.preventDefault(); });

		//Lots of events to bind ...

		//make the table rows red when the delete flag is hovered over
		this.DOM.mouseover( function(e)	{ 
										if($(e.target).is('.deleteRow'))
											$(e.target).parent().parent().addClass('deleteRowTr');
									});
		this.DOM.mouseout( function(e)	{ 
										if($(e.target).is('.deleteRow'))
											$(e.target).parent().parent().removeClass('deleteRowTr');
									});


		//simple handlets for the checkboxes:
		this.area.classname.chkClassPublic.bind('change click keyup', function(e){ me.currentClassItem.setPublic($(this).is(":checked")); });
		this.area.classname.chkClassFinal.bind('change click keyup', function(e){ me.currentClassItem.setFinal($(this).is(":checked")); });
		this.area.classname.chkClassAbstract.bind('change click keyup', function(e){ me.currentClassItem.setAbstract($(this).is(":checked")); });
			
		//handle input for the Class Name and Ancestor Name
		this.area.classname.txt.bind('keypress keyup keydown change', function(e){ me.handleNameChange(me, this, e); } );
		this.area.ancestor.txt.bind('keypress keyup keydown change', function(e){ me.handleAncestorChange(me, this, e); } );

		//handle text box changes for the Interfaces / Members / Methods boxes (which each take comma seperated values)
		this.area.interfaces.txt.bind('keypress keyup keydown change', function(e){ me.handleMultiInputChange(me, this, e, true, me.area.interfaces); });
		this.area.methods.txt.bind('keypress keyup keydown change', function(e){ me.handleMultiInputChange(me, this, e, false, me.area.methods); });
		this.area.members.txt.bind('keypress keyup keydown change', function(e){ me.handleMultiInputChange(me, this, e, false, me.area.members); });

		//handle when the return key is pressed on the mutlis
		this.area.interfaces.txt.bind('keydown change', function(e){ if(e.which==13) me.addAll(me.currentClassItem.addInterface, me.area.interfaces.txt); });
		this.area.methods.txt.bind('keydown change', function(e){ if(e.which==13) me.addAll(me.currentClassItem.addMethod, me.area.methods.txt); });
		this.area.members.txt.bind('keydown change', function(e){ if(e.which==13) me.addAll(me.currentClassItem.addMember, me.area.members.txt); });
		
		//handle button presses
		this.area.interfaces.cmd.click(function(e){ me.addAll(me.currentClassItem.addInterface, me.area.interfaces.txt); });
		this.area.methods.cmd.click(function(e){ me.addAll(me.currentClassItem.addMethod, me.area.methods.txt); });
		this.area.members.cmd.click(function(e){ me.addAll(me.currentClassItem.addMember, me.area.members.txt); });

		//handle all the events for the select boxes!
		this.area.members.DOM.change(function(e){ me.handleSelectChange(me, me.currentClassItem.updateMemberByName, e); });
		this.area.methods.DOM.change(function(e){ me.handleSelectChange(me, me.currentClassItem.updateMethodByName, e); });
		
		//handle all the events for any of the editable text areas!
		this.area.interfaces.DOM.mouseup(function(e){ me.handleEditableTextClick(me, e);
													  me.handleDeleteRowClick(me, e, me.currentClassItem.remInterfaceByName); });
		this.area.members.DOM.mouseup(function(e){ me.handleEditableTextClick(me, e); 
													  me.handleDeleteRowClick(me, e, me.currentClassItem.remMemberByName); });
		this.area.methods.DOM.mouseup(function(e){ me.handleEditableTextClick(me, e); 
													  me.handleDeleteRowClick(me, e, me.currentClassItem.remMethodByName); });
			
		//handle all the events for the edit in place text areas
		this.area.interfaces.DOM.bind('keypress keyup keydown change', function(e){ 
			if(e.which==13 && $(e.target).is('.editInPlaceBox'))
				me.handleEditableTextSubmit(me, me.currentClassItem.updateInterfaceByName, e); });
		this.area.members.DOM.bind('keypress keyup keydown change', function(e){ 
			if(e.which==13 && $(e.target).is('.editInPlaceBox'))
				me.handleEditableTextSubmit(me, me.currentClassItem.updateMemberByName, e); });
		this.area.methods.DOM.bind('keypress keyup keydown change', function(e){ 
			if(e.which==13 && $(e.target).is('.editInPlaceBox'))
				me.handleEditableTextSubmit(me, me.currentClassItem.updateMethodByName, e); });
			

		
		//if(e.which==13) me.handleEditableTextSubmit(me, e);
		//	editBox.bind('keypress keyup keydown change', function(e){ me.handleEditableTextChange(me, e); });
	}	

	//takes a text box and makes sure there's no whitespace or double quotes, then returns the value as a string
	removeWhiteSpace(textBox){
		var val = $(textBox).val();
		
		//remove all whitespace if there's any
		if(val.match(/\s/g)!=null && val.match(/\s/g).length>0){
			val = val.replace(/\s/g, "");
			$(textBox).val(val);
		}
		if(val.match(/\"/g)!=null && val.match(/\"/g).length>0){
			val = val.replace(/\"/g, "");
			$(textBox).val(val);
		}

		return val;
	}

	//returns a string of HTML elements description warnings about nameformatting.
	//For instance, class names generally should start with a capitol, not start with a number, etc
	getNameWarnings(strName, classOrInterface=true){

		//a string of HTML to append to:
		var ret='';

		//if it's empty, this will be easy!
		if(strName==''){
			return '<div class="warning">Empty name!</div>';
		}

		//get the first character of the string:
		var firstChar = strName.substr(0, 1);

		if(classOrInterface==true){
			//check if first char is not a letter:
			if(firstChar.match(/[a-zA-Z]/)==null){
				ret += '<div class="warning"><strong>['+strName+']</strong>: The first character "'+
						firstChar+'" is not a letter [a-zA-Z]. This is illegal in most languages.</div>';
			
			//if it is a letter, make sure it's upper case:
			}else if(firstChar.match(/[A-Z]/)==null){
				ret += '<div class="warning"><strong>['+strName+']</strong>: The first character "'+
						firstChar+'" is not uppercase. It is considered good convention in most languages to start a Class / Interface with an uppercase.</div>';
			}

		//if not classOrInterface, rules are slightly different for methods and members...
		}else{
			//check if first char is not a letter:
			if(firstChar.match(/[a-zA-Z_]/)==null){
				ret += '<div class="warning"><strong>['+strName+']</strong>: The first character "'+
						firstChar+'" is not a letter [a-zA-Z] or underscore _. This is illegal in most languages.</div>';
			
			//if it is a letter, make sure it's lowercase case:
			}else if(firstChar.match(/[a-z_]/)==null){
				ret += '<div class="warning"><strong>['+strName+']</strong>: The first character "'+
						firstChar+'" is not lowercase. It may be mistaken for a Class name, which usually start with an uppercase.</div>';
			}

		}//end if classOrInterface

		//now if there are any special characters 
		if(strName.match(/[^0-9a-zA-Z_]/)!=null){
			ret += '<div class="warning"><strong>['+strName+']</strong>: This name contains special characters that may not be available in all languages.</div>';
		}

		//return our warnngs!
		return ret;

	}

	handleNameChange(me, trigger, e){
		//get the value and make sure there's no whitespace:
		var val = me.removeWhiteSpace(trigger);

		//update the info label with any warnings:
		me.area.classname.nfo.html( me.getNameWarnings(val) );

		//if the value is empty we can just use "Untitled"
		if(val=='')
			val='Untitled';

		//update the object (note: warnings are only warnings. If the user enters stupid data, this will generate stupid output!)
		if(me.currentClassItem!=null && !(typeof(me.currentClassItem)==="undefined"))
			me.currentClassItem.setName(val);

	}

	handleAncestorChange(me, trigger, e){
		//get the value and make sure there's no whitespace:
		var val = me.removeWhiteSpace(trigger);

		//update the info label with any warnings:
		if(val=='')
			me.area.ancestor.nfo.html('');
		else
			me.area.ancestor.nfo.html( me.getNameWarnings(val) );

		//update the object (note: warnings are only warnings. If the user enters stupid data, this will generate stupid output!)
		if(me.currentClassItem!=null && !(typeof(me.currentClassItem)==="undefined"))
			me.currentClassItem.setAncestor(val);
	}

	//handle when the comma-seperated value boxes change
	handleMultiInputChange(me, trigger, e, classOrInterface, area){
		//get the value and make sure there's no whitespace:
		var val = me.removeWhiteSpace(trigger);

		//split based on commas and remove empties:
		var items = val.split(',').filter(function(s){ return s!=""; });

		//get warnings for all items
		var allWarnings = '';
		for(var i=0; i<items.length; i++)
			allWarnings += me.getNameWarnings(items[i], classOrInterface);

		//update warning label
		area.nfo.html(allWarnings);
	}

	//call the supplied add method with every item in an array of strings
	addAll(func, txtBox){
		//get the value and make sure there's no whitespace:
		var val = this.removeWhiteSpace(txtBox);

		//split based on commas and remove empties:
		var items = val.split(',').filter(function(s){ return s!=""; });

		//add all items to the object
		for(var i=0; i<items.length; i++)
			func.apply(this.currentClassItem, [items[i]]);

		//definately should rebuild the dom now...
		this.updateDOM();
	}

	// get the details of a table item
	tblItmDetails(elem){
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
	handleSelectChange(me, f, e){

		//get the element that fired the event
		var elem = $(e.target);

		//if a select fired the change event, we can change the value...
		if(elem.is('select')){

			//get details of this table item
			var details = this.tblItmDetails(elem);
			if(details.val==='true') details.val=true;
			if(details.val==='false') details.val=false;

			//now we can update the item
			f.apply(me.currentClassItem, [details.mName, details.propName, details.val]);

		}//endif select
	}

	//when an edit-in-place text field is submitted we need to get its value, update the span, and update our Class Item object
	handleEditableTextSubmit(me, f, e){

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
	handleEditableTextClick(me, e){

		e.preventDefault();

		//get the element that was clicked
		var elem = $(e.target);

		//if it was a span of type "editableTextField" then we can convert the field to a text box:
		if(elem.is('span') && elem.is('.editableTextField')){

			//get the value of the span:
			var val; 
			if(elem.is('.unset'))
				val='';
			else
				val = elem.html();

			//hide the element
			elem.hide();

			//get the container for the element and the new textbox (it's parent)
			var container = elem.parent();

			//create an input box with the same value
			container.append('<input type="text" class="editInPlaceBox" value="'+val+'" style="width:'+(container.width())+'px"/>');
			
			//find and focus the textbox
			var editBox = container.find('input').focus().select();

			//bind an event to the editbox, should be become unfocused, just hide itself and restore the span!
			var dissolveBox = function(e){ editBox.remove(); elem.show(); }
			editBox.blur(dissolveBox);
			editBox.keydown(function(e){ if(e.keyCode==27) dissolveBox(); });


		}//end if is editableTextField span
	}

	//handle when an editable text field is clicked on one of the tables
	handleDeleteRowClick(me, e, f){

		e.preventDefault();

		//get the element that was clicked
		var elem = $(e.target);

		//if it was a span of type "editableTextField" then we can convert the field to a text box:
		if(elem.is('div') && elem.is('.deleteRow')){

			//get details of this table item
			var details = this.tblItmDetails(elem);

			//remove the item from the ClassItem object
			f.apply(me.currentClassItem, [details.mName]);

			//remove the parent tr
			details.row.fadeOut('fast', function(){ $(this).remove(); });

			//if the table has no more TRs then just update the interface
			if(details.table.find('tr').length<=1)
				me.updateDOM();


		}//end if is editableTextField span
	}

	


	//update the editor to be editing a new ClassItem object...
	setClassItem(clsItem){

		//save the new class item:
		this.currentClassItem = clsItem;

		//update the DOM interface to reflect the new class!
		this.updateDOM();
	}

	//clears all fields and dom elements
	clearDOM(){
		this.DOM.find('input').val('');
		this.DOM.find('.infobox').html('');
		this.DOM.find('.entries').html('');
		this.area.classname.chkClassPublic.prop('checked', true);
		this.area.classname.chkClassFinal.prop('checked', false);
		this.area.classname.chkClassAbstract.prop('checked', false);
	}

	//make a select html box for the options
	makeSelect(value, options){
		value = value.toString();
		var ret = '<select>';
		for(var opt in options){
			var text = options[opt];
			ret += '<option value="' + opt + '" ' + ((opt==value)?'selected':'') +' >' + text + '</option>';
		}//next opt
		ret += '</select>';
		return ret;
	}

	//updates the DOM
	updateDOM(){

		//start with a fresh slate...
		this.clearDOM();

		//if there is no current class item, we out!
		if(this.currentClassItem==null || typeof(this.currentClassItem)==="undefined")
			return;

		//update the main class checkboxes
		this.area.classname.chkClassPublic.prop('checked', this.currentClassItem.getPublic());
		this.area.classname.chkClassFinal.prop('checked', this.currentClassItem.getFinal());
		this.area.classname.chkClassAbstract.prop('checked', this.currentClassItem.getAbstract());

		//update the class name box
		this.area.classname.txt.val(this.currentClassItem.getName());

		//only populate this box if data exists:
		if(this.currentClassItem.getAncestor()!=null)
			this.area.ancestor.txt.val(this.currentClassItem.getAncestor());

		//get the interfaces of this item and build a table
		var interfaces = this.currentClassItem.getInterfaces();
		if(interfaces.length>0){
			var tbl = $('<table><tr><td>Implements Interface:</td><td width="0"></td></tr></table>');
			for(var i=0; i<interfaces.length; i++){
				tbl.append('<tr class="tr_' + interfaces[i].mName + '">' +
								'<td class="mName"><span class="editableTextField">'+interfaces[i].mName+'</span></td>' + 
								'<td class="delete"><div class="deleteRow">DEL</div></td>' +
							'</tr>');
			}//next i
			this.area.interfaces.lst.append(tbl);
		}

		//get the members of this item and build a table
		var members = this.currentClassItem.getMembers();
		if(members.length>0){
			var tbl = $('<table>'+
							'<tr>'+
								'<td>Access</td>' + 
								'<td>Static</td>' + 
								'<td>Const/Final</td>' + 
								'<td>Type</td>' + 
								'<td>Name</td>' + 
								'<td>Initial Value</td>' + 
								'<td width="0"></td>' +
							'</tr>'+
						'</table>');
			for(var i=0; i<members.length; i++){
				var m = members[i];
				tbl.append('<tr class="tr_' + m.mName + '">'+
								'<td class="access">' + this.makeSelect(m.access, {0:"private", 1:"public"}) + '</td>' + 
								'<td class="isStatic">' + this.makeSelect(m.isStatic, {false:" - ", true:"static"}) + '</td>' + 
								'<td class="isConst">' + this.makeSelect(m.isConst, {false:" - ", true:"const"}) + '</td>' + 
								'<td class="mType">' + this.makeSelect(m.mType, {1:"int", 2:"short", 3:"long", 4:"byte", 5:"float", 6:"double", 7:"char", 8:"string", 9:"boolean"}) + '</td>' + 
								'<td class="mName"><span class="editableTextField">' + m.mName + '</span></td>' + 
								'<td class="val"><span class="editableTextField ' + ((m.val==null)?'unset':'') + '">' + ((m.val==null)?'&lt;unset&gt;':m.val) + '</span></td>' + 
								'<td class="delete"><div class="deleteRow">DEL</div></td>' +
							'</tr>');
			}//next i
			this.area.members.lst.append(tbl);
		}

		//get the methods of this item and build a table
		var methods = this.currentClassItem.getMethods();
			if(methods.length>0){
			var tbl = $('<table>'+
							'<tr>'+
								'<td>Access</td>' + 
								'<td>Static</td>' + 
								'<td>Final</td>' + 
								'<td>Return Type</td>' + 
								'<td>Name</td>' + 
								'<td>Params</td>' + 
								'<td width="0"></td>' +
							'</tr>'+
						'</table>');
			for(var i=0; i<methods.length; i++){
				var m = methods[i];
				tbl.append('<tr class="tr_' + m.mName + '">'+
								'<td class="access">' + this.makeSelect(m.access, {0:"private", 1:"public"}) + '</td>' + 
								'<td class="isStatic">' + this.makeSelect(m.isStatic, {false:" - ", true:"static"}) + '</td>' + 
								'<td class="isConst">' + this.makeSelect(m.isConst, {false:" - ", true:"const"}) + '</td>' + 
								'<td class="mType">' + this.makeSelect(m.mType, {0: "void", 1:"int", 2:"short", 3:"long", 4:"byte", 5:"float", 6:"double", 7:"char", 8:"string", 9:"boolean"}) + '</td>' + 
								'<td class="mName"><span class="editableTextField">' + m.mName + '</td>' + 
								'<td class="params">' + '()' + '</td>' + 
								'<td class="delete"><div class="deleteRow">DEL</div></td>' +
							'</tr>');
			}//next i
			this.area.methods.lst.append(tbl);
		}


	}

}