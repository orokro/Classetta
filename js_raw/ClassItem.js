/*
	This is the main class file for the ClassItem class

	So.. just to recap, ClassItems don't refer to actual classes in this projects code.
	Rather, ClassItems are the "classes" that the user is building.

*/

//making these constants global because apparently ES6 constants are next-to-useless unless global
const PRIVATE = 0;
const PUBLIC = 1;

const VOID = 0;
const INT = 1;
const SHORT = 2;
const LONG = 3;
const BYTE = 4;
const FLOAT = 5;
const DOUBLE = 6;
const CHAR = 7;
const STRING = 8;
const BOOLEAN = 9;

class ClassItem {

	constructor(ID, initialClassName="Untitled"){


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

	}//constructor(initialClassName);


	getID(){ return this.ID; }
	//setID(ID){ this.ID = ID; } //no setid, id's should be immutable

	//get/set the class name
	getName(){ return this.itmName; }
	setName(n){ this.itmName = n;
				this.eventNameChange.fire(this.itmName); 
				this.eventChange.fire(this); }

	//get/set access
	getPublic(){ return this.isPublic; }
	setPublic(b){ this.isPublic=b; this.eventChange.fire(this);}

	//get/set final
	getFinal(){ return this.isFinal; }
	setFinal(b){ this.isFinal=b; this.eventChange.fire(this);}
	
	//get/set abstract
	getAbstract(){ return this.isAbstract; }
	setAbstract(b){ this.isAbstract=b; this.eventChange.fire(this);}

	//get/set the ancestor
	getAncestor(){ return this.ancestorName; }
	setAncestor(n){ if(n=='')
						this.ancestorName=null;
					else
						this.ancestorName=n;
					this.eventChange.fire(this);
				}

	//interfaces are just strings... so just add / remove strings:
	//getInterfaces(){ return this.interfaces; }
	//addInterface(n){ if(this.interfaces.indexOf(n)<0) this.interfaces.push(n); }
	//remInterface(n){ this.interfaces = this.interfaces.filter(function(i){ return i!=n;}); }

