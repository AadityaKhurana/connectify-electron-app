var server_name = "sample";
var srcData;
function scroll_to_bottom(){
    // var div = document.getElementById('messagelist');
    // $('#messagelist').animate({
    //    scrollTop: div.scrollHeight - div.clientHeight
    // }, 500);
    $('#messagelist').stop().animate({
        scrollTop: $('#messagelist')[0].scrollHeight
      }, 800);
}

$(document).ready(function(){
    $("#message_input").keypress(function(e){ 
        if(e.keyCode==13){
            document.getElementById('send_btn').click()
        }
    }); 
});

var server_list = {}

var db_list = firebase.database().ref('server_list');
db_list.on('child_added', (data) => {
    // console.log(data.key)
    if (data.val().email = firebase.auth().currentUser.email){
        server_list[data.val().name] = data.key
        // console.log(server_list)
    }
})

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function show_div(){
    document.getElementById('messagelist').style.display = "block"
    document.getElementById('msg_input').style.display = "block"
    document.getElementById('select_server_div').style.display = "none"
}


server = firebase.database().ref('server_list')
server.on('child_added', (data) =>{
    member_list = []
    member_list.push(data.val().members.mem1)
    member_list.push(data.val().members.mem2)
    member_list.push(data.val().members.mem3)
    member_list.push(data.val().members.mem4)
    member_list.push(data.val().members.mem5)
    // console.log(member_list)
    current_user_email = firebase.auth().currentUser.email
    var i;
    for(i=0; i<5; i++){
        if (current_user_email == member_list[i]){
            var db = document.createElement("button");
            db.className = "btn btn-primary dbs"
            var inner_text = document.createTextNode(data.val().name)
            db.appendChild(inner_text)
            // db.setAttribute("oncontextmenu", "javascript:right_click(this);return false;")
            db.onclick = function(){
                server_name = db.innerHTML
                chat_div = document.getElementById('messagelist')
                removeAllChildNodes(chat_div)
                sync()
                show_div()
                scroll_to_bottom()
            }
            document.getElementById('servers').appendChild(db)
        }
        else{
        }
    }
})


function submit(){
    var input_msg = document.getElementById('message_input').value
    var d = new Date(); // for now
    hours = d.getHours();
    minutes = d.getMinutes();
    seconds = d.getSeconds();
    date = d.getDate()
    month = d.getMonth()+1
    year = d.getFullYear()
    fulldate = date+':'+month+':'+year
    fulltime = hours+':'+minutes+':'+seconds
    id = server_list[server_name]
    var chat = firebase.database().ref('server_list/'+id+'/chat');
    if (input_msg === ""){
        window.alert("Please enter a Message to send")
    }
    else{
        var new_chat = chat.push();
        new_chat.set({
            name: firebase.auth().currentUser.displayName,
            message: input_msg,
            email: firebase.auth().currentUser.email,
            date: fulldate,
            time: fulltime,
            platform: "connectify"
        })
        document.getElementById('message_input').value = ""
    }
    scroll_to_bottom()
}

function sync(){
    id = server_list[server_name]
    var chat = firebase.database().ref('server_list/'+id+'/chat/');
    chat.on('child_added', (data) => {
        if (data.val().type == undefined){
            var message = document.createElement("div");
            var delete_icon = document.createElement("IMG")
            current_user = firebase.auth().currentUser.email
            if (data.val().email === current_user){
                message.className = 'message own-message'
            }
            else if(data.val().name != undefined){
                message.className = 'message other-message'
            }
            else if(data.val().displayName == undefined){
                message.className = "dont_show"
            }
            var textnode = document.createTextNode(data.val().name + ": " + data.val().message);
            delete_icon.src = "delete_icon.png"
            delete_icon.setAttribute("style", "width: 1vw; margin:1%; float: right")
            delete_icon.setAttribute('onclick', "delete_msg(this)")
            message.setAttribute('id', data.val().date+','+data.val().time)
            if (data.val().email === current_user){
                message.appendChild(delete_icon)
                message.appendChild(textnode);
            }
            else{
                message.appendChild(textnode);
            }
            var message_list = document.getElementById('messagelist')
            message_list.appendChild(message);
        }
        else if (data.val().type == "image"){
            var img_message_div = document.createElement("div")
            var img_message_img = document.createElement("IMG")
            var delete_icon = document.createElement("IMG")
            current_user = firebase.auth().currentUser.email
            if (data.val().email === current_user){
                img_message_div.className = 'message own-message'
                img_message_img.className = "img_message"
            }
            else if(data.val().name != undefined){
                img_message_div.className = 'message other-message'
                img_message_img.className = "img_message"
            }
            else if(data.val().displayName == undefined){
                img_message_div.className = "dont_show"
                img_message_img.className = "img_message"
            }
            img_message_img.src = data.val().base64_string
            img_message_img.setAttribute('onclick','openSnackbar(this)');
            delete_icon.src = "delete_icon.png"
            delete_icon.setAttribute("style", "width: 1vw; margin:1%; float: right")
            delete_icon.setAttribute('onclick', "delete_msg(this)")
            var textnode = document.createTextNode(data.val().name + ": ");
            // text.appendChild(textnode)
            img_message_div.setAttribute('id', data.val().date+','+data.val().time)
            img_message_div.appendChild(textnode)
            if (data.val().email == current_user){
                img_message_div.appendChild(delete_icon)
            }
            img_message_div.appendChild(img_message_img)
            var message_list_1 = document.getElementById('messagelist')
            message_list_1.appendChild(img_message_div)
        }
    });
}


