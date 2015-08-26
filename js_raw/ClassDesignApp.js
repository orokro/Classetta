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

        //add default item for debugging
        this.ClassItmMgr.addClassItm(new ClassItem(this.ClassItmMgr.classIDCounter++));

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

            //hide the editor and show the welcome screen
            $('#divWelcome').hide();
            $('#divEditor').show();

        }//endif
    }


}