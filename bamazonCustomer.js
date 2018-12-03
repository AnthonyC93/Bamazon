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
});

showCustomerProducts();
// showCustomerProducts();

function showCustomerProducts(){
    connection.query("SELECT id,product_name,price,department_name FROM products",function(err,res){
        if (err) throw err;
        console.log('\n');
        console.table(res);
        buyProduct();
    })
}

function buyProduct(){
    inquirer.prompt([
        /* Pass your questions in here */
        {
            name: 'idChosen',
            type: 'input',
            message: 'ID:       ',
        },
        {
            name: 'numberToBuy',
            type: 'input',
            message: 'QUANTITY: ',
        }
    ])
    .then(answers=>{ 
        let idChosen = answers.idChosen;

        //need to validate input 
        connection.query("SELECT * FROM products WHERE id=?",[idChosen],function(err,res){
            if(err) throw err;
          
            let quantity = res[0].stock_quantity;
            let amountToPurchase=answers.numberToBuy;
            let price = res[0].price;

            if(quantity<=0||answers.numberToBuy>quantity){
                console.log(
                    "----------------------------------"+'\n'+
                    "         NOT ENOUGH STOCK         "+'\n'+
                    "----------------------------------"
                );
                showCustomerProducts();
            }else{
                let newQuantity=quantity-answers.numberToBuy;
                let newSales=parseFloat(amountToPurchase)*parseFloat(price);
                updateProducts("stock_quantity",newQuantity,"id",parseInt(idChosen));
                updateProducts("product_sales",newSales,"id",parseInt(idChosen));
                // updateTable();
                showCustomerProducts();
            }
        })
    })
}

function updateProducts(colToChange,newValue,basedOn,cond){
    // console.log("UPDATING PRODUCTS: "+typeof(col)+" "+typeof(newValue)+" "+typeof(cond1)+' '+typeof(cond2))
    connection.query("UPDATE products SET "+colToChange+"=? WHERE "+basedOn+"=?",[newValue,cond],function(err,res){
        if(err)throw err;
    });
}

function updateTable(tableName,colToChange,newValue,basedOn,cond){
    connection.query("UPDATE "+tableName+" SET "+colToChange+"=? WHERE "+basedOn+"=?",[newValue,cond],function(err,res){
        if(err)throw err;
    });
}
