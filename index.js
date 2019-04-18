function myApp() {
    const _this = myApp;
    const config = {
        apiKey: "AIzaSyD_iYv7H08I7YhIE7Bb851SElIPkYaiDXE",
        authDomain: "chatlink-136f1.firebaseapp.com",
        databaseURL: "https://chatlink-136f1.firebaseio.com",
        projectId: "chatlink-136f1",
        storageBucket: "chatlink-136f1.appspot.com",
        messagingSenderId: "9805089039"
    };

    _this.user = {
        email:"",
        password:""
    };

	_this.init = () => {
        firebase.initializeApp(config);
        _this.authInit();
	};
   

    _this.save = () => {
        firebase.database().ref("").set({
            user:"",
            message:"",
            datetime:""
        });
    };

    _this.getMessages = () => {
        var starCountRef = firebase.database().ref('/');
        starCountRef.on('value', function(snapshot) {
            let response = snapshot.val();
            for (email in response) {
                console.log(response);
            }
        });
    }
    _this.users = () => {
        var starCountRef = firebase.database().ref('users');
        starCountRef.on('value', function(snapshot) {
            let response = snapshot.val();
            for (email in response) {
                console.log(response);
            }
        });
    }

    _this.authInit = () => {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                //console.log(user.email);
                _this.user.email = user.email;
                $("#panel_login").remove();
                _this.getMessages();


            } else {
                console.log("off");
            }
          });
        
        /*
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
        // ...
        });*/
    }

    $(document).on("click","#form_login",function(){
        var email = $("#form_email").val();
        var password = $("#form_pass").val();
        firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
            console.log(user.user.email);
        }).catch(function(error) {
            // Handle Errors here.
            console.log(error)
            var errorCode = error.code;
            var errorMessage = error.message;
        });
    });

    $(document).on("click","#bar_add_chat",function(){
        
    });

    _this.addChat = () => {
        firebase.database().ref("chats").set({
            
        });
    }
    
    /*
    function getPermission () {
        return new Promise((resolve, reject) => {
            Notification.requestPermission().then(status => {
            updateStatus(status);
            if (status == 'granted') {
                resolve();
            }else{
                reject(status);
            }
        });
    });

    getPermission()
            .then(function(){
                // e quando temos a permissão
                var n = new Notification("Hello!", {
                    // use \n para quebrar linhas
                    body: "Corpo\nda mensagem",
                     // opcional
                    icon: './felipenmoura.jpg'
                });
            }).catch(function(status){
                // permissão negada(ou default)
                console.log('Had no permission!');
                // mostre a mensagem de outra forma
            });
}
    
    
    */

	_this.init();
}

$(document).ready(function(){
    myApp();
});