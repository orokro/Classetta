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
        var newItem = new ClassItem(this.ClassItmMgr.classIDCounter++);

        newItem.setName('DemoClass');

        newItem.addInterface("Petable");
        newItem.addInterface("Feedable");
        newItem.addInterface("foo");

        newItem.addMember("aInt");
        newItem.getMemberByName("aInt").mType = INT;
        newItem.getMemberByName("aInt").access = PUBLIC;
        newItem.getMemberByName("aInt").isStatic = true;
        newItem.getMemberByName("aInt").isConst = true;
        newItem.getMemberByName("aInt").val = 123000000;
        newItem.addMember("aShort");
        newItem.getMemberByName("aShort").mType = SHORT;
        newItem.getMemberByName("aShort").access = PUBLIC;
        newItem.getMemberByName("aShort").isStatic = true;
        newItem.getMemberByName("aShort").val = 123000;
        newItem.addMember("aLong");
        newItem.getMemberByName("aLong").mType = LONG;
        newItem.getMemberByName("aLong").access = PUBLIC;
        newItem.getMemberByName("aLong").val = 123000000000;
        newItem.addMember("aByte");
        newItem.getMemberByName("aByte").mType = BYTE;
        newItem.getMemberByName("aByte").val = 123;
        newItem.addMember("aFloat");
        newItem.getMemberByName("aFloat").mType = FLOAT;
        newItem.getMemberByName("aFloat").val = 3.14159;
        newItem.addMember("aDouble");
        newItem.getMemberByName("aDouble").mType = DOUBLE; 
        newItem.getMemberByName("aDouble").val = 3.1415926535897;
        newItem.addMember("aChar");
        newItem.getMemberByName("aChar").mType = CHAR;
        newItem.getMemberByName("aChar").val = 'g';
        newItem.addMember("aString");
        newItem.getMemberByName("aString").mType = STRING;
        newItem.getMemberByName("aString").val = "Design.Class Rules!";
        newItem.addMember("aBoolean");
        newItem.getMemberByName("aBoolean").mType = BOOLEAN;
        newItem.getMemberByName("aBoolean").val = true;

        newItem.addMethod("main");
        newItem.getMethodByName("main").mType = VOID;
        newItem.getMethodByName("main").access = PUBLIC;
        newItem.getMethodByName("main").isStatic = true;
        newItem.getMethodByName("main").isConst = false;
        newItem.getMethodByName("main").params = ["String args[]"];
        newItem.addMethod("foo");
        newItem.getMethodByName("foo").mType = LONG;
        newItem.getMethodByName("foo").access = PRIVATE;
        newItem.getMethodByName("foo").isStatic = false;
        newItem.getMethodByName("foo").isConst = true;
        newItem.getMethodByName("foo").params = ["String args[]"];
        newItem.addMethod("bar");
        newItem.getMethodByName("bar").mType = STRING;
        newItem.getMethodByName("bar").access = PUBLIC;
        newItem.getMethodByName("bar").isStatic = false;
        newItem.getMethodByName("bar").isConst = false;
        newItem.getMethodByName("bar").params = ["String args[]"];

        this.ClassItmMgr.addClassItm(newItem);

        newItem.onChange(function(){ console.log('My object changed!'); });

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