/* 
    This is the main application class for our Class.Design web app.

*/
class ClassDesignApp {

    constructor(){

        //Create and Initialize our TabManager. It expects a reference to the tabs area
        this.TabMgr = new TabManager($('#divTabbedArea'));

    }

    fuck(){
        console.log("fuuucckk");
    }
}