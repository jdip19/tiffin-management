
// Initialize Firebase (ADD YOUR OWN DATA)
const firebaseConfig = {
    apiKey: "AIzaSyD5SBrei2U0Qro-gm77tY1iOk8w7v0SwcE",
  authDomain: "tiffin-project-6d03d.firebaseapp.com",
  databaseURL: "https://tiffin-project-6d03d-default-rtdb.firebaseio.com",
  projectId: "tiffin-project-6d03d",
  storageBucket: "tiffin-project-6d03d.appspot.com",
  messagingSenderId: "711473057567",
  appId: "1:711473057567:web:22f9c3e614748d290fea2a",


};

firebase.initializeApp(firebaseConfig);
// Reference messages collection
var messagesRef = firebase.database().ref('messages');
var usersRef = firebase.database().ref('users');
// Listen for form submit
document.getElementById('contactForm').addEventListener('submit', submitForm);

// Submit form
async function submitForm(e) {
    e.preventDefault();
    // Get values
    console.log(e)
    var name = document.getElementById("name").value;
    var tiffin = document.getElementById("tiffin").value;
    if (name === null || name == "" || name === undefined || name=="Select") {
        alert("Please select name")
        return
    }
    if (tiffin === null || tiffin == "" || tiffin === undefined || tiffin == "Select") {
        alert("Please select tiffin")
        return
    }
    //take confirmation
    if (!confirm('Are you sure you want to submit?')) {
        return
    }
    

    // Save message
    await saveMessage(name, tiffin);

    // Show alert
    document.querySelector('.alert').style.display = 'block';

    // Hide alert after 3 seconds
    setTimeout(function () {
        document.querySelector('.alert').style.display = 'none';
    }, 3000);

    // Clear form
    document.getElementById('contactForm').reset();
}

// Function to get get form values
function getInputVal(id) {
    return document.getElementById(id).value;
}

// Save message to firebase
async function saveMessage(name, tiffin) {
    var newMessageRef = messagesRef.push();
    newMessageRef.set({
        name: name,
        tiffin: tiffin,
        date: new Date().toISOString().slice(0, 10)
    });
    alert("Tiffin added successfully")
    //location.reload()
    window.location.href = "view.html";
}

function readMessage(DateRange) {
    var currentDate = "2000-01-01"
        if(DateRange === "Today"){
            currentDate = new Date().toISOString().slice(0, 10);
        }else if(DateRange === "LastWeek"){
            currentDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        }
    messagesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        let withDalbhat = 0;
        let withoutDalbhat = 0;
        let total = 0;
        var table = document.getElementById("myTable");
        const numRows = table.rows.length;
        for(let k=1;k<=numRows-2;k++){
            var row = table.deleteRow(1);
        }
        for (let i in data) {

            if(new Date(currentDate)<=new Date(data[i].date)){

            var row = table.insertRow(1);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            cell1.innerHTML = data[i].date;
            cell2.innerHTML = data[i].name;
            cell3.innerHTML = data[i].tiffin;
            total = parseInt(total) + parseInt(data[i].tiffin);

        }


            //Count daily's tiffin
            if (new Date().toISOString().slice(0, 10) == data[i].date && data[i].tiffin == 80) {
                withDalbhat = withDalbhat + 1
            }
            if (new Date().toISOString().slice(0, 10) == data[i].date && data[i].tiffin == 60) {
                withoutDalbhat = withoutDalbhat + 1
            }



        }
        document.getElementById("WithDalbhat").innerHTML = withDalbhat;
        document.getElementById("WithoutDalbhat").innerHTML = withoutDalbhat;
        document.getElementById("total").innerHTML = total;
    });
}

