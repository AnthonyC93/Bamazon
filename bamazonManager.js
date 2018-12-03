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

connection.connect(function(err) {if (err) throw err});

askUser();

function askUser(){   
    inquirer.prompt([
        /* Pass your questions in here */
        {
            name: 'userChoice',
            type: 'list',
            choices: ['  View Products for Sale','  View Low Inventory','  Change Item Inventory','  Add or Remove Product',new inquirer.Separator(),'  End Program'],
            message: 'BAMAZON MANAGER:           ',
        }
    ])
    .then(answers=>{
        switch(answers.userChoice){
            case '  View Products for Sale':
            sortedShowProducts();
            break;
    
            case '  View Low Inventory':
            showLowInventory();
            break;
    
            case '  Change Item Inventory':
            changeInventory2();
            break;
    
            case '  Add or Remove Product':
            addRemoveProduct();
            break;
    
            case '  End Program':
            connection.end();
            break;
        }
    })
}
function showProducts2(sortedBy){
    connection.query('SELECT * FROM products ORDER BY '+sortedBy+' ASC',function(err,res){
        if(err)throw err;
        console.log('\n')
        console.table(res);
        askUser();
    })
}
function sortedShowProducts(){
    inquirer.prompt([
        {
            name:'sortBy',
            message:'SORT BY: ',
            type:'list',
            choices:['  ID','  PRODUCT NAME','  PRICE','  STOCK']
        }
    ])
    .then(answers=>{
        let sortedBy;
        switch(answers.sortBy){
            case '  ID':
            sortedBy='id';
            break;
            case '  PRODUCT NAME':
            sortedBy='product_name';
            break;
            case '  PRICE':
            sortedBy='price';
            break;
            case '  STOCK':
            sortedBy='stock_quantity';
            break;
        }
        connection.query('SELECT * FROM products ORDER BY '+sortedBy+' ASC',function(err,res){
            if(err)throw err;
            console.log('\n')
            console.table(res);
            askUser();
        })
    })
}
function showLowInventory(){
    connection.query("SELECT * FROM products WHERE stock_quantity<5",function(err,res){
        if (err) throw err;
        console.log('\n');
        if (res.length<=0){
            console.log("NO LOW INVENTORY ITEMS\n\n")
        }else{
            console.table(res)
        }
        askUser();
    })
}
function changeInventory2(){
    inquirer.prompt([{type:'list',name:'addOrRemove',choices:['  ADD INVENTORY','  REMOVE INVENTORY'],message:'--------------------'}]).then(answers=>{
        connection.query('SELECT id,product_name,stock_quantity FROM products ORDER BY id',function(err,res){
            if(err)throw(err);
            console.table(res);

            let newQuantity;
            let addOrRemove=answers.addOrRemove;
            
            inquirer.prompt([
                {
                    type: 'input',
                    message:'ITEM ID:  ',
                    name: 'itemId'
                },
                {
                    type:'input',
                    message:'QUANTITY: ',
                    name: 'amountToChange'
                }
            ])
            .then(answers=>{
                connection.query('SELECT stock_quantity FROM products WHERE id=?',[answers.itemId],function(err,res){
                    if (err) throw err;
                
                    let currentStock=res[0].stock_quantity;

                    switch(addOrRemove){

                        case '  ADD INVENTORY':
                            newQuantity=parseInt(answers.amountToChange)+parseInt(currentStock);
                            connection.query("UPDATE products SET stock_quantity=? WHERE id=?",[newQuantity,answers.itemId]);
                            showProducts2('id');
                        break;
                        
                        case '  REMOVE INVENTORY':
                            if(parseInt(answers.amountToChange)<=parseInt(currentStock)){
                                newQuantity=parseInt(currentStock)-parseInt(answers.amountToChange);
                                connection.query("UPDATE products SET stock_quantity=? WHERE id=?",[newQuantity,answers.itemId]);
                                showProducts2('id');
                            }else{
                                console.log("\nERROR: CANNOT REMOVE MORE THAN AVAILABLE\n----------------------------------------------\n");
                                askUser();
                            }
                        break;
                    }
                })
            })
        });
    })
}
function addRemoveProduct(){
    inquirer.prompt([{type:'list',name:'addOrRemove',choices:['  ADD PRODUCT','  REMOVE PRODUCT'],message:'--------------------'}])
    .then(answers=>{
        let addOrRemove=answers.addOrRemove;
        
        if(addOrRemove==='  ADD PRODUCT'){
            inquirer.prompt([
                {
                    name:'productName',
                    type:'input',
                    message:'PRODUCT NAME: '
                },
                {
                    name:'department',
                    type:'input',
                    message:'DEPARTMENT  : '
                },
                {
                    name:'price',
                    type:'input',
                    message:'PRICE       : '
                },
                {
                    name:'stock',
                    type:'input',
                    message:'STOCK       : '
                }
            ])
            .then(answers=>{
                let productName=answers.productName;
                let departmentName=answers.department;   
                let productPrice=answers.price;
                let productStock=answers.stock;
                let isAlreadyDepartment=false;  
    
                //get departmentNames from departments table
                connection.query("SELECT department_name,COUNT(*) FROM departments GROUP BY department_name",function(err,res){
                    let depts=[];
                    for(let i=0;i<res.length;i++){
                        depts.push(res[i].department_name)
                        if(departmentName===res[i].department_name){
                            isAlreadyDepartment=true;
                        }
                    }
    
                    if(isAlreadyDepartment===false){
                        //ASK TO CONFIRM NEW DEPARTMENT
                        inquirer.prompt([{message:'NEW DEPARTMENT NAME ENTERED. CREATE NEW DEPARTMENT?',name:'confirmNewDept',type:'confirm'}])
                        .then(answers=>{
                            if(answers.confirmNewDept===true){
                                //query to add into products table
                                connection.query('INSERT INTO products (product_name,department_name,price,stock_quantity,product_sales) VALUES(?,?,?,?,0)',[productName,departmentName,parseFloat(productPrice),parseInt(productStock)],function(err,res){
                                    if(err)throw err;
                                    newDepartmentNameGiven(departmentName);
                                })
                            }else{
                                console.log(
                                    "----------------------------------"+'\n'+
                                    "PLEASE ENTER VALID DEPARTMENT NAME"+'\n'+
                                    "----------------------------------"
                                );
                                askUser();
                            }
                        })
                    }else{
                          //query to add into products table
                          connection.query('INSERT INTO products (product_name,department_name,price,stock_quantity,product_sales) VALUES(?,?,?,?,0)',[productName,departmentName,parseFloat(productPrice),parseInt(productStock)],function(err,res){
                            if(err)throw err;
                            console.log(
                                "----------------------------------"+'\n'+
                                "         UPDATED PRODUCTS         "+'\n'+
                                "----------------------------------"
                            );
                            askUser();
                        })
                    }
                })
            })
        }else{
            connection.query('SELECT id,product_name FROM products',function(err,res){
                if(err)throw err;
                console.table(res);
    
                inquirer.prompt([
                    {
                        name:'idChosen',
                        type:'input',
                        message:'PRODUCT ID: '
                    }
                ])
                .then(answers=>{
                    connection.query('DELETE FROM products WHERE id=?',[answers.idChosen]);
                    showProducts2('id');
                })
            })
        }
    })

}
function newDepartmentNameGiven(newDeptName){
    inquirer.prompt([
        {
            name:'newDeptOverhead',
            type:'input',
            message:'ENTER NEW DEPARTMENT OVERHEAD'
        }
    ])
    .then(answers=>{        
        connection.query('INSERT INTO departments (department_name,over_head_costs) VALUES(?,?)',[newDeptName,answers.newDeptOverhead],function(err,res){
            if(err)throw err;
            showProducts2('id');
        })
    })
}