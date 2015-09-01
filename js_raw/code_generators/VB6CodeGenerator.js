class VB6CodeGenerator extends CodeGenerator {

	constructor(DOM){
		super(DOM);	

		//Make note of language name
		this.langName = "VB6";
		
		//build the area for the code:
		this.DOM.append("<pre><code class=\"vbscript\"></code></pre>");

		//cache reference to the PRE tag
		this.codeDOM = $(this.DOM.find('code'));

	}

	//takes a class item and rebuilds the appropriate source code based on the class item for this language
	update(item){

		//if the item is null, just update with the default comment
		if((typeof(item)==="undefined") || item==null){
			buildDefaultComment();
			return;
		}

		//inspect useful data on our item:
		var info = this.inspect(item);

		//variable to build the code
		var code = 	this.buildCode_Warnings(item, info) + "\n" + 
					this.buildCode_Definition(item, info) + 
					this.buildCode_Constants(item, info) + 
					this.buildCode_Members(item, info) +
					this.buildCode_Constructor(item, info) + "\n" +
					this.buildCode_Methods(item, info);

		//update the code inside the code tag
		this.codeDOM.html(code);

		//apply the code highlighting
		hljs.highlightBlock(this.codeDOM[0]);

	}

	//build the default commenting telling the user to goto the editor tab, etc.
	buildDefaultComment(){
		this.codeDOM.html(	"'Please create a class on the left, and edit it with the Editor tab!\n" + 
							"'<-----" );
	}

	//adds some comments with warnings
	buildCode_Warnings(item){

		var ret = 	"'Warning! The following "+this.langName+" code is automatically generated and may contain errors.\n" + 
					"'Classetta tries to be accurate as possible, but only provides minimal error checking.\n" + 
					"'Garbage In = Garbage Out. Make sure to use proper "+this.langName+" names, legal characters, not reserved words, etc.";
					

		//check for warnings
		if(item.getFinal() && item.getAbstract)
				ret += "\n\n\t'WARNING: you specified this class as both Abstract and Final. That's probably not what you meant.";

		//finish up the comment
		ret += "\n";

		return ret;
	}

	//build essentially the first line of the class: the defition
	buildCode_Definition(item, info){

		//build the left part that usually looks like "public final class foo"
		var ret = 	"'NOTE: VB6 doesn't have syntax for definging a class. This code belongs in a file called: \"" + item.getName() + ".cls\".\n";

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
	buildCode_Constants(item){

		var typeToStr = ['Void', 'Integer', 'Integer', 'Long', 'Byte', 'Single', 'Double', 'String', 'String', 'Boolean'];
		var accessToStr = ['Private', 'Public'];
		var typeDefaults =  ["Null", 0, 0, 0, 0, '0.0', '0.0', '', '', 'False'];

		//get list of methods
		var items = item.getMembers().filter(function(n){ return (n.isConst==true);});
		
		//code to return
		var ret = '';

		if(items.length>0){

			//code to return:
			ret = 	"'Constants\n" + 
					"'NOTE: In VB6 Class Constants can only be private.\n";

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
							ret += itm.val.toString();
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
	buildCode_Members(item){

		var typeToStr = ['Void', 'Integer', 'Integer', 'Long', 'Byte', 'Single', 'Double', 'String', 'String', 'Boolean'];
		var accessToStr = ['Private', 'Public'];
		var typeDefaults =  ["Null", 0, 0, 0, 0, '0.0', '0.0', '', '', 'False'];

		//get list of methods
		var items = item.getMembers().filter(function(n){ return (n.isConst!=true);});
		
		//code to return
		var ret = '';

		if(items.length>0){

			//code to return:
			ret = 	"'Members\n";

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
	buildCode_Constructor(item){

		var ret="' Constructor\n" + 
				"Private Sub Class_Initialize()\n";

		//get list of methods
		var items = item.getMembers().filter(function(n){ return (n.isConst!=true && n.val!=null);});
		
		if(items.length>0){

			ret += "\n\t'Intitlize our Member Variables\n";

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
						ret += itm.val.toString().charAt(0).toUpperCase() + itm.val.toString().slice(1).toLowerCase();
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
	buildCode_Methods(item){

		var typeToStr = ['Void', 'Integer', 'Integer', 'Long', 'Byte', 'Single', 'Double', 'String', 'String', 'Boolean'];
		var accessToStr = ['Private', 'Public'];

		//get list of methods
		var methods = item.getMethods();

		//code to return
		var ret = '';

		if(methods.length>0){

			//code to return:
			ret = "'Methods\n";

			//loop over methods
			for(var i=0; i<methods.length; i++){

				//get the method
				var method = methods[i];

				if(method.mType==VOID)
					ret += 	accessToStr[method.access] + ' Sub ' +
							method.mName + "()\n" + 
							"\t'...\n" + 
							"End Sub\n\n";
				else
					ret += 	accessToStr[method.access] + ' Function ' +
							method.mName + "() As " + 
							typeToStr[parseInt(method.mType)] + "\n" + 
							"\t'...\n" + 
							"End Sub\n\n";
			}//next i

		}//endif has methods

		return ret;
	}

}