/*
	So, if any object wants to define events it should allow other code to register callback functions for those
	events.

	This CallbackHelperObj just providers a little bit of ulitity to make registering, unregistering, and calling callbacks a bit handier

*/
class CallbackHelperObj {

	constructor(){

		//no call backs registered yet.
		this.callbacks = [];

		//create a counter for unique id's for callbacks
		this.idCounter = 0;

	}

	//register a callback function!
	register(func){

		//get a unique ID for this callback
		var CBID = this.idCounter++;

		//make a new hash with a unique ID and the function:
		var CBHash = 	{
							id: CBID,
							f: func
						};

		//add it to our list
		this.callbacks.push(CBHash);

		//return the unique ID so it can be unregistered in the future...
		return CBID;
	}

	//remove a callback from our list of callbacks:
	unregister(CBID){

		//find it's pos in the array of callbacks
		var arrPos = -1;
		for(var i=0; i<this.callbacks.length; i++){
			if(this.callbacks[i].id==CBID){
				arrPos=i;
				break;
			}
		}//next i

		//if arrPos is still -1, then we didn't find anything to remove ... CBID does not exist or was already removed
		if(arrPos<0) return;

		//now we should just splice the function out:
		var oldFunc = this.callbacks.splice(arrPos, 1);

		//and return the function to the caller!
		return oldFunc;
	}

	//call all the callbacks at once!
	fire(){

		//note: even though no parameters are specified, if parameters are passed they will show up in the "arguments" array
		//we will simplly use the .apply method to find each function with the SAME arguments that were passed to fire()!

		//loop over all callbacks..
		for(var i=0; i<this.callbacks.length; i++){

			//get reference to specific callback:
			var callback = this.callbacks[i].f;

			//call the callback!
			callback.apply(null, arguments);

		}//next i

	}


}

