const { classes: Cc, interfaces: Ci, utils: Cu } = Components;
Cu.import('resource://gre/modules/Services.jsm');

var button, menuTop, menuBottom;

function loadIntoWindow(window) {
  menuTop = window.NativeWindow.menu.add({
    name:"To Top",
    callback:function(){
      toTop(window);
    }
  });
  
	menuBottom = window.NativeWindow.menu.add({
		name:"To Bottom",
		callback:function(){
			toBottom(window);
		}
	});
}

function toTop(window){
  var win=window.content
  win.scrollTo(0,0)
}

function toBottom(window){
	var win=window.content
	win.scrollTo(0,win.scrollMaxY)
}

function unloadFromWindow(window) {
  if (!window) return;
  window.NativeWindow.menu.remove(menuTop);
  window.NativeWindow.menu.remove(menuBottom);
}


var windowListener = {
  onOpenWindow: function(aWindow) {
    let domWindow = aWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowInternal || Ci.nsIDOMWindow);
    domWindow.addEventListener("UIReady", function onLoad() {
      domWindow.removeEventListener("UIReady", onLoad, false);
      loadIntoWindow(domWindow);
    }, false);
  },
 
  onCloseWindow: function(aWindow) {},
  onWindowTitleChange: function(aWindow, aTitle) {}
};

function startup(aData, aReason) {
  let windows = Services.wm.getEnumerator("navigator:browser");
  while (windows.hasMoreElements()) {
    let domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);
    loadIntoWindow(domWindow);
  }
  Services.wm.addListener(windowListener);
}

function shutdown(aData, aReason) {
  if (aReason == APP_SHUTDOWN) return;
  Services.wm.removeListener(windowListener);
  let windows = Services.wm.getEnumerator("navigator:browser");
  while (windows.hasMoreElements()) {
    let domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);
    unloadFromWindow(domWindow);
  }
}
