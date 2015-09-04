class VB6CodeGenerator extends CodeGenerator {

	constructor(DOM){
		super(DOM);	

		//Make note of language name
		this.langName = "VB6";

		//set up comment styles
		this.singleLineComments = "'";
		this.multiLineComments = { 	  open: '',
									 close: '',
									prefix: "'"	};

		//set up what this class supports:
		//Note: support is assumed by default, so this only has to disable features
		this.features = {
							inheritance: false,
							final: false,
							abstract: false,
							private: false,
							methods: {
										abstract: false,
										final: false,
										static: false,
										protected: false
									 },
							members: {
										final: true,
										static: false,
										protected: false
									 }
						};


		//build the area for the code:
		this.DOM.append("<pre><code class=\"vbscript\"></code></pre>");

		//cache reference to the PRE tag
		this.codeDOM = $(this.DOM.find('code'));

	}

	//builds the code!
	buildCode(item, info){
		var ret = 	this.buildCode_Warnings(item, info) + 
					this.buildCode_Definition(item, info) + 
					this.buildCode_Constants(item, info) + 
					this.buildCode_Members(item, info) +
					this.buildCode_Constructor(item, info) + "\n" +
					this.buildCode_Methods(item, info);

		return ret;
	}

	//build essentially the first line of the class: the defition
	buildCode_Definition(item, info){

		//build the left part that usually looks like "public final class foo"
		var ret = 	this.comment("NOTE: "+this.langName+" doesn't have syntax for definging a class. This code belongs in a file called: \"" + info.name + ".cls\".");

		//if it has interfaces, lets spit em out
		if(info.hasInterfaces){
			for(var i=0; i<info.interfaces.length; i++){
				ret += "Implements " + info.interfaces[i].mName + "\n";
			}//next i

		}
		ret += "\n";

		return ret;

	}

	//build out all the member variables
	buildCode_Constants(item, info){

		var typeToStr = ['Void', 'Integer', 'Integer', 'Long', 'Byte', 'Single', 'Double', 'String', 'String', 'Boolean'];
		var accessToStr = ['Private', 'Public', 'Private'];
		var typeDefaults =  ["Null", 0, 0, 0, 0, '0.0', '0.0', '', '', 'False'];

		//get list of methods
		var items = info.constMembers;
		
		//code to return
		var ret = '';

		if(info.hasConstMembers>0){

			//code to return:
			ret = 	this.comment("Constants") + 
					this.comment("NOTE: In "+this.langName+" Class Constants can only be private.");

			//loop over methods
			for(var i=0; i<items.length; i++){

				//get the method
				var itm = items[i];

				ret += 	'Private Const ' + itm.mName + ' As ' +  typeToStr[parseInt(itm.mType)] + " = ";

				if(itm.val != null){
					switch(parseInt(itm.mType)){
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
							break
					}//swatch
				}else{
					ret += typeDefaults[itm.mType];
				}//has default value

				//apply the new line
				ret += "\n";

			}//next i
			ret += "\n";
		}//endif has constnats

		return ret;
	}

	//build out all the member variables
	buildCode_Members(item, info){

		var typeToStr = ['Void', 'Integer', 'Integer', 'Long', 'Byte', 'Single', 'Double', 'String', 'String', 'Boolean'];
		var accessToStr = ['Private', 'Public', 'Private'];
		var typeDefaults =  ["Null", 0, 0, 0, 0, '0.0', '0.0', '', '', 'False'];

		//get list of methods
		var items = item.getMembers().filter(function(n){ return (n.isConst!=true);});
		
		//code to return
		var ret = '';

		if(items.length>0){

			//code to return:
			ret = 	this.comment("Members");

			//loop over methods
			for(var i=0; i<items.length; i++){

				//get the method
				var itm = items[i];
				ret += 	accessToStr[itm.access] + ' ' + itm.mName + ' As ' +  typeToStr[parseInt(itm.mType)] + "\n"

			}//next i
			ret += "\n";
		}//endif has constnats

		return ret;
	}

	//build a constructor method for the class:
	buildCode_Constructor(item, info){

		var ret=this.comment("Constructor") + 
				this.comment("NOTE: "+this.langName+" Constructors cannot take parameters!") + 
				"Private Sub Class_Initialize()\n";

		//get list of methods
		var items = item.getMembers().filter(function(n){ return (n.isConst!=true && n.val!=null);});
		
		if(items.length>0){

			ret += "\n\t" + this.comment("Intitlize our Member Variables");

			//loop over methods
			for(var i=0; i<items.length; i++){

				//get the method
				var itm = items[i];

				ret += "\t" +itm.mName + ' = ';

				switch(parseInt(itm.mType)){
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
						break
				}//swatch


				//apply the new line
				ret += "\n";
			}//next i
		
		}//has stuff to init
		ret += 	"\n\t'...\n" +
				"End Sub\n";
		return ret;
	}

	//build out all the methods
	buildCode_Methods(item, info){

		var typeToStr = ['Void', 'Integer', 'Integer', 'Long', 'Byte', 'Single', 'Double', 'String', 'String', 'Boolean'];
		var accessToStr = ['Private', 'Public', 'Private'];

		//get list of methods
		var methods = info.methods;

		//code to return
		var ret = '';

		if(info.hasMethods){

			//code to return:
			ret = this.comment("Methods");

			//loop over methods
			for(var i=0; i<methods.length; i++){

				//get the method
				var method = methods[i];

				if(method.mType==VOID)
					ret += 	accessToStr[method.access] + ' Sub ' +
							method.mName + "()\n" + 
							"\t" + this.comment("...") + 
							"End Sub\n\n";
				else
					ret += 	accessToStr[method.access] + ' Function ' +
							method.mName + "() As " + 
							typeToStr[parseInt(method.mType)] + "\n" + 
							"\t" + this.comment("...") + 
							"End Sub\n\n";
			}//next i

		}//endif has methods

		return ret;
	}

}