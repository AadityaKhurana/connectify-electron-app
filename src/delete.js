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
            var br = document.createElement("br");
            db.className = "btn btn-primary dbs"
            var inner_text = document.createTextNode(data.val().name)
            db.appendChild(inner_text)
            db.onclick = function(){
                server_name = db.innerHTML
                if (current_user_email == data.val().owner){
                    confirmation = window.confirm("Are you sure you want to delete "+server_name+"? It will be deleted forever.")
                    if (confirmation == true){
                        remove_ref = firebase.database().ref('server_list/'+data.key)
                        remove_ref.remove()
                        location.href = 'index.html'
                    }
                }
                else{
                    window.alert("You are not a server owner.")
                }
            }
            document.getElementById('servers').appendChild(db)
            document.getElementById('servers').appendChild(br)
        }
        else{}
    }
})