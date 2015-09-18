class PerlCodeGenerator extends CodeGenerator {

	constructor(DOM){
		super(DOM);	

		//Make note of language name
		this.langName = "Perl";

		//set up comment styles
		this.singleLineComments = "# ";
		this.multiLineComments = { 	  open: "=begin comment\n",
									 close: "\n=cut",
									prefix: "\t"	};

		//set up what this class supports:
		//Note: support is assumed by default, so this only has to disable features
		this.features = {
							final: false,
							abstract: false,
							private: false,
							types: false,
							methods: {
										abstract: false,
										final: false,
										static: false,
										private: false,
										protected: false
									 },
							members: {
										final: true,
										static: false,
										private: false,
										protected: false
									 }
						};


		//build the area for the code:
		this.DOM.append("<pre><code class=\"perl\"></code></pre>");

		//cache reference to the PRE tag
		this.codeDOM = $(this.DOM.find('code'));

	}

	//builds the code!
	buildCode(item, info){
		var ret = 	this.buildCode_Warnings(item, info) + 
					this.buildCode_Definition(item, info) + "\n" + 
					this.buildCode_StaticMembers(item, info) + 
					this.buildCode_Constructor(item, info) + "\n" +
					this.buildCode_Methods(item, info) + 
					this.comment("All Packages must end in a true statement") + 
					"1;";

		return ret;
	}

	//build essentially the first line of the class: the defition
	buildCode_Definition(item, info){

		//build the left part that usually looks like "public final class foo"
		var ret = 	this.comment("NOTE: "+this.langName+" doesn't have syntax for definging a class. This code belongs in a file called: \"" + info.name + ".pm\".") + 
					this.comment("ALSO NOTE: Nobody should use Perl for anything, ever.") + 
					"package " + info.name + ";\n\n" + 
					"use strict;\n" + 
					"use warnings;\n";

		//if it has either an ancestor or interfaces:
		if(info.hasAncestor || info.hasInterfaces){
			ret += 	"\n" + this.comment("Ancestors and Interfaces") + 
					"our @ISA = qw(\n";

			//if we have an ancestor, add that now:
			if(info.hasAncestor)
				ret += "\t"+info.ancestor+"\n";

			//if it has interfaces, lets spit em out
			if(info.hasInterfaces){
				for(var i=0; i<info.interfaces.length; i++){
					ret += "\t"+info.interfaces[i].mName+"\n";
				}//next i

			}

			ret += ");"
		}//ancestors or interfaces

		ret += "\n";

		return ret;

	}

	//build out all the static member variables
	buildCode_StaticMembers(item, info){

		var typeDefaults =  ["Null", 0, 0, 0, 0, '0.0', '0.0', '', '', 'False'];

		//get list of methods
		var items = info.staticMembers;
		
		//code to return
		var ret = '';

		if(info.hasStaticMembers>0){

			//code to return:
			ret = 	this.comment("Static Members")

			//loop over methods
			for(var i=0; i<items.length; i++){

				//get the method
				var itm = items[i];

				ret += 	'my ' + itm.mName + " = ";

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
					ret += "undef";
				}//has default value

				//apply the new line
				ret += ";\n";

			}//next i
			ret += "\n";
		}//endif has statics

		return ret;
	}

	//build a constructor method for the class:
	buildCode_Constructor(item, info){

		var ret=this.comment("Constructor") + 
				"sub new {\n" + 
				"\tmy $class = shift;\n\n" + 
				"\tmy $self = {\n";

		ret += this.buildCode_Members(item, info);

		ret += 	"\t};\n\n" + 
				"\tbless($self, $class);\n";

		if(info.hasAncestor)
			ret += 	"\n\t" + this.comment("Call Super Constructor") + 
					"\t$self->SUPER::new();\n";

		ret += "\n}\n";

		return ret;
	}

	//build out all the member variables
	buildCode_Members(item, info){

		var typeDefaults =  ["undef", 0, 0, 0, 0, '0.0', '0.0', '', '', 'False'];

		//get list of methods
		var items = item.getMembers().filter(function(n){ return (n.isStatic!=true);});
		
		//code to return
		var ret = '';

		if(items.length>0){

			//code to return:
			//ret = 	this.comment("Members");

			//loop over methods
			for(var i=0; i<items.length; i++){

				//get the method
				var itm = items[i];
				ret += 	"\t\t" + ((itm.access==PUBLIC)?'':'_') + itm.mName + ' => ';

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
					ret += " = undef"
				}//has default value

				//apply the new line
				ret += ",\n";

			}//next i
			ret += "\n";
		}//endif has constnats

		//remove the last comma:
		ret = ret.split(',');
		ret = ret.splice(0, ret.length-1).join(',') + ret[ret.length-1]

		return ret;
	}

	//build out all the methods
	buildCode_Methods(item, info){

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

				if(method.isStatic==true)
					ret += 	'sub ' + ((method.access==PUBLIC)?'':'_') + method.mName + " {\n" + 
							"\t" + this.comment("...") + 
							"}\n\n";
				else
					ret +=  'sub ' + ((method.access==PUBLIC)?'':'_') + method.mName + " {\n" + 
							"\tmy $self = shift;\n" + 
							"\t" + this.comment("...") + 
							"}\n\n";
			}//next i

		}//endif has methods

		return ret;
	}

	// build out some useful common code structures
	buildExtraSamplesCode(){

		return 	"# Conditionals\nif($someVar==true){\n\t# ...\n}elsif($otherVar>10){\n\t# ...\n}else{\n\t#"+
				" ...\n}\n\n# Switch statements via tinyurl.com/oxrnyq4\nuse Switch;\nswitch ($value) "+
				"{\n\tcase 17         { print \"number 17\"       }\n\tcase \"snipe\"    { print \"a snipe"+
				"\"         }\n\tcase /[a-f]+\/i  { print \"pattern matched\" }\n\tcase [1..10,42] { prin"+
				"t \"in the list\"     }\n\tcase (@array)   { print \"in the array\"    }\n\tcase (%hash)"+
				"    { print \"in the hash\"     }\n\telse            { print \"no case applies\" }\n}\n\n"+
				"# For loop\nfor (my $i=0; $i<10; $i++) {\n\t// ...\n}\n\n# For Each loop via tinyurl.c"+
				"om/qxjg9jg\nmy @items = (\"apple\", \"orange\", \"banana\");\nforeach my $item(@items) {"+
				"\n\tprint \"$item\n\";\n}\n\n# While loops\nwhile(1){\n\t# ...\n}\n\n# Do-while loops\ndo{\n\t# "+
				"...\n}while(1);"+
				"";
	}

}