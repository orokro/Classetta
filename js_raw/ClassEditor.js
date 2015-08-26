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

		//save the itintial class item:
		this.currentClassItem = clsItem;

		//save reference to our dom
		this.DOM = EditorDOM;

		//start with the basics - lets make the panels toggleable
		this.DOM.find('.toggleBar').click(function(e){

			//get the next toggle wrapper
			var wrapper = $(this).next('.toggleWrapper');

			var headerActivated = this;
			wrapper.toggle("slow", function(){

				if(wrapper.is(':visible'))
					$(headerActivated).text('▼' + $(headerActivated).text().substr(1) );
				else
					$(headerActivated).text('►' + $(headerActivated).text().substr(1) );

			});

		});

		//prevent dragging from messing up selection
		this.DOM.find('.toggleBar').mousedown(function(e){ e.preventDefault(); });


	}


	//update the editor to be editing a new ClassItem object...
	setClassItem(clsItem){

		//save the new class item:
		this.currentClassItem = clsItem;

	}

}