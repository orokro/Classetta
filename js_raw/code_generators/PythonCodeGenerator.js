class PythonCodeGenerator extends CodeGenerator {

	constructor(DOM){
		super(DOM);	

		//build the area for the code:
		this.DOM.append("<pre><code class=\"python\"></code></pre>");

		//cache reference to the PRE tag
		this.codeDOM = $(this.DOM.find('code'));

	}

	//takes a class item and rebuilds the appropriate source code based on the class item for this language
	update(item){

		//variable to build the code
		var code = 	this.buildCode_Warnings(item) + "\n" + 
					this.buildCode_Definition(item) +
					this.buildCode_StaticMembers(item) + "\n" + 
					this.buildCode_Constructor(item) +
					this.buildCode_Members(item) + "\n" +
					"\t\t#...\n\n" + 
					this.buildCode_Methods(item);

		//update the code inside the code tag
		this.codeDOM.html(code);

		//apply the code highlighting
		hljs.highlightBlock(this.codeDOM[0]);

	}

	//adds some comments with warnings
	buildCode_Warnings(item){

		var ret = 	"\"\"\"\n" + 
					"\tWarning! The following Python code is automatically generated and may contain errors.\n" + 
					"\tCode.Design tries to be accurate as possible, but only provides minimal error checking.\n" + 
					"\tGarbage In = Garbage Out. Make sure to use proper Python names, legal characters, not reserved words, etc.";

		//check for warnings
		if(item.getFinal())
				ret += "\n\n\tWARNING: you specified this class to be Final. Python does not support Final classes.";
		if(item.getInterfaces().length>0)
				ret += "\n\n\tWARNING: you specified one or more Interfaces. Python does not have native Interface support.";


		//finish up the comment
		ret += "\n\"\"\"";

		return ret;
	}

	//build essentially the first line of the class: the defition
	buildCode_Definition(item){

		//build the left part that usually looks like "public final class foo"
		var ret = 	'class ' + ((item.getPublic())?'':'_') + item.getName(); 

		//if it extends anything, add that here:
		var ancestor = item.getAncestor();
		var hasAncestor = (ancestor!=null && ancestor!='');
		if(hasAncestor)
			ret += '(' + ancestor + ')';

		//add the colon and new line before a possible abstract class definition
		ret += ":\n";

		//if this class is abstract, use the Python ABC thingy
		if(item.getAbstract()){
			ret = "from abc import ABCMeta, abstractmethod\n\n" + ret;
			ret += "\t__metaclass__ = ABCMeta\n";
		}
		return ret;

	}

	//build a constructor method for the class:
	buildCode_Constructor(item){

		var ret="\t# Constructor\n" + 
				"\tdef __init__(self):\n"

		//if the class has an ancestor lets call super in the constructor!
		if(item.getAncestor()!=null && item.getAncestor!="")
			ret += 	"\n\t\t# Call super\n" + 
					"\t\t" + item.getAncestor() + ".__init__(self)\n";
		return ret;
	}

	//in python the static members are declared seperately from the isntance variables, so here a sperate method to do that
	buildCode_StaticMembers(item){

		//get list of members
		var members = item.getMembers();
		
		//code to return
		var ret = '';

		//filter out just static members
		members = members.filter(function(n){ return (n.isStatic==true); });
		
		if(members.length>0){

			//code to return:
			ret = "\n\t# Class Variables (static)\n";

			//loop over methods
			for(var i=0; i<members.length; i++){

				//get the method
				var member = members[i];

				if(member.isStatic){

					ret += "\t" + ((member.access)?'':'_') + member.mName;

					if(member.val != null){
						switch(parseInt(member.mType)){
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
								break
						}//swatch
				
					}else{
						ret += " = None";
					}//endif has default value
				
				//apply the new line
				ret += "\n";

				}//endif static

			}//next i

		}//endif has methods

		return ret;
	}

	//build out all the member variables
	buildCode_Members(item){

		//get list of members
		var members = item.getMembers();
		
		//code to return
		var ret = '';

		if(members.length>0){

			//code to return:
			ret = "\n\t\t# Instance Variables\n";

			//loop over methods
			for(var i=0; i<members.length; i++){

				//get the method
				var member = members[i];

				if(!member.isStatic){

					ret += "\t\tself." + ((member.access)?'':'_') + member.mName;

					if(member.val != null){
						switch(parseInt(member.mType)){
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
								break
						}//swatch
					}else{
						ret += " = None";
					}//endif has default value
				
				//apply the new line
				ret += "\n";

				}//endif not static

			}//next i

		}//endif has methods

		return ret;
	}

	//build out all the methods
	buildCode_Methods(item){

		//get list of methods
		var methods = item.getMethods();

		//code to return
		var ret = '';

		if(methods.length>0){

			//code to return:
			ret = "\t# Methods\n";

			//keep track of static methods as we go...
			var staticMethods = [];

			//loop over methods
			for(var i=0; i<methods.length; i++){

				//get the method
				var method = methods[i];

				ret += 	"\tdef " + ((method.access)?'':'_') + method.mName + "(self):\n" + 
						"\t\t#...\n\n";

				//if it's a static method, save it for later, this is important
				if(method.isStatic)
					staticMethods.push(method);

			}//next i

			//if there were static methods, let's declare them now
			if(staticMethods.length>0){

				ret += "\t# Static Methods\n";
				for(var i=0; i<staticMethods.length; i++)
					ret += "\t" + staticMethods[i].mName + ' = staticmethod(' + staticMethods[i].mName + ')\n';

			}//endif has static

		}//endif has methods

		return ret;
	}

}