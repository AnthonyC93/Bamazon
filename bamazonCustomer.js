var mysql = require('mysql');
var inquirer = require('inquirer');
const cTable = require('console.table');


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    showAllProducts('buy');
    // connection.end();
});

function showAllProducts(buyOrNo){
    connection.query("SELECT * FROM products",function(err,res){
        console.log("gonna show all products");
        if (err) throw err;
        console.log('\n\n');
        console.table(res);
        if(buyOrNo=== 'buy'){
            buyProduct();
        }
    })
}

function buyProduct(){
    console.log("asking product ID")
    inquirer.prompt([
        /* Pass your questions in here */
        {
            name: 'idChosen',
            type: 'input',
            message: 'What is the id of the item you would like to buy?',
        }
    ])
    .then(answers=>{ 
        let idChosen = answers.idChosen;
        console.log(idChosen);

        //dummy proof input 
        connection.query("SELECT * FROM products WHERE id=?",[idChosen],function(err,res){
            if(err) throw err;
            console.log(res);
            let quantity = res[0].stock_quantity;

            if(quantity<=0){
                console.log("not enough stock");
            }else{
                console.log("current stock: "+quantity)
            }
            connection.end();
        })
    })
}

// inquirer.prompt([
//     /* Pass your questions in here */
//     {
//         name: 'userChoice',
//         type: 'list',
//         choices: ['POST AN ITEM','BID ON AN ITEM'],
//         message: 'WHAT WOULD YOU LIKE TO DO?',
//     }
// ])
// .then(answers=>{
//     console.log(answers.userChoice)

//     if(answers.userChoice==='BID ON AN ITEM'){
//         bidItem();
//     }else{
//         postItem();
//     }
// })