function loadUsers() {
    let Array = ["AKASH MISHRA","DEVDAS KINDERKHEDIYA","HARSH NIRMAL","JAYDIP UPADHAYAY","KULDEEP","PARTH VAMJA","PRSHANT RAI","SAGAR BAGIYA","SANJAY PARMAR","TEJAS CHAUHAN","YASH SAHU","UMANAG SHAH","PREM RAJAK","DARSHIT VAGASHIYA","RISHABH SIYOTE"]
    return messagesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        console.log(data)
        
        for (let i in data) {
            if (Array.indexOf(data[i].name) !== -1 && new Date().toISOString().slice(0, 10) == data[i].date) {
                //alert("Yes, the value exists!")
                Array = Array.filter(element => element !== data[i].name);
            }

        }
        //console.log(Array)
        for (let i = 0; i < Array.length; i++) {
            var option = document.createElement("option");
            option.text = Array[i];
            option.value = Array[i];
            var select = document.getElementById("name");
            select.appendChild(option);

        }


    });
}
function getTotal(value) {
    messagesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        let total = 0;
        let count = 0;
        for (let i in data) {
            //Count daily's tiffin
            if (data[i].name == value) {
                total = parseInt(total) + parseInt(data[i].tiffin);
                count = count + 1
            }
        }
        document.getElementById("indeTotal").innerHTML = total + "<span> (" + count + " Tiffins)</span>";

    });
}
function getAllTotal(fromDate,toDate) {
    messagesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        let total = 0;
        let count = 0;
        for (let i in data) {
            let checkDate = new Date(data[i].date)
            let startDate = new Date(fromDate) 
            let endDate = new Date(toDate)
            //Count daily's tiffin
            if (checkDate.getTime() >= startDate.getTime() && checkDate.getTime() <= endDate.getTime()) {
                total = parseInt(total) + parseInt(data[i].tiffin);
                count = count + 1
            }
        }
        document.getElementById("indeTotal").innerHTML = total + "<span> (" + count + " Tiffins)</span>";

    });
}
function storeInLocal(){
    messagesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        localStorage.setItem("data",JSON.stringify(data))

    });
}

function getTotalInde(value){
    const data = JSON.parse(localStorage.getItem("data"))
    let total = 0;
    let count =0
        for (let i in data) {
            //Count daily's tiffin
            
            if (data[i].name == value ) {
                total = parseInt(total) + parseInt(data[i].tiffin);
                count = count + 1
            }
        }
        return {total:total,count:count};
}

function getTotalIndeWithDate(value,fromDate,toDate){
    const data = JSON.parse(localStorage.getItem("data"))
    let total = 0;
    let count =0
        for (let i in data) {
            //Count daily's tiffin
            let checkDate = new Date(data[i].date)
            let startDate = new Date(fromDate)
            let endDate = new Date(toDate)
            if (checkDate.getTime() >= startDate.getTime() && checkDate.getTime() <= endDate.getTime()){
                if (data[i].name == value ) {
                    total = parseInt(total) + parseInt(data[i].tiffin);
                    count = count + 1
                }
            }
            
        }
        return {total:total,count:count};
}

