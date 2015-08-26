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
		

	}


	//update the editor to be editing a new ClassItem object...
	setClassItem(clsItem){

		//save the new class item:
		this.currentClassItem = clsItem;

	}

}