function logout(){
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        window.alert("Logout Succesful")
      }).catch((error) => {
        // An error happened.
        window.alert(error)
      });      
}
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        // location.replace("http://127.0.0.1:5500/index.html")
        // console.log(firebase.auth().currentUser.email)
        
    } else {
        // User is signed out
        // ...
        // location.replace("http://127.0.0.1:5500/usr_or_not.html")
        location.href='usr_or_not.html'
    }
});



function upload_image(){
    // Get Base64 string
    var filesSelected = document.getElementById("file_input").files;
    if (filesSelected.length > 0) {
        var fileToLoad = filesSelected[0];

        var fileReader = new FileReader();

        var d = new Date(); // for now
        hours = d.getHours();
        minutes = d.getMinutes();
        seconds = d.getSeconds();
        date = d.getDate()
        month = d.getMonth()+1
        year = d.getFullYear()
        fulldate = date+':'+month+':'+year
        fulltime = hours+':'+minutes+':'+seconds
        fileReader.onload = function(fileLoadedEvent) {
            srcData = fileLoadedEvent.target.result; // <--- data: base64
            // Upload Base64 string to Realtime Database
            id = server_list[server_name]
            var chat = firebase.database().ref('server_list/'+id+'/chat');
            var new_chat = chat.push();
            new_chat.set({
                type: "image",
                base64_string: srcData,
                name: firebase.auth().currentUser.displayName,
                email: firebase.auth().currentUser.email,
                date: fulldate,
                time: fulltime,
                platform: "connectify"
            })
        }
        fileReader.readAsDataURL(fileToLoad);
    }
    filesSelected = ""
    
    scroll_to_bottom()
    close_popover1()
}

function openDialog() {
  document.getElementById('file_input').click();
}

window.onload=function(){
    document.getElementById('button_input').addEventListener('click', openDialog);
}


function popover1() {
    var x = document.getElementById("snackbar1");
    x.className = "show";
}

function close_popover1(){
    var x = document.getElementById("snackbar1");
    x.className = "xyz";
    file = document.getElementById('file_input')
    file = ""
}

function popover2() {
    var x = document.getElementById("snackbar2");
    x.className = "show";
}

function close_popover2(){
    var x = document.getElementById("snackbar2");
    x.className = "xyz";
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#usr_img')
                .attr('src', e.target.result)
        };

        reader.readAsDataURL(input.files[0]);
    }
    popover1()
}


function openSnackbar(image_src) {
    document.getElementById('usr_img_1').src = image_src.src
    popover2()
}

function delete_msg(input){
    datetime = input.parentNode.id
    id = server_list[server_name]
    var chat = firebase.database().ref('server_list/'+id+'/chat/');
    chat.on('child_added', (data) => {
        db_datetime = data.val().date+','+data.val().time
        if (db_datetime == datetime){
            if (confirm("Are you sure you want to delete the message?")) {
                remove_ref = firebase.database().ref('server_list/'+id+'/chat/'+data.key)
                remove_ref.remove()
                chat_div = document.getElementById('messagelist')
                removeAllChildNodes(chat_div)
                sync()
                scroll_to_bottom()
            } else {}
        }
    })
}

function new_form(){
    server_name = document.getElementById('server_name').value
    var member_list = {}
    var var_chat = {}
    var i;
    for (i = 1; i < 6; i++){
        member = document.getElementById('member'+i).value
        if (member != ""){
            member_list["mem"+i] = member
        }
    }
    var_chat["xyz"] = "value"
    var server_list = firebase.database().ref('server_list');
    new_server = server_list.push();
    new_server.set({
        name: server_name,
        members: member_list,
        chat: var_chat,
        owner: current_user_email
    })
    document.getElementById('member1').value = ""
    document.getElementById('member2').value = ""
    document.getElementById('member3').value = ""
    document.getElementById('member4').value = ""
    document.getElementById('member5').value = ""
    document.getElementById('server_name').value = ""
    location.href = 'index.html'
}