function loadReport(){
    const data = [
        {
            name:"AKASH MISHRA",
            total:getTotalInde("AKASH MISHRA").total,
            count:getTotalInde("AKASH MISHRA").count
        },
        {
            name:"DEVDAS KINDERKHEDIYA",
            total:getTotalInde("DEVDAS KINDERKHEDIYA").total,
            count:getTotalInde("DEVDAS KINDERKHEDIYA").count

        },
        {
            name:"HARSH NIRMAL",
            total:getTotalInde("HARSH NIRMAL").total,
            count:getTotalInde("HARSH NIRMAL").count

        },
        {
            name:"JAYDIP UPADHAYAY",
            total:getTotalInde("JAYDIP UPADHAYAY").total,
            count:getTotalInde("JAYDIP UPADHAYAY").count

        },
        {
            name:"KULDEEP",
            total:getTotalInde("KULDEEP").total,
            count:getTotalInde("KULDEEP").count

        },
        {
            name:"PARTH VAMJA",
            total:getTotalInde("PARTH VAMJA").total,
            count:getTotalInde("PARTH VAMJA").count

        },
        {
            name:"PRSHANT RAI",
            total:getTotalInde("PRSHANT RAI").total,
            count:getTotalInde("PRSHANT RAI").count

        },
        {
            name:"SAGAR BAGIYA",
            total:getTotalInde("SAGAR BAGIYA").total,
            count:getTotalInde("SAGAR BAGIYA").count

        },
        {
            name:"SANJAY PARMAR",
            total:getTotalInde("SANJAY PARMAR").total,
            count:getTotalInde("SANJAY PARMAR").count

        },
        {
            name:"TEJAS CHAUHAN",
            total:getTotalInde("TEJAS CHAUHAN").total,
            count:getTotalInde("TEJAS CHAUHAN").count

        },
        {
            name:"YASH SAHU",
            total:getTotalInde("YASH SAHU").total,
            count:getTotalInde("YASH SAHU").count

        },
        {
            name:"UMANAG SHAH",
            total:getTotalInde("UMANAG SHAH").total,
            count:getTotalInde("UMANAG SHAH").count

        },
        {
            name:"PREM RAJAK",
            total:getTotalInde("PREM RAJAK").total,
            count:getTotalInde("PREM RAJAK").count

        },
        {
            name:"DARSHIT VAGASHIYA",
            total:getTotalInde("DARSHIT VAGASHIYA").total,
            count:getTotalInde("DARSHIT VAGASHIYA").count

        },
        {
            name:"RISHABH SIYOTE",
            total:getTotalInde("RISHABH SIYOTE").total,
            count:getTotalInde("RISHABH SIYOTE").count

        },
        
    ]
    for (let i in data) 
    {
        var table = document.getElementById("myTable2");
        var row = table.insertRow(1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        cell1.innerHTML = data[i].name;
        cell2.innerHTML = data[i].total;
        cell3.innerHTML = data[i].count;


    }
}

function filter(){
    fromDate = document.getElementById("fromDate").value
    toDate = document.getElementById("toDate").value

    messagesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        localStorage.setItem("data",JSON.stringify(data))

    });
    getAllTotal(fromDate,toDate)
    const data = [
        {
            name:"AKASH MISHRA",
            total:getTotalIndeWithDate("AKASH MISHRA",fromDate,toDate).total,
            count:getTotalIndeWithDate("AKASH MISHRA",fromDate,toDate).count
        },
        {
            name:"DEVDAS KINDERKHEDIYA",
            total:getTotalIndeWithDate("DEVDAS KINDERKHEDIYA",fromDate,toDate).total,
            count:getTotalIndeWithDate("DEVDAS KINDERKHEDIYA",fromDate,toDate).count

        },
        {
            name:"HARSH NIRMAL",
            total:getTotalIndeWithDate("HARSH NIRMAL",fromDate,toDate).total,
            count:getTotalIndeWithDate("HARSH NIRMAL",fromDate,toDate).count

        },
        {
            name:"JAYDIP UPADHAYAY",
            total:getTotalIndeWithDate("JAYDIP UPADHAYAY",fromDate,toDate).total,
            count:getTotalIndeWithDate("JAYDIP UPADHAYAY",fromDate,toDate).count

        },
        {
            name:"KULDEEP",
            total:getTotalIndeWithDate("KULDEEP",fromDate,toDate).total,
            count:getTotalIndeWithDate("KULDEEP",fromDate,toDate).count

        },
        {
            name:"PARTH VAMJA",
            total:getTotalIndeWithDate("PARTH VAMJA",fromDate,toDate).total,
            count:getTotalIndeWithDate("PARTH VAMJA",fromDate,toDate).count

        },
        {
            name:"PRSHANT RAI",
            total:getTotalIndeWithDate("PRSHANT RAI",fromDate,toDate).total,
            count:getTotalIndeWithDate("PRSHANT RAI",fromDate,toDate).count

        },
        {
            name:"SAGAR BAGIYA",
            total:getTotalIndeWithDate("SAGAR BAGIYA",fromDate,toDate).total,
            count:getTotalIndeWithDate("SAGAR BAGIYA",fromDate,toDate).count

        },
        {
            name:"SANJAY PARMAR",
            total:getTotalIndeWithDate("SANJAY PARMAR",fromDate,toDate).total,
            count:getTotalIndeWithDate("SANJAY PARMAR",fromDate,toDate).count

        },
        {
            name:"TEJAS CHAUHAN",
            total:getTotalIndeWithDate("TEJAS CHAUHAN",fromDate,toDate).total,
            count:getTotalIndeWithDate("TEJAS CHAUHAN",fromDate,toDate).count

        },
        {
            name:"YASH SAHU",
            total:getTotalIndeWithDate("YASH SAHU",fromDate,toDate).total,
            count:getTotalIndeWithDate("YASH SAHU",fromDate,toDate).count

        },
        {
            name:"UMANAG SHAH",
            total:getTotalIndeWithDate("UMANAG SHAH",fromDate,toDate).total,
            count:getTotalIndeWithDate("UMANAG SHAH",fromDate,toDate).count

        },
        {
            name:"PREM RAJAK",
            total:getTotalIndeWithDate("PREM RAJAK",fromDate,toDate).total,
            count:getTotalIndeWithDate("PREM RAJAK",fromDate,toDate).count

        },
        {
            name:"DARSHIT VAGASHIYA",
            total:getTotalIndeWithDate("DARSHIT VAGASHIYA",fromDate,toDate).total,
            count:getTotalIndeWithDate("DARSHIT VAGASHIYA",fromDate,toDate).count

        },
        {
            name:"RISHABH SIYOTE",
            total:getTotalIndeWithDate("RISHABH SIYOTE",fromDate,toDate).total,
            count:getTotalIndeWithDate("RISHABH SIYOTE",fromDate,toDate).count

        },
        
    ]
    var table = document.getElementById("myTable2");

    for(let k=1;k<16;k++){
        var row = table.deleteRow(1);
    }

    


    for (let i in data) 
    {
        var table = document.getElementById("myTable2");
        var row = table.insertRow(1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        cell1.innerHTML = data[i].name;
        cell2.innerHTML = data[i].total;
        cell3.innerHTML = data[i].count;


    }
}

