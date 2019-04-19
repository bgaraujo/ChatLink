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
        id:"",
        chat:""
    };

	_this.init = () => {
        //_this.getPermission();
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
        var starCountRef = firebase.database().ref('chats/'+_this.user.chat+'/messages');
        starCountRef.on('value', function(snapshot) {
            $( "#message_place ul" ).html("");
            let response = snapshot.val();
            for (email in response) {
                var chatClass = "";
                if( response[email].user == _this.user.id )
                    chatClass = "me";
                $( "#message_place ul" ).append( "<li class=\""+chatClass+"\"><span>"+response[email].message+"</span></li>" );
                console.log(response[email].user);
            }
        });
    }
    _this.setMessage = (message) => {
        var date = new Date();
        var timestamp = date.getTime();
        firebase.database().ref("chats/"+_this.user.chat+"/messages").push({
            message:message,
            user:_this.user.id,
            time:timestamp
        }).then(function(params) {
            console.log(params);
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
                _this.user.email = user.email;
                _this.user.id = user.uid;
                //Remove form de login
                $("#panel_login").remove();

                //Add botão de add chat
                _this.menu();

                _this.getChats();


            } else {
                console.log("off");
            }
        });
    }

    _this.getChats = () => {
        var starCountRef = firebase.database().ref('users/'+_this.user.id+'/chats');
        starCountRef.on('value', function(snapshot) {
            let response = snapshot.val();
            for (id in response) {
                $("#chats").append("<li data-chat=\""+response[id].link+"\">"+response[id].link+"</li>");
            }
        });
    }
    //Entra no chat
    $(document).on("click","[data-chat]",function(){
        _this.user.chat = $(this).data("chat");
        $("#chats").hide();
        $("#chat").show();

        _this.getMessages();

    });

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
        if( $("#modal_add_chat").length == 0)
            $("body").append(`<div class="modal fade" id="modal_add_chat" tabindex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 class="modal-title">Adicionar chat</h4>
                        </div>
                        <div class="modal-body">
                            <div class="form-group">
                                <label>Link do chat</label>
                                <input type="text" class="form-control" id="add_chat_link" placeholder="http://...">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" id="modal_add_chat_submit">Salvar</button>
                        </div>
                    </div>
                </div>
            </div>`);
        else
       
      $("#add_chat_link").val("");
      $("#modal_add_chat").modal("show");
    });

    $(document).on("click","#modal_add_chat_submit",function(){
        if($("#add_chat_link").val() != "")
            _this.addChat($("#add_chat_link").val());
    });

    $(document).on("click","#send_message",function(){
        if( $("#input_message").val() != "" )
            _this.setMessage($("#input_message").val());
        $("#input_message").val("");
    });

    _this.addChat = (link) => {
        firebase.database().ref("users/"+_this.user.id+"/chats").push({
            link:link
        }).then(function(params) {
            console.log(params);
            $("#modal_add_chat").modal("hide");
        });
    }
    _this.menu = () =>{
        $(".navbar-right ul").append("<li><a id=\"bar_add_chat\">Adicionar chat</a></li>");
        $(".navbar-right ul").append("<li><a id=\"bar_exit\">Sair</a></li>");
    }
    
    $(document).on("click","#bar_exit",function(){
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
        console.log("saiu");
      }).catch(function(error) {
        // An error happened.
      });
    });
    
    $(document).on("click","#form_cad",function(){
      $("#panel_login").hide();
      $("#panel_cad").show();
    });
    
    _this.getPermission = () => {
        if( Notification.permission != "granted" )
            Notification.requestPermission().then(function(result) {
                if (result === 'denied') {
                    console.log('Permission wasn\'t granted. Allow a retry.');
                    return;
                }
                if (result === 'default') {
                    console.log('The permission request was dismissed.');
                    return;
                }
                // Do something with the granted permission.
            });
    }

	_this.init();
}

$(document).ready(function(){
    myApp();
});