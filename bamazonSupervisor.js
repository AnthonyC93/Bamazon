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
            choices: ['  View Product Sales by Department','  Create New Department',new inquirer.Separator(),'  End Program'],
            message: 'BAMAZON SUPERVISOR:           ',
        }
    ])
    .then(answers=>{
        switch(answers.userChoice){
            case '  View Product Sales by Department':
            salesByDepartment();
            break;
    
            case '  Create New Department':
            newDepartment();
            break;

            case '  End Program':
            connection.end();
            break;
        }
    })
}

function salesByDepartment(){
    let departmentChoices=[];
    let department;

    connection.query("SELECT department_name,COUNT(*) FROM products GROUP BY department_name",function(err,res){
        for(let i=0;i<res.length;i++){
            departmentChoices.push(res[i].department_name)
        }
        inquirer.prompt([
            {   
                name:'department',
                type:'list',
                message:'DEPARTMENT: ',
                choices:departmentChoices
            }
        ])
        .then(answers=>{
            department=answers.department;
            console.log("generating sales for " + department);
            let table1;
            let table2;
    
            //query to make 1st table
            connection.query("SELECT * from departments WHERE department_name=?",[department],function(err,res){
                table1=res;
                console.log("first table")
                //to make 2nd table
                // let totalProfit=
                // [] AS total_profit FROM products;
                connection.query("SELECT SUM(product_sales) AS 'product_sales' FROM products WHERE department_name=?",[department],function(err,res){
                    if(err)throw err;
                    table2=res;
        
                    console.table(table1)
                    console.table(table2)
        
                    //need to join them but no clue how. JOINING is lost on me.
                    askUser();

                    // connection.query('SELECT * FROM  LEFT JOIN '+table2,function(err,res){
                    //     if(err)throw err;
                    //     console.table(res);
                    // });
                });
                
                
                // askUser();
            })
        })

    })

}

function newDepartment(){
    console.log("creating new department");
    inquirer.prompt([
        {
            name:'newDeptName',
            type:'input',
            message:'ENTER NEW DEPARTMENT NAME:   '
        },
        {
            name:'newDeptOverhead',
            type:'input',
            message:'ENTER NEW DEPARTMENT OVERHEAD'
        }
    ])
    .then(answers=>{        
        connection.query('INSERT INTO departments (department_name,over_head_costs) VALUES(?,?)',[answers.newDeptName,answers.newDeptOverhead],function(err,res){
            if(err)throw err;
            askUser();
        })
    })
}