	//get / add / remove / update interfaces
	getInterfaces(){ 	return this.interfaces; }
	addInterface(n){	
						if(typeof(n)=='string')
							n = [n];
						for(var i in n){
							var v = n[i];
							if(this.findByName(this.interfaces, v)===false){
								this.interfaces.push({
												mName: v
											});
								this.eventChange.fire(this);
							}
						}//next i
					}
	remInterfaceByName(n){ 	this.interfaces = this.interfaces.filter(function(i){ return i.mName!==n; });
							this.eventChange.fire(this); }
	getInterfaceByName(n){		return this.interfaces[this.findByName(this.interfaces, n)]; }
	updateInterfaceByName(n, prop, val){	var m = this.interfaces[this.findByName(this.interfaces, n)];

											//make sure the value is a string at least...
											val = val.toString();

											//special logic for names - make sure they fit the rules
											if(prop=='mName'){
												//remove whitespace and quotes
												val = val.replace(/\"/g, "");
												val = val.replace(/\s/g, "");

												if(val=="")
													return;
											}

											if(val=="true") val = true;
											if(val=="false") val = false;

											m[prop] = val;
											this.eventChange.fire(this); }

	//get / add / remove / update members
	getMembers(){ 	return this.members; }

	addMember(n){	if(typeof(n)=='string'){	
						if(this.findByName(this.members, n)===false){
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
					}else if(typeof(n)=='object'){
						if(this.findByName(this.members, n.mName)===false){
							this.members.push(n);
							this.eventChange.fire(this);
						}
					}
				}
	remMemberByName(n){ 	this.members = this.members.filter(function(i){ return i.mName!==n; });
							this.eventChange.fire(this); }
	getMemberByName(n){		return this.members[this.findByName(this.members, n)]; }
	updateMemberByName(n, prop, val){	
										var m = this.members[this.findByName(this.members, n)];

										//make sure the value is a string at least...
										val = val.toString();

										//special logic for name, value, and type changes
										switch(prop){
											case 'mName':
												//remove whitespace and quotes
												val = val.replace(/\"/g, "");
												val = val.replace(/\s/g, "");

												if(val=="")
													return;
												break;

											case 'val':
												if(val=='')
													val=null;
												else
													val = this.filterValueByType(val, parseInt(m.mType));
												break;

											case 'mType':
												//update the value based on the new type:
												if(m.val!=null)
													m.val = this.filterValueByType(m.val.toString(), parseInt(val));
												break;

											default:
												if(val=="true") val = true;
												if(val=="false") val = false;
										}//swatch

										m[prop] = val;
										this.eventChange.fire(this); }

	//get / add / remove / update methods
	getMethods(){ 	return this.methods; }
	addMethod(n){	if(typeof(n)=='string'){
						if(this.findByName(this.methods, n)===false){
						
							this.methods.push({
												mName: n,
												access: PUBLIC,
												isStatic: false,
												isConst: false,
												mType: VOID,
												params: []
											});
						this.eventChange.fire(this);
						}
					}else if(typeof(n)=='object'){
						if(this.findByName(this.methods, n.mName)===false){
							this.methods.push(n);
							this.eventChange.fire(this);
						}
					}


				}
	remMethodByName(n){ 	this.methods = this.methods.filter(function(i){ return i.mName!==n; });
							this.eventChange.fire(this); }
	getMethodByName(n){		return this.methods[this.findByName(this.methods, n)]; }
	updateMethodByName(n, prop, val){	var m = this.methods[this.findByName(this.methods, n)];

										//make sure the value is a string at least...
										val = val.toString();

										//special logic for names - make sure they fit the rules
										if(prop=='mName'){
											//remove whitespace and quotes
											val = val.replace(/\"/g, "");
											val = val.replace(/\s/g, "");

											if(val=="")
												return;
										}

										if(val=="true") val = true;
										if(val=="false") val = false;

										m[prop] = val;
										this.eventChange.fire(this); }

	//given an array finds an item that has a certain name
	findByName(arr, name){
		for(var i=0; i<arr.length; i++){
			if(arr[i].mName==name)
				return i;
		}
		return false;
	}


	//filter a value by it's type
	filterValueByType(val, type){
		switch(type){
			case INT:
			case SHORT:
			case LONG:
			case BYTE:

				//remove whitespace and quotes
				val = val.replace(/\"/g, "");
				val = val.replace(/\s/g, "");

				//check if its a number:
				if(val.match(/[^0-9.]/g) != null)
					val="0";

				//remove anything after the first decimal, if there is one:
				val = val.split('.')[0];
				break;

			case FLOAT:
			case DOUBLE:

				//remove whitespace and quotes
				val = val.replace(/\"/g, "");
				val = val.replace(/\s/g, "");

				//check if its a number:
				if(val.match(/[^0-9.]/g) != null || val=='')
					val="0";

				//remove extranous decimals, if any
				if(val.match(/\./g)!=null){
					if(val.match(/\./g).length>1)
						val = val.split('.')[0] + '.' + val.split('.').splice(1).join('');
				}else
					val += '.0';

				break;

			case CHAR:

				//always just take the first char:
				if(val.length>1)
					val = val.substr(0,1);
				break;

			case BOOLEAN:
				if(val.toLowerCase()=='t') val='true';
				try{
					val = Boolean(JSON.parse(val.toLowerCase()));
				}catch(e){
					val = false;
				}
				break;
		}//swatch

		return val;
	}

	//allow functions to be un/registerd for our name change event
	onNameChange(func){ return this.eventNameChange.register(func); }
	unbindNameChange(id){ return this.eventNameChange.unregister(id); }

	//allow functions to be un/registerd for our general change event
	onChange(func){ return this.eventChange.register(func); }
	unbindChange(id){ return this.eventChange.unregister(id); }

}