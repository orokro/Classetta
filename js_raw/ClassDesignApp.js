/* 
    This is the main application class for our Class.Design web app.

*/
class ClassDesignApp {

    constructor(){

        //so scope will resolve inside callbacks
        var me = this;

        //Create and Initialize our TabManager. It expects a reference to the tabs area
        this.TabMgr = new TabManager($('#divTabbedArea'));

        //Create an Initialize our ClassItemsManager. It expects a reference to the area in the sidebar for the list...
        this.ClassItmMgr = new ClassItemManager($('#divClassListArea'));

        //Keep track of which ClassItem is being worked on, or null if none
        this.currentClassItem = null;

        //Create and Initialize a new ClassEditor. It expects a reference to the current class object, and Editor Tab Page div
        this.Editor = new ClassEditor(this.currentClassItem, $('#divEditor'));

        //we need to bind an event for when the user changes the selected class,
        //so we can update the editor
        this.ClassItmMgr.onSelectionChange(function(o){ me.handleSelectionChange(me, o); });

        //and when the editor edits the selected ClassItem... so we can update the code tabs
        this.ClassItmMgr.onSelectionEdited(function(o){ me.handleSelectionEdited(me, o); });

        //Create a Code style manager so the user can select different colorization styles for their code
        this.CodeStyleMgr = new CodeStyleManager('css/hljs/', $('#divExtraOptionsArea'));

        //add some styles
        this.CodeStyleMgr.addStyle("Atelier Forest Light", 	"atelier-forest.light.css");
        this.CodeStyleMgr.addStyle("Atelier Health Light", 	"atelier-heath.light.css");
        this.CodeStyleMgr.addStyle("Color Brewer",			"color-brewer.css");
        this.CodeStyleMgr.addStyle("HLJS", 					"default.css");
        this.CodeStyleMgr.addStyle("Docco", 				"docco.css");
        this.CodeStyleMgr.addStyle("Google Code", 			"googlecode.css");
        this.CodeStyleMgr.addStyle("Idea", 					"idea.css");
        this.CodeStyleMgr.addStyle("Tomorrow", 				"tomorrow.css");
        this.CodeStyleMgr.addStyle("Visual Studio", 		"vs.css");
        this.CodeStyleMgr.addStyle("X Code", 				"xcode.css");
        
        //select the Google Code style by default
        this.CodeStyleMgr.setSelectedItemByName("Google Code");

        //instantiate the responsive-design helper that swaps out css depending out window size
        this.responsiveHelper = new ResponsiveHelper();
        
        //create a bunch of code generators for the tabs
        this.codeGenerators = [];
        this.codeGenerators.push( new JavaCodeGenerator(    $('#tabPage_Java')) );
        this.codeGenerators.push( new CSharpCodeGenerator(  $('#tabPage_CSharp')) );
        this.codeGenerators.push( new PythonCodeGenerator(  $('#tabPage_Python')) );
        this.codeGenerators.push( new RubyCodeGenerator(    $('#tabPage_Ruby')) );
        this.codeGenerators.push( new PHPCodeGenerator(     $('#tabPage_PHP')) );
        this.codeGenerators.push( new JSCodeGenerator(      $('#tabPage_JS')) );
        this.codeGenerators.push( new VBCodeGenerator(      $('#tabPage_VB')) );
        this.codeGenerators.push( new PerlCodeGenerator(    $('#tabPage_Perl')) );
        this.codeGenerators.push( new CppCodeGenerator(    	$('#tabPage_Cpp')) );
        this.codeGenerators.push( new SwiftCodeGenerator(   $('#tabPage_Swift')) );

        //bind click events for load demo class links
        $('#aLoadThorough').click(function(e){ me.ClassItmMgr.addClassItm(demoClasses.CompleteDemo()); });
        $('#aLoadRoboKitty').click(function(e){ me.ClassItmMgr.addClassItm(demoClasses.RoboKitty()) });

        this.refreshCodeOutput();

        //return;

        //add default item for debugging
        this.ClassItmMgr.addClassItm(demoClasses.Blank());
        this.ClassItmMgr.addClassItm(demoClasses.OnlyMembers());
        this.ClassItmMgr.addClassItm(demoClasses.OnlyConstants());
        this.ClassItmMgr.addClassItm(demoClasses.OnlyStatics());
        this.ClassItmMgr.addClassItm(demoClasses.RoboKitty());
        this.ClassItmMgr.addClassItm(demoClasses.CompleteDemo());

        this.TabMgr.setTab('Cpp');

    }


    //update the app apropriately when the selected ClassItem changes, or becomes null
    handleSelectionChange(me, newItem){

        //update the editor...
        me.Editor.setClassItem(newItem);

        //if the new item is null or undefined, that means no item is selected (e.g. the list was emptied)
        if(typeof(newItem)==="undefined" || newItem==null){

            //hide the editor and show the welcome screen
            $('#divEditor').hide();
            $('#divWelcome').show();

        }else{

            //hide the weclome and show the editor screen
            $('#divWelcome').hide();
            $('#divEditor').show();

        }//endif

        //update the code sampels!
        me.updateGenerators(newItem);
    }

    //update the app appropriately when the selected ClassItem is edited in the editor
    handleSelectionEdited(me, item){
        me.updateGenerators(item);
    }

    //update all the generators (whether or not they need it)
    updateGenerators(item){
        //update each of the code generators!
        for(var g=0; g<this.codeGenerators.length; g++){

            //get the generator
            var generator = this.codeGenerators[g];

            //tell it to update it's class
            generator.update(item);

        }//next g
    }

    //refresh the code genreators!
    refreshCodeOutput(){
    	this.updateGenerators(this.currentClassItem);
    }


}