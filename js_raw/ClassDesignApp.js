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

        //create a bunch of code generators for the tabs
        this.codeGenerators = [];
        this.codeGenerators.push( new JavaCodeGenerator(    $('#tabPage_Java')) );
        this.codeGenerators.push( new CSharpCodeGenerator(  $('#tabPage_CSharp')) );
        this.codeGenerators.push( new PythonCodeGenerator(  $('#tabPage_Python')) );
        this.codeGenerators.push( new RubyCodeGenerator(    $('#tabPage_Ruby')) );
        this.codeGenerators.push( new PHPCodeGenerator(     $('#tabPage_PHP')) );
        this.codeGenerators.push( new JSCodeGenerator(      $('#tabPage_JS')) );
        this.codeGenerators.push( new VBCodeGenerator(      $('#tabPage_VB')) );

        //add default item for debugging
        this.ClassItmMgr.addClassItm(demoClasses.Blank());
        this.ClassItmMgr.addClassItm(demoClasses.OnlyMembers());
        this.ClassItmMgr.addClassItm(demoClasses.OnlyConstants());
        this.ClassItmMgr.addClassItm(demoClasses.OnlyStatics());
        this.ClassItmMgr.addClassItm(demoClasses.RoboKitty());
        this.ClassItmMgr.addClassItm(demoClasses.CompleteDemo());
        
        //bind click events for load demo class links
        $('#aLoadThorough').click(function(e){ me.ClassItmMgr.addClassItm(demoClasses.CompleteDemo()); });
        $('#aLoadRoboKitty').click(function(e){ me.ClassItmMgr.addClassItm(demoClasses.RoboKitty()) });
        
        this.TabMgr.setTab('VB');

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

            //otherwise we better update the code sampels!
            me.updateGenerators(newItem);

            //hide the weclome and show the editor screen
            $('#divWelcome').hide();
            $('#divEditor').show();

        }//endif


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


}