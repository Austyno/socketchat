// Initialize app
var myApp = new Framework7();
  
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
      swipe: 'left',
    },
    // Add default routes
    routes: [
      {
        path: '/about/',
        url: 'about.html',
      },
    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');


// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
    console.log(e);
})

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="about"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log(e);
})


// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {

    let phoneNum;
if(localStorage.getItem('clientPhone') == null){
    phoneNum = "";
}else{
    phoneNum = JSON.parse(localStorage.getItem('clientPhone'));
    
}
    console.log("Device is ready!");
});




var phoneDiv = document.getElementById('numInput');
var phoneInput = document.getElementById('phoneNumber');
var btn = document.getElementById('regNum');
var listDiv = document.getElementById('list');
var div = document.createElement('div');
var newQueryBtn = document.querySelector('.list');
var li = document.createElement('li');
        

     var socket = io('http://159.89.229.74:9000')
     
     socket.on('reconnect',()=>{
        
        socket.emit('user',phoneNum);
        console.log("socket reconnected");
    })





    socket.on('connect',function(){
        // console.log(phoneNum);
        socket.emit('user',phoneNum);
        socket.emit('getClientOffLineMsg',phoneNum);

    }); 

    if(phoneNum == ""){
        btn.addEventListener('click',()=>{
            phoneNum = phoneInput.value;
            localStorage.setItem('clientPhone',JSON.stringify(phoneNum));

            phoneDiv.style.display = 'none';

           socket.emit('num', phoneNum);
            
        });
        
    }else{
        phoneDiv.style.display = 'none';
        socket.emit('num', phoneNum);
        
    }
    


    socket.on('yourNum',function(phoneNum){
         console.log('my number '+phoneNum);
         
    });

  

   socket.on('yourOflineMsg',(data)=>{
        console.log(data)
            if(data == ""){
                div.innerHTML = "<center><h6>Nothing new from HQ</h6></center>";

            }else{
                for(var i=0; i<data.length;i++){
                    div.innerHTML += `<li><div class="card" style="margin-bottom:10px">
                    <div class="card-header">
                        ${data[i].query}
                    </div> 
                    <div class="card-content">
                        <div class="card-content-inner card-content-padding">
                            <p>${data[i].reply}</p>
                        </div>
                    </div> 
                    <div class="card-footer text-color-green">
                         ${data[i].replyDate}
                    </div>
                </div></li>`;
                }
            }
           
           listDiv.appendChild(div);
   });

   newQueryBtn.addEventListener('click',(e)=>{
       var msg = e.target.innerText;
        var data = {
           query : msg, 
           clientId : phoneNum,
           msgId : generateId()
        }
    //    console.log('msgId '+ generateId());
    //     console.log(msg);
        socket.emit('newquery',data);
       
   });

   socket.on('msgRcvd',(data)=>{

    // app.showPreloader("sending Message ....");
    app.preloader.show();
       setTimeout(function(){
           app.preloader.hide();
           app.dialog.alert(data+ ', Police App');
       },3000)
    console.log(data);

   });

   socket.on('replyFromCallCenter',(data)=>{
       console.log(data);
       div.innerHTML =`<div class="card" style="margin-bottom:40px">
        <div class="card-header"></div> 
        <div class="card-content">
            <div class="card-content-inner card-content-padding">
                <p>${data.replyMsg}</p>
            </div>
        </div> 
        <div class="card-footer text-color-green">
            
        </div>
    </div>`;
    listDiv.appendChild(div);
   })

   //generate uniquie ids 
function generateId(){
	var S4 = function () {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	};
    // return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    return (S4() + S4() + "-" + S4() + "-" + S4() + S4())
}

 

// function telePhoneNum(){
//     var telephoneNumber = cordova.require("cordova/plugin/telephonenumber");
//         telephoneNumber.get(function(result) {
//           console.log("result = " + result);
//       }, function() {
//           console.log("error");
//       });
//   }