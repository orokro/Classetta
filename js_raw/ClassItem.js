/*
	This is the main class file for the ClassItem class

	So.. just to recap, ClassItems don't refer to actual classes in this projects code.
	Rather, ClassItems are the "classes" that the user is building.

*/
class ClassItem {

	constructor(ID, initialClassName="Untitled"){

		//save our given id
		this.ID = ID;

		//save our given name (or default)
		this.itmName = initialClassName;

	}//constructor(initialClassName);


	getID(){ return this.ID; }
	//setID(ID){ this.ID = ID; } //no setid, id's should be immutable

	getName(){ return this.itmName; }
	setName(n){ this.itmName = n; }

}