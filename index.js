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

    _this.chatUsers = new Array();

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
   
    /**
     * Obtem as mesangem do grupo que estiver
     */
    _this.getMessages = () => {
        var starCountRef = firebase.database().ref('chats/'+_this.user.chat+'/messages');
        starCountRef.on('value', function(snapshot) {
            $( "#message_place" ).html("");
            let response = snapshot.val();
            for (key in response) {
                var chatClass = "";
                var chatUser = "";
                var user = _this.getUserById(response[key].user);

                if( response[key].user == _this.user.id ){
                    chatClass = "me";
                }else{
                    chatUser = "<label style=\"color:"+user.color+"\">"+user.name+" disse:</label>";
                }
                $( "#message_place" ).append( "<li class=\""+chatClass+"\"><span>"+chatUser+"<p>"+response[key].message+"</p></span></li>" );
            }
            $("#div_message_place").scrollTop($("#message_place")[0].offsetHeight);
        });
    }
    /**
     * Salva os usuarios em um array com cores para diferenciar no chat
     */
    _this.getChatUsers = () => {
        var starCountRef = firebase.database().ref('chats/'+_this.user.chat+'/users');
        starCountRef.on('value', function(snapshot) {
            let response = snapshot.val();
            for (key in response) {
                var email = response[key].email.split("@");
                _this.chatUsers.push({
                    id:response[key].id,
                    name:email[0],
                    color:_this.generateColor()
                });
            }
        });
    }

    _this.getUserById = (id) => {
        for( var i = 0; _this.chatUsers.length > i ; i++ ){
            var cUser = _this.chatUsers[i];
            if( cUser.id == id )
                return cUser;
        }
    }

    _this.generateColor = () => {
        var hexadecimais = '0123456789ABCDEF';
        var cor = '#';
      
        // Pega um número aleatório no array acima
        for (var i = 0; i < 6; i++ ) {
        //E concatena à variável cor
            cor += hexadecimais[Math.floor(Math.random() * 16)];
        }
        return cor;
    }

    /**
     * Envia mensagem no grupo que estiver
     */
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

    /**
     * Verifica o login no inicio
     */
    _this.authInit = () => {
        $("#loading").modal("show");
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                _this.user.email = user.email;
                _this.user.id = user.uid;
                //Remove form de login
                $("#panel_login").remove();

                //Add botão de add chat
                _this.menu();
                _this.getChats();

                //Arruma as janelas
                $("[data-user=off]").addClass("hidden");
                $("[data-user=on]").removeClass("hidden");

                $("#loading").modal("hide");
            } else {
                $("#loading").modal("hide");
            }
        });
    }

    /**
     * Obtem as conversas adicionadas
     */
    _this.getChats = () => {
        var starCountRef = firebase.database().ref('users/'+_this.user.id+'/chats');
        starCountRef.on('value', function(snapshot) {
            let response = snapshot.val();
            for (id in response) {
                $("#chats").append("<li data-chat=\""+response[id].link+"\"><span class=\"glyphicon glyphicon-link\" aria-hidden=\"true\"></span>"+atob(response[id].link)+"</li>");
            }
        });
        if(_this.user.chat == ""){
            $("#div_chats").removeClass("visible-md").removeClass("visible-lg").removeClass("visible-sm");
        }
    }
    //Entra no chat
    $(document).on("click","[data-chat]",function(){
        _this.user.chat = $(this).data("chat");

        //$("#chats").hide();
        $("#chat").show();
        $("#div_message_place").removeClass("hidden");
        
        _this.getChatUsers();
        _this.getMessages();

        $("#div_chats").addClass("visible-md").addClass("visible-lg").addClass("visible-sm");;

    });

    /**
     *  Login
     *  obtem os parametros do form e faz login no firebase
     */
    $(document).on("click","#form_login",function(){
        var email = $("#form_email").val();
        var password = $("#form_pass").val();
        
        firebase.auth().
        signInWithEmailAndPassword(email, password).
        then(function(user) {
            
        }).
        catch(function(error) {
            // Handle Errors here.
            
            var errorCode = error.code;
            var errorMessage = error.message;
        });
    });
    /**
     * Cadastro
     */
    $(document).on("click","#form_cad_submit",function(){
        var email = $("#form_cad_email").val();
        var password = $("#form_cad_password").val();

        if(email == ""){
            if( !$(".form_cad_email").hasClass("has-error") )
                $(".form_cad_email").addClass("has-error");

                alert("email obrigatorio");
            return false;
        }else{
            $(".form_cad_email").removeClass("has-error"); 
        }

        if(password.length < 6){
            if( !$(".form_cad_password").hasClass("has-error") )
                $(".form_cad_password").addClass("has-error");

                alert("Sua senha deve ter no minimo 6 caracteres");
            return false;
        }else{
            $(".form_cad_password").removeClass("has-error"); 
        }

        firebase.auth().createUserWithEmailAndPassword(email, password).
        then(function(user) {
            _this.user.id = user.uid;
            _this.user.email = user.email;
            _this.authInit;
        }).
        catch(function(error) {
            switch (error.code) {
                case "auth/invalid-email":
                    if( !$(".form_cad_email").hasClass("has-error") )
                        $(".form_cad_email").addClass("has-error");
                    alert("Email invalido");
                    break;
                case "auth/email-already-in-use":
                    if( !$(".form_cad_email").hasClass("has-error") )
                        $(".form_cad_email").addClass("has-error");
                    alert("Email ja utilizado");
                    break;

                default:
                    break;
            }
            
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

    $(document).on("click","#form_cad_cancel",function(){
        $("#panel_cad").hide();
        $("#panel_login").show();
    });

    $(document).on("click","#send_message",function(){
        if( $("#input_message").val() != "" )
            _this.setMessage($("#input_message").val());
        $("#input_message").val("");
    });

    _this.addChat = (link) => {
        link = btoa(link);
        firebase.database().ref("chats/"+link+"/users").push({
            id:_this.user.id,
            email:_this.user.email
        }).then(function(params) {
            firebase.database().ref("users/"+_this.user.id+"/chats").push({
                link:link
            }).then(function(params) {
                $("#modal_add_chat").modal("hide");
            });
        }).catch(function(e){
            console.log(e);
        });
        
    }
    _this.menu = () =>{
        $(".navbar-right ul").append("<li><a id=\"bar_add_chat\">Adicionar chat</a></li>");
        $(".navbar-right ul").append("<li><a id=\"bar_exit\">Sair</a></li>");
    }
    
    /**
     * Sair
     */
    $(document).on("click","#bar_exit",function(){
      firebase.auth().signOut().
      then(function() {
        location.reload();
      }).
      catch(function(error) {
        //erro  
      });
    });
    
    $(document).on("click","#form_cad",function(){
      $("#panel_login").hide();
      $("#panel_cad").show();
    });

    $(document).on("click","#nav_bar_back",function(){
        $("#div_message_place").addClass("hidden");
        $("#div_chats").removeClass("visible-md").removeClass("visible-lg").removeClass("visible-sm");
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